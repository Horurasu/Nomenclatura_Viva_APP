import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Button, Input } from "./Primitives";

// Bloquea el uso de la app hasta tener un nombre de autor — se muestra cada vez que se
// abre la app sin uno guardado; si ya existe, no vuelve a aparecer.
export function ModalNombreRequerido() {
  const setAutorActivo = useAppStore((s) => s.setAutorActivo);
  const [valor, setValor] = useState("");

  function continuar() {
    if (!valor.trim()) return;
    setAutorActivo(valor.trim());
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-lg border border-line max-w-sm w-full p-6 space-y-4">
        <h2 className="text-base font-semibold text-ink">¿Cómo te llamas?</h2>
        <p className="text-sm text-ink-soft leading-relaxed">
          Necesitamos tu nombre para registrar la autoría de lo que crees o edites — la metodología pide que la
          autoría siempre sea visible. Podrás cambiarlo cuando quieras desde la barra superior.
        </p>
        <Input
          autoFocus
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Tu nombre"
          onKeyDown={(e) => e.key === "Enter" && continuar()}
        />
        <Button className="w-full" disabled={!valor.trim()} onClick={continuar}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
