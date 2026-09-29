import { z } from "zod";
import { LIMITE_CLAVE } from "./constants";

export const estadoSemaforoSchema = z.enum(["ROJO", "AMBAR", "VERDE"]);
export const tipoUbicacionSchema = z.enum(["FISICO", "DIGITAL_LOCAL", "NUBE", "CORREO", "OTRO"]);

export const areaSchema = z.object({
  id: z.string(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  correoContacto: z.string().optional(),
  activa: z.boolean(),
  creadoPor: z.string(),
  fechaCreacion: z.string(),
});

export const categoriaSchema = z.object({
  id: z.string(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  deDondeViene: z.string(),
  aDondeVa: z.string(),
  correoContacto: z.string().optional(),
  activa: z.boolean(),
  creadoPor: z.string(),
  fechaCreacion: z.string(),
});

export const cambioEstadoSchema = z.object({
  id: z.string(),
  estado: estadoSemaforoSchema,
  fecha: z.string(),
  autor: z.string(),
  nota: z.string().optional(),
});

export const ubicacionSchema = z.object({
  tipo: tipoUbicacionSchema,
  descripcion: z.string(),
});

export const fichaTrazabilidadSchema = z.object({
  origen: z.string(),
  accion: z.string(),
  destino: z.string(),
  estadoActual: estadoSemaforoSchema,
  historialEstados: z.array(cambioEstadoSchema),
});

export const trabajoSchema = z.object({
  id: z.string(),
  areaCodigo: z.string(),
  categoria: z.string(),
  clave: z.string().max(LIMITE_CLAVE),
  prefijoInstitucion: z.string().optional(),
  prefijoRed: z.string().optional(),
  ficha: fichaTrazabilidadSchema,
  ubicacion: ubicacionSchema,
  autorCreacion: z.string(),
  fechaCreacion: z.string(),
  autorUltimaEdicion: z.string(),
  fechaUltimaEdicion: z.string(),
});

export const archivoTrabajoSchema = z.object({
  metadata: z.object({
    institucion: z.string(),
    departamentoOArea: z.string(),
    autorPrincipal: z.string(),
    fechaExportacion: z.string(),
    versionEsquema: z.string(),
    appVersion: z.string(),
  }),
  areas: z.array(areaSchema),
  categorias: z.array(categoriaSchema),
  trabajos: z.array(trabajoSchema),
});
