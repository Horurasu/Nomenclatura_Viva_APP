import { useState, type ReactNode } from "react";
import { COLORES_SECCION, Opcion, type ColorSeccion } from "./Estilo";

type Medio = "USB" | "CORREO" | "DRIVE" | "WHATSAPP";

// "yo" = guardarlo para ti (o pasarlo a tu otra computadora); "companero" = dárselo a alguien más.
type Para = "yo" | "companero";

const MEDIOS: Record<Para, { valor: Medio; icono: string; titulo: string; texto: string }[]> = {
  yo: [
    { valor: "CORREO", icono: "✉️", titulo: "En tu correo", texto: "Te lo mandas a ti mismo y queda en tu bandeja" },
    { valor: "USB", icono: "🔌", titulo: "En una memoria USB", texto: "Lo copias; no necesita internet" },
    { valor: "DRIVE", icono: "☁️", titulo: "En Google Drive u OneDrive", texto: "Lo subes y lo abres desde cualquier lugar" },
    { valor: "WHATSAPP", icono: "💬", titulo: "En tu WhatsApp", texto: "Te lo mandas a tu propio chat" },
  ],
  companero: [
    { valor: "CORREO", icono: "✉️", titulo: "Por correo", texto: "Se lo mandas como archivo adjunto" },
    { valor: "WHATSAPP", icono: "💬", titulo: "Por WhatsApp", texto: "Se lo mandas a su chat como documento" },
    { valor: "DRIVE", icono: "☁️", titulo: "Por Google Drive u OneDrive", texto: "Lo subes y lo compartes con su correo" },
    { valor: "USB", icono: "🔌", titulo: "En una memoria USB", texto: "Lo copias y le prestas la USB" },
  ],
};

// Explica, con pasos muy concretos, cómo guardar o mover un archivo descargado. La app no
// envía nada por su cuenta: solo muestra los pasos para que la persona lo haga.
// "nombreArchivo" es el archivo que el usuario debe buscar en Descargas.
export function ComoPasarArchivo({
  nombreArchivo,
  para = "yo",
  color = "ambar",
}: {
  nombreArchivo: string;
  para?: Para;
  color?: ColorSeccion;
}) {
  const [medio, setMedio] = useState<Medio | null>(null);
  const archivo = <strong className="font-mono text-ink break-all">{nombreArchivo}</strong>;
  const yo = para === "yo";

  const pasos: Record<Medio, ReactNode[]> = {
    CORREO: [
      <>Abre tu correo (Gmail, Outlook…) y toca <strong>Redactar</strong> o <strong>Nuevo mensaje</strong>.</>,
      yo ? <>En <strong>Para</strong>, escribe <strong>tu propio correo</strong>.</> : <>En <strong>Para</strong>, escribe <strong>el correo de tu compañero</strong>.</>,
      <>En <strong>Asunto</strong>, escribe: <strong>{yo ? "Respaldo Nomenclatura Viva" : "Configuración Nomenclatura Viva"}</strong> y la fecha de hoy.</>,
      <>Toca el clip 📎 (<strong>Adjuntar</strong>), entra a <strong>Descargas</strong> y elige {archivo}.</>,
      yo ? (
        <>Toca <strong>Enviar</strong>. Para recuperarlo, busca “Respaldo Nomenclatura Viva” en tu correo y descarga el archivo.</>
      ) : (
        <>Toca <strong>Enviar</strong>. Tu compañero lo descarga y lo carga en su app (abajo le dices cómo).</>
      ),
    ],
    USB: [
      <>Conecta la memoria USB a la computadora.</>,
      <>Abre la carpeta amarilla 📁 de la barra de abajo y entra a <strong>Descargas</strong>.</>,
      <>Busca {archivo}, haz <strong>clic derecho</strong> → <strong>Copiar</strong>.</>,
      <>A la izquierda, entra a tu USB (suele llamarse “USB” o “Disco extraíble”). <strong>Clic derecho</strong> en un espacio en blanco → <strong>Pegar</strong>.</>,
      yo ? <>Antes de desconectarla, espera a que termine de copiar.</> : <>Espera a que termine de copiar y préstale la USB a tu compañero.</>,
    ],
    DRIVE: [
      <>Abre <span className="font-mono">drive.google.com</span> (u <span className="font-mono">onedrive.live.com</span>) con tu correo.</>,
      <>(La primera vez) crea una carpeta llamada <strong>Respaldos Nomenclatura Viva</strong> con <strong>+ Nuevo → Carpeta nueva</strong>.</>,
      <>Entra a esa carpeta y toca <strong>+ Nuevo → Subir archivo</strong>.</>,
      <>Entra a <strong>Descargas</strong>, elige {archivo} y toca <strong>Abrir</strong>.</>,
      ...(yo ? [] : [<>Clic derecho en el archivo → <strong>Compartir</strong> → escribe el correo de tu compañero → <strong>Enviar</strong>.</>]),
    ],
    WHATSAPP: [
      <>Abre WhatsApp en tu computadora (o <span className="font-mono">web.whatsapp.com</span>).</>,
      yo ? (
        <>Busca tu propio número: aparece como <strong>“Tú”</strong> o <strong>“Mensaje a mí mismo”</strong>.</>
      ) : (
        <>Abre el chat de tu compañero (o el grupo de tu área).</>
      ),
      <>Toca el clip 📎 o el <strong>+</strong> → <strong>Documento</strong>.</>,
      <>Entra a <strong>Descargas</strong>, elige {archivo} y envíalo.</>,
    ],
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-ink-soft flex gap-2 rounded-xl bg-app px-3 py-2 leading-relaxed">
        <span aria-hidden="true">🙋</span>
        <span>
          <strong className="text-ink">Esto lo haces tú.</strong> La app no manda correos ni sube nada por su cuenta: aquí
          tienes ideas de {yo ? "dónde guardarlo" : "cómo hacérselo llegar"}. Toca una para ver los pasos.
        </span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {MEDIOS[para].map((m) => (
          <Opcion key={m.valor} icono={m.icono} titulo={m.titulo} texto={m.texto} seleccionada={medio === m.valor} onClick={() => setMedio(m.valor)} />
        ))}
      </div>
      {medio && (
        <ol className="rounded-2xl bg-white border border-line p-4 space-y-2.5 text-sm text-ink-soft leading-relaxed">
          {pasos[medio].map((p, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${COLORES_SECCION[color].numero}`}>
                {i + 1}
              </span>
              <span className="pt-0.5">{p}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
