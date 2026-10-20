import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { construirCodigoEsencial, nombreDocumento, sanearSegmento } from "../../domain/codigo";
import { BotonApp } from "./Estilo";

// Explicación de bienvenida: una idea por tarjeta, contada con un dibujo que se arma solo
// (las piezas van apareciendo) y una frase corta. Todo es decoración plana: lo único que se
// toca son los botones de abajo.

// Un solo ejemplo real de principio a fin, armado con las mismas funciones que usa la app:
// Servicios Escolares junta las CURPs de los alumnos de nuevo ingreso.
const AREA = { icono: "📝", nombre: "Servicios Escolares", codigo: "ESCOLAR" };
const TIPO = { icono: "🎓", nombre: "Gestión académica", codigo: "ACAD" };
const NOMBRE = "CURPs 2026";
const CLAVE = sanearSegmento(NOMBRE);
const CODIGO = construirCodigoEsencial(AREA.codigo, TIPO.codigo, CLAVE);

// Los documentos que se van juntando en ese trabajo, ya con su nombre final.
const DOCUMENTOS = [
  { icono: "📨", tipo: "OFICIO", descripcion: "Solicitud SEP", fecha: "2026-08-15", ext: "pdf", carpeta: "01_ORIGEN" },
  { icono: "📋", tipo: "LISTA", descripcion: "Grupo A", fecha: "2026-09-01", ext: "xlsx", carpeta: "02_DESARROLLO" },
  { icono: "📜", tipo: "ACTA", descripcion: "Ana López", fecha: "2026-09-03", ext: "pdf", carpeta: "02_DESARROLLO" },
  { icono: "📜", tipo: "ACTA", descripcion: "Luis Pérez", fecha: "2026-09-04", ext: "pdf", carpeta: "02_DESARROLLO" },
  { icono: "📊", tipo: "INFORME", descripcion: "CURPs completas", fecha: "2026-10-20", ext: "docx", carpeta: "03_PRODUCTO" },
  { icono: "📬", tipo: "ACUSE", descripcion: "Entrega SEP", fecha: "2026-10-25", ext: "pdf", carpeta: "04_ENTREGA" },
].map((d, i, todos) => {
  const numero = todos.slice(0, i + 1).filter((x) => x.tipo === d.tipo).length;
  return { ...d, numero, nombre: `${nombreDocumento({ codigo: CODIGO, tipo: d.tipo, numero, descripcion: d.descripcion, fecha: d.fecha })}.${d.ext}` };
});
const CARPETAS = ["01_ORIGEN", "02_DESARROLLO", "03_PRODUCTO", "04_ENTREGA"];

// Colores de cada pedazo del nombre, iguales a los del asistente.
const COLOR_AREA = "bg-sky-100 text-sky-800 border-sky-300";
const COLOR_TIPO = "bg-emerald-100 text-emerald-800 border-emerald-300";
const COLOR_CLAVE = "bg-amber-100 text-amber-800 border-amber-300";

// El código pintado por pedazos; "hasta" dice cuántos pedazos se ven (1, 2 o 3).
function CodigoPorPedazos({ hasta }: { hasta: number }) {
  const pedazos = [
    { texto: AREA.codigo, clase: COLOR_AREA },
    { texto: TIPO.codigo, clase: COLOR_TIPO },
    { texto: CLAVE, clase: COLOR_CLAVE },
  ].slice(0, hasta);
  return (
    <span className="inline-flex flex-wrap items-center font-mono text-[11px] font-bold">
      {pedazos.map((p, i) => (
        <span key={p.texto} className="inline-flex items-center">
          {i > 0 && <span className="text-ink-soft px-0.5">-</span>}
          <span className={`rounded border px-1 py-0.5 ${p.clase}`}>{p.texto}</span>
        </span>
      ))}
    </span>
  );
}

// Pieza que aparece con un pequeño retraso, para que el dibujo "se arme" frente a la persona.
function Aparece({ en = 0, className = "", style, children }: { en?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const estilo: CSSProperties = { ...style, animationDelay: `${en}s` };
  return (
    <div className={`animate-aparecer ${className}`} style={estilo}>
      {children}
    </div>
  );
}

function Etiqueta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-block rounded-lg bg-ink text-paper font-mono font-bold px-2.5 py-1 break-all ${className}`}>{children}</span>;
}

/* --------------------------------- Escenas --------------------------------- */

function EscenaDesorden() {
  const archivos = [
    { nombre: "reporte.docx", giro: -12, x: "4%", y: "6%" },
    { nombre: "reporte FINAL.docx", giro: 8, x: "58%", y: "2%" },
    { nombre: "final AHORA SÍ.docx", giro: -5, x: "2%", y: "64%" },
    { nombre: "Documento1.docx", giro: 14, x: "60%", y: "64%" },
  ];
  return (
    <div className="relative w-full h-56">
      {archivos.map((a, i) => (
        <Aparece key={a.nombre} en={i * 0.25} className="absolute" style={{ left: a.x, top: a.y }}>
          <div className="w-28 rounded-xl bg-white border border-line shadow-sm px-2 py-2 text-center" style={{ transform: `rotate(${a.giro}deg)` }}>
            <p className="text-3xl leading-none">📄</p>
            <p className="text-[10px] font-mono text-ink mt-1 leading-tight break-words">{a.nombre}</p>
          </div>
        </Aparece>
      ))}
      <Aparece en={1.1} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-6xl animate-flotar">😵‍💫</span>
        <span className="mt-1 rounded-full bg-white border border-line px-3 py-1 text-sm font-bold text-rose-700 shadow-sm">¿Cuál es el bueno?</span>
      </Aparece>
    </div>
  );
}

function EscenaEtiqueta() {
  const frascos = ["Azúcar", "Sal", "Café"];
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex justify-center gap-4">
        {frascos.map((f, i) => (
          <Aparece key={f} en={i * 0.2} className="flex flex-col items-center">
            <span className="text-5xl">🫙</span>
            <span className="-mt-3 rounded-md bg-white border border-amber-300 px-2 py-0.5 text-xs font-bold text-amber-800 shadow-sm">{f}</span>
          </Aparece>
        ))}
      </div>
      <Aparece en={0.8} className="text-sm text-amber-700 font-bold">
        ⬇️ igual con tus trabajos ⬇️
      </Aparece>
      <Aparece en={1.1} className="flex flex-col items-center">
        <span className="text-7xl leading-none animate-flotar">📁</span>
        <Etiqueta className="text-xs -mt-2 shadow-md">🏷️ {CODIGO}</Etiqueta>
      </Aparece>
    </div>
  );
}

function EscenaArmar() {
  const pasos = [
    { pregunta: "¿De qué área es?", icono: AREA.icono, respuesta: AREA.nombre, clase: COLOR_AREA },
    { pregunta: "¿Qué tipo de trabajo es?", icono: TIPO.icono, respuesta: TIPO.nombre, clase: COLOR_TIPO },
    { pregunta: "¿Cómo le dices?", icono: "✏️", respuesta: NOMBRE, clase: COLOR_CLAVE },
  ];
  return (
    <div className="w-full space-y-2">
      {pasos.map((p, i) => (
        <Aparece key={p.pregunta} en={i * 0.7} className="rounded-xl bg-white border border-line p-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="shrink-0 w-5 h-5 rounded-full bg-sky-500 text-white text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
            <span className="text-[11px] text-ink-soft">{p.pregunta}</span>
            <span className={`relative ml-auto rounded-lg border-2 border-b-4 px-2 py-0.5 text-[11px] font-semibold ${p.clase}`}>
              {p.icono} {p.respuesta}
              <span className="absolute -bottom-3 -right-2 text-base animate-tocar">👆</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 pl-7">
            <span className="text-[10px] text-ink-faint">código:</span>
            <CodigoPorPedazos hasta={i + 1} />
          </div>
        </Aparece>
      ))}
      <Aparece en={2.2} className="text-center space-y-1 pt-1">
        <p className="text-[11px] text-ink-soft">
          “{NOMBRE}” queda como <strong className="font-mono text-ink">{CLAVE}</strong> (sin espacios ni acentos)
        </p>
        <Etiqueta className="text-sm">✨ {CODIGO}</Etiqueta>
      </Aparece>
    </div>
  );
}

function EscenaTodosLados() {
  return (
    <div className="w-full space-y-2.5">
      <Aparece className="text-center">
        <Etiqueta className="text-xs">{CODIGO}</Etiqueta>
      </Aparece>
      <div className="grid grid-cols-3 gap-2 text-center">
        <Aparece en={0.3} className="rounded-xl bg-white border border-line p-2">
          <p className="text-3xl">📁</p>
          <p className="text-[10px] font-bold text-ink">Tu carpeta</p>
        </Aparece>
        <Aparece en={0.55} className="rounded-xl bg-white border border-line p-2">
          <p className="text-3xl">📄</p>
          <p className="text-[10px] font-bold text-ink">Tus archivos</p>
        </Aparece>
        <Aparece en={0.8} className="rounded-xl bg-white border border-line p-2">
          <p className="text-3xl">✉️</p>
          <p className="text-[10px] font-bold text-ink">Tus correos</p>
        </Aparece>
      </div>
      <Aparece en={1.2} className="rounded-full bg-white border-2 border-violet-300 px-3 py-2 flex items-center gap-2 shadow-sm">
        <span className="text-lg">🔍</span>
        <span className="font-mono text-[11px] text-ink truncate">{CODIGO}</span>
      </Aparece>
      <Aparece en={1.6} className="rounded-xl bg-white border border-line p-2 space-y-1 text-[10px] font-mono text-ink">
        <p>📁 {CODIGO}</p>
        <p className="break-all">📄 {DOCUMENTOS[1].nombre}</p>
        <p>✉️ {CODIGO} — Faltan CURPs del grupo A</p>
      </Aparece>
      <Aparece en={1.9} className="text-center text-sm font-bold text-violet-700">
        ¡Aparece todo junto! 🎉
      </Aparece>
    </div>
  );
}

function EscenaCarpeta() {
  const docs = DOCUMENTOS.slice(1, 4);
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Aparece className="flex flex-col items-center">
        <span className="text-6xl leading-none">📂</span>
        <Etiqueta className="text-xs -mt-1">{CODIGO}</Etiqueta>
        <span className="text-[11px] text-emerald-700 font-semibold mt-1">↑ el trabajo: “{NOMBRE}”</span>
      </Aparece>
      <div className="w-full border-l-4 border-emerald-300 pl-3 space-y-1.5">
        {docs.map((d, i) => (
          <Aparece key={d.nombre} en={0.5 + i * 0.35} className="flex items-center gap-2 rounded-lg bg-white border border-line px-2 py-1.5">
            <span className="text-lg">{d.icono}</span>
            <span className="font-mono text-[9px] text-ink break-all leading-tight">{d.nombre}</span>
          </Aparece>
        ))}
      </div>
      <Aparece en={1.7} className="text-[11px] text-emerald-700 font-semibold">
        ↑ sus documentos, cada uno con su nombre
      </Aparece>
    </div>
  );
}

// Cómo se arma el nombre de un documento, pedazo por pedazo.
function EscenaNombreDocumento() {
  const d = DOCUMENTOS[2];
  const pedazos = [
    { texto: CODIGO, clase: "bg-ink text-paper border-ink", dice: "el trabajo" },
    { texto: `${d.tipo}-${String(d.numero).padStart(3, "0")}`, clase: "bg-rose-100 text-rose-800 border-rose-300", dice: "qué es y su número" },
    { texto: d.descripcion.split(" ").map(sanearSegmento).join("-"), clase: COLOR_AREA, dice: "de quién o de qué" },
    { texto: d.fecha, clase: COLOR_CLAVE, dice: "la fecha" },
  ];
  return (
    <div className="w-full space-y-2">
      <Aparece className="text-center rounded-xl bg-white border border-line px-3 py-2">
        <p className="text-3xl leading-none">{d.icono}</p>
        <p className="text-xs font-semibold text-ink mt-1">El acta de nacimiento de {d.descripcion}</p>
      </Aparece>
      <div className="space-y-1.5">
        {pedazos.map((p, i) => (
          <Aparece key={p.dice} en={0.5 + i * 0.45} className="flex items-center gap-2">
            {i > 0 && <span className="font-mono font-bold text-ink-soft">_</span>}
            <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-bold whitespace-nowrap ${p.clase} ${i === 0 ? "ml-[13px]" : ""}`}>{p.texto}</span>
            <span className="text-[11px] text-ink-soft whitespace-nowrap">← {p.dice}</span>
          </Aparece>
        ))}
      </div>
      <Aparece en={2.4} className="rounded-xl bg-ink text-paper px-3 py-2 text-center">
        <p className="text-[10px] uppercase tracking-wider text-paper/60">Así se guarda el archivo</p>
        <p className="font-mono text-[11px] font-bold break-all">{d.nombre}</p>
      </Aparece>
    </div>
  );
}

const LUCES = [
  { color: "bg-red-500", apagada: "bg-red-900/40", brillo: "shadow-[0_0_18px_4px_rgba(239,68,68,0.7)]", emoji: "🔴", texto: "Por iniciar", detalle: "Todavía no empieza" },
  { color: "bg-yellow-400", apagada: "bg-yellow-900/40", brillo: "shadow-[0_0_18px_4px_rgba(250,204,21,0.7)]", emoji: "🟡", texto: "En curso", detalle: "Se está trabajando" },
  { color: "bg-green-500", apagada: "bg-green-900/40", brillo: "shadow-[0_0_18px_4px_rgba(34,197,94,0.7)]", emoji: "🟢", texto: "Concluido", detalle: "¡Ya se entregó!" },
];

function EscenaSemaforo() {
  const [encendida, setEncendida] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setEncendida((n) => (n + 1) % LUCES.length), 1300);
    return () => clearInterval(t);
  }, []);
  const luz = LUCES[encendida];
  return (
    <div className="flex items-center justify-center gap-6">
      <Aparece className="flex flex-col items-center">
        <div className="rounded-2xl bg-ink p-2.5 space-y-2.5">
          {LUCES.map((l, i) => (
            <div key={l.texto} className={`w-12 h-12 rounded-full transition-all duration-300 ${i === encendida ? `${l.color} ${l.brillo}` : l.apagada}`} />
          ))}
        </div>
        <div className="w-2.5 h-8 bg-ink" />
      </Aparece>
      <Aparece en={0.3} className="w-36">
        <p className="text-4xl">{luz.emoji}</p>
        <p className="text-xl font-bold text-ink mt-1">{luz.texto}</p>
        <p className="text-sm text-ink-soft">{luz.detalle}</p>
      </Aparece>
    </div>
  );
}

function EscenaLibreta() {
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Aparece className="rounded-2xl bg-white border-2 border-emerald-300 p-3 text-center">
          <p className="text-5xl">📒</p>
          <p className="text-2xl -mt-1">✅</p>
          <p className="text-xs font-semibold text-ink mt-1 leading-tight">Apunta el nombre y dónde está</p>
        </Aparece>
        <Aparece en={0.4} className="rounded-2xl bg-white border-2 border-rose-300 p-3 text-center">
          <div className="relative inline-block">
            <p className="text-5xl opacity-60">🗄️</p>
            <span className="absolute inset-0 flex items-center justify-center text-5xl">❌</span>
          </div>
          <p className="text-xs font-semibold text-ink mt-1 leading-tight">No guarda tus archivos ni manda correos</p>
        </Aparece>
      </div>
      <Aparece en={1} className="rounded-2xl bg-amber-50 border border-amber-200 p-2.5">
        <p className="text-[11px] font-bold text-amber-800 text-center mb-1">La libreta vive en esta compu. Sácale copia:</p>
        <div className="flex items-center justify-center gap-2 text-3xl">
          <span>💻</span>
          <span className="text-base text-amber-600 font-bold">→</span>
          <span className="animate-flotar">💾</span>
          <span className="text-base text-amber-600 font-bold">→</span>
          <span>☁️</span>
          <span className="text-sm text-ink-soft">o</span>
          <span>🔌</span>
        </div>
      </Aparece>
    </div>
  );
}

function EscenaEquipo() {
  const personas = ["👩‍🏫", "🧑‍💼", "👨‍🔧", "👩‍💻"];
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex gap-3">
        {personas.map((p, i) => (
          <Aparece key={p} en={i * 0.2} className="flex flex-col items-center">
            <span className="text-4xl">{p}</span>
            <span className="text-lg text-ink-faint">↓</span>
          </Aparece>
        ))}
      </div>
      <Aparece en={0.9} className="flex flex-col items-center">
        <span className="text-6xl leading-none animate-flotar">📁</span>
        <Etiqueta className="text-xs -mt-1">{CODIGO}</Etiqueta>
      </Aparece>
      <Aparece en={1.3} className="rounded-full bg-emerald-100 text-emerald-800 px-4 py-1.5 text-sm font-bold">
        ✅ Todos lo encuentran, hoy o en 5 años
      </Aparece>
    </div>
  );
}

// El objetivo final: cómo estaba todo antes y cómo queda la carpeta real al terminar.
function EscenaResultado() {
  const antes = ["curps.xlsx", "curps final.xlsx", "acta ana (1).pdf", "Documento1.pdf"];
  const logros = [
    { icono: "🔍", texto: "Encuentras todo en segundos" },
    { icono: "📋", texto: "Sabes cómo va cada trabajo" },
    { icono: "🤝", texto: "Tu equipo lo entiende sin preguntar" },
    { icono: "📊", texto: "Reporte en Excel para entregar" },
  ];
  return (
    <div className="w-full space-y-2">
      <Aparece className="rounded-xl bg-white border-2 border-rose-200 px-2 py-1.5">
        <p className="text-[10px] font-bold text-rose-700">😩 ANTES</p>
        <p className="font-mono text-[10px] text-ink-soft line-through decoration-rose-400">{antes.join(" · ")}</p>
      </Aparece>
      <Aparece en={0.4} className="text-center text-lg text-emerald-600 font-bold leading-none">
        ↓
      </Aparece>
      <Aparece en={0.6} className="rounded-xl bg-white border-2 border-emerald-300 px-2 py-2">
        <p className="text-[10px] font-bold text-emerald-700 mb-1">😊 DESPUÉS: así queda tu carpeta</p>
        <div className="font-mono text-[9px] text-ink leading-snug space-y-0.5">
          <p className="font-bold text-[10px]">📂 {CODIGO}</p>
          {CARPETAS.map((c, i) => (
            <Aparece key={c} en={0.9 + i * 0.35} className="pl-3 space-y-0.5">
              <p className="font-semibold">📁 {c}</p>
              {DOCUMENTOS.filter((d) => d.carpeta === c).map((d) => (
                <p key={d.nombre} className="pl-4 break-all text-ink-soft">
                  {d.icono} {d.nombre}
                </p>
              ))}
            </Aparece>
          ))}
        </div>
      </Aparece>
      <div className="grid grid-cols-2 gap-1.5">
        {logros.map((l, i) => (
          <Aparece key={l.texto} en={2.5 + i * 0.25} className="flex items-center gap-1.5 rounded-lg bg-white border border-emerald-200 px-2 py-1">
            <span className="text-base">{l.icono}</span>
            <span className="text-[10px] font-semibold text-ink leading-tight">{l.texto}</span>
          </Aparece>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Tarjetas --------------------------------- */

const TARJETAS: { titulo: string; frase: ReactNode; fondo: string; escena: () => ReactNode }[] = [
  {
    titulo: "¿Te ha pasado esto?",
    frase: "Muchos archivos con nombres parecidos… y nadie sabe cuál es el bueno.",
    fondo: "bg-rose-50 border-rose-100",
    escena: EscenaDesorden,
  },
  {
    titulo: "La solución: una etiqueta",
    frase: (
      <>
        Como los frascos de la cocina: con etiqueta, cualquiera encuentra todo. A esa etiqueta le llamamos <strong>código</strong>.
      </>
    ),
    fondo: "bg-amber-50 border-amber-100",
    escena: EscenaEtiqueta,
  },
  {
    titulo: "Así se arma, pedazo por pedazo",
    frase: "Contestas 3 preguntas tocando opciones. Cada respuesta le agrega un pedazo al código.",
    fondo: "bg-sky-50 border-sky-100",
    escena: EscenaArmar,
  },
  {
    titulo: "Lo pones en todos lados",
    frase: "En tu carpeta, tus archivos y tus correos. Luego lo buscas y aparece todo junto.",
    fondo: "bg-violet-50 border-violet-100",
    escena: EscenaTodosLados,
  },
  {
    titulo: "Un trabajo = una carpeta",
    frase: "Adentro van sus documentos: oficios, listas, actas… Todos empiezan con el mismo código.",
    fondo: "bg-emerald-50 border-emerald-100",
    escena: EscenaCarpeta,
  },
  {
    titulo: "Cada documento, su nombre",
    frase: "La app te lo arma: código del trabajo + qué es + de quién + fecha. Aunque el archivo se salga de su carpeta, sabes de dónde es.",
    fondo: "bg-rose-50 border-rose-100",
    escena: EscenaNombreDocumento,
  },
  {
    titulo: "Sabes cómo va cada uno",
    frase: "Cada trabajo tiene su semáforo, como en la calle.",
    fondo: "bg-slate-50 border-slate-200",
    escena: EscenaSemaforo,
  },
  {
    titulo: "Es una libreta, no un cajón",
    frase: (
      <>
        Tus archivos se quedan donde siempre. De vez en cuando toca <strong>💾 Respaldo</strong> para sacarle copia a la libreta.
      </>
    ),
    fondo: "bg-orange-50 border-orange-100",
    escena: EscenaLibreta,
  },
  {
    titulo: "Todo tu equipo habla igual",
    frase: "Si todos usan los mismos códigos, cualquiera encuentra las cosas, aunque tú no estés.",
    fondo: "bg-teal-50 border-teal-100",
    escena: EscenaEquipo,
  },
  {
    titulo: "¿Qué obtienes al final?",
    frase: (
      <>
        Esta es la meta: <strong>todo con nombre, en su lugar y fácil de encontrar</strong>, para ti y para tu equipo. ¡Vamos a
        empezar! 🌱
      </>
    ),
    fondo: "bg-emerald-50 border-emerald-100",
    escena: EscenaResultado,
  },
];

export function Explicacion({ onSalir, onTerminar }: { onSalir: () => void; onTerminar: () => void }) {
  const [i, setI] = useState(0);
  const tarjeta = TARJETAS[i];
  const ultima = i === TARJETAS.length - 1;
  const Escena = tarjeta.escena;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-ink-soft">
          {i + 1} de {TARJETAS.length}
        </span>
        <BotonApp color="blanco" tamano="sm" onClick={onTerminar}>
          Saltar e ir a la app →
        </BotonApp>
      </div>
      <div className="flex gap-1.5" aria-hidden="true">
        {TARJETAS.map((t, n) => (
          <div key={t.titulo} className={`h-2 flex-1 rounded-full transition-colors ${n <= i ? "bg-sky-500" : "bg-line"}`} />
        ))}
      </div>

      {/* "key" hace que el dibujo se vuelva a armar cada vez que cambias de tarjeta. */}
      <div key={i} className="space-y-4">
        <div aria-hidden="true" className={`rounded-3xl border-2 p-4 min-h-[17rem] flex items-center justify-center overflow-hidden ${tarjeta.fondo}`}>
          <Escena />
        </div>
        <div className="text-center space-y-1.5 px-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink leading-tight">{tarjeta.titulo}</h2>
          <p className="text-base text-ink-soft leading-relaxed">{tarjeta.frase}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <BotonApp color="blanco" onClick={() => (i === 0 ? onSalir() : setI(i - 1))}>
          ← {i === 0 ? "Volver" : "Anterior"}
        </BotonApp>
        {ultima ? (
          <BotonApp className="flex-1" onClick={onTerminar}>
            🚀 Ir a la aplicación
          </BotonApp>
        ) : (
          <BotonApp color="azul" className="flex-1" onClick={() => setI(i + 1)}>
            Siguiente →
          </BotonApp>
        )}
      </div>
    </>
  );
}
