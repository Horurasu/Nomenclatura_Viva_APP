import { useState, type ChangeEvent } from "react";
import { useAppStore } from "../../store/useAppStore";
import { exportarExcel, exportarJSON, generarArchivoTrabajo, leerArchivoJSON } from "../../storage/exportImport";
import type { ArchivoTrabajo } from "../../domain/types";
import { COLORES_UI } from "../../domain/constants";
import { Button, Card, InfoBox, Input, Label, SectionTitle } from "../ui/Primitives";

export function ExportarImportar() {
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const trabajos = useAppStore((s) => s.trabajos);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const reemplazarTodo = useAppStore((s) => s.reemplazarTodo);
  const marcarExportado = useAppStore((s) => s.marcarExportado);

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
    <div
      className="space-y-6 rounded-lg p-5"
      style={{ backgroundColor: COLORES_UI.respaldo, border: `2px solid ${COLORES_UI.respaldoBorde}` }}
    >
      <div className="flex items-start gap-2 px-1">
        <span className="text-lg">⚠️</span>
        <p className="text-sm font-medium" style={{ color: COLORES_UI.respaldoBorde }}>
          Esta acción es importante para no perder tu avance. Exporta tu configuración periódicamente.
        </p>
      </div>

      <Card className="border-l-2 border-l-ai-400">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">⬇</span>
          <span className="text-xs font-medium uppercase tracking-wider text-ai-600">Exportar (descargar)</span>
        </div>
        <SectionTitle subtitle="Genera un archivo con todo tu trabajo actual para respaldarlo o compartirlo.">
          Descargar mi nomenclatura
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Institución (opcional)</Label>
            <Input value={institucion} onChange={(e) => setInstitucion(e.target.value)} placeholder="Ej. Universidad Marista de Querétaro" />
          </div>
          <div>
            <Label>Departamento o área (opcional)</Label>
            <Input value={departamento} onChange={(e) => setDepartamento(e.target.value)} placeholder="Ej. Biblioteca" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              exportarJSON(construirArchivo());
              marcarExportado();
            }}
          >
            Descargar JSON (respaldo completo)
          </Button>
          <Button variant="secondary" onClick={() => exportarExcel(construirArchivo())}>
            Descargar Excel (para leer)
          </Button>
        </div>
        <p className="text-xs text-ink-faint mt-3 leading-relaxed">
          El JSON es el que debes guardar y volver a cargar aquí después; el Excel es solo para leer o compartir.
          Esto respalda la <strong>configuración de tus trabajos</strong> (códigos, trazabilidad, áreas y
          categorías) — no tus archivos ni correos reales, esos siguen donde ya los tienes.
        </p>
      </Card>

      <Card className="border-l-2 border-l-kaki-400">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">⬆</span>
          <span className="text-xs font-medium uppercase tracking-wider text-kaki-600">Importar (cargar)</span>
        </div>
        <SectionTitle subtitle="Carga un archivo JSON que hayas descargado antes de esta misma app.">Cargar mi nomenclatura</SectionTitle>
        <InfoBox tono="warning">
          Al importar, se reemplaza todo lo que tienes guardado en este navegador por el contenido del archivo. Si
          quieres conservar lo que tienes ahora, descárgalo primero (arriba).
        </InfoBox>
        <div className="mt-4">
          <input type="file" accept="application/json" onChange={manejarSeleccionArchivo} className="text-sm text-ink-soft" />
        </div>
        {error && <p className="text-sm text-terracotta-600 mt-2">{error}</p>}
        {pendiente && (
          <div className="mt-4 border border-line rounded-md p-4 bg-white">
            <p className="text-sm text-ink-soft leading-relaxed">
              Este archivo tiene <strong className="text-ink">{pendiente.trabajos.length}</strong> trabajos,{" "}
              <strong className="text-ink">{pendiente.areas.length}</strong> áreas y{" "}
              <strong className="text-ink">{pendiente.categorias.length}</strong> categorías, exportado el{" "}
              {new Date(pendiente.metadata.fechaExportacion).toLocaleString("es-MX")} por {pendiente.metadata.autorPrincipal}.
            </p>
            <div className="flex gap-2 mt-3">
              <Button onClick={confirmarImportacion}>Sí, reemplazar con este archivo</Button>
              <Button variant="ghost" onClick={() => setPendiente(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
