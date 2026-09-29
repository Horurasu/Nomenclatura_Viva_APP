# Síntesis — Relación entre Mapa Vivo y Nomenclatura Viva

CIITE, Universidad Marista de Querétaro · 2026

## 1. Propósito de este documento

Los dos manuales metodológicos de esta carpeta (`Mapa_Vivo_Manual_Metodologico.md` y `Nomenclatura_Viva_Manual_Metodologico.md`) describen procesos separados que se declaran complementarios entre sí, pero ninguno de los dos contiene, de forma consolidada, la relación completa entre ambos. Este documento no repite el contenido íntegro de los manuales — los referencia — y existe únicamente para dejar registrada esa relación antes de iniciar el desarrollo de la aplicación que los implementará, aplicando al propio proyecto el principio de trazabilidad documental que promueve la Nomenclatura Viva.

Fuentes referenciadas:
- `./Mapa_Vivo_Manual_Metodologico.md` — versión 3.0
- `./Nomenclatura_Viva_Manual_Metodologico.md`

## 2. Resumen — Mapa Vivo

**Propósito:** externalizar el conocimiento tácito operativo (lo que las personas saben hacer pero no está escrito) y convertirlo en patrimonio institucional documentado, replicable y en mejora continua.

**Base teórica:** modelo SECI de Nonaka & Takeuchi (Socialización → Exteriorización → Combinación → Internalización), el concepto de conocimiento tácito de Polanyi, y el *Ba* (espacio de confianza necesario para que un actor externalice honestamente su saber).

**Secuencia operativa (7 fases cíclicas):**
1. Activación y planeación
2. Exteriorización (entrevista, 6 preguntas matrices, señales lingüísticas ⬦⏸★⚠🔴✦)
3. Profundización progresiva
4. Combinación — diagramado asistido por IA (Mermaid) y consolidación individual
5. Triangulación cruzada entre actores
6. Clasificación del conocimiento **A/B/C** (A = regla clara/automatizable, B = criterio experto, C = sabiduría institucional/protegida)
7. Evaluación institucional y propuesta de mejora

**Roles:**
- **Ingeniero del Conocimiento** — líder del área, habilita y valida acceso.
- **Investigador del Conocimiento** — rol metodológico único, ejercido por el CIITE.
- **Actores del área** — personal operativo, poseedores del conocimiento tácito.

**Marco ético:** no es auditoría ni evaluación de desempeño; no anonimiza (honra la autoría); el saber pertenece a quien lo posee.

## 3. Resumen — Nomenclatura Viva

**Propósito:** dar código, trazabilidad y escalabilidad a los insumos ya trabajados (no genera conocimiento nuevo ni entrevista), evitando duplicación y fragmentación documental entre áreas.

**Núcleo inmutable (DPAE):** coordenada computable `[D]_[P]_[A]_[E]` = Dominio, Proceso, Actor, Estado. Este núcleo nunca cambia; las novedades se anidan como sufijo, nunca reemplazan la estructura base.

**Tres niveles articulados:**
- **Nivel esencial** (humano-humano) — código corto `ÁREA-CATEGORÍA-CLAVE` (ej. `BIBLIO-PROY-CATALOGO`), sostenido por 8 categorías fijas: PROY, CONV, COLAB, PROD, DIVU, ACAD, ADM, APOYO.
- **Nivel USL** (humano-máquina) — coordenada `[D]_[P]_[A]_[E]`.
- **Capa IEML** (Pierre Lévy) — referencia semántica conceptual, no operativa, para interoperabilidad entre instituciones/idiomas.

**Mecanismo de trazabilidad:** ficha con 5 campos (origen, acción, destino, estado en semáforo 🔴🟡🟢, puente al USL) y principio de **archivo físico único** — nunca se duplica un documento; se genera un puente de lectura entre áreas.

**Reglas de oro:** núcleo inmutable · máximo 2 puntos de ramificación · alias ≤40 caracteres · prohibición de duplicar archivos físicos · control por reglas, no por vigilancia constante.

**Roles:** los mismos tres que en el Mapa Vivo, con una diferencia clave — los Actores del área no son entrevistados directamente en este proceso; su saber llega ya estructurado desde el Mapa Vivo.

## 4. Relación y complementariedad

Ambos manuales declaran la misma fórmula de fondo:

> **"El Mapa Vivo mejora y actualiza; la Nomenclatura Viva estructura y operacionaliza."**

Son dos procesos secuenciales y separados, no intercambiables:

```
  MAPA VIVO                                   NOMENCLATURA VIVA
  (externaliza el conocimiento)                (estructura y da trazabilidad)

  Entrevista (Ba, SECI) ──► Insumo trabajado ──► Código esencial (ÁREA-CATEGORÍA-CLAVE)
  Triangulación cruzada       (reporte,              │
  Clasificación A/B/C         diagrama, ficha)       ▼
                                                Coordenada USL [D]_[P]_[A]_[E]
                                                      │
                                                      ▼
                                                Capa IEML (interoperabilidad)
```

- El **Mapa Vivo descubre qué existe** (procesos, trucos, riesgos, conocimiento tácito).
- La **Nomenclatura Viva le da nombre, código y lugar** — sin repetir el trabajo de captura.
- El único punto de contacto entre ambos procesos es la **entrega de insumos ya trabajados** por el Mapa Vivo hacia la Nomenclatura Viva.
- El origen de variables nuevas en la Nomenclatura Viva (nuevos Dominios, Procesos, Actores o Estados) no lo inventa un individuo ni lo aprueba un validador aislado: surge del trabajo conjunto de ambos procesos.

**Elementos compartidos:**
- Los mismos tres roles: Ingeniero del Conocimiento, Investigador del Conocimiento (rol metodológico único, CIITE), Actores del área.
- El mismo marco ético: ninguno de los dos procesos es auditoría ni evaluación de desempeño; ninguno anonimiza (ambos honran la autoría); ambos se usan exclusivamente para mejorar, nunca para fiscalizar.

## 5. Nota de trazabilidad de este documento

| Campo | Valor |
|---|---|
| Documento | `Theory/Sintesis_Mapa_Vivo_Nomenclatura_Viva.md` |
| Fecha de creación | 2026-09-29 |
| Manual Mapa Vivo referenciado | v3.0 |
| Manual Nomenclatura Viva referenciado | edición 2026 (sin número de versión explícito en el manual fuente) |
| Estado | 🟢 Concluido — síntesis inicial, previa al desarrollo de la aplicación |

Si cualquiera de los dos manuales fuente se actualiza de versión, este documento debe revisarse para confirmar que la relación aquí descrita sigue siendo vigente.
