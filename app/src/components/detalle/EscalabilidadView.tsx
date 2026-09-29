import { useState } from "react";
import { escalarCodigo } from "../../domain/codigo";
import { useAppStore } from "../../store/useAppStore";
import type { Trabajo } from "../../domain/types";
import { Button, Input, Label } from "../ui/Primitives";

export function EscalabilidadView({ trabajo }: { trabajo: Trabajo }) {
  const actualizarTrabajo = useAppStore((s) => s.actualizarTrabajo);
  const [prefijoInstitucion, setPrefijoInstitucion] = useState(trabajo.prefijoInstitucion ?? "");
  const [prefijoRed, setPrefijoRed] = useState(trabajo.prefijoRed ?? "");

  const niveles = escalarCodigo({
    areaCodigo: trabajo.areaCodigo,
    categoria: trabajo.categoria,
    clave: trabajo.clave,
    prefijoInstitucion: prefijoInstitucion || undefined,
    prefijoRed: prefijoRed || undefined,
  });

  function guardarPrefijos() {
    actualizarTrabajo(trabajo.id, {
      prefijoInstitucion: prefijoInstitucion || undefined,
      prefijoRed: prefijoRed || undefined,
    });
  }

  return (
    <div className="space-y-3">
      <FilaNivel etiqueta="Cosa (uso interno)" codigo={niveles.cosa} />
      <FilaNivel etiqueta="Área" codigo={niveles.area} />
      <FilaNivel etiqueta="Institución" codigo={niveles.institucion ?? "— agrega un prefijo de institución abajo"} />
      <FilaNivel etiqueta="Región" codigo={niveles.region ?? "— agrega prefijo de institución y de región"} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-line">
        <div>
          <Label>Prefijo de institución (ej. INST, o el código de tu institución)</Label>
          <Input value={prefijoInstitucion} onChange={(e) => setPrefijoInstitucion(e.target.value.toUpperCase())} onBlur={guardarPrefijos} />
        </div>
        <div>
          <Label>Prefijo de región (ej. RED)</Label>
          <Input value={prefijoRed} onChange={(e) => setPrefijoRed(e.target.value.toUpperCase())} onBlur={guardarPrefijos} />
        </div>
      </div>
      <Button variant="secondary" onClick={guardarPrefijos}>
        Guardar prefijos
      </Button>
    </div>
  );
}

function FilaNivel({ etiqueta, codigo }: { etiqueta: string; codigo: string }) {
  return (
    <div className="flex items-center justify-between text-sm bg-paper rounded-md px-3 py-2">
      <span className="text-ink-soft">{etiqueta}</span>
      <span className="font-mono text-ink">{codigo}</span>
    </div>
  );
}
