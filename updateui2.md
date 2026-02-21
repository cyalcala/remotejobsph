# RemoteJobsPH — RemoteOK-Inspired UI Redesign Prompt

Paste everything below this line as a single prompt to your AI coding assistant.

---

Completely redesign RemoteJobsPH to look and feel like RemoteOK (remoteok.com) but modernized, more polished, and tailored for Filipino remote workers. Do not change the underlying data, file structure, routing, or server-side logic. Only change the UI. Apply every instruction below in full.

---

## 1. CORE AESTHETIC — REMOTEOK DNA

The entire site uses a **dark theme** as its foundation. RemoteOK's signature look:
- Near-black background, not pure black — use `#120f1d` (deep dark purple-black)
- Bright green accent: `#00e676` for primary CTAs, highlights, and active states
- Each listing row is its own rounded "card-row" — not a flat list, not a floating card, but a padded row with a subtle border and left-side color accent
- Emoji used deliberately throughout — as tag prefixes, section headers, and UI accents
- Company avatar/logo on the far left of every row, prominent
- Colorful tag pills, emoji-prefixed, inline in every row
- Stats bar at the very top showing live counts
- "New" and "🔥 Hot" badges on highlighted entries
- Green hover glow on rows
- Everything feels dense but never cramped — generous row padding, tight typography

---

## 2. CSS CUSTOM PROPERTIES — FULL DARK SYSTEM

```css
:root {
  /* Backgrounds */
  --bg-base: #120f1d;
  --bg-surface: #1a1726;
  --bg-row: #1e1b2e;
  --bg-row-hover: #252238;
  --bg-tag: #2a2640;
  --bg-input: #1e1b2e;

  /* Borders */
  --border-subtle: #2a2640;
  --border-row: #2e2a45;
  --border-focus: #00e676;

  /* Text */
  --text-primary: #f0eeff;
  --text-secondary: #9d96c0;
  --text-muted: #5c5880;
  --text-accent: #00e676;

  /* Accents */
  --accent-green: #00e676;
  --accent-green-glow: rgba(0, 230, 118, 0.12);
  --accent-green-dim: rgba(0, 230, 118, 0.08);

  /* Category colors */
  --color-pinoy: #a78bfa;
  --color-pinoy-bg: rgba(167, 139, 250, 0.12);
  --color-agency: #60a5fa;
  --color-agency-bg: rgba(96, 165, 250, 0.12);
  --color-gig: #fb923c;
  --color-gig-bg: rgba(251, 146, 60, 0.12);
  --color-ph-freelancing: #f472b6;
  --color-ph-freelancing-bg: rgba(244, 114, 182, 0.12);
  --color-australia: #34d399;
  --color-australia-bg: rgba(52, 211, 153, 0.12);
  --color-usa: #f87171;
  --color-usa-bg: rgba(248, 113, 113, 0.12);

  /* Remote type colors */
  --color-fully-remote: #00e676;
  --color-fully-remote-bg: rgba(0, 230, 118, 0.1);
  --color-hybrid: #facc15;
  --color-hybrid-bg: rgba(250, 204, 21, 0.1);
  --color-remote-friendly: #38bdf8;
  --color-remote-friendly-bg: rgba(56, 189, 248, 0.1);

  /* Animations */
  --duration-instant: 0ms;
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
}
```

Set `background-color: var(--bg-base)` and `color: var(--text-primary)` on `<body>`. Font: `Inter, -apple-system, BlinkMacSystemFont, sans-serif`. Import Inter from Google Fonts. Base size `14px`, line height `1.5`.

Do NOT add a `prefers-color-scheme: light` override — this site is dark-only, like RemoteOK.

---

## 3. DATA SANITIZATION — APPLY ON RENDER

Before rendering any company name or tag, apply in JavaScript:

- Strip all leading/trailing quotation marks (`"`, `'`, `"`, `"`) from company names
- Trim all whitespace from both ends of names and descriptions
- Capitalize first letter of every company name
- Normalize category tags regardless of how stored:
  - `agency` / `Agency` → `Agency`
  - `pinoyva` / `Pinoy VA` / `pinoy va` → `Pinoy VA`
  - `gig` → `Gig`
  - `ph freelancing` / `phfreelancing` / `PH Freelancing` → `PH Freelancing`
  - `australia` → `Australia`
  - `usa` → `USA`
- Normalize remote type tags:
  - `fully remote` / `fullyremote` → `Fully Remote`
  - `hybrid` → `Hybrid`
  - `remote-friendly` / `remote friendly` → `Remote-Friendly`
- Merge duplicate company names: show once, show secondary descriptions in expanded row as `↳` lines
- Assign each category an emoji (used in tags and filter labels):
  - Pinoy VA → 🇵🇭
  - Agency → 🏢
  - Gig → 💼
  - PH Freelancing → 💻
  - Australia → 🦘
  - USA → 🇺🇸
  - Fully Remote → 🌏
  - Hybrid → 🏠
  - Remote-Friendly → ✅

---

## 4. BROWSER TAB, META, FAVICON

- `<title>`: `RemoteJobsPH — 🇵🇭 Remote Jobs for Filipinos`
- Meta description: `Browse 1000+ remote companies hiring Filipino talent. Filter by Pinoy VA, Agency, Gig and more.`
- `og:title` and `og:description` matching the above
- Favicon: inline SVG, `32×32`, letters `RJ` in `font-weight: 700 fill: #00e676` on `#120f1d` background
- Dynamic tab title:
  - Filtering active: `🇵🇭 Pinoy VA · RemoteJobsPH`
  - Searching: `🔍 "{query}" · RemoteJobsPH`
  - Default: `RemoteJobsPH — 🇵🇭 Remote Jobs for Filipinos`

---

## 5. STATS BAR — TOP OF PAGE, FULL WIDTH

A full-width bar pinned at the very top above the nav, `36px` tall, `background: #0d0b18`, `border-bottom: 1px solid var(--border-subtle)`. Centered content, `text-xs var(--text-muted)`, showing inline stats separated by `·`:

`🌏 1,001 companies listed  ·  🇵🇭 247 Pinoy VA companies  ·  💼 89 Gig opportunities  ·  🦘 43 Australia-based`

Numbers are hardcoded from the dataset — calculate the actual counts from the data at build/render time and insert them. Style numbers in `var(--text-accent) font-medium`. This bar does not scroll — it stays fixed at the very top.

---

## 6. NAVIGATION

Sticky nav, `56px` tall, `background: var(--bg-surface)`, `border-bottom: 1px solid var(--border-subtle)`, `position: sticky`, `top: 36px` (below the stats bar), `z-index: 100`.

Inner content: `max-width: 1200px margin: 0 auto padding: 0 24px display: flex align-items: center justify-content: space-between`.

**Left:** `🇵🇭 RemoteJobsPH` — the flag emoji followed by the site name in `font-semibold text-base var(--text-primary)`. Not a link.

**Center (desktop only):** a compact inline stat `✨ {n} companies` in `text-xs var(--text-muted)`, updating live as filters change.

**Right:** a green CTA button `+ Submit Company` — `background: var(--accent-green) color: #0d0b18 font-semibold text-xs px-4 py-2 border-radius: 6px cursor-pointer`. Hover: `brightness(1.1)`. Does nothing for now (no href needed).

On mobile (below `768px`): hide center stat and the CTA label — show only a `+` icon button on the right, same green styling, `36px × 36px border-radius: 50%`.

---

## 7. HERO SECTION

Below the nav. `background: var(--bg-base)`, `padding: 48px 24px 32px`, centered, `max-width: 1200px margin: 0 auto`.

**Main headline:** `🌏 Find Remote Work as a Filipino` — `font-size: clamp(1.75rem, 4vw, 2.5rem) font-weight: 700 color: var(--text-primary) text-align: center line-height: 1.2`. The emoji is part of the headline.

**Subline:** `Browse {n} remote-friendly companies — updated regularly` — `text-base var(--text-secondary) text-align: center margin-top: 8px`. `{n}` updates live.

**Search bar** (inside hero, centered, full attention): `max-width: 600px margin: 24px auto 0`. Height `52px`, `background: var(--bg-input)`, `border: 1.5px solid var(--border-row)`, `border-radius: 12px`, `padding: 0 20px 0 48px`. Left-side: `🔍` emoji at `left: 16px` vertically centered, `font-size: 18px`. Placeholder: `Search 1,001 companies...` in `var(--text-muted)`. On focus: `border-color: var(--accent-green)`, `box-shadow: 0 0 0 3px var(--accent-green-glow)`.

Inside the search bar on the far right: a `/` key hint badge — `text-xs var(--text-muted) font-mono border: 1px solid var(--border-subtle) border-radius: 3px px-1 py-0.5`. Hide after user first uses it (memory only, not localStorage).

Remove the beach photo entirely and permanently.

---

## 8. FILTER TAG BAR — REMOTEOK STYLE

Below the hero, a horizontally scrollable row of clickable filter tags — exactly like RemoteOK's tag strip. `background: var(--bg-base)`, `padding: 0 24px 16px`, `max-width: 1200px margin: 0 auto`. Scrollable on mobile with hidden scrollbar.

Each filter tag is a pill: `display: inline-flex align-items: center gap: 6px`, `padding: 6px 14px`, `border-radius: 9999px`, `border: 1.5px solid var(--border-subtle)`, `background: var(--bg-tag)`, `text-sm var(--text-secondary)`, `cursor: pointer`, `white-space: nowrap`.

Tags and their emoji + colors:

| Tag | Emoji | Active border | Active background | Active text |
|---|---|---|---|---|
| All Jobs | 🌐 | `var(--accent-green)` | `var(--accent-green-dim)` | `var(--accent-green)` |
| Pinoy VA | 🇵🇭 | `var(--color-pinoy)` | `var(--color-pinoy-bg)` | `var(--color-pinoy)` |
| Agency | 🏢 | `var(--color-agency)` | `var(--color-agency-bg)` | `var(--color-agency)` |
| Gig | 💼 | `var(--color-gig)` | `var(--color-gig-bg)` | `var(--color-gig)` |
| PH Freelancing | 💻 | `var(--color-ph-freelancing)` | `var(--color-ph-freelancing-bg)` | `var(--color-ph-freelancing)` |
| Australia | 🦘 | `var(--color-australia)` | `var(--color-australia-bg)` | `var(--color-australia)` |
| USA | 🇺🇸 | `var(--color-usa)` | `var(--color-usa-bg)` | `var(--color-usa)` |
| Fully Remote | 🌏 | `var(--color-fully-remote)` | `var(--color-fully-remote-bg)` | `var(--color-fully-remote)` |
| Hybrid | 🏠 | `var(--color-hybrid)` | `var(--color-hybrid-bg)` | `var(--color-hybrid)` |
| Remote-Friendly | ✅ | `var(--color-remote-friendly)` | `var(--color-remote-friendly-bg)` | `var(--color-remote-friendly)` |

Active tags: `border-color` and `color` match the table above, `background` matches. Show a count badge next to each active tag: `({n})` in `text-xs`. Show a `✕` icon inside the tag to deactivate it. Multiple tags can be active simultaneously — OR logic within category group, AND logic between category and remote type groups.

When any filter is active, show a `Clear all ✕` tag at the end of the strip in `border-color: #ff6b6b color: #ff6b6b background: rgba(255,107,107,0.08)`.

---

## 9. RESULTS BAR

Between the filter strip and the listings. Full width, `max-width: 1200px margin: 0 auto padding: 8px 24px`. Flexbox, `justify-content: space-between align-items: center`.

**Left:** `📋 Showing {n} of 1,001 companies` in `text-xs var(--text-muted)`. `{n}` updates live.

**Right:** `Sort by` label in `text-xs var(--text-muted)` + minimal `<select>` styled to match dark theme: `background: var(--bg-tag) color: var(--text-secondary) border: 1px solid var(--border-subtle) border-radius: 6px text-xs padding: 4px 8px cursor-pointer font-family: inherit`. Options: `🔤 Alphabetical`, `🇵🇭 Pinoy VA First`, `🏢 Agency First`, `💼 Gig First`, `🦘 Australia First`, `🇺🇸 USA First`.

---

## 10. PAGE LAYOUT

Below the results bar: two-column layout. `max-width: 1200px margin: 0 auto padding: 0 24px 48px`. CSS grid: `grid-template-columns: 220px 1fr gap: 24px`. On mobile: single column.

---

## 11. LEFT SIDEBAR — REMOTEOK STYLE FILTER PANEL

`position: sticky top: 108px` (nav bottom), `height: calc(100vh - 108px) overflow-y: auto`. `background: transparent`. No border, no shadow.

**Sidebar header:** `⚙️ Filters` in `text-xs font-semibold uppercase tracking-widest var(--text-muted) mb-12px`. When filters active: show `· {n} active` in `var(--accent-green) text-xs` inline.

**Filter Group 1 — Category.** Header: `🗂️ Category` in `text-xs font-semibold uppercase tracking-widest var(--text-muted) mb-8px mt-0`. Each option as a clickable row — NOT a checkbox, but a full-width pill button like RemoteOK's sidebar tags:

Each option row: `display: flex align-items: center justify-content: space-between width: 100% padding: 7px 12px border-radius: 8px cursor-pointer margin-bottom: 4px border: 1.5px solid transparent text-sm`.

Default state: `background: var(--bg-tag) color: var(--text-secondary) border-color: var(--border-subtle)`.

Active state: matches the category's color variables (border, background, text) per the color table above.

Left side: `{emoji} {Label}` — e.g. `🇵🇭 Pinoy VA`. Right side: count `(143)` in `text-xs var(--text-muted)`, updating live.

Options: 🌐 All Jobs, 🇵🇭 Pinoy VA, 🏢 Agency, 💼 Gig, 💻 PH Freelancing, 🦘 Australia, 🇺🇸 USA.

**Filter Group 2 — Remote Type.** Header: `🌍 Remote Type` same style, `margin-top: 20px`. Options: 🌏 Fully Remote, 🏠 Hybrid, ✅ Remote-Friendly. Same pill-button style.

**Clear all button** at the bottom of sidebar when any filter active: `🗑️ Clear all filters` — `width: 100% padding: 7px 12px border-radius: 8px border: 1.5px solid rgba(255,107,107,0.3) color: #ff6b6b background: rgba(255,107,107,0.06) text-sm cursor-pointer margin-top: 16px`. Hover: `border-color: #ff6b6b background: rgba(255,107,107,0.12)`.

On mobile: hide sidebar. Use the filter tag bar (Section 8) as the primary filter mechanism.

---

## 12. ALPHABET INDEX

Above the listing rows inside the main column. Horizontal strip of `#` + A–Z. Each letter: `24px × 24px`, `display: inline-flex align-items: center justify-content: center`, `text-xs font-mono border-radius: 4px`.

Active letter: `color: var(--text-secondary)`, hover `background: var(--bg-tag) color: var(--text-primary)`. Inactive letter: `color: var(--text-muted) cursor: default`. Clicking active letter smooth-scrolls to first matching company and flashes that row with a `box-shadow: 0 0 0 2px var(--accent-green)` for `800ms`.

Recalculate active letters with the same debounce as search. On mobile: horizontally scrollable, hidden scrollbar.

---

## 13. LETTER GROUP HEADERS

Inside the listings, before the first company of each new letter group, insert a non-interactive header row. Style: `padding: 8px 0 4px`, the letter in `text-xs font-semibold uppercase tracking-widest var(--text-muted)`. Not clickable. Use `#` for companies starting with a number.

---

## 14. COMPANY AVATAR — GENERATED

Each row's leftmost element is a `48px × 48px` avatar. Generation rules:
- Take the first 1–2 characters of the company name (first letter, or initials of first two words)
- Background: deterministically derived from company name hash → one of 8 colors: `#7c3aed`, `#1d4ed8`, `#047857`, `#b45309`, `#be123c`, `#0e7490`, `#6d28d9`, `#15803d`
- Text: `#ffffff`, `font-size: 16px font-weight: 700`
- `border-radius: 10px` (rounded square, not circle — like RemoteOK company logos)
- `flex-shrink: 0`

On mobile: `40px × 40px border-radius: 8px`.

---

## 15. LISTING ROWS — REMOTEOK STYLE

**Remove** the `## Latest Opportunities` heading, standalone `1001 results` text, and all redundant copy.

**Virtual scrolling:** render only viewport rows ± 20 buffer. Recalculate on scroll, filter, and sort.

Each company row is a **card-row** — its own visual island, like RemoteOK:

```
background: var(--bg-row)
border: 1.5px solid var(--border-row)
border-radius: 12px
padding: 16px 20px
margin-bottom: 8px
display: flex
align-items: center
gap: 16px
cursor: pointer
position: relative
overflow: hidden
transition: background var(--duration-fast), border-color var(--duration-fast), box-shadow var(--duration-fast)
```

**Left accent bar:** a `3px` wide vertical bar on the left edge of the row, `height: 100%`, `position: absolute left: 0 top: 0`, color matches the company's category color (e.g. Pinoy VA rows get `var(--color-pinoy)`). This is the RemoteOK signature left border accent.

**Hover state:**
```
background: var(--bg-row-hover)
border-color: var(--accent-green)
box-shadow: 0 0 0 1px var(--accent-green), 0 4px 24px var(--accent-green-glow)
```

**Row internal layout — flex, left to right:**

1. **Avatar** `48px × 48px` as described in Section 14, `flex-shrink: 0`

2. **Main content block** `flex: 1 min-width: 0`:
   - Line 1: Company name in `font-semibold text-base var(--text-primary)`
   - Line 2: Description truncated to 80 chars in `text-sm var(--text-secondary) mt-2px overflow: hidden text-overflow: ellipsis white-space: nowrap`
   - Line 3: Tag pills row (see Section 17), `margin-top: 8px display: flex flex-wrap: wrap gap: 6px`

3. **Right action block** `flex-shrink: 0 display: flex flex-direction: column align-items: flex-end gap: 8px`:
   - `Visit →` link button if URL exists: `text-xs font-semibold color: var(--accent-green) border: 1px solid var(--accent-green) border-radius: 6px px-3 py-1.5 white-space: nowrap`. Hover: `background: var(--accent-green) color: #0d0b18`. Opens in new tab.
   - If no URL: `Details →` text in `text-xs var(--text-muted)`, triggers row expansion
   - Below the button: `🌏 Remote` in `text-xs var(--text-muted)` always shown

On mobile: stack the row vertically — avatar + name on line 1, description on line 2, tags on line 3, button full-width on line 4. Remove the right action block column layout.

---

## 16. TAG PILLS — REMOTEOK STYLE WITH EMOJI

Each row shows tag pills on line 3 of the main content block. Tag pill style:

```
display: inline-flex
align-items: center
gap: 4px
padding: 3px 10px
border-radius: 9999px
font-size: 12px
font-weight: 500
white-space: nowrap
cursor: pointer
```

Clicking a tag pill activates that filter — same as clicking the filter bar tag. Add a hover state: `brightness(1.2)`.

Category tag (one per row):
- `🇵🇭 Pinoy VA`: `background: var(--color-pinoy-bg) color: var(--color-pinoy)`
- `🏢 Agency`: `background: var(--color-agency-bg) color: var(--color-agency)`
- `💼 Gig`: `background: var(--color-gig-bg) color: var(--color-gig)`
- `💻 PH Freelancing`: `background: var(--color-ph-freelancing-bg) color: var(--color-ph-freelancing)`
- `🦘 Australia`: `background: var(--color-australia-bg) color: var(--color-australia)`
- `🇺🇸 USA`: `background: var(--color-usa-bg) color: var(--color-usa)`

Remote type tag (one per row):
- `🌏 Fully Remote`: `background: var(--color-fully-remote-bg) color: var(--color-fully-remote)`
- `🏠 Hybrid`: `background: var(--color-hybrid-bg) color: var(--color-hybrid)`
- `✅ Remote-Friendly`: `background: var(--color-remote-friendly-bg) color: var(--color-remote-friendly)`

---

## 18. EXPANDED ROW STATE

Clicking anywhere on a row (except the `Visit →` button) expands it in place, revealing a details panel below the tag line. Animate: `max-height 0 → 200px` over `var(--duration-normal) var(--ease-decelerate)`. Only one row expanded at a time. Escape key collapses.

Expanded panel, `padding: 16px 0 0 64px` (indented to clear the avatar):
- Full untruncated description in `text-sm var(--text-secondary) mb-12px`
- If merged duplicates exist: each `↳` line in `text-xs var(--text-muted) mt-4px pl-12px`
- Category + remote type tags again (same pill style, non-clickable in expanded state)
- If URL exists: `🔗 Visit {Company Name} →` as a full pill button: `background: var(--accent-green) color: #0d0b18 font-semibold text-sm px-4 py-2 border-radius: 8px display: inline-flex align-items: center gap: 6px mt-8px`. Opens new tab, `rel="noopener noreferrer"`. Screen reader: wrap company name in visible text, not just `→`.
- No URL: show `📋 No website listed` in `text-xs var(--text-muted)`.

Expanded row gets: `border-color: var(--accent-green) box-shadow: 0 0 0 1px var(--accent-green), 0 8px 32px var(--accent-green-glow)`.

---

## 19. COPY COMPANY NAME

**Desktop right-click:** custom context menu, one item: `📋 Copy company name`. `event.preventDefault()` to suppress native menu. Menu style: `background: var(--bg-surface) border: 1px solid var(--border-row) border-radius: 8px padding: 4px box-shadow: 0 8px 24px rgba(0,0,0,0.4)`. Menu item: `text-sm var(--text-secondary) px-12px py-8px border-radius: 6px cursor-pointer`, hover `background: var(--bg-row-hover) color: var(--text-primary)`. Writes to clipboard, shows toast.

**Mobile long press:** `500ms touchstart` hold triggers same copy + toast.

**Toast:** `position: fixed bottom: 32px left: 50% transform: translateX(-50%) background: var(--bg-surface) color: var(--text-primary) border: 1px solid var(--border-subtle) text-xs px-4 py-2 border-radius: 9999px z-index: 500 box-shadow: 0 4px 12px rgba(0,0,0,0.4)`. Content: `✅ Copied!`. Appears instantly, fades out after `1800ms`.

---

## 20. KEYBOARD SHORTCUT

Pressing `/` anywhere on the page when focus is not in a text input moves focus to the search bar and selects existing text. Hide the `/` hint in the search input after first use.

---

## 21. EMPTY STATE

Zero results: hide alphabet bar, all rows. Show centered block, `padding: 80px 24px text-align: center`:
- `🔍` in `font-size: 48px mb-16px`
- `No companies found` in `text-xl font-semibold var(--text-primary) mb-8px`
- `Try a different search or clear your filters` in `text-sm var(--text-secondary) mb-24px`
- `🗑️ Clear everything` button: `background: var(--accent-green) color: #0d0b18 font-semibold text-sm px-6 py-3 border-radius: 8px cursor-pointer`. Resets search, all filters, sort.

---

## 22. ERROR STATE

Data load failure: replace listings with centered block, `padding: 80px 24px text-align: center`:
- `⚠️` in `font-size: 48px mb-16px`
- `Couldn't load the directory` in `text-xl font-semibold var(--text-primary) mb-8px`
- `Try refreshing the page` in `text-sm var(--text-secondary) mb-24px`
- `🔄 Refresh` button: `border: 1.5px solid var(--border-row) color: var(--text-secondary) background: var(--bg-tag) text-sm px-6 py-3 border-radius: 8px cursor-pointer`. Hover: `border-color: var(--accent-green) color: var(--accent-green)`.
- Log to `console.error`.

---

## 23. SKELETON LOADING STATE

Before data renders: 8 skeleton card-rows matching the real row shape:
- Same `border-radius: 12px border: 1.5px solid var(--border-row) padding: 16px 20px margin-bottom: 8px`
- Left accent bar: `3px wide var(--bg-tag)` (no color yet)
- Avatar: `48px × 48px border-radius: 10px background: var(--bg-tag)`
- Line 1: `160px × 14px rounded rect var(--bg-tag)`
- Line 2: `280px × 12px rounded rect` slightly lighter
- Line 3 (tags): two `80px × 22px rounded-full rects` spaced `6px`

Shimmer animation:
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton-item {
  background: linear-gradient(90deg, var(--bg-tag) 25%, var(--bg-surface) 50%, var(--bg-tag) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: 4px;
}
```

---

## 24. BACK TO TOP

After scrolling `600px`: fade in `↑` button. `position: fixed bottom: 24px right: 24px z-index: 150`. On mobile: `bottom: 80px` to clear mobile filter. Style: `44px × 44px background: var(--bg-surface) color: var(--text-primary) border: 1.5px solid var(--border-row) border-radius: 50% font-size: 18px cursor: pointer display: flex align-items: center justify-content: center box-shadow: 0 4px 16px rgba(0,0,0,0.4)`. Hover: `border-color: var(--accent-green) color: var(--accent-green)`. Fade: `opacity 0→1 var(--duration-normal)`. Click: smooth scroll to top, focus search.

---

## 25. MOBILE FILTER — BOTTOM SHEET

On mobile (below `768px`), hide the sidebar. Show a pill fixed at `bottom: 24px centered position: fixed z-index: 200`. Style: `background: var(--accent-green) color: #0d0b18 font-semibold text-sm px-5 py-2.5 border-radius: 9999px box-shadow: 0 4px 20px rgba(0,230,118,0.3)`. Label: `⚙️ Filters` — append ` · {n}` when active.

Bottom sheet: `position: fixed bottom: 0 left: 0 right: 0 background: var(--bg-surface) border-radius: 20px 20px 0 0 padding: 24px z-index: 300 max-height: 85vh overflow-y: auto border-top: 1.5px solid var(--border-subtle)`. Drag handle: `36px × 4px background: var(--border-row) border-radius: 9999px mx-auto mb-20px`. Overlay: `rgba(0,0,0,0.6)`. Swipe-down `> 80px` to close. Sheet contains same filter groups as sidebar. `Done ✓` button: `width: 100% background: var(--accent-green) color: #0d0b18 font-semibold text-sm padding: 14px border-radius: 10px margin-top: 16px`. Focus trap while open, return focus to filter button on close.

---

## 26. URL STATE AND SHAREABILITY

Sync all UI state to URL query params using `history.replaceState`:
- `?q=searchterm`
- `?category=pinoy-va,agency`
- `?remote=fully-remote`
- `?sort=pinoy-va-first`

On load: initialize from URL before rendering. On clear: remove all params, return to clean root URL.

---

## 27. FOOTER

`border-top: 1px solid var(--border-subtle) padding: 40px 24px background: var(--bg-base) margin-top: 48px`. Inner: `max-width: 1200px margin: 0 auto`.

**Row 1:** `🇵🇭 RemoteJobsPH` in `font-semibold var(--text-primary)` followed by `text-xs var(--text-muted)` inline: `· Remote work for Filipinos · 1,001 companies listed`.

**Row 2:** `text-xs var(--text-muted) mt-8px`: `Built with ❤️ for Filipino remote workers · Not affiliated with any company listed · Data updated manually`.

**Row 3:** `margin-top: 16px display: flex gap: 12px`. Two plain text links in `text-xs`:
- `📬 Submit a company →` in `var(--accent-green)`, hover underline
- `🐛 Report an issue →` in `var(--text-muted)`, hover `var(--text-secondary)`

---

## 28. ACCESSIBILITY

- Every interactive element: `focus-visible` ring — `outline: 2px solid var(--accent-green) outline-offset: 2px`, instant
- Non-interactive elements: never receive focus
- All color combinations: verify WCAG AA contrast ≥ 4.5:1 on dark backgrounds — adjust lightness if any fail
- Search input: first tab stop after nav
- Company rows: Tab to navigate, Enter to expand/collapse, Escape to collapse open row
- Mobile bottom sheet: focus trap while open, return focus to filter button on close
- All `<a>` tags: descriptive text — never bare `→`. Use `<span class="sr-only">` with company name for screen readers
- Emoji in text: wrap in `<span role="img" aria-label="{description}">` for screen readers. Example: `<span role="img" aria-label="Philippines flag">🇵🇭</span>`
- Stats bar numbers: `aria-live="polite"` so screen readers announce filter result changes

---

## 29. ANIMATIONS AND REDUCED MOTION

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

## 30. PRINT STYLESHEET

```css
@media print {
  .stats-bar, nav, .hero-search, .filter-tag-bar, .sidebar,
  .alphabet-bar, .results-bar, .back-to-top, footer, .mobile-filter-pill,
  .visit-btn { display: none !important; }
  body { background: #fff !important; color: #000 !important; }
  .company-row {
    background: #fff !important;
    border: 1px solid #ddd !important;
    border-left: 3px solid #000 !important;
    box-shadow: none !important;
    page-break-inside: avoid;
  }
  .company-name { font-weight: bold; color: #000 !important; }
  .company-description, .tag-pill { color: #444 !important; }
  .listing-container::before {
    content: "RemoteJobsPH — remotejobsph.vercel.app — Printed " attr(data-print-date);
    display: block; font-size: 11pt; margin-bottom: 16pt; font-weight: bold;
  }
  body { font-size: 11pt; line-height: 1.4; }
}
```

Set `data-print-date` via JS: `element.setAttribute('data-print-date', new Date().toLocaleDateString())`.

---

## 31. PERFORMANCE

- Virtual scroll: viewport rows ± 20 buffer only
- Search debounce: `120ms` max
- Alphabet index: recalculate on filter/search change only, batched with debounce
- No external JS libraries for this UI unless already in the project
- No images after beach photo removal — no lazy loading needed
- CSS custom properties for all colors — single source of truth

---

## 32. INDIVIDUAL COMPANY PAGE (FILE-BASED)

If individual company pages exist or will exist at routes like `/companies/buffer`:

- Same stats bar + nav + footer
- Back: `← Back to directory` in `text-sm var(--accent-green)`, `history.back()` or `/`
- Company avatar: `80px × 80px border-radius: 16px` — same generated avatar logic
- Company name: `text-3xl font-bold var(--text-primary) mt-16px`
- Category + remote type tag pills: same style
- Description: `text-base var(--text-secondary) mt-12px max-width: 600px line-height: 1.7`
- If URL: `🔗 Visit {Company Name} →` — full green button, new tab
- Section: `🏢 More like this` — 4 companies from same category as compact rows
- `<title>`: `{Company Name} 🇵🇭 — RemoteJobsPH`
- `og:title`: `{Company Name} · Remote work for Filipinos`
- `og:description`: company's full description

If pages don't exist yet: add a code comment noting where to apply this template.

---

## DO NOT CHANGE

- The underlying data files or data structure
- Any existing hrefs or external URLs on company entries
- The routing or URL structure
- Any server-side rendering logic
- `robots.txt` or any existing SEO config files (except `<title>` and meta tags above)
