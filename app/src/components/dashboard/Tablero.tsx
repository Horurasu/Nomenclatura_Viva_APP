import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { codigoDeTrabajo } from "../../domain/codigo";
import { CATEGORIA_ICONOS, SEMAFORO_INFO } from "../../domain/constants";
import type { EstadoSemaforo, Trabajo } from "../../domain/types";
import { Aviso, BotonApp, Campo, EncabezadoPantalla, Pastilla, Pestanas, Selector } from "../ui/Estilo";
import { SemaforoBadge } from "./SemaforoBadge";

type FiltroEstado = EstadoSemaforo | "TODOS";
type FiltroFecha = "TODAS" | "HOY" | "7" | "30";
type Orden = "RECIENTES" | "ANTIGUOS";

const FECHAS: { valor: FiltroFecha; etiqueta: string; dias?: number }[] = [
  { valor: "TODAS", etiqueta: "Cualquier fecha" },
  { valor: "HOY", etiqueta: "Hoy", dias: 0 },
  { valor: "7", etiqueta: "Últimos 7 días", dias: 7 },
  { valor: "30", etiqueta: "Últimos 30 días", dias: 30 },
];

// Días completos entre hoy y la fecha (0 = hoy, 1 = ayer…).
function diasDesde(iso: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dia = new Date(iso);
  dia.setHours(0, 0, 0, 0);
  return Math.round((hoy.getTime() - dia.getTime()) / 86_400_000);
}

function grupoDeFecha(iso: string): string {
  const d = diasDesde(iso);
  if (d <= 0) return "Hoy";
  if (d === 1) return "Ayer";
  if (d < 7) return "Esta semana";
  if (d < 30) return "Este mes";
  return "Anteriores";
}

export function Tablero() {
  const trabajos = useAppStore((s) => s.trabajos);
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const irA = useAppStore((s) => s.irA);
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
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("TODOS");
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>("TODAS");
  const [orden, setOrden] = useState<Orden>("RECIENTES");
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [verFiltros, setVerFiltros] = useState(false);

  // Filtros del panel (no cuentan el buscador ni las pestañas, que ya están a la vista).
  const filtrosActivos = [filtroFecha !== "TODAS", orden !== "RECIENTES", !!filtroArea, !!filtroCategoria].filter(Boolean).length;
  const hayFiltros = filtrosActivos > 0 || !!busqueda || filtroEstado !== "TODOS";

  function quitarFiltros() {
    setBusqueda("");
    setFiltroEstado("TODOS");
    setFiltroFecha("TODAS");
    setOrden("RECIENTES");
    setFiltroArea("");
    setFiltroCategoria("");
  }

  // Todo excepto el estado: así las pestañas muestran cuántos hay de cada uno con los demás filtros.
  const sinFiltroDeEstado = useMemo(() => {
    const texto = busqueda.toLowerCase();
    const dias = FECHAS.find((f) => f.valor === filtroFecha)?.dias;
    return trabajos.filter((t) => {
      const codigo = codigoDeTrabajo(t).toLowerCase();
      return (
        (!texto || codigo.includes(texto) || t.clave.toLowerCase().includes(texto)) &&
        (!filtroArea || t.areaCodigo === filtroArea) &&
        (!filtroCategoria || t.categoria === filtroCategoria) &&
        (dias === undefined || diasDesde(t.fechaUltimaEdicion) <= dias)
      );
    });
  }, [trabajos, busqueda, filtroArea, filtroCategoria, filtroFecha]);

  const filtrados = useMemo(() => {
    const lista = sinFiltroDeEstado.filter((t) => filtroEstado === "TODOS" || t.ficha.estadoActual === filtroEstado);
    return lista.sort((a, b) =>
      orden === "RECIENTES"
        ? b.fechaUltimaEdicion.localeCompare(a.fechaUltimaEdicion)
        : a.fechaUltimaEdicion.localeCompare(b.fechaUltimaEdicion),
    );
  }, [sinFiltroDeEstado, filtroEstado, orden]);

  // Agrupa la lista ya ordenada por "Hoy", "Ayer", "Esta semana"…
  const grupos = useMemo(() => {
    const resultado: { titulo: string; trabajos: Trabajo[] }[] = [];
    for (const t of filtrados) {
      const titulo = grupoDeFecha(t.fechaUltimaEdicion);
      const ultimo = resultado[resultado.length - 1];
      if (ultimo && ultimo.titulo === titulo) ultimo.trabajos.push(t);
      else resultado.push({ titulo, trabajos: [t] });
    }
    return resultado;
  }, [filtrados]);

  const contar = (estado: FiltroEstado) =>
    estado === "TODOS" ? sinFiltroDeEstado.length : sinFiltroDeEstado.filter((t) => t.ficha.estadoActual === estado).length;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">
      <EncabezadoPantalla
        icono="📋"
        color="azul"
        titulo="Mis trabajos"
        subtitulo={trabajos.length === 1 ? "Tienes 1 trabajo registrado" : `Tienes ${trabajos.length} trabajos registrados`}
        accion={
          <BotonApp onClick={() => irA("NUEVO_TRABAJO")}>
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:inline">Nuevo trabajo</span>
            <span className="sm:hidden">Nuevo</span>
          </BotonApp>
        }
      />

      {mostrarConfirmacion && ultimoTrabajoCreadoId && (
        <Aviso
          tono="exito"
          icono="🎉"
          accion={
            <BotonApp
              color="blanco"
              tamano="sm"
              onClick={() => {
                setMostrarConfirmacion(false);
                limpiarUltimoTrabajoCreado();
              }}
            >
              Cerrar
            </BotonApp>
          }
        >
          <strong>¡Trabajo guardado!</strong> Ya aparece en tu lista. Tócalo para verlo o editarlo.
        </Aviso>
      )}

      {trabajos.length === 0 ? (
        <div className="rounded-2xl bg-white border border-line px-6 py-10 text-center space-y-4">
          <p className="text-5xl" aria-hidden="true">
            🗂️
          </p>
          <div>
            <p className="text-lg font-semibold text-ink">Aún no tienes trabajos</p>
            <p className="text-sm text-ink-soft mt-1">Crea el primero: te guiamos paso a paso.</p>
          </div>
          <BotonApp tamano="lg" onClick={() => irA("NUEVO_TRABAJO")}>
            + Crear mi primer trabajo
          </BotonApp>
        </div>
      ) : (
        <>
          {/* Buscar + filtros */}
          <div className="flex gap-2 items-stretch">
            <div className="flex-1">
              <Campo placeholder="🔎  Buscar por nombre o código…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            <BotonApp color={verFiltros || filtrosActivos > 0 ? "azul" : "blanco"} onClick={() => setVerFiltros((v) => !v)} aria-expanded={verFiltros}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              <span className="hidden sm:inline">Filtros</span>
              {filtrosActivos > 0 && <span className="min-w-5 h-5 px-1.5 rounded-full bg-white text-blue-700 text-xs font-bold flex items-center justify-center">{filtrosActivos}</span>}
            </BotonApp>
          </div>

          {verFiltros && (
            <div className="rounded-2xl bg-white border border-line p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-ink">📅 Fecha de actualización</p>
                <div className="flex flex-wrap gap-2">
                  {FECHAS.map((f) => (
                    <Pastilla key={f.valor} activa={filtroFecha === f.valor} onClick={() => setFiltroFecha(f.valor)}>
                      {f.etiqueta}
                    </Pastilla>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-ink">↕️ Orden</p>
                <div className="flex flex-wrap gap-2">
                  <Pastilla activa={orden === "RECIENTES"} onClick={() => setOrden("RECIENTES")}>
                    Más recientes primero
                  </Pastilla>
                  <Pastilla activa={orden === "ANTIGUOS"} onClick={() => setOrden("ANTIGUOS")}>
                    Más antiguos primero
                  </Pastilla>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Selector etiqueta="🏢 Área" value={filtroArea} onChange={(e) => setFiltroArea(e.target.value)}>
                  <option value="">Todas las áreas</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.codigo}>
                      {a.nombre}
                    </option>
                  ))}
                </Selector>
                <Selector etiqueta="🏷️ Tipo de trabajo" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                  <option value="">Todos los tipos</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.codigo}>
                      {c.nombre}
                    </option>
                  ))}
                </Selector>
              </div>
              <div className="flex gap-2">
                <BotonApp color="azul" className="flex-1" onClick={() => setVerFiltros(false)}>
                  Ver {filtrados.length} {filtrados.length === 1 ? "trabajo" : "trabajos"}
                </BotonApp>
                {hayFiltros && (
                  <BotonApp color="blanco" onClick={quitarFiltros}>
                    Quitar filtros
                  </BotonApp>
                )}
              </div>
            </div>
          )}

          {/* Pestañas de estado + lista: van juntas para que se entienda que filtran lo de abajo */}
          <div className="space-y-4">
            <Pestanas<FiltroEstado>
              valor={filtroEstado}
              onCambiar={setFiltroEstado}
              opciones={(["TODOS", "ROJO", "AMBAR", "VERDE"] as FiltroEstado[]).map((e) => ({
                valor: e,
                etiqueta: (
                  <span className="flex flex-col items-center leading-tight">
                    <span className="text-xs sm:text-sm">
                      {e === "TODOS" ? "Todos" : `${SEMAFORO_INFO[e].emoji} ${SEMAFORO_INFO[e].etiqueta}`}
                    </span>
                    <span className="text-[11px] font-medium text-ink-faint">{contar(e)}</span>
                  </span>
                ),
              }))}
            />

            {filtrados.length === 0 ? (
              <div className="rounded-2xl bg-white/70 border border-line px-6 py-8 text-center space-y-3">
                <p className="text-3xl" aria-hidden="true">
                  🔍
                </p>
                <p className="text-sm text-ink-soft">No hay trabajos que coincidan.</p>
                <BotonApp color="blanco" tamano="sm" onClick={quitarFiltros}>
                  Quitar filtros
                </BotonApp>
              </div>
            ) : (
              grupos.map((g) => (
                <section key={g.titulo} className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-faint px-1">
                    {g.titulo} · {g.trabajos.length}
                  </h2>
                  {g.trabajos.map((t) => (
                    <TarjetaTrabajo
                      key={t.id}
                      trabajo={t}
                      nombreCategoria={categorias.find((c) => c.codigo === t.categoria)?.nombre ?? t.categoria}
                      destacado={t.id === ultimoTrabajoCreadoId}
                      onAbrir={() => irA("DETALLE", t.id)}
                    />
                  ))}
                </section>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function TarjetaTrabajo({
  trabajo: t,
  nombreCategoria,
  destacado,
  onAbrir,
}: {
  trabajo: Trabajo;
  nombreCategoria: string;
  destacado: boolean;
  onAbrir: () => void;
}) {
  const fecha = new Date(t.fechaUltimaEdicion);
  return (
    <button
      type="button"
      onClick={onAbrir}
      className={`group w-full text-left flex items-center gap-3 rounded-2xl bg-white p-3 sm:p-4 border-2 border-b-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-sky-300 active:translate-y-0.5 active:border-b-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
        destacado ? "border-emerald-400 ring-4 ring-emerald-100" : "border-line"
      }`}
    >
      <span aria-hidden="true" className="shrink-0 w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-2xl">
        {CATEGORIA_ICONOS[t.categoria] ?? "🏷️"}
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-start justify-between gap-2">
          <span className="font-semibold text-ink leading-tight truncate">{t.clave}</span>
          <span className="shrink-0">
            <SemaforoBadge estado={t.ficha.estadoActual} />
          </span>
        </span>
        <span className="block font-mono text-xs text-ink-faint truncate mt-0.5">{codigoDeTrabajo(t)}</span>
        <span className="block text-xs text-ink-soft mt-1.5">
          {nombreCategoria} · Actualizado {fecha.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
          {", "}
          {fecha.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </span>
      <span className="shrink-0 w-8 h-8 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center transition-transform group-hover:translate-x-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </span>
    </button>
  );
}
