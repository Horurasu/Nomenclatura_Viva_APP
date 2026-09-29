import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { sanearSegmento } from "../../domain/codigo";
import { Button, Card, InfoBox, Input, Label, SectionTitle } from "../ui/Primitives";

export function Configuracion() {
  const areas = useAppStore((s) => s.areas);
  const crearArea = useAppStore((s) => s.crearArea);
  const actualizarArea = useAppStore((s) => s.actualizarArea);
  const desactivarArea = useAppStore((s) => s.desactivarArea);

  const categorias = useAppStore((s) => s.categorias);
  const crearCategoria = useAppStore((s) => s.crearCategoria);
  const actualizarCategoria = useAppStore((s) => s.actualizarCategoria);
  const desactivarCategoria = useAppStore((s) => s.desactivarCategoria);

  const autorActivo = useAppStore((s) => s.autorActivo);

  const [nombreArea, setNombreArea] = useState("");
  const [codigoArea, setCodigoArea] = useState("");
  const [correoArea, setCorreoArea] = useState("");

  const [nombreCat, setNombreCat] = useState("");
  const [codigoCat, setCodigoCat] = useState("");
  const [deDondeCat, setDeDondeCat] = useState("");
  const [aDondeCat, setADondeCat] = useState("");
  const [correoCat, setCorreoCat] = useState("");

  async function agregarArea() {
    const codigo = sanearSegmento(codigoArea || nombreArea);
    if (!codigo || !nombreArea.trim()) return;
    await crearArea(nombreArea.trim(), codigo, correoArea.trim() || undefined);
    setNombreArea("");
    setCodigoArea("");
    setCorreoArea("");
  }

  async function agregarCategoria() {
    const codigo = sanearSegmento(codigoCat || nombreCat);
    if (!codigo || !nombreCat.trim()) return;
    await crearCategoria({
      nombre: nombreCat.trim(),
      codigo,
      deDondeViene: deDondeCat.trim(),
      aDondeVa: aDondeCat.trim(),
      correoContacto: correoCat.trim() || undefined,
    });
    setNombreCat("");
    setCodigoCat("");
    setDeDondeCat("");
    setADondeCat("");
    setCorreoCat("");
  }

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle subtitle="Lista controlada, pero puede crecer: cada departamento agrega las suyas.">Áreas</SectionTitle>
        <InfoBox>
          Un área es la unidad de tu institución dueña de un trabajo. Ejemplos: Biblioteca, Administración, Recursos
          Humanos, Comunicación, Servicios Escolares... Para crear una, solo escribe su nombre — el código corto se
          genera solo si lo dejas vacío.
        </InfoBox>

        <div className="space-y-2 my-4">
          {areas.map((a) => (
            <div key={a.id} className={`border border-line rounded-lg p-3 ${a.activa ? "" : "opacity-50"}`}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`font-mono text-xs px-2 py-0.5 rounded bg-paper ${a.activa ? "" : "line-through"}`}>{a.codigo}</span>
                <Input
                  value={a.nombre}
                  onChange={(e) => actualizarArea(a.id, { nombre: e.target.value })}
                  className="max-w-xs"
                  disabled={!a.activa}
                />
                <Input
                  type="email"
                  placeholder="Correo de contacto (opcional)"
                  value={a.correoContacto ?? ""}
                  onChange={(e) => actualizarArea(a.id, { correoContacto: e.target.value || undefined })}
                  className="max-w-xs"
                  disabled={!a.activa}
                />
                {a.activa && (
                  <button className="text-xs text-terracotta-600 hover:underline whitespace-nowrap" onClick={() => desactivarArea(a.id)}>
                    Desactivar
                  </button>
                )}
              </div>
            </div>
          ))}
          {areas.length === 0 && <p className="text-sm text-ink-faint">Todavía no hay áreas registradas.</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-line">
          <Input placeholder="Nombre del área nueva" value={nombreArea} onChange={(e) => setNombreArea(e.target.value)} />
          <Input placeholder="Código (opcional)" value={codigoArea} onChange={(e) => setCodigoArea(e.target.value)} />
          <Input type="email" placeholder="Correo (opcional)" value={correoArea} onChange={(e) => setCorreoArea(e.target.value)} />
          <Button onClick={agregarArea}>+ Agregar área</Button>
        </div>
      </Card>

      <Card>
        <SectionTitle subtitle="Vienen 8 de fábrica, pero se pueden editar o agregar más — y viajan en tu archivo de exportación.">
          Categorías
        </SectionTitle>
        <InfoBox>
          Una categoría describe qué tipo de acción es un trabajo (un proyecto, un convenio, una producción...). Si
          compartes tu archivo exportado con un compañero, tus categorías (incluidas las que hayas editado o
          agregado) viajan junto con él.
        </InfoBox>

        <div className="space-y-2 my-4">
          {categorias.map((c) => (
            <div key={c.id} className={`border border-line rounded-lg p-3 space-y-2 ${c.activa ? "" : "opacity-50"}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-paper">{c.codigo}</span>
                <Input
                  value={c.nombre}
                  onChange={(e) => actualizarCategoria(c.id, { nombre: e.target.value })}
                  className="max-w-xs"
                  disabled={!c.activa}
                />
                {c.activa && (
                  <button className="text-xs text-terracotta-600 hover:underline whitespace-nowrap ml-auto" onClick={() => desactivarCategoria(c.id)}>
                    Desactivar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <Label>De dónde viene</Label>
                  <Input
                    value={c.deDondeViene}
                    onChange={(e) => actualizarCategoria(c.id, { deDondeViene: e.target.value })}
                    disabled={!c.activa}
                  />
                </div>
                <div>
                  <Label>A dónde va</Label>
                  <Input value={c.aDondeVa} onChange={(e) => actualizarCategoria(c.id, { aDondeVa: e.target.value })} disabled={!c.activa} />
                </div>
                <div>
                  <Label>Correo de contacto</Label>
                  <Input
                    type="email"
                    placeholder="Opcional"
                    value={c.correoContacto ?? ""}
                    onChange={(e) => actualizarCategoria(c.id, { correoContacto: e.target.value || undefined })}
                    disabled={!c.activa}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line pt-3 space-y-2">
          <p className="text-sm font-medium text-ink">+ Agregar categoría nueva</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Nombre" value={nombreCat} onChange={(e) => setNombreCat(e.target.value)} />
            <Input placeholder="Código (opcional)" value={codigoCat} onChange={(e) => setCodigoCat(e.target.value)} />
            <Input placeholder="De dónde viene" value={deDondeCat} onChange={(e) => setDeDondeCat(e.target.value)} />
            <Input placeholder="A dónde va" value={aDondeCat} onChange={(e) => setADondeCat(e.target.value)} />
            <Input type="email" placeholder="Correo de contacto (opcional)" value={correoCat} onChange={(e) => setCorreoCat(e.target.value)} />
            <Button onClick={agregarCategoria}>+ Agregar categoría</Button>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Tu nombre</SectionTitle>
        <p className="text-sm text-ink-soft mb-3">
          Este nombre se usa como autoría en cada trabajo que creas o editas — la metodología pide que la autoría
          siempre sea visible, nunca anónima.
        </p>
        <Input value={autorActivo} readOnly className="bg-paper" />
        <p className="text-xs text-ink-faint mt-1">Se cambia desde la barra superior.</p>
      </Card>
    </div>
  );
}
