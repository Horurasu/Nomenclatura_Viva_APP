import { useEffect, useRef, useState, type ReactNode } from "react";
import { saveAs } from "file-saver";
import { useAppStore } from "../../store/useAppStore";
import {
  ACCIONES_SUGERIDAS,
  CATEGORIA_ICONOS,
  COLORES_UI,
  EJEMPLOS_AREA,
  GENERADOR_CLAVE,
  LIMITE_CLAVE,
  UBICACION_AYUDA,
} from "../../domain/constants";
import { construirCodigoEsencial, escalarCodigo, excedeLimiteClave, sanearSegmento } from "../../domain/codigo";
import type { TipoUbicacion } from "../../domain/types";
import { Button, Card, Input, InfoBox, Label, SectionTitle, Select } from "../ui/Primitives";
import { UbicacionSelector } from "../ui/UbicacionSelector";

type NivelAlcance = "INTERNO" | "AREA" | "INSTITUCION" | "REGION";

const PASOS: { nombre: string; bg: string; borde: string }[] = [
  { nombre: "Área", bg: COLORES_UI.pasoArea, borde: "transparent" },
  { nombre: "Categoría", bg: COLORES_UI.pasoCategoria, borde: "transparent" },
  { nombre: "Clave", bg: COLORES_UI.pasoClave, borde: COLORES_UI.pasoClaveBorde },
  { nombre: "Trazabilidad", bg: COLORES_UI.pasoTrazabilidad, borde: "transparent" },
  { nombre: "Escalabilidad", bg: COLORES_UI.pasoEscalabilidad, borde: "transparent" },
  { nombre: "Resumen", bg: COLORES_UI.pasoResumen, borde: "transparent" },
];

export function WizardCrearTrabajo() {
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const crearArea = useAppStore((s) => s.crearArea);
  const crearCategoria = useAppStore((s) => s.crearCategoria);
  const crearTrabajo = useAppStore((s) => s.crearTrabajo);
  const irA = useAppStore((s) => s.irA);

  const [paso, setPaso] = useState(0);
  const [mostrandoCheck, setMostrandoCheck] = useState(false);
  const [mostrarListo, setMostrarListo] = useState(false);

  // Área
  const [areaCodigo, setAreaCodigo] = useState("");
  const [mostrarNuevaArea, setMostrarNuevaArea] = useState(false);
  const [nuevaAreaNombre, setNuevaAreaNombre] = useState("");
  const [nuevaAreaCodigo, setNuevaAreaCodigo] = useState("");
  const [nuevaAreaCorreo, setNuevaAreaCorreo] = useState("");

  // Categoría
  const [categoria, setCategoria] = useState("");
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [nuevaCatNombre, setNuevaCatNombre] = useState("");
  const [nuevaCatCodigo, setNuevaCatCodigo] = useState("");
  const [nuevaCatDeDonde, setNuevaCatDeDonde] = useState("");
  const [nuevaCatADonde, setNuevaCatADonde] = useState("");
  const [nuevaCatCorreo, setNuevaCatCorreo] = useState("");

  // Clave
  const [claveInput, setClaveInput] = useState("");
  const codigoEsencial = areaCodigo && categoria && claveInput ? construirCodigoEsencial(areaCodigo, categoria, sanearSegmento(claveInput)) : "";

  // Trazabilidad
  const [origen, setOrigen] = useState("");
  const [accion, setAccion] = useState("");
  const [destino, setDestino] = useState("");
  const [tipoUbicacion, setTipoUbicacion] = useState<TipoUbicacion>("DIGITAL_LOCAL");
  const [descripcionUbicacion, setDescripcionUbicacion] = useState("");
  const [estructuraCreada, setEstructuraCreada] = useState(false);
  const [modoUbicacion, setModoUbicacion] = useState<"YA_CREADA" | "POR_PLANEAR">("POR_PLANEAR");

  // Escalabilidad
  const [nivelAlcance, setNivelAlcance] = useState<NivelAlcance>("AREA");
  const [prefijoInstitucion, setPrefijoInstitucion] = useState("");
  const [prefijoRed, setPrefijoRed] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const areasActivas = areas.filter((a) => a.activa);
  const categoriasActivas = categorias.filter((c) => c.activa);
  const nombreArea = areasActivas.find((a) => a.codigo === areaCodigo)?.nombre ?? areaCodigo;
  const nombreCategoria = categoriasActivas.find((c) => c.codigo === categoria)?.nombre ?? categoria;

  const niveles = escalarCodigo({ areaCodigo, categoria, clave: claveInput, prefijoInstitucion, prefijoRed });
  const codigoSegunAlcance =
    nivelAlcance === "INTERNO" ? niveles.cosa : nivelAlcance === "AREA" ? niveles.area : nivelAlcance === "INSTITUCION" ? niveles.institucion : niveles.region;

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

  function descargarEstructuraSugerida() {
    const raiz = codigoEsencial || "TU-CODIGO";
    const contenido = `Estructura de carpetas sugerida para ${raiz}\n(generada por Nomenclatura Viva)\n\n${raiz}/\n├── 01_ORIGEN/        de dónde viene este trabajo: solicitudes, requerimientos, notas iniciales\n├── 02_DESARROLLO/    borradores y versiones de trabajo\n├── 03_PRODUCTO/       el resultado final\n└── 04_ENTREGA/        lo que se comparte o entrega\n\nCrea esta misma carpeta raíz "${raiz}" ya sea en tu computadora, en la nube o como carpeta física — así todo lo relacionado con este trabajo queda en un solo lugar, identificado por su código.\n`;
    saveAs(new Blob([contenido], { type: "text/plain" }), `estructura-sugerida_${raiz}.txt`);
  }

  async function confirmar() {
    if (!autorActivo.trim()) {
      setError('Escribe tu nombre arriba, junto al ícono de perfil — así quedas registrado como autor de este trabajo.');
      return;
    }
    if (!areaCodigo || !categoria || !claveInput.trim() || !origen || !accion || !destino) {
      setError("Completa todos los campos antes de guardar.");
      return;
    }
    if (excedeLimiteClave(claveInput)) {
      setError(`La clave no puede superar ${LIMITE_CLAVE} caracteres.`);
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

  const colorPaso = PASOS[paso];
  const puedeAvanzar =
    (paso === 0 && !!areaCodigo) ||
    (paso === 1 && !!categoria) ||
    (paso === 2 && !!claveInput.trim()) ||
    (paso === 3 && !!origen && !!accion && !!destino && estructuraCreada) ||
    (paso === 4 &&
      (nivelAlcance === "INTERNO" || nivelAlcance === "AREA" || (nivelAlcance === "INSTITUCION" && !!prefijoInstitucion.trim()) || (nivelAlcance === "REGION" && !!prefijoInstitucion.trim() && !!prefijoRed.trim())));

  const puedeAvanzarPrev = useRef(puedeAvanzar);
  useEffect(() => {
    if (!puedeAvanzarPrev.current && puedeAvanzar) {
      setMostrarListo(true);
      const t = setTimeout(() => setMostrarListo(false), 2200);
      return () => clearTimeout(t);
    }
    puedeAvanzarPrev.current = puedeAvanzar;
  }, [puedeAvanzar]);

  return (
    <Card className="relative">
      {mostrandoCheck && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg animate-bounce text-white" style={{ backgroundColor: COLORES_UI.exito }}>
            ✓
          </div>
        </div>
      )}

      <SectionTitle subtitle="Responde las preguntas del sistema y registra la trazabilidad de tu trabajo.">
        Nuevo trabajo — Paso {paso + 1} de {PASOS.length}: {colorPaso.nombre}
      </SectionTitle>

      {/* Indicador de pasos con círculos */}
      <div className="flex items-center mb-6">
        {PASOS.map((p, i) => (
          <div key={p.nombre} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                style={
                  i < paso
                    ? { backgroundColor: COLORES_UI.exito, color: "#fff" }
                    : i === paso
                      ? { backgroundColor: "#fff", color: COLORES_UI.advertencia, border: `2px solid ${COLORES_UI.advertencia}` }
                      : { backgroundColor: "#e2e8f0", color: "#64748b" }
                }
              >
                {i < paso ? "✓" : i + 1}
              </div>
              <span className="text-[9px] text-ink-faint whitespace-nowrap">{p.nombre}</span>
            </div>
            {i < PASOS.length - 1 && <div className="flex-1 h-0.5 mx-1" style={{ backgroundColor: i < paso ? COLORES_UI.exito : "#e2e8f0" }} />}
          </div>
        ))}
      </div>

      {paso === 0 && (
        <div className="space-y-4 rounded-lg p-5" style={{ backgroundColor: colorPaso.bg }}>
          <InfoBox>
            Un <strong>área</strong> es la unidad de tu institución dueña de este trabajo — de ahí "salen" las áreas:
            de cómo ya está organizada tu institución en departamentos o equipos. Si la tuya no aparece en la lista,
            créala abajo: solo necesitas un nombre, el código corto se genera solo.
          </InfoBox>

          <div>
            <p className="text-xs font-medium text-ink-soft mb-2">Ejemplos de áreas típicas</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EJEMPLOS_AREA.map((ej) => (
                <div key={ej.nombre} className="flex flex-col items-center text-center gap-1 bg-white border border-line rounded-md p-2">
                  <span className="text-xl">{ej.icono}</span>
                  <span className="text-[11px] text-ink-soft leading-tight">{ej.nombre}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/40 border border-dashed border-ink-faint/50 rounded-md p-3">
            <p className="text-xs font-semibold text-ink-soft mb-1">¿Cómo se genera el código del área?</p>
            <p className="text-xs text-ink-soft mb-2">
              Escribes el nombre completo y la app arma sola un código corto con eso — tú no tienes que inventarlo.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
              <span className="px-2 py-1 rounded bg-ai-100 text-ai-700">Biblioteca</span>
              <span className="text-ink-faint">→</span>
              <span className="px-2 py-1 rounded bg-ink text-paper">BIBLIOTECA</span>
            </div>
            <p className="text-xs text-moss-700 mt-2">✅ "Biblioteca" — claro, cualquiera lo reconoce.</p>
            <p className="text-xs text-terracotta-600">❌ "Depto 3" — no dice qué área es.</p>
          </div>

          {!mostrarNuevaArea ? (
            <>
              <Select value={areaCodigo} onChange={(e) => setAreaCodigo(e.target.value)}>
                <option value="">Selecciona un área...</option>
                {areasActivas.map((a) => (
                  <option key={a.id} value={a.codigo}>
                    {a.nombre} ({a.codigo})
                  </option>
                ))}
              </Select>
              <Button variant="ghost" onClick={() => setMostrarNuevaArea(true)}>
                + Crear área nueva
              </Button>
            </>
          ) : (
            <div className="space-y-3 border-2 border-ink-faint/60 shadow-sm rounded-md p-4 bg-white">
              <div>
                <Label>Nombre del área</Label>
                <Input value={nuevaAreaNombre} onChange={(e) => setNuevaAreaNombre(e.target.value)} placeholder="Ej. Biblioteca" />
              </div>
              <div>
                <Label>Código corto (se genera solo si lo dejas vacío)</Label>
                <Input value={nuevaAreaCodigo} onChange={(e) => setNuevaAreaCodigo(e.target.value)} placeholder="Ej. BIBLIO" />
              </div>
              <div>
                <Label>Correo de contacto del área (opcional)</Label>
                <Input
                  type="email"
                  value={nuevaAreaCorreo}
                  onChange={(e) => setNuevaAreaCorreo(e.target.value)}
                  placeholder="Ej. biblioteca@tuinstitucion.edu.mx"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={confirmarNuevaArea}>Guardar área</Button>
                <Button variant="ghost" onClick={() => setMostrarNuevaArea(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {paso === 1 && (
        <div className="space-y-3 rounded-lg p-5" style={{ backgroundColor: colorPaso.bg }}>
          <InfoBox>
            Una <strong>categoría</strong> describe qué tipo de acción es este trabajo (un proyecto, un convenio, una
            producción...). <strong>¿Para qué sirve?</strong> Es el vocabulario común entre áreas: te permite
            encontrar y comparar todos los trabajos del mismo tipo, aunque sean de departamentos distintos.
          </InfoBox>
          <InfoBox tono="warning">
            <strong>Mejora continua:</strong> no tienen que quedarse como están — puedes editar su nombre o crear
            categorías nuevas si tu institución las necesita, aquí mismo o desde Configuración. Cada cambio viaja en
            tu archivo exportado.
          </InfoBox>

          <div className="bg-white/40 border border-dashed border-ink-faint/50 rounded-md p-3">
            <p className="text-xs font-semibold text-ink-soft mb-1">✅ / ❌ al elegir categoría</p>
            <p className="text-xs text-moss-700">✅ Un video institucional → Divulgación (es para mostrarlo, no para gestionarlo)</p>
            <p className="text-xs text-terracotta-600">❌ Ese mismo video clasificado como "Administración" — no dice qué tipo de acción es</p>
          </div>

          {!mostrarNuevaCategoria ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoriasActivas.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoria(c.codigo)}
                    className={`text-left rounded-md border p-3 transition-colors bg-white ${
                      categoria === c.codigo ? "border-moss-500 bg-moss-50" : "border-line hover:border-moss-300"
                    }`}
                  >
                    <div className="font-medium text-ink flex items-center gap-1.5">
                      <span>{CATEGORIA_ICONOS[c.codigo] ?? "🏷️"}</span>
                      {c.nombre} <span className="text-ink-faint font-normal">({c.codigo})</span>
                    </div>
                    <div className="text-xs text-ink-soft mt-1">De: {c.deDondeViene}</div>
                    <div className="text-xs text-ink-soft">A: {c.aDondeVa}</div>
                  </button>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setMostrarNuevaCategoria(true)}>
                + Crear categoría nueva
              </Button>
            </>
          ) : (
            <div className="space-y-3 border-2 border-ink-faint/60 shadow-sm rounded-md p-4 bg-white">
              <div>
                <Label>Nombre de la categoría</Label>
                <Input value={nuevaCatNombre} onChange={(e) => setNuevaCatNombre(e.target.value)} placeholder="Ej. Vinculación" />
              </div>
              <div>
                <Label>Código corto (se genera solo si lo dejas vacío)</Label>
                <Input value={nuevaCatCodigo} onChange={(e) => setNuevaCatCodigo(e.target.value)} placeholder="Ej. VINC" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>¿De dónde viene? (ejemplo típico)</Label>
                  <Input value={nuevaCatDeDonde} onChange={(e) => setNuevaCatDeDonde(e.target.value)} placeholder="Ej. Solicitud externa" />
                </div>
                <div>
                  <Label>¿A dónde va? (ejemplo típico)</Label>
                  <Input value={nuevaCatADonde} onChange={(e) => setNuevaCatADonde(e.target.value)} placeholder="Ej. Convenio firmado" />
                </div>
              </div>
              <div>
                <Label>Correo de contacto para esta categoría (opcional)</Label>
                <Input
                  type="email"
                  value={nuevaCatCorreo}
                  onChange={(e) => setNuevaCatCorreo(e.target.value)}
                  placeholder="Ej. vinculacion@tuinstitucion.edu.mx"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={confirmarNuevaCategoria}>Guardar categoría</Button>
                <Button variant="ghost" onClick={() => setMostrarNuevaCategoria(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {paso === 2 && (
        <div className="space-y-5 rounded-lg p-5" style={{ backgroundColor: colorPaso.bg, border: `3px solid ${colorPaso.borde}` }}>
          <div className="flex items-center gap-2">
            <span className="text-xl" style={{ color: COLORES_UI.pasoClaveBorde }}>◆</span>
            <p className="text-sm font-medium" style={{ color: "#92400e" }}>
              La clave es el campo más importante: con ella se arma tu código y así vas a reconocer este trabajo.
            </p>
          </div>

          {/* Generador de ideas */}
          <div className="bg-white/70 rounded-lg p-4 border border-kaki-200">
            <p className="text-sm font-semibold text-ink mb-1">Generador de ideas para tu clave</p>
            <p className="text-xs text-ink-soft mb-3">
              Estos son <strong>ejemplos de partida, no reglas fijas</strong> — adáptalos a tu propio trabajo. Si no
              sabes cómo nombrar tu trabajo, elige una categoría aquí abajo y ajusta el resultado. Si ya tienes una
              idea, escríbela directamente en el campo manual más abajo — ambas formas funcionan.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GENERADOR_CLAVE.map((g) => (
                <div key={g.categoria} className="border border-kaki-200 rounded-md p-3 bg-white">
                  <p className="text-xs font-semibold text-ink mb-1">{g.categoria}</p>
                  <p className="text-[11px] text-ink-soft mb-1">{g.ejemplos.join(", ")}</p>
                  <p className="text-[11px] font-mono text-ink-faint mb-1">Formato: {g.formato}</p>
                  <p className="text-[11px] text-ink-faint mb-2 leading-snug">{g.comoSeConstruye}</p>
                  <button
                    type="button"
                    onClick={() => setClaveInput(g.ejemploCompleto)}
                    className="text-xs font-medium px-2 py-1 rounded-full border border-kaki-300 hover:bg-kaki-100 transition-colors"
                  >
                    {g.etiquetaBoton} → {g.ejemploCompleto}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-kaki-200">
              <p className="text-xs text-ink-soft">
                <strong>No estás obligado a usar estos formatos.</strong> Puedes escribir tu clave de otra forma que
                se adapte mejor a tu trabajo — solo recomendaciones: que no sea muy larga, que sea específica, y que
                incluya una fecha si aplica. Ejemplo generado de otra forma:{" "}
                <span className="font-mono">"Revisión trimestral biblioteca — marzo 2026"</span>.
              </p>
            </div>
          </div>

          <div>
            <Label>Clave (campo manual)</Label>
            <Input
              value={claveInput}
              onChange={(e) => setClaveInput(e.target.value)}
              maxLength={LIMITE_CLAVE}
              placeholder="Ej. Catálogo de libros 2026"
              className="border-kaki-300 focus:border-kaki-500 focus:ring-kaki-500"
            />
            <p className={`text-xs mt-1 ${claveInput.length > LIMITE_CLAVE - 5 ? "text-kaki-600 font-medium" : "text-ink-faint"}`}>
              {claveInput.length}/{LIMITE_CLAVE} caracteres
            </p>
          </div>

          {/* Infografía AREA + CATEGORIA + CLAVE = CODIGO */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2 py-1 rounded bg-ai-100 text-ai-700">{nombreArea || "ÁREA"}</span>
            <span className="text-ink-faint">+</span>
            <span className="px-2 py-1 rounded bg-moss-100 text-moss-700">{nombreCategoria || "CATEGORÍA"}</span>
            <span className="text-ink-faint">+</span>
            <span className="px-2 py-1 rounded bg-kaki-200 text-kaki-800">{claveInput || "CLAVE"}</span>
            <span className="text-ink-faint">=</span>
            <span className="px-2 py-1 rounded bg-ink text-paper">{codigoEsencial || "CÓDIGO COMPLETO"}</span>
          </div>

          <div className="bg-white/40 border border-dashed border-kaki-300 rounded-md p-3">
            <p className="text-xs font-semibold text-ink-soft mb-1">Paso a paso para escribir tu clave:</p>
            <ol className="text-xs text-ink-soft list-decimal ml-4 space-y-0.5">
              <li>Piensa en el nombre natural del trabajo (ej. "Catálogo de biblioteca").</li>
              <li>Redúcelo a algo corto y claro (ej. "Catálogo").</li>
              <li>Si tiene fecha o periodo, agrégalo (ej. "Catálogo 2026").</li>
              <li>Verifica que alguien de otra área podría entender de qué se trata.</li>
            </ol>
            <p className="text-xs text-moss-700 mt-2">✅ "Catálogo de libros 2026" — corto, específico, con fecha.</p>
            <p className="text-xs text-terracotta-600">❌ "Cosas de la biblioteca que hay que hacer este semestre y el próximo" — demasiado largo.</p>
            <p className="text-xs text-terracotta-600">❌ "Doc1" — no dice nada.</p>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="space-y-6 rounded-lg p-5" style={{ backgroundColor: colorPaso.bg }}>
          <div>
            <p className="text-sm font-medium text-ink mb-3">¿Cómo fluye este trabajo?</p>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className={`flex-1 rounded-md p-3 border-2 transition-colors ${origen ? "border-ai-400 bg-ai-50" : "border-ai-100 bg-white"}`}>
                <Label>📥 Origen — ¿quién lo pidió?</Label>
                <Input value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder="Ej. Coordinación Académica solicita" />
              </div>
              <span className="hidden sm:flex items-center text-xl text-ink-faint">→</span>
              <div className={`flex-1 rounded-md p-3 border-2 transition-colors ${accion ? "border-moss-400 bg-moss-50" : "border-moss-100 bg-white"}`}>
                <Label>⚙️ Acción — ¿qué se hace?</Label>
                <Input list="acciones-sugeridas" value={accion} onChange={(e) => setAccion(e.target.value)} placeholder="Ej. Se construye" />
                <datalist id="acciones-sugeridas">
                  {ACCIONES_SUGERIDAS.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
                <p className="text-[11px] text-ink-faint mt-1">Elige una de la lista o escribe la tuya, como prefieras.</p>
              </div>
              <span className="hidden sm:flex items-center text-xl text-ink-faint">→</span>
              <div className={`flex-1 rounded-md p-3 border-2 transition-colors ${destino ? "border-ai-500 bg-ai-100" : "border-ai-100 bg-white"}`}>
                <Label>📤 Destino — ¿qué se entrega?</Label>
                <Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ej. Un catálogo consultable" />
              </div>
              <span className="hidden sm:flex items-center text-xl text-ink-faint">→</span>
              <div className="flex-1 rounded-md p-3 border-2 border-terracotta-100 bg-white flex flex-col items-center justify-center text-center">
                <Label>Estado — ¿en qué fase está?</Label>
                <span className="text-xl">🔴</span>
                <span className="text-[11px] text-ink-soft">Por iniciar (siempre así al crearlo)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-line pt-4">
            <p className="text-sm font-medium text-ink mb-1">Guía de organización de tu trabajo</p>
            <p className="text-xs text-ink-soft mb-3">Esto no lo guarda la app — te guía paso a paso para que organices tú mismo tu carpeta.</p>

            <div className="mb-4">
              <Label>¿Qué tipo de ubicación es principalmente?</Label>
              <UbicacionSelector value={tipoUbicacion} onChange={setTipoUbicacion} />
              {codigoEsencial && (
                <div className="mt-2">
                  <InfoBox tono="warning">{UBICACION_AYUDA[tipoUbicacion](codigoEsencial, areaCodigo, categoria)}</InfoBox>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <PasoGuia letra="A" titulo="Crea tu carpeta raíz">
                <p className="text-xs text-ink-soft">Crea una carpeta principal con el código de tu trabajo. Contendrá TODO lo relacionado con él.</p>
                <p className="text-xs font-mono bg-white border border-line rounded px-2 py-1 mt-1 inline-block">📁 {codigoEsencial || "TU-CODIGO"}/</p>
              </PasoGuia>

              <PasoGuia letra="B" titulo="Crea las subcarpetas sugeridas">
                <p className="text-xs text-ink-soft mb-1">Dentro de tu carpeta principal, crea estas cuatro subcarpetas:</p>
                <div className="bg-ink text-paper/90 rounded-md p-3 font-mono text-xs overflow-x-auto whitespace-pre">
{`📁 ${codigoEsencial || "TU-CODIGO"}/
├── 📁 01_ORIGEN/       ← lo que justifica el trabajo
├── 📁 02_DESARROLLO/   ← borradores y avances
├── 📁 03_PRODUCTO/     ← el resultado final
└── 📁 04_ENTREGA/      ← lo que entregaste y comprobantes`}
                </div>
              </PasoGuia>

              <PasoGuia letra="C" titulo="Si varias áreas participan, sepáralas dentro de 02_DESARROLLO">
                <div className="bg-ink text-paper/90 rounded-md p-3 font-mono text-xs overflow-x-auto whitespace-pre mb-1">
{`📁 02_DESARROLLO/
├── 📁 Area-Biblioteca/
├── 📁 Area-Diseño/
└── 📁 Area-TI/`}
                </div>
                <p className="text-xs text-ink-soft">Así cada área sabe dónde poner sus aportes, sin mezclar archivos.</p>
              </PasoGuia>

              <PasoGuia letra="D" titulo="Nombra los archivos con claridad">
                <p className="text-xs text-moss-700">✅ {codigoEsencial || "TU-CODIGO"}_borrador-v1.docx</p>
                <p className="text-xs text-moss-700">✅ {codigoEsencial || "TU-CODIGO"}_reunion-inicial.pdf</p>
                <p className="text-xs text-moss-700">✅ {codigoEsencial || "TU-CODIGO"}_producto-final.pdf</p>
                <p className="text-xs text-terracotta-600 mt-1">❌ documento1.docx — no dice qué es</p>
                <p className="text-xs text-terracotta-600">❌ nuevo.pdf — muy genérico</p>
              </PasoGuia>

              <PasoGuia letra="E" titulo="Ubicación física vs. digital">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white border border-line rounded p-2">
                    <p className="text-xs font-semibold text-ink">💻 En mi computadora</p>
                    <p className="text-[11px] text-ink-soft">La misma carpeta raíz, digital, con sus 4 subcarpetas.</p>
                  </div>
                  <div className="bg-white border border-line rounded p-2">
                    <p className="text-xs font-semibold text-ink">🗄️ En mi escritorio físico</p>
                    <p className="text-[11px] text-ink-soft">
                      Si tienes hojas firmadas o contratos, crea una carpeta física con el MISMO nombre y guárdalos en el
                      mismo orden.
                    </p>
                  </div>
                </div>
              </PasoGuia>
            </div>

            <Button variant="secondary" className="mt-3" onClick={descargarEstructuraSugerida}>
              ↓ Descargar estructura sugerida (.txt)
            </Button>

            <div className="mt-5 pb-4" style={{ borderBottom: `4px solid ${COLORES_UI.pasoClaveBorde}` }}>
              <p className="text-sm font-medium text-ink mb-2">🏁 ¿En qué momento estás?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setModoUbicacion("YA_CREADA")}
                  className={`text-left rounded-md border p-3 transition-colors ${
                    modoUbicacion === "YA_CREADA" ? "border-moss-500 bg-moss-50" : "border-line bg-white hover:border-moss-300"
                  }`}
                >
                  <p className="text-sm font-medium text-ink">✅ Ya la creé</p>
                  <p className="text-xs text-ink-soft mt-0.5">Ya tengo mi carpeta lista — solo quiero anotar dónde quedó.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setModoUbicacion("POR_PLANEAR")}
                  className={`text-left rounded-md border p-3 transition-colors ${
                    modoUbicacion === "POR_PLANEAR" ? "border-kaki-400 bg-kaki-50" : "border-line bg-white hover:border-kaki-300"
                  }`}
                >
                  <p className="text-sm font-medium text-ink">🗒️ Todavía no — hay que planearla</p>
                  <p className="text-xs text-ink-soft mt-0.5">Aún no la he creado; necesito decidir dónde va a vivir.</p>
                </button>
              </div>

              {modoUbicacion === "YA_CREADA" ? (
                <div className="bg-white border-2 border-moss-400 shadow-sm rounded-md p-3 mb-3">
                  <Label>¿Dónde quedó guardada tu carpeta principal?</Label>
                  <Input
                    value={descripcionUbicacion}
                    onChange={(e) => setDescripcionUbicacion(e.target.value)}
                    placeholder="Ej. Documentos/Trabajos-2025/BIBLIO-PROY-CATALOGO/"
                  />
                </div>
              ) : (
                <div className="bg-white border-2 border-kaki-400 shadow-sm rounded-md p-3 mb-3 space-y-2">
                  <Label>Elige dónde planeas guardarla y anótalo aquí</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setDescripcionUbicacion(`Documentos/Trabajos-2026/${codigoEsencial || "CODIGO"}/`)}
                      className="text-left border border-line rounded p-2 hover:border-kaki-300"
                    >
                      <p className="font-semibold text-ink">💻 En mi computadora</p>
                      <p className="font-mono text-ink-faint mt-0.5">Documentos/Trabajos-2026/{codigoEsencial || "CODIGO"}/</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescripcionUbicacion(`Mi unidad/Trabajos 2026/${codigoEsencial || "CODIGO"}`)}
                      className="text-left border border-line rounded p-2 hover:border-kaki-300"
                    >
                      <p className="font-semibold text-ink">☁️ En la nube</p>
                      <p className="font-mono text-ink-faint mt-0.5">Mi unidad/Trabajos 2026/{codigoEsencial || "CODIGO"}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescripcionUbicacion(`Archivero 3, cajón 2, carpeta ${codigoEsencial || "CODIGO"}`)}
                      className="text-left border border-line rounded p-2 hover:border-kaki-300"
                    >
                      <p className="font-semibold text-ink">🗄️ Físico</p>
                      <p className="font-mono text-ink-faint mt-0.5">Archivero 3, cajón 2, carpeta {codigoEsencial || "CODIGO"}</p>
                    </button>
                  </div>
                  <Input
                    value={descripcionUbicacion}
                    onChange={(e) => setDescripcionUbicacion(e.target.value)}
                    placeholder="O escribe tu propio plan aquí..."
                  />
                </div>
              )}

              <div className="bg-white border-2 border-ink-faint/60 shadow-sm rounded-md p-3">
                <label className="flex items-start gap-2 text-sm text-ink font-medium cursor-pointer">
                  <input type="checkbox" className="mt-0.5" checked={estructuraCreada} onChange={(e) => setEstructuraCreada(e.target.checked)} />
                  Ya creé mi carpeta y organización.
                </label>
                {!estructuraCreada && (
                  <p className="text-xs mt-1" style={{ color: COLORES_UI.pasoClaveBorde }}>
                    Marca la casilla cuando hayas creado tu estructura de carpetas. Este paso es importante para que
                    tu trabajo quede bien documentado.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {paso === 4 && (
        <div className="space-y-4 rounded-lg p-5" style={{ backgroundColor: colorPaso.bg }}>
          <InfoBox>
            La escalabilidad permite que tu trabajo sea reconocido cuando cruza fronteras entre áreas o
            instituciones. Elige el alcance que corresponde hoy — puedes ajustarlo después desde el detalle del
            trabajo.
          </InfoBox>

          <div className="bg-white/40 rounded-md border border-dashed border-ink-faint/50 p-3">
            <p className="text-xs text-ink-faint uppercase tracking-wide mb-1">Tu código actual</p>
            <p className="text-lg font-mono font-semibold text-ink">{codigoEsencial || "—"}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-ink">Selecciona el nivel de alcance de este trabajo:</p>
            {(
              [
                ["INTERNO", "Uso interno del área (sin prefijo adicional)"],
                ["AREA", "Entre áreas de la institución (prefijo de área)"],
                ["INSTITUCION", "Entre instituciones (prefijo de institución)"],
                ["REGION", "Red regional / consorcio (prefijo de región)"],
              ] as [NivelAlcance, string][]
            ).map(([valor, etiqueta]) => (
              <label
                key={valor}
                className={`flex items-center gap-2 text-sm bg-white border-2 shadow-sm rounded-md p-2.5 cursor-pointer transition-colors ${
                  nivelAlcance === valor ? "border-moss-500 text-ink" : "border-ink-faint/40 text-ink-soft"
                }`}
              >
                <input type="radio" name="nivelAlcance" checked={nivelAlcance === valor} onChange={() => setNivelAlcance(valor)} />
                {etiqueta}
              </label>
            ))}
          </div>

          {(nivelAlcance === "INSTITUCION" || nivelAlcance === "REGION") && (
            <div>
              <Label>Prefijo de institución (ej. INST, o el código de tu institución)</Label>
              <Input value={prefijoInstitucion} onChange={(e) => setPrefijoInstitucion(e.target.value.toUpperCase())} />
            </div>
          )}
          {nivelAlcance === "REGION" && (
            <div>
              <Label>Prefijo de región (ej. RED)</Label>
              <Input value={prefijoRed} onChange={(e) => setPrefijoRed(e.target.value.toUpperCase())} />
            </div>
          )}

          <div className="bg-white/40 rounded-md border border-dashed border-ink-faint/50 p-3">
            <p className="text-xs text-ink-faint uppercase tracking-wide mb-1">Código según el alcance elegido</p>
            <p className="text-lg font-mono font-semibold text-ink">{codigoSegunAlcance || "— completa los prefijos arriba"}</p>
          </div>
        </div>
      )}

      {paso === 5 && (
        <div className="space-y-4 rounded-lg p-5" style={{ backgroundColor: colorPaso.bg }}>
          <InfoBox>Revisa que todo esté correcto antes de guardar. Puedes regresar a cualquier paso sin perder lo que ya escribiste.</InfoBox>

          <div className="bg-ink text-paper rounded-lg p-4 text-center">
            <p className="text-xs text-paper/60 uppercase tracking-wide mb-1">Tu código</p>
            <p className="text-2xl font-mono font-semibold">{codigoSegunAlcance || codigoEsencial}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResumenCampo etiqueta="Área" valor={nombreArea} onEditar={() => setPaso(0)} />
            <ResumenCampo etiqueta="Categoría" valor={nombreCategoria} onEditar={() => setPaso(1)} />
            <ResumenCampo etiqueta="Clave" valor={claveInput} onEditar={() => setPaso(2)} />
          </div>

          <div className="border border-dashed border-ink-faint/50 rounded-md p-3 bg-white/40">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-ink-soft">Trazabilidad y ubicación</p>
              <button className="text-xs text-moss-600 hover:underline" onClick={() => setPaso(3)}>
                Editar
              </button>
            </div>
            <p className="text-sm text-ink">
              📥 {origen || "—"} → ⚙️ {accion || "—"} → 📤 {destino || "—"} → 🔴 Por iniciar
            </p>
            <p className="text-xs text-ink-soft mt-1">{descripcionUbicacion || "sin descripción de ubicación"}</p>
          </div>

          <div className="border border-dashed border-ink-faint/50 rounded-md p-3 bg-white/40">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-ink-soft">Escalabilidad</p>
              <button className="text-xs text-moss-600 hover:underline" onClick={() => setPaso(4)}>
                Editar
              </button>
            </div>
            <p className="text-sm text-ink">{nivelAlcance}</p>
          </div>
        </div>
      )}

      {mostrarListo && (
        <p className="text-sm font-medium mt-3" style={{ color: COLORES_UI.exito }}>
          ¡Listo! Puedes continuar al siguiente paso →
        </p>
      )}

      {error && <p className="text-sm text-terracotta-600 mt-4">{error}</p>}

      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={() => setPaso((p) => Math.max(0, p - 1))} disabled={paso === 0}>
          Atrás
        </Button>
        {paso < PASOS.length - 1 ? (
          <Button onClick={avanzar} disabled={!puedeAvanzar} className={puedeAvanzar ? "animate-pulse" : ""}>
            Siguiente
          </Button>
        ) : (
          <Button onClick={confirmar} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar trabajo"}
          </Button>
        )}
      </div>
    </Card>
  );
}

function PasoGuia({ letra, titulo, children }: { letra: string; titulo: string; children: ReactNode }) {
  return (
    <div className="bg-white/40 border border-dashed border-ink-faint/50 rounded-md p-3">
      <p className="text-xs font-semibold text-ink mb-1.5">
        Paso {letra} — {titulo}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ResumenCampo({ etiqueta, valor, onEditar }: { etiqueta: string; valor: string; onEditar: () => void }) {
  return (
    <div className="border border-dashed border-ink-faint/50 rounded-md p-3 bg-white/40">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs font-semibold text-ink-faint">{etiqueta}</p>
        <button className="text-xs text-moss-600 hover:underline" onClick={onEditar}>
          Editar
        </button>
      </div>
      <p className="text-sm text-ink">{valor || "—"}</p>
    </div>
  );
}
