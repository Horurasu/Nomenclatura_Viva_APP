import { useAppStore } from "../../store/useAppStore";
import { Button, Card, SectionTitle } from "../ui/Primitives";

export function Inicio() {
  const irA = useAppStore((s) => s.irA);
  const totalTrabajos = useAppStore((s) => s.trabajos.length);

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle subtitle="Nombra, clasifica y da trazabilidad a tu trabajo diario, sin depender de dónde guardes tus documentos.">
          Bienvenido a Nomenclatura Viva
        </SectionTitle>
        <p className="text-sm text-slate-600 mb-4">
          Esta app te ayuda a responder tres preguntas simples por cada trabajo que haces —¿de qué área es?, ¿qué tipo de
          acción es?, ¿cómo se llama en corto?— y con eso genera un código corto y legible, le da seguimiento con un
          semáforo de estado, y lo deja localizable para ti y tus compañeros. Tus documentos siguen donde siempre los
          guardas (papel, tu computadora, la nube); esta app solo lleva el registro.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => irA("NUEVO_TRABAJO")}>+ Crear nuevo trabajo</Button>
          <Button variant="secondary" onClick={() => irA("TABLERO")}>
            Ver mi tablero ({totalTrabajos})
          </Button>
        </div>
      </Card>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">No olvides tu respaldo</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⬇️</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Exportar</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Descarga tu nomenclatura</h3>
            <p className="text-sm text-slate-600 mb-3">
              Todo se guarda en este navegador. Descarga tu archivo para tener un respaldo, cambiar de computadora o
              compartirlo con un compañero.
            </p>
            <Button onClick={() => irA("EXPORTAR_IMPORTAR")}>Ir a Exportar</Button>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⬆️</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">Importar</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Continúa tu trabajo</h3>
            <p className="text-sm text-slate-600 mb-3">
              ¿Ya tienes un archivo descargado antes, o uno que te compartió un compañero? Cárgalo aquí para seguir
              trabajando con él.
            </p>
            <Button variant="secondary" onClick={() => irA("EXPORTAR_IMPORTAR")}>
              Ir a Importar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
