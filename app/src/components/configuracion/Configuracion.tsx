import { useState, type ReactNode } from "react";
import { useAppStore } from "../../store/useAppStore";
import { sanearSegmento } from "../../domain/codigo";
import { CATEGORIA_ICONOS, EJEMPLOS_AREA } from "../../domain/constants";
import { Ayuda, BotonApp, Campo, EncabezadoPantalla, Opcion, Panel, Pastilla, Pestanas } from "../ui/Estilo";

type Pestana = "AREAS" | "TIPOS";

function iconoArea(nombre: string): string {
  return EJEMPLOS_AREA.find((e) => e.nombre.toLowerCase() === nombre.toLowerCase())?.icono ?? "🏢";
}

export function Configuracion() {
  const autorActivo = useAppStore((s) => s.autorActivo);
  const [pestana, setPestana] = useState<Pestana>("AREAS");

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      <EncabezadoPantalla icono="⚙️" color="morado" titulo="Configuración" subtitulo="Las áreas y tipos de trabajo que usas al registrar." />

      <Pestanas<Pestana>
        opciones={[
          { valor: "AREAS", etiqueta: "🏢 Áreas" },
          { valor: "TIPOS", etiqueta: "🏷️ Tipos de trabajo" },
        ]}
        valor={pestana}
        onCambiar={setPestana}
      />

      {pestana === "AREAS" ? <ListaAreas /> : <ListaTipos />}

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
              <Pastilla key={ej.nombre} activa={nombre === ej.nombre} onClick={() => setNombre(ej.nombre)}>
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
