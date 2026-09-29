import Dexie, { type Table } from "dexie";
import type { Area, Categoria, Trabajo } from "../domain/types";

// Toda la persistencia vive en el navegador de cada persona (IndexedDB). El servidor
// nunca guarda estos datos: solo sirve los archivos de la app.
class NomenclaturaVivaDB extends Dexie {
  trabajos!: Table<Trabajo, string>;
  areas!: Table<Area, string>;
  categorias!: Table<Categoria, string>;

  constructor() {
    super("nomenclatura-viva-db");
    // v2: las categorías ahora son editables/extensibles (antes eran fijas en código)
    // y se quitó la tabla "dpae" del modo avanzado.
    this.version(2).stores({
      trabajos: "id, areaCodigo, categoria",
      areas: "id, codigo",
      categorias: "id, codigo",
    });
  }
}

export const db = new NomenclaturaVivaDB();
