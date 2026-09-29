/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta cálida y apagada (estilo minimalista), en vez de los colores
        // saturados de "app de startup" (emerald/blue/amber/violet puros).
        paper: "#f7f5f0",
        surface: "#fdfcfa",
        ink: {
          DEFAULT: "#2b2b28",
          soft: "#6b6660",
          faint: "#a39d92",
        },
        line: "#e5e0d3",
        // Verde musgo — acento principal (antes emerald).
        moss: {
          50: "#eef1e9",
          100: "#dde4d1",
          200: "#c1cdaf",
          300: "#a3b48b",
          400: "#889c6c",
          500: "#748a58",
          600: "#63774a",
          700: "#51613c",
          800: "#414d31",
        },
        // Índigo apagado — acento secundario (antes blue).
        ai: {
          50: "#eaeef2",
          100: "#d3dbe4",
          200: "#aebccd",
          300: "#8398b2",
          400: "#647d9c",
          500: "#54698a",
          600: "#485a76",
          700: "#3c4a61",
        },
        // Ocre — acento de énfasis (antes amber).
        kaki: {
          50: "#f5eee1",
          100: "#ecdcbf",
          200: "#dcc190",
          300: "#c9a565",
          400: "#b78f49",
          500: "#a67d3c",
          600: "#8c6a34",
          700: "#71552a",
        },
        // Ciruela — acento terciario (antes violet).
        budou: {
          50: "#f1ecf1",
          100: "#e1d4e2",
          200: "#c7aec9",
          300: "#a988ac",
          400: "#8e6c92",
          500: "#7a5c7e",
          600: "#684d6c",
          700: "#553f58",
        },
        // Terracota — para peligro/eliminar (antes red).
        terracotta: {
          50: "#f6e9e3",
          100: "#eed0c4",
          200: "#dda88f",
          300: "#c8836a",
          400: "#b8684c",
          500: "#aa5940",
          600: "#914a34",
          700: "#753c2a",
        },
      },
    },
  },
  plugins: [],
};
