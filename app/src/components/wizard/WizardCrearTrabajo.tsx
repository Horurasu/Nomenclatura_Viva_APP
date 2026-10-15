import { useEffect, useState, type ReactNode } from "react";
import { saveAs } from "file-saver";
import { useAppStore } from "../../store/useAppStore";
import {
  ACCIONES_SUGERIDAS,
  CATEGORIA_ICONOS,
  EJEMPLOS_AREA,
  GENERADOR_CLAVE,
  LIMITE_CLAVE,
  UBICACION_AYUDA,
  UBICACION_INFO,
} from "../../domain/constants";
import { construirCodigoEsencial, escalarCodigo, excedeLimiteClave, sanearSegmento } from "../../domain/codigo";
import type { TipoUbicacion } from "../../domain/types";
import { Ayuda, BotonApp, Campo, Ejemplo, Opcion, Panel, Pastilla } from "../ui/Estilo";
import { UbicacionSelector } from "../ui/UbicacionSelector";

type NivelAlcance = "INTERNO" | "AREA" | "INSTITUCION" | "REGION";

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
    pregunta: "¿Cómo se llama, en corto?",
    subtitulo: "Un nombre breve y claro para reconocerlo después.",
    pista: "Escribe un nombre corto para continuar.",
  },
  {
    nombre: "Recorrido",
    icono: "🧭",
    pregunta: "¿De dónde viene y a dónde va?",
    subtitulo: "Tres respuestas cortas para darle seguimiento.",
    pista: "Responde las tres preguntas para continuar.",
  },
  {
    nombre: "Carpeta",
    icono: "📁",
    pregunta: "¿Dónde vas a guardar los archivos?",
    subtitulo: "La app no guarda tus archivos: solo anota dónde están.",
    pista: "Marca “Listo, ya organicé mi carpeta” para continuar.",
  },
  {
    nombre: "Alcance",
    icono: "🌎",
    pregunta: "¿Quién más va a usar este trabajo?",
    subtitulo: "Si sale de tu área, el código se ajusta solo.",
    pista: "Escribe el prefijo que falta para continuar.",
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
  { valor: "INTERNO", icono: "👤", titulo: "Solo mi área", texto: "Uso interno, sin prefijo adicional" },
  { valor: "AREA", icono: "🏢", titulo: "Varias áreas de mi institución", texto: "Se agrega el código del área" },
  { valor: "INSTITUCION", icono: "🏛️", titulo: "Otras instituciones", texto: "Se agrega un prefijo de institución" },
  { valor: "REGION", icono: "🌎", titulo: "Una red regional o consorcio", texto: "Se agrega un prefijo de región" },
];

// Primera instrucción del paso "Carpeta", según dónde van a estar los archivos.
const INSTRUCCION_CREAR: Record<TipoUbicacion, string> = {
  DIGITAL_LOCAL: "En tu computadora, crea una carpeta con este nombre",
  NUBE: "En tu Drive u OneDrive, crea una carpeta con este nombre",
  FISICO: "Consigue un folder o carpeta y rotúlalo con este nombre",
  CORREO: "Pon este código al inicio del asunto de tus correos",
  OTRO: "Usa este nombre para identificarlo",
};

const SUGERENCIA_UBICACION: Record<TipoUbicacion, (codigo: string) => string> = {
  DIGITAL_LOCAL: (c) => `Documentos/Trabajos-2026/${c}/`,
  NUBE: (c) => `Mi unidad/Trabajos 2026/${c}`,
  FISICO: (c) => `Archivero 3, cajón 2, carpeta ${c}`,
  CORREO: (c) => `Correo institucional, asunto: ${c}`,
  OTRO: (c) => c,
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

  // Área — si todavía no hay ninguna, el formulario para crear una ya aparece abierto.
  const [areaCodigo, setAreaCodigo] = useState("");
  const [mostrarNuevaArea, setMostrarNuevaArea] = useState(() => areasActivas.length === 0);
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
  const [modoUbicacion, setModoUbicacion] = useState<"YA_CREADA" | "POR_PLANEAR">("POR_PLANEAR");
  const esCorreo = tipoUbicacion === "CORREO";

  // Alcance
  const [nivelAlcance, setNivelAlcance] = useState<NivelAlcance>("AREA");
  const [prefijoInstitucion, setPrefijoInstitucion] = useState("");
  const [prefijoRed, setPrefijoRed] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const nombreArea = areasActivas.find((a) => a.codigo === areaCodigo)?.nombre ?? areaCodigo;
  const nombreCategoria = categoriasActivas.find((c) => c.codigo === categoria)?.nombre ?? categoria;

  const niveles = escalarCodigo({ areaCodigo, categoria, clave: claveInput, prefijoInstitucion, prefijoRed });
  const codigoSegunAlcance =
    nivelAlcance === "INTERNO" ? niveles.cosa : nivelAlcance === "AREA" ? niveles.area : nivelAlcance === "INSTITUCION" ? niveles.institucion : niveles.region;

  // Cada paso empieza arriba, como una pantalla nueva.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [paso]);

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
    const raiz = codigoEsencial || "TU-CODIGO";
    const contenido = `Estructura de carpetas sugerida para ${raiz}\n(generada por Nomenclatura Viva)\n\n${raiz}/\n├── 01_ORIGEN/        de dónde viene este trabajo: solicitudes, requerimientos, notas iniciales\n├── 02_DESARROLLO/    borradores y versiones de trabajo\n├── 03_PRODUCTO/       el resultado final\n└── 04_ENTREGA/        lo que se comparte o entrega\n\nCrea esta misma carpeta raíz "${raiz}" ya sea en tu computadora, en la nube o como carpeta física — así todo lo relacionado con este trabajo queda en un solo lugar, identificado por su código.\n`;
    saveAs(new Blob([contenido], { type: "text/plain" }), `estructura-sugerida_${raiz}.txt`);
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
    (paso === 4 && estructuraCreada) ||
    (paso === 5 &&
      (nivelAlcance === "INTERNO" ||
        nivelAlcance === "AREA" ||
        (nivelAlcance === "INSTITUCION" && !!prefijoInstitucion.trim()) ||
        (nivelAlcance === "REGION" && !!prefijoInstitucion.trim() && !!prefijoRed.trim())));

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

          {!mostrarNuevaArea ? (
            <Opcion punteada icono="➕" titulo="Crear un área nueva" texto="Si la tuya no está en la lista" onClick={() => setMostrarNuevaArea(true)} />
          ) : (
            <Panel className="space-y-4 bg-white">
              <p className="font-semibold text-ink">Nueva área</p>
              <Campo
                etiqueta="¿Cómo se llama el área?"
                value={nuevaAreaNombre}
                onChange={(e) => setNuevaAreaNombre(e.target.value)}
                placeholder="Ej. Biblioteca"
                autoFocus
                pista={
                  nuevaAreaNombre.trim() ? (
                    <>
                      Su código será: <strong className="font-mono text-ink">{sanearSegmento(nuevaAreaCodigo || nuevaAreaNombre)}</strong>
                    </>
                  ) : (
                    "El código corto se arma solo con el nombre."
                  )
                }
              />
              <div>
                <p className="text-xs font-medium text-ink-soft mb-2">O toca un ejemplo:</p>
                <div className="flex flex-wrap gap-2">
                  {EJEMPLOS_AREA.map((ej) => (
                    <Pastilla key={ej.nombre} activa={nuevaAreaNombre === ej.nombre} onClick={() => setNuevaAreaNombre(ej.nombre)}>
                      {ej.icono} {ej.nombre}
                    </Pastilla>
                  ))}
                </div>
              </div>
              <Ayuda titulo="Más opciones (no es obligatorio)" icono="⚙️">
                <Campo etiqueta="Código corto" value={nuevaAreaCodigo} onChange={(e) => setNuevaAreaCodigo(e.target.value)} placeholder="Ej. BIBLIO" />
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
                {areasActivas.length > 0 && (
                  <BotonApp color="blanco" onClick={() => setMostrarNuevaArea(false)}>
                    Cancelar
                  </BotonApp>
                )}
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
          <Campo
            value={claveInput}
            onChange={(e) => setClaveInput(e.target.value)}
            maxLength={LIMITE_CLAVE}
            placeholder="Ej. Catálogo de libros 2026"
            autoFocus
            className="text-lg"
            pista={
              <span className={claveInput.length > LIMITE_CLAVE - 5 ? "text-amber-700 font-semibold" : ""}>
                {claveInput.length} de {LIMITE_CLAVE} letras
              </span>
            }
          />

          <VistaCodigo
            partes={[
              { texto: nombreArea || "Área", clase: "bg-sky-100 text-sky-800" },
              { texto: nombreCategoria || "Tipo", clase: "bg-emerald-100 text-emerald-800" },
              { texto: claveInput || "Nombre", clase: "bg-amber-100 text-amber-800" },
            ]}
            codigo={codigoEsencial}
          />

          <div className="flex flex-wrap gap-2">
            <Ayuda titulo="¿No se te ocurre? Ver ideas">
              <p>Toca una idea para usarla y luego ajústala a tu trabajo.</p>
              <div className="space-y-2.5">
                {GENERADOR_CLAVE.map((g) => (
                  <div key={g.categoria} className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2.5 first:border-0 first:pt-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{g.categoria}</p>
                      <p className="text-xs text-ink-faint">{g.ejemplos.slice(0, 4).join(", ")}…</p>
                    </div>
                    <Pastilla activa={claveInput === g.ejemploCompleto} onClick={() => setClaveInput(g.ejemploCompleto)}>
                      Usar {g.ejemploCompleto}
                    </Pastilla>
                  </div>
                ))}
              </div>
            </Ayuda>
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

      {/* ---------- Paso 5: Carpeta ---------- */}
      {paso === 4 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">1. ¿Dónde van a estar los archivos?</p>
            <UbicacionSelector value={tipoUbicacion} onChange={setTipoUbicacion} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">2. {esCorreo ? "¿Ya usas el código en tus correos?" : "¿Ya tienes la carpeta creada?"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink">3. {modoUbicacion === "POR_PLANEAR" ? "Haz esto ahora" : "Revisa y anota"}</p>
            <div className="rounded-2xl bg-white border border-line p-4 space-y-5">
              {modoUbicacion === "POR_PLANEAR" ? (
                <>
                  <Instruccion numero={1} titulo={INSTRUCCION_CREAR[tipoUbicacion]}>
                    <CodigoCopiable codigo={codigoEsencial} />
                  </Instruccion>
                  {!esCorreo && (
                    <Instruccion numero={2} titulo="Dentro, crea estas 4 subcarpetas">
                      <pre className="bg-ink text-paper/90 rounded-xl p-3 font-mono text-xs overflow-x-auto">
{`📁 ${codigoEsencial || "TU-CODIGO"}/
├── 📁 01_ORIGEN/       ← lo que lo pidió o justifica
├── 📁 02_DESARROLLO/   ← borradores y avances
├── 📁 03_PRODUCTO/     ← el resultado final
└── 📁 04_ENTREGA/      ← lo que entregaste`}
                      </pre>
                    </Instruccion>
                  )}
                  <Instruccion numero={esCorreo ? 2 : 3} titulo={esCorreo ? "Anota en qué cuenta o bandeja" : "Anota dónde la creaste"}>
                    <Campo
                      value={descripcionUbicacion}
                      onChange={(e) => setDescripcionUbicacion(e.target.value)}
                      placeholder={`Ej. ${SUGERENCIA_UBICACION[tipoUbicacion](codigoEsencial || "CODIGO")}`}
                    />
                    <div className="mt-2">
                      <Pastilla onClick={() => setDescripcionUbicacion(SUGERENCIA_UBICACION[tipoUbicacion](codigoEsencial || "CODIGO"))}>
                        Usar el ejemplo
                      </Pastilla>
                    </div>
                  </Instruccion>
                </>
              ) : (
                <>
                  <Instruccion numero={1} titulo={esCorreo ? "Revisa que el asunto empiece con tu código" : "Revisa que tu carpeta se llame igual que el código"}>
                    <CodigoCopiable codigo={codigoEsencial} />
                  </Instruccion>
                  <Instruccion numero={2} titulo={esCorreo ? "Anota en qué cuenta o bandeja" : "Anota dónde quedó guardada"}>
                    <Campo
                      value={descripcionUbicacion}
                      onChange={(e) => setDescripcionUbicacion(e.target.value)}
                      placeholder={`Ej. ${SUGERENCIA_UBICACION[tipoUbicacion](codigoEsencial || "CODIGO")}`}
                    />
                  </Instruccion>
                </>
              )}

              <div className="flex flex-wrap gap-2">
                <Ayuda titulo="Más consejos para organizar" icono="📖">
                  <PasoGuia letra="•" titulo="Si participan varias áreas">
                    <p>Dentro de 02_DESARROLLO, crea una subcarpeta por área (ej. Area-Biblioteca, Area-TI).</p>
                  </PasoGuia>
                  <PasoGuia letra="•" titulo="Nombra los archivos con el código">
                    <Ejemplo bien>{codigoEsencial || "TU-CODIGO"}_borrador-v1.docx</Ejemplo>
                    <Ejemplo bien={false}>documento1.docx — no dice qué es</Ejemplo>
                  </PasoGuia>
                  <PasoGuia letra="•" titulo="¿Tienes papeles?">
                    <p>Usa una carpeta física con el MISMO nombre y guárdalos en el mismo orden.</p>
                  </PasoGuia>
                  {codigoEsencial && (
                    <PasoGuia letra="•" titulo={`En “${UBICACION_INFO[tipoUbicacion].etiqueta}”`}>
                      <p>{UBICACION_AYUDA[tipoUbicacion](codigoEsencial, areaCodigo, categoria)}</p>
                    </PasoGuia>
                  )}
                </Ayuda>
                <BotonApp color="blanco" tamano="sm" onClick={descargarEstructuraSugerida}>
                  ⬇️ Descargar la guía
                </BotonApp>
              </div>
            </div>
          </div>

          <Opcion
            icono="🏁"
            titulo={esCorreo ? "Listo, ya sé cómo nombrar mis correos" : "Listo, ya organicé mi carpeta"}
            texto="Márcalo cuando termines los pasos de arriba"
            seleccionada={estructuraCreada}
            onClick={() => setEstructuraCreada((v) => !v)}
          />
        </div>
      )}

      {/* ---------- Paso 6: Alcance ---------- */}
      {paso === 5 && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              etiqueta="Prefijo de tu institución"
              value={prefijoInstitucion}
              onChange={(e) => setPrefijoInstitucion(e.target.value.toUpperCase())}
              placeholder="Ej. INST"
            />
          )}
          {nivelAlcance === "REGION" && (
            <Campo etiqueta="Prefijo de la red o región" value={prefijoRed} onChange={(e) => setPrefijoRed(e.target.value.toUpperCase())} placeholder="Ej. RED" />
          )}

          <VistaCodigo codigo={codigoSegunAlcance ?? ""} vacio="Completa el prefijo para ver tu código" />

          <Ayuda titulo="¿Qué es el alcance?">
            <p>
              Si tu trabajo sale de tu área o de tu institución, el código crece con un prefijo para que se siga
              reconociendo. Elige el que corresponde hoy; puedes cambiarlo después.
            </p>
          </Ayuda>
        </div>
      )}

      {/* ---------- Paso 7: Revisar ---------- */}
      {paso === 6 && (
        <div className="space-y-3">
          <VistaCodigo codigo={codigoSegunAlcance || codigoEsencial} grande />
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
              icono="📁"
              etiqueta="Carpeta"
              valor={`${UBICACION_INFO[tipoUbicacion].etiqueta}${descripcionUbicacion ? ` · ${descripcionUbicacion}` : ""}`}
              onCambiar={() => setPaso(4)}
            />
            <FilaResumen
              icono="🌎"
              etiqueta="Alcance"
              valor={ALCANCES.find((a) => a.valor === nivelAlcance)?.titulo ?? ""}
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

// El código en grande con un botón para copiarlo y pegarlo como nombre de carpeta.
function CodigoCopiable({ codigo }: { codigo: string }) {
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

function PasoGuia({ letra, titulo, children }: { letra: string; titulo: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-ink">
        {letra}. {titulo}
      </p>
      <div className="space-y-1 text-xs">{children}</div>
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
