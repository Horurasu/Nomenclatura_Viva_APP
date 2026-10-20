import { useState, type ReactNode } from "react";
import { Opcion } from "./Estilo";

type Medio = "USB" | "CORREO" | "DRIVE" | "WHATSAPP";

const MEDIOS: { valor: Medio; icono: string; titulo: string; texto: string }[] = [
  { valor: "CORREO", icono: "✉️", titulo: "Enviármelo por correo", texto: "Lo más fácil: queda en tu bandeja" },
  { valor: "USB", icono: "🔌", titulo: "En una memoria USB", texto: "Sin internet" },
  { valor: "DRIVE", icono: "☁️", titulo: "En Google Drive u OneDrive", texto: "Lo abres desde cualquier lugar" },
  { valor: "WHATSAPP", icono: "💬", titulo: "Por WhatsApp", texto: "Mándatelo a tu propio chat" },
];

// Explica, con pasos muy concretos, cómo guardar o mover un archivo descargado.
// "nombreArchivo" es el archivo que el usuario debe buscar en Descargas.
export function ComoPasarArchivo({ nombreArchivo }: { nombreArchivo: string }) {
  const [medio, setMedio] = useState<Medio | null>(null);
  const archivo = <strong className="font-mono text-ink break-all">{nombreArchivo}</strong>;

  const pasos: Record<Medio, ReactNode[]> = {
    CORREO: [
      <>Abre tu correo y toca <strong>Redactar</strong> o <strong>Nuevo mensaje</strong>.</>,
      <>En <strong>Para</strong>, escribe <strong>tu propio correo</strong>.</>,
      <>En <strong>Asunto</strong>, escribe: <strong>Respaldo Nomenclatura Viva</strong> y la fecha de hoy.</>,
      <>Toca el clip 📎 (<strong>Adjuntar</strong>), entra a <strong>Descargas</strong> y elige {archivo}.</>,
      <>Toca <strong>Enviar</strong>. Para recuperarlo, busca “Respaldo Nomenclatura Viva” en tu correo y descarga el archivo.</>,
    ],
    USB: [
      <>Conecta la memoria USB a la computadora.</>,
      <>Abre la carpeta amarilla 📁 de la barra de abajo y entra a <strong>Descargas</strong>.</>,
      <>Busca {archivo}, haz <strong>clic derecho</strong> → <strong>Copiar</strong>.</>,
      <>A la izquierda, entra a tu USB (suele llamarse “USB” o “Disco extraíble”). <strong>Clic derecho</strong> en un espacio en blanco → <strong>Pegar</strong>.</>,
      <>Antes de desconectarla, espera a que termine de copiar.</>,
    ],
    DRIVE: [
      <>Abre <span className="font-mono">drive.google.com</span> (u <span className="font-mono">onedrive.live.com</span>) con tu correo.</>,
      <>(La primera vez) crea una carpeta llamada <strong>Respaldos Nomenclatura Viva</strong> con <strong>+ Nuevo → Carpeta nueva</strong>.</>,
      <>Entra a esa carpeta y toca <strong>+ Nuevo → Subir archivo</strong>.</>,
      <>Entra a <strong>Descargas</strong>, elige {archivo} y toca <strong>Abrir</strong>.</>,
    ],
    WHATSAPP: [
      <>Abre WhatsApp en tu computadora (o <span className="font-mono">web.whatsapp.com</span>).</>,
      <>Busca tu propio número: aparece como <strong>“Tú”</strong> o <strong>“Mensaje a mí mismo”</strong>.</>,
      <>Toca el clip 📎 o el <strong>+</strong> → <strong>Documento</strong>.</>,
      <>Entra a <strong>Descargas</strong>, elige {archivo} y envíalo.</>,
    ],
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {MEDIOS.map((m) => (
          <Opcion key={m.valor} icono={m.icono} titulo={m.titulo} texto={m.texto} seleccionada={medio === m.valor} onClick={() => setMedio(m.valor)} />
        ))}
      </div>
      {medio && (
        <ol className="rounded-2xl bg-white border border-line p-4 space-y-2.5 text-sm text-ink-soft leading-relaxed">
          {pasos[medio].map((p, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
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
