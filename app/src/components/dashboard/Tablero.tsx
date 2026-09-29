import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { codigoEsencialDeTrabajo, colorParaCategoria } from "../../domain/codigo";
import { COLORES_UI } from "../../domain/constants";
import { Card, Input, SectionTitle, Select } from "../ui/Primitives";
import { SemaforoBadge } from "./SemaforoBadge";

export function Tablero() {
  const trabajos = useAppStore((s) => s.trabajos);
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const irA = useAppStore((s) => s.irA);
  const eliminarTrabajo = useAppStore((s) => s.eliminarTrabajo);
  const ultimoTrabajoCreadoId = useAppStore((s) => s.ultimoTrabajoCreadoId);
  const limpiarUltimoTrabajoCreado = useAppStore((s) => s.limpiarUltimoTrabajoCreado);

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(!!ultimoTrabajoCreadoId);

  useEffect(() => {
    if (!ultimoTrabajoCreadoId) return;
    setMostrarConfirmacion(true);
    const t = setTimeout(() => {
      setMostrarConfirmacion(false);
      limpiarUltimoTrabajoCreado();
    }, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ultimoTrabajoCreadoId]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const filtrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return trabajos.filter((t) => {
      const codigo = codigoEsencialDeTrabajo(t).toLowerCase();
      const coincideTexto = !texto || codigo.includes(texto) || t.clave.toLowerCase().includes(texto);
      const coincideArea = !filtroArea || t.areaCodigo === filtroArea;
      const coincideCategoria = !filtroCategoria || t.categoria === filtroCategoria;
      const coincideEstado = !filtroEstado || t.ficha.estadoActual === filtroEstado;
      return coincideTexto && coincideArea && coincideCategoria && coincideEstado;
    });
  }, [trabajos, busqueda, filtroArea, filtroCategoria, filtroEstado]);

  function manejarEliminar(id: string, codigo: string) {
    if (window.confirm(`¿Eliminar el trabajo "${codigo}"? Esta acción no se puede deshacer.`)) {
      eliminarTrabajo(id);
    }
  }

  return (
    <Card>
      {mostrarConfirmacion && ultimoTrabajoCreadoId && (
        <div
          className="flex items-center justify-between gap-2 rounded-md px-4 py-2.5 mb-4 text-sm"
          style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
        >
          <span>✓ Trabajo guardado exitosamente. Ahora puedes verlo en tu tablero y editarlo cuando lo necesites.</span>
          <button
            className="text-xs underline shrink-0"
            onClick={() => {
              setMostrarConfirmacion(false);
              limpiarUltimoTrabajoCreado();
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      <SectionTitle subtitle={`${filtrados.length} de ${trabajos.length} trabajos`}>Tablero de trabajos</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <Input placeholder="Buscar por código o descripción..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <Select value={filtroArea} onChange={(e) => setFiltroArea(e.target.value)}>
          <option value="">Todas las áreas</option>
          {areas.map((a) => (
            <option key={a.id} value={a.codigo}>
              {a.nombre}
            </option>
          ))}
        </Select>
        <Select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.codigo}>
              {c.nombre}
            </option>
          ))}
        </Select>
        <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="ROJO">Por iniciar</option>
          <option value="AMBAR">En curso</option>
          <option value="VERDE">Concluido</option>
        </Select>
      </div>

      {filtrados.length === 0 ? (
        <p className="text-sm text-ink-soft py-8 text-center">
          No hay trabajos que coincidan. Crea uno nuevo desde "Nuevo trabajo".
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-faint border-b border-line">
                <th className="py-2 pr-4">Código</th>
                <th className="py-2 pr-4">Descripción</th>
                <th className="py-2 pr-4">Categoría</th>
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4">Autor</th>
                <th className="py-2 pr-4">Última edición</th>
                <th className="py-2 pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((t) => {
                const codigo = codigoEsencialDeTrabajo(t);
                const nombreCategoria = categorias.find((c) => c.codigo === t.categoria)?.nombre ?? t.categoria;
                const destacado = t.id === ultimoTrabajoCreadoId;
                return (
                  <tr
                    key={t.id}
                    className={`border-b transition-colors ${destacado ? "animate-pulse" : "hover:bg-paper"}`}
                    style={destacado ? { backgroundColor: "#d1fae5", borderColor: COLORES_UI.exito } : undefined}
                  >
                    <td className="py-2 pr-4 font-mono cursor-pointer" onClick={() => irA("DETALLE", t.id)}>
                      {codigo}
                    </td>
                    <td className="py-2 pr-4 cursor-pointer" onClick={() => irA("DETALLE", t.id)}>
                      {t.clave}
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colorParaCategoria(t.categoria)}`}>
                        {nombreCategoria}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <SemaforoBadge estado={t.ficha.estadoActual} />
                    </td>
                    <td className="py-2 pr-4">{t.autorUltimaEdicion}</td>
                    <td className="py-2 pr-4">{new Date(t.fechaUltimaEdicion).toLocaleDateString("es-MX")}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <button className="text-moss-600 hover:underline text-xs mr-3" onClick={() => irA("DETALLE", t.id)}>
                        Ver / editar
                      </button>
                      <button className="text-terracotta-600 hover:underline text-xs" onClick={() => manejarEliminar(t.id, codigo)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
