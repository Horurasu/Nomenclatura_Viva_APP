import { useState, type ChangeEvent } from "react";
import { useAppStore } from "../../store/useAppStore";
import { exportarExcel, exportarJSON, generarArchivoTrabajo, leerArchivoJSON } from "../../storage/exportImport";
import type { ArchivoTrabajo } from "../../domain/types";
import { Aviso, Ayuda, BotonApp, Campo, EncabezadoPantalla, Seccion, clasesBoton } from "../ui/Estilo";

export function ExportarImportar() {
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const trabajos = useAppStore((s) => s.trabajos);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const reemplazarTodo = useAppStore((s) => s.reemplazarTodo);
  const marcarExportado = useAppStore((s) => s.marcarExportado);
  const cambiosSinExportar = useAppStore((s) => s.cambiosSinExportar);
  const haExportadoAlgunaVez = useAppStore((s) => s.haExportadoAlgunaVez);

  const [institucion, setInstitucion] = useState("");
  const [departamento, setDepartamento] = useState("");
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

  async function manejarSeleccionArchivo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const archivo = await leerArchivoJSON(file);
      setPendiente(archivo);
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
        subtitulo="Guarda una copia de tu información o carga una que ya tengas."
      />

      {/* Estado del respaldo */}
      {trabajos.length > 0 && cambiosSinExportar ? (
        <Aviso tono="cuidado" icono="⚠️">
          <strong>Tienes cambios sin respaldar.</strong> Descarga una copia para no perderlos si se borra el navegador.
        </Aviso>
      ) : haExportadoAlgunaVez ? (
        <Aviso tono="exito" icono="✅">
          <strong>Todo está respaldado.</strong> No hay cambios nuevos desde tu última copia.
        </Aviso>
      ) : null}

      {/* Descargar */}
      <Seccion icono="⬇️" titulo="Guardar una copia" subtitulo="Descarga un archivo con todos tus trabajos, áreas y tipos.">
        <BotonApp
          color="ambar"
          tamano="lg"
          className="w-full"
          onClick={() => {
            exportarJSON(construirArchivo());
            marcarExportado();
          }}
        >
          ⬇️ Descargar mi copia de seguridad
        </BotonApp>
        <BotonApp color="blanco" className="w-full" onClick={() => exportarExcel(construirArchivo())}>
          📊 Descargar en Excel (solo para leer)
        </BotonApp>
        <div className="flex flex-wrap gap-2">
          <Ayuda titulo="Agregar datos de tu institución (opcional)" icono="🏛️">
            <Campo etiqueta="Institución" value={institucion} onChange={(e) => setInstitucion(e.target.value)} placeholder="Ej. Universidad Marista de Querétaro" />
            <Campo etiqueta="Departamento o área" value={departamento} onChange={(e) => setDepartamento(e.target.value)} placeholder="Ej. Biblioteca" />
          </Ayuda>
          <Ayuda titulo="¿Qué se guarda?">
            <p>
              Se guarda la <strong>información de tus trabajos</strong>: códigos, recorrido, áreas y tipos. Tus archivos
              y correos reales no se incluyen; siguen donde ya los tienes.
            </p>
            <p>
              Guarda la <strong>copia de seguridad</strong> en un lugar seguro: es la que puedes volver a cargar aquí. El
              Excel sirve solo para leer o compartir.
            </p>
          </Ayuda>
        </div>
      </Seccion>

      {/* Cargar */}
      <Seccion icono="⬆️" titulo="Cargar una copia" subtitulo="Usa un archivo que hayas descargado antes de esta app.">
        <Aviso tono="cuidado" icono="⚠️">
          Al cargar una copia, <strong>se reemplaza todo</strong> lo que tienes ahora. Si quieres conservarlo, descárgalo
          primero.
        </Aviso>

        {!pendiente ? (
          <label className={`${clasesBoton("blanco", "lg")} w-full cursor-pointer`}>
            📂 Elegir archivo de respaldo
            <input type="file" accept="application/json" onChange={manejarSeleccionArchivo} className="sr-only" />
          </label>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink">Este archivo contiene:</p>
            <div className="grid grid-cols-3 gap-2">
              <Dato numero={pendiente.trabajos.length} etiqueta="trabajos" />
              <Dato numero={pendiente.areas.length} etiqueta="áreas" />
              <Dato numero={pendiente.categorias.length} etiqueta="tipos" />
            </div>
            <p className="text-xs text-ink-soft">
              Guardado el {new Date(pendiente.metadata.fechaExportacion).toLocaleString("es-MX")} por {pendiente.metadata.autorPrincipal}.
            </p>
            <div className="flex gap-2">
              <BotonApp color="ambar" className="flex-1" onClick={confirmarImportacion}>
                Sí, reemplazar todo
              </BotonApp>
              <BotonApp color="blanco" onClick={() => setPendiente(null)}>
                Cancelar
              </BotonApp>
            </div>
          </div>
        )}

        {error && (
          <Aviso tono="peligro" icono="❌">
            {error}
          </Aviso>
        )}
      </Seccion>
    </div>
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
