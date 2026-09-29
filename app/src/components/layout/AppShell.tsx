import { useAppStore, type Vista } from "../../store/useAppStore";
import { Inicio } from "../inicio/Inicio";
import { WizardCrearTrabajo } from "../wizard/WizardCrearTrabajo";
import { Tablero } from "../dashboard/Tablero";
import { FichaDetalle } from "../detalle/FichaDetalle";
import { ExportarImportar } from "../exportImport/ExportarImportar";
import { Configuracion } from "../configuracion/Configuracion";
import { Input } from "../ui/Primitives";

const NAV_ITEMS: { vista: Vista; etiqueta: string }[] = [
  { vista: "INICIO", etiqueta: "Inicio" },
  { vista: "NUEVO_TRABAJO", etiqueta: "Nuevo trabajo" },
  { vista: "TABLERO", etiqueta: "Tablero" },
  { vista: "EXPORTAR_IMPORTAR", etiqueta: "Exportar / Importar" },
  { vista: "CONFIGURACION", etiqueta: "Configuración" },
];

// El detalle de un trabajo se abre desde el Tablero, así que ese botón se ve
// "activo" también ahí — para que siempre quede claro en qué parte de la app estás.
function estaActivo(item: Vista, vistaActual: Vista) {
  if (item === "TABLERO") return vistaActual === "TABLERO" || vistaActual === "DETALLE";
  return item === vistaActual;
}

export function AppShell() {
  const vista = useAppStore((s) => s.vista);
  const irA = useAppStore((s) => s.irA);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const setAutorActivo = useAppStore((s) => s.setAutorActivo);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="font-semibold text-slate-900">Nomenclatura Viva</span>
        </div>

        <nav className="flex flex-wrap gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.vista}
              onClick={() => irA(item.vista)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                estaActivo(item.vista, vista) ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.etiqueta}
            </button>
          ))}
        </nav>

        <div className="flex flex-col items-start">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Tu nombre (quedará como autor)</span>
          <div className="w-48">
            <Input placeholder="Escribe tu nombre..." value={autorActivo} onChange={(e) => setAutorActivo(e.target.value)} />
          </div>
        </div>
      </header>

      {vista === "DETALLE" && (
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2 text-xs text-emerald-800 flex items-center gap-2">
          <span>📄 Estás dentro de un trabajo (no en el tablero general).</span>
          <button className="underline font-medium" onClick={() => irA("TABLERO")}>
            ← Volver al tablero
          </button>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6">
        {vista === "INICIO" && <Inicio />}
        {vista === "NUEVO_TRABAJO" && <WizardCrearTrabajo />}
        {vista === "TABLERO" && <Tablero />}
        {vista === "DETALLE" && <FichaDetalle />}
        {vista === "EXPORTAR_IMPORTAR" && <ExportarImportar />}
        {vista === "CONFIGURACION" && <Configuracion />}
      </main>
    </div>
  );
}
