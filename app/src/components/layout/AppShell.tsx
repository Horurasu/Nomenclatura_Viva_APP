import { useEffect, useState } from "react";
import { useAppStore, type Vista } from "../../store/useAppStore";
import { Inicio } from "../inicio/Inicio";
import { WizardCrearTrabajo } from "../wizard/WizardCrearTrabajo";
import { Tablero } from "../dashboard/Tablero";
import { FichaDetalle } from "../detalle/FichaDetalle";
import { ExportarImportar } from "../exportImport/ExportarImportar";
import { Configuracion } from "../configuracion/Configuracion";
import { Button, Input } from "../ui/Primitives";
import { ModalBienvenida, huboBienvenida } from "../ui/ModalBienvenida";
import { ModalNombreRequerido } from "../ui/ModalNombreRequerido";
import { COLORES_UI } from "../../domain/constants";

const NAV_ITEMS: { vista: Vista; etiqueta: string; icono: string }[] = [
  { vista: "INICIO", etiqueta: "Inicio", icono: "🏠" },
  { vista: "NUEVO_TRABAJO", etiqueta: "Nuevo trabajo", icono: "✨" },
  { vista: "TABLERO", etiqueta: "Tablero", icono: "📋" },
  { vista: "EXPORTAR_IMPORTAR", etiqueta: "Respaldo", icono: "💾" },
  { vista: "CONFIGURACION", etiqueta: "Configuración", icono: "⚙️" },
];

// El detalle de un trabajo se abre desde el Tablero, así que ese botón se ve
// "activo" también ahí — para que siempre quede claro en qué parte de la app estás.
function estaActivo(item: Vista, vistaActual: Vista) {
  if (item === "TABLERO") return vistaActual === "TABLERO" || vistaActual === "DETALLE";
  return item === vistaActual;
}

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function AppShell() {
  const vista = useAppStore((s) => s.vista);
  const irA = useAppStore((s) => s.irA);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const setAutorActivo = useAppStore((s) => s.setAutorActivo);
  const cambiosSinExportar = useAppStore((s) => s.cambiosSinExportar);
  const totalTrabajos = useAppStore((s) => s.trabajos.length);

  const [mostrarBienvenida, setMostrarBienvenida] = useState(!huboBienvenida());
  const [editandoNombre, setEditandoNombre] = useState(false);

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

  const enDetalle = vista === "DETALLE";

  return (
    <div className="min-h-screen flex flex-col">
      {!autorActivo ? (
        <ModalNombreRequerido />
      ) : (
        mostrarBienvenida && <ModalBienvenida onCerrar={() => setMostrarBienvenida(false)} />
      )}

      <div className="sticky top-0 z-30">
        <header
          className="px-6 py-3 flex flex-wrap items-center gap-4 justify-between transition-colors"
          style={{ backgroundColor: enDetalle ? COLORES_UI.navbarTrabajo : COLORES_UI.navbarNormal }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🌿</span>
            <span className="font-medium tracking-tight text-white">Nomenclatura Viva</span>
          </div>

          <nav className="flex flex-wrap gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.vista}
                onClick={() => irA(item.vista)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  estaActivo(item.vista, vista) ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.icono}</span>
                <span>{item.etiqueta}</span>
              </button>
            ))}
          </nav>

          <div className="relative">
            {editandoNombre ? (
              <div className="w-48">
                <Input
                  autoFocus
                  placeholder="Escribe tu nombre..."
                  value={autorActivo}
                  onChange={(e) => setAutorActivo(e.target.value)}
                  onBlur={() => setEditandoNombre(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditandoNombre(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setEditandoNombre(true)}
                title={autorActivo ? `${autorActivo} — clic para cambiar tu nombre` : "Clic para escribir tu nombre (quedará como autor)"}
                className="flex items-center gap-2 px-2 py-1 rounded-md transition-colors hover:bg-white/10"
              >
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-white/20 text-white">
                  {iniciales(autorActivo || "?")}
                </span>
                <span className="text-sm text-white hidden sm:inline">{autorActivo || "Sin nombre"}</span>
              </button>
            )}
          </div>
        </header>

        {enDetalle && (
          <div className="bg-moss-600 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <span className="text-xs text-white/90">📄 Estás dentro de un trabajo (no en el tablero general).</span>
            <Button
              variant="secondary"
              className="!bg-white !text-moss-700 !border-white hover:!bg-moss-50 text-xs !py-1"
              onClick={() => irA("TABLERO")}
            >
              ← Volver al tablero
            </Button>
          </div>
        )}
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6">
        {vista === "INICIO" && <Inicio />}
        {vista === "NUEVO_TRABAJO" && <WizardCrearTrabajo />}
        {vista === "TABLERO" && <Tablero />}
        {vista === "DETALLE" && <FichaDetalle />}
        {vista === "EXPORTAR_IMPORTAR" && <ExportarImportar />}
        {vista === "CONFIGURACION" && <Configuracion />}
      </main>

      <footer className="bg-ink text-paper/70 text-xs px-6 py-2.5 text-center border-t border-ink">
        Esta aplicación no guarda ni gestiona tus archivos ni tus correos. Tú organizas tus carpetas y documentos
        donde ya los manejas — esta herramienta solo ayuda a nombrar, clasificar y dar trazabilidad a tu trabajo.
      </footer>
    </div>
  );
}
