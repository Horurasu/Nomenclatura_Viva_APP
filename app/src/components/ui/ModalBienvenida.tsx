import { useState, type ChangeEvent } from "react";
import { useAppStore } from "../../store/useAppStore";
import { leerArchivoJSON } from "../../storage/exportImport";
import { Aviso, BotonApp, clasesBoton } from "./Estilo";

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
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-app rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="text-center">
          <div
            aria-hidden="true"
            className="mx-auto w-20 h-20 rounded-full flex items-center justify-center text-5xl"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.08) 55%, transparent 72%)" }}
          >
            🌿
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-ink mt-1">
            Bienvenido a Nomenclatura <span className="text-emerald-600">Viva</span>
          </h2>
          <p className="text-sm text-ink-soft mt-2 leading-relaxed">
            Te ayuda a ponerle un nombre claro a cada trabajo y darle seguimiento. Tus archivos y correos se quedan donde
            siempre: aquí solo se lleva el registro.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-ink text-center">¿Cómo quieres empezar?</p>
          <BotonApp tamano="lg" className="w-full" onClick={empezarDeCero}>
            ✨ Empezar desde cero
          </BotonApp>
          <label className={`${clasesBoton("blanco", "lg")} w-full cursor-pointer ${cargando ? "opacity-60 pointer-events-none" : ""}`}>
            {cargando ? "Cargando..." : "📂 Ya tengo una copia de respaldo"}
            <input type="file" accept="application/json" className="sr-only" onChange={manejarArchivo} disabled={cargando} />
          </label>
        </div>

        {error && (
          <Aviso tono="peligro" icono="❌">
            {error}
          </Aviso>
        )}
      </div>
    </div>
  );
}
