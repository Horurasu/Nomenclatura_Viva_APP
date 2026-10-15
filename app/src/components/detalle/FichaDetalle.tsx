import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { asuntoCorreoSugerido, codigoEsencialDeTrabajo } from "../../domain/codigo";
import { CATEGORIA_ICONOS, LIMITE_CLAVE, SEMAFORO_INFO, UBICACION_AYUDA, UBICACION_INFO } from "../../domain/constants";
import type { EstadoSemaforo } from "../../domain/types";
import { Ayuda, BotonApp, Campo, Opcion, Seccion, Selector, clasesBoton } from "../ui/Estilo";
import { SemaforoBadge } from "../dashboard/SemaforoBadge";
import { UbicacionSelector } from "../ui/UbicacionSelector";
import { EscalabilidadView } from "./EscalabilidadView";

const ESTADOS: { estado: EstadoSemaforo; texto: string }[] = [
  { estado: "ROJO", texto: "Todavía no empieza" },
  { estado: "AMBAR", texto: "Se está trabajando" },
  { estado: "VERDE", texto: "Ya se terminó" },
];

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

  const volver = (
    <BotonApp color="blanco" tamano="sm" onClick={() => irA("TABLERO")} className="self-start">
      ← Mis trabajos
    </BotonApp>
  );

  if (!trabajo) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">
        {volver}
        <div className="rounded-2xl bg-white border border-line px-6 py-10 text-center text-sm text-ink-soft">No se encontró este trabajo.</div>
      </div>
    );
  }

  const codigoEsencial = codigoEsencialDeTrabajo(trabajo);
  const areaActual = areas.find((a) => a.codigo === trabajo.areaCodigo);
  const categoriaActual = categorias.find((c) => c.codigo === trabajo.categoria);
  const correoContacto = areaActual?.correoContacto;
  const asunto = asuntoCorreoSugerido(trabajo);

  const cambiar = async (estado: EstadoSemaforo) => {
    if (estado === trabajo.ficha.estadoActual) return;
    await cambiarEstado(trabajo.id, estado, notaCambio || undefined);
    setNotaCambio("");
  };

  const manejarEliminar = async () => {
    if (window.confirm(`¿Eliminar el trabajo "${trabajo.clave}"? Esta acción no se puede deshacer.`)) {
      await eliminarTrabajo(trabajo.id);
      irA("TABLERO");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">
      {volver}

      {/* Identificación del trabajo (informativo, plano) */}
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="shrink-0 w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-3xl">
          {CATEGORIA_ICONOS[trabajo.categoria] ?? "🏷️"}
        </span>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink leading-tight break-words">{trabajo.clave}</h1>
          <p className="font-mono text-sm text-ink-soft break-all mt-0.5">{codigoEsencial}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <SemaforoBadge estado={trabajo.ficha.estadoActual} />
            <span className="text-xs text-ink-faint">
              {categoriaActual?.nombre ?? trabajo.categoria} · Creado el {new Date(trabajo.fechaCreacion).toLocaleDateString("es-MX")} por{" "}
              {trabajo.autorCreacion}
            </span>
          </div>
        </div>
      </div>

      {/* Estado */}
      <Seccion icono="🚦" titulo="¿Cómo va este trabajo?" subtitulo="Toca el estado para cambiarlo.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ESTADOS.map(({ estado, texto }) => (
            <Opcion
              key={estado}
              icono={SEMAFORO_INFO[estado].emoji}
              titulo={SEMAFORO_INFO[estado].etiqueta}
              texto={texto}
              seleccionada={trabajo.ficha.estadoActual === estado}
              onClick={() => cambiar(estado)}
            />
          ))}
        </div>
        <Campo
          etiqueta="Nota para el cambio (opcional)"
          placeholder="Ej. Ya se entregó el primer borrador"
          value={notaCambio}
          onChange={(e) => setNotaCambio(e.target.value)}
          pista="Se guarda junto con el siguiente cambio de estado."
        />
      </Seccion>

      {/* Datos principales */}
      <Seccion icono="✏️" titulo="Datos del trabajo" subtitulo="Si los cambias, el código se actualiza solo.">
        <Campo
          etiqueta="Nombre"
          value={trabajo.clave}
          maxLength={LIMITE_CLAVE}
          onChange={(e) => actualizarTrabajo(trabajo.id, { clave: e.target.value })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Selector etiqueta="Área" value={trabajo.areaCodigo} onChange={(e) => actualizarTrabajo(trabajo.id, { areaCodigo: e.target.value })}>
            {areas.map((a) => (
              <option key={a.id} value={a.codigo}>
                {a.nombre}
              </option>
            ))}
          </Selector>
          <Selector etiqueta="Tipo de trabajo" value={trabajo.categoria} onChange={(e) => actualizarTrabajo(trabajo.id, { categoria: e.target.value })}>
            {categorias.map((c) => (
              <option key={c.id} value={c.codigo}>
                {c.nombre}
              </option>
            ))}
          </Selector>
        </div>
      </Seccion>

      {/* Recorrido */}
      <Seccion icono="🧭" titulo="Recorrido" subtitulo="De dónde viene, qué se hace y qué se entrega.">
        <Campo
          etiqueta="📥 ¿De dónde viene?"
          value={trabajo.ficha.origen}
          onChange={(e) => actualizarTrabajo(trabajo.id, { ficha: { ...trabajo.ficha, origen: e.target.value } })}
        />
        <Campo
          etiqueta="⚙️ ¿Qué se hace?"
          value={trabajo.ficha.accion}
          onChange={(e) => actualizarTrabajo(trabajo.id, { ficha: { ...trabajo.ficha, accion: e.target.value } })}
        />
        <Campo
          etiqueta="📤 ¿Qué se entrega?"
          value={trabajo.ficha.destino}
          onChange={(e) => actualizarTrabajo(trabajo.id, { ficha: { ...trabajo.ficha, destino: e.target.value } })}
        />
      </Seccion>

      {/* Archivos */}
      <Seccion icono="📁" titulo="¿Dónde están los archivos?" subtitulo="La app no guarda tus archivos: solo anota dónde están.">
        <UbicacionSelector
          value={trabajo.ubicacion.tipo}
          onChange={(tipo) => actualizarTrabajo(trabajo.id, { ubicacion: { ...trabajo.ubicacion, tipo } })}
        />
        <Campo
          etiqueta="¿En qué carpeta o lugar exacto?"
          placeholder={`Ej. Documentos/Trabajos-2026/${codigoEsencial}/`}
          value={trabajo.ubicacion.descripcion}
          onChange={(e) => actualizarTrabajo(trabajo.id, { ubicacion: { ...trabajo.ubicacion, descripcion: e.target.value } })}
        />
        <Ayuda titulo={`Cómo organizarlo en “${UBICACION_INFO[trabajo.ubicacion.tipo].etiqueta}”`}>
          <p>{UBICACION_AYUDA[trabajo.ubicacion.tipo](codigoEsencial, trabajo.areaCodigo, trabajo.categoria)}</p>
        </Ayuda>
      </Seccion>

      {/* Opciones menos usadas: plegadas */}
      <Seccion plegable icono="✉️" titulo="Escribir un correo sobre este trabajo" subtitulo="Con el asunto listo para encontrarlo después.">
        <div>
          <p className="text-sm font-semibold text-ink mb-1.5">Asunto sugerido</p>
          <p className="font-mono text-sm bg-app rounded-xl px-4 py-3 text-ink break-all">{asunto}</p>
        </div>
        <a href={`mailto:${correoContacto ?? ""}?subject=${encodeURIComponent(asunto)}`} className={clasesBoton("verde", "md")}>
          ✉️ Abrir mi correo
        </a>
        <p className="text-xs text-ink-soft">
          {correoContacto ? (
            <>
              Se enviará al contacto del área: <strong>{correoContacto}</strong>
            </>
          ) : (
            "Esta área no tiene correo de contacto. Puedes agregarlo en Configuración."
          )}
        </p>
      </Seccion>

      <Seccion plegable icono="🌎" titulo="Compartir fuera de mi área" subtitulo="Ajusta el código si lo usan otras áreas o instituciones.">
        <EscalabilidadView trabajo={trabajo} />
      </Seccion>

      <Seccion plegable icono="🕒" titulo="Historial de cambios" subtitulo={`${trabajo.ficha.historialEstados.length} registro(s)`}>
        <ol className="space-y-3">
          {[...trabajo.ficha.historialEstados].reverse().map((c) => (
            <li key={c.id} className="flex gap-3">
              <span aria-hidden="true" className="shrink-0 w-2 rounded-full bg-sky-200" />
              <div className="min-w-0">
                <SemaforoBadge estado={c.estado} />
                <p className="text-xs text-ink-faint mt-1">
                  {new Date(c.fecha).toLocaleString("es-MX")} · {c.autor}
                </p>
                {c.nota && <p className="text-sm text-ink-soft mt-0.5">{c.nota}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Seccion>

      <Seccion plegable icono="🗑️" titulo="Eliminar este trabajo" subtitulo="Esta acción no se puede deshacer.">
        <p className="text-sm text-ink-soft">
          Se borra el registro de este trabajo en la app. Tus archivos y correos reales no se tocan.
        </p>
        <BotonApp color="rojo" onClick={manejarEliminar}>
          Sí, eliminar este trabajo
        </BotonApp>
      </Seccion>
    </div>
  );
}
