import { SEMAFORO_INFO } from "../../domain/constants";
import type { EstadoSemaforo } from "../../domain/types";

export function SemaforoBadge({ estado }: { estado: EstadoSemaforo }) {
  const info = SEMAFORO_INFO[estado];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: info.bg, color: info.texto }}
    >
      {info.emoji} {info.etiqueta}
    </span>
  );
}
