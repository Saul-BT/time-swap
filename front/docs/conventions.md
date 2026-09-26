# Front conventions

Companion to [`../AGENTS.md`](../AGENTS.md). Decisions with a real trade-off are ADRs in [`../../docs/adr/`](../../docs/adr/README.md); this file is the how.

## Layout

```
src/
  app/
    (site)/[lang]/        localized site; root layout + pages
    (brand-book)/brand-book/   design-system reference, outside the locale, English only
    globals.css           html/body resets only; everything else is theme
  components/
    ui/        presentational primitives, no data, no domain (Ribbon, Eyebrow, TabularFigure…)
    layout/    page chrome and providers (SiteHeader, Section, AppProviders…)
    landing/   sections of the landing; read data + dictionary
    chat/      listing chat (inbox + thread)
    brand-book/  components used only by /brand-book
  data/      content structure (ids, order) and sample content — see its README
  i18n/      locales, dictionaries, server-only loader
  lib/       generic helpers by topic: color/, i18n/, mui/
  theme/     tokens.ts (values), rules.ts (style fragments), fonts.ts, index.ts (createTheme)
  proxy.ts   locale redirect (Next 16 name for middleware)
```

Dependency direction: `app → components → {data, i18n, lib, theme}`. `data`, `theme`, `i18n` and `lib` never import from `components`. `ui/` never imports from `landing/` or `data/`.

## Component anatomy

One folder per component, four files, nothing else:

```
Ribbon/
  index.ts          barrel: default export + public types + <name>Classes
  Ribbon.tsx        the component (server unless it needs state/events)
  Ribbon.style.ts   "use client"; styled slots only
  Ribbon.util.ts    no directive; class map + pure helpers + local types
```

- **Styled slots** use `styled(el, { name, slot })`. `name` is the component's export name; `slot` is what the piece *is* (`Root`, `Body`, `Footer`). Variable = name + slot (`ListingCardFooter`). Style the intrinsic tag (`styled("ul")`) unless the MUI component earns its weight (`Paper` for the rule, `Stack` for gap).
- **Variants** travel in an `ownerState` prop, never in loose boolean props (`ownerState={{ compact }}`).
- **Class names** come from `createComponentClasses(name, slots)` in `src/lib/mui/componentClasses.ts` and are set with `className={xClasses.slot}`. Declared in `.util.ts`, **never** in `.style.ts` (see Traps). Remove a class entry when its slot goes.
- **`component` prop** on a styled MUI slot needs `<WithComponent>` from `src/lib/mui/polymorphic.ts`; `styled()` drops it otherwise.
- **Alias a MUI import as `MuiX`** only when the local slot name would collide (`import MuiChip …; export const Chip = styled(MuiChip)`). No prefix on our own class names: MUI owns `Mui*`, nothing collides.
- Three or more style props → a styled slot, not `sx`. `sx` is for one-off layout from a server component and must be a **plain object** (see Traps).
- Public prop types are named `<Component>Props` and exported from the barrel.
- **No empty styled slots.** A slot with no styles is a plain tag with `className={xClasses.slot}`; `styled()` is for styles, not for naming.
- **Links go through `next/link`.** The theme sets `LinkBehavior` (`src/lib/mui/LinkBehavior.tsx`) as `MuiLink`'s component and `MuiButtonBase`'s `LinkComponent`, so `<Link href>` and `<Button href>` already render one. A custom link slot is `styled(NextLink)`, never `styled("a")`.
- Lists stay real lists (`ul`/`li`, `dl`/`dt`/`dd`, `blockquote`, `figure`) with an accessible name. Decorative elements get `aria-hidden`.

## Theme and design system

- Five rules that do not bend (`../../docs/sistema-de-diseno.md`): one accent; radius 0; 2 px rule and no shadows; the brake only marks something stopped or under review; tabular figures for any number compared vertically (`TabularFigure`).
- Read values through the theme: `theme.palette.*`, `theme.spacing(space.md)`, `theme.system.*`, helpers in `src/theme/rules.ts`. A hex literal outside `tokens.ts` is a defect.
- Spacing multipliers are `space.xs…xl` (1, 2, 4, 7, 12). Half steps like `space.sm + 1` are allowed when the system spec says so.
- Type scale is data in `tokens.ts` (`typeScale`), consumed by `createTheme` and by the brand book. Headlines use line height 1.06, not the spec's 0.98 (ADR 0008).
- Status colours (`error`, `warning`, `info`, `success`) are decided in ADR 0008. `info` is ink on purpose.
- Anything new in the system (a variant, a token, a component) is added to `/brand-book` in the same change.

## i18n

- Routes live under `/[lang]`; `proxy.ts` redirects bare paths using the `NEXT_LOCALE` cookie, then `Accept-Language`. `/brand-book` is excluded.
- `es.json` is the source of truth; `en.json` must have the same shape or the build fails. Keys are camelCase, nested by screen section (`hero.search.submit`).
- Server components call `getDictionary()` / `getLocale()` from `src/i18n/dictionary.ts`. Both read the root param with `next/root-params`; no locale prop drilling.
- Variables inside copy use `{name}` and `interpolate()`. Punctuation and separators (`·`) are code, not copy.
- Sample/user-written content (`src/data/listings.ts`, `members.ts`) is **not** translated; ids that map to copy (`categories`, `filters`, `nav`) are typed from the dictionary so an untranslated id fails the build.
- Client components must not import `src/i18n/dictionary.ts`. Import only the `Dictionary` type from `src/i18n/types.ts` if a shape is needed.

## Comments

- Default: none. The name and the types are the documentation.
- Keep a comment only for what the code cannot show: a domain rule, a non-obvious why, a trap, a deviation from the design system.
- Self-contained: describes the thing it sits on. Never "used by X", "see HomePage", "the only one on the page" — those rot silently.
- One or two lines, plain and imperative. Examples in JSDoc `@example`, not prose.
- No commentary on the change itself ("refactored", "now we"); that belongs in the commit or the PR.
- English.

## Tooling

- **bun** only. `bun.lock` is the lockfile; do not add `package-lock.json` or `pnpm-lock.yaml`.
- Biome: `bun run lint` (check) and `bun run format`. Rules are `recommended` + `next` + `react` domains; imports auto-organised.
- TypeScript `strict`, `target: ES2022`; `@/` maps to `src/`. Type-check with `bun run typecheck`. The target only affects type-checking; the emitted JavaScript is decided by Next's compiler and browserslist, not by tsconfig.
- React Compiler is on (`reactCompiler: true`): do not add manual `memo`/`useCallback` unless the profiler proves a need.
- No `server-only` package: server-only modules import `next/root-params`, which fails to build in a client module.

## Testing

No runner installed. Decision pending: the candidate is Vitest + Testing Library with tests colocated in `__tests__/`. Until then, verification is lint + tsc + `bun run build` + a manual pass on `/es`, `/en` and `/brand-book`.

## Traps already paid for

- **Plain objects exported from a `"use client"` module become client references.** A server component reading `.root` off one gets `undefined`, silently. Hence class maps and tokens read on the server live in `.util.ts` / `tokens.ts`, never in `.style.ts` or `theme/index.ts`.
- **`sx={(theme) => …}` cannot cross from a server component into a MUI (client) component**: "Functions cannot be passed directly to Client Components". Use plain objects with palette paths (`"text.primary"`) or a styled slot.
- **`modularCssLayers` inverts precedence**: with it on, a `styled` slot with `name`+`slot` lands in `mui.components` and the theme's `styleOverrides` in `mui.theme`, which is declared later and wins. Keep it off; `enableCssLayer` on the cache provider is enough.
- **`Typography color="text.secondary"` does nothing in MUI 9.** The prop wants `"textSecondary"`.
- **Uppercase Spanish headlines clip at line height 0.98** (ÁYUDA, PEQUEÑA). 1.06 is the floor.
- **MUI 9 needs `@emotion/react` and `@emotion/styled` installed** even though they are listed as optional peers: `@mui/styled-engine` requires them at runtime.
- **Pigment CSS is not an option** while the app builds with Turbopack: its Next plugin is webpack-only and the project is on hold. Emotion + `styled()` is the decision (ADR 0009).
- **`next dev` rewrites the block at the end of `AGENTS.md`.** Leave it; commit it with the rest.
- **Two root layouts** (`(site)/[lang]` and `(brand-book)`) each load `globals.css` and `AppProviders`. Fonts are declared once in `theme/fonts.ts` for that reason.
