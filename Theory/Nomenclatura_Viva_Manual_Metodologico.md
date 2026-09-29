# Nomenclatura Viva

## Manual Metodológico Integral

### Sistema de clasificación, trazabilidad y escalabilidad documental

---

**Centro de Investigación en Innovación y Tecnología Educativa (CIITE)**
Universidad Marista de Querétaro · 2026

---

> **Naturaleza de este documento.** Este manual consolida en un solo texto la metodología de la **Nomenclatura Viva**: su propósito, sus fundamentos conceptuales, su arquitectura de sistema, su secuencia operativa, sus instrumentos y sus reglas de gobernanza. Es un manual metodológico, no un reporte de actividades: todos los ejemplos son genéricos y didácticos. La Nomenclatura Viva **no** describe ni ejecuta la metodología del **Mapa Vivo** (entrevistas, construcción de confianza, triangulación): ese es un proceso previo y separado, cuyo único punto de contacto con la Nomenclatura Viva es la entrega de insumos ya trabajados. La conducción metodológica recae en un único rol formal —el **Investigador del Conocimiento**—, apoyado por el **Ingeniero del Conocimiento** (actor estratégico del área) y alimentado por el saber de los **Actores del área**, que llega ya estructurado desde el Mapa Vivo.

---

## Tabla de contenido

**Parte I — Marco general**
1. Introducción general
2. Propósito de la Nomenclatura Viva
3. Qué es y qué no es
4. Relación con el Mapa Vivo: dos procesos separados

**Parte II — Fundamentos conceptuales**
5. El problema que resuelve: silos, duplicación y el "frasco único de sal"
6. La doble interfaz: calidez en la superficie, rigor en el fondo
7. Las tres dimensiones que integra la Nomenclatura Viva
8. El IEML como antecedente conceptual (no como fundamento operativo)

**Parte III — Arquitectura sistémica**
9. Visión de sistema y principio de archivo físico único
10. Los tres niveles articulados: esencial, USL e IEML
11. El núcleo que nunca cambia (fondo DPAE)

**Parte IV — Roles y actores**
12. Ingeniero del Conocimiento (actor estratégico)
13. Investigador del Conocimiento (rol metodológico central)
14. Actores del área (saber que entra vía Mapa Vivo)
15. Auto-mantenimiento del sistema (sin validador humano constante)

**Parte V — Secuencia operativa (sin entrevistas)**
16. Panorama del ciclo
17. Paso 1 — Punto de partida: recepción de insumos y origen de nuevas variables
18. Paso 2 — Asignación del código esencial
19. Paso 3 — Trazabilidad
20. Paso 4 — Escalabilidad del código
21. Paso 5 — Integración con USL e IEML
22. Paso 6 — Operación cotidiana

**Parte VI — Instrumentos operativos**
23. Las ocho categorías (vocabulario común)
24. La tabla de trazabilidad y el semáforo
25. Ejemplo didáctico de extremo a extremo
26. Inventario ilustrativo con ejemplos genéricos

**Parte VII — Prospectiva de escalabilidad por habilidad técnica**
27. Categoría A · Mínima habilidad técnica — Nivel esencial (humano–humano)
28. Categoría B · Habilidad técnica intermedia — Nivel USL (humano–máquina)
29. Categoría C · Perfil especializado — Capa IEML (humano–humano–máquina)
30. Cómo se sube de nivel sin romper nada

**Parte VIII — Ética y gobernanza**
31. No anonimización: el nombre honra la autoría
32. No es auditoría ni evaluación de desempeño
33. Las cinco reglas de oro y la protección del conocimiento

**Parte IX — Cierre**
34. Conclusiones y recomendaciones de uso
35. Glosario
36. Corpus documental de origen y referencias

---

# Parte I — Marco general

## 1. Introducción general

La **Nomenclatura Viva** es el sistema con el que se nombra, clasifica y da trazabilidad a cada trabajo de una organización bajo una lógica común, sin obligar a nadie a memorizar códigos complejos. Su punto de partida es un problema cotidiano: cada área nombra la información a su manera, de modo que un mismo asunto vive bajo etiquetas distintas en distintas áreas. El resultado es la duplicación de esfuerzos, la pérdida de tiempo y la fragmentación de la inteligencia colectiva.

La Nomenclatura Viva responde a ese problema con una idea económica y escalable: **un código corto y legible para cada trabajo, sostenido por una estructura común que nunca cambia**. En la superficie, las personas ven nombres amables que respetan el flujo de su área; en el fondo, cada nombre apunta a una coordenada exacta que la máquina entiende sin ambigüedad. Esta articulación entre lo humano y lo computable es lo que da al sistema su carácter "vivo": se adopta poco a poco, empieza con lo que cada área ya hace y crece sin romper nada.

El adjetivo "viva" describe tres propiedades del sistema: es **legible** (una persona sin formación técnica puede usarlo), es **escalable** (el mismo código sirve para una cosa, un área, una institución o una región) y es **interoperable** (áreas distintas, e incluso idiomas distintos, apuntan al mismo dato). Este manual describe cómo funciona, cómo se opera y cómo escala.

## 2. Propósito de la Nomenclatura Viva

El propósito puede enunciarse en una sola frase: **dar trazabilidad a cada trabajo mediante un código común, legible y escalable, que las personas puedan usar sin conocimientos técnicos y que la máquina pueda procesar sin ambigüedad**.

De este propósito se derivan cuatro objetivos operativos:

| # | Objetivo | Qué significa en la práctica |
|---|----------|------------------------------|
| 1 | **Nombrar** | Asignar a cada trabajo un código corto y con significado, bajo una estructura común a todas las áreas. |
| 2 | **Ubicar** | Permitir encontrar cualquier trabajo por su código, sin depender de cómo lo haya nombrado una persona en particular. |
| 3 | **Trazar** | Registrar de dónde viene cada trabajo, qué acción implica, a dónde va y en qué estado se encuentra. |
| 4 | **Escalar** | Hacer que el mismo código sirva, sin reescribirse, cuando el trabajo cruza fronteras entre áreas, instituciones o regiones. |

La Nomenclatura Viva trabaja en el **nivel esencial** del sistema (el código corto). Ese nivel es la cara operativa de una arquitectura de tres capas que se describe en la Parte III: por debajo del código corto operan, en silencio, una coordenada computable (USL) y una capa de referencia semántica neutral al idioma (IEML). El usuario cotidiano no necesita conocer esas capas para operar el sistema.

## 3. Qué es y qué no es

Para delimitar con precisión el alcance del sistema:

- **Es** un sistema de clasificación, trazabilidad y escalabilidad documental. **No es** un software: es un método que puede correr sobre herramientas genéricas —incluso sobre simples carpetas y archivos— y que sobrevive al cambio de herramienta.
- **Es** una forma común de nombrar. **No es** una imposición sobre la identidad de cada área: en la superficie, cada área conserva su lenguaje.
- **Es** el sistema que estructura y operacionaliza el conocimiento. **No es** el método que captura ese conocimiento; esa función corresponde al Mapa Vivo (ver §4).
- **No es** una auditoría ni una herramienta de evaluación de desempeño. La información que ordena se usa exclusivamente para la mejora del área (ver Parte VIII).

## 4. Relación con el Mapa Vivo: dos procesos separados

El Mapa Vivo y la Nomenclatura Viva son **dos procesos distintos** que se relacionan por un único punto de contacto: la entrega de insumos. Confundirlos degrada ambos. La distinción debe quedar explícita:

- **El Mapa Vivo es previo y separado.** Es la herramienta de **mejora, actualización y depuración** del conocimiento: captura el conocimiento tácito de un área —el saber que vive en las personas—, lo depura y lo mantiene al día. Opera mediante un proceso propio, que incluye entrevistas y construcción de confianza, y que **no forma parte de la Nomenclatura Viva**.
- **La Nomenclatura Viva recibe insumos ya trabajados.** Toma lo que el Mapa Vivo (u otro proceso previo) ya estructuró —listas de trabajos, descripciones, acuerdos, proyectos, productos, servicios— y le aplica su propia lógica: código, trazabilidad y escalabilidad.
- **No se mezclan.** La Nomenclatura Viva **no** realiza entrevistas, **no** construye el espacio de confianza (el *Ba*), **no** hace triangulaciones ni ejecuta ninguna otra parte de la metodología del Mapa Vivo. Solo estructura y clasifica lo que recibe.

La relación se resume en una fórmula:

> **El Mapa Vivo mejora y actualiza; la Nomenclatura Viva estructura y operacionaliza.**

```
   PROCESO PREVIO (separado)                 SISTEMA DE ESTE MANUAL
   ┌─────────────────────────┐               ┌─────────────────────────┐
   │        MAPA VIVO         │   insumos     │    NOMENCLATURA VIVA     │
   │  captura el saber tácito │  ya           │  código + trazabilidad  │
   │  lo depura y lo actualiza│──trabajados──▶│  + escalabilidad        │
   │  (mejora y actualización)│               │  (nivel esencial → USL) │
   └─────────────────────────┘               └─────────────────────────┘
        mejora y actualiza                        estructura y operacionaliza
```

### 4.1 De dónde surgen las nuevas variables

Un punto esencial de esta relación es el **origen de las nuevas variables** del sistema. Las nuevas claves, categorías y variables de la Nomenclatura Viva **no las inventa un individuo desde su escritorio ni las aprueba un validador**: surgen del **trabajo conjunto de los actores en el Mapa Vivo**.

El mecanismo es el siguiente. El Mapa Vivo identifica, en la operación real de un área, los procesos, las acciones, los documentos y los flujos que efectivamente existen. Esa identificación produce una trazabilidad del quehacer real. Esa trazabilidad es, precisamente, el insumo que alimenta a la Nomenclatura Viva, que la estructura y la clasifica bajo su lógica común. Dicho de otro modo: **el Mapa Vivo descubre qué existe; la Nomenclatura Viva le da nombre, código y lugar.** Cuando aparece una clave, una categoría o una variable nueva, es porque el trabajo real —capturado por el Mapa Vivo— la reveló, no porque alguien la decretara.

---

# Parte II — Fundamentos conceptuales

## 5. El problema que resuelve: silos, duplicación y el "frasco único de sal"

El punto de partida conceptual es un conflicto entre dos necesidades legítimas y aparentemente opuestas:

- **La máquina y quien administra los datos** necesitan rigor absoluto, sin sinónimos, para conectar dominios distintos y lograr que todos los sistemas se comuniquen.
- **La persona que coordina o enseña** necesita nombres amigables, que reflejen su identidad y su forma de trabajar.

Si se obliga a la comunidad a usar códigos rígidos, se genera rechazo. Si se permite el texto libre, se rompe la inteligencia colectiva y la información se vuelve invisible: el mismo asunto queda guardado bajo dos etiquetas distintas en dos áreas, se duplica y se pierde.

La solución conceptual es la metáfora del **frasco único de sal**: por más nombres que cada cocina le dé, la sal es una sola. Se necesita una sola referencia compartida para cada cosa, de modo que un archivo que un área llama de una manera y otra área llama de otra sea, en el fondo, el **mismo nodo**. La Nomenclatura Viva construye ese frasco único sin quitarle a nadie su forma de nombrar.

## 6. La doble interfaz: calidez en la superficie, rigor en el fondo

El mecanismo que resuelve el conflicto anterior es la **doble interfaz**. Toda información se lee de dos formas vinculadas de manera biunívoca (uno a uno, sin ambigüedad):

| Interfaz de superficie (para las personas) | Interfaz de fondo (para la máquina) |
|--------------------------------------------|-------------------------------------|
| Alias amigables en lenguaje natural. | Una coordenada exacta por cada dato. |
| Respeta los flujos de cada área. | Siempre la misma estructura de fondo. |
| Nadie memoriza códigos. | Interoperabilidad total, sin ambigüedad. |

Entre ambas capas opera un **traductor silencioso**: la persona ve un alias en su propio lenguaje mientras la máquina sabe que se trata exactamente del mismo dato que otra área ve con un nombre distinto. Ambas etiquetas apuntan al mismo archivo. Así, la memoria institucional deja de estar fragmentada en silos, sin renunciar a la diversidad de voces de la comunidad.

## 7. Las tres dimensiones que integra la Nomenclatura Viva

La Nomenclatura Viva se distingue de un simple esquema de metadatos porque articula, de forma deliberada, **tres dimensiones de relación**. Cada dimensión corresponde a un nivel de habilidad técnica del usuario y a una capa del sistema. Esta correspondencia es el eje que ordena toda la prospectiva de escalabilidad de la Parte VII; aquí se presenta en su forma conceptual.

| Dimensión | Qué relaciona | Capa del sistema | Perfil de usuario |
|-----------|---------------|------------------|-------------------|
| **Humano–humano** | Personas que nombran las cosas para que otras personas las entiendan. | Nivel esencial (código corto). | Mínima habilidad técnica. |
| **Humano–máquina** | Una persona que trabaja con la coordenada exacta que la máquina procesa. | Nivel USL (coordenada computable). | Habilidad técnica intermedia. |
| **Humano–humano–máquina** | Muchas personas, de áreas, instituciones e idiomas distintos, más las máquinas, apuntando al mismo nodo. | Capa IEML (referencia semántica neutral al idioma). | Perfil especializado (interoperabilidad). |

La lógica es la siguiente. En la dimensión **humano–humano**, el sistema resuelve el entendimiento entre personas: basta un código corto y legible para que dos personas nombren igual la misma cosa. En la dimensión **humano–máquina**, el sistema resuelve el diálogo entre una persona y el sistema de fondo: el código corto se traduce a una coordenada computable que la máquina puede buscar, ordenar y relacionar. En la dimensión **humano–humano–máquina**, el sistema resuelve la interoperabilidad plena: cuando intervienen varias áreas, varias instituciones y varios idiomas, se requiere una referencia semántica que garantice que todos apuntan al mismo significado, más allá de cómo se nombre en cada lengua.

Estas tres dimensiones no son etapas que se recorran de forma obligatoria: son **capas que conviven**. La mayoría de las personas operará siempre en la primera; solo un perfil especializado necesita comprender la tercera. Esa es la razón por la que la escalabilidad se organiza por habilidad técnica (Parte VII): cada quien opera en la dimensión que su tarea requiere, sin obligarse a conocer las demás.

## 8. El IEML como antecedente conceptual (no como fundamento operativo)

Esta sección concentra, como corresponde a un apartado de antecedentes conceptuales, la explicación del IEML. Toda otra mención del IEML en este manual remite aquí.

**Qué es.** El **IEML** (*Information Economy MetaLanguage*) es un lenguaje artificial creado por **Pierre Lévy**. Su propósito es permitir que las computadoras procesen el significado semántico de datos distribuidos en internet. Se centra, por tanto, en la **relación humano–máquina lingüística**: dotar a la información de una semántica que una máquina pueda computar de forma neutral al idioma.

**Qué lugar ocupa en la Nomenclatura Viva.** El IEML se cita aquí como **antecedente conceptual y técnico**, útil para comprender la idea de una semántica neutral al idioma. Conviene fijar su lugar exacto para evitar un malentendido frecuente:

- El IEML **no es la base estructural** de la Nomenclatura Viva. La base estructural operativa es el **código esencial** (ÁREA–CATEGORÍA–CLAVE) y, por debajo, la **coordenada USL**.
- El IEML **no determina la arquitectura** de la Nomenclatura Viva. Aparece únicamente como referente conceptual, nunca como fundamento operativo.
- La Nomenclatura Viva **integra dimensiones que el IEML, por sí mismo, no organiza**: las relaciones humano–humano, humano–máquina y humano–humano–máquina descritas en §7.

> **Nota aclaratoria.** En este sistema, IEML opera como capa semántica de fondo, neutral al idioma, pero no determina la arquitectura de la Nomenclatura Viva. No debe mezclarse con el Mapa Vivo ni con la operación cotidiana de la Nomenclatura Viva.

La referencia mínima correspondiente se recoge en §36.

---

# Parte III — Arquitectura sistémica

## 9. Visión de sistema y principio de archivo físico único

La Nomenclatura Viva es un sistema, no un procedimiento aislado. Sus componentes —código, trazabilidad, niveles y reglas— se sostienen entre sí sobre un principio rector: **el principio de archivo físico único**.

Este principio establece que un mismo trabajo tiene **un solo archivo físico**, sin copias entre áreas. Cuando dos áreas necesitan el mismo documento, no se duplica el archivo: se genera un **puente de lectura** que muestra el mismo archivo con el nombre adaptado a cada área. Así, un mismo documento puede verse con una etiqueta desde un área y con otra etiqueta desde otra, pero ambas señalan el mismo nodo. Este principio es la garantía técnica de que la doble interfaz (§6) no genera silos nuevos.

## 10. Los tres niveles articulados: esencial, USL e IEML

El sistema opera en tres niveles articulados, del más legible al más profundo:

```
   ┌───────────────────────────────────────────────────────────┐
   │  NIVEL ESENCIAL   ·  código corto y legible                │  ← lo que usa la gente
   │  ÁREA - CATEGORÍA - CLAVE   (ej. BIBLIO-PROY-CATALOGO)      │
   ├───────────────────────────────────────────────────────────┤
   │  NIVEL AVANZADO   ·  coordenada USL computable              │  ← lo que usa la máquina
   │  [D]_[P]_[A]_[E]                                            │
   ├───────────────────────────────────────────────────────────┤
   │  CAPA DE FONDO    ·  IEML, referencia semántica neutral     │  ← antecedente conceptual
   │  (silenciosa; no determina la arquitectura del sistema)     │
   └───────────────────────────────────────────────────────────┘
```

- El **nivel esencial** es el código corto que este manual pone en manos de toda la comunidad. Corresponde al tier intermedio ("Alias Medio") del sistema documental.
- El **nivel avanzado (USL)** es la coordenada computable a la que se traduce cada código esencial. Es la fórmula inmutable del fondo.
- La **capa IEML** es la referencia semántica neutral al idioma que, en el fondo, ayuda a que un mismo concepto pueda leerse como el mismo nodo aunque se nombre en distintos idiomas. Es un antecedente conceptual (§8) y no determina la arquitectura del sistema.

La regla que conecta los niveles operativos y hace posible la escalabilidad es una sola: **el código crece hacia afuera**. Cada vez que un trabajo cruza una frontera (otra área, otra institución, otra región) gana un prefijo, pero el núcleo nunca cambia (ver §20).

## 11. El núcleo que nunca cambia (fondo DPAE)

Por debajo del código corto opera el **núcleo USL**, la "despensa central" del sistema. Responde a una fórmula inmutable de cuatro coordenadas:

**[D]_[P]_[A]_[E]** — Dominio, Proceso, Actor, Estado.

| Coordenada | Cantidad | Códigos base |
|------------|----------|--------------|
| **Dominio (D)** | 6 | D-ESC, D-DIS, D-CAP, D-PRE, D-DAT, D-ARC |
| **Proceso (P)** | 13 | de P-ENS a P-COM |
| **Actor (A)** | 4 | A-ALU, A-PRO, A-INV, A-LID |
| **Estado (E)** | 7 | de E-BOR a E-ARC |

Cada coordenada responde una pregunta simple sobre el trabajo:

| Coordenada | Pregunta | Ejemplos |
|------------|----------|----------|
| **Dominio** | ¿De qué ámbito es? | Escolar, Investigación |
| **Proceso** | ¿Qué se hace con él? | Enseñar, Comunicar |
| **Actor** | ¿A quién involucra? | Alumnos, Investigadores, Líderes |
| **Estado** | ¿En qué fase está? | Borrador, Archivado |

Como estas cuatro preguntas nunca cambian, forman el núcleo estable del sistema. Toda área, actual o futura, **se anida bajo un código padre existente** sin romper las búsquedas generales; nunca se inventan dominios, procesos, actores o estados nuevos. La tabla siguiente ilustra el mecanismo de anidamiento con **ejemplos genéricos** de áreas colgando del núcleo, cada una con su alias legible para el uso cotidiano:

| Área (ejemplo genérico) | Código | Padre USL | Alias medio |
|-------------------------|--------|-----------|-------------|
| Biblioteca | D-ARC.BIB | D-ARC | ARC-BIB |
| Administración | D-PRE.ADM | D-PRE | PRE-ADM |
| Coordinación Académica | D-ESC.ACA | D-ESC | ESC-ACA |
| Comunicación | P-COM.DIF | P-COM | COM-DIF |

El usuario cotidiano no necesita conocer esta tabla: opera con el código corto. El núcleo existe para que la máquina mantenga el rigor por debajo, siguiendo reglas fijas de anidamiento y no la decisión de un validador (ver §15).

---

# Parte IV — Roles y actores

La Nomenclatura Viva se sostiene sobre una lógica de roles precisa. Tres actores participan en la lógica del sistema. No existe un cuarto rol de validación: la integridad se mantiene por reglas, no por vigilancia (ver §15).

## 12. Ingeniero del Conocimiento (actor estratégico)

El **Ingeniero del Conocimiento** es el actor estratégico: el líder, jefe, director, coordinador o administrador del área.

- Posee la **visión global** del funcionamiento de su área.
- **Facilita el acceso** a los actores y **valida la pertinencia** de los temas.
- Puede ser entrevistado dentro del **Mapa Vivo** para profundizar en su visión, decisiones y criterios; **no** es entrevistado dentro de la Nomenclatura Viva, porque la Nomenclatura no realiza entrevistas.

Su aporte a la Nomenclatura Viva es indirecto pero decisivo: la calidad de los insumos que la Nomenclatura recibe depende de que el Ingeniero del Conocimiento haya habilitado y validado, en el proceso previo, el saber de su área.

## 13. Investigador del Conocimiento (rol metodológico central)

El **Investigador del Conocimiento** es el **único rol metodológico formal** dentro de la Nomenclatura Viva.

- **Conduce el proceso completo** de análisis y estructuración: recibe los insumos, asigna los códigos, documenta la trazabilidad y verifica la escalabilidad.
- Aporta el **fundamento científico, analítico y metodológico** del sistema.
- Es quien traduce el saber ya capturado en la estructura común de la Nomenclatura Viva.

Toda la secuencia operativa de la Parte V es ejecutada por el Investigador del Conocimiento. Su intervención es **periódica**, no permanente: el sistema sigue operando entre una intervención y otra (ver §15).

## 14. Actores del área (saber que entra vía Mapa Vivo)

Los **Actores del área** son las personas que operan los procesos cotidianos del área dirigida por el Ingeniero del Conocimiento.

- Poseen el conocimiento tácito del quehacer diario.
- Su información **llega a la Nomenclatura Viva a través del Mapa Vivo**, no mediante entrevistas dentro de la Nomenclatura.

En términos de la Nomenclatura Viva, los actores del área son la **fuente última de los insumos y de las nuevas variables** (§4.1), pero su participación directa ocurre en el proceso previo, no en este sistema.

## 15. Auto-mantenimiento del sistema (sin validador humano constante)

La Nomenclatura Viva **no depende de una persona que valide todo**. A escala —muchas áreas, muchas instituciones, muchos trabajos— un validador humano que apruebe cada código, cada categoría y cada prefijo se vuelve un cuello de botella inviable. Por eso el sistema está diseñado para ser **auto-mantenible**: la coherencia se sostiene mediante **reglas claras** (Parte VIII) y mediante la **retroalimentación del Mapa Vivo** (§4.1), no mediante supervisión permanente.

> El sistema debe estar diseñado para funcionar sin supervisión 24/7. La intervención humana será periódica, no constante, y aun así el sistema debe seguir corriendo, manteniéndose operativo y coherente incluso cuando nadie lo esté revisando. La arquitectura debe permitir que la trazabilidad, las categorías y los prefijos se mantengan estables sin vigilancia continua.

En la práctica, esto significa tres cosas:

- **La estructura hace el trabajo del validador.** El núcleo DPAE es inmutable y toda novedad se anida bajo un código padre existente siguiendo una regla fija, no un criterio discrecional. Como las reglas son explícitas, el anidamiento correcto puede determinarse sin consultar a nadie.
- **Las categorías y los prefijos son estables por diseño.** Las ocho categorías son un vocabulario cerrado y compartido; los prefijos solo se encienden al cruzar una frontera, según una escalera fija (§20). Ninguno de los dos depende de una aprobación caso por caso.
- **El Mapa Vivo alimenta la evolución.** Cuando el trabajo real cambia y aparecen variables nuevas, es el Mapa Vivo —no un vigilante del sistema— el que las descubre y las entrega ya trabajadas. La intervención humana especializada se concentra en momentos periódicos de integración, no en una vigilancia continua.

---

# Parte V — Secuencia operativa (sin entrevistas)

## 16. Panorama del ciclo

La Nomenclatura Viva se ejecuta en seis pasos. A diferencia del Mapa Vivo, **ninguno de ellos implica entrevistas, construcción de confianza ni triangulación**: el sistema parte de insumos ya trabajados y los estructura.

| Paso | Nombre | Producto |
|------|--------|----------|
| 1 | Punto de partida: recepción de insumos | Lista de trabajos a nombrar |
| 2 | Asignación del código esencial | Código ÁREA-CATEGORÍA-CLAVE por trabajo |
| 3 | Trazabilidad | Ficha de origen, acción, destino, estado y puente al USL |
| 4 | Escalabilidad del código | Prefijos por frontera cruzada |
| 5 | Integración con USL e IEML | Traducción a coordenada computable y referencia semántica |
| 6 | Operación cotidiana | Uso: nombrar, encontrar, seguir el estado |

```
  Insumos ──▶ Código esencial ──▶ Trazabilidad ──▶ Escalabilidad ──▶ USL / IEML ──▶ Operación
 (paso 1)      (paso 2)            (paso 3)          (paso 4)          (paso 5)       (paso 6)
```

## 17. Paso 1 — Punto de partida: recepción de insumos y origen de nuevas variables

La Nomenclatura Viva **recibe insumos ya trabajados** por procesos previos, como el Mapa Vivo. Esos insumos pueden ser listas de trabajos, descripciones, acuerdos, proyectos, productos o servicios. El Investigador del Conocimiento no genera este material desde cero ni lo obtiene por entrevista: lo toma tal como llega y lo prepara para su codificación.

Aquí se materializa el origen de las nuevas variables (§4.1). Cuando el Mapa Vivo identifica en la operación real un proceso, una acción, un documento o un flujo que aún no tenía nombre en el sistema, esa novedad llega como insumo. La Nomenclatura Viva la recibe y le asigna clave, categoría y lugar. **Las variables nuevas nacen del trabajo real capturado por el Mapa Vivo, no de una decisión aislada.**

La única exigencia sobre el insumo es que cada elemento sea un **trabajo identificable**: algo que pueda nombrarse, con un origen y un destino reconocibles.

## 18. Paso 2 — Asignación del código esencial

Cada trabajo recibe un **código corto** con la estructura:

**ÁREA – CATEGORÍA – CLAVE**

| Pieza | Qué es | Naturaleza |
|-------|--------|------------|
| **Área** | A qué unidad pertenece el trabajo. | Lista controlada que crece. |
| **Categoría** | Qué tipo de acción es. | Vocabulario común a todas las áreas e instituciones. |
| **Clave** | Abreviatura con significado que nombra la cosa concreta. | Local de cada trabajo. |

El código se construye respondiendo **tres preguntas básicas**:

1. **¿De qué área es?** → determina el segmento ÁREA.
2. **¿Qué tipo de acción es?** → determina el segmento CATEGORÍA.
3. **¿Cómo se llama en corto?** → determina el segmento CLAVE.

La respuesta a las tres preguntas es el código. Por ejemplo, un catálogo elaborado por una biblioteca se nombra: Biblioteca (**BIBLIO**) + Proyecto (**PROY**) + catálogo (**CATALOGO**) = `BIBLIO-PROY-CATALOGO`. Nada más se necesita para nombrar un trabajo en el nivel esencial.

## 19. Paso 3 — Trazabilidad

Una vez asignado el código, cada trabajo se documenta con su **ficha de trazabilidad**, que responde cinco cosas:

| Campo | Qué responde |
|-------|--------------|
| **De dónde viene** | El origen del trabajo (iniciativa, línea, solicitud, requerimiento). |
| **Acción** | Qué se hace con él (construir, operar, difundir, producir, gestionar, apoyar…). |
| **A dónde va** | El resultado esperado (producto, servicio, acuerdo, publicación…). |
| **Estado** | En qué fase está, mostrado con semáforo (§24). |
| **Puente al USL** | La coordenada computable a la que se traduce el código corto. |

La trazabilidad es lo que convierte un simple nombre en un dato con historia: no solo se sabe cómo se llama el trabajo, sino de dónde viene, qué implica, a dónde va y en qué punto se encuentra.

## 20. Paso 4 — Escalabilidad del código

El código crece **hacia afuera**. El núcleo (CATEGORÍA-CLAVE) nunca cambia; solo se añade un prefijo cada vez que el trabajo cruza una frontera. La escalera tiene cuatro peldaños (ejemplos genéricos):

| Nivel | Frontera que cruza | Prefijo | Código del ejemplo |
|-------|--------------------|---------|--------------------|
| **Cosa** | Uso interno (dentro del área) | — | PROY-CATALOGO |
| **Área** | Entre áreas de la misma institución | BIBLIO | BIBLIO-PROY-CATALOGO |
| **Institución** | Entre instituciones | INST | INST-BIBLIO-PROY-CATALOGO |
| **Región** | Entre instituciones federadas | RED | RED-INST-BIBLIO-PROY-CATALOGO |

- **Entre áreas:** otras áreas usan el mismo molde (por ejemplo `ADM-ACAD-MANUAL` en Administración, `BIBLIO-PROD-INFORME` en Biblioteca). Como comparten categorías, pueden cruzarse y compararse.
- **Entre instituciones:** cuando un trabajo se comparte con otra institución, se enciende el prefijo de institución. Desde la otra institución, el mismo trabajo se lee en su idioma y en su propia área, pero la capa de categorías y la referencia semántica del fondo ayudan a reconocer que es el mismo nodo.
- **Entre regiones:** al federarse varias instituciones, se enciende el prefijo de región. El mecanismo es idéntico para una región territorial o un consorcio.

**Economía del código:** el prefijo solo aparece cuando se necesita. Dentro de casa, el código se mantiene corto.

Ninguno de estos prefijos requiere la aprobación de un validador: cada frontera tiene su prefijo según la escalera fija anterior, de modo que la escalabilidad se mantiene estable sin vigilancia continua (§15).

## 21. Paso 5 — Integración con USL e IEML

La Nomenclatura Viva trabaja en el nivel esencial, pero cada código esencial se traduce, sin intervención del usuario, a las capas de fondo:

- A una **coordenada USL** (nivel avanzado): la fórmula computable [D]_[P]_[A]_[E], construida con los códigos base documentados en §11. Por ejemplo, de forma ilustrativa, `BIBLIO-PROY-CATALOGO` podría traducirse a una coordenada del tipo `D-ARC.BIB_P-ORG_A-LID_E-BOR`. El archivo concreto añade fecha y versión sobre esa coordenada (por ejemplo, `…E-BOR_20260101_v1.pdf`), de modo que una clave corta se traduce sin ambigüedad a una dirección exacta.
- A una **capa IEML** (referencia semántica): el significado neutral al idioma, tratado como antecedente conceptual (§8). En este sistema, IEML opera como capa semántica de fondo, neutral al idioma, pero no determina la arquitectura de la Nomenclatura Viva.

El usuario cotidiano **no realiza esta traducción**: la ejecuta el sistema. La integración con USL es la garantía de rigor computable que sostiene, por debajo, la legibilidad de la superficie; la capa IEML permanece como referente conceptual en el fondo.

## 22. Paso 6 — Operación cotidiana

En el uso diario, una persona puede hacer cuatro cosas con la Nomenclatura Viva **sin conocer USL ni IEML**:

1. **Nombrar** un trabajo, respondiendo las tres preguntas del paso 2.
2. **Encontrarlo**, buscando por su código corto o por su área y categoría.
3. **Seguir su estado**, leyendo el semáforo de su ficha.
4. **Entender su trazabilidad**, viendo de dónde viene y a dónde va.

Toda la complejidad de fondo permanece invisible para esta operación. Esa invisibilidad no es un accidente: es el objetivo de diseño del sistema.

---

# Parte VI — Instrumentos operativos

## 23. Las ocho categorías (vocabulario común)

Las **ocho categorías** son el único acuerdo compartido en el centro del sistema: el vocabulario común a todas las áreas e instituciones. Cada categoría responde de dónde viene un trabajo y a dónde va:

| Categoría | Código | De dónde viene | A dónde va |
|-----------|--------|----------------|------------|
| Proyectos | **PROY** | Iniciativa propia o línea de trabajo | Plataforma, producto, metodología |
| Convenios | **CONV** | Necesidad de vinculación interinstitucional | Acuerdo firmado y vigente |
| Colaboraciones | **COLAB** | Redes, líneas de trabajo, contactos | Productos conjuntos, estancias, eventos |
| Producción | **PROD** | Resultados de un trabajo | Documento, informe o publicación |
| Divulgación | **DIVU** | Un producto ya listo para mostrar | Ponencia, evento, redes |
| Gestión académica | **ACAD** | Requerimiento normativo o curricular | Registro, materia, programa |
| Administración | **ADM** | Necesidad operativa interna | Plan, sitio, recurso gestionado |
| Apoyo a áreas | **APOYO** | Solicitud de otra área | Servicio o insumo entregado |

Estas categorías compartidas son lo que hace interoperables a las áreas y a las instituciones: son el "frasco único de sal" en el centro del sistema. Al ser un vocabulario cerrado y estable, no requieren aprobación caso por caso (§15).

## 24. La tabla de trazabilidad y el semáforo

Cada trabajo se documenta con la tabla de trazabilidad descrita en §19. El **estado** se representa con un semáforo de tres colores:

| Color | Estado | Significado |
|-------|--------|-------------|
| 🔴 Rojo | Por iniciar | El trabajo está registrado pero aún no comienza. |
| 🟡 Ámbar | En curso | El trabajo está en ejecución. |
| 🟢 Verde | Concluido | El trabajo terminó. |

Los renglones marcados con nota "por confirmar" esperan validación del área antes de fijarse.

## 25. Ejemplo didáctico de extremo a extremo

**Trabajo a nombrar (ejemplo genérico):** un catálogo elaborado por una biblioteca.

**Las tres preguntas, las tres piezas:**

1. ¿De qué área es? Pertenece a la Biblioteca → **BIBLIO**
2. ¿Qué tipo de acción es? Es un proyecto que se construye → **PROY**
3. ¿Cómo se llama en corto? Catálogo → **CATALOGO**

**Resultado:** `BIBLIO-PROY-CATALOGO`

**Su trazabilidad (ilustrativa):**

| Campo | Valor |
|-------|-------|
| **Código** | BIBLIO-PROY-CATALOGO |
| **Trabajo** | Catálogo de la biblioteca |
| **De dónde viene** | Necesidad interna de organización |
| **Acción** | Construir |
| **A dónde va** | Catálogo consultable |
| **Estado** | 🟡 En curso |
| **Puente al USL (ilustrativo)** | D-ARC.BIB_P-ORG_A-LID_E-ACT |

El archivo concreto añade fecha y versión sobre el USL, por ejemplo `…E-ACT_20260101_v1.pdf`. Así, una sola clave corta se traduce sin ambigüedad a la coordenada computable.

**El mismo trabajo, escalado:**

```
   PROY-CATALOGO                          ← cosa (uso interno)
   BIBLIO-PROY-CATALOGO                   ← área
   INST-BIBLIO-PROY-CATALOGO             ← institución
   RED-INST-BIBLIO-PROY-CATALOGO        ← región
```

## 26. Inventario ilustrativo con ejemplos genéricos

El nivel esencial puede aplicarse a cualquier conjunto de trabajos. La tabla siguiente muestra, con **ejemplos genéricos**, cómo se ve un inventario codificado: cada trabajo con su código, su trazabilidad mínima y su estado en semáforo. Los datos son didácticos, no corresponden a actividades reales.

| Código | Trabajo (genérico) | De dónde viene | Acción | A dónde va | Estado |
|--------|--------------------|----------------|--------|------------|--------|
| BIBLIO-PROY-CATALOGO | Catálogo de biblioteca | Necesidad interna | Construir | Catálogo consultable | 🟡 En curso |
| ADM-ACAD-MANUAL | Manual de procedimientos | Requerimiento normativo | Producir | Manual publicado | 🔴 Por iniciar |
| BIBLIO-PROD-INFORME | Informe anual | Resultados del área | Producir | Informe entregado | 🟢 Concluido |
| ADM-APOYO-SOPORTE | Soporte a otra área | Solicitud de otra área | Apoyar | Insumo entregado | 🟡 En curso |
| BIBLIO-DIVU-BOLETIN | Boletín de novedades | Producto listo | Difundir | Boletín publicado | 🟡 En curso |

La lectura de la tabla es inmediata: por el código se sabe de qué área es el trabajo (primer segmento), qué tipo de acción representa (categoría) y cómo se llama en corto (clave); por el semáforo se sabe en qué fase está. Este es todo el instrumento que necesita un usuario del nivel esencial.

---

# Parte VII — Prospectiva de escalabilidad por habilidad técnica

Esta parte responde a una pregunta central: **¿cómo puede una persona operar la Nomenclatura Viva según su nivel de habilidad técnica, sin perder claridad?** La respuesta es que el sistema se organiza en tres categorías estancas, cada una completa en sí misma. Nadie está obligado a subir de categoría: cada quien opera en la que su tarea requiere. Las explicaciones de cada categoría son independientes y no se mezclan.

La progresión completa va de lo más simple a lo más profundo —**nivel esencial → USL → IEML**— y puede iniciarse incluso con carpetas y archivos, antes de tocar cualquier nivel avanzado.

```
   CATEGORÍA A            CATEGORÍA B             CATEGORÍA C
   Mínima habilidad       Habilidad intermedia    Perfil especializado
   ─────────────          ─────────────           ─────────────
   Nivel esencial         Nivel USL               Capa IEML
   código corto           coordenada              referencia semántica
   HUMANO–HUMANO          HUMANO–MÁQUINA          HUMANO–HUMANO–MÁQUINA
```

## 27. Categoría A · Mínima habilidad técnica — Nivel esencial (humano–humano)

**Para quién.** Cualquier persona del área, sin conocimientos técnicos. Es la puerta de entrada del sistema y donde operará la inmensa mayoría de la comunidad.

**Qué dimensión resuelve.** La relación **humano–humano**: que dos personas nombren igual la misma cosa y se entiendan.

**Cómo empezar, incluso con carpetas y archivos.** No hace falta ninguna herramienta especial para comenzar. Una persona puede aplicar la Nomenclatura Viva el primer día con solo carpetas y archivos: basta con nombrar cada archivo o carpeta con el código corto. Por ejemplo, guardar un documento como `BIBLIO-PROY-CATALOGO` o crear una carpeta `ADM-ACAD-MANUAL`. Desde ese momento, el material queda ordenado bajo la lógica común, sin haber tocado USL ni IEML.

**Qué necesita saber.** Solo el código corto y las tres preguntas:

1. ¿De qué área es? → ÁREA
2. ¿Qué tipo de acción es? → CATEGORÍA
3. ¿Cómo se llama en corto? → CLAVE

**Cómo crece de forma natural.** La persona no memoriza un catálogo: aprende una sola estructura (ÁREA-CATEGORÍA-CLAVE) y ocho categorías que se reconocen por sentido común. Cada trabajo nuevo se nombra con las mismas tres preguntas. El aprendizaje es acumulativo y ligero: nombrar el segundo trabajo es más fácil que el primero, y así sucesivamente.

**Qué NO necesita hacer.** No necesita conocer la coordenada USL, ni el IEML, ni la tabla de anidamiento, ni las reglas de gobernanza. Todo eso opera por debajo, en silencio.

**Ejemplo de esta categoría.** Se registra un nuevo boletín de divulgación. La persona responde: es de la Biblioteca (ÁREA), es divulgación (DIVU), se llama en corto "boletín" (CLAVE). Resultado: `BIBLIO-DIVU-BOLETIN`. Listo. No tocó nada más.

## 28. Categoría B · Habilidad técnica intermedia — Nivel USL (humano–máquina)

**Para quién.** Personas con habilidad técnica intermedia que necesitan que la máquina procese, busque y relacione los trabajos: quien administra un repositorio, quien construye búsquedas, quien conecta áreas.

**Qué dimensión resuelve.** La relación **humano–máquina**: que una persona trabaje con la coordenada exacta que la máquina entiende.

**Qué necesita saber.** La fórmula del fondo, **[D]_[P]_[A]_[E]** (Dominio, Proceso, Actor, Estado), y cómo un código esencial se traduce a esa coordenada. Por ejemplo, `BIBLIO-PROY-CATALOGO` se corresponde con una coordenada del tipo `D-ARC.BIB_P-ORG_A-LID_E-ACT`. A ese nivel, el trabajo se vuelve computable: se puede filtrar por dominio, ordenar por estado o cruzar por actor.

**Cómo crece de forma natural.** Esta categoría se apoya en la anterior sin repetirla: la persona ya sabe leer el código corto; ahora aprende a **traducirlo** a la coordenada. El puente al USL de cada ficha de trazabilidad (§19) es exactamente el material de aprendizaje. No se memoriza: se consulta.

**Qué NO necesita hacer.** No necesita descender a la capa IEML. Opera sobre coordenadas construidas con los códigos base fijos, siguiendo las reglas de anidamiento, sin depender de la aprobación de nadie.

**Ejemplo de esta categoría.** Para saber cuántos trabajos "en desarrollo activo" existen en un dominio, la persona no lee toda la lista de nombres: filtra por la coordenada de fondo (por ejemplo, `D-ARC…E-ACT`) y obtiene la respuesta exacta.

## 29. Categoría C · Perfil especializado — Capa IEML (humano–humano–máquina)

**Para quién.** Un perfil especializado que interviene de forma **periódica** para comprender y sostener la interoperabilidad del sistema cuando este se federa entre instituciones e idiomas. No es un validador permanente ni un rol adicional: es un nivel de comprensión avanzada, que dentro de los roles existentes ejerce el Investigador del Conocimiento en momentos de integración.

**Qué dimensión resuelve.** La relación **humano–humano–máquina**: que muchas personas, de áreas, instituciones e idiomas distintos, más las máquinas, apunten al mismo nodo.

**Qué necesita saber.** La capa **IEML** como referencia semántica neutral al idioma, tratada aquí como antecedente conceptual (§8). El IEML es un lenguaje artificial creado por Pierre Lévy cuyo propósito es que las computadoras procesen el significado semántico de datos distribuidos en internet, centrado en la relación humano–máquina lingüística. En este sistema, IEML opera como capa semántica de fondo, neutral al idioma, pero no determina la arquitectura de la Nomenclatura Viva. Su función conceptual es ayudar a comprender cómo un mismo concepto puede leerse como el mismo nodo en distintos idiomas.

**Cómo crece de forma natural.** Esta categoría es la más profunda y la menos poblada: casi nadie la necesita. Se apoya en las dos anteriores (código corto legible arriba, coordenada computable en medio) y añade, como telón de fondo conceptual, la idea de significado neutral. El crecimiento aquí no es de volumen de usuarios, sino de **alcance del sistema**: cada institución que se federa amplía el alcance sin reescribir lo existente.

**Qué NO necesita hacer nadie más.** Ninguna de las categorías anteriores necesita ocuparse de esta capa. El IEML permanece silencioso para todos, y como antecedente conceptual no interviene en la operación cotidiana.

## 30. Cómo se sube de nivel sin romper nada

Las tres categorías se articulan sin fricción porque comparten el mismo código en la superficie y la misma estructura en el fondo. La escalada entre ellas obedece a cuatro garantías, todas basadas en reglas y no en vigilancia:

- **Registros controlados por reglas.** Las áreas, instituciones y regiones se incorporan anidándose bajo un código padre existente según una regla fija de anidamiento; no se inventan estructuras de raíz nuevas.
- **Categorías compartidas.** Las ocho categorías son el único acuerdo necesario en el centro; son lo que hace interoperables a áreas e instituciones, y son estables por diseño.
- **Referencia neutral al idioma.** La capa IEML, como antecedente conceptual, ayuda a que un mismo concepto se lea como el mismo nodo en cualquier lengua.
- **Autonomía local preservada.** Cada institución conserva sus áreas y sus claves; nadie impone su identidad sobre las demás.

El resultado es que una persona puede empezar en la Categoría A con conocimientos mínimos —incluso solo con carpetas y archivos— y operar el sistema completo sin perder claridad, mientras el sistema —por debajo— mantiene el rigor de las Categorías B y C de forma auto-sostenida, sin exigir supervisión continua (§15).

---

# Parte VIII — Ética y gobernanza

## 31. No anonimización: el nombre honra la autoría

En la Nomenclatura Viva, **la información no se anonimiza**: los nombres de las personas se muestran, tanto en los reportes individuales como en los reportes cruzados. Esta decisión es deliberada y tiene un fundamento: el sistema reconoce el saber de cada persona, y ese reconocimiento sería imposible si se ocultara quién lo aporta. Mostrar el nombre es una forma de honrar la autoría del conocimiento y de convertirlo en patrimonio atribuible.

## 32. No es auditoría ni evaluación de desempeño

La ética del sistema no descansa en ocultar identidades, sino en el **uso responsable** de la información. Se sostiene sobre tres compromisos:

- **No es una auditoría.** El sistema no fiscaliza ni busca faltas; ordena y da trazabilidad al saber que ya existe.
- **No evalúa el desempeño.** La información no se utiliza para evaluar, medir ni calificar a las personas. Ningún dato del sistema alimenta un juicio sobre el rendimiento individual.
- **Se usa solo para mejorar.** La información sirve exclusivamente para la mejora del área, la comprensión de sus procesos y la toma de decisiones informadas. Ese es su único destino legítimo.

Mostrar los nombres exige, a cambio, un trato cuidadoso: proteger el conocimiento significa también proteger a quien lo posee. Un hallazgo se enuncia siempre como fortaleza del área o como oportunidad de mejora, nunca como señalamiento personal.

## 33. Las cinco reglas de oro y la protección del conocimiento

La gobernanza del núcleo se rige por cinco reglas inquebrantables. Son **reglas explícitas**, precisamente para que el sistema se mantenga coherente sin depender de un validador humano constante (§15):

1. **Núcleo inmutable.** Nunca se inventan dominios, procesos, actores o estados nuevos; toda actividad inédita se anida como sufijo bajo el código padre más cercano.
2. **Límite de dos puntos.** La ramificación llega a un máximo de dos niveles; no existen sub-anidaciones más profundas.
3. **Restricción visual (40 caracteres).** Los alias amigables se mantienen cortos y legibles, para pantallas limpias.
4. **Prohibición de duplicación física.** Ningún área copia el archivo de otra; se genera un puente de lectura y el archivo permanece único.
5. **Control por reglas, no por vigilancia.** El crecimiento del sistema no depende de que una persona apruebe cada extensión: las novedades se anidan siguiendo las reglas anteriores y provienen del trabajo real capturado por el Mapa Vivo (§4.1). La intervención humana especializada es periódica —en momentos de integración— y no una supervisión continua.

Estas reglas son las que permiten que el sistema escale sin romperse (§30) y que la protección del conocimiento —respeto, claridad de intención y uso responsable— se sostenga en la práctica.

---

# Parte IX — Cierre

## 34. Conclusiones y recomendaciones de uso

La Nomenclatura Viva convierte una necesidad cotidiana —nombrar las cosas para entenderse— en un sistema de clasificación, trazabilidad y escalabilidad que las personas pueden usar sin conocimientos técnicos y que la máquina puede procesar sin ambigüedad. Su resultado es una memoria donde cada trabajo es localizable, trazable y comparable, sin fragmentación en silos.

Recomendaciones para su aplicación:

1. **Empezar por el nivel esencial.** La adopción comienza con el código corto y las tres preguntas, incluso solo con carpetas y archivos. Todo lo demás opera por debajo; no hace falta enseñarlo para empezar a usar el sistema.
2. **Respetar la separación con el Mapa Vivo.** La Nomenclatura Viva estructura insumos ya trabajados; no entrevista, no construye el *Ba* ni captura conocimiento. Mezclar ambos procesos degrada los dos.
3. **Tratar el IEML como antecedente conceptual, no como requisito.** El significado neutral al idioma es un referente de fondo, no una capa que el usuario deba aprender ni que determine la arquitectura.
4. **Mantener las ocho categorías como acuerdo central.** Son el único vocabulario que todas las áreas deben compartir; conservarlas estables es lo que hace posible la interoperabilidad.
5. **Confiar en el auto-mantenimiento.** El crecimiento se sostiene por reglas explícitas y por la retroalimentación del Mapa Vivo, no por un validador que vigile cada entrada. El sistema debe seguir operativo y coherente aun cuando nadie lo esté revisando.
6. **Adoptar poco a poco.** El sistema empieza con lo que cada área ya hace y crece sin romper nada. La escalabilidad es una propiedad del diseño, no una meta que haya que forzar.

## 35. Glosario

| Término | Definición |
|---------|------------|
| **Nomenclatura Viva** | Sistema de clasificación, trazabilidad y escalabilidad documental basado en un código corto legible sostenido por una estructura común inmutable. |
| **Mapa Vivo** | Proceso previo y separado que captura, depura y actualiza el conocimiento tácito de un área. Entrega insumos a la Nomenclatura Viva, pero no forma parte de ella. |
| **Nivel esencial** | El código corto ÁREA-CATEGORÍA-CLAVE; la cara operativa del sistema. Corresponde al tier "Alias Medio". |
| **USL** | Nivel avanzado: la coordenada computable de fondo, con la fórmula inmutable [D]_[P]_[A]_[E]. |
| **IEML** | *Information Economy MetaLanguage.* Lenguaje artificial creado por Pierre Lévy para que las computadoras procesen el significado semántico de datos distribuidos en internet; se centra en la relación humano–máquina lingüística. En este manual aparece únicamente como antecedente conceptual y técnico; no es la base estructural ni determina la arquitectura de la Nomenclatura Viva. |
| **DPAE** | Las cuatro coordenadas del núcleo USL: Dominio, Proceso, Actor, Estado. |
| **Doble interfaz** | Articulación entre una superficie de alias amigables (para personas) y un fondo de coordenadas exactas (para la máquina), vinculadas de forma biunívoca. |
| **Frasco único de sal** | Metáfora de la referencia única compartida: un mismo dato, un mismo nodo, por más nombres que reciba. |
| **Puente de lectura** | Mecanismo por el que dos áreas ven el mismo archivo con nombres distintos, sin duplicarlo. |
| **Semáforo** | Representación del estado de un trabajo: rojo (por iniciar), ámbar (en curso), verde (concluido). |
| **Auto-mantenimiento** | Propiedad del sistema de conservarse operativo y coherente mediante reglas explícitas y la retroalimentación del Mapa Vivo, sin supervisión humana continua. |
| **Ingeniero del Conocimiento** | Actor estratégico: líder del área, con visión global; facilita el acceso y valida la pertinencia. |
| **Investigador del Conocimiento** | Único rol metodológico formal de la Nomenclatura Viva; conduce el análisis y la estructuración. Interviene de forma periódica. |
| **Actores del área** | Personas que operan los procesos cotidianos; su saber entra a la Nomenclatura vía Mapa Vivo. |
| **Escalabilidad hacia afuera** | Regla por la que el código gana un prefijo al cruzar una frontera, sin que el núcleo cambie. |
| **_Ba_** | Espacio humano de confianza propio del Mapa Vivo. En la Nomenclatura Viva solo se menciona como antecedente humano que mejora la calidad de los insumos; no se opera dentro de ella. |

## 36. Corpus documental de origen y referencias

Este manual consolida y reorganiza la documentación de la Nomenclatura Viva, entre ella: el documento unificado de la nomenclatura (demostración de escalabilidad y clasificación de trabajos), el reporte integral del sistema de conocimiento, el manual de gestión documental (núcleo USL, doble interfaz y reglas de gobernanza) y las guías de implementación de la nomenclatura. El material del Mapa Vivo se consultó únicamente para delimitar con precisión la frontera entre ambos procesos.

**Referencia conceptual del antecedente técnico (IEML):**

- Lévy, Pierre. *IEML: Information Economy MetaLanguage.* Proyecto de semántica computacional para la web.

---

*Documento metodológico elaborado a partir de la documentación del CIITE — Centro de Investigación en Innovación y Tecnología Educativa. 2026.*
