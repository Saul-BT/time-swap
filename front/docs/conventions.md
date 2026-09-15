# Front conventions

Companion to [`../AGENTS.md`](../AGENTS.md). Decisions with a real trade-off are ADRs in [`../../docs/adr/`](../../docs/adr/README.md); this file is the how.

## Layout

```
src/
  app/
    (site)/[lang]/        localized site; root layout + pages
    (site)/[lang]/sign-in/  sign-in route; `actions.ts` holds its server action
    (site)/[lang]/recover/  access recovery, placeholder until the flow is designed
    (site)/[lang]/settings/   `layout.tsx` holds the chrome shared by the six settings routes
    (site)/[lang]/settings/profile/*  one route per profile section; each holds its `actions.ts` and `loading.tsx`
    (site)/[lang]/settings/privacy/   fifth section, same shell
    (site)/[lang]/members/[id]/       public member profile, filtered by reveal moment
    (brand-book)/brand-book/   design-system reference, outside the locale, English only
    globals.css           html/body resets only; everything else is theme
  components/
    ui/        presentational primitives, no data, no domain (Ribbon, Eyebrow, TabularFigure…)
    layout/    page chrome and providers (SiteHeader, Section, AppProviders…)
    landing/   sections of the landing; read data + dictionary
    sign-in/   the sign-in screen: form, editorial panel, split layout
    settings/  section forms and their controls (WeekGrid, RevealLadder, VisibilityMatrix…)
    member/    the public profile
    brand-book/  components used only by /brand-book
  data/      content structure (ids, order) and sample content — see its README
  i18n/      locales, dictionaries, server-only loader
  lib/       generic helpers by topic: api/, color/, forms/, i18n/, mui/, observability/, profile/, settings/
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
- **MUI class names are imported, never typed.** Target MUI slots and states through the `xClasses` object each component exports (`outlinedInputClasses.notchedOutline`, `formLabelClasses.focused`); global state classes such as `Mui-focusVisible` come from `buttonBaseClasses`. A literal `"Mui-…"` or `".MuiX-…"` string is a defect.
- **Alias a MUI import as `MuiX`** only when the local slot name would collide (`import MuiChip …; export const Chip = styled(MuiChip)`). No prefix on our own class names: MUI owns `Mui*`, nothing collides.
- Three or more style props → a styled slot, not `sx`. `sx` is for one-off layout from a server component and must be a **plain object** (see Traps).
- Public prop types are named `<Component>Props` and exported from the barrel.
- **No empty styled slots.** A slot with no styles is a plain tag with `className={xClasses.slot}`; `styled()` is for styles, not for naming.
- **Links go through `next/link`.** The theme sets `LinkBehavior` (`src/lib/mui/LinkBehavior.tsx`) as `MuiLink`'s component and `MuiButtonBase`'s `LinkComponent`, so `<Link href>` and `<Button href>` already render one. A custom link slot is `styled(NextLink)`, never `styled("a")`.
- Lists stay real lists (`ul`/`li`, `dl`/`dt`/`dd`, `blockquote`, `figure`) with an accessible name. Decorative elements get `aria-hidden`.
- **Icons are lucide through `ui/Icon`**: sizes come from `iconSize`, stroke 2, `aria-hidden` unless a `label` is given. No inline `<svg>`, no emoji.

## Settings chrome

- The masthead, account row, heading, meter and the rail + panel frame live in `settings/layout.tsx` (ADR 0015). A section page renders only its `PanelHeader` and its form; a `loading.tsx`, only its `PanelSkeleton`.
- **Active state is never a prop.** A nav row compares `usePathname()` with its own `href`. The arrangement — index vs open section — comes from `useSelectedLayoutSegments()` through `lib/settings/segment.ts`, which builds its table from `SECTION_ROUTE` and `ROUTES`.
- One markup, two arrangements picked by `detail`. The index lists the sections at every width; the rail and the panel only exist with a section open. What is left to the breakpoint is only what changes inside an arrangement, so the server sends the same HTML for every viewport.

## Data, loading and errors

- Server data goes through `lib/api/`. While the API does not exist (#5) the loaders there are mocked, but they keep the shape, the split and the timing the endpoints will have — integrating means replacing a body with a `fetch`.
- **A layout renders above its own `loading.tsx`.** Anything awaited directly in a layout blocks every navigation into it and no fallback is shown. Chrome that needs data (`CompletionSummary`, `SettingsNav`) fetches its own and hangs off a `<Suspense>` in the layout; section data is fetched by the page, where `loading.tsx` covers it.
- A mocked loader calls `connection()` before returning. Without it the route prerenders at build time, turns static and no skeleton is ever reachable.
- Every skeleton matches the real geometry (`SettingsNavSkeleton` reuses the row style, `CompletionSummarySkeleton` the ribbon height), so nothing shifts when the content arrives.
- Error boundaries, from the inside out: `SlotBoundary` degrades one piece of a layout (a meter without its ribbon, a navigation without its badges); `settings/error.tsx` replaces the panel and leaves the chrome usable; `[lang]/error.tsx` catches what escapes a layout; `app/global-error.tsx` is the last resort. A file-based `error.tsx` renders *below* its segment's layout, so it can never cover that layout's own failure — that is what `SlotBoundary` is for.
- A degraded slot keeps whatever needs no data. The navigation only asks the API for badges, so without it the links still render and the open section is still marked (that comes from the router, not the API). `error.tsx` is a Client Component by definition, so its copy arrives from `ErrorCopyProvider`, mounted by the server layout. The recovery prop is `retry()` in Next 16, not `reset()`.
- **`not-found.tsx` only works at `app/`** in this app: the root layout lives under `[lang]`, and an unmatched URL has no locale to match, so a nested one is never reached. That file is therefore self-contained and untranslated.
- `MOCK_API_LATENCY_MS` sets the mocked latency (`0` turns it off). It leaves with `lib/api/mock.ts`.

## Forms

- A section form is a client component driven by `useActionState` over the route's server action. The action returns a `PanelActionState` (`lib/forms/actionState.ts`): `saved`, `invalid` with field errors as dictionary ids, or `failed`. The action ends in `finishSave(formData)`, which is the mocked round trip; collected errors are typed with `FieldErrors<XActionState>`.
- That machinery is `usePanelForm` (`components/settings/usePanelForm.ts`): it owns the action state, the edited values and the dirty flag, and hands back `formProps`. A form adds only its fields, its `isDirty` and, when it has field errors, a `focusOrder` of `[field, element id]` pairs — the hook focuses the first one that failed, or the first control inside it.
- **The frame is `PanelForm`**, not each form: the `form` element, the failure notice, the fieldset that disables the fields while saving and the footer. A section renders its fields as children and sets `gap` when `space.md` is not the rhythm. Its props are `PanelSectionFormProps<Values, FieldId, ErrorId, Copy>` and its copy extends `PanelFormCopy`.
- The server page resolves every string the form shows and passes them as props (`copy`); error ids are typed from the dictionary (`keyof Dictionary["settings"]["zone"]["errors"]`) so the client maps id → copy without touching `dictionary.ts`. `getPanelContext(section)` in `lib/settings/panel.ts` resolves the dictionary, the locale, the profile, the chrome and the `titleId` in one call, and `lib/settings/metadata.ts` builds the `generateMetadata`.
- **The reveal moment is edited in the section that owns the data**, never twice. The matrix in Privacy is read only: it shows the whole policy and links each row to its section (`REVEAL_FIELD_SECTION`). The privacy action saves only the two global switches.
- Dirty tracking compares state with the last saved values and reports through `UnsavedChangesProvider`; links inside the shell go through `GuardedLink` (`Link.onNavigate`) so leaving a dirty section asks first. Only the open section is guarded (ADR 0012).
- Field texts hang off `FormField`'s `hint` and `error`; the control lists them in `aria-describedby` with `formFieldIds(htmlFor)`. A control that is not wrapped in a `FormField` renders `ui/FieldError` directly — the icon is part of it, so the colour is never the only signal.
- Catalogue pickers never accept free text (`freeSolo` is a defect). In development, a form can force the failed state by sending `__fail=1`.

## Theme and design system

- Five rules that do not bend (`../../docs/sistema-de-diseno.md`): one accent; radius 0; 2 px rule and no shadows; the brake only marks something stopped or under review; tabular figures for any number compared vertically (`TabularFigure`).
- Read values through the theme: `theme.palette.*`, `theme.spacing(space.md)`, `theme.system.*`, helpers in `src/theme/rules.ts`. A hex literal outside `tokens.ts` is a defect.
- Spacing multipliers are `space.xs…xl` (1, 2, 4, 7, 12). Half steps like `space.sm + 1` are allowed when the system spec says so.
- Type scale is data in `tokens.ts` (`typeScale`), consumed by `createTheme` and by the brand book. Headlines use line height 1.06, not the spec's 0.98 (ADR 0008).
- Status colours (`error`, `warning`, `info`, `success`) are decided in ADR 0008. `info` is ink on purpose. They are calibrated against the page background; over an ink surface ask for `tone="inverse"`, which reads `palette.onInk`.
- Anything new in the system (a variant, a token, a component) is added to `/brand-book` in the same change.

## i18n

- Routes live under `/[lang]`; `proxy.ts` redirects bare paths using the `NEXT_LOCALE` cookie, then `Accept-Language`. `/brand-book` is excluded.
- **Folders are the English slug; public slugs per locale live in `src/i18n/routes.ts`** (ADR 0011). A new page adds a folder and a `ROUTES` entry; `next.config.ts` and `proxy.ts` derive the rewrite and the redirect from it. Links never hard-code a path: `localizePath(locale, "signIn")`, or an anchor. Pages set `alternates` with `routeAlternates(id)`.
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
- **`OutlinedInput` inside `Autocomplete.renderInput` must receive `params.slotProps.htmlInput` through `inputProps` and its `ref` through `inputRef`.** `InputBase` only chains focus, blur and change from `inputProps`; put them in `slotProps.input` and the popup never opens, or crashes on highlight because the input ref stays null.
- **`Autocomplete` resets its input whenever `value` changes identity.** Derive the value array with `useMemo` (or keep it in state); a fresh array per render swallows every keystroke.
- **Functions cannot be passed from a server page to a client form** beyond the server action itself. Anything the client needs to compute (nearest zone, filters) is imported by the client component from `data/` or `lib/`.
- **`bun run typecheck` needs the route types Next generates**: run `bun run build` (or `next dev`) once after adding a route, or `PageProps<"/[lang]/…">` is unknown.
