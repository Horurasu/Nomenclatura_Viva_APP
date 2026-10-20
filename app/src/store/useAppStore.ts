import { create } from "zustand";
import { db } from "../storage/db";
import { CATEGORIAS_SEED } from "../domain/constants";
import type { Area, ArchivoTrabajo, Categoria, EstadoSemaforo, Trabajo } from "../domain/types";

export type Vista = "INICIO" | "NUEVO_TRABAJO" | "TABLERO" | "DETALLE" | "EXPORTAR_IMPORTAR" | "CONFIGURACION";

interface AppState {
  cargando: boolean;
  vista: Vista;
  trabajoSeleccionadoId: string | null;
  ultimoTrabajoCreadoId: string | null;
  autorActivo: string;
  // Sin nombre no se puede entrar a ninguna sección: irA() se detiene, recuerda a dónde
  // ibas y se abre la ventana que pide el nombre. Al guardarlo, te lleva ahí.
  vistaPendiente: { vista: Vista; trabajoId?: string } | null;
  cancelarVistaPendiente: () => void;
  areas: Area[];
  categorias: Categoria[];
  trabajos: Trabajo[];

  // Para las advertencias de respaldo: la app nunca guarda tus archivos ni tus datos en
  // ningún servidor, así que si nunca has exportado (o hiciste cambios después de la
  // última exportación), conviene avisarte antes de que los pierdas al cerrar la pestaña.
  haExportadoAlgunaVez: boolean;
  cambiosSinExportar: boolean;
  fechaUltimoRespaldo: string | null;
  marcarExportado: () => void;

  inicializar: () => Promise<void>;
  irA: (vista: Vista, trabajoId?: string) => void;
  setAutorActivo: (nombre: string) => void;
  limpiarUltimoTrabajoCreado: () => void;

  crearArea: (nombre: string, codigo: string, correoContacto?: string) => Promise<Area>;
  actualizarArea: (id: string, cambios: Partial<Area>) => Promise<void>;
  desactivarArea: (id: string) => Promise<void>;

  crearCategoria: (datos: {
    nombre: string;
    codigo: string;
    deDondeViene: string;
    aDondeVa: string;
    correoContacto?: string;
  }) => Promise<Categoria>;
  actualizarCategoria: (id: string, cambios: Partial<Categoria>) => Promise<void>;
  desactivarCategoria: (id: string) => Promise<void>;

  crearTrabajo: (datos: Omit<Trabajo, "id" | "fechaCreacion" | "fechaUltimaEdicion">) => Promise<Trabajo>;
  actualizarTrabajo: (id: string, cambios: Partial<Trabajo>) => Promise<void>;
  cambiarEstado: (id: string, estado: EstadoSemaforo, nota?: string) => Promise<void>;
  eliminarTrabajo: (id: string) => Promise<void>;

  reemplazarTodo: (archivo: ArchivoTrabajo) => Promise<void>;
  // Suma las áreas y tipos del archivo que todavía no tienes (por código). No toca tus
  // trabajos ni cambia lo que ya tenías.
  agregarConfiguracion: (archivo: ArchivoTrabajo) => Promise<{ areas: number; categorias: number }>;
}

// Solo en desarrollo: abrir la app con "?sin-nombre" en la URL borra el nombre guardado,
// para probar el flujo de "primera vez" sin abrir la consola del navegador.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has("sin-nombre")) {
  localStorage.removeItem("nv_autorActivo");
  window.history.replaceState(null, "", window.location.pathname);
}

export const useAppStore = create<AppState>((set, get) => ({
  cargando: true,
  vista: "INICIO",
  trabajoSeleccionadoId: null,
  ultimoTrabajoCreadoId: null,
  autorActivo: localStorage.getItem("nv_autorActivo") ?? "",
  vistaPendiente: null,
  cancelarVistaPendiente: () => set({ vistaPendiente: null }),
  areas: [],
  categorias: [],
  trabajos: [],

  haExportadoAlgunaVez: localStorage.getItem("nv_haExportadoAlgunaVez") === "true",
  cambiosSinExportar: localStorage.getItem("nv_cambiosSinExportar") !== "false",
  fechaUltimoRespaldo: localStorage.getItem("nv_fechaUltimoRespaldo"),
  marcarExportado: () => {
    const ahora = new Date().toISOString();
    localStorage.setItem("nv_haExportadoAlgunaVez", "true");
    localStorage.setItem("nv_cambiosSinExportar", "false");
    localStorage.setItem("nv_fechaUltimoRespaldo", ahora);
    set({ haExportadoAlgunaVez: true, cambiosSinExportar: false, fechaUltimoRespaldo: ahora });
  },

  inicializar: async () => {
    const [areas, categorias, trabajos] = await Promise.all([
      db.areas.toArray(),
      db.categorias.toArray(),
      db.trabajos.toArray(),
    ]);
    let categoriasFinal = categorias;
    if (categorias.length === 0) {
      // IDs fijos (no aleatorios) + bulkPut (upsert): si esto se dispara dos veces en
      // paralelo (p. ej. React StrictMode invocando el efecto de montaje dos veces),
      // ambas llamadas escriben exactamente los mismos 8 registros en vez de duplicarlos.
      const ahora = new Date().toISOString();
      const semilla: Categoria[] = CATEGORIAS_SEED.map((c) => ({
        id: `semilla-${c.codigo}`,
        codigo: c.codigo,
        nombre: c.nombre,
        deDondeViene: c.deDondeViene,
        aDondeVa: c.aDondeVa,
        activa: true,
        creadoPor: "Sistema",
        fechaCreacion: ahora,
      }));
      await db.categorias.bulkPut(semilla);
      categoriasFinal = semilla;
    } else {
      // Limpieza defensiva: por si algún navegador ya se quedó con categorías
      // duplicadas por código (la condición de carrera que arregla el bloque de arriba).
      const vistos = new Map<string, Categoria>();
      for (const c of categorias) {
        if (!vistos.has(c.codigo)) vistos.set(c.codigo, c);
      }
      if (vistos.size !== categorias.length) {
        const idsAConservar = new Set([...vistos.values()].map((c) => c.id));
        const idsAEliminar = categorias.filter((c) => !idsAConservar.has(c.id)).map((c) => c.id);
        await db.categorias.bulkDelete(idsAEliminar);
        categoriasFinal = [...vistos.values()];
      }
    }
    set({ areas, categorias: categoriasFinal, trabajos, cargando: false });
  },

  irA: (vista, trabajoId) => {
    if (vista !== "INICIO" && !get().autorActivo.trim()) {
      set({ vistaPendiente: { vista, trabajoId } });
      return;
    }
    set({ vista, trabajoSeleccionadoId: trabajoId ?? null, vistaPendiente: null });
  },

  // Guardar el nombre te deja donde estás, o te lleva a la sección que intentabas abrir.
  setAutorActivo: (nombre) => {
    localStorage.setItem("nv_autorActivo", nombre);
    set({ autorActivo: nombre });
    const pendiente = get().vistaPendiente;
    if (pendiente && nombre.trim()) get().irA(pendiente.vista, pendiente.trabajoId);
  },

  limpiarUltimoTrabajoCreado: () => set({ ultimoTrabajoCreadoId: null }),

  crearArea: async (nombre, codigo, correoContacto) => {
    const nueva: Area = {
      id: crypto.randomUUID(),
      codigo,
      nombre,
      correoContacto: correoContacto || undefined,
      activa: true,
      creadoPor: get().autorActivo || "Sin nombre",
      fechaCreacion: new Date().toISOString(),
    };
    await db.areas.add(nueva);
    localStorage.setItem("nv_cambiosSinExportar", "true");
    set({ areas: [...get().areas, nueva], cambiosSinExportar: true });
    return nueva;
  },

  actualizarArea: async (id, cambios) => {
    await db.areas.update(id, cambios);
    set({ areas: get().areas.map((a) => (a.id === id ? { ...a, ...cambios } : a)) });
  },

  desactivarArea: async (id) => {
    await db.areas.update(id, { activa: false });
    set({ areas: get().areas.map((a) => (a.id === id ? { ...a, activa: false } : a)) });
  },

  crearCategoria: async (datos) => {
    const nueva: Categoria = {
      id: crypto.randomUUID(),
      codigo: datos.codigo,
      nombre: datos.nombre,
      deDondeViene: datos.deDondeViene,
      aDondeVa: datos.aDondeVa,
      correoContacto: datos.correoContacto || undefined,
      activa: true,
      creadoPor: get().autorActivo || "Sin nombre",
      fechaCreacion: new Date().toISOString(),
    };
    await db.categorias.add(nueva);
    localStorage.setItem("nv_cambiosSinExportar", "true");
    set({ categorias: [...get().categorias, nueva], cambiosSinExportar: true });
    return nueva;
  },

  actualizarCategoria: async (id, cambios) => {
    await db.categorias.update(id, cambios);
    set({ categorias: get().categorias.map((c) => (c.id === id ? { ...c, ...cambios } : c)) });
  },

  desactivarCategoria: async (id) => {
    await db.categorias.update(id, { activa: false });
    set({ categorias: get().categorias.map((c) => (c.id === id ? { ...c, activa: false } : c)) });
  },

  crearTrabajo: async (datos) => {
    const ahora = new Date().toISOString();
    const nuevo: Trabajo = { ...datos, id: crypto.randomUUID(), fechaCreacion: ahora, fechaUltimaEdicion: ahora };
    await db.trabajos.add(nuevo);
    localStorage.setItem("nv_cambiosSinExportar", "true");
    set({ trabajos: [...get().trabajos, nuevo], cambiosSinExportar: true, ultimoTrabajoCreadoId: nuevo.id });
    return nuevo;
  },

  actualizarTrabajo: async (id, cambios) => {
    const parche = { ...cambios, fechaUltimaEdicion: new Date().toISOString() };
    await db.trabajos.update(id, parche);
    localStorage.setItem("nv_cambiosSinExportar", "true");
    set({ trabajos: get().trabajos.map((t) => (t.id === id ? { ...t, ...parche } : t)), cambiosSinExportar: true });
  },

  cambiarEstado: async (id, estado, nota) => {
    const trabajo = get().trabajos.find((t) => t.id === id);
    if (!trabajo) return;
    const cambio = {
      id: crypto.randomUUID(),
      estado,
      fecha: new Date().toISOString(),
      autor: get().autorActivo || "Sin nombre",
      nota,
    };
    const ficha = {
      ...trabajo.ficha,
      estadoActual: estado,
      historialEstados: [...trabajo.ficha.historialEstados, cambio],
    };
    await get().actualizarTrabajo(id, { ficha });
  },

  eliminarTrabajo: async (id) => {
    await db.trabajos.delete(id);
    localStorage.setItem("nv_cambiosSinExportar", "true");
    set({ trabajos: get().trabajos.filter((t) => t.id !== id), cambiosSinExportar: true });
  },

  reemplazarTodo: async (archivo) => {
    await db.transaction("rw", db.areas, db.categorias, db.trabajos, async () => {
      await db.areas.clear();
      await db.categorias.clear();
      await db.trabajos.clear();
      await db.areas.bulkAdd(archivo.areas);
      await db.categorias.bulkAdd(archivo.categorias);
      await db.trabajos.bulkAdd(archivo.trabajos);
    });
    localStorage.setItem("nv_cambiosSinExportar", "false");
    set({
      areas: archivo.areas,
      categorias: archivo.categorias,
      trabajos: archivo.trabajos,
      vista: "TABLERO",
      cambiosSinExportar: false,
    });
  },

  agregarConfiguracion: async (archivo) => {
    const { areas, categorias } = get();
    const idsUsados = new Set([...areas, ...categorias].map((x) => x.id));
    // Si el id ya existe (otro registro con distinto código), se le da uno nuevo.
    const conIdLibre = <T extends { id: string }>(x: T): T => (idsUsados.has(x.id) ? { ...x, id: crypto.randomUUID() } : x);
    const codigosArea = new Set(areas.map((a) => a.codigo));
    const codigosCat = new Set(categorias.map((c) => c.codigo));
    const nuevasAreas = archivo.areas.filter((a) => !codigosArea.has(a.codigo)).map(conIdLibre);
    const nuevasCats = archivo.categorias.filter((c) => !codigosCat.has(c.codigo)).map(conIdLibre);
    await db.transaction("rw", db.areas, db.categorias, async () => {
      await db.areas.bulkAdd(nuevasAreas);
      await db.categorias.bulkAdd(nuevasCats);
    });
    if (nuevasAreas.length || nuevasCats.length) localStorage.setItem("nv_cambiosSinExportar", "true");
    set({
      areas: [...areas, ...nuevasAreas],
      categorias: [...categorias, ...nuevasCats],
      cambiosSinExportar: get().cambiosSinExportar || nuevasAreas.length + nuevasCats.length > 0,
    });
    return { areas: nuevasAreas.length, categorias: nuevasCats.length };
  },
}));
