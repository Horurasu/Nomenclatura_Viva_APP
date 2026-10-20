import { useState, type ReactNode } from "react";
import type { TipoUbicacion } from "../../domain/types";
import { BotonApp } from "./Estilo";

// Guía paso a paso para acomodar los archivos de un trabajo, pensada para quien casi no
// usa la computadora: qué abrir, qué tocar y cómo debe quedar al final.

export const SUBCARPETAS = [
  { nombre: "01_ORIGEN", papel: "1 · Origen", que: "lo que lo pidió: oficios, solicitudes, correos impresos" },
  { nombre: "02_DESARROLLO", papel: "2 · Desarrollo", que: "borradores y avances" },
  { nombre: "03_PRODUCTO", papel: "3 · Producto", que: "el resultado final" },
  { nombre: "04_ENTREGA", papel: "4 · Entrega", que: "lo que entregaste y los acuses" },
];

export function GuiaCarpeta({ tipo, codigo, nombre, nombreArea }: { tipo: TipoUbicacion; codigo: string; nombre: string; nombreArea: string }) {
  const c = codigo || "TU-CODIGO";

  if (tipo === "CORREO") {
    return (
      <div className="space-y-5">
        <Paso numero={1} titulo="Copia el código">
          <CodigoCopiable codigo={codigo} />
        </Paso>
        <Paso numero={2} titulo="Cuando escribas un correo de este trabajo, pégalo al inicio del asunto">
          <p>
            En el renglón <strong>“Asunto”</strong>, presiona <Tecla>Ctrl</Tecla> + <Tecla>V</Tecla> para pegar (en Mac{" "}
            <Tecla>⌘</Tecla> + <Tecla>V</Tecla>) y después escribe de qué trata.
          </p>
          <div className="rounded-xl border border-line bg-white overflow-hidden text-xs">
            <div className="px-3 py-2 border-b border-line text-ink-faint">Para: compañero@tuinstitucion.edu.mx</div>
            <div className="px-3 py-2 text-ink">
              <span className="text-ink-faint">Asunto: </span>
              <strong className="font-mono">{c}</strong> — {nombre || "de qué trata"}
            </div>
          </div>
        </Paso>
        <Paso numero={3} titulo="Para encontrar todos los correos de este trabajo">
          <p>
            Escribe el código en el buscador de tu correo (la barra con la lupa 🔍 de arriba) y presiona <Tecla>Enter</Tecla>.
            Aparecen todos, aunque sean de meses distintos.
          </p>
        </Paso>
        <Paso numero={4} titulo="(Opcional) Junta los correos en un solo lugar">
          <p>
            En Gmail: crea una <strong>etiqueta</strong> con el código. En Outlook: crea una <strong>carpeta</strong> con el
            código. Luego arrastra ahí los correos.
          </p>
        </Paso>
      </div>
    );
  }

  if (tipo === "FISICO") {
    return (
      <div className="space-y-5">
        <Paso numero={1} titulo="Consigue un folder con pestaña">
          <p>Tamaño carta u oficio. Si son muchos papeles, usa una carpeta de argollas o una caja.</p>
        </Paso>
        <Paso numero={2} titulo="Escribe el código en la pestaña del folder">
          <p>Con letra grande y clara, o imprime la etiqueta y pégala.</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-t-lg bg-amber-100 border border-amber-300 px-3 py-1 font-mono font-bold text-ink break-all">{c}</span>
            <BotonApp color="blanco" tamano="sm" onClick={() => imprimirEtiqueta(c, nombre, nombreArea)} disabled={!codigo}>
              🖨️ Imprimir etiqueta
            </BotonApp>
          </div>
        </Paso>
        <Paso numero={3} titulo="Por dentro, separa los papeles en 4 partes">
          <p>Usa 4 separadores (o 4 hojas de color) con estos títulos:</p>
          <ListaSubcarpetas papel />
        </Paso>
        <Paso numero={4} titulo="Guárdalo en el archivero">
          <p>
            Usa un <strong>cajón para cada área</strong> (este va en el de <strong>{nombreArea || "tu área"}</strong>). Acomoda los
            folders por orden alfabético del código: los del mismo tipo quedan juntos solos.
          </p>
        </Paso>
        <Mapa
          titulo="Así debe quedar tu archivero"
          lineas={[
            { nivel: 0, icono: "🗄️", texto: "Archivero" },
            { nivel: 1, icono: "🗃️", texto: `Cajón: ${nombreArea || "Tu área"}` },
            { nivel: 2, icono: "📂", texto: c, destacado: true },
            ...SUBCARPETAS.map((s) => ({ nivel: 3, icono: "📑", texto: s.papel, nota: s.que })),
          ]}
        />
      </div>
    );
  }

  const nube = tipo === "NUBE";
  return (
    <div className="space-y-5">
      {nube ? (
        <Paso numero={1} titulo="Entra a tu nube">
          <p>
            <strong>Google Drive:</strong> abre <span className="font-mono">drive.google.com</span>. <strong>OneDrive:</strong> abre{" "}
            <span className="font-mono">onedrive.live.com</span>. Entra con el correo de tu institución.
          </p>
        </Paso>
      ) : (
        <Paso numero={1} titulo="Abre tu carpeta “Documentos”">
          <p>
            <strong>Windows:</strong> toca la carpeta amarilla 📁 de la barra de abajo y, a la izquierda, elige{" "}
            <strong>Documentos</strong>. <strong>Mac:</strong> abre <strong>Finder</strong> y elige <strong>Documentos</strong>.
          </p>
        </Paso>
      )}
      <Paso numero={2} titulo="Crea una carpeta llamada “Trabajos” (solo la primera vez)">
        <p>
          {nube ? (
            <>
              Toca el botón <strong>“+ Nuevo”</strong> (arriba a la izquierda) → <strong>“Carpeta nueva”</strong> → escribe{" "}
              <strong>Trabajos</strong> → <strong>Crear</strong>.
            </>
          ) : (
            <>
              Haz <strong>clic derecho</strong> en un espacio en blanco → <strong>Nuevo</strong> → <strong>Carpeta</strong>. Escribe{" "}
              <strong>Trabajos</strong> y presiona <Tecla>Enter</Tecla>.
            </>
          )}{" "}
          Si ya la tienes, sáltate este paso.
        </p>
      </Paso>
      <Paso numero={3} titulo="Entra a “Trabajos” y crea la carpeta de este trabajo">
        <CodigoCopiable codigo={codigo} />
        <p>
          Toca <strong>Copiar</strong>. Luego crea una carpeta nueva igual que en el paso 2 y, en vez de escribir el nombre,
          pégalo con <Tecla>Ctrl</Tecla> + <Tecla>V</Tecla> (en Mac <Tecla>⌘</Tecla> + <Tecla>V</Tecla>).
        </p>
      </Paso>
      <Paso numero={4} titulo="Entra a esa carpeta y crea estas 4 carpetas">
        <ListaSubcarpetas />
        <p>Llevan número para que siempre salgan en ese orden.</p>
      </Paso>
      <Mapa
        titulo="Así debe quedar"
        lineas={[
          { nivel: 0, icono: nube ? "☁️" : "💻", texto: nube ? "Mi unidad" : "Documentos" },
          { nivel: 1, icono: "📁", texto: "Trabajos" },
          { nivel: 2, icono: "📁", texto: c, destacado: true },
          ...SUBCARPETAS.map((s) => ({ nivel: 3, icono: "📁", texto: s.nombre, nota: s.que })),
        ]}
      />
      <p className="text-xs">
        💡 Ponle el código al inicio de cada archivo: <span className="font-mono text-ink">{c}_borrador.docx</span>. Así lo
        encuentras escribiendo el código en el buscador.
        {nube && " Para que tu equipo lo vea: clic derecho en la carpeta → Compartir → escribe sus correos."}
      </p>
    </div>
  );
}

// Ejemplo de dónde quedó, para el campo "Anota dónde la creaste".
export function ejemploUbicacion(tipo: TipoUbicacion, codigo: string, nombreArea: string): string {
  const c = codigo || "CODIGO";
  if (tipo === "DIGITAL_LOCAL") return `Documentos/Trabajos/${c}`;
  if (tipo === "NUBE") return `Google Drive: Mi unidad/Trabajos/${c}`;
  if (tipo === "FISICO") return `Archivero, cajón ${nombreArea || "de mi área"}, folder ${c}`;
  if (tipo === "CORREO") return `Correo institucional, buscar: ${c}`;
  return c;
}

// El código en grande con un botón para copiarlo y pegarlo como nombre de carpeta.
export function CodigoCopiable({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      // Si el navegador no deja copiar, el código sigue a la vista para escribirlo a mano.
    }
  }
  return (
    <div className="flex items-center gap-2 rounded-xl bg-app p-2 pl-4">
      <span className="flex-1 min-w-0 font-mono font-semibold text-ink break-all">📁 {codigo || "TU-CODIGO"}</span>
      <BotonApp color={copiado ? "verde" : "blanco"} tamano="sm" onClick={copiar} disabled={!codigo}>
        {copiado ? "✓ Copiado" : "Copiar"}
      </BotonApp>
    </div>
  );
}

function Paso({ numero, titulo, children }: { numero: number; titulo: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span aria-hidden="true" className="shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
        {numero}
      </span>
      <div className="flex-1 min-w-0 space-y-2 text-sm text-ink-soft leading-relaxed">
        <p className="font-semibold text-ink pt-0.5">{titulo}</p>
        {children}
      </div>
    </div>
  );
}

function Tecla({ children }: { children: ReactNode }) {
  return <kbd className="inline-block rounded-md border border-line border-b-2 bg-white px-1.5 text-[11px] font-semibold text-ink font-sans">{children}</kbd>;
}

function ListaSubcarpetas({ papel = false }: { papel?: boolean }) {
  return (
    <ul className="space-y-1">
      {SUBCARPETAS.map((s) => (
        <li key={s.nombre} className="flex flex-wrap gap-x-2 text-xs">
          <span className="font-mono font-semibold text-ink">{papel ? s.papel : s.nombre}</span>
          <span>← {s.que}</span>
        </li>
      ))}
    </ul>
  );
}

// Dibujo en forma de árbol de cómo queda todo acomodado.
function Mapa({ titulo, lineas }: { titulo: string; lineas: { nivel: number; icono: string; texto: string; nota?: string; destacado?: boolean }[] }) {
  return (
    <div className="rounded-xl bg-ink text-paper/90 p-3 text-xs">
      <p className="text-[11px] uppercase tracking-wider text-paper/60 mb-2">{titulo}</p>
      <div className="space-y-1 font-mono overflow-x-auto">
        {lineas.map((l, i) => (
          <div key={i} className="flex items-baseline gap-1.5 whitespace-nowrap" style={{ paddingLeft: `${l.nivel * 1.1}rem` }}>
            {l.nivel > 0 && <span className="text-paper/40">└</span>}
            <span>{l.icono}</span>
            <span className={l.destacado ? "font-bold text-amber-300" : ""}>{l.texto}</span>
            {l.destacado && <span className="font-sans text-amber-300/80">← este trabajo</span>}
            {l.nota && <span className="font-sans text-paper/50 truncate">{l.nota}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Abre una hoja lista para imprimir con el código en grande, para pegarla en el folder.
function imprimirEtiqueta(codigo: string, nombre: string, nombreArea: string) {
  const ventana = window.open("", "_blank", "width=700,height=500");
  if (!ventana) return;
  const escapar = (t: string) => t.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch] ?? ch);
  ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Etiqueta ${escapar(codigo)}</title>
<style>body{font-family:system-ui,sans-serif;margin:2rem}.etiqueta{border:2px dashed #999;padding:1.5rem 2rem;display:inline-block;max-width:100%}
.codigo{font-family:monospace;font-size:28px;font-weight:700;word-break:break-all}.nombre{font-size:18px;margin-top:.5rem}.area{color:#555;margin-top:.25rem}
p.ayuda{color:#777;font-size:13px}@media print{p.ayuda{display:none}}</style></head><body>
<p class="ayuda">Recorta por la línea punteada y pégala en la pestaña del folder.</p>
<div class="etiqueta"><div class="codigo">${escapar(codigo)}</div><div class="nombre">${escapar(nombre)}</div><div class="area">${escapar(nombreArea)}</div></div>
<script>window.onload=function(){window.print()}</script></body></html>`);
  ventana.document.close();
}
