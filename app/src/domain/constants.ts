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

// Icono consistente por categoría (mismo código de fábrica → mismo icono), solo para
// reforzar visualmente el paso "Categoría" del asistente.
export const CATEGORIA_ICONOS: Record<string, string> = {
  PROY: "🚀",
  CONV: "🤝",
  COLAB: "🌐",
  PROD: "📦",
  DIVU: "📣",
  ACAD: "🎓",
  ADM: "🗂️",
  APOYO: "🛠️",
};

// Áreas típicas de una institución educativa, listas para tocar y usar. Cada una trae
// un código corto y fácil de leer (en vez de "RECURSOSHUMANOS", "RH").
export const EJEMPLOS_AREA: { icono: string; nombre: string; codigo: string }[] = [
  { icono: "🏛️", nombre: "Dirección General", codigo: "DIR" },
  { icono: "🎓", nombre: "Coordinación Académica", codigo: "ACAD" },
  { icono: "📝", nombre: "Servicios Escolares", codigo: "ESCOLAR" },
  { icono: "📚", nombre: "Biblioteca", codigo: "BIBLIO" },
  { icono: "💼", nombre: "Administración", codigo: "ADMIN" },
  { icono: "💰", nombre: "Finanzas y Contabilidad", codigo: "FIN" },
  { icono: "🛒", nombre: "Compras", codigo: "COMPRAS" },
  { icono: "👥", nombre: "Recursos Humanos", codigo: "RH" },
  { icono: "⚖️", nombre: "Jurídico", codigo: "JUR" },
  { icono: "📢", nombre: "Comunicación", codigo: "COMUN" },
  { icono: "📣", nombre: "Promoción y Admisiones", codigo: "ADMISION" },
  { icono: "💻", nombre: "Tecnologías de Información", codigo: "TI" },
  { icono: "🔬", nombre: "Investigación", codigo: "INVEST" },
  { icono: "🎓", nombre: "Posgrado", codigo: "POSGRADO" },
  { icono: "📖", nombre: "Educación Continua", codigo: "EDCONT" },
  { icono: "🤝", nombre: "Vinculación", codigo: "VINC" },
  { icono: "🌍", nombre: "Internacionalización", codigo: "INTER" },
  { icono: "🙋", nombre: "Servicio Social y Prácticas", codigo: "SERVSOC" },
  { icono: "🧑‍🎓", nombre: "Egresados", codigo: "EGRESADOS" },
  { icono: "🧠", nombre: "Psicopedagogía", codigo: "PSICO" },
  { icono: "🎭", nombre: "Cultura", codigo: "CULTURA" },
  { icono: "⚽", nombre: "Deportes", codigo: "DEPORTES" },
  { icono: "🧪", nombre: "Laboratorios", codigo: "LAB" },
  { icono: "📊", nombre: "Planeación y Calidad", codigo: "PLAN" },
  { icono: "🔧", nombre: "Mantenimiento", codigo: "MANT" },
];

// Ideas de "nombre corto" según el tipo de trabajo elegido: frases naturales, como se
// le diría a un compañero, para tocarlas y ajustarlas.
export const EJEMPLOS_NOMBRE: Record<string, string[]> = {
  PROY: ["Catálogo de libros 2026", "Página web del área", "Manual de bienvenida"],
  CONV: ["Convenio Hospital Central", "Convenio de prácticas 2026", "Acuerdo Biblioteca Estatal"],
  COLAB: ["Red de bibliotecas del Bajío", "Profesor visitante 2026", "Seminario con la UAQ"],
  PROD: ["Informe anual 2025", "Reporte de encuesta", "Artículo sobre lectura"],
  DIVU: ["Video Día del Libro", "Ponencia congreso 2026", "Campaña redes octubre"],
  ACAD: ["Plan de estudios 2027", "Horarios otoño 2026", "Registro materia Ética"],
  ADM: ["Presupuesto 2026", "Inventario de equipo", "Compra de mobiliario"],
  APOYO: ["Carteles para RH", "Soporte a Comunicación", "Evento de egresados"],
};
export const EJEMPLOS_NOMBRE_GENERALES = ["Reporte mensual", "Evento fin de año 2026", "Proyecto principal"];

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
  FISICO: { icono: "🗄️", etiqueta: "En papel", descripcion: "Folders y archivero" },
  DIGITAL_LOCAL: { icono: "💻", etiqueta: "Mi computadora", descripcion: "Carpetas en Documentos" },
  NUBE: { icono: "☁️", etiqueta: "En la nube", descripcion: "Google Drive u OneDrive" },
  CORREO: { icono: "📧", etiqueta: "Mi correo", descripcion: "Todo se maneja por correo" },
  OTRO: { icono: "📌", etiqueta: "Otro", descripcion: "Cualquier otro medio" },
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
