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

export const SEMAFORO_INFO: Record<EstadoSemaforo, { emoji: string; etiqueta: string; bg: string; texto: string }> = {
  ROJO: { emoji: "🔴", etiqueta: "Por iniciar", bg: "#fee2e2", texto: "#991b1b" },
  AMBAR: { emoji: "🟡", etiqueta: "En curso", bg: "#fef3c7", texto: "#92400e" },
  VERDE: { emoji: "🟢", etiqueta: "Concluido", bg: "#d1fae5", texto: "#065f46" },
};

// Paleta institucional exacta pedida para navbar, fondos por sección y estados.
export const COLORES_UI = {
  fondoPagina: "#f8fafc",
  navbarNormal: "#1e3a5f",
  navbarTrabajo: "#3730a3",
  inicio: "#ffffff",
  pasoArea: "#f0f9ff",
  pasoCategoria: "#ecfdf5",
  pasoClave: "#fffbeb",
  pasoClaveBorde: "#f59e0b",
  pasoTrazabilidad: "#faf5ff",
  pasoEscalabilidad: "#ecfdf5",
  pasoResumen: "#f8fafc",
  respaldo: "#fff7ed",
  respaldoBorde: "#f97316",
  exito: "#10b981",
  advertencia: "#f59e0b",
  error: "#ef4444",
} as const;

export const UBICACION_INFO: Record<TipoUbicacion, { icono: string; etiqueta: string; descripcion: string }> = {
  FISICO: { icono: "🗄️", etiqueta: "Físico", descripcion: "Papel, archivero, carpeta física" },
  DIGITAL_LOCAL: { icono: "💻", etiqueta: "Digital local", descripcion: "Tu computadora o un servidor propio" },
  NUBE: { icono: "☁️", etiqueta: "Nube", descripcion: "Drive, OneDrive, SharePoint..." },
  CORREO: { icono: "📧", etiqueta: "Correo electrónico", descripcion: "Vive en una bandeja, no en una carpeta" },
  OTRO: { icono: "📌", etiqueta: "Otro", descripcion: "Cualquier otro medio" },
};

// Generador de ideas para la Clave: categorías de trabajo típicas, cada una con un
// formato sugerido y un ejemplo completo listo para usar como punto de partida.
export interface FormatoClave {
  categoria: string;
  ejemplos: string[];
  formato: string;
  ejemploCompleto: string;
  etiquetaBoton: string;
}

export const GENERADOR_CLAVE: FormatoClave[] = [
  {
    categoria: "Eventos académicos",
    ejemplos: ["CONGRESO", "JORNADA", "SEMINARIO", "TALLER", "WEBINAR"],
    formato: "[TIPO]-[AÑO]",
    ejemploCompleto: "CONGRESO-2025",
    etiquetaBoton: "Usar formato para eventos",
  },
  {
    categoria: "Correos y comunicados",
    ejemplos: ["CIRCULAR", "AVISO", "CONVOCATORIA", "INVITACION"],
    formato: "[TIPO]-[DESTINATARIO]",
    ejemploCompleto: "CIRCULAR-DOCENTES",
    etiquetaBoton: "Usar formato para comunicados",
  },
  {
    categoria: "Documentos administrativos",
    ejemplos: ["SOLICITUD", "REPORTE", "MEMORANDUM", "OFICIO"],
    formato: "[TIPO]-[AREA]",
    ejemploCompleto: "SOLICITUD-BIBLIO",
    etiquetaBoton: "Usar formato para administrativos",
  },
  {
    categoria: "Productos digitales",
    ejemplos: ["VIDEO", "PODCAST", "ENTRADA-BLOG", "INFOGRAFIA"],
    formato: "[MEDIO]-[TEMA]",
    ejemploCompleto: "VIDEO-CATALOGO",
    etiquetaBoton: "Usar formato para digitales",
  },
  {
    categoria: "Proyectos de área",
    ejemplos: ["CATALOGO", "MANUAL", "GUIA", "PLAN", "PROGRAMA"],
    formato: "[PRODUCTO]-[VERSION]",
    ejemploCompleto: "MANUAL-v1",
    etiquetaBoton: "Usar formato para proyectos",
  },
  {
    categoria: "Apoyo a otras áreas",
    ejemplos: ["SOPORTE-TI", "INSUMO-DISEÑO", "TICKET-MANTENIMIENTO"],
    formato: "[TIPO]-[AREA-DESTINO]",
    ejemploCompleto: "SOPORTE-ACAD",
    etiquetaBoton: "Usar formato para apoyos",
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

// Paleta para distinguir categorías con un color consistente (mismo código → mismo color
// siempre), usada como acento visual junto al nombre de la categoría.
export const PALETA_CATEGORIAS = [
  "bg-ai-100 text-ai-700",
  "bg-moss-100 text-moss-700",
  "bg-kaki-100 text-kaki-700",
  "bg-budou-100 text-budou-700",
  "bg-terracotta-100 text-terracotta-700",
  "bg-ink-faint/20 text-ink-soft",
];

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
