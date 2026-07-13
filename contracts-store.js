// contracts-store.js — Contracts & fee schedules (Phase 7a).
// The expected-payment engine every downstream surface consumes:
// - ContractsStore.payers(): contract records per payer (basis, effective dates, coverage, drift).
// - ContractsStore.cpts(): the practice's billed CPT mix (sample of the 41-code mix).
// - ContractsStore.rate(payerShort, cpt): { amount, basis } — expected allowed.
// - ContractsStore.lookup(cpt): expected allowed across all payers, side by side.
// - ContractsStore.expected(payerNameOrShort, cpt): forgiving lookup for consumers
//   (Agent Inbox at generation, Coverage revenue-at-risk, Analytics yield, Phase 7 variance queue).
// Basis semantics: CONTRACTED (exhibit loaded or public schedule) can drive appeal /
// reprocess proposals; INFERRED (from paid-claims history) is flag-only — never appeal grounds.
(function () {
  'use strict';

  // The practice's billed mix (top codes — these get chips in the UI).
  // [cpt, description, medicareBase]
  var CPTS = [
    ['99304', 'Initial NF visit, low complexity', 145.60],
    ['99305', 'Initial NF visit, moderate complexity', 208.15],
    ['99306', 'Initial NF visit, high complexity', 265.90],
    ['99307', 'Subsequent NF visit, straightforward', 72.20],
    ['99308', 'Subsequent NF visit, low complexity', 112.40],
    ['99309', 'Subsequent NF visit, moderate complexity', 148.60],
    ['99310', 'Subsequent NF visit, high complexity', 212.40],
    ['99315', 'NF discharge management, 30 min or less', 110.80],
    ['99316', 'NF discharge management, over 30 min', 162.30],
    ['99497', 'Advance care planning, first 30 min', 86.40]
  ];

  function money(n) { return Math.round(n * 100) / 100; }

  // Full fee-schedule catalog beyond the billed mix (Phase 10.5) — a sample of
  // the ~2,800-code 2026 catalog; the lookup is search-first so scale is in the
  // interaction, not the array length.
  var CATALOG_EXTRA = [
    ['99202', 'Office visit, new patient, straightforward', 74.90],
    ['99203', 'Office visit, new patient, low complexity', 115.30],
    ['99204', 'Office visit, new patient, moderate complexity', 172.10],
    ['99205', 'Office visit, new patient, high complexity', 227.60],
    ['99211', 'Office visit, established, minimal', 24.60],
    ['99212', 'Office visit, established, straightforward', 58.90],
    ['99213', 'Office visit, established, low complexity', 94.20],
    ['99214', 'Office visit, established, moderate complexity', 133.40],
    ['99215', 'Office visit, established, high complexity', 187.10],
    ['99221', 'Initial hospital care, low complexity', 105.70],
    ['99222', 'Initial hospital care, moderate complexity', 143.30],
    ['99223', 'Initial hospital care, high complexity', 211.60],
    ['99231', 'Subsequent hospital care, straightforward', 41.20],
    ['99232', 'Subsequent hospital care, moderate complexity', 75.80],
    ['99233', 'Subsequent hospital care, high complexity', 109.10],
    ['99238', 'Hospital discharge, 30 min or less', 78.20],
    ['99239', 'Hospital discharge, over 30 min', 115.40],
    ['99341', 'Home visit, new patient, straightforward', 58.10],
    ['99342', 'Home visit, new patient, low complexity', 87.30],
    ['99347', 'Home visit, established, straightforward', 57.50],
    ['99348', 'Home visit, established, low complexity', 88.60],
    ['99417', 'Prolonged E/M service, each 15 min', 31.40],
    ['99483', 'Cognitive assessment & care planning', 268.40],
    ['99490', 'Chronic care management, first 20 min/mo', 60.50],
    ['99491', 'CCM by physician, first 30 min/mo', 82.20],
    ['99495', 'Transitional care mgmt, moderate complexity', 203.10],
    ['99496', 'Transitional care mgmt, high complexity', 275.20],
    ['99498', 'Advance care planning, each addl 30 min', 74.90],
    ['90832', 'Psychotherapy, 30 min', 74.10],
    ['90833', 'Psychotherapy, 30 min, with E/M', 68.70],
    ['90853', 'Group psychotherapy', 27.80],
    ['96127', 'Brief emotional/behavioral assessment', 4.90],
    ['96372', 'Therapeutic injection, subq/IM', 14.20],
    ['G0402', 'Welcome to Medicare visit', 168.30],
    ['G0438', 'Annual wellness visit, initial', 172.60],
    ['G0439', 'Annual wellness visit, subsequent', 134.10],
    ['G2211', 'Visit complexity add-on', 15.90],
    ['11042', 'Debridement, subq tissue, first 20 sq cm', 96.70],
    ['11056', 'Paring of 2–4 lesions', 44.80],
    ['G0180', 'Home health certification', 53.10]
  ];
  var CATALOG = CPTS.concat(CATALOG_EXTRA);

  // Per-payer contract records. `mult` scales the Medicare base into the payer's
  // contracted / public / inferred rate; `missing` lists billed CPTs with no rate.
  var PAYERS = [
    {
      short: 'Medicare of Indiana', names: ['Medicare of Indiana', 'Medicare of Michigan', 'Medicare FFS', 'Medicare'],
      basis: 'PUBLIC', basisLabel: 'Public schedule', mult: 1.00, missing: [],
      effective: 'Jan 1, 2026', timelyFiling: 365, covered: 41, billed: 41,
      source: '2026 Medicare Physician Fee Schedule, IN locality 00 — ships pre-loaded',
      versions: [
        { eff: 'Jan 1, 2026', note: '2026 PFS final rule rates', by: 'System (pre-loaded)' },
        { eff: 'Jan 1, 2025', note: '2025 PFS rates', by: 'System (pre-loaded)' }
      ],
      validation: { payments: 412, agree: 409, window: 'last 90 days' }, drift: null
    },
    {
      short: 'Indiana Medicaid', names: ['Indiana Medicaid', 'IN Medicaid', 'Medicaid'],
      basis: 'PUBLIC', basisLabel: 'Public schedule', mult: 0.82, missing: ['99497'],
      effective: 'Jan 1, 2026', timelyFiling: 90, covered: 39, billed: 41,
      source: 'IHCP professional fee schedule — ships pre-loaded',
      versions: [{ eff: 'Jan 1, 2026', note: 'IHCP annual update', by: 'System (pre-loaded)' }],
      validation: { payments: 188, agree: 184, window: 'last 90 days' }, drift: null
    },
    {
      short: 'MHS HIP', names: ['MHS Healthy Indiana Plan', 'MHS HIP', 'MHS (Managed Health Services)', 'MHS'],
      basis: 'EXHIBIT', basisLabel: 'Exhibit loaded', mult: 0.95, missing: ['99497', '99316'],
      effective: 'Mar 1, 2025', timelyFiling: 90, covered: 38, billed: 41,
      source: 'Contract exhibit B-2, flat per-CPT — keyed in from PDF by Angela Mensah',
      versions: [
        { eff: 'Mar 1, 2025', note: 'Exhibit B-2, current term', by: 'Angela Mensah · Apr 14, 2025' },
        { eff: 'Mar 1, 2024', note: 'Exhibit B-1, prior term', by: 'Angela Mensah · Mar 2024' }
      ],
      validation: { payments: 96, agree: 61, window: 'last 90 days' },
      drift: {
        cpt: '99309', contracted: 141.20, avgPaid: 125.70, pct: 89, payments: 30,
        firstSeen: 'Jun 14, 2026', status: 'proposed',
        summary: 'Last 30 payments on 99309 averaged $125.70 against the loaded $141.20 — 89% of contract, consistently, since Jun 14. Pattern holds across all four facilities.',
        proposal: 'Agent proposes a rate review: verify the exhibit against the payer\u2019s current fee schedule, then queue the underpaid population (30 claims, $465 variance) for reprocess requests once confirmed.'
      }
    },
    {
      short: 'Anthem MA', names: ['Anthem MA', 'Anthem Blue Cross Blue Shield', 'Anthem HIP', 'Anthem BCBS'],
      basis: 'EXHIBIT', basisLabel: 'Exhibit loaded', mult: 1.02, missing: ['99497'],
      effective: 'Jul 1, 2025', timelyFiling: 90, covered: 40, billed: 41,
      source: 'Contract exhibit A, flat per-CPT — loaded from CSV',
      versions: [
        { eff: 'Jul 1, 2025', note: 'Renewal exhibit, +2% over PFS', by: 'Angela Mensah · Jul 3, 2025' },
        { eff: 'Jul 1, 2024', note: 'Prior term exhibit', by: 'Angela Mensah · 2024' }
      ],
      validation: { payments: 74, agree: 72, window: 'last 90 days' }, drift: null
    },
    {
      short: 'UHC Medicare Complete', names: ['UHC Medicare Complete', 'UHC Community Plan', 'UHC'],
      basis: 'EXHIBIT', basisLabel: 'Exhibit loaded', mult: 1.00, missing: ['99315', '99316', '99497'],
      effective: 'Jan 1, 2026', timelyFiling: 90, covered: 34, billed: 41,
      source: 'Contract exhibit, flat per-CPT — 7 low-volume codes not in exhibit (inferred)',
      versions: [{ eff: 'Jan 1, 2026', note: 'Calendar-year exhibit', by: 'Rob Tanaka · Jan 9, 2026' }],
      validation: { payments: 58, agree: 55, window: 'last 90 days' }, drift: null
    },
    {
      short: 'Aetna MA HMO', names: ['Aetna MA HMO', 'Aetna Better Health', 'Aetna'],
      basis: 'EXHIBIT', basisLabel: 'Exhibit loaded', mult: 1.01, missing: ['99497'],
      effective: 'Sep 1, 2025', timelyFiling: 120, covered: 40, billed: 41,
      source: 'Contract exhibit, flat per-CPT — loaded from CSV',
      versions: [{ eff: 'Sep 1, 2025', note: 'Current term exhibit', by: 'Angela Mensah · Sep 2025' }],
      validation: { payments: 41, agree: 40, window: 'last 90 days' }, drift: null
    },
    {
      short: 'Humana MA PPO', names: ['Humana MA PPO', 'Humana'],
      basis: 'INFERRED', basisLabel: 'Inferred from payments', mult: 0.97, missing: [],
      effective: '\u2014', timelyFiling: 180, covered: 41, billed: 41,
      source: 'No exhibit on file — rates inferred from 214 paid claims since Oct 2025. Flag-only: never grounds for an appeal.',
      versions: [],
      validation: { payments: 214, agree: 201, window: 'since Oct 2025' },
      drift: {
        cpt: '99310', contracted: 206.00, avgPaid: 197.40, pct: 96, payments: 18,
        firstSeen: 'Jul 2, 2026', status: 'flag',
        summary: 'Inferred 99310 rate is drifting — the last 18 payments averaged $197.40 vs the $206.00 historical center. Variance band is widening.',
        proposal: 'Inferred rate — flag only. No appeal or reprocess can be proposed from an inferred rate. Recommended: request the Humana exhibit so the rate becomes contractable.'
      }
    },
    {
      short: 'Provider Partners', names: ['Provider Partners Health Plan', 'Provider Partners'],
      basis: 'INFERRED', basisLabel: 'Inferred from payments', mult: 0.94, missing: ['99306', '99497'],
      effective: '\u2014', timelyFiling: 180, covered: 39, billed: 41,
      source: 'No exhibit on file — rates inferred from 62 paid claims. Flag-only.',
      versions: [],
      validation: { payments: 62, agree: 57, window: 'since Nov 2025' }, drift: null
    }
  ];

  function rateRow(p, c) {
    if (p.missing.indexOf(c[0]) >= 0) return null;
    // Catalog codes outside the billed mix: exhibits only cover contracted lists;
    // inferred payers have no history for codes never billed.
    var inMix = CPTS.some(function (x) { return x[0] === c[0]; });
    if (!inMix && p.basis === 'INFERRED') return null;
    var amt = money(c[2] * p.mult);
    // The MHS drift narrative pins 99309 at the loaded exhibit figure.
    if (p.short === 'MHS HIP' && c[0] === '99309') amt = 141.20;
    return { amount: amt, basis: p.basis === 'INFERRED' ? 'INFERRED' : 'CONTRACTED' };
  }

  function findPayer(name) {
    if (!name) return null;
    var n = String(name).toLowerCase();
    for (var i = 0; i < PAYERS.length; i++) {
      var p = PAYERS[i];
      for (var j = 0; j < p.names.length; j++) {
        var pn = p.names[j].toLowerCase();
        if (pn === n || n.indexOf(pn) >= 0 || pn.indexOf(n) >= 0) return p;
      }
    }
    return null;
  }

  window.ContractsStore = {
    cpts: function () {
      return CPTS.map(function (c) { return { cpt: c[0], desc: c[1], medicare: c[2] }; });
    },
    catalog: function () {
      return CATALOG.map(function (c) { return { cpt: c[0], desc: c[1], medicare: c[2] }; });
    },
    catalogSize: 2847,
    searchCatalog: function (q, cap) {
      q = String(q || '').trim().toLowerCase();
      if (!q) return [];
      var hits = CATALOG.filter(function (c) {
        return c[0].toLowerCase().indexOf(q) === 0 || c[1].toLowerCase().indexOf(q) >= 0;
      });
      return hits.slice(0, cap || 8).map(function (c) { return { cpt: c[0], desc: c[1], medicare: c[2] }; });
    },
    payers: function () { return PAYERS.slice(); },
    rate: function (payerShort, cpt) {
      var p = findPayer(payerShort);
      var c = CATALOG.filter(function (x) { return x[0] === cpt; })[0];
      if (!p || !c) return null;
      return rateRow(p, c);
    },
    lookup: function (cpt) {
      var c = CATALOG.filter(function (x) { return x[0] === cpt; })[0];
      if (!c) return [];
      return PAYERS.map(function (p) {
        var r = rateRow(p, c);
        return { payer: p.short, basis: p.basis, basisTag: r ? r.basis : null, amount: r ? r.amount : null, drift: p.drift && p.drift.cpt === cpt ? p.drift : null };
      });
    },
    // Forgiving consumer entry point (7a.2+): full payer name or short → expected allowed.
    expected: function (payerName, cpt) {
      var p = findPayer(payerName);
      if (!p) return null;
      return this.rate(p.short, cpt);
    },
    driftFlags: function () {
      return PAYERS.filter(function (p) { return p.drift; }).map(function (p) {
        return Object.assign({ payer: p.short, basis: p.basis }, p.drift);
      });
    }
  };
})();
