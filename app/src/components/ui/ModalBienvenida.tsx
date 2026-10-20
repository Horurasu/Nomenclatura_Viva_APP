import { useState, type ChangeEvent, type ReactNode } from "react";
import { useAppStore } from "../../store/useAppStore";
import { leerArchivoJSON } from "../../storage/exportImport";
import { Aviso, Ayuda, BotonApp, clasesBoton, type ColorBoton } from "./Estilo";
import { Explicacion } from "./ExplicacionApp";
import { CampoNombreCompleto, limpiarNombre, nombreValido } from "./PedirNombre";

const CLAVE_LOCALSTORAGE = "nv_bienvenida_vista";

export function huboBienvenida(): boolean {
  return localStorage.getItem(CLAVE_LOCALSTORAGE) === "true";
}

function marcarVista() {
  localStorage.setItem(CLAVE_LOCALSTORAGE, "true");
}

type Pantalla = "PORTADA" | "ELEGIR" | "EXPLICACION" | "NOMBRE";

export function ModalBienvenida({ onCerrar }: { onCerrar: () => void }) {
  const reemplazarTodo = useAppStore((s) => s.reemplazarTodo);
  const marcarExportado = useAppStore((s) => s.marcarExportado);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const setAutorActivo = useAppStore((s) => s.setAutorActivo);
  const [nombre, setNombre] = useState(autorActivo);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const listo = nombreValido(nombre);

  function empezarDeCero() {
    if (!listo) return;
    setAutorActivo(limpiarNombre(nombre));
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
      setAutorActivo(limpiarNombre(nombre));
      marcarVista();
      onCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer el archivo.");
    }
    setCargando(false);
    e.target.value = "";
  }

  const [pantalla, setPantalla] = useState<Pantalla>("PORTADA");

  if (pantalla === "PORTADA") {
    return (
      <Fondo>
        <div className="flex flex-col items-center text-center gap-2 py-6 sm:py-10">
          <Plantita grande />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mt-2">
            Nomenclatura <span className="text-emerald-600">Viva</span>
          </h1>
          <p className="text-xl font-semibold text-ink-soft">¡Bienvenida, bienvenido!</p>
          <p className="text-sm text-ink-soft max-w-xs leading-relaxed mt-2">
            Para que tus trabajos y archivos siempre tengan nombre y lugar.
          </p>
        </div>
        <BotonApp tamano="lg" className="w-full" onClick={() => setPantalla("ELEGIR")}>
          Continuar →
        </BotonApp>
      </Fondo>
    );
  }

  if (pantalla === "ELEGIR") {
    return (
      <Fondo>
        <div className="text-center">
          <Plantita />
          <h2 className="text-2xl font-bold tracking-tight text-ink mt-1">¿Qué quieres hacer?</h2>
          <p className="text-sm text-ink-soft mt-1">Si es tu primera vez, te recomendamos ver primero cómo funciona.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <BotonGrande
            color="azul"
            icono="📖"
            titulo="¿Qué es y cómo funciona?"
            texto="Una explicación corta, paso a paso"
            onClick={() => setPantalla("EXPLICACION")}
          />
          <BotonGrande
            color="verde"
            icono="🚀"
            titulo="Ir a la aplicación"
            texto="Ya sé cómo funciona"
            onClick={() => setPantalla("NOMBRE")}
          />
        </div>
        <BotonApp color="blanco" tamano="sm" onClick={() => setPantalla("PORTADA")}>
          ← Atrás
        </BotonApp>
      </Fondo>
    );
  }

  if (pantalla === "EXPLICACION") {
    return (
      <Fondo ancho>
        <Explicacion onSalir={() => setPantalla("ELEGIR")} onTerminar={() => setPantalla("NOMBRE")} />
      </Fondo>
    );
  }

  return (
    <Fondo>
      <BotonApp color="blanco" tamano="sm" onClick={() => setPantalla("ELEGIR")}>
        ← Atrás
      </BotonApp>
      <div className="text-center">
        <Plantita />
        <h2 className="text-2xl font-bold tracking-tight text-ink mt-1">Antes de empezar</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">Escribe tu nombre: así queda registrado quién creó cada trabajo.</p>
      </div>

      <CampoNombreCompleto value={nombre} onChange={setNombre} onEnter={empezarDeCero} />

      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink text-center">{listo ? "¿Cómo quieres empezar?" : "Escribe tu nombre para empezar"}</p>
        <div>
          <BotonApp tamano="lg" className="w-full" onClick={empezarDeCero} disabled={!listo}>
            ✨ Empezar desde cero
          </BotonApp>
          <p className="text-xs text-ink-soft text-center mt-1.5 px-2">
            <strong className="text-ink">Es tu primera vez.</strong> La app arranca vacía y vas registrando tus trabajos.
          </p>
        </div>
        <div>
          <label
            className={`${clasesBoton("blanco", "lg")} w-full cursor-pointer ${cargando || !listo ? "opacity-60 pointer-events-none" : ""}`}
          >
            {cargando ? "Cargando..." : "📂 Ya tengo una copia de respaldo"}
            <input type="file" accept="application/json" className="sr-only" onChange={manejarArchivo} disabled={cargando || !listo} />
          </label>
          <p className="text-xs text-ink-soft text-center mt-1.5 px-2">
            <strong className="text-ink">Ya la usaste antes</strong> (en otra compu o te pasaron un archivo). Elige ese archivo y aparecen
            todos tus trabajos.
          </p>
        </div>
        <Ayuda titulo="¿Cuál elijo?" icono="❓">
          <p>
            <strong className="text-ink">✨ Desde cero:</strong> si nunca has usado Nomenclatura Viva o quieres empezar limpio. Siempre
            podrás cargar una copia más tarde desde <strong>Respaldo</strong> en el inicio.
          </p>
          <p>
            <strong className="text-ink">📂 Copia de respaldo:</strong> es un archivo que termina en <code>.json</code> y se descarga desde
            el botón <strong>Respaldo</strong> de la app. Guarda tus áreas, tipos y trabajos para que no se pierdan o para pasarlos a otra
            computadora.
          </p>
          <p>
            <strong className="text-ink">👥 ¿Un compañero te mandó su configuración?</strong> (empieza con <code>configuracion-</code>)
            También se carga con “Ya tengo una copia de respaldo”: tendrás sus mismas áreas y tipos.
          </p>
          <p>¿No sabes si tienes uno? Elige “Desde cero”, no pierdes nada.</p>
        </Ayuda>
      </div>

      {error && (
        <Aviso tono="peligro" icono="❌">
          {error}
        </Aviso>
      )}
    </Fondo>
  );
}

/* ------------------------------ Piezas de la bienvenida ------------------------------ */

function Fondo({ ancho = false, children }: { ancho?: boolean; children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
      <div className={`bg-app rounded-3xl shadow-2xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5 ${ancho ? "max-w-lg" : "max-w-md"}`}>
        {children}
      </div>
    </div>
  );
}

// Decoración plana (no es botón).
function Plantita({ grande = false }: { grande?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto rounded-full flex items-center justify-center ${grande ? "w-28 h-28 text-7xl" : "w-20 h-20 text-5xl"}`}
      style={{
        background: "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.08) 55%, transparent 72%)",
      }}
    >
      🌿
    </div>
  );
}

function BotonGrande({
  color,
  icono,
  titulo,
  texto,
  onClick,
}: {
  color: ColorBoton;
  icono: string;
  titulo: string;
  texto: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`${clasesBoton(color, "lg")} w-full h-full !flex-col !gap-1 text-center py-5`}>
      <span aria-hidden="true" className="text-4xl leading-none">
        {icono}
      </span>
      <span className="leading-tight">{titulo}</span>
      <span className="text-xs font-normal opacity-90 leading-snug">{texto}</span>
    </button>
  );
}
