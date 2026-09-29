import type { EstadoSemaforo, TipoUbicacion } from "./types";

// Semilla de las 8 categorías (§23 del manual). Es solo el punto de partida: desde
// Configuración se pueden editar o agregar más, y viajan dentro del archivo de
// exportación/importación.
export interface CategoriaSeed {
  codigo: string;
  nombre: string;
  deDondeViene: string;
  aDondeVa: string;
}

export const CATEGORIAS_SEED: CategoriaSeed[] = [
  { codigo: "PROY", nombre: "Proyectos", deDondeViene: "Iniciativa propia o línea de trabajo", aDondeVa: "Plataforma, producto, metodología" },
  { codigo: "CONV", nombre: "Convenios", deDondeViene: "Necesidad de vinculación interinstitucional", aDondeVa: "Acuerdo firmado y vigente" },
  { codigo: "COLAB", nombre: "Colaboraciones", deDondeViene: "Redes, líneas de trabajo, contactos", aDondeVa: "Productos conjuntos, estancias, eventos" },
  { codigo: "PROD", nombre: "Producción", deDondeViene: "Resultados de un trabajo", aDondeVa: "Documento, informe o publicación" },
  { codigo: "DIVU", nombre: "Divulgación", deDondeViene: "Un producto ya listo para mostrar", aDondeVa: "Ponencia, evento, redes" },
  { codigo: "ACAD", nombre: "Gestión académica", deDondeViene: "Requerimiento normativo o curricular", aDondeVa: "Registro, materia, programa" },
  { codigo: "ADM", nombre: "Administración", deDondeViene: "Necesidad operativa interna", aDondeVa: "Plan, sitio, recurso gestionado" },
  { codigo: "APOYO", nombre: "Apoyo a áreas", deDondeViene: "Solicitud de otra área", aDondeVa: "Servicio o insumo entregado" },
];

export const SEMAFORO_INFO: Record<EstadoSemaforo, { emoji: string; etiqueta: string }> = {
  ROJO: { emoji: "🔴", etiqueta: "Por iniciar" },
  AMBAR: { emoji: "🟡", etiqueta: "En curso" },
  VERDE: { emoji: "🟢", etiqueta: "Concluido" },
};

export const UBICACION_INFO: Record<TipoUbicacion, { icono: string; etiqueta: string; descripcion: string }> = {
  FISICO: { icono: "🗄️", etiqueta: "Físico", descripcion: "Papel, archivero, carpeta física" },
  DIGITAL_LOCAL: { icono: "💻", etiqueta: "Digital local", descripcion: "Tu computadora o un servidor propio" },
  NUBE: { icono: "☁️", etiqueta: "Nube", descripcion: "Drive, OneDrive, SharePoint..." },
  CORREO: { icono: "📧", etiqueta: "Correo electrónico", descripcion: "Vive en una bandeja, no en una carpeta" },
  OTRO: { icono: "📌", etiqueta: "Otro", descripcion: "Cualquier otro medio" },
};

// Ejemplos didácticos para el paso "Clave": la nomenclatura no es solo para archivos —
// también sirve para correos, reuniones o trámites. Cada ejemplo se puede usar como
// punto de partida con un clic.
export interface EjemploClave {
  icono: string;
  titulo: string;
  ejemplo: string;
  tip: string;
}

export const EJEMPLOS_CLAVE: EjemploClave[] = [
  {
    icono: "📧",
    titulo: "Si vas a escribir o dar seguimiento a un correo",
    ejemplo: "Seguimiento convenio Universidad XYZ",
    tip: "Escribe la clave como si fuera el asunto del correo — con eso ya tienes el asunto sugerido para todo el hilo.",
  },
  {
    icono: "📁",
    titulo: "Si es un archivo o documento",
    ejemplo: "Catálogo de libros 2026",
    tip: "Piensa en cómo lo buscarías después en tu computadora o en la nube.",
  },
  {
    icono: "🗓️",
    titulo: "Si es una reunión o evento",
    ejemplo: "Reunión trimestral marzo 2026",
    tip: "Incluye una referencia de tiempo para diferenciarla de reuniones futuras.",
  },
  {
    icono: "📝",
    titulo: "Si es un trámite o gestión",
    ejemplo: "Solicitud de equipo de cómputo",
    tip: "Describe la acción, no solo el objeto — mejor 'Solicitud de...' que solo 'Equipo'.",
  },
];

// Ayuda basada en la metodología (§27): incluso sin herramientas, se puede aplicar la
// Nomenclatura Viva nombrando carpetas y archivos con el código. Usa el área y la
// categoría del propio trabajo para sugerir una estructura concreta de carpetas —
// física, digital o en la nube— y no solo para archivos: un correo también cuenta.
export const UBICACION_AYUDA: Record<TipoUbicacion, (codigo: string, areaCodigo: string, categoria: string) => string> = {
  FISICO: (codigo, area, categoria) =>
    `Organiza tus archiveros como el código: un cajón o carpeta colgante para el área "${area}", y dentro divisores por categoría (ej. "${categoria}"). Guarda el documento ahí y etiquétalo con "${codigo}" bien visible en el lomo o la portada, para reconocerlo sin abrirlo.`,
  DIGITAL_LOCAL: (codigo, area, categoria) =>
    `Crea una carpeta por área y, dentro, una subcarpeta por categoría: /${area}/${categoria}/. Guarda el archivo ahí nombrado igual que el código, por ejemplo "${codigo}.pdf" o "${codigo}.docx" — así lo encuentras con solo buscar ese texto en tu computadora.`,
  NUBE: (codigo, area, categoria) =>
    `Usa la misma lógica en tu Drive/OneDrive: una carpeta raíz por área ("${area}") y, dentro, una por categoría ("${categoria}"). Nombra el archivo o la subcarpeta como "${codigo}" — cualquier compañero con acceso lo encuentra buscando ese texto, sin importar cómo tenga organizada su propia vista.`,
  CORREO: (codigo) =>
    `Un correo no vive en una carpeta, vive en una bandeja — aquí lo importante es el asunto, no dónde lo guardas. Usa siempre "${codigo}" como parte del asunto de tus correos sobre este trabajo (la sección "Correo y trazabilidad" más abajo te arma el asunto completo). Así encuentras todo el hilo buscando ese texto, sin importar cuántas respuestas tenga.`,
  OTRO: (codigo) =>
    `Anota junto al trabajo, con tus propias palabras, cómo encontrarlo — usa "${codigo}" como referencia para que quede buscable sin importar el medio.`,
};

export const ACCIONES_SUGERIDAS = [
  "Construir",
  "Operar",
  "Difundir",
  "Producir",
  "Gestionar",
  "Apoyar",
  "Coordinar",
  "Revisar",
];

// Regla de oro §33.3: la clave (que ahora también describe el trabajo) se mantiene
// corta y legible.
export const LIMITE_CLAVE = 40;

export const VERSION_ESQUEMA = "1.1.0";
export const APP_VERSION = "0.2.0";
