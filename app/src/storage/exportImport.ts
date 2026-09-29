import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { APP_VERSION, VERSION_ESQUEMA } from "../domain/constants";
import { codigoEsencialDeTrabajo } from "../domain/codigo";
import type { Area, ArchivoTrabajo, Categoria, Trabajo } from "../domain/types";
import { archivoTrabajoSchema } from "../domain/validaciones";

export function generarArchivoTrabajo(params: {
  institucion: string;
  departamentoOArea: string;
  autorPrincipal: string;
  areas: Area[];
  categorias: Categoria[];
  trabajos: Trabajo[];
}): ArchivoTrabajo {
  return {
    metadata: {
      institucion: params.institucion,
      departamentoOArea: params.departamentoOArea,
      autorPrincipal: params.autorPrincipal,
      fechaExportacion: new Date().toISOString(),
      versionEsquema: VERSION_ESQUEMA,
      appVersion: APP_VERSION,
    },
    areas: params.areas,
    categorias: params.categorias,
    trabajos: params.trabajos,
  };
}

function nombreArchivo(archivo: ArchivoTrabajo, extension: string): string {
  const base = archivo.metadata.departamentoOArea.trim() || "trabajo";
  const fecha = archivo.metadata.fechaExportacion.slice(0, 10);
  return `nomenclatura-viva_${base}_${fecha}.${extension}`.replace(/\s+/g, "-");
}

export function exportarJSON(archivo: ArchivoTrabajo) {
  const blob = new Blob([JSON.stringify(archivo, null, 2)], { type: "application/json" });
  saveAs(blob, nombreArchivo(archivo, "json"));
}

export function exportarExcel(archivo: ArchivoTrabajo) {
  const wb = XLSX.utils.book_new();

  const hojaTrabajos = archivo.trabajos.map((t) => ({
    Codigo: codigoEsencialDeTrabajo(t),
    Descripcion: t.clave,
    Area: t.areaCodigo,
    Categoria: t.categoria,
    Origen: t.ficha.origen,
    Accion: t.ficha.accion,
    Destino: t.ficha.destino,
    Estado: t.ficha.estadoActual,
    Ubicacion_Tipo: t.ubicacion.tipo,
    Ubicacion_Descripcion: t.ubicacion.descripcion,
    Autor_Creacion: t.autorCreacion,
    Fecha_Creacion: t.fechaCreacion,
    Autor_Ultima_Edicion: t.autorUltimaEdicion,
    Fecha_Ultima_Edicion: t.fechaUltimaEdicion,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hojaTrabajos), "Trabajos");

  const hojaAreas = archivo.areas.map((a) => ({
    Codigo: a.codigo,
    Nombre: a.nombre,
    CorreoContacto: a.correoContacto ?? "",
    Activa: a.activa,
    CreadoPor: a.creadoPor,
    FechaCreacion: a.fechaCreacion,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hojaAreas), "Areas");

  const hojaCategorias = archivo.categorias.map((c) => ({
    Codigo: c.codigo,
    Nombre: c.nombre,
    DeDondeViene: c.deDondeViene,
    ADondeVa: c.aDondeVa,
    CorreoContacto: c.correoContacto ?? "",
    Activa: c.activa,
    CreadoPor: c.creadoPor,
    FechaCreacion: c.fechaCreacion,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hojaCategorias), "Categorias");

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([archivo.metadata]), "Metadata");

  XLSX.writeFile(wb, nombreArchivo(archivo, "xlsx"));
}

export async function leerArchivoJSON(file: File): Promise<ArchivoTrabajo> {
  const texto = await file.text();
  let json: unknown;
  try {
    json = JSON.parse(texto);
  } catch {
    throw new Error("El archivo no es un JSON válido.");
  }
  const resultado = archivoTrabajoSchema.safeParse(json);
  if (!resultado.success) {
    throw new Error(
      "El archivo no tiene el formato esperado de Nomenclatura Viva. Detalle: " + resultado.error.message
    );
  }
  return resultado.data as ArchivoTrabajo;
}
