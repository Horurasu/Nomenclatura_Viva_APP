import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { BotonApp, Campo } from "./Estilo";

export const MINIMO_CARACTERES_NOMBRE = 2;

export function limpiarNombre(nombre: string): string {
  return nombre.trim().replace(/\s+/g, " ");
}

export function nombreValido(nombre: string): boolean {
  return limpiarNombre(nombre).length >= MINIMO_CARACTERES_NOMBRE;
}

// Campo de "nombres y apellidos" que comparten la bienvenida y la ventana de nombre.
export function CampoNombreCompleto({ value, onChange, onEnter }: { value: string; onChange: (v: string) => void; onEnter?: () => void }) {
  return (
    <Campo
      etiqueta="¿Cómo te llamas?"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onEnter?.();
      }}
      placeholder="Nombres Apellidos"
      autoFocus
      pista="Así queda registrado quién hizo cada trabajo. Puedes cambiarlo arriba a la derecha."
    />
  );
}

// Se abre cuando intentas entrar a una sección sin haber escrito tu nombre. Al guardarlo,
// te lleva a la sección que querías abrir.
export function ModalNombre() {
  const vistaPendiente = useAppStore((s) => s.vistaPendiente);
  const cancelar = useAppStore((s) => s.cancelarVistaPendiente);
  const setAutorActivo = useAppStore((s) => s.setAutorActivo);
  const [nombre, setNombre] = useState("");

  if (!vistaPendiente) return null;

  function guardar() {
    if (nombreValido(nombre)) setAutorActivo(limpiarNombre(nombre));
  }

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-app rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="text-center">
          <p className="text-5xl" aria-hidden="true">
            👋
          </p>
          <h2 className="text-xl font-bold tracking-tight text-ink mt-2">Antes de continuar</h2>
          <p className="text-sm text-ink-soft mt-1">Escribe tus nombres y apellidos.</p>
        </div>
        <CampoNombreCompleto value={nombre} onChange={setNombre} onEnter={guardar} />
        <div className="flex gap-2">
          <BotonApp color="blanco" tamano="lg" onClick={cancelar}>
            Cancelar
          </BotonApp>
          <BotonApp tamano="lg" className="flex-1" onClick={guardar} disabled={!nombreValido(nombre)}>
            Continuar
          </BotonApp>
        </div>
      </div>
    </div>
  );
}
