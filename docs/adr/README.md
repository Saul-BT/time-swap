# Architecture Decision Records

Los ADRs registran decisiones duraderas, su contexto y sus consecuencias. No son un roadmap ni una lista de tareas.

| ADR | Ámbito | Decisión | Estado |
|---|---|---|---|
| [0001](0001-modelo-hibrido-de-intercambio.md) | producto | Modelo híbrido con elección exclusiva por acuerdo | Aceptado |
| [0002](0002-contabilidad-de-creditos-de-tiempo.md) | producto | Una hora, un crédito y débito limitado | Aceptado |
| [0003](0003-consentimiento-antes-del-chat.md) | producto | Consentimiento antes de habilitar conversación | Aceptado |
| [0004](0004-privacidad-de-ubicacion.md) | producto | Ubicación aproximada y revelación progresiva | Aceptado |
| [0005](0005-reputacion-verificada.md) | producto | Reputación derivada de intercambios completados | Aceptado |
| [0006](0006-adultos-y-seguridad-en-el-mvp.md) | producto | MVP limitado a adultos con moderación estructural | Aceptado |
| [0007](0007-gastos-fuera-de-la-compensacion.md) | producto | Gastos reales separados de la compensación | Aceptado |
| [0008](0008-paleta-de-estados-y-desviaciones-del-tema.md) | front | Paleta de estados de MUI y desviaciones del sistema Relevo | Aceptado |
| [0009](0009-stack-del-front.md) | front | Next 16 App Router, MUI 9 sobre Emotion, Biome y bun | Aceptado |
| [0010](0010-i18n-por-ruta-con-diccionarios-en-servidor.md) | front | i18n por segmento de ruta con diccionarios solo en servidor | Aceptado |
| [0011](0011-slugs-publicos-por-idioma.md) | front | Slugs públicos por idioma sobre carpetas en inglés | Aceptado |
| [0012](0012-guardado-por-apartado.md) | front | Guardado por apartado en la gestión del perfil | Aceptado |
| [0013](0013-momentos-de-revelacion.md) | producto | Cuatro momentos de revelación por dato del perfil | Aceptado |
| [0015](0015-chrome-de-ajustes-en-el-layout.md) | front | Chrome de ajustes en el layout y navegación que se marca sola | Aceptado |

## Cuándo escribir un ADR

Cuando se cumplen las tres: es costoso de revertir, sorprendería sin contexto, y hubo una alternativa real que se descartó con motivo. Una convención de código no es un ADR: va en `front/docs/conventions.md`.

## Convención

`NNNN-titulo-en-kebab.md`, numeración única para todo el repositorio, columna **Ámbito** (`producto`, `front`, `back`). Cada ADR contiene:

- Estado, fecha y ámbito.
- Contexto.
- Decisión.
- Consecuencias positivas.
- Costes y riesgos.
- Alternativas consideradas.

Una decisión aceptada puede sustituirse mediante un nuevo ADR, pero no se reescribe retroactivamente para ocultar el contexto original.
