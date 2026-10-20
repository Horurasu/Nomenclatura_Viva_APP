import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Inicio } from "../inicio/Inicio";
import { WizardCrearTrabajo } from "../wizard/WizardCrearTrabajo";
import { Tablero } from "../dashboard/Tablero";
import { FichaDetalle } from "../detalle/FichaDetalle";
import { ExportarImportar } from "../exportImport/ExportarImportar";
import { Configuracion } from "../configuracion/Configuracion";
import { ModalBienvenida, huboBienvenida } from "../ui/ModalBienvenida";
import { ModalNombre } from "../ui/PedirNombre";
import { CampoNombre } from "./CampoNombre";

export function AppShell() {
  const vista = useAppStore((s) => s.vista);
  const irA = useAppStore((s) => s.irA);
  const cambiosSinExportar = useAppStore((s) => s.cambiosSinExportar);
  const totalTrabajos = useAppStore((s) => s.trabajos.length);

  const [mostrarBienvenida, setMostrarBienvenida] = useState(!huboBienvenida());

  // Advertencia nativa del navegador si intentas cerrar/recargar con cambios sin
  // respaldar — la app nunca guarda nada en un servidor, así que perderlos sería
  // irreversible.
  useEffect(() => {
    function manejar(e: BeforeUnloadEvent) {
      if (cambiosSinExportar && totalTrabajos > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", manejar);
    return () => window.removeEventListener("beforeunload", manejar);
  }, [cambiosSinExportar, totalTrabajos]);


  return (
    <div className="min-h-screen flex flex-col">
      {mostrarBienvenida ? <ModalBienvenida onCerrar={() => setMostrarBienvenida(false)} /> : <ModalNombre />}

      <div className="sticky top-0 z-30 bg-app">
        <header className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => irA("INICIO")}
            // Mismo lenguaje que los botones del menú: degradado, borde inferior con
            // volumen, se levanta al pasar el mouse y se hunde al presionar.
            className="group flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-br from-emerald-400 to-emerald-600 border-b-4 border-emerald-800/50
              shadow-md shadow-emerald-700/30 transition-all duration-150
              hover:from-emerald-300 hover:to-emerald-500 hover:-translate-y-0.5 hover:shadow-lg
              active:translate-y-0.5 active:border-b-2 active:shadow-sm
              focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          >
            <span className="w-8 h-8 rounded-lg bg-white/25 ring-1 ring-white/40 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M4 11.5 12 5l8 6.5" />
                <path d="M6 10v8.5A1.5 1.5 0 0 0 7.5 20H10v-5h4v5h2.5a1.5 1.5 0 0 0 1.5-1.5V10" />
              </svg>
            </span>
            <span className="drop-shadow-sm">Inicio</span>
          </button>

          <CampoNombre />
        </header>
      </div>

      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {vista === "INICIO" && <Inicio />}
        {vista === "NUEVO_TRABAJO" && <WizardCrearTrabajo />}
        {vista === "TABLERO" && <Tablero />}
        {vista === "DETALLE" && <FichaDetalle />}
        {vista === "EXPORTAR_IMPORTAR" && <ExportarImportar />}
        {vista === "CONFIGURACION" && <Configuracion />}
      </main>

    </div>
  );
}
