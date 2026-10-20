import { useState } from "react";
import { codigoDeTrabajo, escalarCodigo } from "../../domain/codigo";
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

  const codigoActual = codigoDeTrabajo(trabajo);
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
        <FilaNivel icono="🏢" etiqueta="Dentro de mi institución" codigo={niveles.area} actual={codigoActual} />
        <FilaNivel icono="🏛️" etiqueta="Con otras instituciones" codigo={niveles.institucion} falta="Escribe las siglas de tu institución" actual={codigoActual} />
        <FilaNivel icono="🌎" etiqueta="En una red regional" codigo={niveles.region} falta="Escribe ambas siglas" actual={codigoActual} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Campo
          etiqueta="Siglas de tu institución"
          placeholder="Ej. UNAM"
          value={prefijoInstitucion}
          onChange={(e) => setPrefijoInstitucion(e.target.value.toUpperCase())}
          onBlur={guardarPrefijos}
        />
        <Campo
          etiqueta="Siglas de la red o región"
          placeholder="Ej. RED"
          value={prefijoRed}
          onChange={(e) => setPrefijoRed(e.target.value.toUpperCase())}
          onBlur={guardarPrefijos}
        />
      </div>
      <BotonApp onClick={guardarPrefijos} disabled={guardado}>
        {guardado ? "✓ Guardado" : "Guardar siglas"}
      </BotonApp>
    </div>
  );
}

function FilaNivel({ icono, etiqueta, codigo, falta, actual }: { icono: string; etiqueta: string; codigo?: string; falta?: string; actual: string }) {
  const enUso = codigo === actual;
  return (
    <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${enUso ? "bg-emerald-50 ring-2 ring-emerald-300" : "bg-app"}`}>
      <span aria-hidden="true" className="text-lg">
        {icono}
      </span>
      <span className="text-sm text-ink-soft flex-1">
        {etiqueta}
        {enUso && <span className="block text-xs font-semibold text-emerald-700">El que usas ahora</span>}
      </span>
      <span className={`font-mono text-xs sm:text-sm text-right break-all ${codigo ? "text-ink font-semibold" : "text-ink-faint"}`}>{codigo ?? falta}</span>
    </div>
  );
}
