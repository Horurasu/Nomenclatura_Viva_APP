import { useState } from "react";
import { escalarCodigo } from "../../domain/codigo";
import { useAppStore } from "../../store/useAppStore";
import type { Trabajo } from "../../domain/types";
import { BotonApp, Campo } from "../ui/Estilo";

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

  const guardado = prefijoInstitucion === (trabajo.prefijoInstitucion ?? "") && prefijoRed === (trabajo.prefijoRed ?? "");

  function guardarPrefijos() {
    actualizarTrabajo(trabajo.id, {
      prefijoInstitucion: prefijoInstitucion || undefined,
      prefijoRed: prefijoRed || undefined,
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FilaNivel icono="👤" etiqueta="Solo mi área" codigo={niveles.cosa} />
        <FilaNivel icono="🏢" etiqueta="Varias áreas" codigo={niveles.area} />
        <FilaNivel icono="🏛️" etiqueta="Otras instituciones" codigo={niveles.institucion} falta="Escribe el prefijo de institución" />
        <FilaNivel icono="🌎" etiqueta="Red regional" codigo={niveles.region} falta="Escribe ambos prefijos" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Campo
          etiqueta="Prefijo de institución"
          placeholder="Ej. INST"
          value={prefijoInstitucion}
          onChange={(e) => setPrefijoInstitucion(e.target.value.toUpperCase())}
          onBlur={guardarPrefijos}
        />
        <Campo
          etiqueta="Prefijo de región"
          placeholder="Ej. RED"
          value={prefijoRed}
          onChange={(e) => setPrefijoRed(e.target.value.toUpperCase())}
          onBlur={guardarPrefijos}
        />
      </div>
      <BotonApp onClick={guardarPrefijos} disabled={guardado}>
        {guardado ? "✓ Guardado" : "Guardar prefijos"}
      </BotonApp>
    </div>
  );
}

function FilaNivel({ icono, etiqueta, codigo, falta }: { icono: string; etiqueta: string; codigo?: string; falta?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-app px-3 py-2.5">
      <span aria-hidden="true" className="text-lg">
        {icono}
      </span>
      <span className="text-sm text-ink-soft flex-1">{etiqueta}</span>
      <span className={`font-mono text-xs sm:text-sm text-right break-all ${codigo ? "text-ink font-semibold" : "text-ink-faint"}`}>{codigo ?? falta}</span>
    </div>
  );
}
