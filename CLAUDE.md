# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static HTML study resource for the **Fortinet NSE7 Enterprise Firewall 7.6** exam. No build step, no dependencies, no package manager — everything runs directly in the browser by opening files locally or serving from any static host.

## File map

```
index.html                                         ← Landing page: 3×3 card grid (rows 1–2 auto, row 3 explicit grid-column)
template.html                                      ← Master template for new content pages
assets/template.css                                ← Single shared stylesheet
source/                                            ← Source PDF (reference only)

pages/
  ── CONTENT ──
  enterprise-firewall-blueprint.html               ← Collapsible domain/topic progress tracker
  enterprise-firewall-study-guide.html             ← Full lesson notes (10 lessons, tabbed nav)

  ── HUB PAGES (3-card format pickers) ──
  enterprise-firewall-study-guides-hub.html        ← Full Notes / Domain Snapshots / Rapid Review
  enterprise-firewall-study-bites-hub.html         ← Concept Cards / Comparison Tables / Scenarios
  enterprise-firewall-study-nibbles-hub.html       ← Key Facts / CLI Commands / Exam Traps
  enterprise-firewall-lab-hub.html                 ← Config Labs / Troubleshooting / Design
  enterprise-firewall-memory-palace-hub.html       ← Story Anchors / Visual Rooms / Association Maps
  enterprise-firewall-mock-exams-hub.html          ← Full Mock / Domain Quizzes / Rapid Fire

  ── NOTEBOOKLM ──
  enterprise-firewall-notebooklm-hub.html          ← Hub: Deep Dives / Debates / Mini Episodes
  enterprise-firewall-notebooklm.html              ← Deep Dive prompts (11 prompts, 5 domains)
  enterprise-firewall-notebooklm-debates.html      ← Debate prompts (8 debates, 5 domains)
  enterprise-firewall-notebooklm-mini.html         ← Mini Episode prompts (12 prompts, 5 domains)
```

## CSS architecture

`assets/template.css` defines all shared tokens and components. Every page links to it; page-specific styles go in an inline `<style>` block — never duplicate tokens, only extend.

**Colour palette — all taken, pick a new hue for any new card:**

| Card | Class | Main | Light bg | Border/hover | Arrow |
|---|---|---|---|---|---|
| Topic Blueprint | `.c-blueprint` | `#1a6bcc` | `#e8f0fb` | `--blue-border` | `#1a6bcc` |
| Topic Guide | `.c-guide` | `#ff6b35` | `#fff3ec` | `--orange-border` | *(default orange)* |
| NotebookLM | `.c-notebook` | `#a32d2d` | `#fce8e8` | `--red-border` | `#a32d2d` |
| Study Guides | `.c-guides` | `#a07c00` | `#fffbe6` | `#ffe680` | `#a07c00` |
| Study Bites | `.c-bites` | `#3a7d44` | `#edf7ee` | `--green-border` | `#3a7d44` |
| Study Nibbles | `.c-nibbles` | `#5c35cc` | `#ece8ff` | `--purple-border` | `#5c35cc` |
| Lab Challenges | `.c-lab` | `#62a30e` | `#f4fae0` | `#c8e888` | `#62a30e` |
| Memory Palace | `.c-palace` | `#c2306e` | `#fce8f3` | `#f5b8d8` | `#c2306e` |
| Mock Exams | `.c-exam` | `#0d9488` | `#e6f7f5` | `#99d9d5` | `#0d9488` |

## Adding a nav card to index.html

Four additions required, all inside `index.html`:

**1. Hover variant** (`/* ── PER-CARD HOVER VARIANTS ── */`):
```css
.nav-card.c-NAME:hover {
  transform: translateY(-22px) scale(1.05) rotate(Xdeg);
  box-shadow: 0 32px 64px rgba(R,G,B,0.3), 0 0 0 2px BORDER_COLOR;
  border-color: BORDER_COLOR;
}
```

**2. Image tint + SVG animation + arrow color** (under the relevant comment blocks):
```css
.nav-card.c-NAME:hover .card-img { background: TINT_COLOR !important; }
.nav-card.c-NAME:hover .idx-NAME { animation: NAME-anim 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
@keyframes NAME-anim { to { transform: translateY(-5px); } }
.nav-card.c-NAME .card-arrow { color: MAIN_COLOR; }
```

**3. Card HTML** (inside `.card-row`):
```html
<a class="nav-card c-NAME" href="pages/NAME-hub.html">
  <div class="card-img">
    <svg viewBox="0 0 280 210" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="210" fill="LIGHT_BG"/>
      <g class="idx-NAME"><!-- icon paths --></g>
    </svg>
  </div>
  <div class="card-body">
    <div class="card-label">ENTERPRISE FIREWALL 7.6</div>
    <div class="card-name">Card Title</div>
    <div class="card-desc">One or two sentences shown on hover.</div>
    <div class="card-arrow">Open Card Title <svg ...arrow icon.../></div>
  </div>
</a>
```

**Row 3 grid positioning** — Row 3 cards (Lab col 1, Memory Palace col 2, Mock Exams col 3) use explicit `grid-column` in CSS. Any new row-3 card needs the same.

**Arrow color rule** — always match `.card-arrow` to the card's theme color. Never leave it default orange on a themed card.

## Creating a hub page

Hub pages follow `enterprise-firewall-study-guides-hub.html` as the template. Key rules:

- 3 `.hub-card` elements in a `.card-row` flex container
- `.card-desc`, `.card-meta`, `.card-arrow` are hidden by default (`max-height:0; opacity:0`) and revealed on `.hub-card:hover`
- Per-card: hover lift/rotate/glow, image tint, arrow color matching card theme
- Shine sweep via `::before` keyframe on `.hub-card`
- SVG icons at `viewBox="0 0 72 72"`, group class `ANIM_CLASS`, animated on hover
- No JS needed on hub pages
- Breadcrumb back to `../index.html`, fixed footer with `NSE7.` left

## NotebookLM prompt pages

All three prompt pages (`notebooklm.html`, `notebooklm-debates.html`, `notebooklm-mini.html`) share these patterns:

**Prompt cards** — collapsible via `togglePrompt()`. Expanded by default on load. Each card has:
- A left `.card-image` panel with an SVG injected from `CARD_SVGS` in JS (`initImagePlaceholders()`)
- A `.prompt-card-head` (clickable) containing icon, title, and the checkbox group
- A `.prompt-body` with the prompt text and footer (tags + copy button)

**Two-checkbox group** — appears in every `.prompt-card-head`:
```html
<div class="check-group" onclick="event.stopPropagation()">
  <label class="check-wrap"><input type="checkbox" class="generated-check" onchange="toggleGenerated(this)"><span class="check-box check-box--green"></span><span class="check-label">Generated</span></label>
  <label class="check-wrap"><input type="checkbox" class="completed-check" onchange="toggleCompleted(this)"><span class="check-box check-box--blue"></span><span class="check-label">Completed</span></label>
</div>
```
- **Generated** (green) — audio was generated in NotebookLM; turns card head green
- **Completed** (blue) — episode reviewed; turns card head blue (overrides green when both checked)
- Both states persist in `localStorage` (`nlm_gen_ID` / `nlm_done_ID`)

**Debates page extras** — each `.side-a` / `.side-b` box gets a small copy button injected by `initSideCopyBtns()` — orange-tinted for side A, purple-tinted for side B, 35% opacity until hover.

**How To Use banner** (`notebooklm.html` only) — collapsed by default, toggled by clicking the banner (`this.classList.toggle('open')`). The steps animate in via CSS grid `grid-template-rows: 0fr → 1fr`.

## Creating a new content page

1. Copy `template.html` to `pages/your-page-name.html`
2. Update `<title>`, `.day-badge` text, `<h1>`, and footer right text
3. Replace section blocks and sidebar items with real content
4. Update the `sections` array in the scroll-spy listener to match actual `id` values
5. Link the corresponding nav card in `index.html` and hub page if applicable

## Component reference (template.css)

| Class | Purpose |
|---|---|
| `.key-concept` | Orange highlight box — single most important exam idea |
| `.callout-note` | Amber — exam notes / don't-forget reminders |
| `.callout-analogy` | Green — mental models |
| `.callout-tip` | Blue — config tips / best practices |
| `.callout-warn` | Red — common mistakes / exam traps |
| `.compare-table` | Two-tone comparison table with rounded corners |
| `.pipeline-box` | Dark monospace block for ASCII diagrams; use `.hl` / `.dim` spans |
| `.pipeline-stages` | Horizontal numbered stage cards |
| `.flow-steps` / `.pipeline` | Vertical numbered sequence with connecting line |
| `.scenario` | Dark box for exam-question-style Q&A |
| `.quick-ref` | Dark sidebar card: term + one-line definition |
