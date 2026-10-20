import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { APP_VERSION, VERSION_ESQUEMA } from "../domain/constants";
import { codigoDeTrabajo } from "../domain/codigo";
import type { Area, ArchivoTrabajo, Categoria, Trabajo } from "../domain/types";
import { archivoTrabajoSchema } from "../domain/validaciones";

export function generarArchivoTrabajo(params: {
  institucion: string;
  departamentoOArea: string;
  autorPrincipal: string;
  areas: Area[];
  categorias: Categoria[];
  trabajos: Trabajo[];
  tipoArchivo?: "RESPALDO" | "CONFIGURACION";
}): ArchivoTrabajo {
  const tipoArchivo = params.tipoArchivo ?? "RESPALDO";
  return {
    metadata: {
      institucion: params.institucion,
      departamentoOArea: params.departamentoOArea,
      autorPrincipal: params.autorPrincipal,
      fechaExportacion: new Date().toISOString(),
      versionEsquema: VERSION_ESQUEMA,
      appVersion: APP_VERSION,
      tipoArchivo,
    },
    areas: params.areas,
    categorias: params.categorias,
    trabajos: tipoArchivo === "CONFIGURACION" ? [] : params.trabajos,
  };
}

export function esArchivoDeConfiguracion(archivo: ArchivoTrabajo): boolean {
  return archivo.metadata.tipoArchivo === "CONFIGURACION";
}

// Nombres fáciles de reconocer en la carpeta Descargas: dicen qué son y de qué día.
export function nombreArchivo(archivo: ArchivoTrabajo, extension: "json" | "xlsx"): string {
  const fecha = archivo.metadata.fechaExportacion.slice(0, 10);
  if (extension === "xlsx") return `nomenclatura-viva_lista-de-trabajos_${fecha}.xlsx`;
  const que = esArchivoDeConfiguracion(archivo) ? "configuracion" : "respaldo";
  return `${que}-nomenclatura-viva_${fecha}.json`;
}

// Descarga el archivo y devuelve su nombre, para decirle al usuario qué buscar.
export function exportarJSON(archivo: ArchivoTrabajo): string {
  const blob = new Blob([JSON.stringify(archivo, null, 2)], { type: "application/json" });
  const nombre = nombreArchivo(archivo, "json");
  saveAs(blob, nombre);
  return nombre;
}

export function exportarExcel(archivo: ArchivoTrabajo) {
  const wb = XLSX.utils.book_new();

  const hojaTrabajos = archivo.trabajos.map((t) => ({
    Codigo: codigoDeTrabajo(t),
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
    throw new Error("Ese archivo no es un respaldo de esta app. Busca uno que termine en “.json” y empiece con “respaldo-” o “configuracion-”.");
  }
  const resultado = archivoTrabajoSchema.safeParse(json);
  if (!resultado.success) {
    throw new Error(
      "Ese archivo no es de Nomenclatura Viva o está dañado. Prueba con otro respaldo. (Detalle técnico: " + resultado.error.issues[0]?.message + ")"
    );
  }
  return resultado.data as ArchivoTrabajo;
}
