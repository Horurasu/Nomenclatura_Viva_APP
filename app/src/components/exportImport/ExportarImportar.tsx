import { useState, type ChangeEvent, type ReactNode } from "react";
import { useAppStore } from "../../store/useAppStore";
import { esArchivoDeConfiguracion, exportarExcel, exportarJSON, generarArchivoTrabajo, leerArchivoJSON, nombreArchivo } from "../../storage/exportImport";
import type { ArchivoTrabajo } from "../../domain/types";
import { Aviso, Ayuda, BotonApp, Campo, EncabezadoPantalla, Panel, Pestanas, Seccion, clasesBoton } from "../ui/Estilo";
import { ComoPasarArchivo } from "../ui/ComoPasarArchivo";

type Pestana = "GUARDAR" | "CARGAR" | "CAMBIAR";

// "hoy", "ayer", "hace 5 días"…
export function haceCuanto(iso: string): string {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dia = new Date(iso);
  dia.setHours(0, 0, 0, 0);
  const dias = Math.round((hoy.getTime() - dia.getTime()) / 86_400_000);
  if (dias <= 0) return "hoy";
  if (dias === 1) return "ayer";
  return `hace ${dias} días`;
}

export function ExportarImportar() {
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const trabajos = useAppStore((s) => s.trabajos);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const reemplazarTodo = useAppStore((s) => s.reemplazarTodo);
  const marcarExportado = useAppStore((s) => s.marcarExportado);
  const cambiosSinExportar = useAppStore((s) => s.cambiosSinExportar);
  const fechaUltimoRespaldo = useAppStore((s) => s.fechaUltimoRespaldo);
  const irA = useAppStore((s) => s.irA);

  const [pestana, setPestana] = useState<Pestana>("GUARDAR");
  const [institucion, setInstitucion] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [descargado, setDescargado] = useState<string | null>(null);
  const [pendiente, setPendiente] = useState<ArchivoTrabajo | null>(null);
  const [error, setError] = useState("");

  function construirArchivo(): ArchivoTrabajo {
    return generarArchivoTrabajo({
      institucion,
      departamentoOArea: departamento,
      autorPrincipal: autorActivo || "Sin nombre",
      areas,
      categorias,
      trabajos,
    });
  }
  const nombreEsperado = descargado ?? nombreArchivo(construirArchivo(), "json");

  function descargar() {
    setDescargado(exportarJSON(construirArchivo()));
    marcarExportado();
  }

  async function manejarSeleccionArchivo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      setPendiente(await leerArchivoJSON(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer el archivo.");
    }
    e.target.value = "";
  }

  async function confirmarImportacion() {
    if (!pendiente) return;
    await reemplazarTodo(pendiente);
    setPendiente(null);
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      <EncabezadoPantalla
        icono="💾"
        color="ambar"
        titulo="Respaldo"
        subtitulo="Una copia de tu información, para no perderla y llevarla a otra computadora."
      />

      {/* Estado del respaldo */}
      {trabajos.length > 0 && cambiosSinExportar ? (
        <Aviso tono="cuidado" icono="⚠️">
          <strong>Tienes cambios sin respaldar.</strong>{" "}
          {fechaUltimoRespaldo ? `Tu último respaldo fue ${haceCuanto(fechaUltimoRespaldo)}.` : "Todavía no has hecho ningún respaldo."}
        </Aviso>
      ) : fechaUltimoRespaldo ? (
        <Aviso tono="exito" icono="✅">
          <strong>Todo está respaldado.</strong> Tu último respaldo fue {haceCuanto(fechaUltimoRespaldo)}.
        </Aviso>
      ) : null}

      {/* Por qué importa, a la vista */}
      <Panel className="bg-white space-y-3">
        <p className="text-sm text-ink-soft leading-relaxed">
          <strong className="text-ink">¿Por qué respaldar?</strong> Tu información se guarda <strong>solo en este navegador</strong>{" "}
          de esta computadora. Si borras el historial, cambias de computadora o de navegador, se pierde. El respaldo es{" "}
          <strong>un archivo que guardas tú</strong>, como una fotocopia de todo.
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Etapa icono="⬇️" texto="1. Lo descargas" />
          <Etapa icono="🔒" texto="2. Lo guardas en un lugar seguro" />
          <Etapa icono="⬆️" texto="3. Lo cargas cuando lo necesites" />
        </div>
      </Panel>

      <Pestanas<Pestana>
        valor={pestana}
        onCambiar={setPestana}
        opciones={[
          { valor: "GUARDAR", etiqueta: "⬇️ Guardar" },
          { valor: "CARGAR", etiqueta: "⬆️ Cargar" },
          { valor: "CAMBIAR", etiqueta: "🔁 Otra compu" },
        ]}
      />

      {/* ---------------- Guardar ---------------- */}
      {pestana === "GUARDAR" && (
        <>
          <Seccion icono="1️⃣" titulo="Descarga tu respaldo" subtitulo="Un archivo con todos tus trabajos, áreas y tipos.">
            <BotonApp color="ambar" tamano="lg" className="w-full" onClick={descargar}>
              ⬇️ Descargar mi respaldo
            </BotonApp>
            {descargado ? (
              <Aviso tono="exito" icono="✅">
                <strong>¡Listo!</strong> Se guardó en tu carpeta <strong>Descargas</strong> con el nombre:
                <span className="block font-mono text-xs mt-1 break-all">{descargado}</span>
              </Aviso>
            ) : (
              <p className="text-xs text-ink-soft">Se guarda en tu carpeta <strong>Descargas</strong>. El nombre lleva la fecha de hoy.</p>
            )}
            <Ayuda titulo="Agregar datos de tu institución (opcional)" icono="🏛️">
              <Campo etiqueta="Institución" value={institucion} onChange={(e) => setInstitucion(e.target.value)} placeholder="Ej. Universidad Marista de Querétaro" />
              <Campo etiqueta="Departamento o área" value={departamento} onChange={(e) => setDepartamento(e.target.value)} placeholder="Ej. Biblioteca" />
            </Ayuda>
          </Seccion>

          <Seccion icono="2️⃣" titulo="Guárdalo en un lugar seguro" subtitulo="Si solo queda en esta computadora y se descompone, se pierde. Elige cómo:">
            <ComoPasarArchivo nombreArchivo={nombreEsperado} />
          </Seccion>

          <p className="text-sm text-ink-soft flex gap-2 px-1">
            <span aria-hidden="true">📅</span>
            <span>
              Hazlo <strong>cada viernes</strong> o cuando registres varios trabajos. Cada respaldo lleva la fecha en su nombre:
              el más nuevo es el que vale.
            </span>
          </p>

          <Seccion plegable icono="📊" titulo="Lista en Excel" subtitulo="Para imprimir o compartir. No sirve para volver a cargar.">
            <BotonApp color="blanco" className="w-full" onClick={() => exportarExcel(construirArchivo())}>
              📊 Descargar lista en Excel
            </BotonApp>
          </Seccion>
        </>
      )}

      {/* ---------------- Cargar ---------------- */}
      {pestana === "CARGAR" && (
        <Seccion icono="⬆️" titulo="Cargar un respaldo" subtitulo="Úsalo si cambiaste de computadora o de navegador, o si se borró tu información.">
          <ol className="space-y-3">
            <PasoNumerado numero={1} titulo="Ten el archivo en esta computadora">
              Si lo guardaste en una USB, tu correo, Drive o WhatsApp, primero descárgalo o cópialo. Normalmente queda en{" "}
              <strong>Descargas</strong>.
            </PasoNumerado>
            <PasoNumerado numero={2} titulo="Toca “Elegir mi respaldo” y búscalo">
              Su nombre empieza con <strong className="font-mono">respaldo-nomenclatura-viva_</strong> y tiene la fecha. Si hay
              varios, elige el de <strong>fecha más reciente</strong>.
            </PasoNumerado>
            <PasoNumerado numero={3} titulo="Revisa lo que trae y confirma">
              Te mostramos cuántos trabajos tiene antes de cargarlo.
            </PasoNumerado>
          </ol>

          {trabajos.length > 0 && !pendiente && (
            <Aviso tono="cuidado" icono="⚠️">
              Al cargar un respaldo, <strong>se reemplaza todo</strong> lo que tienes ahora ({trabajos.length}{" "}
              {trabajos.length === 1 ? "trabajo" : "trabajos"}). Si quieres conservarlo, primero descarga tu respaldo.
            </Aviso>
          )}

          {!pendiente ? (
            <label className={`${clasesBoton("ambar", "lg")} w-full cursor-pointer`}>
              📂 Elegir mi respaldo
              <input type="file" accept=".json,application/json" onChange={manejarSeleccionArchivo} className="sr-only" />
            </label>
          ) : esArchivoDeConfiguracion(pendiente) ? (
            <Aviso
              tono="info"
              icono="⚙️"
              accion={
                <BotonApp color="morado" tamano="sm" onClick={() => irA("CONFIGURACION")}>
                  Ir a Configuración
                </BotonApp>
              }
            >
              Este archivo es de <strong>configuración</strong> (solo trae áreas y tipos, sin trabajos). Cárgalo en
              Configuración: ahí se suman sin borrar nada.
            </Aviso>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-ink">Este respaldo contiene:</p>
              <div className="grid grid-cols-3 gap-2">
                <Dato numero={pendiente.trabajos.length} etiqueta="trabajos" />
                <Dato numero={pendiente.areas.length} etiqueta="áreas" />
                <Dato numero={pendiente.categorias.length} etiqueta="tipos" />
              </div>
              <p className="text-xs text-ink-soft">
                Guardado {haceCuanto(pendiente.metadata.fechaExportacion)} ({new Date(pendiente.metadata.fechaExportacion).toLocaleString("es-MX")}) por{" "}
                {pendiente.metadata.autorPrincipal}.
              </p>
              {pendiente.trabajos.length < trabajos.length && (
                <Aviso tono="cuidado" icono="🤔">
                  Este respaldo tiene <strong>menos trabajos</strong> ({pendiente.trabajos.length}) de los que tienes ahora (
                  {trabajos.length}). ¿Seguro que es el más reciente?
                </Aviso>
              )}
              <div className="flex gap-2">
                <BotonApp color="ambar" className="flex-1" onClick={confirmarImportacion}>
                  Sí, cargar este respaldo
                </BotonApp>
                <BotonApp color="blanco" onClick={() => setPendiente(null)}>
                  Cancelar
                </BotonApp>
              </div>
            </div>
          )}

          {pendiente && esArchivoDeConfiguracion(pendiente) && (
            <BotonApp color="blanco" onClick={() => setPendiente(null)}>
              Elegir otro archivo
            </BotonApp>
          )}

          {error && (
            <Aviso tono="peligro" icono="❌">
              {error}
            </Aviso>
          )}
        </Seccion>
      )}

      {/* ---------------- Cambiar de computadora ---------------- */}
      {pestana === "CAMBIAR" && (
        <>
          <Seccion icono="💻" titulo="En la computadora de antes" subtitulo="Donde ya tienes tus trabajos.">
            <ol className="space-y-3">
              <PasoNumerado numero={1} titulo="Descarga tu respaldo">
                En la pestaña <strong>⬇️ Guardar</strong>, toca <strong>“Descargar mi respaldo”</strong>.
                <span className="block mt-2">
                  <BotonApp color="ambar" tamano="sm" onClick={descargar}>
                    ⬇️ Descargarlo ahora
                  </BotonApp>
                </span>
              </PasoNumerado>
              <PasoNumerado numero={2} titulo="Pásalo a la otra computadora">
                Elige cómo:
              </PasoNumerado>
            </ol>
            <ComoPasarArchivo nombreArchivo={nombreEsperado} />
          </Seccion>

          <Seccion icono="🆕" titulo="En la computadora nueva" subtitulo="O en el otro navegador.">
            <ol className="space-y-3">
              <PasoNumerado numero={1} titulo="Abre esta misma app">
                Usa la misma dirección de internet que usas aquí.
              </PasoNumerado>
              <PasoNumerado numero={2} titulo="Carga el respaldo">
                Si es la primera vez, en la bienvenida toca <strong>“Ya tengo una copia de respaldo”</strong>. Si no, entra a{" "}
                <strong>Respaldo → ⬆️ Cargar</strong>.
              </PasoNumerado>
              <PasoNumerado numero={3} titulo="¡Listo!">
                Aparecen tus trabajos, tus áreas y tus tipos, igual que aquí.
              </PasoNumerado>
            </ol>
          </Seccion>

          <p className="text-sm text-ink-soft flex gap-2 px-1">
            <span aria-hidden="true">💡</span>
            <span>
              ¿Cambias de navegador en la misma computadora (por ejemplo, de Chrome a Edge)? El archivo ya está en{" "}
              <strong>Descargas</strong>: solo cárgalo en el otro navegador.
            </span>
          </p>
          <Aviso
            tono="info"
            icono="👥"
            accion={
              <BotonApp color="morado" tamano="sm" onClick={() => irA("CONFIGURACION")}>
                Ir a Configuración
              </BotonApp>
            }
          >
            ¿Solo quieres pasarle <strong>tus áreas y tipos</strong> a un compañero, sin tus trabajos? Hazlo desde Configuración.
          </Aviso>
        </>
      )}
    </div>
  );
}

function Etapa({ icono, texto }: { icono: string; texto: string }) {
  return (
    <div className="rounded-xl bg-amber-50 px-2 py-2.5">
      <p className="text-2xl leading-none" aria-hidden="true">
        {icono}
      </p>
      <p className="text-[11px] text-ink-soft mt-1.5 leading-tight">{texto}</p>
    </div>
  );
}

export function PasoNumerado({ numero, titulo, children }: { numero: number; titulo: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden="true" className="shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-bold">
        {numero}
      </span>
      <div className="flex-1 min-w-0 text-sm text-ink-soft leading-relaxed">
        <p className="font-semibold text-ink">{titulo}</p>
        {children}
      </div>
    </li>
  );
}

function Dato({ numero, etiqueta }: { numero: number; etiqueta: string }) {
  return (
    <div className="rounded-xl bg-app px-3 py-3 text-center">
      <p className="text-2xl font-bold text-ink leading-none">{numero}</p>
      <p className="text-xs text-ink-soft mt-1">{etiqueta}</p>
    </div>
  );
}
