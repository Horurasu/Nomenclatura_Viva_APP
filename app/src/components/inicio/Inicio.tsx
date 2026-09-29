import { useAppStore } from "../../store/useAppStore";
import { Button, Card, SectionTitle } from "../ui/Primitives";

const GUIA_SECCIONES = [
  {
    icono: "📋",
    nombre: "Tablero",
    texto: "El espacio central: aquí ves todos tus trabajos activos y su estado, de un vistazo.",
  },
  {
    icono: "✨",
    nombre: "Nuevo trabajo",
    texto: "El asistente paso a paso para nombrar y registrar un trabajo desde cero.",
  },
  {
    icono: "🧭",
    nombre: "Trazabilidad",
    texto: "Dentro de cada trabajo: de dónde viene, qué se hace, a dónde va y en qué estado está.",
  },
  {
    icono: "💾",
    nombre: "Respaldo",
    texto: "Exporta o carga la configuración de tus trabajos — no tus archivos ni correos reales.",
  },
];

export function Inicio() {
  const irA = useAppStore((s) => s.irA);
  const totalTrabajos = useAppStore((s) => s.trabajos.length);

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: "#ffffff" }}>
        <SectionTitle subtitle="Nombra, clasifica y da trazabilidad a tu trabajo diario, sin depender de dónde guardes tus documentos.">
          Bienvenido a Nomenclatura Viva
        </SectionTitle>
        <p className="text-sm text-ink-soft mb-4 leading-relaxed">
          Esta app te ayuda a responder tres preguntas simples por cada trabajo que haces —¿de qué área es?, ¿qué tipo de
          acción es?, ¿cómo se llama en corto?— y con eso genera un código corto y legible, le da seguimiento con un
          semáforo de estado, y lo deja localizable para ti y tus compañeros. Tus documentos siguen donde siempre los
          guardas (papel, tu computadora, la nube); esta app solo lleva el registro.
        </p>
        <Button onClick={() => irA("NUEVO_TRABAJO")}>+ Crear nuevo trabajo</Button>
      </Card>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-ink-faint mb-3">¿Qué hace cada sección?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GUIA_SECCIONES.map((s) => (
            <div key={s.nombre} className="flex items-start gap-3 border border-line rounded-md p-3.5 bg-surface">
              <span className="text-xl leading-none opacity-80">{s.icono}</span>
              <div>
                <p className="text-sm font-medium text-ink">{s.nombre}</p>
                <p className="text-xs text-ink-soft mt-0.5 leading-relaxed">{s.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="text-sm text-ink-soft hover:text-ink hover:underline" onClick={() => irA("TABLERO")}>
        Ver mi tablero ({totalTrabajos} trabajos) →
      </button>
    </div>
  );
}
