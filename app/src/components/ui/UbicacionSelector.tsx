import { UBICACION_INFO } from "../../domain/constants";
import type { TipoUbicacion } from "../../domain/types";

// "Otro" ya no se ofrece; solo se muestra si un trabajo antiguo ya lo tenía elegido.
const TIPOS: TipoUbicacion[] = ["FISICO", "DIGITAL_LOCAL", "NUBE", "CORREO"];

// Tarjetas con icono grande en vez de un <select>: más intuitivo para reconocer de un
// vistazo dónde vive el documento (o el correo) real de este trabajo.
export function UbicacionSelector({ value, onChange }: { value: TipoUbicacion; onChange: (tipo: TipoUbicacion) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {(value === "OTRO" ? [...TIPOS, "OTRO" as const] : TIPOS).map((tipo) => {
        const info = UBICACION_INFO[tipo];
        const activo = value === tipo;
        return (
          <button
            key={tipo}
            type="button"
            onClick={() => onChange(tipo)}
            aria-pressed={activo}
            className={`flex flex-col items-center text-center gap-1 rounded-2xl p-3 border-2 border-b-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0.5 active:border-b-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
              activo ? "bg-emerald-50 border-emerald-500" : "bg-white border-line hover:border-emerald-300"
            }`}
          >
            <span className="text-2xl">{info.icono}</span>
            <span className="text-xs font-semibold text-ink">{info.etiqueta}</span>
            <span className="text-[10px] text-ink-soft leading-tight">{info.descripcion}</span>
          </button>
        );
      })}
    </div>
  );
}
