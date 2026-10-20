import { useEffect, useState, type ReactNode } from "react";
import { saveAs } from "file-saver";
import { useAppStore } from "../../store/useAppStore";
import {
  ACCIONES_SUGERIDAS,
  CATEGORIA_ICONOS,
  EJEMPLOS_AREA,
  EJEMPLOS_NOMBRE,
  EJEMPLOS_NOMBRE_GENERALES,
  LIMITE_CLAVE,
  UBICACION_INFO,
} from "../../domain/constants";
import { construirCodigoEsencial, escalarCodigo, excedeLimiteClave, sanearSegmento } from "../../domain/codigo";
import type { TipoUbicacion } from "../../domain/types";
import { Ayuda, BotonApp, Campo, Ejemplo, Opcion, Panel, Pastilla } from "../ui/Estilo";
import { UbicacionSelector } from "../ui/UbicacionSelector";
import { CodigoCopiable, GuiaCarpeta, ejemploUbicacion } from "../ui/GuiaCarpeta";

type NivelAlcance = "AREA" | "INSTITUCION" | "REGION";

// Una pregunta por pantalla. "pista" explica qué falta cuando no se puede avanzar.
const PASOS: { nombre: string; icono: string; pregunta: string; subtitulo: string; pista: string }[] = [
  {
    nombre: "Área",
    icono: "🏢",
    pregunta: "¿De qué área es este trabajo?",
    subtitulo: "Elige el departamento o equipo al que pertenece.",
    pista: "Elige un área (o crea una nueva) para continuar.",
  },
  {
    nombre: "Tipo",
    icono: "🏷️",
    pregunta: "¿Qué tipo de trabajo es?",
    subtitulo: "Elige la opción que mejor lo describa.",
    pista: "Elige un tipo de trabajo para continuar.",
  },
  {
    nombre: "Nombre",
    icono: "✏️",
    pregunta: "¿Cómo le dices a este trabajo?",
    subtitulo: "Su nombre en corto: como se lo dirías a un compañero.",
    pista: "Escribe un nombre corto para continuar.",
  },
  {
    nombre: "Recorrido",
    icono: "🧭",
    pregunta: "¿De dónde viene y a dónde va?",
    subtitulo: "Tres respuestas cortas para darle seguimiento.",
    pista: "Responde las tres preguntas para continuar.",
  },
  // "Quién lo usa" va antes de "Carpeta": así la carpeta se nombra con el código final.
  {
    nombre: "Quién lo usa",
    icono: "🌎",
    pregunta: "¿Quién más va a usar este trabajo?",
    subtitulo: "Si sale de tu institución, el código lleva sus siglas al inicio.",
    pista: "Escribe las siglas que faltan para continuar.",
  },
  {
    nombre: "Carpeta",
    icono: "📁",
    pregunta: "¿Dónde vas a guardar los archivos?",
    subtitulo: "La app no guarda tus archivos: solo anota dónde están.",
    pista: "Marca “Listo” o elige “Lo hago después” para continuar.",
  },
  {
    nombre: "Revisar",
    icono: "✅",
    pregunta: "Revisa y guarda",
    subtitulo: "Si algo no está bien, toca “Cambiar”.",
    pista: "",
  },
];

const ALCANCES: { valor: NivelAlcance; icono: string; titulo: string; texto: string }[] = [
  { valor: "AREA", icono: "🏢", titulo: "Solo gente de mi institución", texto: "Lo más común. El código queda como está" },
  { valor: "INSTITUCION", icono: "🏛️", titulo: "También otras instituciones", texto: "Se agregan las siglas de tu institución" },
  { valor: "REGION", icono: "🌎", titulo: "Una red regional o consorcio", texto: "Se agregan las siglas de la red" },
];

// Ejemplos concretos de cada nivel, para reconocer el propio caso.
const EJEMPLOS_ALCANCE: Record<NivelAlcance, string[]> = {
  AREA: ["Un manual para tu área", "Un reporte para Dirección", "Un evento interno de la escuela"],
  INSTITUCION: ["Un convenio con otra universidad", "Un congreso con invitados de fuera", "Un proyecto con una empresa"],
  REGION: ["Un proyecto de una red de bibliotecas de varios estados", "Un consorcio de universidades", "Un programa de una asociación nacional"],
};

function iconoArea(nombre: string): string {
  return EJEMPLOS_AREA.find((e) => e.nombre.toLowerCase() === nombre.toLowerCase())?.icono ?? "🏢";
}

export function WizardCrearTrabajo() {
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const crearArea = useAppStore((s) => s.crearArea);
  const crearCategoria = useAppStore((s) => s.crearCategoria);
  const crearTrabajo = useAppStore((s) => s.crearTrabajo);
  const irA = useAppStore((s) => s.irA);

  const areasActivas = areas.filter((a) => a.activa);
  const categoriasActivas = categorias.filter((c) => c.activa);

  const [paso, setPaso] = useState(0);
  const [mostrandoCheck, setMostrandoCheck] = useState(false);

  // Área — se elige de las tuyas, de la lista de ejemplos (un toque) o se escribe otra.
  const [areaCodigo, setAreaCodigo] = useState("");
  const [mostrarNuevaArea, setMostrarNuevaArea] = useState(false);
  const [nuevaAreaNombre, setNuevaAreaNombre] = useState("");
  const [nuevaAreaCodigo, setNuevaAreaCodigo] = useState("");
  const [nuevaAreaCorreo, setNuevaAreaCorreo] = useState("");

  // Categoría (tipo de trabajo)
  const [categoria, setCategoria] = useState("");
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [nuevaCatNombre, setNuevaCatNombre] = useState("");
  const [nuevaCatCodigo, setNuevaCatCodigo] = useState("");
  const [nuevaCatDeDonde, setNuevaCatDeDonde] = useState("");
  const [nuevaCatADonde, setNuevaCatADonde] = useState("");
  const [nuevaCatCorreo, setNuevaCatCorreo] = useState("");

  // Clave (nombre corto)
  const [claveInput, setClaveInput] = useState("");
  const codigoEsencial = areaCodigo && categoria && claveInput ? construirCodigoEsencial(areaCodigo, categoria, sanearSegmento(claveInput)) : "";

  // Recorrido
  const [origen, setOrigen] = useState("");
  const [accion, setAccion] = useState("");
  const [destino, setDestino] = useState("");

  // Carpeta
  const [tipoUbicacion, setTipoUbicacion] = useState<TipoUbicacion>("DIGITAL_LOCAL");
  const [descripcionUbicacion, setDescripcionUbicacion] = useState("");
  const [estructuraCreada, setEstructuraCreada] = useState(false);
  const [modoUbicacion, setModoUbicacion] = useState<"YA_CREADA" | "POR_PLANEAR" | "DESPUES">("POR_PLANEAR");
  const esCorreo = tipoUbicacion === "CORREO";

  // Alcance
  const [nivelAlcance, setNivelAlcance] = useState<NivelAlcance>("AREA");
  const [prefijoInstitucion, setPrefijoInstitucion] = useState("");
  const [prefijoRed, setPrefijoRed] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const nombreArea = areas.find((a) => a.codigo === areaCodigo)?.nombre ?? areaCodigo;
  const nombreCategoria = categoriasActivas.find((c) => c.codigo === categoria)?.nombre ?? categoria;

  const niveles = escalarCodigo({ areaCodigo, categoria, clave: claveInput, prefijoInstitucion, prefijoRed });
  const codigoSegunAlcance = nivelAlcance === "AREA" ? niveles.area : nivelAlcance === "INSTITUCION" ? niveles.institucion : niveles.region;
  // El único código que se usa desde "Quién lo usa" en adelante: carpeta, revisión y lista.
  const codigoFinal = codigoSegunAlcance || codigoEsencial;

  // Ejemplos de área que todavía no están entre tus áreas activas.
  const areasDisponibles = EJEMPLOS_AREA.filter(
    (ej) => !areasActivas.some((a) => a.codigo === ej.codigo || a.nombre.toLowerCase() === ej.nombre.toLowerCase()),
  );
  const ideasNombre = EJEMPLOS_NOMBRE[categoria] ?? EJEMPLOS_NOMBRE_GENERALES;

  // Cada paso empieza arriba, como una pantalla nueva.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [paso]);

  // Un toque en un ejemplo: se guarda como tu área (si no la tenías) y queda elegida.
  async function usarAreaEjemplo(ej: (typeof EJEMPLOS_AREA)[number]) {
    const existente = areas.find((a) => a.codigo === ej.codigo || a.nombre.toLowerCase() === ej.nombre.toLowerCase());
    const area = existente ?? (await crearArea(ej.nombre, ej.codigo));
    setAreaCodigo(area.codigo);
  }

  async function confirmarNuevaArea() {
    const codigo = sanearSegmento(nuevaAreaCodigo || nuevaAreaNombre);
    if (!codigo || !nuevaAreaNombre.trim()) return;
    const area = await crearArea(nuevaAreaNombre.trim(), codigo, nuevaAreaCorreo.trim() || undefined);
    setAreaCodigo(area.codigo);
    setMostrarNuevaArea(false);
    setNuevaAreaNombre("");
    setNuevaAreaCodigo("");
    setNuevaAreaCorreo("");
  }

  async function confirmarNuevaCategoria() {
    const codigo = sanearSegmento(nuevaCatCodigo || nuevaCatNombre);
    if (!codigo || !nuevaCatNombre.trim()) return;
    const cat = await crearCategoria({
      nombre: nuevaCatNombre.trim(),
      codigo,
      deDondeViene: nuevaCatDeDonde.trim(),
      aDondeVa: nuevaCatADonde.trim(),
      correoContacto: nuevaCatCorreo.trim() || undefined,
    });
    setCategoria(cat.codigo);
    setMostrarNuevaCategoria(false);
    setNuevaCatNombre("");
    setNuevaCatCodigo("");
    setNuevaCatDeDonde("");
    setNuevaCatADonde("");
    setNuevaCatCorreo("");
  }

  function avanzar() {
    setMostrandoCheck(true);
    setTimeout(() => {
      setMostrandoCheck(false);
      setPaso((p) => p + 1);
    }, 350);
  }

  function regresar() {
    if (paso === 0) irA("INICIO");
    else setPaso((p) => p - 1);
  }

  function descargarEstructuraSugerida() {
    const raiz = codigoFinal || "TU-CODIGO";
    const lugar =
      tipoUbicacion === "FISICO"
        ? `Archivero > cajón "${nombreArea}" > folder con la etiqueta ${raiz}`
        : tipoUbicacion === "NUBE"
          ? `Mi unidad > Trabajos > ${raiz}`
          : `Documentos > Trabajos > ${raiz}`;
    const contenido = `Cómo acomodar "${claveInput}" (código ${raiz})
Generado por Nomenclatura Viva

DÓNDE: ${lugar}

${raiz}
  01_ORIGEN       lo que lo pidió: oficios, solicitudes, correos
  02_DESARROLLO   borradores y avances
  03_PRODUCTO     el resultado final
  04_ENTREGA      lo que entregaste y los acuses

CONSEJO: pon el código al inicio de cada archivo, por ejemplo:
  ${raiz}_borrador.docx
Así lo encuentras escribiendo el código en el buscador.
`;
    saveAs(new Blob([contenido], { type: "text/plain;charset=utf-8" }), `pasos-carpeta_${raiz}.txt`);
  }

  async function confirmar() {
    if (!autorActivo.trim()) {
      setError("Escribe tus nombres y apellidos arriba a la derecha — así quedas registrado como autor de este trabajo.");
      return;
    }
    if (!areaCodigo || !categoria || !claveInput.trim() || !origen || !accion || !destino) {
      setError("Falta información. Revisa los pasos marcados como incompletos.");
      return;
    }
    if (excedeLimiteClave(claveInput)) {
      setError(`El nombre no puede tener más de ${LIMITE_CLAVE} letras.`);
      return;
    }
    setGuardando(true);
    setError("");
    const autor = autorActivo;
    const ahora = new Date().toISOString();
    await crearTrabajo({
      areaCodigo,
      categoria,
      clave: claveInput.trim(),
      prefijoInstitucion: nivelAlcance === "INSTITUCION" || nivelAlcance === "REGION" ? prefijoInstitucion || undefined : undefined,
      prefijoRed: nivelAlcance === "REGION" ? prefijoRed || undefined : undefined,
      ficha: {
        origen,
        accion,
        destino,
        estadoActual: "ROJO",
        historialEstados: [{ id: crypto.randomUUID(), estado: "ROJO", fecha: ahora, autor, nota: "Registro inicial" }],
      },
      ubicacion: { tipo: tipoUbicacion, descripcion: descripcionUbicacion },
      autorCreacion: autor,
      autorUltimaEdicion: autor,
    });
    setGuardando(false);
    irA("TABLERO");
  }

  const pasoActual = PASOS[paso];
  const esUltimo = paso === PASOS.length - 1;
  const puedeAvanzar =
    (paso === 0 && !!areaCodigo) ||
    (paso === 1 && !!categoria) ||
    (paso === 2 && !!claveInput.trim()) ||
    (paso === 3 && !!origen.trim() && !!accion.trim() && !!destino.trim()) ||
    (paso === 4 &&
      (nivelAlcance === "AREA" ||
        (nivelAlcance === "INSTITUCION" && !!prefijoInstitucion.trim()) ||
        (nivelAlcance === "REGION" && !!prefijoInstitucion.trim() && !!prefijoRed.trim()))) ||
    (paso === 5 && (estructuraCreada || modoUbicacion === "DESPUES"));

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      {mostrandoCheck && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg animate-bounce text-white bg-emerald-500">✓</div>
        </div>
      )}

      {/* Progreso */}
      <div>
        <div className="flex items-center justify-between text-xs font-medium text-ink-soft mb-2">
          <span>
            Paso {paso + 1} de {PASOS.length}
          </span>
          <span className="text-emerald-700 font-semibold">{pasoActual.nombre}</span>
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          {PASOS.map((p, i) => (
            <div
              key={p.nombre}
              className={`h-2 flex-1 rounded-full transition-colors ${i < paso ? "bg-emerald-500" : i === paso ? "bg-emerald-300" : "bg-line"}`}
            />
          ))}
        </div>
      </div>

      {/* Pregunta del paso */}
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="shrink-0 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">
          {pasoActual.icono}
        </span>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink leading-tight">{pasoActual.pregunta}</h1>
          <p className="text-sm text-ink-soft mt-0.5">{pasoActual.subtitulo}</p>
        </div>
      </div>

      {/* ---------- Paso 1: Área ---------- */}
      {paso === 0 && (
        <div className="space-y-3">
          {areasActivas.length > 0 && <p className="text-sm font-semibold text-ink">Tus áreas</p>}
          {areasActivas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {areasActivas.map((a) => (
                <Opcion
                  key={a.id}
                  icono={iconoArea(a.nombre)}
                  titulo={a.nombre}
                  texto={`Código: ${a.codigo}`}
                  seleccionada={areaCodigo === a.codigo}
                  onClick={() => setAreaCodigo(a.codigo)}
                />
              ))}
            </div>
          )}

          {areasDisponibles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">
                {areasActivas.length > 0 ? "¿Es otra? Toca la tuya" : "Toca tu área"}
                <span className="block text-xs font-normal text-ink-soft">Queda guardada para la próxima vez.</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {areasDisponibles.map((ej) => (
                  <Pastilla key={ej.codigo} onClick={() => usarAreaEjemplo(ej)}>
                    {ej.icono} {ej.nombre}
                  </Pastilla>
                ))}
              </div>
            </div>
          )}

          {!mostrarNuevaArea ? (
            <Opcion punteada icono="➕" titulo="¿No aparece? Escríbela" texto="Por ejemplo: Contraloría, Enfermería, Idiomas…" onClick={() => setMostrarNuevaArea(true)} />
          ) : (
            <Panel className="space-y-4 bg-white">
              <p className="font-semibold text-ink">Nueva área</p>
              <Campo
                etiqueta="¿Cómo se llama el área?"
                value={nuevaAreaNombre}
                onChange={(e) => setNuevaAreaNombre(e.target.value)}
                placeholder="Ej. Contraloría"
                autoFocus
                pista={
                  nuevaAreaNombre.trim() ? (
                    <>
                      Su código será: <strong className="font-mono text-ink">{sanearSegmento(nuevaAreaCodigo || nuevaAreaNombre)}</strong>
                    </>
                  ) : (
                    "Escribe el nombre como lo dicen en tu institución. El código corto se arma solo."
                  )
                }
              />
              <Ayuda titulo="Más opciones (no es obligatorio)" icono="⚙️">
                <Campo
                  etiqueta="Código corto"
                  value={nuevaAreaCodigo}
                  onChange={(e) => setNuevaAreaCodigo(e.target.value)}
                  placeholder="Ej. CONTRA"
                  pista="Si el nombre es largo, escribe aquí una abreviatura de 3 a 8 letras."
                />
                <Campo
                  etiqueta="Correo de contacto del área"
                  type="email"
                  value={nuevaAreaCorreo}
                  onChange={(e) => setNuevaAreaCorreo(e.target.value)}
                  placeholder="Ej. biblioteca@tuinstitucion.edu.mx"
                />
              </Ayuda>
              <div className="flex gap-2">
                <BotonApp onClick={confirmarNuevaArea} disabled={!nuevaAreaNombre.trim()} className="flex-1">
                  Guardar área
                </BotonApp>
                <BotonApp color="blanco" onClick={() => setMostrarNuevaArea(false)}>
                  Cancelar
                </BotonApp>
              </div>
            </Panel>
          )}

          <Ayuda titulo="¿Qué es un área?">
            <p>
              Es el departamento o equipo de tu institución que es dueño de este trabajo. Usa los mismos nombres que ya
              tienen en tu institución.
            </p>
            <Ejemplo bien>"Biblioteca" — claro, cualquiera lo reconoce.</Ejemplo>
            <Ejemplo bien={false}>"Depto 3" — no dice qué área es.</Ejemplo>
          </Ayuda>
        </div>
      )}

      {/* ---------- Paso 2: Tipo (categoría) ---------- */}
      {paso === 1 && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoriasActivas.map((c) => (
              <Opcion
                key={c.id}
                icono={CATEGORIA_ICONOS[c.codigo] ?? "🏷️"}
                titulo={c.nombre}
                texto={c.deDondeViene && c.aDondeVa ? `${c.deDondeViene} → ${c.aDondeVa}` : `Código: ${c.codigo}`}
                seleccionada={categoria === c.codigo}
                onClick={() => setCategoria(c.codigo)}
              />
            ))}
          </div>

          {!mostrarNuevaCategoria ? (
            <Opcion punteada icono="➕" titulo="Crear un tipo nuevo" texto="Si ninguno describe tu trabajo" onClick={() => setMostrarNuevaCategoria(true)} />
          ) : (
            <Panel className="space-y-4 bg-white">
              <p className="font-semibold text-ink">Nuevo tipo de trabajo</p>
              <Campo
                etiqueta="¿Cómo se llama este tipo?"
                value={nuevaCatNombre}
                onChange={(e) => setNuevaCatNombre(e.target.value)}
                placeholder="Ej. Vinculación"
                autoFocus
                pista={
                  nuevaCatNombre.trim() ? (
                    <>
                      Su código será: <strong className="font-mono text-ink">{sanearSegmento(nuevaCatCodigo || nuevaCatNombre)}</strong>
                    </>
                  ) : (
                    "El código corto se arma solo con el nombre."
                  )
                }
              />
              <Ayuda titulo="Más opciones (no es obligatorio)" icono="⚙️">
                <Campo etiqueta="Código corto" value={nuevaCatCodigo} onChange={(e) => setNuevaCatCodigo(e.target.value)} placeholder="Ej. VINC" />
                <Campo
                  etiqueta="¿De dónde suele venir?"
                  value={nuevaCatDeDonde}
                  onChange={(e) => setNuevaCatDeDonde(e.target.value)}
                  placeholder="Ej. Solicitud externa"
                />
                <Campo
                  etiqueta="¿A dónde suele ir?"
                  value={nuevaCatADonde}
                  onChange={(e) => setNuevaCatADonde(e.target.value)}
                  placeholder="Ej. Convenio firmado"
                />
                <Campo
                  etiqueta="Correo de contacto"
                  type="email"
                  value={nuevaCatCorreo}
                  onChange={(e) => setNuevaCatCorreo(e.target.value)}
                  placeholder="Ej. vinculacion@tuinstitucion.edu.mx"
                />
              </Ayuda>
              <div className="flex gap-2">
                <BotonApp onClick={confirmarNuevaCategoria} disabled={!nuevaCatNombre.trim()} className="flex-1">
                  Guardar tipo
                </BotonApp>
                <BotonApp color="blanco" onClick={() => setMostrarNuevaCategoria(false)}>
                  Cancelar
                </BotonApp>
              </div>
            </Panel>
          )}

          <Ayuda titulo="¿Para qué sirve el tipo?">
            <p>
              Dice qué clase de trabajo es (un proyecto, un convenio, una producción…). Sirve para encontrar y comparar
              todos los trabajos del mismo tipo, aunque sean de áreas distintas.
            </p>
            <p>Los tipos se pueden editar o agregar después desde Configuración.</p>
            <Ejemplo bien>Un video institucional → Divulgación (es para mostrarlo).</Ejemplo>
            <Ejemplo bien={false}>Ese mismo video como "Administración" — no dice qué es.</Ejemplo>
          </Ayuda>
        </div>
      )}

      {/* ---------- Paso 3: Nombre corto (clave) ---------- */}
      {paso === 2 && (
        <div className="space-y-4">
          {/* Qué es y para qué sirve, a la vista (no escondido en una ayuda). */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink-soft leading-snug">
            <p className="flex gap-2">
              <span aria-hidden="true" className="text-lg leading-none">📌</span>
              <span>
                <strong className="text-ink">¿Qué es?</strong> El nombre con el que tú y tu equipo reconocen este trabajo. Por
                ejemplo: <em>“el catálogo de libros”</em>.
              </span>
            </p>
            <p className="flex gap-2">
              <span aria-hidden="true" className="text-lg leading-none">🤔</span>
              <span>
                <strong className="text-ink">¿Para qué?</strong> Con él se arma el código que llevarán tu carpeta, tus archivos y
                tus correos. Si es claro, cualquiera lo encuentra después.
              </span>
            </p>
          </div>

          <Campo
            value={claveInput}
            onChange={(e) => setClaveInput(e.target.value)}
            maxLength={LIMITE_CLAVE}
            placeholder={`Ej. ${ideasNombre[0]}`}
            autoFocus
            className="text-lg"
            pista={
              <span className={claveInput.length > LIMITE_CLAVE - 5 ? "text-amber-700 font-semibold" : ""}>
                {claveInput.length} de {LIMITE_CLAVE} letras · Qué es + de cuándo (año o periodo)
              </span>
            }
          />

          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">
              Ideas para {nombreCategoria ? `“${nombreCategoria}”` : "tu trabajo"}
              <span className="block text-xs font-normal text-ink-soft">Toca una para usarla y cámbiala a tu gusto.</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {ideasNombre.map((idea) => (
                <Pastilla key={idea} activa={claveInput === idea} onClick={() => setClaveInput(idea)}>
                  {idea}
                </Pastilla>
              ))}
            </div>
          </div>

          <VistaCodigo
            partes={[
              { texto: nombreArea || "Área", clase: "bg-sky-100 text-sky-800" },
              { texto: nombreCategoria || "Tipo", clase: "bg-emerald-100 text-emerald-800" },
              { texto: claveInput || "Nombre", clase: "bg-amber-100 text-amber-800" },
            ]}
            codigo={codigoEsencial}
          />

          {codigoEsencial && <VistaPrevia codigo={codigoEsencial} nombre={claveInput} />}

          <div className="flex flex-wrap gap-2">
            <Ayuda titulo="Consejos para un buen nombre" icono="📝">
              <ol className="list-decimal ml-4 space-y-0.5">
                <li>Piensa en el nombre natural del trabajo.</li>
                <li>Hazlo corto y claro.</li>
                <li>Si tiene fecha o periodo, agrégalo.</li>
                <li>Que alguien de otra área entienda de qué se trata.</li>
              </ol>
              <Ejemplo bien>"Catálogo de libros 2026" — corto, específico, con fecha.</Ejemplo>
              <Ejemplo bien={false}>"Cosas de la biblioteca de este semestre y el próximo" — muy largo.</Ejemplo>
              <Ejemplo bien={false}>"Doc1" — no dice nada.</Ejemplo>
            </Ayuda>
          </div>
        </div>
      )}

      {/* ---------- Paso 4: Recorrido ---------- */}
      {paso === 3 && (
        <div className="space-y-3">
          <PreguntaNumerada numero={1} listo={!!origen.trim()}>
            <Campo
              etiqueta="📥 ¿Quién lo pidió o de dónde viene?"
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              placeholder="Ej. Lo solicita Coordinación Académica"
            />
          </PreguntaNumerada>

          <PreguntaNumerada numero={2} listo={!!accion.trim()}>
            <Campo etiqueta="⚙️ ¿Qué se va a hacer?" value={accion} onChange={(e) => setAccion(e.target.value)} placeholder="Ej. Construir" />
            <div className="flex flex-wrap gap-2 mt-2">
              {ACCIONES_SUGERIDAS.map((a) => (
                <Pastilla key={a} activa={accion === a} onClick={() => setAccion(a)}>
                  {a}
                </Pastilla>
              ))}
            </div>
          </PreguntaNumerada>

          <PreguntaNumerada numero={3} listo={!!destino.trim()}>
            <Campo
              etiqueta="📤 ¿Qué se va a entregar?"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Ej. Un catálogo que se pueda consultar"
            />
          </PreguntaNumerada>

          <p className="text-sm text-ink-soft flex items-center gap-2 px-1">
            <span aria-hidden="true">🔴</span>
            Tu trabajo empieza como <strong className="text-ink">“Por iniciar”</strong>. Después podrás cambiar su estado.
          </p>
        </div>
      )}

      {/* ---------- Paso 6: Carpeta ---------- */}
      {paso === 5 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">1. ¿Dónde van a estar los archivos?</p>
            <UbicacionSelector value={tipoUbicacion} onChange={setTipoUbicacion} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">2. {esCorreo ? "¿Ya usas el código en tus correos?" : "¿Ya tienes la carpeta creada?"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Opcion
                icono="✅"
                titulo={esCorreo ? "Sí, ya lo uso" : "Sí, ya la tengo"}
                texto="Solo voy a anotar dónde quedó"
                seleccionada={modoUbicacion === "YA_CREADA"}
                onClick={() => setModoUbicacion("YA_CREADA")}
              />
              <Opcion
                icono="🙋"
                titulo="Todavía no"
                texto="Dime paso a paso qué hacer"
                seleccionada={modoUbicacion === "POR_PLANEAR"}
                onClick={() => setModoUbicacion("POR_PLANEAR")}
              />
              <Opcion
                icono="⏰"
                titulo="Lo hago después"
                texto="Lo anoto luego en la ficha del trabajo"
                seleccionada={modoUbicacion === "DESPUES"}
                onClick={() => setModoUbicacion("DESPUES")}
              />
            </div>
          </div>

          {modoUbicacion === "DESPUES" ? (
            <p className="text-sm text-ink-soft flex items-start gap-2 px-1">
              <span aria-hidden="true">👍</span>
              <span>
                Sin problema. Cuando lo tengas, entra a <strong className="text-ink">Mis trabajos</strong>, toca este trabajo y
                anota dónde quedaron los archivos. Su código será <strong className="font-mono text-ink">{codigoFinal}</strong>.
              </span>
            </p>
          ) : (
          <>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink">
              3. {modoUbicacion === "POR_PLANEAR" ? `Sigue estos pasos (${UBICACION_INFO[tipoUbicacion].etiqueta.toLowerCase()})` : "Revisa el nombre"}
            </p>
            <div className="rounded-2xl bg-white border border-line p-4 space-y-4">
              {modoUbicacion === "POR_PLANEAR" ? (
                <GuiaCarpeta tipo={tipoUbicacion} codigo={codigoFinal} nombre={claveInput} nombreArea={nombreArea} />
              ) : (
                <Instruccion numero={1} titulo={esCorreo ? "Revisa que el asunto empiece con este código" : "Revisa que tu carpeta se llame igual que este código"}>
                  <CodigoCopiable codigo={codigoFinal} />
                  <p className="text-xs text-ink-soft">Si se llama distinto, cámbiale el nombre: clic derecho en la carpeta → Cambiar nombre → pega el código.</p>
                </Instruccion>
              )}
              {!esCorreo && (
                <BotonApp color="blanco" tamano="sm" onClick={descargarEstructuraSugerida}>
                  ⬇️ Descargar estos pasos
                </BotonApp>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">
              4. {esCorreo ? "Anota en qué correo lo manejas" : "Anota dónde quedó"}
              <span className="block text-xs font-normal text-ink-soft">Así tú o un compañero lo encuentran sin preguntar.</span>
            </p>
            <Campo
              value={descripcionUbicacion}
              onChange={(e) => setDescripcionUbicacion(e.target.value)}
              placeholder={`Ej. ${ejemploUbicacion(tipoUbicacion, codigoFinal, nombreArea)}`}
            />
            <Pastilla onClick={() => setDescripcionUbicacion(ejemploUbicacion(tipoUbicacion, codigoFinal, nombreArea))}>
              Usar el ejemplo
            </Pastilla>
          </div>

          <Opcion
            icono="🏁"
            titulo={esCorreo ? "Listo, ya sé cómo nombrar mis correos" : "Listo, ya organicé mi carpeta"}
            texto="Márcalo cuando termines los pasos de arriba"
            seleccionada={estructuraCreada}
            onClick={() => setEstructuraCreada((v) => !v)}
          />
          </>
          )}
        </div>
      )}

      {/* ---------- Paso 5: Quién lo usa ---------- */}
      {paso === 4 && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ALCANCES.map((a) => (
              <Opcion
                key={a.valor}
                icono={a.icono}
                titulo={a.titulo}
                texto={a.texto}
                seleccionada={nivelAlcance === a.valor}
                onClick={() => setNivelAlcance(a.valor)}
              />
            ))}
          </div>

          {(nivelAlcance === "INSTITUCION" || nivelAlcance === "REGION") && (
            <Campo
              etiqueta="Siglas de tu institución"
              value={prefijoInstitucion}
              onChange={(e) => setPrefijoInstitucion(sanearSegmento(e.target.value))}
              placeholder="Ej. UNAM"
              autoFocus
            />
          )}
          {nivelAlcance === "REGION" && (
            <Campo etiqueta="Siglas de la red o región" value={prefijoRed} onChange={(e) => setPrefijoRed(sanearSegmento(e.target.value))} placeholder="Ej. RED" />
          )}

          {(nivelAlcance === "INSTITUCION" || nivelAlcance === "REGION") && (
            <div className="rounded-2xl bg-white border border-line p-3 text-xs text-ink-soft space-y-1.5">
              <p className="font-semibold text-ink text-sm">✍️ Cómo escribir las siglas</p>
              <p>Usa las letras con que todos conocen a tu institución{nivelAlcance === "REGION" ? " y a la red" : ""}.</p>
              <Ejemplo bien>UNAM · IPN · UAQ · UMQ{nivelAlcance === "REGION" ? " · ANUIES · REDBIB" : ""}</Ejemplo>
              <Ejemplo bien={false}>Universidad Nacional Autónoma de México — muy largo</Ejemplo>
              <p>Los puntos y espacios se quitan solos: “U.N.A.M.” queda como “UNAM”.</p>
            </div>
          )}

          <VistaCodigo
            codigo={codigoSegunAlcance ?? ""}
            vacio="Escribe las siglas para ver tu código"
            partes={[
              ...(nivelAlcance === "REGION" ? [{ texto: prefijoRed || "Red", clase: "bg-violet-100 text-violet-800" }] : []),
              ...(nivelAlcance !== "AREA" ? [{ texto: prefijoInstitucion || "Institución", clase: "bg-rose-100 text-rose-800" }] : []),
              { texto: nombreArea || "Área", clase: "bg-sky-100 text-sky-800" },
              { texto: nombreCategoria || "Tipo", clase: "bg-emerald-100 text-emerald-800" },
              { texto: claveInput || "Nombre", clase: "bg-amber-100 text-amber-800" },
            ]}
          />

          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-3 text-sm text-ink-soft space-y-1">
            <p className="font-semibold text-ink">Por ejemplo, eliges esta opción si es…</p>
            <ul className="space-y-0.5">
              {EJEMPLOS_ALCANCE[nivelAlcance].map((e) => (
                <li key={e}>• {e}</li>
              ))}
            </ul>
            <p className="text-xs pt-1">¿No estás seguro? Deja “Solo gente de mi institución”. Lo puedes cambiar después en la ficha del trabajo.</p>
          </div>
        </div>
      )}

      {/* ---------- Paso 7: Revisar ---------- */}
      {paso === 6 && (
        <div className="space-y-3">
          <VistaCodigo codigo={codigoFinal} grande />
          <Panel className="bg-white p-0 divide-y divide-line">
            <FilaResumen icono="🏢" etiqueta="Área" valor={nombreArea} onCambiar={() => setPaso(0)} />
            <FilaResumen icono="🏷️" etiqueta="Tipo" valor={nombreCategoria} onCambiar={() => setPaso(1)} />
            <FilaResumen icono="✏️" etiqueta="Nombre" valor={claveInput} onCambiar={() => setPaso(2)} />
            <FilaResumen
              icono="🧭"
              etiqueta="Recorrido"
              valor={origen && accion && destino ? `${origen} → ${accion} → ${destino}` : ""}
              onCambiar={() => setPaso(3)}
            />
            <FilaResumen
              icono="🌎"
              etiqueta="Quién lo usa"
              valor={ALCANCES.find((a) => a.valor === nivelAlcance)?.titulo ?? ""}
              onCambiar={() => setPaso(4)}
            />
            <FilaResumen
              icono="📁"
              etiqueta="Carpeta"
              valor={
                modoUbicacion === "DESPUES"
                  ? "Lo anoto después"
                  : `${UBICACION_INFO[tipoUbicacion].etiqueta}${descripcionUbicacion ? ` · ${descripcionUbicacion}` : ""}`
              }
              onCambiar={() => setPaso(5)}
            />
          </Panel>
        </div>
      )}

      {error && <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {/* Barra de acciones, siempre visible abajo */}
      <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 pt-2 pb-4 bg-app/95 backdrop-blur">
        {!esUltimo && !puedeAvanzar && <p className="text-xs text-ink-soft text-center mb-2">{pasoActual.pista}</p>}
        <div className="flex gap-3">
          <BotonApp color="blanco" tamano="lg" onClick={regresar}>
            {paso === 0 ? "Salir" : "Atrás"}
          </BotonApp>
          {!esUltimo ? (
            <BotonApp tamano="lg" className="flex-1" onClick={avanzar} disabled={!puedeAvanzar}>
              Siguiente
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </BotonApp>
          ) : (
            <BotonApp tamano="lg" className="flex-1" onClick={confirmar} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar trabajo"}
            </BotonApp>
          )}
        </div>
      </div>
    </div>
  );
}

// Muestra cómo queda el código. Con "partes", enseña de qué se arma (Área + Tipo + Nombre).
function VistaCodigo({
  codigo,
  partes,
  vacio = "Tu código aparecerá aquí",
  grande = false,
}: {
  codigo: string;
  partes?: { texto: string; clase: string }[];
  vacio?: string;
  grande?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-ink text-paper p-4 text-center">
      <p className="text-[11px] uppercase tracking-wider text-paper/60 mb-1">Así queda tu código</p>
      <p className={`font-mono font-semibold break-all ${grande ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"} ${codigo ? "" : "text-paper/40"}`}>
        {codigo || vacio}
      </p>
      {partes && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
          {partes.map((p, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-paper/40">+</span>}
              <span className={`px-2 py-0.5 rounded-md font-medium ${p.clase}`}>{p.texto}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Muestra dónde va a aparecer el código: carpeta, archivo y asunto de correo.
function VistaPrevia({ codigo, nombre }: { codigo: string; nombre: string }) {
  const filas = [
    { icono: "📁", donde: "Tu carpeta", texto: codigo },
    { icono: "📄", donde: "Tus archivos", texto: `${codigo}_borrador.docx` },
    { icono: "✉️", donde: "Tus correos", texto: `${codigo} — ${nombre}` },
  ];
  return (
    <div className="rounded-2xl bg-white border border-line p-3 space-y-1.5">
      <p className="text-xs font-semibold text-ink-soft">Así se va a ver:</p>
      {filas.map((f) => (
        <div key={f.donde} className="flex items-center gap-2 text-xs">
          <span aria-hidden="true">{f.icono}</span>
          <span className="shrink-0 w-24 text-ink-faint">{f.donde}</span>
          <span className="font-mono text-ink truncate">{f.texto}</span>
        </div>
      ))}
    </div>
  );
}

function PreguntaNumerada({ numero, listo, children }: { numero: number; listo: boolean; children: ReactNode }) {
  return (
    <Panel className="bg-white flex gap-3">
      <span
        aria-hidden="true"
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          listo ? "bg-emerald-500 text-white" : "bg-app text-ink-soft"
        }`}
      >
        {listo ? "✓" : numero}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </Panel>
  );
}

// Instrucción numerada (informativa): número en círculo + qué hacer + lo necesario para hacerlo.
function Instruccion({ numero, titulo, children }: { numero: number; titulo: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span aria-hidden="true" className="shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
        {numero}
      </span>
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-sm font-semibold text-ink pt-0.5">{titulo}</p>
        {children}
      </div>
    </div>
  );
}


function FilaResumen({ icono, etiqueta, valor, onCambiar }: { icono: string; etiqueta: string; valor: string; onCambiar: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span aria-hidden="true" className="shrink-0 text-xl">
        {icono}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink-faint">{etiqueta}</p>
        <p className={`text-sm font-medium break-words ${valor ? "text-ink" : "text-red-600"}`}>{valor || "Falta completar"}</p>
      </div>
      <BotonApp color="blanco" tamano="sm" onClick={onCambiar}>
        Cambiar
      </BotonApp>
    </div>
  );
}
