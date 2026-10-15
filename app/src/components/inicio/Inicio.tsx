import type { ReactNode } from "react";
import { useAppStore, type Vista } from "../../store/useAppStore";

// Íconos de línea, todos con el mismo grosor y tamaño, para que los cuatro botones
// se vean como una sola familia.
function Icono({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      {children}
    </svg>
  );
}

const ICONOS: Record<string, ReactNode> = {
  nuevo: (
    <Icono>
      <path d="M12 5v14M5 12h14" />
    </Icono>
  ),
  trabajos: (
    <Icono>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </Icono>
  ),
  respaldo: (
    <Icono>
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" />
      <path d="M5 17v1.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V17" />
    </Icono>
  ),
  configuracion: (
    <Icono>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </Icono>
  ),
};

interface Boton {
  vista: Vista;
  icono: keyof typeof ICONOS;
  titulo: string;
  texto: string;
  // Color propio de cada botón, alusivo a lo que hace. Las clases van completas (no
  // armadas con plantillas) para que Tailwind las detecte.
  color: string;
  colorInsignia: string;
}

const BOTONES: Boton[] = [
  {
    // Verde: crear, empezar algo nuevo.
    vista: "NUEVO_TRABAJO",
    icono: "nuevo",
    titulo: "Nuevo trabajo",
    texto: "Regístralo paso a paso",
    color:
      "from-emerald-400 to-emerald-600 border-emerald-800/50 shadow-emerald-700/30 hover:from-emerald-300 hover:to-emerald-500 focus-visible:ring-emerald-300",
    colorInsignia: "text-emerald-700",
  },
  {
    // Azul: consultar, orden, seguimiento.
    vista: "TABLERO",
    icono: "trabajos",
    titulo: "Mis trabajos",
    texto: "Ve cómo va cada uno",
    color:
      "from-sky-400 to-blue-600 border-blue-800/50 shadow-blue-700/30 hover:from-sky-300 hover:to-blue-500 focus-visible:ring-sky-300",
    colorInsignia: "text-blue-700",
  },
  {
    // Ámbar: guardar, cuidar tu información.
    vista: "EXPORTAR_IMPORTAR",
    icono: "respaldo",
    titulo: "Respaldo",
    texto: "Guarda o carga tu información",
    color:
      "from-amber-400 to-orange-500 border-orange-700/50 shadow-orange-600/30 hover:from-amber-300 hover:to-orange-400 focus-visible:ring-amber-300",
    colorInsignia: "text-orange-600",
  },
  {
    // Morado: ajustes, personalizar.
    vista: "CONFIGURACION",
    icono: "configuracion",
    titulo: "Configuración",
    texto: "Áreas y categorías",
    color:
      "from-violet-400 to-purple-600 border-purple-800/50 shadow-purple-700/30 hover:from-violet-300 hover:to-purple-500 focus-visible:ring-violet-300",
    colorInsignia: "text-purple-700",
  },
];

function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] ?? "";
}

export function Inicio() {
  const irA = useAppStore((s) => s.irA);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const totalTrabajos = useAppStore((s) => s.trabajos.length);
  const cambiosSinExportar = useAppStore((s) => s.cambiosSinExportar);

  // Avisos pequeños junto al título, para ver lo importante sin entrar a la sección.
  function insignia(b: Boton) {
    const base = `ml-2 inline-flex items-center justify-center h-6 px-2 rounded-full bg-white text-xs font-bold align-middle ${b.colorInsignia}`;
    if (b.vista === "TABLERO" && totalTrabajos > 0) {
      return <span className={`${base} min-w-6`}>{totalTrabajos}</span>;
    }
    if (b.vista === "EXPORTAR_IMPORTAR" && cambiosSinExportar && totalTrabajos > 0) {
      return <span className={base}>Pendiente</span>;
    }
    return null;
  }

  return (
    // Un solo contenedor con un solo ancho y un solo eje central: encabezado, saludo,
    // botones y aviso comparten el mismo ancho y cambian de vertical a horizontal en
    // el mismo punto (lg), para que todo quede alineado.
    <div className="flex-1 flex items-center justify-center py-2">
      <div className="w-full max-w-sm lg:max-w-4xl flex flex-col items-center gap-4 lg:gap-5">
        {/* Encabezado: teléfono en vertical, PC en horizontal (plantita a la izquierda). */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-5 text-center lg:text-left">
          {/* Ilustración, no botón: plana, redonda y sin sombra ni borde con volumen. */}
          <div
            aria-hidden="true"
            className="shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-4xl lg:text-5xl select-none"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.08) 55%, transparent 72%)" }}
          >
            🌿
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-ink leading-tight">
              Nomenclatura <span className="text-emerald-600">Viva</span>
            </h1>
            <p className="text-ink-soft mt-1 text-sm leading-snug max-w-md">
              Ponle un nombre claro a cada trabajo, clasifícalo y dale seguimiento, para que tú y tu equipo lo encuentren
              siempre.
            </p>
          </div>
        </div>

        <p className="text-sm font-medium text-ink text-center">
          👋 Hola{autorActivo ? `, ${primerNombre(autorActivo)}` : ""}. ¿Qué quieres hacer hoy?
        </p>

        {/* Teléfono: una columna (botón ancho con ícono a la izquierda).
            PC (lg): cuatro en fila, misma altura (botón alto con ícono arriba). */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 w-full">
        {BOTONES.map((b) => (
          <button
            key={b.vista}
            onClick={() => irA(b.vista)}
            className={`group w-full flex items-center gap-3 text-left rounded-2xl px-3 py-2.5
              lg:flex-col lg:justify-center lg:text-center lg:px-4 lg:py-5 lg:gap-3
              bg-gradient-to-br text-white border-b-4 shadow-lg
              transition-all duration-150
              hover:-translate-y-1 hover:shadow-xl
              active:translate-y-0.5 active:border-b-2 active:shadow-md
              focus:outline-none focus-visible:ring-4 ${b.color}`}
          >
            <span className="shrink-0 w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white/25 ring-1 ring-white/40 flex items-center justify-center lg:[&>svg]:w-7 lg:[&>svg]:h-7">
              {ICONOS[b.icono]}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-base font-semibold leading-tight drop-shadow-sm">
                {b.titulo}
                {insignia(b)}
              </span>
              <span className="block text-xs text-white/90 mt-0.5 lg:mt-1">{b.texto}</span>
            </span>
            <span className="shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </button>
        ))}
        </div>

        {/* Aviso informativo (no es botón): pequeño y plano. */}
        <p className="flex items-start justify-center gap-1.5 text-center text-xs text-ink-faint leading-snug max-w-md">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 w-4 h-4 text-emerald-600">
            <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
          </svg>
          <span>Tus archivos y correos no se guardan aquí; la app solo te ayuda a nombrarlos y darles seguimiento.</span>
        </p>
      </div>
    </div>
  );
}
