import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { asuntoCorreoSugerido, codigoEsencialDeTrabajo } from "../../domain/codigo";
import { LIMITE_CLAVE, UBICACION_AYUDA } from "../../domain/constants";
import type { EstadoSemaforo } from "../../domain/types";
import { Button, Card, InfoBox, Input, Label, SectionTitle, Select } from "../ui/Primitives";
import { SemaforoBadge } from "../dashboard/SemaforoBadge";
import { UbicacionSelector } from "../ui/UbicacionSelector";
import { EscalabilidadView } from "./EscalabilidadView";

export function FichaDetalle() {
  const trabajoSeleccionadoId = useAppStore((s) => s.trabajoSeleccionadoId);
  const trabajos = useAppStore((s) => s.trabajos);
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const actualizarTrabajo = useAppStore((s) => s.actualizarTrabajo);
  const cambiarEstado = useAppStore((s) => s.cambiarEstado);
  const eliminarTrabajo = useAppStore((s) => s.eliminarTrabajo);
  const irA = useAppStore((s) => s.irA);

  const trabajo = trabajos.find((t) => t.id === trabajoSeleccionadoId);
  const [notaCambio, setNotaCambio] = useState("");

  if (!trabajo) {
    return (
      <Card>
        <p className="text-sm text-slate-500">
          No se encontró el trabajo.{" "}
          <button className="text-emerald-600 underline" onClick={() => irA("TABLERO")}>
            Volver al tablero
          </button>
        </p>
      </Card>
    );
  }

  const codigoEsencial = codigoEsencialDeTrabajo(trabajo);
  const areaActual = areas.find((a) => a.codigo === trabajo.areaCodigo);
  const correoContacto = areaActual?.correoContacto;
  const asunto = asuntoCorreoSugerido(trabajo);

  const cambiar = async (estado: EstadoSemaforo) => {
    await cambiarEstado(trabajo.id, estado, notaCambio || undefined);
    setNotaCambio("");
  };

  const manejarEliminar = async () => {
    if (window.confirm(`¿Eliminar el trabajo "${codigoEsencial}"? Esta acción no se puede deshacer.`)) {
      await eliminarTrabajo(trabajo.id);
      irA("TABLERO");
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-400">
        <button className="hover:underline" onClick={() => irA("TABLERO")}>
          Tablero
        </button>{" "}
        › {codigoEsencial}
      </p>

      <Card>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-slate-400 font-mono">{codigoEsencial}</p>
            <h2 className="text-xl font-semibold text-slate-900">{trabajo.clave}</h2>
          </div>
          <SemaforoBadge estado={trabajo.ficha.estadoActual} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Input
            placeholder="Nota del cambio de estado (opcional)"
            value={notaCambio}
            onChange={(e) => setNotaCambio(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
          <Button variant="danger" onClick={() => cambiar("ROJO")}>
            🔴 Por iniciar
          </Button>
          <Button variant="secondary" onClick={() => cambiar("AMBAR")}>
            🟡 En curso
          </Button>
          <Button onClick={() => cambiar("VERDE")}>🟢 Concluido</Button>
        </div>
      </Card>

      <Card>
        <SectionTitle subtitle="Si cambias el área, categoría o clave, el código se vuelve a armar solo.">Identidad del trabajo</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Área</Label>
            <Select value={trabajo.areaCodigo} onChange={(e) => actualizarTrabajo(trabajo.id, { areaCodigo: e.target.value })}>
              {areas.map((a) => (
                <option key={a.id} value={a.codigo}>
                  {a.nombre} ({a.codigo})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Categoría</Label>
            <Select value={trabajo.categoria} onChange={(e) => actualizarTrabajo(trabajo.id, { categoria: e.target.value })}>
              {categorias.map((c) => (
                <option key={c.id} value={c.codigo}>
                  {c.nombre} ({c.codigo})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Clave</Label>
            <Input
              value={trabajo.clave}
              maxLength={LIMITE_CLAVE}
              onChange={(e) => actualizarTrabajo(trabajo.id, { clave: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>¿Cómo fluye este trabajo?</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-slate-200 rounded-lg p-3">
            <Label>📥 De dónde viene (origen)</Label>
            <Input
              value={trabajo.ficha.origen}
              onChange={(e) => actualizarTrabajo(trabajo.id, { ficha: { ...trabajo.ficha, origen: e.target.value } })}
            />
          </div>
          <div className="border border-slate-200 rounded-lg p-3">
            <Label>⚙️ Acción</Label>
            <Input
              value={trabajo.ficha.accion}
              onChange={(e) => actualizarTrabajo(trabajo.id, { ficha: { ...trabajo.ficha, accion: e.target.value } })}
            />
          </div>
          <div className="border border-slate-200 rounded-lg p-3">
            <Label>📤 A dónde va (destino)</Label>
            <Input
              value={trabajo.ficha.destino}
              onChange={(e) => actualizarTrabajo(trabajo.id, { ficha: { ...trabajo.ficha, destino: e.target.value } })}
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>¿Dónde está el documento real?</SectionTitle>
        <UbicacionSelector
          value={trabajo.ubicacion.tipo}
          onChange={(tipo) => actualizarTrabajo(trabajo.id, { ubicacion: { ...trabajo.ubicacion, tipo } })}
        />
        <div className="mt-3">
          <Label>Descripción</Label>
          <Input
            value={trabajo.ubicacion.descripcion}
            onChange={(e) => actualizarTrabajo(trabajo.id, { ubicacion: { ...trabajo.ubicacion, descripcion: e.target.value } })}
          />
        </div>
        <div className="mt-3">
          <InfoBox tono="warning">{UBICACION_AYUDA[trabajo.ubicacion.tipo](codigoEsencial, trabajo.areaCodigo, trabajo.categoria)}</InfoBox>
        </div>
      </Card>

      <Card>
        <SectionTitle subtitle="Usa este texto como asunto en tus correos sobre este trabajo, así cualquiera puede buscarlo y encontrar el hilo completo.">
          Correo y trazabilidad
        </SectionTitle>
        <div className="space-y-2">
          <div>
            <Label>Asunto sugerido</Label>
            <p className="font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">{asunto}</p>
          </div>
          {correoContacto && (
            <p className="text-sm text-slate-600">
              Contacto del área: <a className="text-emerald-600 underline" href={`mailto:${correoContacto}`}>{correoContacto}</a>
            </p>
          )}
          <a
            href={`mailto:${correoContacto ?? ""}?subject=${encodeURIComponent(asunto)}`}
            className="inline-block px-4 py-2 rounded-lg font-medium text-sm bg-emerald-600 text-white hover:bg-emerald-700"
          >
            ✉️ Redactar correo sobre este trabajo
          </a>
          {!correoContacto && (
            <p className="text-xs text-slate-400">
              El área no tiene correo de contacto configurado — agrégalo desde Configuración para que se rellene solo.
            </p>
          )}
        </div>
      </Card>

      <Card>
        <SectionTitle subtitle="El código crece hacia afuera sin tocar el núcleo.">Escalabilidad del código</SectionTitle>
        <EscalabilidadView trabajo={trabajo} />
      </Card>

      <Card>
        <SectionTitle>Historial de estados</SectionTitle>
        <ul className="space-y-2">
          {[...trabajo.ficha.historialEstados].reverse().map((c) => (
            <li key={c.id} className="text-sm border-l-2 border-emerald-500 pl-3">
              <SemaforoBadge estado={c.estado} />
              <span className="text-slate-500 ml-2">
                {new Date(c.fecha).toLocaleString("es-MX")} · {c.autor}
              </span>
              {c.nota && <p className="text-slate-600 mt-0.5">{c.nota}</p>}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-red-200">
        <SectionTitle subtitle="Esta acción no se puede deshacer.">Eliminar este trabajo</SectionTitle>
        <Button variant="danger" onClick={manejarEliminar}>
          Eliminar trabajo
        </Button>
      </Card>
    </div>
  );
}
