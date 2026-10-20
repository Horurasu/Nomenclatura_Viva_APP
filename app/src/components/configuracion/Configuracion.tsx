import { useState, type ChangeEvent, type ReactNode } from "react";
import { useAppStore } from "../../store/useAppStore";
import { sanearSegmento } from "../../domain/codigo";
import { CATEGORIA_ICONOS, EJEMPLOS_AREA } from "../../domain/constants";
import { esArchivoDeConfiguracion, exportarJSON, generarArchivoTrabajo, leerArchivoJSON, nombreArchivo } from "../../storage/exportImport";
import type { ArchivoTrabajo } from "../../domain/types";
import { Aviso, Ayuda, BotonApp, Campo, EncabezadoPantalla, Opcion, Panel, Pastilla, Pestanas, Seccion, clasesBoton } from "../ui/Estilo";
import { ComoPasarArchivo } from "../ui/ComoPasarArchivo";
import { PasoNumerado } from "../exportImport/ExportarImportar";

type Pestana = "AREAS" | "TIPOS" | "COMPARTIR";

function iconoArea(nombre: string): string {
  return EJEMPLOS_AREA.find((e) => e.nombre.toLowerCase() === nombre.toLowerCase())?.icono ?? "🏢";
}

export function Configuracion() {
  const autorActivo = useAppStore((s) => s.autorActivo);
  const [pestana, setPestana] = useState<Pestana>("AREAS");

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      <EncabezadoPantalla icono="⚙️" color="morado" titulo="Configuración" subtitulo="Las listas que usas al crear un trabajo, y cómo compartirlas con tu equipo." />

      {/* Qué hay en cada pestaña, con el mismo color que su botón. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-ink-soft leading-snug">
        <p className="rounded-xl bg-sky-50 border border-sky-100 px-3 py-2">
          <strong className="text-sky-800">🏢 Áreas:</strong> los departamentos de tu institución (Biblioteca, Escolares…).
        </p>
        <p className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
          <strong className="text-emerald-800">🏷️ Tipos:</strong> qué clase de trabajo es (proyecto, trámite, convenio…).
        </p>
        <p className="rounded-xl bg-violet-50 border border-violet-100 px-3 py-2">
          <strong className="text-violet-800">👥 Compartir:</strong> pásale tus listas a un compañero o llévalas a otra compu.
        </p>
      </div>

      <Pestanas<Pestana>
        opciones={[
          { valor: "AREAS", etiqueta: "🏢 Áreas", color: "azul" },
          { valor: "TIPOS", etiqueta: "🏷️ Tipos", color: "verde" },
          { valor: "COMPARTIR", etiqueta: "👥 Compartir", color: "morado" },
        ]}
        valor={pestana}
        onCambiar={setPestana}
      />

      {pestana === "AREAS" ? <ListaAreas /> : pestana === "TIPOS" ? <ListaTipos /> : <CompartirConfiguracion />}

      <p className="text-xs text-ink-soft text-center px-4">
        Tu nombre{autorActivo ? ` (${autorActivo})` : ""} aparece como autor en cada trabajo. Para cambiarlo, tócalo
        arriba a la derecha.
      </p>
    </div>
  );
}

/* ---------------------------------- Áreas ---------------------------------- */

function ListaAreas() {
  const areas = useAppStore((s) => s.areas);
  const crearArea = useAppStore((s) => s.crearArea);
  const actualizarArea = useAppStore((s) => s.actualizarArea);
  const desactivarArea = useAppStore((s) => s.desactivarArea);

  const [editando, setEditando] = useState<string | null>(null);
  const [agregando, setAgregando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [correo, setCorreo] = useState("");

  async function agregar() {
    const cod = sanearSegmento(codigo || nombre);
    if (!cod || !nombre.trim()) return;
    await crearArea(nombre.trim(), cod, correo.trim() || undefined);
    setNombre("");
    setCodigo("");
    setCorreo("");
    setAgregando(false);
  }

  return (
    <div className="space-y-3">
      {areas.length === 0 && <p className="text-sm text-ink-soft text-center py-4">Todavía no hay áreas. Agrega la primera.</p>}

      {areas.map((a) =>
        editando === a.id ? (
          <Panel key={a.id} className="bg-white space-y-4 border-violet-300">
            <Campo etiqueta="Nombre del área" value={a.nombre} onChange={(e) => actualizarArea(a.id, { nombre: e.target.value })} />
            <Campo
              etiqueta="Correo de contacto (opcional)"
              type="email"
              placeholder="Ej. biblioteca@tuinstitucion.edu.mx"
              value={a.correoContacto ?? ""}
              onChange={(e) => actualizarArea(a.id, { correoContacto: e.target.value || undefined })}
            />
            <p className="text-xs text-ink-soft">
              El código <strong className="font-mono text-ink">{a.codigo}</strong> no cambia, para no romper los trabajos que ya lo usan.
            </p>
            <BotonesEdicion
              onListo={() => setEditando(null)}
              onDesactivar={() => {
                desactivarArea(a.id);
                setEditando(null);
              }}
            />
          </Panel>
        ) : (
          <Fila
            key={a.id}
            icono={iconoArea(a.nombre)}
            titulo={a.nombre}
            texto={`Código: ${a.codigo}${a.correoContacto ? ` · ${a.correoContacto}` : ""}`}
            activa={a.activa}
            onEditar={() => setEditando(a.id)}
            onActivar={() => actualizarArea(a.id, { activa: true })}
          />
        ),
      )}

      {!agregando ? (
        <Opcion punteada icono="➕" titulo="Agregar un área" texto="Solo necesitas el nombre" onClick={() => setAgregando(true)} />
      ) : (
        <Panel className="bg-white space-y-4">
          <p className="font-semibold text-ink">Nueva área</p>
          <Campo
            etiqueta="¿Cómo se llama el área?"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Biblioteca"
            autoFocus
            pista={
              nombre.trim() ? (
                <>
                  Su código será: <strong className="font-mono text-ink">{sanearSegmento(codigo || nombre)}</strong>
                </>
              ) : (
                "El código corto se arma solo con el nombre."
              )
            }
          />
          <div className="flex flex-wrap gap-2">
            {EJEMPLOS_AREA.map((ej) => (
              <Pastilla
                key={ej.nombre}
                activa={nombre === ej.nombre}
                onClick={() => {
                  setNombre(ej.nombre);
                  setCodigo(ej.codigo);
                }}
              >
                {ej.icono} {ej.nombre}
              </Pastilla>
            ))}
          </div>
          <Ayuda titulo="Más opciones (no es obligatorio)" icono="⚙️">
            <Campo etiqueta="Código corto" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej. BIBLIO" />
            <Campo etiqueta="Correo de contacto" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Ej. biblioteca@tuinstitucion.edu.mx" />
          </Ayuda>
          <div className="flex gap-2">
            <BotonApp color="morado" className="flex-1" onClick={agregar} disabled={!nombre.trim()}>
              Guardar área
            </BotonApp>
            <BotonApp color="blanco" onClick={() => setAgregando(false)}>
              Cancelar
            </BotonApp>
          </div>
        </Panel>
      )}

      <Ayuda titulo="¿Qué es un área?">
        <p>
          Es el departamento o equipo de tu institución dueño de un trabajo: Biblioteca, Administración, Comunicación…
          Si desactivas una, deja de aparecer al crear trabajos, pero los que ya la usan no cambian.
        </p>
      </Ayuda>
    </div>
  );
}

/* ---------------------------------- Tipos ---------------------------------- */

function ListaTipos() {
  const categorias = useAppStore((s) => s.categorias);
  const crearCategoria = useAppStore((s) => s.crearCategoria);
  const actualizarCategoria = useAppStore((s) => s.actualizarCategoria);
  const desactivarCategoria = useAppStore((s) => s.desactivarCategoria);

  const [editando, setEditando] = useState<string | null>(null);
  const [agregando, setAgregando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [deDonde, setDeDonde] = useState("");
  const [aDonde, setADonde] = useState("");
  const [correo, setCorreo] = useState("");

  async function agregar() {
    const cod = sanearSegmento(codigo || nombre);
    if (!cod || !nombre.trim()) return;
    await crearCategoria({
      nombre: nombre.trim(),
      codigo: cod,
      deDondeViene: deDonde.trim(),
      aDondeVa: aDonde.trim(),
      correoContacto: correo.trim() || undefined,
    });
    setNombre("");
    setCodigo("");
    setDeDonde("");
    setADonde("");
    setCorreo("");
    setAgregando(false);
  }

  return (
    <div className="space-y-3">
      {categorias.map((c) =>
        editando === c.id ? (
          <Panel key={c.id} className="bg-white space-y-4 border-violet-300">
            <Campo etiqueta="Nombre del tipo" value={c.nombre} onChange={(e) => actualizarCategoria(c.id, { nombre: e.target.value })} />
            <Campo
              etiqueta="¿De dónde suele venir?"
              placeholder="Ej. Solicitud externa"
              value={c.deDondeViene}
              onChange={(e) => actualizarCategoria(c.id, { deDondeViene: e.target.value })}
            />
            <Campo
              etiqueta="¿A dónde suele ir?"
              placeholder="Ej. Convenio firmado"
              value={c.aDondeVa}
              onChange={(e) => actualizarCategoria(c.id, { aDondeVa: e.target.value })}
            />
            <Campo
              etiqueta="Correo de contacto (opcional)"
              type="email"
              value={c.correoContacto ?? ""}
              onChange={(e) => actualizarCategoria(c.id, { correoContacto: e.target.value || undefined })}
            />
            <p className="text-xs text-ink-soft">
              El código <strong className="font-mono text-ink">{c.codigo}</strong> no cambia, para no romper los trabajos que ya lo usan.
            </p>
            <BotonesEdicion
              onListo={() => setEditando(null)}
              onDesactivar={() => {
                desactivarCategoria(c.id);
                setEditando(null);
              }}
            />
          </Panel>
        ) : (
          <Fila
            key={c.id}
            icono={CATEGORIA_ICONOS[c.codigo] ?? "🏷️"}
            titulo={c.nombre}
            texto={c.deDondeViene && c.aDondeVa ? `${c.deDondeViene} → ${c.aDondeVa}` : `Código: ${c.codigo}`}
            activa={c.activa}
            onEditar={() => setEditando(c.id)}
            onActivar={() => actualizarCategoria(c.id, { activa: true })}
          />
        ),
      )}

      {!agregando ? (
        <Opcion punteada icono="➕" titulo="Agregar un tipo de trabajo" texto="Si ninguno describe lo que haces" onClick={() => setAgregando(true)} />
      ) : (
        <Panel className="bg-white space-y-4">
          <p className="font-semibold text-ink">Nuevo tipo de trabajo</p>
          <Campo
            etiqueta="¿Cómo se llama este tipo?"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Vinculación"
            autoFocus
            pista={
              nombre.trim() ? (
                <>
                  Su código será: <strong className="font-mono text-ink">{sanearSegmento(codigo || nombre)}</strong>
                </>
              ) : (
                "El código corto se arma solo con el nombre."
              )
            }
          />
          <Ayuda titulo="Más opciones (no es obligatorio)" icono="⚙️">
            <Campo etiqueta="Código corto" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej. VINC" />
            <Campo etiqueta="¿De dónde suele venir?" value={deDonde} onChange={(e) => setDeDonde(e.target.value)} placeholder="Ej. Solicitud externa" />
            <Campo etiqueta="¿A dónde suele ir?" value={aDonde} onChange={(e) => setADonde(e.target.value)} placeholder="Ej. Convenio firmado" />
            <Campo etiqueta="Correo de contacto" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </Ayuda>
          <div className="flex gap-2">
            <BotonApp color="morado" className="flex-1" onClick={agregar} disabled={!nombre.trim()}>
              Guardar tipo
            </BotonApp>
            <BotonApp color="blanco" onClick={() => setAgregando(false)}>
              Cancelar
            </BotonApp>
          </div>
        </Panel>
      )}

      <Ayuda titulo="¿Qué es un tipo de trabajo?">
        <p>
          Dice qué clase de trabajo es (un proyecto, un convenio, una producción…). Vienen 8 listos para usar y puedes
          editarlos o agregar más. Viajan dentro de tu copia de respaldo.
        </p>
      </Ayuda>
    </div>
  );
}

/* ------------------------- Compartir o llevar (archivo) ------------------------- */

type Caso = "ENVIAR" | "RECIBIR" | "CAMBIO" | "GUARDAR";

const CASOS: { valor: Caso; icono: string; titulo: string; texto: string }[] = [
  { valor: "ENVIAR", icono: "👥", titulo: "Pasarle mis áreas y tipos a un compañero", texto: "Para que en tu área todos armen los códigos igual" },
  { valor: "RECIBIR", icono: "📥", titulo: "Un compañero me mandó su archivo", texto: "Sus áreas y tipos se suman a los tuyos" },
  { valor: "CAMBIO", icono: "💻", titulo: "Me cambio de computadora o navegador", texto: "Para no perder nada al cambiarte" },
  { valor: "GUARDAR", icono: "💾", titulo: "Guardar una copia de mi configuración", texto: "Por si se borra el navegador" },
];

// Pasar solo áreas y tipos a otra computadora, a otro navegador o a un compañero. Al
// cargarlos se SUMAN a los que ya hay: nunca borra trabajos ni cambia lo que ya existe.
// Primero se pregunta qué quiere hacer la persona y solo se muestran esos pasos.
function CompartirConfiguracion() {
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const agregarConfiguracion = useAppStore((s) => s.agregarConfiguracion);
  const irA = useAppStore((s) => s.irA);

  const [caso, setCaso] = useState<Caso | null>(null);
  const [descargado, setDescargado] = useState<string | null>(null);
  const [pendiente, setPendiente] = useState<ArchivoTrabajo | null>(null);
  const [resultado, setResultado] = useState<{ areas: number; categorias: number } | null>(null);
  const [error, setError] = useState("");

  function construir(): ArchivoTrabajo {
    return generarArchivoTrabajo({
      institucion: "",
      departamentoOArea: "",
      autorPrincipal: autorActivo || "Sin nombre",
      areas,
      categorias,
      trabajos: [],
      tipoArchivo: "CONFIGURACION",
    });
  }
  const nombreEsperado = descargado ?? nombreArchivo(construir(), "json");

  async function elegir(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setResultado(null);
    try {
      setPendiente(await leerArchivoJSON(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer el archivo.");
    }
    e.target.value = "";
  }

  async function confirmar() {
    if (!pendiente) return;
    setResultado(await agregarConfiguracion(pendiente));
    setPendiente(null);
  }

  const nuevasAreas = pendiente ? pendiente.areas.filter((a) => !areas.some((x) => x.codigo === a.codigo)).length : 0;
  const nuevosTipos = pendiente ? pendiente.categorias.filter((c) => !categorias.some((x) => x.codigo === c.codigo)).length : 0;
  const direccionApp = `${window.location.origin}${window.location.pathname}`;

  const botonDescargar = (
    <span className="block mt-2 space-y-2">
      <BotonApp color="morado" onClick={() => setDescargado(exportarJSON(construir()))}>
        ⬇️ Descargar configuración
      </BotonApp>
      {descargado && (
        <span className="block text-xs">
          ✅ Quedó en <strong>Descargas</strong> como <strong className="font-mono break-all">{descargado}</strong>
        </span>
      )}
    </span>
  );

  return (
    <div className="space-y-5">
      <Panel className="bg-white space-y-2 text-sm text-ink-soft leading-relaxed">
        <p>
          <strong className="text-ink">¿Para qué sirve?</strong> Tu configuración son <strong>tus áreas y tus tipos</strong>{" "}
          ({areas.length} áreas y {categorias.length} tipos). Si tu equipo usa los mismos, todos arman los códigos igual. Se
          pasa con un archivo que <strong>no lleva tus trabajos</strong>.
        </p>
      </Panel>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink">¿Qué quieres hacer?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CASOS.map((c) => (
            <Opcion
              key={c.valor}
              icono={c.icono}
              titulo={c.titulo}
              texto={c.texto}
              seleccionada={caso === c.valor}
              onClick={() => {
                setCaso(c.valor);
                setError("");
              }}
            />
          ))}
        </div>
      </div>

      {caso === "ENVIAR" && (
        <Seccion color="morado" icono="👥" titulo="Pasarle tu configuración a un compañero" subtitulo="Tres pasos. La app no envía nada: tú se lo mandas.">
          <ol className="space-y-3">
            <PasoNumerado color="morado" numero={1} titulo="Descarga el archivo de configuración">
              {botonDescargar}
            </PasoNumerado>
            <PasoNumerado color="morado" numero={2} titulo="Mándaselo a tu compañero">
              Elige cómo:
            </PasoNumerado>
          </ol>
          <ComoPasarArchivo nombreArchivo={nombreEsperado} para="companero" color="morado" />
          <ol className="space-y-3">
            <PasoNumerado color="morado" numero={3} titulo="Dile a tu compañero qué hacer cuando le llegue">
              <span className="block mt-2 rounded-xl bg-violet-50 border border-violet-200 p-3 space-y-1.5">
                <span className="block">
                  1. Que descargue el archivo y abra la app en esta dirección:{" "}
                  <strong className="font-mono text-ink break-all">{direccionApp}</strong>
                </span>
                <span className="block">
                  2. <strong>Si es su primera vez:</strong> en la bienvenida, que toque <strong>“Ya tengo una copia de respaldo”</strong> y
                  elija el archivo.
                </span>
                <span className="block">
                  3. <strong>Si ya usa la app:</strong> que entre a <strong>Configuración → 👥 Compartir</strong>, toque{" "}
                  <strong>“Un compañero me mandó su archivo”</strong> y lo elija. Sus trabajos no se tocan.
                </span>
              </span>
            </PasoNumerado>
          </ol>
        </Seccion>
      )}

      {caso === "RECIBIR" && (
        <Seccion color="morado" icono="📥" titulo="Recibir áreas y tipos" subtitulo="Se suman a los tuyos. Lo que ya tienes no cambia.">
          <ol className="space-y-3">
            <PasoNumerado color="morado" numero={1} titulo="Ten el archivo en esta computadora">
              Descárgalo de tu correo, WhatsApp, Drive o cópialo de la USB. Su nombre empieza con{" "}
              <strong className="font-mono">configuracion-nomenclatura-viva_</strong>.
            </PasoNumerado>
            <PasoNumerado color="morado" numero={2} titulo="Toca “Elegir archivo” y búscalo en Descargas">
              También sirve un archivo de respaldo: solo se toman sus áreas y tipos.
            </PasoNumerado>
          </ol>

          {!pendiente ? (
            <label className={`${clasesBoton("morado", "lg")} w-full cursor-pointer`}>
              📂 Elegir archivo
              <input type="file" accept=".json,application/json" onChange={elegir} className="sr-only" />
            </label>
          ) : (
            <div className="space-y-3">
              <Aviso tono="info" icono="📦">
                {esArchivoDeConfiguracion(pendiente) ? "Este archivo de configuración" : "Este respaldo"} trae{" "}
                <strong>
                  {nuevasAreas} {nuevasAreas === 1 ? "área nueva" : "áreas nuevas"} y {nuevosTipos} {nuevosTipos === 1 ? "tipo nuevo" : "tipos nuevos"}
                </strong>{" "}
                para ti. Lo que ya tienes no cambia y tus trabajos no se tocan.
              </Aviso>
              <div className="flex gap-2">
                <BotonApp color="morado" className="flex-1" onClick={confirmar} disabled={nuevasAreas + nuevosTipos === 0}>
                  {nuevasAreas + nuevosTipos === 0 ? "No hay nada nuevo" : "Sí, agregarlos"}
                </BotonApp>
                <BotonApp color="blanco" onClick={() => setPendiente(null)}>
                  Cancelar
                </BotonApp>
              </div>
            </div>
          )}

          {resultado && (
            <Aviso tono="exito" icono="✅">
              <strong>¡Listo!</strong> Se agregaron {resultado.areas} {resultado.areas === 1 ? "área" : "áreas"} y {resultado.categorias}{" "}
              {resultado.categorias === 1 ? "tipo" : "tipos"}. Ya aparecen al crear un trabajo.
            </Aviso>
          )}
        </Seccion>
      )}

      {caso === "CAMBIO" && (
        <Seccion color="morado" icono="💻" titulo="Cambiarte de computadora o navegador" subtitulo="Tu información vive solo en este navegador: hay que llevarla.">
          <Aviso
            tono="info"
            icono="💾"
            accion={
              <BotonApp color="ambar" tamano="sm" onClick={() => irA("EXPORTAR_IMPORTAR")}>
                Ir a Respaldo
              </BotonApp>
            }
          >
            <strong>¿Quieres llevarte todo, con tus trabajos?</strong> Usa <strong>Respaldo → 🔁 Otra compu</strong>. Es lo más
            común.
          </Aviso>
          <p className="text-sm text-ink-soft">
            <strong className="text-ink">¿Solo tus áreas y tipos?</strong> Sigue estos pasos:
          </p>
          <ol className="space-y-3">
            <PasoNumerado color="morado" numero={1} titulo="Aquí, descarga tu configuración">
              {botonDescargar}
            </PasoNumerado>
            <PasoNumerado color="morado" numero={2} titulo="Pásala a la otra computadora">
              Si solo cambias de navegador en esta misma computadora (por ejemplo de Chrome a Edge), sáltate este paso: el archivo
              ya está en <strong>Descargas</strong>.
            </PasoNumerado>
          </ol>
          <ComoPasarArchivo nombreArchivo={nombreEsperado} color="morado" />
          <ol className="space-y-3">
            <PasoNumerado color="morado" numero={3} titulo="En la computadora o navegador nuevo">
              Abre <strong className="font-mono break-all">{direccionApp}</strong>. En la bienvenida toca{" "}
              <strong>“Ya tengo una copia de respaldo”</strong> y elige el archivo.
            </PasoNumerado>
          </ol>
        </Seccion>
      )}

      {caso === "GUARDAR" && (
        <Seccion color="morado" icono="💾" titulo="Guardar una copia de tu configuración" subtitulo="Por si se borra el navegador o la computadora falla.">
          <ol className="space-y-3">
            <PasoNumerado color="morado" numero={1} titulo="Descárgala">
              {botonDescargar}
            </PasoNumerado>
            <PasoNumerado color="morado" numero={2} titulo="Guárdala tú en un lugar seguro">
              Estas son ideas de dónde ponerla:
            </PasoNumerado>
          </ol>
          <ComoPasarArchivo nombreArchivo={nombreEsperado} color="morado" />
          <p className="text-xs text-ink-soft">
            💡 Para guardar también tus trabajos, mejor usa{" "}
            <button type="button" onClick={() => irA("EXPORTAR_IMPORTAR")} className="font-semibold text-amber-700 underline underline-offset-2">
              Respaldo
            </button>
            : lleva todo.
          </p>
        </Seccion>
      )}

      {error && (
        <Aviso tono="peligro" icono="❌">
          {error}
        </Aviso>
      )}
    </div>
  );
}

/* --------------------------------- Comunes --------------------------------- */

// Fila de la lista (informativa) con su botón "Editar" o "Activar".
function Fila({
  icono,
  titulo,
  texto,
  activa,
  onEditar,
  onActivar,
}: {
  icono: string;
  titulo: ReactNode;
  texto: ReactNode;
  activa: boolean;
  onEditar: () => void;
  onActivar: () => void;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-white border border-line p-3 ${activa ? "" : "opacity-60"}`}>
      <span aria-hidden="true" className="shrink-0 w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center text-2xl">
        {icono}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink leading-tight truncate">
          {titulo}
          {!activa && <span className="ml-2 text-[11px] font-semibold text-ink-soft bg-app rounded-full px-2 py-0.5 align-middle">Desactivada</span>}
        </p>
        <p className="text-xs text-ink-soft mt-0.5 truncate">{texto}</p>
      </div>
      {activa ? (
        <BotonApp color="blanco" tamano="sm" onClick={onEditar}>
          ✏️ Editar
        </BotonApp>
      ) : (
        <BotonApp color="blanco" tamano="sm" onClick={onActivar}>
          Activar
        </BotonApp>
      )}
    </div>
  );
}

function BotonesEdicion({ onListo, onDesactivar }: { onListo: () => void; onDesactivar: () => void }) {
  return (
    <div className="flex gap-2">
      <BotonApp color="morado" className="flex-1" onClick={onListo}>
        ✓ Listo
      </BotonApp>
      <BotonApp color="blanco" onClick={onDesactivar} className="!text-red-600">
        Desactivar
      </BotonApp>
    </div>
  );
}
