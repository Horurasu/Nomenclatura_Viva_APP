import { useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

// Piezas del estilo "app": todo lo que se puede tocar se ve con volumen (borde inferior
// grueso + sombra, se levanta al pasar el mouse y se hunde al presionar); todo lo
// informativo es plano.

const PRESIONABLE =
  "transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:hover:translate-y-0";

const COLORES_BOTON = {
  verde:
    "text-white bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-800/50 shadow-emerald-700/30 hover:from-emerald-300 hover:to-emerald-500 focus-visible:ring-emerald-300 disabled:from-gray-300 disabled:to-gray-300 disabled:border-gray-400/50 disabled:shadow-none",
  azul:
    "text-white bg-gradient-to-br from-sky-400 to-blue-600 border-blue-800/50 shadow-blue-700/30 hover:from-sky-300 hover:to-blue-500 focus-visible:ring-sky-300 disabled:from-gray-300 disabled:to-gray-300 disabled:border-gray-400/50 disabled:shadow-none",
  ambar:
    "text-white bg-gradient-to-br from-amber-400 to-orange-500 border-orange-700/50 shadow-orange-600/30 hover:from-amber-300 hover:to-orange-400 focus-visible:ring-amber-300 disabled:from-gray-300 disabled:to-gray-300 disabled:border-gray-400/50 disabled:shadow-none",
  morado:
    "text-white bg-gradient-to-br from-violet-400 to-purple-600 border-purple-800/50 shadow-purple-700/30 hover:from-violet-300 hover:to-purple-500 focus-visible:ring-violet-300 disabled:from-gray-300 disabled:to-gray-300 disabled:border-gray-400/50 disabled:shadow-none",
  rojo:
    "text-white bg-gradient-to-br from-red-400 to-red-600 border-red-800/50 shadow-red-700/30 hover:from-red-300 hover:to-red-500 focus-visible:ring-red-300 disabled:from-gray-300 disabled:to-gray-300 disabled:border-gray-400/50 disabled:shadow-none",
  blanco:
    "text-ink bg-white border-line shadow-ink/5 focus-visible:ring-emerald-300 disabled:opacity-50 disabled:shadow-none",
};

export type ColorBoton = keyof typeof COLORES_BOTON;

const TAMANOS_BOTON = {
  sm: "px-3 py-1.5 text-xs rounded-lg border-b-[3px] active:border-b",
  md: "px-4 py-2.5 text-sm rounded-xl border-b-4 active:border-b-2",
  lg: "px-5 py-3.5 text-base rounded-2xl border-b-4 active:border-b-2",
};

// Clases del botón, también para enlaces (<a>) o <label> que deben verse como botón.
export function clasesBoton(color: ColorBoton = "verde", tamano: keyof typeof TAMANOS_BOTON = "md") {
  return `inline-flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg active:shadow-sm ${PRESIONABLE} ${TAMANOS_BOTON[tamano]} ${COLORES_BOTON[color]}`;
}

export function BotonApp({
  color = "verde",
  tamano = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { color?: ColorBoton; tamano?: keyof typeof TAMANOS_BOTON }) {
  return <button type="button" className={`${clasesBoton(color, tamano)} ${className}`} {...props} />;
}

// Encabezado de cada sección: ícono plano en círculo del color de su botón en el inicio.
const COLORES_ENCABEZADO = {
  verde: "bg-emerald-100",
  azul: "bg-sky-100",
  ambar: "bg-amber-100",
  morado: "bg-violet-100",
};

export function EncabezadoPantalla({
  icono,
  titulo,
  subtitulo,
  color = "verde",
  accion,
}: {
  icono: string;
  titulo: ReactNode;
  subtitulo?: ReactNode;
  color?: keyof typeof COLORES_ENCABEZADO;
  accion?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-3xl ${COLORES_ENCABEZADO[color]}`}>
        {icono}
      </span>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink leading-tight">{titulo}</h1>
        {subtitulo && <p className="text-sm text-ink-soft mt-0.5">{subtitulo}</p>}
      </div>
      {accion && <div className="shrink-0">{accion}</div>}
    </div>
  );
}

// Pestañas tipo app (control segmentado): cada pestaña es un botón; la activa se ve "hundida".
export function Pestanas<T extends string>({
  opciones,
  valor,
  onCambiar,
}: {
  opciones: { valor: T; etiqueta: ReactNode }[];
  valor: T;
  onCambiar: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-2xl bg-ink/5" role="tablist">
      {opciones.map((o) => {
        const activa = o.valor === valor;
        return (
          <button
            key={o.valor}
            type="button"
            role="tab"
            aria-selected={activa}
            onClick={() => onCambiar(o.valor)}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
              activa ? "bg-white text-ink shadow-md border-b-[3px] border-line" : "text-ink-soft hover:bg-white/60 hover:text-ink"
            }`}
          >
            {o.etiqueta}
          </button>
        );
      })}
    </div>
  );
}

// Bloque de contenido con título. Si es "plegable", el título es un botón que lo abre/cierra.
export function Seccion({
  icono,
  titulo,
  subtitulo,
  plegable = false,
  children,
}: {
  icono: string;
  titulo: ReactNode;
  subtitulo?: ReactNode;
  plegable?: boolean;
  children: ReactNode;
}) {
  const [abierta, setAbierta] = useState(!plegable);
  const cabecera = (
    <>
      <span aria-hidden="true" className="shrink-0 w-10 h-10 rounded-xl bg-app flex items-center justify-center text-xl">
        {icono}
      </span>
      <span className="flex-1 min-w-0 text-left">
        <span className="block font-semibold text-ink leading-tight">{titulo}</span>
        {subtitulo && <span className="block text-xs text-ink-soft mt-0.5">{subtitulo}</span>}
      </span>
    </>
  );

  if (!plegable) {
    return (
      <div className="rounded-2xl bg-white border border-line p-4 space-y-4">
        <div className="flex items-center gap-3">{cabecera}</div>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        className={`w-full flex items-center gap-3 rounded-2xl bg-white p-3 border-2 border-line border-b-4 shadow-sm hover:shadow-md hover:border-emerald-300 active:border-b-2 focus-visible:ring-emerald-300 ${PRESIONABLE}`}
      >
        {cabecera}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 w-5 h-5 text-ink-soft transition-transform ${abierta ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {abierta && <div className="rounded-2xl bg-white border border-line p-4 space-y-4">{children}</div>}
    </div>
  );
}

export function Selector({
  etiqueta,
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { etiqueta?: ReactNode }) {
  return (
    <label className="block">
      {etiqueta && <span className="block text-sm font-semibold text-ink mb-1.5">{etiqueta}</span>}
      <span className="relative block">
        <select
          {...props}
          className={`w-full appearance-none rounded-xl border-2 border-line bg-white pl-4 pr-10 py-3 text-base text-ink focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-colors cursor-pointer ${className}`}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-soft"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </label>
  );
}

// Aviso plano de color (éxito, cuidado, peligro, info).
const TONOS_AVISO = {
  exito: "bg-emerald-50 border-emerald-200 text-emerald-800",
  cuidado: "bg-amber-50 border-amber-200 text-amber-800",
  peligro: "bg-red-50 border-red-200 text-red-700",
  info: "bg-sky-50 border-sky-200 text-sky-800",
};

export function Aviso({
  tono = "info",
  icono,
  children,
  accion,
}: {
  tono?: keyof typeof TONOS_AVISO;
  icono?: string;
  children: ReactNode;
  accion?: ReactNode;
}) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-snug ${TONOS_AVISO[tono]}`}>
      {icono && (
        <span aria-hidden="true" className="text-lg leading-none mt-0.5">
          {icono}
        </span>
      )}
      <div className="flex-1 min-w-0">{children}</div>
      {accion && <div className="shrink-0">{accion}</div>}
    </div>
  );
}

function Palomita({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

// Tarjeta que se elige (una de varias). Seleccionada: borde verde y palomita.
export function Opcion({
  seleccionada = false,
  icono,
  titulo,
  texto,
  punteada = false,
  onClick,
}: {
  seleccionada?: boolean;
  icono?: ReactNode;
  titulo: ReactNode;
  texto?: ReactNode;
  punteada?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={seleccionada}
      className={`w-full text-left flex items-center gap-3 rounded-2xl p-3 border-2 border-b-4 shadow-sm hover:shadow-md active:border-b-2 focus-visible:ring-emerald-300 ${PRESIONABLE} ${
        seleccionada
          ? "bg-emerald-50 border-emerald-500"
          : punteada
            ? "bg-emerald-50 border-dashed border-emerald-400 hover:bg-emerald-100 hover:border-emerald-500"
            : "bg-white border-line hover:border-emerald-300"
      }`}
    >
      {/* "punteada" = tarjeta para crear algo nuevo: ícono "+" verde que invita a tocarla. */}
      {punteada ? (
        <span className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm shadow-emerald-700/30">
          +
        </span>
      ) : (
        icono && <span className="shrink-0 w-11 h-11 rounded-xl bg-app flex items-center justify-center text-2xl">{icono}</span>
      )}
      <span className="flex-1 min-w-0">
        <span className={`block font-semibold leading-tight ${punteada ? "text-emerald-800" : "text-ink"}`}>{titulo}</span>
        {texto && <span className="block text-xs text-ink-soft mt-0.5 leading-snug">{texto}</span>}
      </span>
      {!punteada && (
        <span
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            seleccionada ? "bg-emerald-500 border-emerald-500 text-white" : "border-line bg-white"
          }`}
        >
          {seleccionada && <Palomita />}
        </span>
      )}
    </button>
  );
}

// Pastilla pequeña que se toca (sugerencias rápidas, ejemplos para rellenar).
export function Pastilla({
  activa = false,
  children,
  onClick,
}: {
  activa?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-b-[3px] shadow-sm active:border-b focus-visible:ring-emerald-300 ${PRESIONABLE} ${
        activa ? "bg-emerald-500 border-emerald-700/60 text-white" : "bg-white border-line text-ink hover:border-emerald-300"
      }`}
    >
      {children}
    </button>
  );
}

// Ayuda opcional que se abre con un botoncito — la explicación larga no estorba a quien
// ya sabe qué hacer.
export function Ayuda({ titulo, icono = "💡", children }: { titulo: string; icono?: string; children: ReactNode }) {
  const [abierta, setAbierta] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 border-b-[3px] active:border-b focus-visible:ring-emerald-300 ${PRESIONABLE}`}
      >
        <span aria-hidden="true">{icono}</span>
        {titulo}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-3.5 h-3.5 transition-transform ${abierta ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {abierta && <Panel className="mt-2 text-sm text-ink-soft space-y-2 leading-relaxed">{children}</Panel>}
    </div>
  );
}

// Contenedor informativo plano (no se toca).
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white/70 border border-line p-4 ${className}`}>{children}</div>;
}

export function Campo({
  etiqueta,
  pista,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { etiqueta?: ReactNode; pista?: ReactNode }) {
  return (
    <label className="block">
      {etiqueta && <span className="block text-sm font-semibold text-ink mb-1.5">{etiqueta}</span>}
      <input
        {...props}
        className={`w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-colors ${className}`}
      />
      {pista && <span className="block text-xs text-ink-soft mt-1.5">{pista}</span>}
    </label>
  );
}

// Ejemplo bueno / malo en una línea.
export function Ejemplo({ bien, children }: { bien: boolean; children: ReactNode }) {
  return (
    <p className={`text-xs flex gap-1.5 ${bien ? "text-emerald-700" : "text-red-600"}`}>
      <span aria-hidden="true">{bien ? "✅" : "❌"}</span>
      <span>{children}</span>
    </p>
  );
}
