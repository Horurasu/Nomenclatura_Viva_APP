import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import { AppShell } from "./components/layout/AppShell";

export default function App() {
  const cargando = useAppStore((s) => s.cargando);
  const inicializar = useAppStore((s) => s.inicializar);

  useEffect(() => {
    inicializar();
  }, [inicializar]);

  if (cargando) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-ink-faint text-sm">Cargando tu nomenclatura...</div>;
  }

  return <AppShell />;
}
