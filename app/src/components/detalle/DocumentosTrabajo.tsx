import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { codigoDeTrabajo, nombreDocumento, sanearSegmento } from "../../domain/codigo";
import { TIPOS_DOCUMENTO } from "../../domain/constants";
import type { Documento, Trabajo } from "../../domain/types";
import { BotonApp, Campo, Pastilla } from "../ui/Estilo";
import { SUBCARPETAS } from "../ui/GuiaCarpeta";

function hoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Los documentos que van dentro de un trabajo (actas, oficios, listas…): la app arma el
// nombre de cada archivo a partir del código del trabajo y lleva la lista. No guarda el
// archivo: el nombre se copia y se pega al guardarlo en la carpeta.
export function DocumentosTrabajo({ trabajo }: { trabajo: Trabajo }) {
  const actualizarTrabajo = useAppStore((s) => s.actualizarTrabajo);
  const autorActivo = useAppStore((s) => s.autorActivo);

  const codigo = codigoDeTrabajo(trabajo);
  const documentos = trabajo.documentos ?? [];

  const [tipo, setTipo] = useState("");
  const [otroTipo, setOtroTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(hoy());
  const [subcarpeta, setSubcarpeta] = useState("");
  const [copiado, setCopiado] = useState<string | null>(null);

  const codigoTipo = tipo === "OTRO" ? sanearSegmento(otroTipo) : tipo;
  const numero = documentos.filter((d) => d.tipo === codigoTipo).reduce((max, d) => Math.max(max, d.numero), 0) + 1;
  const nombre = codigoTipo ? nombreDocumento({ codigo, tipo: codigoTipo, numero, descripcion, fecha }) : "";
  const esCorreo = trabajo.ubicacion.tipo === "CORREO";

  function elegirTipo(valor: string) {
    setTipo(valor);
    const sugerida = TIPOS_DOCUMENTO.find((t) => t.codigo === valor)?.carpeta;
    if (sugerida) setSubcarpeta(sugerida);
  }

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(texto);
      setTimeout(() => setCopiado(null), 1800);
    } catch {
      // Si el navegador no deja copiar, el nombre sigue a la vista para escribirlo a mano.
    }
  }

  async function agregar() {
    if (!nombre) return;
    const nuevo: Documento = {
      id: crypto.randomUUID(),
      tipo: codigoTipo,
      numero,
      descripcion: descripcion.trim(),
      fecha,
      subcarpeta,
      nombre,
      autor: autorActivo || "Sin nombre",
      fechaRegistro: new Date().toISOString(),
    };
    await actualizarTrabajo(trabajo.id, { documentos: [...documentos, nuevo] });
    await copiar(nombre);
    setDescripcion("");
  }

  async function quitar(doc: Documento) {
    if (!window.confirm(`¿Quitar "${doc.nombre}" de la lista? Tu archivo real no se toca.`)) return;
    await actualizarTrabajo(trabajo.id, { documentos: documentos.filter((d) => d.id !== doc.id) });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft leading-relaxed">
        Este trabajo es la carpeta o expediente. Aquí le pones nombre a <strong className="text-ink">cada documento de adentro</strong>:
        todos empiezan con <strong className="font-mono text-ink break-all">{codigo}</strong>, así los encuentras con el buscador.
      </p>

      {/* 1. Qué documento es */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink">1. ¿Qué documento es?</p>
        <div className="flex flex-wrap gap-2">
          {TIPOS_DOCUMENTO.map((t) => (
            <Pastilla key={t.codigo} activa={tipo === t.codigo} onClick={() => elegirTipo(t.codigo)}>
              {t.icono} {t.nombre}
            </Pastilla>
          ))}
          <Pastilla activa={tipo === "OTRO"} onClick={() => elegirTipo("OTRO")}>
            ➕ Otro
          </Pastilla>
        </div>
        {tipo === "OTRO" && (
          <Campo
            value={otroTipo}
            onChange={(e) => setOtroTipo(e.target.value)}
            placeholder="Ej. Credencial"
            autoFocus
            pista={otroTipo.trim() ? <>En el nombre saldrá como <strong className="font-mono text-ink">{sanearSegmento(otroTipo)}</strong></> : "Escribe qué documento es, en una o dos palabras."}
          />
        )}
      </div>

      {tipo && (
        <>
          {/* 2. De qué o de quién */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
            <Campo
              etiqueta="2. ¿De qué o de quién es? (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej. Ana López"
              pista="Corto: un nombre, un grupo o un tema."
            />
            <Campo etiqueta="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value || hoy())} />
          </div>

          {/* 3. Dónde va */}
          {!esCorreo && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">
                3. ¿En qué parte de la carpeta va?
                <span className="block text-xs font-normal text-ink-soft">Ya te sugerimos una; cámbiala si no es.</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBCARPETAS.map((s) => (
                  <Pastilla key={s.nombre} activa={subcarpeta === s.nombre} onClick={() => setSubcarpeta(s.nombre)}>
                    📁 {s.nombre}
                  </Pastilla>
                ))}
              </div>
            </div>
          )}

          {/* Resultado */}
          <div className="rounded-2xl bg-ink text-paper p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-paper/60">Nombre del archivo</p>
            <p className="font-mono font-semibold break-all">{nombre || "Escribe qué documento es"}</p>
            {!esCorreo && subcarpeta && (
              <p className="text-xs text-paper/70 font-mono break-all">
                Guárdalo en: {codigo} / {subcarpeta}
              </p>
            )}
          </div>
          <BotonApp className="w-full" onClick={agregar} disabled={!nombre}>
            {copiado === nombre ? "✓ Copiado y anotado" : "📋 Copiar nombre y anotarlo en la lista"}
          </BotonApp>
          <p className="text-xs text-ink-soft">
            Luego, al guardar tu archivo (<strong>Guardar como…</strong>), pega el nombre con <strong>Ctrl + V</strong>. La extensión
            (.pdf, .docx, .jpg) la pone tu programa.
          </p>
        </>
      )}

      {/* Lista de documentos */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink">
          Documentos de este trabajo <span className="font-normal text-ink-soft">({documentos.length})</span>
        </p>
        {documentos.length === 0 ? (
          <p className="text-xs text-ink-soft rounded-xl bg-app px-3 py-3 text-center">Todavía no anotas ningún documento.</p>
        ) : (
          <ul className="space-y-2">
            {[...documentos].reverse().map((d) => (
              <li key={d.id} className="flex items-center gap-2 rounded-xl bg-white border border-line p-2 pl-3">
                <span aria-hidden="true" className="text-lg">
                  {TIPOS_DOCUMENTO.find((t) => t.codigo === d.tipo)?.icono ?? "📄"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-semibold text-ink break-all">{d.nombre}</p>
                  <p className="text-[11px] text-ink-soft">
                    {d.subcarpeta ? `📁 ${d.subcarpeta} · ` : ""}
                    {d.autor}
                  </p>
                </div>
                <BotonApp color={copiado === d.nombre ? "verde" : "blanco"} tamano="sm" onClick={() => copiar(d.nombre)}>
                  {copiado === d.nombre ? "✓" : "Copiar"}
                </BotonApp>
                <BotonApp color="blanco" tamano="sm" onClick={() => quitar(d)} aria-label={`Quitar ${d.nombre}`} className="!text-red-600">
                  ✕
                </BotonApp>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
