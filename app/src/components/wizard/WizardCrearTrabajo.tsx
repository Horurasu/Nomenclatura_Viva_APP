import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { ACCIONES_SUGERIDAS, EJEMPLOS_CLAVE, LIMITE_CLAVE, UBICACION_AYUDA } from "../../domain/constants";
import { construirCodigoEsencial, excedeLimiteClave, sanearSegmento } from "../../domain/codigo";
import type { TipoUbicacion } from "../../domain/types";
import { Button, Card, Input, InfoBox, Label, SectionTitle, Select } from "../ui/Primitives";
import { UbicacionSelector } from "../ui/UbicacionSelector";

const PASOS = ["Área", "Categoría", "Clave", "Trazabilidad"] as const;

export function WizardCrearTrabajo() {
  const areas = useAppStore((s) => s.areas);
  const categorias = useAppStore((s) => s.categorias);
  const autorActivo = useAppStore((s) => s.autorActivo);
  const crearArea = useAppStore((s) => s.crearArea);
  const crearCategoria = useAppStore((s) => s.crearCategoria);
  const crearTrabajo = useAppStore((s) => s.crearTrabajo);
  const irA = useAppStore((s) => s.irA);

  const [paso, setPaso] = useState(0);

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

  // Clave (única — describe el trabajo y arma el código)
  const [claveInput, setClaveInput] = useState("");
  const codigoEsencial = areaCodigo && categoria && claveInput ? construirCodigoEsencial(areaCodigo, categoria, sanearSegmento(claveInput)) : "";

  // Trazabilidad
  const [origen, setOrigen] = useState("");
  const [accion, setAccion] = useState("");
  const [destino, setDestino] = useState("");
  const [tipoUbicacion, setTipoUbicacion] = useState<TipoUbicacion>("DIGITAL_LOCAL");
  const [descripcionUbicacion, setDescripcionUbicacion] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const areasActivas = areas.filter((a) => a.activa);
  const categoriasActivas = categorias.filter((c) => c.activa);

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

  async function confirmar() {
    if (!autorActivo.trim()) {
      setError('Escribe tu nombre arriba, en "Tu nombre" — así quedas registrado como autor de este trabajo.');
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
    const nuevo = await crearTrabajo({
      areaCodigo,
      categoria,
      clave: claveInput.trim(),
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
    irA("DETALLE", nuevo.id);
  }

  return (
    <Card>
      <SectionTitle subtitle="Responde las preguntas del sistema y registra la trazabilidad de tu trabajo.">
        Nuevo trabajo — Paso {paso + 1} de {PASOS.length}: {PASOS[paso]}
      </SectionTitle>

      <div className="flex gap-1 mb-6">
        {PASOS.map((p, i) => (
          <div key={p} className={`h-1.5 flex-1 rounded-full ${i <= paso ? "bg-emerald-600" : "bg-slate-200"}`} />
        ))}
      </div>

      {paso === 0 && (
        <div className="space-y-4">
          <InfoBox>
            Un <strong>área</strong> es la unidad de tu institución dueña de este trabajo. Ejemplos: Biblioteca,
            Administración, Recursos Humanos, Comunicación, Servicios Escolares... Si la tuya no aparece en la
            lista, créala aquí abajo: solo necesitas un nombre, el código corto se genera solo.
          </InfoBox>
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
            <div className="space-y-3 border border-slate-200 rounded-lg p-4">
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
        <div className="space-y-3">
          <InfoBox>
            Una <strong>categoría</strong> describe qué tipo de acción es este trabajo (un proyecto, un convenio, una
            producción...). Puedes usar las que ya existen, o crear/editar las que tu institución necesite — se
            guardan también en tu archivo al exportar, así que viajan si comparas tu trabajo con el de un compañero.
          </InfoBox>
          {!mostrarNuevaCategoria ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoriasActivas.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoria(c.codigo)}
                    className={`text-left rounded-lg border p-3 transition ${
                      categoria === c.codigo ? "border-emerald-600 bg-emerald-50" : "border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="font-medium text-slate-900">
                      {c.nombre} <span className="text-slate-400 font-normal">({c.codigo})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">De: {c.deDondeViene}</div>
                    <div className="text-xs text-slate-500">A: {c.aDondeVa}</div>
                  </button>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setMostrarNuevaCategoria(true)}>
                + Crear categoría nueva
              </Button>
            </>
          ) : (
            <div className="space-y-3 border border-slate-200 rounded-lg p-4">
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
        <div className="space-y-4">
          <InfoBox>
            Escribe una descripción corta de qué es este trabajo (ej. "Catálogo de libros 2026"). Con este mismo
            texto se arma tu código y así lo vas a reconocer después en el tablero.
          </InfoBox>
          <div>
            <Label>Clave</Label>
            <Input value={claveInput} onChange={(e) => setClaveInput(e.target.value)} maxLength={LIMITE_CLAVE} placeholder="Ej. Catálogo de libros 2026" />
            <p className="text-xs text-slate-400 mt-1">
              {claveInput.length}/{LIMITE_CLAVE}
            </p>
          </div>
          {codigoEsencial && (
            <InfoBox>
              Tu código será: <strong className="font-mono">{codigoEsencial}</strong>
            </InfoBox>
          )}

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">¿No sabes cómo empezar? Elige según para qué es</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EJEMPLOS_CLAVE.map((ej) => (
                <button
                  key={ej.titulo}
                  type="button"
                  onClick={() => setClaveInput(ej.ejemplo)}
                  className="text-left border border-slate-200 rounded-lg p-3 hover:border-emerald-300 transition"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{ej.icono}</span>
                    <span className="text-sm font-medium text-slate-800">{ej.titulo}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mb-1">"{ej.ejemplo}"</p>
                  <p className="text-[11px] text-slate-400">{ej.tip}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">¿Cómo fluye este trabajo?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
              <div className="border border-slate-200 rounded-lg p-3">
                <Label>📥 De dónde viene (origen)</Label>
                <Input value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder="Ej. Necesidad interna de organización" />
              </div>
              <div className="border border-slate-200 rounded-lg p-3">
                <Label>⚙️ Acción</Label>
                <Input list="acciones-sugeridas" value={accion} onChange={(e) => setAccion(e.target.value)} placeholder="Ej. Construir" />
                <datalist id="acciones-sugeridas">
                  {ACCIONES_SUGERIDAS.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
                <p className="text-[11px] text-slate-400 mt-1">Elige una de la lista o escribe la tuya, como prefieras.</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-3">
                <Label>📤 A dónde va (destino)</Label>
                <Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ej. Catálogo consultable" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-700 mb-1">¿Dónde está guardado el documento real?</p>
            <p className="text-xs text-slate-500 mb-3">Esto no lo guarda la app — solo anota dónde lo puedes encontrar tú o tus compañeros.</p>
            <UbicacionSelector value={tipoUbicacion} onChange={setTipoUbicacion} />
            <div className="mt-3">
              <Label>Descripción de la ubicación</Label>
              <Input
                value={descripcionUbicacion}
                onChange={(e) => setDescripcionUbicacion(e.target.value)}
                placeholder="Ej. Archivero 3, oficina de Biblioteca / Drive personal, carpeta Convenios"
              />
            </div>
            {codigoEsencial && (
              <div className="mt-3">
                <InfoBox tono="warning">{UBICACION_AYUDA[tipoUbicacion](codigoEsencial, areaCodigo, categoria)}</InfoBox>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={() => setPaso((p) => Math.max(0, p - 1))} disabled={paso === 0}>
          Atrás
        </Button>
        {paso < PASOS.length - 1 ? (
          <Button
            onClick={() => setPaso((p) => p + 1)}
            disabled={(paso === 0 && !areaCodigo) || (paso === 1 && !categoria) || (paso === 2 && !claveInput.trim())}
          >
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
