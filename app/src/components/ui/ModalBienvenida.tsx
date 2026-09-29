import { useState, type ChangeEvent } from "react";
import { useAppStore } from "../../store/useAppStore";
import { leerArchivoJSON } from "../../storage/exportImport";
import { Button } from "./Primitives";

const CLAVE_LOCALSTORAGE = "nv_bienvenida_vista";

export function huboBienvenida(): boolean {
  return localStorage.getItem(CLAVE_LOCALSTORAGE) === "true";
}

function marcarVista() {
  localStorage.setItem(CLAVE_LOCALSTORAGE, "true");
}

export function ModalBienvenida({ onCerrar }: { onCerrar: () => void }) {
  const reemplazarTodo = useAppStore((s) => s.reemplazarTodo);
  const marcarExportado = useAppStore((s) => s.marcarExportado);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function empezarDeCero() {
    marcarVista();
    onCerrar();
  }

  async function manejarArchivo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setCargando(true);
    try {
      const archivo = await leerArchivoJSON(file);
      await reemplazarTodo(archivo);
      marcarExportado();
      marcarVista();
      onCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer el archivo.");
    }
    setCargando(false);
    e.target.value = "";
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-lg border border-line max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl text-kaki-500">◆</span>
          <h2 className="text-base font-semibold text-ink">Bienvenido a Nomenclatura Viva</h2>
        </div>
        <p className="text-sm text-ink-soft leading-relaxed">
          Esta app es una <strong className="text-ink">herramienta de acompañamiento</strong>: te ayuda a
          estructurar, nombrar y documentar tus trabajos con un código corto y trazable. No reemplaza tus archivos
          ni tus correos.
        </p>
        <p className="text-sm text-ink-soft leading-relaxed">
          <strong className="text-ink">No guarda archivos.</strong> Tú sigues organizando tus carpetas, documentos y
          correos donde ya los manejas (papel, tu computadora, la nube, tu bandeja de entrada) — esta app solo lleva
          el registro de nombres, trazabilidad y estado.
        </p>

        <div className="border-t border-line pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border border-line rounded-md p-3">
            <p className="text-sm font-medium text-ink mb-1">Tengo una configuración previa</p>
            <p className="text-xs text-ink-soft mb-2">Carga un archivo JSON que ya hayas exportado antes.</p>
            <label className="inline-block">
              <span className="px-4 py-2 rounded-md font-medium text-sm bg-moss-600 text-white hover:bg-moss-700 transition-colors cursor-pointer inline-block">
                {cargando ? "Cargando..." : "Importar archivo"}
              </span>
              <input type="file" accept="application/json" className="hidden" onChange={manejarArchivo} disabled={cargando} />
            </label>
          </div>
          <div className="border border-line rounded-md p-3">
            <p className="text-sm font-medium text-ink mb-1">Empezar sin configuración</p>
            <p className="text-xs text-ink-soft mb-2">Arranca desde cero con las categorías de fábrica.</p>
            <Button variant="secondary" onClick={empezarDeCero}>
              Crear nuevo
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-terracotta-600">{error}</p>}
      </div>
    </div>
  );
}
