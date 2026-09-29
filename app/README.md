# Nomenclatura Viva — App (MVP)

Aplicación web que implementa la metodología **Nomenclatura Viva** (ver `../Theory/`): permite
nombrar, clasificar y dar trazabilidad a los trabajos de cualquier departamento con un código
corto (`ÁREA-CATEGORÍA-CLAVE`), sin depender de dónde estén guardados los documentos reales
(papel, carpeta local o nube).

## Cómo está construida

- React + TypeScript + Vite. Se compila a un **build 100% estático** (HTML/JS/CSS), no hay
  backend ni base de datos propia.
- Todos los datos (áreas, trabajos, vocabulario) se guardan **en el navegador** de cada persona,
  vía IndexedDB (con Dexie.js). Nada se envía ni se guarda en ningún servidor.
- Para respaldar el trabajo, compartirlo con un colega o llevarlo a otra computadora, se usa el
  panel "Exportar / Importar": descarga un archivo `.json` (fuente de verdad, reimportable) y,
  opcionalmente, un `.xlsx` de solo lectura para revisar en Excel.

## Requisitos

- Node.js 18 o superior (incluye `npm`).

## Cómo correrla en desarrollo

```bash
cd app
npm install
npm run dev
```

Abre la URL que muestre la terminal (por defecto `http://localhost:5173`).

## Cómo generar la build para producción

```bash
cd app
npm install
npm run build
```

Esto genera la carpeta `app/dist/` con archivos estáticos listos para servirse desde cualquier
servidor web (por ejemplo Nginx en un VPS). No requiere Node.js en el servidor de producción,
solo para generar la build.

Para revisar la build localmente antes de subirla:

```bash
npm run preview
```

## Estructura del código

```
src/
  domain/       Tipos y reglas puras (código esencial, escalabilidad, vocabulario DPAE)
  storage/      Persistencia local (IndexedDB) y exportar/importar archivos
  store/        Estado global de la app (Zustand)
  components/   Pantallas y piezas de UI
```

## Nota sobre el vocabulario DPAE

El manual `Theory/Nomenclatura_Viva_Manual_Metodologico.md` documenta 13 códigos de "Proceso" y
7 de "Estado" en el núcleo USL, pero solo da ejemplos de 3 de cada uno. La app arranca con esos
códigos conocidos y permite agregar los que falten desde "Configuración → Vocabulario DPAE" en
cuanto se tenga el listado institucional completo — no están inventados.
