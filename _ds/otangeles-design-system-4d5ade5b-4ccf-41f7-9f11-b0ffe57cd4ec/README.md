# Otangeles Notes+ Design System

> **Rebrand — July 2026.** The visual identity was refreshed: new orb logo
> (purple→teal swirl), Primary Purple `#7B61FF`, Accent Teal `#22C5A7`,
> Deep Navy `#0F1B2E` text, and a locked Inter type scale. The brand sheet at
> `assets/brand/brand-sheet.jpeg` and the tokens in `colors_and_type.css` +
> `CLAUDE.md` are the source of truth and supersede any older color/type
> references below. The pre-rebrand logo SVGs (`assets/otangeles-logo.svg`,
> `assets/otangeles-icon.svg`) are retired.

Otangeles Notes+ is a multi-portal clinical workflow platform for post-acute / skilled nursing care. The product helps medical providers, scribes, and clerks document and bill patient encounters — it combines an EMR-style encounter editor with AI scribing, an assessment library (MDS, PHQ-9, GDS, Morse Fall Scale, Get-Up-and-Go), medication management, e-prescribing, coding (ICD-10 / CPT / SNOMED), lab results, and facility/schedule coordination.

The visual system is **bright, clinical, and componentized**: lavender primary, coral accent, mint success, off-white canvas. Components in the Figma source are described as "based on Tailwind CSS" — sizing, radii, and elevation match Tailwind defaults, extended with an Otangeles brand palette.

## Products represented

- **Provider Portal** — clinician workspace: dashboard, patient list, schedules, calendar, encounter review/sign, e-prescribe, discharge/meds reduction, flagged vitals, lab results, W-RVU performance metrics, settings.
- **Encounter (shared)** — the heart of the product. HPI, ROS, PE, Treatment Plan, Medications, Allergies, Labs, Codes, Assessments. Hundreds of small finding / option / toggle components.
- **Profile** — patient chart + longitudinal assessments (Skin Check, Sepsis Screening, MDS Pain Interview, BIMS, PCC Skin/Wound).
- **Scribe Portal** — encounter queue, in-progress note, revision, performance, earnings, addendums, notifications.
- **Clerk Portal** — schedules, calendar, workflows, directory, med-docs panel.

## Sources

- **Figma file** (mounted here as a read-only virtual filesystem): `KyntixMed.fig` (the `.fig` file name is the previous working title; the product brand is **Otangeles Notes+**).
  - Pages: `/Initial`, `/Provider-Portal`, `/Encounter`, `/Encounter-Components` (237 frames), `/Profile`, `/Scribe-Portal`, `/Clerk-Portal`
  - Logo source: `/Initial/Logo/index.jsx` (node `672:24734`)
  - Type + color swatches: `/Initial/Styles/index.jsx` (node `5:3903`)
  - Provider Portal dashboard: `/Provider-Portal/Main-Screens/Dashboard/dashboard.jsx` (node `133:4120`)
  - Login: `/Provider-Portal/Login/index.jsx` (node `681:24890`)
- No codebase was attached. Recreations are drawn directly from Figma pseudocode.

## Content fundamentals

Otangeles Notes+ copy is **direct, clinical, professional, lightly warm**. It addresses the user in second person (*"Hi, John!"*, *"Sign in to continue to your dashboard."*) and uses **Title Case** for nav items, button labels, and headers (*"New Admissions"*, *"Open Encounter"*, *"Credential Mgmt."*, *"Encounter for Audit"*). Section headings and form labels are sentence-cased phrases, often with a colon (*"Select a facility you want to view:"*).

- **No emoji.** Ever.
- **No exclamation marks** except in greetings ("Hi, John!", "Welcome Back!").
- **Abbreviations common**: *Credential Mgmt.*, *W-RVU Performance*, *E-Prescribe*, *HR/RTH*, *A&P*, *PE*, *ROS*, *TP*, *MDS*, *PHQ-9*, *BIMS*, *ACP*, *SVAF*, *RPM*. Users are clinicians and will parse them.
- **Medical register preserved**: "Edema in lower extremities", "Suicidal or homicidal ideation", "CTA (Clear to Auscultation)". Don't simplify these.
- **Buttons are verbs**: *Sign In*, *Open Encounter*, *Submit to Provider*, *Return to Scriber*, *Generate*, *Add Notes*, *Denies All*.
- **Status words carry the meaning**: *TO DO*, *FOR REVIEW*, *FOR SIGNING*, *REVIEWED*, *SIGNED*, *VOIDED*, *PENDING*, *SUCCESS*, *DISREGARD*, *DONE*.

## Visual foundations

### Palette

- **Primary** — Lavender `#7B61FF`. Primary CTAs, active nav state, key headings, logo gradient top.
- **Primary dark** — Deep Purple `#6A52E5`. Secondary brand accent; hover/press on primary.
- **Accent** — Coral `#EF4444`. Warning / attention.
- **Secondary accent** — Peach `#F59E0B`.
- **Success / Mint** — `#22C5A7`. Logo gradient bottom, success chips, positive metrics. `+` in the wordmark.
- **Success dark** — `#22C5A7`.
- **Pink/Magenta** — `#EF4444`. Flagged vitals, cardio.
- **Blue** — `#3B82F6`. Informational.
- **Gold** — `#F59E0B`. Pending / warning.
- **Grays (Tailwind-adjacent):** `#0F1B2E` body text, `#6B7280` secondary, `#94A3B8` tertiary / placeholder, `#D1D5DC` + `#E5E7EB` + `#EEEEEE` borders, `#F0EDFF` lavender tint, `#F8FAFC` canvas, `#FEF5E7` coral tint, `#E6F8F4` mint tint, `#FFFFFF` surface.

### Type

**Inter** is the primary face across all portals (Regular, Semi Bold 600, Bold 700). **Montserrat** (Bold) appears in brand moments / the logo lockup; **Dancing Script** shows up on signature affordances; **JetBrains Mono** (Bold) is used for codes and IDs (MRN, ICD-10, time strings).

Scale:

- **14 / 400** Inter — default body (line-height 20px)
- **14 / 600** Inter — labels, nav text
- **12 / 400** Inter — metadata, captions
- **12 / 600** Inter — small emphatic (status chips, all-caps)
- **16 / 700** Inter — section titles
- **24 / 700** Inter — card-grid titles, stat values
- **30 / 700** Inter — greeting / page hero

### Spacing + radius

- Spacing follows **4 / 8 / 12 / 16 / 24 / 32 / 64**. Flex `gap: 12` and `gap: 24` dominate.
- **Radius**: `4–5px` on nav items, buttons, inputs. `12–16px` on most cards. `24px` on hero cards (login shell). `9999px` for pill chips.
- Page canvas: fixed `1920×945`, `64px` header, `280px` side nav.

### Elevation

- `shadow-sm`: `0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.1)` — login card, modals, toasts.
- Default: no shadow — borders carry the elevation.

### Backgrounds + surfaces

- Canvas is always `#F8FAFC`. Not a gradient, not an image.
- **Tinted tiles** are a core motif: `#F0EDFF` lavender, `#FEF5E7` coral, `#E6F8F4` mint — used as section backgrounds, status chips, category pills.
- **Logo gradient** (the ONLY gradient in the system): `linear-gradient(#7B61FF 37%, #22C5A7 100%)` on the circular mark.

### Borders

- `1px solid #E5E7EB` for inputs, dividers, cards.
- `1px solid #D1D5DC` for heavier containers.
- Dashed purple strokes in Figma are layout guides — never render.

### Hover / press

- Nav item hover: bg `#FFFFFF` → `#F1F5F9`.
- Active nav: bg `#7B61FF`, text + icon white, radius `4px`.
- Primary button press: darken to `#6A52E5`.
- No bounces, no scale transforms. `~150ms` opacity / bg fades.

### Motion

Minimal — this is an EMR surface. `120–200ms` for hover/press, `240ms` for panel open, `400ms` for modal. `ease-out` enter, `ease-in` exit. No springs, no parallax.

### Transparency / blur

- Modals use `rgba(0,0,0,0.4)` overlay. No backdrop-filter blur.

### Corner radii summary

| Use | Radius |
|-----|--------|
| Inputs, buttons, nav items | 4–5 px |
| Cards, panels | 12–16 px |
| Login / hero shell | 24 px |
| Status chips | 9999 px |
| Circular mark / avatar | 9999 px |

## Iconography

The Figma file carries **thin-stroke outline 24×24 icons** at ~2px stroke. Style closely matches **Lucide**. Decisions:

- SVGs from the Figma are copied into `assets/` for the logo and brand-specific glyphs.
- Generic UI icons use **Lucide via CDN** — same stroke style. Flagged as a substitution.
- **No emoji. No unicode-as-icon.**

The **Otangeles Notes+ mark** is a lavender→mint gradient circle with a white stethoscope/ECG glyph — see `assets/logo-vector.svg`.

## Wordmark

Three colors, one line:
- `Otangeles` — `#7B61FF` lavender
- ` Note` — `#0F1B2E` near-black
- `+` — `#22C5A7` mint

Set in **Montserrat Bold**, letter-spacing `-0.01em`. Do not reflow or stack; the wordmark is a single line.

## Index

```
README.md               — this file
SKILL.md                — agent skill manifest (Claude Code compatible)
colors_and_type.css     — CSS variables for color + type (Inter + Montserrat)
assets/                 — logos + key SVGs copied from Figma
preview/                — design-system preview cards (registered)
ui_kits/
  provider-portal/      — Dashboard + sidebar + header + login recreation
  encounter/            — Encounter editor recreation (HPI/ROS/PE/TP)
  scribe-portal/        — Scribe encounter queue + note
  clerk-portal/         — Clerk schedules + directory
```

## Caveats

- No codebase was provided — all recreations are from Figma pseudocode, which is approximate for per-character styles, variable aliases, and instance-override chains.
- **Fonts**: Inter + Montserrat + Dancing Script + JetBrains Mono are loaded from Google Fonts. If the team has licensed weight files, drop them in `fonts/` and switch the `@import` to `@font-face` in `colors_and_type.css`.
- **Icons**: Lucide is substituted for the generic UI icons because the Figma glyphs aren't part of a known named set. Point us at the team's icon kit and we'll swap.
- `Encounter`, `Scribe`, and `Clerk` UI kits are **stubbed** — they share primitives with the Provider Portal kit and demonstrate a few screens; not all of the 237 encounter components are recreated. Tell us which screens to push to high fidelity next.
