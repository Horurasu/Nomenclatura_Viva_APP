import { useMemo, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { codigoEsencialDeTrabajo } from "../../domain/codigo";
import { Card, Input, SectionTitle, Select } from "../ui/Primitives";
import { SemaforoBadge } from "./SemaforoBadge";

export function Tablero() {
  const trabajos = useAppStore((s) => s.trabajos);
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const irA = useAppStore((s) => s.irA);
  const eliminarTrabajo = useAppStore((s) => s.eliminarTrabajo);

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
        <p className="text-sm text-slate-500 py-8 text-center">
          No hay trabajos que coincidan. Crea uno nuevo desde "Nuevo trabajo".
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-4">Código</th>
                <th className="py-2 pr-4">Descripción</th>
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4">Autor</th>
                <th className="py-2 pr-4">Última edición</th>
                <th className="py-2 pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((t) => {
                const codigo = codigoEsencialDeTrabajo(t);
                return (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 pr-4 font-mono cursor-pointer" onClick={() => irA("DETALLE", t.id)}>
                      {codigo}
                    </td>
                    <td className="py-2 pr-4 cursor-pointer" onClick={() => irA("DETALLE", t.id)}>
                      {t.clave}
                    </td>
                    <td className="py-2 pr-4">
                      <SemaforoBadge estado={t.ficha.estadoActual} />
                    </td>
                    <td className="py-2 pr-4">{t.autorUltimaEdicion}</td>
                    <td className="py-2 pr-4">{new Date(t.fechaUltimaEdicion).toLocaleDateString("es-MX")}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <button className="text-emerald-600 hover:underline text-xs mr-3" onClick={() => irA("DETALLE", t.id)}>
                        Ver / editar
                      </button>
                      <button className="text-red-600 hover:underline text-xs" onClick={() => manejarEliminar(t.id, codigo)}>
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
