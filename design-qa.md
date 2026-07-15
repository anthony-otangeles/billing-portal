# Design QA — Billing Portal shell consistency

## Source of truth

- Rendered Admin Portal: `/home/tony-desktop/Development/Otangeles AI/admin-portal-vue/`
- Reference screenshot: `/tmp/admin-portal-shell-1440.png`
- Reference viewport: 1440 × 900, desktop, authenticated Platform Admin dashboard

## Implementation under review

- Billing Portal: `/home/tony-desktop/Development/Otangeles AI/billing-portal/`
- Primary screenshot: `/tmp/billing-shell-pass2.png`
- Wide-page screenshots:
  - `/tmp/billing-settings-after-wide2.png`
  - `/tmp/billing-agent-after-wide2.png`
  - `/tmp/billing-claim-after-wide2.png`
  - `/tmp/billing-practice-after-wide.png`
  - `/tmp/billing-ops-final.png`

## Comparison evidence

- Full-shell comparison: `/tmp/admin-billing-shell-comparison-pass2.png`
- Focused header comparison: `/tmp/admin-billing-shell-focus-pass2.png`
- Admin/Billing expanded navigation-footer comparison: `/tmp/admin-billing-nav-footer-comparison.png`
- Admin/Billing collapsed navigation comparison: `/tmp/admin-billing-nav-collapsed-comparison2.png`
- Same-state comparison viewport: 1440 × 900

## Comparison history

### Pass 1

- Comparison: `/tmp/admin-billing-shell-comparison-pass1.png`
- P2: Billing's collapse control remained at the top of the sidebar instead of the Admin Portal footer position.
- P1: The first annotation selector only covered screen labels containing “Billing” or “Ops Admin,” so pages with labels such as Settings, Agent Inbox, and Claim Detail retained their capped main containers.
- P2: Ops navigation active detection also matched transparent borders, giving inactive rows the mint active treatment.
- Fixes: moved the collapse control to the persistent footer, expanded shell targeting to every included product page, supported nested `ops-nav`, and keyed Ops active states to the component's actual `active` attribute.

### Pass 2

- Compared the source and implementation together at 1440 × 900, then inspected representative pages at 1920 × 1080.
- Header height, logo sizing, title treatment, search styling, sidebar width, group labels, item density, neutral hover surface, mint active state, and footer placement visibly match the Admin Portal shell.
- Billing-only header controls were intentionally preserved and aligned to the shared shell.
- No remaining P1 or P2 visual issues found.

### Follow-up iteration — navigation footer and Practice search

- P2: The Billing control had the correct 40px button but not the Admin Portal's complete footer-row anatomy; its collapsed state also initially remained directly below the navigation items.
- Fix: reproduced the Admin footer divider, copyright label, 24px mint double-chevron, 40px bordered button, and 12px collapsed bottom inset. The collapsed Admin and Billing controls now both measure 72px sidebar width, 40 × 40px button size, 24 × 24px icon size, and x = 15.5px.
- Added a 340px Practice chooser with an automatically focused search field, case-insensitive name/metadata filtering, bounded scroll area, no-results state, Escape/Arrow Down/Enter keyboard handling, and selection persistence for any practice ID present in the source list.
- Practice search validation: “west” returned only Westbrook Family Medicine; an unmatched query returned “No practices found”; Enter selected and persisted `wfm`.
- Screenshots: `/tmp/billing-nav-footer-final.png`, `/tmp/billing-nav-collapsed-final2.png`, `/tmp/billing-practice-search-open.png`, and `/tmp/billing-practice-search-filtered.png`.
- Final collapsed-nav cleanup removed the legacy divider and suppressed the Overview group divider, leaving zero visible separators above Dashboard while preserving separators between subsequent groups. Screenshot: `/tmp/billing-nav-collapsed-separators-fixed.png`.

## Functional and layout validation

- Browser smoke check covered 26 active Billing and Ops pages with zero failures.
- Every checked header measured 64px.
- Every shell sidebar measured 260px expanded.
- Every checked main container's right edge matched the viewport edge at 1600px.
- Practice Billing View measured 1920px wide at a 1920px viewport.
- Billing navigation interaction remained functional: 260px expanded → 72px collapsed → 260px restored.
- The final collapsed control is pinned 12px above the sidebar bottom, matching the Admin Portal.
- Practice filtering, empty state, keyboard selection, and persisted selection passed in the browser.
- `node --check portal-shell-consistency.js` passed.
- `node --check practice-switcher.js` passed.
- `git diff --check` passed.

## Final result

passed
