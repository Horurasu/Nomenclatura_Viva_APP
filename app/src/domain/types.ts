// Modelo de datos de la Nomenclatura Viva.
// Ver Theory/Nomenclatura_Viva_Manual_Metodologico.md para la definición completa de cada pieza.

// Lista controlada pero extensible: cada departamento agrega las suyas.
export interface Area {
  id: string;
  codigo: string;
  nombre: string;
  correoContacto?: string;
  activa: boolean;
  creadoPor: string;
  fechaCreacion: string; // ISO 8601
}

// Vocabulario de categorías: viene con 8 de fábrica (§23 del manual) pero cada
// institución puede editarlas o agregar las que necesite. Viaja dentro del archivo
// de exportación/importación para que nadie pierda sus categorías al compartir.
export interface Categoria {
  id: string;
  codigo: string;
  nombre: string;
  deDondeViene: string;
  aDondeVa: string;
  correoContacto?: string;
  activa: boolean;
  creadoPor: string;
  fechaCreacion: string;
}

// Semáforo de la ficha de trazabilidad (§24 del manual).
export type EstadoSemaforo = "ROJO" | "AMBAR" | "VERDE";

export interface CambioEstado {
  id: string;
  estado: EstadoSemaforo;
  fecha: string; // ISO 8601
  autor: string; // nunca anonimizado
  nota?: string;
}

// Dónde vive el documento (o el hilo) real que este trabajo describe. La app nunca lo
// almacena, solo registra dónde está. La nomenclatura no es solo para archivos: un
// correo electrónico también puede ser el "documento real" de un trabajo.
export type TipoUbicacion = "FISICO" | "DIGITAL_LOCAL" | "NUBE" | "CORREO" | "OTRO";

export interface Ubicacion {
  tipo: TipoUbicacion;
  descripcion: string;
}

// Ficha de trazabilidad — 5 campos (§19 del manual): origen, acción, destino, estado
// y el propio código (el "puente" se resuelve calculando el código, no se guarda aparte).
export interface FichaTrazabilidad {
  origen: string;
  accion: string;
  destino: string;
  estadoActual: EstadoSemaforo;
  historialEstados: CambioEstado[];
}

// Un trabajo — la entidad central del sistema.
export interface Trabajo {
  id: string;
  areaCodigo: string; // referencia a Area.codigo
  categoria: string; // referencia a Categoria.codigo
  clave: string; // descripción corta del trabajo; también arma el código (máx. LIMITE_CLAVE)

  // Escalabilidad — "el código crece hacia afuera" (§20).
  prefijoInstitucion?: string;
  prefijoRed?: string;

  ficha: FichaTrazabilidad;
  ubicacion: Ubicacion;

  autorCreacion: string;
  fechaCreacion: string;
  autorUltimaEdicion: string;
  fechaUltimaEdicion: string;
}

// Unidad de intercambio: lo que se descarga/carga para respaldar o compartir el trabajo.
// Áreas y categorías viajan aquí para que, al compartir el archivo, el vocabulario
// completo (incluyendo lo que cada departamento haya editado o agregado) viaje también.
export interface ArchivoTrabajo {
  metadata: {
    institucion: string;
    departamentoOArea: string;
    autorPrincipal: string;
    fechaExportacion: string;
    versionEsquema: string;
    appVersion: string;
  };
  areas: Area[];
  categorias: Categoria[];
  trabajos: Trabajo[];
}
