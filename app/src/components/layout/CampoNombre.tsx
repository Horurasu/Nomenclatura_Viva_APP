import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

const MINIMO_CARACTERES = 2;

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

// Nombre del usuario en la barra superior. Vacío al inicio (con "Nombres Apellidos" de
// ejemplo); se guarda una sola vez y queda recordado. Si intentas entrar a una sección
// sin nombre, se abre una ventana que te lo pide (ver PedirNombre).
export function CampoNombre() {
  const autorActivo = useAppStore((s) => s.autorActivo);
  const setAutorActivo = useAppStore((s) => s.setAutorActivo);

  const sinNombre = !autorActivo.trim();
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(autorActivo);
  const inputRef = useRef<HTMLInputElement>(null);

  // Muestra la validación (sacudida + globito) al borrar el nombre; se apaga al
  // guardar uno válido.
  const [avisar, setAvisar] = useState(false);
  const [sacudidas, setSacudidas] = useState(0);

  const mostrarCampo = sinNombre || editando;
  const vacio = !borrador.trim();
  const valido = borrador.trim().length >= MINIMO_CARACTERES;
  const pidiendo = sinNombre && avisar;

  // Si el nombre se guarda desde otra ventana (bienvenida), el campo lo refleja.
  useEffect(() => {
    if (!editando) setBorrador(autorActivo);
  }, [autorActivo, editando]);

  // Dejar el campo vacío está permitido: borra el nombre y vuelve a pedirlo.
  function vaciar() {
    setAutorActivo("");
    setBorrador("");
    setEditando(false);
    setAvisar(true);
    setSacudidas((n) => n + 1);
  }

  function guardar() {
    if (vacio) return vaciar();
    if (!valido) return;
    setAutorActivo(borrador.trim().replace(/\s+/g, " "));
    setEditando(false);
    setAvisar(false);
  }

  function cancelar() {
    setBorrador(autorActivo);
    setEditando(false);
  }

  if (!mostrarCampo) {
    return (
      <button
        onClick={() => {
          setBorrador(autorActivo);
          setEditando(true);
        }}
        title="Clic para cambiar tu nombre"
        className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-xl bg-white border-b-4 border-line shadow-md shadow-ink/5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:border-b-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
      >
        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
          {iniciales(autorActivo)}
        </span>
        <span className="text-sm font-medium text-ink max-w-[10rem] truncate">{autorActivo}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <div
        key={sacudidas}
        className={`flex items-center gap-1.5 rounded-xl bg-white p-1 border-2 transition-colors ${
          pidiendo ? "border-amber-400 ring-4 ring-amber-200 animate-sacudir" : "border-line focus-within:border-emerald-400"
        }`}
      >
        <span className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5" />
          </svg>
        </span>
        <input
          ref={inputRef}
          autoFocus={editando}
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") guardar();
            if (e.key === "Escape" && !sinNombre) cancelar();
          }}
          onBlur={() => {
            if (sinNombre) return;
            if (vacio) vaciar();
            else if (!valido) cancelar();
          }}
          placeholder="Nombres Apellidos"
          aria-label="Tus nombres y apellidos"
          className="w-32 sm:w-44 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <button
          onClick={guardar}
          disabled={!valido && !(vacio && !sinNombre)}
          title="Guardar nombre"
          className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-emerald-400 to-emerald-600 border-b-[3px] border-emerald-800/50 shadow-sm transition-all active:translate-y-px active:border-b disabled:from-gray-300 disabled:to-gray-300 disabled:border-gray-400/50 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </button>
      </div>

      {pidiendo && (
        <div className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 leading-snug z-40">
          <span className="absolute -top-1.5 right-6 w-3 h-3 rotate-45 bg-amber-50 border-l border-t border-amber-200" />
          ✋ Antes de continuar, escribe tus <strong>nombres y apellidos</strong>. Así queda registrado quién hizo cada trabajo.
        </div>
      )}
    </div>
  );
}
