import { LIMITE_CLAVE, PALETA_CATEGORIAS } from "./constants";

// Convierte texto libre en un segmento válido de código: mayúsculas, sin acentos,
// sin espacios ni símbolos.
export function sanearSegmento(texto: string): string {
  return texto
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z0-9]+/g, "");
}

export function construirCodigoEsencial(areaCodigo: string, categoria: string, claveSaneada: string): string {
  return [areaCodigo, categoria, claveSaneada].filter(Boolean).join("-");
}

// La clave es ahora también la descripción legible del trabajo (puede tener espacios,
// acentos, minúsculas). El código siempre se construye saneándola.
export function codigoEsencialDeTrabajo(t: { areaCodigo: string; categoria: string; clave: string }): string {
  return construirCodigoEsencial(t.areaCodigo, t.categoria, sanearSegmento(t.clave));
}

export interface NivelesEscalabilidad {
  cosa: string;
  area: string;
  institucion?: string;
  region?: string;
}

// El código "crece hacia afuera" (§20 del manual): cada frontera cruzada agrega un
// prefijo sin tocar el núcleo CATEGORÍA-CLAVE.
export function escalarCodigo(params: {
  areaCodigo: string;
  categoria: string;
  clave: string;
  prefijoInstitucion?: string;
  prefijoRed?: string;
}): NivelesEscalabilidad {
  const claveSaneada = sanearSegmento(params.clave);
  const cosa = `${params.categoria}-${claveSaneada}`;
  const area = `${params.areaCodigo}-${cosa}`;
  const institucion = params.prefijoInstitucion ? `${params.prefijoInstitucion}-${area}` : undefined;
  const region = params.prefijoInstitucion && params.prefijoRed ? `${params.prefijoRed}-${institucion}` : undefined;
  return { cosa, area, institucion, region };
}

export function excedeLimiteClave(clave: string): boolean {
  return clave.length > LIMITE_CLAVE;
}

// Asunto sugerido para correos sobre este trabajo: incluye el código (para poder
// buscar y filtrar el hilo después) y la descripción legible.
export function asuntoCorreoSugerido(t: { areaCodigo: string; categoria: string; clave: string }): string {
  return `${codigoEsencialDeTrabajo(t)} — ${t.clave}`;
}

// Mismo código de categoría → siempre el mismo color, sin necesidad de guardarlo.
export function colorParaCategoria(codigoCategoria: string): string {
  let hash = 0;
  for (let i = 0; i < codigoCategoria.length; i++) {
    hash = (hash * 31 + codigoCategoria.charCodeAt(i)) % PALETA_CATEGORIAS.length;
  }
  return PALETA_CATEGORIAS[Math.abs(hash)];
}
