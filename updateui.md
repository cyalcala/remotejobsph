# RemoteJobsPH — Complete UI Redesign Prompt

Paste everything below this line as a single prompt to your AI coding assistant.

---

Redesign the RemoteJobsPH job directory site completely from top to bottom. Do not change the underlying data, file structure, routing, or any server-side logic. Only change the UI. Apply every instruction below in full.

---

## 1. BROWSER TAB, META, AND FAVICON

Change the `<title>` tag to `RemoteJobsPH — Remote Jobs for Filipinos`. Change the meta description to `Browse 1000+ remote companies hiring Filipino talent. Filter by category, remote type, and more.` Add `og:title` and `og:description` matching the above. Replace the default favicon with an inline SVG favicon: the letters `RJ` in `font-weight: 700`, `fill: #3b5bdb`, on a `#fafafa` background, `32×32` viewBox, delivered via `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">`. Update the browser `<title>` tag dynamically: when filters are active show `Pinoy VA · RemoteJobsPH`, when searching show `"{query}" · RemoteJobsPH`, otherwise show the default title.

---

## 2. GLOBAL TYPOGRAPHY AND COLOR SYSTEM

Font stack: `Inter, -apple-system, BlinkMacSystemFont, sans-serif`. Base size `14px`, line height `1.5`. Import Inter from Google Fonts or use the system variable font. Never use more than three font sizes on any screen: `text-xl` (`20px`) for the hero count only, `text-sm` (`14px`) for all listing content and UI labels, `text-xs` (`12px`) for tags, badges, helper text, and footer. Font weights: `font-semibold` (`600`) for site name and hero, `font-medium` (`500`) for company names, `font-normal` (`400`) for everything else. No italics anywhere.

All color values must be stored as CSS custom properties — never hardcode hex values directly — so dark mode overrides work automatically:

```css
:root {
  --bg-page: #fafafa;
  --bg-surface: #ffffff;
  --bg-hover: #f9f9f9;
  --text-primary: #111111;
  --text-secondary: #999999;
  --text-placeholder: #bbbbbb;
  --border-structural: #ebebeb;
  --border-row: #f0f0f0;
  --bg-group-header: #f5f5f5;
  --skeleton-base: #eeeeee;
  --skeleton-highlight: #f5f5f5;
  --accent: #3b5bdb;
  --flash-highlight: #fffbe6;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-page: #111111;
    --bg-surface: #1a1a1a;
    --bg-hover: #222222;
    --text-primary: #eeeeee;
    --text-secondary: #888888;
    --text-placeholder: #555555;
    --border-structural: #2a2a2a;
    --border-row: #1e1e1e;
    --bg-group-header: #161616;
    --skeleton-base: #1e1e1e;
    --skeleton-highlight: #2a2a2a;
  }
}
```

Category tag colors (light mode; in dark mode reduce background opacity to 15%):
- Pinoy VA: `background #e8f0fe text #3b5bdb`
- Agency: `background #f3f0ff text #6741d9`
- Gig: `background #fff4e6 text #e67700`
- PH Freelancing: `background #fff9db text #e67700`
- Australia: `background #ebfbee text #2f9e44`
- USA: `background #fff0f6 text #c2255c`
- Remote type tags (all variants): `background #f1f3f5 text #555555`

No gradients, no box shadows except the back-to-top button (`box-shadow: 0 2px 8px rgba(0,0,0,0.15)`), no decorative imagery anywhere.

---

## 3. GLOBAL ANIMATION SYSTEM

Define these CSS custom properties globally and use them everywhere. Never deviate:

```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
}
```

Usage rules:
- Row hover background: `var(--duration-instant)` — feels snappy, no delay
- Row expand/collapse: `var(--duration-normal) var(--ease-decelerate)`
- Bottom sheet slide-up: `var(--duration-slow) var(--ease-decelerate)`
- Bottom sheet slide-down on close: `var(--duration-normal) var(--ease-accelerate)`
- Back-to-top fade in/out: `var(--duration-normal) var(--ease-standard)`
- Focus ring appearance: `var(--duration-instant)` — never animate focus rings
- Skeleton shimmer: `1.4s ease-in-out infinite` — exception to the system
- Alphabet flash highlight: `600ms ease-out` — intentionally slow for discoverability

Respect `prefers-reduced-motion` globally:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 4. DATA SANITIZATION — APPLY ON RENDER, NOT IN SOURCE FILES

Before rendering any company name or tag, apply in JavaScript at render time:

- Strip all leading/trailing quotation marks (`"`, `'`, `"`, `"`) from company names
- Trim all whitespace from both ends of names and descriptions
- Capitalize the first letter of every company name
- Normalize category tags: `agency` → `Agency`, `pinoyva`/`Pinoy VA`/`pinoy va` → `Pinoy VA`, `gig` → `Gig`, `ph freelancing`/`phfreelancing` → `PH Freelancing`, `australia` → `Australia`, `usa` → `USA`
- Normalize remote type tags: `fully remote`/`fullyremote` → `Fully Remote`, `hybrid` → `Hybrid`, `remote-friendly`/`remote friendly` → `Remote-Friendly`
- Where a company name appears more than once in the dataset, merge duplicates: show the company name once. In the expanded row state, show each duplicate's description as a `text-xs` secondary line indented `12px`, prefixed with `↳`. If both descriptions are identical, show only one.

---

## 5. URL STATE AND SHAREABILITY

Persist all active UI state into the URL query string so any filtered view can be bookmarked or shared:

- `?q=searchterm` — search input value
- `?category=pinoy-va,agency` — active category filters (comma-separated, lowercase-hyphenated)
- `?remote=fully-remote,hybrid` — active remote type filters
- `?sort=pinoy-va-first` — active sort option

On page load, read these parameters and initialize UI state from them before rendering. When any filter, search, or sort changes, update the URL using `history.replaceState` — no page reload, no scroll position disruption. When all filters are cleared and search is empty, remove all query parameters so the URL returns to the clean root path.

---

## 6. NAVIGATION

A slim sticky top nav, `56px` tall, `background: var(--bg-surface)`, `border-bottom: 1px solid var(--border-structural)`, `position: sticky`, `top: 0`, `z-index: 100`. The border spans full width; inner content constrained to `max-width: 1100px margin: 0 auto padding: 0 24px`. Use flexbox, `align-items: center`, `justify-content: space-between`.

Left side: `RemoteJobsPH` in `font-semibold text-sm var(--text-primary)`, followed by `·` separator in `#ddd mx-2`, followed by `Remote work for Filipinos` in `text-xs var(--text-secondary)`. Plain text, not links.

Right side: plain text link `Submit a company →` in `text-sm var(--text-secondary)`, no underline by default, underline + `color: var(--accent)` on hover.

On mobile (below `768px`): hide the tagline and submit link. Show only `RemoteJobsPH` on the left.

---

## 7. HERO BAR

Full-width bar directly below the nav, `72px` tall, `background: var(--bg-page)`, `border-bottom: 1px solid var(--border-structural)`. Inner content: `max-width: 1100px margin: 0 auto padding: 0 24px`, left-aligned, vertically centered.

Single line of text: `Browse {n} remote-friendly companies hiring Filipinos` — where `{n}` updates live as search and filters change. Style: `text-xl font-semibold var(--text-primary)`.

Remove the beach photo entirely and permanently. No subtitle, no illustration, no gradient, no decoration of any kind.

On mobile: reduce height to `56px`, font to `text-base`.

---

## 8. PAGE LAYOUT

Two-column layout below the hero: fixed `240px` left sidebar + fluid main content area. CSS grid: `grid-template-columns: 240px 1fr`, `gap: 32px`, `max-width: 1100px`, `margin: 0 auto`, `padding: 24px 24px 0 24px`.

On mobile (below `768px`): single column, `grid-template-columns: 1fr`. Hide the sidebar entirely.

---

## 9. FILTER SIDEBAR

`position: sticky`, `top: 56px`, `height: calc(100vh - 56px)`, `overflow-y: auto`. No background, no border, no shadow.

**Sidebar header:** `Filters` in `text-sm font-medium var(--text-primary)` left, inline badge `· {n} active` in `text-xs var(--accent)` when any filter is active. Below it: `Clear all` plain text link in `text-xs var(--text-secondary) underline cursor-pointer`, visible only when filters are active, resets all checkboxes and sort to default.

**Filter Group 1 — Category.** Header: `text-xs font-semibold uppercase tracking-widest var(--text-secondary) mb-3 mt-4`. Checkboxes: All Jobs (default), Pinoy VA, Agency, Gig, PH Freelancing, Australia, USA. Each row: `display: flex align-items: center gap: 8px`, `text-sm #333`, `padding: 5px 0`, `cursor: pointer`. Custom checkbox: `16px × 16px`, `border: 1.5px solid #ddd`, `border-radius: 3px`. Checked state: `background: var(--accent) border-color: var(--accent)` with white checkmark SVG.

**Filter Group 2 — Remote Type.** Same header style, `margin-top: 24px`. Checkboxes: Any Type (default), Fully Remote, Hybrid, Remote-Friendly.

**Next to each filter label**, show a live count: `(143)` in `text-xs #bbb ml-auto`. This shows how many results would exist if that filter were added to the current active set. Updates with the same `120ms` debounce as search.

**Filter logic:** OR within each group, AND between groups. Selecting Pinoy VA + Agency shows companies that are either. Selecting Pinoy VA + Fully Remote shows only Pinoy VA companies that are also Fully Remote.

---

## 10. MOBILE FILTER — BOTTOM SHEET

On mobile, hide sidebar. Show a pill button fixed at `bottom: 24px`, horizontally centered, `position: fixed`, `z-index: 200`. Style: `background: #111111 color: #ffffff text-sm font-medium padding: 10px 24px border-radius: 9999px box-shadow: 0 4px 16px rgba(0,0,0,0.2)`. Label: `Filters` — append ` · {n}` when filters are active.

Tapping slides up a bottom sheet: `position: fixed bottom: 0 left: 0 right: 0 background: var(--bg-surface) border-radius: 16px 16px 0 0 padding: 24px z-index: 300 max-height: 80vh overflow-y: auto`. Behind it: full-screen dark overlay `rgba(0,0,0,0.4)` that closes the sheet when tapped. Sheet contains same filter groups as desktop sidebar, a `Done` button at the bottom (`width: 100% background: #111 color: #fff padding: 12px border-radius: 8px text-sm font-semibold`), and `Clear all` above it. Add a drag handle at the top: `40px × 4px` rounded pill in `#ddd centered margin-bottom: 16px`.

**Swipe to close:** implement touch drag detection on the sheet. If user swipes down more than `80px`, close with slide-down animation. If less than `80px` and released, spring back to open. Apply `transform: translateY({dragDistance}px)` during drag — clamped to `0` minimum. Use `touchstart`, `touchmove`, `touchend`. Slide-up animation: `transform translateY(100%) → translateY(0)` over `var(--duration-slow) var(--ease-decelerate)`. Slide-down: `var(--duration-normal) var(--ease-accelerate)`.

**Focus trap:** while the bottom sheet is open, trap focus within it. Return focus to the filter button on close.

---

## 11. SEARCH BAR

Full-width input at the top of the main content column. Height `44px`, `border: 1px solid #e0e0e0`, `border-radius: 8px`, `background: var(--bg-surface)`, `padding: 0 16px 0 40px`. Search SVG icon (`16px color: #bbb`) at `left: 12px` vertically centered. On focus: `border-color: var(--accent)`, `box-shadow: 0 0 0 3px rgba(59,91,219,0.1)`.

Placeholder: `Search companies or roles...` in `var(--text-placeholder)`.

Inside the input on the far right, show a `/` hint badge: `text-xs #ddd font-mono border: 1px solid var(--border-structural) border-radius: 3px px-1`. Hide this hint once the user has used the shortcut or clicked search at least once (store in memory only, not localStorage).

Client-side real-time filtering as user types: match against both company name and description. Debounce at `120ms` maximum. No page reload, no API call.

Directly below search, `margin-top: 8px`: `Showing {n} of 1001 companies` in `text-xs var(--text-secondary)` left-aligned, updating live. When nothing is filtered: `Showing all 1001 companies`.

Search is the first tab stop after the nav. Do not auto-focus on page load.

**Keyboard shortcut:** pressing `/` anywhere on the page when focus is not already in a text input moves focus to the search bar and selects existing text.

---

## 12. SORT CONTROL

On the same flex row as the result count, right-aligned. Label `Sort by` in `text-xs var(--text-secondary) mr-1` followed by a minimal `<select>`: no border, no background, `text-xs var(--text-secondary)`, `cursor: pointer`, `font-family: inherit`. Options: `Alphabetical` (default), `Pinoy VA First`, `Agency First`, `Gig First`, `PH Freelancing First`, `Australia First`, `USA First`. Sorting re-orders the currently visible filtered list instantly, client-side.

---

## 13. ALPHABET INDEX BAR

Below the search + sort row, `margin-top: 12px margin-bottom: 4px`. Horizontal strip of `#` + A–Z anchor links. Each: `28px × 28px`, `display: inline-flex align-items: center justify-content: center`, `text-xs font-mono`, `border-radius: 4px`. Active letter (at least one visible company starts with it): `color: #555`, hover `background: #f0f0f0 color: #111`. Inactive letter: `color: #dddddd cursor: default`, non-clickable.

Clicking an active letter smooth-scrolls to the first company starting with that letter, then briefly flashes that row's background to `var(--flash-highlight)` fading back over `600ms`.

Recalculate active letters every time search or filters change (batched with the `120ms` debounce). On mobile: horizontally scrollable with `overflow-x: auto scrollbar-width: none padding-bottom: 4px`.

---

## 14. LETTER GROUP HEADERS

Inside the listing rows, when the first letter of the current company name differs from the previous, insert a non-interactive group header row. Style: full-width, `32px` tall, `background: var(--bg-group-header)`, `border-bottom: 1px solid var(--border-structural)`, `border-top: 1px solid var(--border-structural)`, the letter in `text-xs font-semibold uppercase tracking-widest var(--text-secondary) px-3 leading-[32px]`. Not hoverable, not clickable, not focusable. Companies beginning with a number use `#` as group header.

---

## 15. COMPANY INITIAL AVATARS

At the far left of every row, before the company name, add a `32px × 32px` avatar circle. Generate from company name: first letter of first word (or first letters of first two words if multi-word, max 2 characters). Background color: deterministically derived from the company name string using a simple hash mapped to one of these 8 muted pastels: `#e8f0fe`, `#f3f0ff`, `#fff4e6`, `#ebfbee`, `#fff0f6`, `#e0f7fa`, `#fce4ec`, `#f3e5f5`. Letter in `text-xs font-semibold` in a darker shade of the same hue. `flex-shrink: 0`, `border-radius: 50%`, `margin-right: 12px`. On mobile: `24px × 24px`.

---

## 16. LISTINGS

Remove the `## Latest Opportunities` heading, the standalone `1001 results` text, and all redundant copy between filters and listing rows.

**Virtual scrolling:** only render rows currently in the viewport plus a buffer of `20` rows above and below. Recalculate on scroll, filter change, and sort change.

Each company row:
- Full width of the content column
- `min-height: 48px`, `padding: 0 12px`
- `border-bottom: 1px solid var(--border-row)`
- Entire row is an `<a>` or `<div role="button" tabindex="0">`, `cursor: pointer`
- On hover: `background: var(--bg-hover)`, `var(--duration-instant)`
- On keyboard focus: `outline: 2px solid var(--accent) outline-offset: -2px`
- Four-column flex layout:
  - **Avatar** `flex: 0 0 32px margin-right: 12px`: avatar circle as described above
  - **Left** `flex: 0 0 220px` (mobile: `140px`): company name `text-sm font-medium var(--text-primary)`, single line, `overflow: hidden text-overflow: ellipsis white-space: nowrap`
  - **Center** `flex: 1 padding: 0 24px` (mobile: `display: none`): description truncated to 60 chars, `text-sm var(--text-secondary)`, `text-overflow: ellipsis white-space: nowrap overflow: hidden`
  - **Right** `flex: 0 0 auto gap: 8px align-items: center display: flex`: category tag + remote type tag + `→` arrow
- Tags: `text-xs padding: 2px 8px border-radius: 4px font-medium`, colors per the color system
- Arrow `→`: `text-sm #cccccc`, transitions to `var(--text-primary)` on hover, `margin-left: 12px flex-shrink: 0`

---

## 17. EXPANDED ROW STATE

Clicking or pressing Enter on a row expands it in place. Animate using `max-height` from `48px` to `400px` over `var(--duration-normal) var(--ease-decelerate)`. Only one row can be expanded at a time — opening a new one collapses the previous. Pressing Escape collapses the open row.

Expanded row visual: `background: var(--bg-surface)`, `border-left: 3px solid var(--accent)`.

Expanded section, `padding: 8px 12px 16px 12px`:
- Full untruncated description in `text-sm #555 mb-8px`
- Merged duplicate descriptions as `text-xs #bbb mt-4px pl-12px` prefixed with `↳`
- Category tag + remote type tag (same pill style)
- If URL exists: `Visit site →` in `text-sm var(--accent) underline mt-8px`, opens in new tab with `rel="noopener noreferrer"`. Screen readers: wrap in `<span class="sr-only">{Company Name} — </span>` before the arrow so the link is descriptive
- If no URL: show nothing

---

## 18. COPY COMPANY NAME

**Desktop — right-click context menu:** when user right-clicks a company row, show a minimal custom context menu with one option: `Copy company name`. Call `event.preventDefault()` to suppress the browser's native menu. Clicking it writes the name to clipboard using the Clipboard API and shows the toast below.

**Mobile — long press:** on `touchstart` held for `500ms`, trigger the same copy and show the toast.

**Toast:** `position: fixed bottom: 32px left: 50% transform: translateX(-50%)`, `background: #111 color: #fff text-xs px-4 py-2 border-radius: 9999px z-index: 500`. Appears instantly, fades out after `1800ms`.

---

## 19. EMPTY STATE

When search + filters return zero results, hide the alphabet bar and all rows. Show centered block, `padding: 64px 24px text-align: center`:
- `¯\_(ツ)_/¯` in `font-size: 32px mb-16px`
- `No companies match your search.` in `text-sm var(--text-secondary) mb-12px`
- `Clear filters and search` in `text-sm var(--accent) underline cursor-pointer` — resets everything: empties search input, returns all checkboxes to default, resets sort to Alphabetical

---

## 20. ERROR STATE — DATA LOAD FAILURE

If company data fails to load entirely (network error, file missing, parse error), show centered block, `padding: 64px 24px text-align: center`:
- `⚠` in `font-size: 32px color: #e67700 mb-16px`
- `Couldn't load the directory.` in `text-sm font-medium var(--text-primary) mb-8px`
- `Try refreshing the page.` in `text-sm var(--text-secondary) mb-16px`
- `Refresh` button: `padding: 8px 20px border: 1px solid #ddd border-radius: 6px text-sm var(--text-primary) cursor-pointer`, hover `background: #f5f5f5`

Log the actual error to `console.error`. This is distinct from the empty state (zero results).

---

## 21. SKELETON LOADING STATE

Before data is available, show exactly 12 placeholder skeleton rows, each `48px` tall, `border-bottom: 1px solid var(--border-row)`, `padding: 0 12px`, matching the real four-column layout:
- Avatar column: `32px × 32px` circle in `var(--skeleton-base)`
- Left: `120px × 12px` rounded rect in `var(--skeleton-base)`
- Center: `200px × 12px` rounded rect in `var(--skeleton-highlight)`
- Right: two `48px × 18px` rounded rects in `var(--skeleton-base)` spaced `8px` apart

All skeleton elements: `background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%)`, `background-size: 200% 100%`, `animation: shimmer 1.4s ease-in-out infinite`. No spinner, no loading text.

---

## 22. BACK TO TOP

Once scrolled past `600px`, fade in a `↑` button. `position: fixed`, `bottom: 24px right: 24px z-index: 150`. On mobile: `bottom: 80px` to clear the filter pill. Style: `40px × 40px background: #111111 color: #ffffff border-radius: 50% font-size: 18px box-shadow: 0 2px 8px rgba(0,0,0,0.15) cursor: pointer display: flex align-items: center justify-content: center`. Fade with `opacity: 0→1 transition: opacity var(--duration-normal)`. Clicking smooth-scrolls to `top: 0` and focuses the search input.

---

## 23. FOOTER

`border-top: 1px solid var(--border-structural)`, `padding: 32px 24px`, `background: var(--bg-page)`, `margin-top: 48px`. Inner: `max-width: 1100px margin: 0 auto`.

Row 1: `text-xs var(--text-secondary)` inline: `RemoteJobsPH` · `Data updated manually` · `Submit a company →` (arrow in `var(--accent)`, underline on hover).

Row 2: `text-xs #bbbbbb margin-top: 8px`: `Built for Filipino remote workers. Not affiliated with any company listed.`

No social icons, no newsletter, no additional legal text.

---

## 24. ACCESSIBILITY

- Every interactive element: `focus-visible` ring — `outline: 2px solid var(--accent) outline-offset: 2px`, `var(--duration-instant)`
- Non-interactive elements: must not receive focus
- All tag color combinations: verify WCAG AA contrast ratio ≥ 4.5:1 — adjust lightness if any fail
- Search input: first tab stop after nav
- Company rows: Tab to navigate, Enter to expand/collapse, Escape to collapse open row
- Mobile bottom sheet: trap focus while open, return focus to filter button on close
- All `<a>` tags: descriptive text — never bare `→`. Wrap with `<span class="sr-only">` containing company name for screen readers
- No images remain after removing the beach photo — if any remain, add `alt` text

---

## 25. PRINT STYLESHEET

```css
@media print {
  /* Hide everything except listings */
  nav, .search-bar, .filter-sidebar, .alphabet-bar, .sort-control,
  .back-to-top, footer, .mobile-filter-pill, .visit-site-link {
    display: none !important;
  }
  /* Disable virtual scroll — render all rows */
  .listing-container { height: auto !important; overflow: visible !important; }
  /* Reset colors */
  * { background: #ffffff !important; color: #000000 !important; box-shadow: none !important; }
  /* Company name bold */
  .company-name { font-weight: bold; }
  /* No page breaks inside rows */
  .company-row { page-break-inside: avoid; }
  /* Print header */
  .listing-container::before {
    content: "RemoteJobsPH — remotejobsph.vercel.app — Printed " attr(data-print-date);
    display: block;
    font-size: 11pt;
    margin-bottom: 16pt;
  }
  /* Print typography */
  body { font-size: 11pt; line-height: 1.4; }
}
```

Set `data-print-date` on the listing container via JavaScript: `element.setAttribute('data-print-date', new Date().toLocaleDateString())`.

---

## 26. INDIVIDUAL COMPANY PAGE (FILE-BASED)

Each company has or will have its own page (e.g. `/companies/buffer`). Apply this UI template:

- Same nav and footer as main page
- Back link: `← Back to directory` in `text-sm var(--accent)`, uses `history.back()` if referrer is the directory, otherwise links to `/`
- Company name: `text-3xl font-semibold var(--text-primary) mt-24px`
- Category + remote type tags on next line, same pill style
- Full description: `text-base #555 mt-12px max-width: 600px`
- If URL exists: `Visit site →` button — `padding: 10px 20px background: var(--accent) color: #ffffff border-radius: 6px text-sm font-medium mt-16px display: inline-block`, opens in new tab
- Section below: `More companies like this` — 4 other companies from the same category as compact rows, linking to their individual pages
- `<title>`: `{Company Name} — RemoteJobsPH`
- `og:title`: `{Company Name} · Remote work for Filipinos`
- `og:description`: the company's full description

If individual pages don't yet exist in the file structure, add a code comment noting where this template should be applied when they are created.

---

## 27. PERFORMANCE

- Virtual scroll: only render viewport rows ± 20 buffer
- Search debounce: `120ms` maximum
- Alphabet index: recalculate only on filter/search change, batched with debounce — not on every keystroke individually
- No external JavaScript libraries solely for this redesign unless already in the project — implement virtual scroll, filtering, sorting, and search in the framework already used
- No images remain after removing the beach photo — no lazy loading needed

---

## DO NOT CHANGE

- The underlying data files or data structure
- Any existing hrefs or external URLs on company entries
- The routing or URL structure of the site
- Any server-side rendering logic
- `robots.txt` or any SEO config files other than the `<title>` and meta tags specified above
