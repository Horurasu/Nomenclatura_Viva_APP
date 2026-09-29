import { UBICACION_INFO } from "../../domain/constants";
import type { TipoUbicacion } from "../../domain/types";

const TIPOS: TipoUbicacion[] = ["FISICO", "DIGITAL_LOCAL", "NUBE", "CORREO", "OTRO"];

// Tarjetas con icono grande en vez de un <select>: más intuitivo para reconocer de un
// vistazo dónde vive el documento (o el correo) real de este trabajo.
export function UbicacionSelector({ value, onChange }: { value: TipoUbicacion; onChange: (tipo: TipoUbicacion) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {TIPOS.map((tipo) => {
        const info = UBICACION_INFO[tipo];
        const activo = value === tipo;
        return (
          <button
            key={tipo}
            type="button"
            onClick={() => onChange(tipo)}
            className={`flex flex-col items-center text-center gap-1 rounded-md border p-3 transition-colors ${
              activo ? "border-moss-500 bg-moss-50" : "border-line hover:border-moss-300"
            }`}
          >
            <span className="text-2xl">{info.icono}</span>
            <span className="text-xs font-medium text-ink">{info.etiqueta}</span>
            <span className="text-[10px] text-ink-soft leading-tight">{info.descripcion}</span>
          </button>
        );
      })}
    </div>
  );
}
