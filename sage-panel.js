// Billing Portal — Sage, the portal assistant (Phase 11).
// A read-only navigator docked on every screen. Finds, aggregates, explains,
// and navigates over the same shared stores every screen renders — and never
// processes a claim. Deterministic intent engine by default; a Live AI toggle
// hands interpretation to Claude when available.
// Guardrails: no action verbs, scoped to the selected practice, sessions logged.
(function () {
  if (customElements.get('sage-panel')) return;

  // Ensure shared stores are loaded.
  function ensureScript(src, globalName) {
    if (window[globalName]) return;
    if (document.querySelector('script[src="' + src + '"]')) return;
    var s = document.createElement('script');
    s.src = src;
    document.head.appendChild(s);
  }
  ensureScript('./claims-store.js', 'ClaimsStore');
  ensureScript('./contracts-store.js', 'ContractsStore');

  // ---------- shared constants ----------
  var LAVENDER = '#845EC2', LAV_DARK = '#67568C', MINT = '#00C9A7';
  var INK = '#0F1B2E', SUB = '#6B7280', FAINT = '#94A3B8';
  var BORDER = '#E5E7EB', TINT = '#F5F2FD', TINT2 = '#F1EEFF';

  var SPARK = function (size, color) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.7L19.6 10l-5.7 1.9L12 17.6l-1.9-5.7L4.4 10l5.7-1.9z"></path><path d="M19 15l.7 2.1L21.8 18l-2.1.7L19 20.8l-.7-2.1-2.1-.7 2.1-.7z"></path></svg>';
  };

  // Open decisions (mirrors the Agent Inbox groups; static index like search-bar's).
  var DECISIONS = [
    { label: 'MHS underpaid 99309 — 12-claim reprocess batch', sub: 'Variance disposition · $186.00', href: 'Payments.dc.html', kind: 'writeoff' },
    { label: 'Rate review — MHS HIP drift on 99309', sub: 'Contracts · 89% of contract since Jun 14', href: 'Contracts.dc.html', kind: 'rate' },
    { label: 'Humana takeback — post & reopen for COB rebilling', sub: 'Variance disposition · $212.40', href: 'Payments.dc.html', kind: 'takeback' },
    { label: 'Secondary claim review — Medigap, no auto-crossover', sub: 'Secondary Billing Agent', href: 'Agent Inbox v3.dc.html', kind: 'secondary' },
    { label: 'Stalled crossover — 14 days silent, submit direct', sub: 'Secondary Billing Agent', href: 'Agent Inbox v3.dc.html', kind: 'secondary' },
    { label: 'Returned mail — address unknown', sub: 'Patient Balance Agent', href: 'Agent Inbox v3.dc.html', kind: 'patient' },
    { label: 'Payment plan request — 4 × $85', sub: 'Patient Balance Agent', href: 'Agent Inbox v3.dc.html', kind: 'patient' },
    { label: 'Collections proposal — cycle exhausted, veto window open', sub: 'Patient Balance Agent', href: 'Agent Inbox v3.dc.html', kind: 'patient' },
    { label: 'Write-off request — $9.20 residual (reason SB)', sub: 'Payment Reconciliation Agent', href: 'Agent Inbox v3.dc.html', kind: 'writeoff' },
    { label: 'E/M coding — 99308 vs 99309 with expected payment', sub: 'Coding Agent', href: 'Agent Inbox v3.dc.html', kind: 'coding' }
  ];

  var SCREENS = [
    { keys: ['home', 'dashboard', 'today'], label: 'Billing Home', href: 'Billing Home.dc.html' },
    { keys: ['register', 'claims register', 'all claims'], label: 'Claims Register', href: 'Claims Register.dc.html' },
    { keys: ['worklist', 'ar worklist', 'a/r', 'call list'], label: 'AR Worklist', href: 'AR Worklist.dc.html' },
    { keys: ['inbox', 'decisions', 'agent inbox', 'approvals'], label: 'Agent Inbox', href: 'Agent Inbox v3.dc.html' },
    { keys: ['payments', 'deposits', 'posting', 'reconcil', 'statements', 'era'], label: 'Payments', href: 'Payments.dc.html' },
    { keys: ['contracts', 'fee schedule', 'rates', 'rate review', 'enrollment'], label: 'Contracts & Fee Schedules', href: 'Contracts.dc.html' },
    { keys: ['coverage', 'eligibility', 'cob stack'], label: 'Coverage', href: 'Coverage.dc.html' },
    { keys: ['analytics', 'reports', 'kpi'], label: 'Analytics', href: 'Analytics.dc.html' },
    { keys: ['settings', 'thresholds', 'autonomy'], label: 'Settings', href: 'Settings.dc.html' },
    { keys: ['rulebook', 'rules', 'agents work'], label: 'Rulebook', href: 'Rulebook.dc.html' },
    { keys: ['claim detail'], label: 'Claim Detail', href: 'Claim Detail.dc.html' }
  ];

  // Explain dictionary — remark codes + portal vocabulary (matches glossary.js voice).
  var CODES = {
    'co-22': 'CO-22 — “This care may be covered by another payer per coordination of benefits.” The payer thinks someone else is primary. The fix is sorting policy primacy on the Coverage screen, then resubmitting to the right payer.',
    'co-29': 'CO-29 — “The time limit for filing has expired.” A timely-filing denial. If the clearinghouse acceptance shows on-time submission, it is appealable with proof — the Denial Triage Agent drafts that packet automatically.',
    'co-45': 'CO-45 — “Charge exceeds fee schedule / maximum allowable.” The routine contractual adjustment: the gap between what was billed and the contracted allowed amount. Expected on nearly every paid claim.',
    'co-97': 'CO-97 — “Payment is included in the allowance for another service.” A bundling denial: the payer says this service is part of another billed procedure.',
    'co-197': 'CO-197 — “Precertification / authorization absent.” No prior auth on file. The practice must request retro-authorization; the agent routes that request to the practice Front Office.',
    'co-253': 'CO-253 — Sequestration. A federal 2% reduction applied to Medicare payments. It is expected, not an underpayment — Payment Reconciliation posts it automatically as a contractual adjustment.',
    'pr-1': 'PR-1 — Deductible. Patient responsibility: the payer applied this amount to the patient’s deductible, so the balance moves to the patient after all payers finish.',
    'pr-2': 'PR-2 — Coinsurance. Patient responsibility after the payer’s share, often picked up by a secondary (e.g. Medigap) before it ever reaches a statement.',
    'pr-3': 'PR-3 — Copayment. A fixed patient-responsibility amount for the visit.'
  };
  var TERMS = [
    { keys: ['835', 'era', 'remittance'], text: 'The 835 (electronic remittance advice) is the payer’s itemized statement of what it paid, adjusted, or denied on each claim line. Posting runs on the Payments screen apply 835s to claims automatically.' },
    { keys: ['837'], text: 'The 837 is the electronic claim itself — the file the Submission Agent sends to the clearinghouse. Once it goes out, the balance sits with the primary payer.' },
    { keys: ['takeback', 'recoupment'], text: 'A takeback (recoupment) is a payer reclaiming money it previously paid — it arrives as a negative line inside a remittance. The deposit still has to balance, so the reversal posts against the original claim and the claim reopens if someone else should now pay.' },
    { keys: ['crossover'], text: 'A crossover is Medicare automatically forwarding a claim to the secondary payer (like Medigap) after it pays. When the crossover doesn’t happen, the Secondary Billing Agent proposes submitting to the secondary directly — that decision shows in the Agent Inbox.' },
    { keys: ['cob', 'coordination of benefits'], text: 'Coordination of benefits (COB) is the ordering of payers when a patient has more than one coverage: primary pays first, then secondary, then tertiary. The Coverage screen holds each patient’s COB stack; CO-22 denials mean the payer disputes that order.' },
    { keys: ['timely filing'], text: 'Timely filing is each payer’s deadline for receiving a claim, counted from the date of service — 90 days for many commercial payers, 365 for Medicare. The worklist tracks days left per claim; breaches are appealable only with proof of on-time submission.' },
    { keys: ['medigap'], text: 'Medigap is Medicare supplement insurance — a secondary payer that picks up deductibles and coinsurance after Medicare pays. Most Medigap claims cross over automatically; the ones that don’t appear as Secondary Billing Agent decisions.' },
    { keys: ['allowed amount', 'allowable'], text: 'The allowed amount is what the contract says the payer will recognize for a code — the billed charge above it writes off as CO-45. Payment below the allowed amount is a variance worth disputing.' },
    { keys: ['variance'], text: 'A variance is a payment that doesn’t match the expected allowed amount and doesn’t explain itself with standard adjustment codes. Variances queue on the Payments screen with a disposition proposal — reprocess, appeal, or accept.' },
    { keys: ['drift'], text: 'Rate drift is a payer quietly paying below the contracted (or inferred) rate across many claims. The Contracts screen flags drift with the payment evidence; contracted drift can ground a reprocess batch, inferred drift is flag-only.' },
    { keys: ['inferred'], text: 'An INFERRED rate is reverse-engineered from paid history when no fee-schedule exhibit is on file. Good enough to flag suspicious payments, never grounds for an appeal — that requires a CONTRACTED rate from a loaded exhibit.' },
    { keys: ['write-off', 'writeoff', 'write off'], text: 'A write-off removes a balance from the books with a reason code. Small residuals auto-post under the Settings threshold; anything larger becomes a governed request in the Agent Inbox with an Ops ceiling above it.' },
    { keys: ['statement cycle', 'statement'], text: 'Patient statements go out on a 3-statement cycle once the balance becomes patient responsibility. After the cycle exhausts with no contact, the Patient Balance Agent proposes collections — the practice holds a veto window before any handoff.' },
    { keys: ['uncollectible'], text: 'UNCOLLECTIBLE-REQUESTED means the statement cycle exhausted and the collections proposal is waiting out the practice veto window. The balance stays on the books until the export is approved.' },
    { keys: ['balance owner', 'who owes'], text: 'Every open balance has one owner at a time: PRIMARY → SECONDARY (→ TERTIARY) → PATIENT → ZERO. Each transition is triggered by a document (837 out, 835 posted, last EOB). The Register’s “Balance owner” filter slices by it.' },
    { keys: ['crossover stalled', 'stalled'], text: 'A stalled crossover is one Medicare should have forwarded but the secondary has been silent 14+ days. The Secondary Billing Agent proposes submitting direct — that decision is in the Agent Inbox.' }
  ];

  // Per-screen suggested prompts.
  var PROMPTS = {
    home: ['What needs me today?', 'How much open AR do we have?', 'Which payers are underpaying us?'],
    register: ['Show denied claims over $100', 'Claims sitting with secondary payers', 'Aged 90+ claims'],
    detail: ['Why was this claim paid less than expected?', 'What does CO-253 mean?', 'Where does this balance sit?'],
    worklist: ['Which claims are due today?', 'Show timely filing risks', 'What does “claim not on file” mean?'],
    inbox: ['Which decisions are waiting on me?', 'Show the write-off requests', 'Why did the agent hold the secondary claims?'],
    payments: ['What needs me today?', 'How much is MHS underpaying on 99309?', 'What is a takeback?'],
    contracts: ['Which rates are drifting?', 'What is our rate for 99309?', 'Which payers have no exhibit on file?'],
    coverage: ['Show claims denied for COB', 'What is a crossover?', 'Show coverage-terminated claims'],
    analytics: ['Open AR by facility', 'Which payer has the most open claims?', 'How much are we underpaid overall?'],
    settings: ['What do the write-off thresholds do?', 'Take me to the Rulebook', 'Who can approve above my ceiling?'],
    rulebook: ['Explain the timely filing rule', 'What does the Secondary Billing Agent do?', 'What is a variance?'],
    practice: ['What do you need from me?', 'Why would a claim be on hold?', 'How much is outstanding for us?']
  };

  function money(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------- deterministic engine ----------

  var STATUS_WORDS = [
    ['denied', 'Denied'], ['submitted', 'Submitted'], ['appealed', 'Appealed'],
    ['partially paid', 'Partially paid'], ['partial', 'Partially paid'], ['underpaid', 'Partially paid'],
    ['on hold', 'On hold'], ['draft', 'Draft'], ['ready to submit', 'Ready to submit'], ['paid', 'Paid']
  ];
  var REASON_WORDS = [
    ['timely filing', 'timely'], ['timely', 'timely'], ['cob', 'cob'], ['coordination', 'cob'],
    ['prior auth', 'priorauth'], ['authorization', 'priorauth'], ['coverage terminated', 'coverageterm'],
    ['termed', 'coverageterm'], ['not on file', 'notonfile'], ['reprocess', 'reprocess'], ['underpay', 'underpay'], ['va ', 'vahold']
  ];
  var OWNER_WORDS = [
    ['secondary payer', 'SECONDARY'], ['secondary', 'SECONDARY'], ['tertiary', 'TERTIARY'],
    ['patient balance', 'PATIENT'], ['patient responsibility', 'PATIENT'], ['with the patient', 'PATIENT'], ['primary payer', 'PRIMARY'], ['with primary', 'PRIMARY']
  ];

  function payerNames() {
    var out = [];
    if (window.ContractsStore) {
      window.ContractsStore.payers().forEach(function (p) {
        p.names.forEach(function (n) { out.push([n.toLowerCase(), n, p.short]); });
      });
    }
    // Claims-side payer strings not covered by contracts.
    ['Medicare of Indiana', 'Medicare of Michigan', 'Indiana Medicaid', 'Veterans Administration', 'UHC Medicare Complete', 'Anthem Blue Cross Blue Shield', 'Anthem HIP', 'Aetna MA HMO', 'MHS (Managed Health Services)', 'Humana MA PPO', 'Provider Partners Health Plan'].forEach(function (n) {
      out.push([n.toLowerCase(), n, n]);
    });
    // Common shorthands → claims payer strings.
    [['medicare', 'Medicare of Indiana'], ['medicaid', 'Indiana Medicaid'], ['humana', 'Humana MA PPO'], ['mhs', 'MHS (Managed Health Services)'], ['uhc', 'UHC Medicare Complete'], ['anthem', 'Anthem Blue Cross Blue Shield'], ['aetna', 'Aetna MA HMO'], ['va', 'Veterans Administration'], ['provider partners', 'Provider Partners Health Plan']].forEach(function (x) {
      out.push([x[0], x[1], x[1]]);
    });
    out.sort(function (a, b) { return b[0].length - a[0].length; });
    return out;
  }

  // Claims-store payer strings are the source of truth for filtering — any
  // matched contracts/shorthand name must resolve to one of these.
  var CLAIM_PAYERS = ['MHS (Managed Health Services)', 'Provider Partners Health Plan', 'Anthem Blue Cross Blue Shield', 'UHC Medicare Complete', 'Medicare of Michigan', 'Medicare of Indiana', 'Veterans Administration', 'Indiana Medicaid', 'Humana MA PPO', 'Aetna MA HMO', 'Anthem HIP'];
  function toClaimsPayer(name) {
    if (CLAIM_PAYERS.indexOf(name) >= 0) return name;
    var n = String(name).toLowerCase();
    // exact-prefix / containment either way, longest claims name wins
    for (var i = 0; i < CLAIM_PAYERS.length; i++) {
      var cp = CLAIM_PAYERS[i].toLowerCase();
      if (cp.indexOf(n) >= 0 || n.indexOf(cp) >= 0) return CLAIM_PAYERS[i];
    }
    // first-word match (e.g. 'MHS HIP' → 'MHS (Managed Health Services)')
    var first = n.split(/[\s(]/)[0];
    for (i = 0; i < CLAIM_PAYERS.length; i++) {
      if (CLAIM_PAYERS[i].toLowerCase().indexOf(first) === 0) return CLAIM_PAYERS[i];
    }
    return name;
  }

  function parseFilters(ql) {
    var f = {}, labels = [];
    var m;
    // payer
    var pn = payerNames();
    for (var i = 0; i < pn.length; i++) {
      var re = new RegExp('(^|[^a-z])' + pn[i][0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z])');
      if (re.test(ql)) { f.payer = toClaimsPayer(pn[i][1]); labels.push('Payer: ' + f.payer); break; }
    }
    // status
    for (i = 0; i < STATUS_WORDS.length; i++) {
      if (ql.indexOf(STATUS_WORDS[i][0]) >= 0) { f.status = STATUS_WORDS[i][1]; labels.push('Status: ' + STATUS_WORDS[i][1]); break; }
    }
    // reason / archetype
    for (i = 0; i < REASON_WORDS.length; i++) {
      if (ql.indexOf(REASON_WORDS[i][0]) >= 0) { f.archKey = REASON_WORDS[i][1]; labels.push('Reason: ' + REASON_WORDS[i][0].trim()); break; }
    }
    if (f.archKey === 'underpay') { delete f.status; }
    // owner
    for (i = 0; i < OWNER_WORDS.length; i++) {
      if (ql.indexOf(OWNER_WORDS[i][0]) >= 0) { f.owner = OWNER_WORDS[i][1]; labels.push('Balance owner: ' + OWNER_WORDS[i][1]); break; }
    }
    // amounts
    if ((m = ql.match(/(?:over|above|more than|>)\s*\$?\s*([\d,]+)/))) { f.minBal = parseFloat(m[1].replace(/,/g, '')); labels.push('Balance over ' + money(f.minBal)); }
    if ((m = ql.match(/(?:under|below|less than|<)\s*\$?\s*([\d,]+)/))) { f.maxBal = parseFloat(m[1].replace(/,/g, '')); labels.push('Balance under ' + money(f.maxBal)); }
    // aging
    if (/(90\+|aged 90|over 90 day|older than 90)/.test(ql)) { f.bucket = '90+'; labels.push('Age: 90+ days'); }
    else if (/61.90|60.90/.test(ql)) { f.bucket = '61-90'; labels.push('Age: 61–90 days'); }
    else if (/31.60|30.60/.test(ql)) { f.bucket = '31-60'; labels.push('Age: 31–60 days'); }
    else if (/0.30 day|under 30 day|last 30 day/.test(ql)) { f.bucket = '0-30'; labels.push('Age: 0–30 days'); }
    // due today
    if (/due today|needs? me today|today.s (calls|work)/.test(ql)) { f.dueToday = true; labels.push('Due today'); }
    // this month
    if (/this month/.test(ql)) { f.thisMonth = true; labels.push('DOS: July'); }
    // facility
    var facs = ['Niles Care Center', 'Maplewood Skilled Nursing', 'Cedar Ridge Post-Acute', 'Harborview Rehab', 'Westbrook Main Office'];
    for (i = 0; i < facs.length; i++) {
      var fl = facs[i].toLowerCase();
      if (ql.indexOf(fl) >= 0 || ql.indexOf(fl.split(' ')[0]) >= 0 && fl.split(' ')[0].length > 4) {
        if (ql.indexOf(fl.split(' ')[0]) >= 0) { f.facility = facs[i]; labels.push('Facility: ' + facs[i]); break; }
      }
    }
    // claim id
    if ((m = ql.match(/enct\d+/))) { f.claimId = m[0].toUpperCase(); labels.push('Claim: ' + f.claimId); }
    // open only (default for population asks)
    if (/open|outstanding|sitting|owed|unpaid|balance/.test(ql)) { f.openOnly = true; }
    return { filters: f, labels: labels, any: labels.length > 0 || f.openOnly };
  }

  var NAME_STOP = ['over', 'under', 'above', 'below', 'show', 'shows', 'claim', 'claims', 'denied', 'with', 'balance', 'balances', 'open', 'just', 'only', 'than', 'more', 'less', 'paid', 'unpaid', 'today', 'month', 'payer', 'payers', 'patient', 'patients', 'those', 'these', 'sitting', 'owed', 'from', 'that', 'what', 'which', 'find', 'aged', 'days', 'dollars', 'medicare', 'medicaid', 'humana', 'anthem', 'aetna', 'appealed', 'submitted', 'hold', 'draft', 'ready', 'secondary', 'tertiary', 'primary', 'facility', 'outstanding', 'filing', 'timely', 'terminated', 'coverage', 'file', 'auth', 'prior'];
  function matchName(ql, claims) {
    // last names are distinctive uppercase words in the store
    var tokens = ql.replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(function (t) { return t.length >= 4 && NAME_STOP.indexOf(t) < 0; });
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i].toUpperCase();
      var hit = claims.filter(function (c) { return c.patient.indexOf(t) >= 0; });
      if (hit.length && hit.length < claims.length / 4) return { token: t, rows: hit };
    }
    return null;
  }

  function applyFilters(claims, f) {
    return claims.filter(function (c) {
      if (f.openOnly && c.statusCat !== 'open') return false;
      if (f.status && c.status !== f.status) return false;
      if (f.payer && c.payer !== f.payer) return false;
      if (f.archKey && c.archKey !== f.archKey) return false;
      if (f.facility && c.facility !== f.facility) return false;
      if (f.bucket && c.bucket !== f.bucket) return false;
      if (f.minBal != null && !(c.balance > f.minBal)) return false;
      if (f.maxBal != null && !(c.balance < f.maxBal)) return false;
      if (f.dueToday && !c.dueToday) return false;
      if (f.thisMonth && c.dos.indexOf('7/') !== 0) return false;
      if (f.claimId && c.claim.indexOf(f.claimId) < 0) return false;
      if (f.patient && c.patient.indexOf(f.patient) < 0) return false;
      if (f.owner && (window.ClaimsStore ? window.ClaimsStore.balanceOwner(c).owner : 'PRIMARY') !== f.owner) return false;
      return true;
    });
  }

  // archKeys whose register status is unique to that archetype — safe to encode.
  var ARCH_TO_STATUS = { timely: 'Appealed', underpay: 'Partially paid', notonfile: 'Accepted (277CA)', vahold: 'On hold', ready: 'Ready to submit', draft: 'Draft' };

  function registerUrl(f) {
    var p = [];
    var status = f.status || (f.archKey && ARCH_TO_STATUS[f.archKey]) || null;
    if (status) p.push('status=' + encodeURIComponent(status));
    if (f.payer) p.push('payer=' + encodeURIComponent(f.payer));
    if (f.facility) p.push('facility=' + encodeURIComponent(f.facility));
    if (f.bucket) p.push('aging=' + encodeURIComponent(f.bucket));
    if (f.owner) p.push('owner=' + encodeURIComponent(f.owner));
    if (f.patient) p.push('q=' + encodeURIComponent(f.patient));
    return 'Claims Register.dc.html' + (p.length ? '?' + p.join('&') : '');
  }

  function fmtAmt(a) { return typeof a === 'number' ? money(a) : String(a); }

  // Honest exit ramp: only promise “these” when the Register can reproduce the
  // whole set; otherwise name the slice it CAN show, or offer nothing.
  function registerRamp(f) {
    var kept = [];
    if (f.status || (f.archKey && ARCH_TO_STATUS[f.archKey])) kept.push('status');
    if (f.payer) kept.push('payer');
    if (f.facility) kept.push('facility');
    if (f.bucket) kept.push('age');
    if (f.owner) kept.push('owner');
    if (f.patient) kept.push('patient');
    var dropped = [];
    if (f.minBal != null || f.maxBal != null) dropped.push('amount');
    if (f.dueToday) dropped.push('due-today');
    if (f.thisMonth) dropped.push('date');
    if (f.claimId) dropped.push('claim ID');
    if (f.archKey && !ARCH_TO_STATUS[f.archKey] && !f.status) dropped.push('reason');
    if (!kept.length) return null; // the Register can't reproduce any of it
    if (!dropped.length) return { label: 'Open these in the Register', href: registerUrl(f) };
    return { label: 'Open the nearest Register slice (' + kept.join(' + ') + ' — without ' + dropped.join('/') + ')', href: registerUrl(f) };
  }

  var GUARD = /\b(approve|reject|write (off|these|it)|write-off these|submit|resubmit|rebill|post (it|this|these)|void|deny|adjust|waive|delete|edit|change the|update the|mark (it|this|these)|send (a|the)? ?(statement|to collections)|reprocess (it|this|these))\b/;
  var QUESTIONISH = /^(why|what|how|when|where|who|which|explain|is |are |does |do |can (i|we) see|show)/;

  // Builds the deterministic answer object.
  // { kind, text, chips[], rows[], links[], ramps[], note }
  function answer(q, ctx) {
    var ql = q.toLowerCase().trim();
    var store = window.ClaimsStore;
    var all = store ? store.getAllClaims() : [];
    var practiceLabel = store ? store.meta().practiceLabel : '';

    // ---- guardrail: action requests decline ----
    if (GUARD.test(ql) && !QUESTIONISH.test(ql)) {
      var governed = /write|residual/.test(ql) ? { label: 'Write-off requests → Agent Inbox', href: 'Agent Inbox v3.dc.html' }
        : /post|deposit|takeback|variance/.test(ql) ? { label: 'Posting & variances → Payments', href: 'Payments.dc.html' }
        : /statement|collection/.test(ql) ? { label: 'Statements & collections → Payments', href: 'Payments.dc.html' }
        : { label: 'Open decisions → Agent Inbox', href: 'Agent Inbox v3.dc.html' };
      return {
        kind: 'decline',
        text: 'That’s an action, and actions aren’t mine to take — I find, explain, and navigate, but approving, editing, and submitting stay in the governed queues where they’re reviewed and logged. Here’s the right door:',
        links: [governed]
      };
    }

    // ---- explain: remark codes ----
    var cm = ql.match(/\b(co|pr)[\s-]?(\d{1,3})\b/);
    if (cm) {
      var code = cm[1] + '-' + cm[2];
      if (CODES[code]) {
        return { kind: 'explain', text: CODES[code], links: [{ label: 'All denial playbooks → Rulebook', href: 'Rulebook.dc.html' }] };
      }
      return { kind: 'miss', text: 'I don’t have ' + code.toUpperCase() + ' in my playbook. The codes I can explain right now: ' + Object.keys(CODES).map(function (k) { return k.toUpperCase(); }).join(', ') + '. The Rulebook has the full denial catalog.', links: [{ label: 'Open the Rulebook', href: 'Rulebook.dc.html' }] };
    }

    // ---- explain: underpayment / drift narrative ----
    if (/underpay|drift|paying (us )?(below|less|short)/.test(ql) && window.ContractsStore) {
      var flags = window.ContractsStore.driftFlags();
      var pf = parseFilters(ql).filters;
      var rel = pf.payer ? flags.filter(function (d) { return pf.payer.toLowerCase().indexOf(d.payer.split(' ')[0].toLowerCase()) >= 0; }) : flags;
      if (!rel.length) rel = flags;
      var txt = rel.map(function (d) {
        return d.payer + ' — ' + d.cpt + ' paying ' + money(d.avgPaid) + ' vs ' + money(d.contracted) + ' expected (' + d.pct + '%, ' + d.payments + ' payments since ' + d.firstSeen + '). ' + (d.status === 'open' || d.basis !== 'INFERRED' ? 'Contracted rate — a reprocess batch can be grounded on it.' : 'Inferred rate — flag only; the exhibit request is the recommended path.');
      }).join('  ');
      // also the live underpay population
      var upRows = applyFilters(all, { archKey: 'underpay', openOnly: true, payer: pf.payer });
      var upSum = upRows.reduce(function (s, c) { return s + c.balance; }, 0);
      return {
        kind: 'aggregate',
        text: 'Two lenses on underpayment at ' + practiceLabel + '. Rate drift the Contracts engine is tracking: ' + txt + ' And on the books right now: ' + upRows.length + ' open underpaid claims holding ' + money(upSum) + ' in disputed balance.',
        rows: upRows.slice(0, 4),
        links: [
          { label: 'Drift flags → Contracts', href: 'Contracts.dc.html' },
          { label: 'Variance queue → Payments', href: 'Payments.dc.html' }
        ],
        ramps: [{ label: 'Open underpaid claims in the Register', href: registerUrl({ status: 'Partially paid' }) }]
      };
    }

    // ---- explain: rate lookup (CPT) ----
    var cptm = ql.match(/\b(99\d{3}|g0\d{3})\b/);
    if (cptm && window.ContractsStore && /rate|allowed|pay|contract|worth|expect/.test(ql)) {
      var cpt = cptm[1].toUpperCase();
      var pf2 = parseFilters(ql).filters;
      if (pf2.payer) {
        var short2 = pf2.payer;
        var r = window.ContractsStore.expected(short2, cpt);
        if (r) {
          return { kind: 'explain', text: short2 + ' on ' + cpt + ': ' + fmtAmt(r.amount) + ' expected (' + r.basis + (r.basis === 'INFERRED' ? ' — from paid history, flag-only' : ' — from the loaded exhibit') + ').', links: [{ label: 'Full rate table → Contracts', href: 'Contracts.dc.html?cpt=' + encodeURIComponent(cpt) }] };
        }
        return { kind: 'miss', text: 'No rate on file for ' + short2 + ' on ' + cpt + ' — either the code isn’t in their exhibit or there’s no paid history to infer from. The Contracts lookup shows every payer side-by-side.', links: [{ label: 'Look up ' + cpt + ' → Contracts', href: 'Contracts.dc.html?cpt=' + encodeURIComponent(cpt) }] };
      }
      var rows2 = window.ContractsStore.lookup(cpt).filter(function (x) { return x.amount; });
      if (rows2.length) {
        return {
          kind: 'explain',
          text: cpt + ' across your payers: ' + rows2.slice(0, 6).map(function (x) { return x.payer + ' ' + fmtAmt(x.amount) + (x.basis === 'INFERRED' ? '*' : ''); }).join(' · ') + (rows2.some(function (x) { return x.basis === 'INFERRED'; }) ? '  (* inferred from payments)' : ''),
          links: [{ label: 'Full lookup with drift flags → Contracts', href: 'Contracts.dc.html?cpt=' + encodeURIComponent(cpt) }]
        };
      }
    }

    // ---- explain: no exhibit / inferred payers ----
    if (/no exhibit|without (an )?exhibit|inferred payers|which payers are inferred/.test(ql) && window.ContractsStore) {
      var inf = window.ContractsStore.payers().filter(function (p) { return p.basis === 'INFERRED'; });
      return {
        kind: 'explain',
        text: inf.length + ' payers have no fee-schedule exhibit on file — their rates are inferred from paid history and are flag-only: ' + inf.map(function (p) { return p.short + ' (' + p.validation.payments + ' payments)'; }).join(', ') + '. Requesting the exhibit is what turns a flag into an appealable rate.',
        links: [{ label: 'Payer list → Contracts', href: 'Contracts.dc.html' }]
      };
    }

    // ---- explain: vocabulary ----
    for (var ti = 0; ti < TERMS.length; ti++) {
      var hitKey = TERMS[ti].keys.some(function (k) { return ql.indexOf(k) >= 0; });
      if (hitKey && /\b(what|whats|mean|means|meaning|explain|how|why|define)\b|\bis (a|an|the)\b|\?$/.test(ql)) {
        return { kind: 'explain', text: TERMS[ti].text, links: [{ label: 'How the agents handle it → Rulebook', href: 'Rulebook.dc.html' }] };
      }
    }

    // ---- write-off thresholds / governance ----
    if (/threshold|ceiling|who can approve|autonomy/.test(ql)) {
      return {
        kind: 'explain',
        text: 'Write-off governance runs in three tiers: residuals under the practice threshold auto-post with a reason code; anything above it becomes a request in the Agent Inbox for a biller to approve; and amounts above the Ops ceiling escalate past the billing company entirely. Every tier logs to the Audit Log.',
        links: [{ label: 'Thresholds → Settings', href: 'Settings.dc.html' }, { label: 'Pending requests → Agent Inbox', href: 'Agent Inbox v3.dc.html' }]
      };
    }

    // ---- decisions waiting ----
    if (/(decision|waiting on me|needs? my (approval|review)|approvals? (pending|waiting)|what.s in the inbox)/.test(ql)) {
      var kindF = /write.?off/.test(ql) ? 'writeoff' : /secondary|crossover/.test(ql) ? 'secondary' : /patient|statement|collection/.test(ql) ? 'patient' : null;
      var ds = kindF ? DECISIONS.filter(function (d) { return d.kind === kindF; }) : DECISIONS;
      return {
        kind: 'find',
        text: 'The Inbox holds the live queue — these are the standing decision types waiting across the agents' + (kindF ? ' (' + kindF + ')' : '') + '. They stay there until you (or someone with the right tier) decide — I can only point:',
        decisionRows: ds.slice(0, 6),
        links: [{ label: 'Live queue → Agent Inbox', href: 'Agent Inbox v3.dc.html' }]
      };
    }

    // ---- "what needs me today" ----
    if (/needs? (me|attention)|what.s (urgent|first|today)|start (my|the) (day|morning)|do first/.test(ql)) {
      var due = all.filter(function (c) { return c.dueToday; });
      var dueSum = due.reduce(function (s, c) { return s + c.balance; }, 0);
      return {
        kind: 'aggregate',
        text: 'Your morning at ' + practiceLabel + ': ' + due.length + ' claims are due for follow-up today (' + money(dueSum) + ' in balance), the Agent Inbox is holding decisions across the agents, and 2 deposits on Payments still need a disposition. That order — decisions, deposits, calls — clears the most dollars first.',
        rows: due.slice(0, 4),
        links: [
          { label: 'Decisions → Agent Inbox', href: 'Agent Inbox v3.dc.html' },
          { label: 'Deposits needing you → Payments', href: 'Payments.dc.html' },
          { label: 'Today’s calls → AR Worklist', href: 'AR Worklist.dc.html' }
        ]
      };
    }

    // ---- navigate ----
    if (/take me|go to|open the|навig|where (is|do i)|show me the/.test(ql) || (/^open |^show /.test(ql) && SCREENS.some(function (s) { return s.keys.some(function (k) { return ql.indexOf(k) >= 0; }); }))) {
      var navHits = SCREENS.filter(function (s) { return s.keys.some(function (k) { return ql.indexOf(k) >= 0; }); });
      if (/audit log/.test(ql)) navHits = [{ label: 'Audit Log (Ops portal)', href: 'Ops Audit Log.dc.html' }];
      if (/rate review|mhs.*review/.test(ql)) navHits = [{ label: 'MHS rate review → Contracts', href: 'Contracts.dc.html' }];
      if (navHits.length) {
        return { kind: 'navigate', text: navHits.length === 1 ? 'Right this way.' : 'A few places match — pick one:', links: navHits.map(function (s) { return { label: s.label, href: s.href }; }) };
      }
    }

    // ---- aggregate ----
    if (/how much|total|sum|open ar|a\/?r (is|do)|by facility|by payer|most (open|denials|claims)|collect/.test(ql)) {
      var open = all.filter(function (c) { return c.statusCat === 'open'; });
      var openSum = open.reduce(function (s, c) { return s + c.balance; }, 0);
      if (/by facility/.test(ql)) {
        var byFac = {};
        open.forEach(function (c) { byFac[c.facility] = (byFac[c.facility] || { n: 0, sum: 0 }); byFac[c.facility].n++; byFac[c.facility].sum += c.balance; });
        var facTxt = Object.keys(byFac).map(function (k) { return k + ': ' + money(byFac[k].sum) + ' (' + byFac[k].n + ' claims)'; }).join(' · ');
        return { kind: 'aggregate', text: 'Open AR by facility at ' + practiceLabel + ' — ' + facTxt + '. Total: ' + money(openSum) + ' across ' + open.length + ' open claims.', links: [{ label: 'Charts → Analytics', href: 'Analytics.dc.html' }] };
      }
      if (/by payer|most (open|denials|claims)/.test(ql)) {
        var byP = {};
        open.forEach(function (c) { byP[c.payer] = (byP[c.payer] || { n: 0, sum: 0 }); byP[c.payer].n++; byP[c.payer].sum += c.balance; });
        var top = Object.keys(byP).map(function (k) { return { k: k, n: byP[k].n, sum: byP[k].sum }; }).sort(function (a, b) { return b.sum - a.sum; }).slice(0, 5);
        return {
          kind: 'aggregate',
          text: 'Top payers by open balance at ' + practiceLabel + ': ' + top.map(function (t) { return t.k + ' ' + money(t.sum) + ' (' + t.n + ')'; }).join(' · ') + '.',
          links: [{ label: 'Payer mix → Analytics', href: 'Analytics.dc.html' }],
          ramps: top.slice(0, 1).map(function (t) { return { label: 'Open ' + t.k + ' claims in the Register', href: registerUrl({ payer: t.k }) }; })
        };
      }
      if (/collect/.test(ql)) {
        var agg = store ? store.aggregate() : null;
        if (agg) return { kind: 'aggregate', text: 'Across the register at ' + practiceLabel + ': ' + money(agg.paidAll) + ' collected against ' + money(agg.billedAll) + ' billed, with ' + money(agg.openAr) + ' still open on ' + agg.openCount + ' claims.', links: [{ label: 'Trends → Analytics', href: 'Analytics.dc.html' }] };
      }
      return {
        kind: 'aggregate',
        text: 'Open AR at ' + practiceLabel + ' is ' + money(openSum) + ' across ' + open.length + ' claims. Oldest bucket (90+ days) holds ' + money(open.filter(function (c) { return c.bucket === '90+'; }).reduce(function (s, c) { return s + c.balance; }, 0)) + '.',
        links: [{ label: 'Aging detail → Analytics', href: 'Analytics.dc.html' }],
        ramps: [{ label: 'Browse the full Register (all statuses)', href: registerUrl({}) }]
      };
    }

    // ---- find / refine ----
    var parsed = parseFilters(ql);
    var nameHit = matchName(ql, all);
    if (nameHit) { parsed.filters.patient = nameHit.token; parsed.labels.push('Patient: ' + nameHit.token); parsed.any = true; }

    var refining = ctx.workingSet && parsed.labels.length > 0 && /^(just|only|and|now|narrow|of those|those|filter|drop|over|under|above|below)/.test(ql);
    // short refinement like "just humana" also counts even without cue if a set exists and query is short
    if (ctx.workingSet && parsed.labels.length > 0 && ql.split(/\s+/).length <= 4 && !/^(show|find|list|all|which|what|give|open|any|how)/.test(ql)) refining = true;

    if (parsed.any || refining) {
      var f2 = refining ? Object.assign({}, ctx.workingSet.filters, parsed.filters) : parsed.filters;
      var labCat = function (l) { return l.indexOf(':') > 0 ? l.slice(0, l.indexOf(':')) : l.split(' ').slice(0, 2).join(' '); };
      var newCats = parsed.labels.map(labCat);
      var lab2 = refining ? ctx.workingSet.labels.filter(function (l) { return newCats.indexOf(labCat(l)) < 0; }).concat(parsed.labels) : parsed.labels;
      if (!refining && !f2.status && !f2.claimId && !f2.patient && f2.openOnly === undefined) f2.openOnly = true;
      var rows3 = applyFilters(all, f2);
      var sum3 = rows3.reduce(function (s, c) { return s + c.balance; }, 0);
      if (!rows3.length) {
        return {
          kind: 'miss',
          text: 'Nothing at ' + practiceLabel + ' matches that combination' + (lab2.length ? ' (' + lab2.join(', ') + ')' : '') + '. I won’t invent a number — the nearest thing I can show is the unfiltered population.',
          ramps: [{ label: 'Open the Register unfiltered', href: 'Claims Register.dc.html' }],
          clearSet: true
        };
      }
      return {
        kind: 'find',
        text: (refining ? 'Narrowed: ' : 'Found: ') + rows3.length + ' claims · ' + money(sum3) + ' in balance.',
        chips: lab2,
        rows: rows3.slice(0, 5),
        workingSet: { filters: f2, labels: lab2, count: rows3.length, sum: sum3 },
        ramps: [registerRamp(f2), { label: 'Save as a Register view', action: 'saveView' }].filter(function (r) { return r; })
      };
    }

    // ---- honest miss ----
    return {
      kind: 'miss',
      text: 'I can’t answer that from the practice data I can see. I’m good at four things: finding claims (“denied claims over $100”), adding them up (“open AR by facility”), explaining (“what does CO-253 mean?”), and navigating (“take me to Contracts”). Try one of those shapes?',
      links: [{ label: 'Or search everything', href: null }]
    };
  }

  // ---------- component ----------

  class SagePanel extends HTMLElement {
    connectedCallback() {
      var screen = this.getAttribute('screen') || 'home';
      var isPractice = screen === 'practice';
      this._screen = screen;
      this.style.cssText = 'display:block;font-family:Inter,-apple-system,sans-serif;';

      this.innerHTML =
        '<button id="sg-open" title="Ask Sage (' + (navigator.platform.indexOf('Mac') >= 0 ? '\u2318' : 'Ctrl+') + 'K)" style="height:40px;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;flex-shrink:0;padding:0 14px;border-radius:5px;border:1px solid #D6CCFF;background:' + TINT2 + ';color:' + LAV_DARK + ';font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;">' +
          SPARK(15, LAVENDER) + 'Ask Sage' +
        '</button>' +
        '<div id="sg-panel" style="position:fixed;top:0;right:0;bottom:0;width:412px;max-width:92vw;background:#FFFFFF;border-left:1px solid ' + BORDER + ';box-shadow:-18px 0 48px rgba(15,27,46,0.14);z-index:950;display:flex;flex-direction:column;transform:translateX(105%);transition:transform 240ms ease-out;">' +
          // header
          '<div style="padding:14px 18px 12px;border-bottom:1px solid ' + BORDER + ';display:flex;align-items:center;gap:10px;flex-shrink:0;">' +
            '<span style="width:32px;height:32px;border-radius:9999px;background:linear-gradient(' + LAVENDER + ' 37%, ' + MINT + ' 100%);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">' + SPARK(16, '#FFFFFF') + '</span>' +
            '<div style="display:flex;flex-direction:column;gap:1px;min-width:0;">' +
              '<span style="font-size:15px;font-weight:700;color:' + INK + ';">Sage</span>' +
              '<span style="font-size:11px;color:' + SUB + ';">Finds, explains, navigates. Never processes.</span>' +
            '</div>' +
            '<div style="flex:1;"></div>' +
            '<label id="sg-livewrap" title="Interpret questions with live AI instead of the scripted engine" style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;user-select:none;">' +
              '<span style="font-size:10px;font-weight:700;color:' + FAINT + ';letter-spacing:0.05em;">LIVE AI</span>' +
              '<span id="sg-toggle" style="width:30px;height:17px;border-radius:9999px;background:#D1D5DC;position:relative;transition:background 150ms;"><span id="sg-knob" style="position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:9999px;background:#FFFFFF;transition:left 150ms;box-shadow:0 1px 2px rgba(0,0,0,0.2);"></span></span>' +
            '</label>' +
            '<button id="sg-close" style="border:none;background:transparent;cursor:pointer;padding:6px;border-radius:5px;line-height:0;" title="Close (Esc)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>' +
          '</div>' +
          // thread
          '<div id="sg-thread" style="flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:12px;background:#FBFAFE;"></div>' +
          // composer
          '<div style="padding:12px 18px 8px;border-top:1px solid ' + BORDER + ';flex-shrink:0;background:#FFFFFF;">' +
            '<div style="display:flex;gap:8px;">' +
              '<input id="sg-input" placeholder="Ask about claims, payments, rates\u2026" autocomplete="off" style="flex:1;height:40px;border:1px solid #D1D5DC;border-radius:5px;padding:0 12px;font-size:13px;color:' + INK + ';font-family:inherit;outline:none;min-width:0;">' +
              '<button id="sg-send" style="height:40px;padding:0 16px;border-radius:5px;border:none;background:' + LAVENDER + ';color:#FFFFFF;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;">Ask</button>' +
            '</div>' +
            '<div id="sg-foot" style="padding:8px 2px 4px;font-size:10.5px;color:' + FAINT + ';display:flex;align-items:center;gap:6px;">' +
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="' + FAINT + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' +
              '<span id="sg-scope">Read-only \u00b7 session logged to the Audit Log</span>' +
            '</div>' +
          '</div>' +
        '</div>';

      var self = this;
      this._panel = this.querySelector('#sg-panel');
      this._thread = this.querySelector('#sg-thread');
      this._input = this.querySelector('#sg-input');
      this._live = false;
      try { this._live = localStorage.getItem('sage-live') === '1'; } catch (e) {}
      this._msgs = [];
      try { this._msgs = JSON.parse(sessionStorage.getItem('sage-thread') || '[]'); } catch (e) {}
      this._workingSet = null;
      try { this._workingSet = JSON.parse(sessionStorage.getItem('sage-set') || 'null'); } catch (e) {}
      this._open = false;
      this._isPractice = isPractice;

      this._syncToggle();
      this._renderThread();

      // scope line
      var setScope = function () {
        var label = isPractice ? 'your practice' : (window.ClaimsStore ? window.ClaimsStore.meta().practiceLabel : 'this practice');
        self.querySelector('#sg-scope').textContent = 'Read-only \u00b7 sees only ' + label + ' \u00b7 session logged to the Audit Log';
      };
      setScope();
      setTimeout(setScope, 600);

      this.querySelector('#sg-open').addEventListener('click', function () { self.toggle(true); });
      this.querySelector('#sg-close').addEventListener('click', function () { self.toggle(false); });
      this.querySelector('#sg-livewrap').addEventListener('click', function (e) {
        e.preventDefault();
        self._live = !self._live;
        try { localStorage.setItem('sage-live', self._live ? '1' : '0'); } catch (er) {}
        self._syncToggle();
        self._pushSystem(self._live
          ? 'Live AI is on — I’ll interpret free-form questions with Claude, grounded in the same practice data. Answers stay read-only and cited.'
          : 'Back to the scripted engine — every answer comes straight from the stores, deterministically.');
      });
      this.querySelector('#sg-send').addEventListener('click', function () { self._ask(); });
      this._input.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._ask(); });

      this._onKey = function (e) {
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); self.toggle(!self._open); }
        if (e.key === 'Escape' && self._open) self.toggle(false);
      };
      document.addEventListener('keydown', this._onKey);
    }

    disconnectedCallback() { if (this._onKey) document.removeEventListener('keydown', this._onKey); }

    _syncToggle() {
      var t = this.querySelector('#sg-toggle'), k = this.querySelector('#sg-knob');
      t.style.background = this._live ? MINT : '#D1D5DC';
      k.style.left = this._live ? '15px' : '2px';
    }

    toggle(open) {
      this._open = open;
      this._panel.style.transform = open ? 'translateX(0)' : 'translateX(105%)';
      if (open) { var i = this._input; setTimeout(function () { i.focus(); }, 250); this._audit('opened'); }
    }

    _audit(q) {
      try {
        var log = JSON.parse(localStorage.getItem('sage-audit') || '[]');
        log.push({ t: new Date().toISOString(), screen: this._screen, q: q });
        localStorage.setItem('sage-audit', JSON.stringify(log.slice(-100)));
      } catch (e) {}
    }

    _persist() {
      try {
        sessionStorage.setItem('sage-thread', JSON.stringify(this._msgs.slice(-30)));
        sessionStorage.setItem('sage-set', JSON.stringify(this._workingSet));
      } catch (e) {}
    }

    _pushSystem(text) {
      this._msgs.push({ role: 'sys', text: text });
      this._persist();
      this._renderThread();
    }

    _ask(preset) {
      var q = preset || this._input.value.trim();
      if (!q) return;
      this._input.value = '';
      this._msgs.push({ role: 'user', text: q });
      this._audit(q);
      var a = answer(q, { workingSet: this._workingSet });
      if (a.workingSet) this._workingSet = a.workingSet;
      if (a.clearSet) this._workingSet = null;
      this._msgs.push({ role: 'sage', a: a });
      this._persist();
      this._renderThread();
      if (this._live) this._liveFollow(q, a);
    }

    _liveFollow(q, a) {
      var self = this;
      var idx = this._msgs.length;
      this._msgs.push({ role: 'live-pending' });
      this._renderThread();
      var finish = function (text) {
        self._msgs[idx] = { role: 'live', text: text };
        self._persist();
        self._renderThread();
      };
      if (!(window.claude && window.claude.complete)) {
        finish('Live AI isn’t available in this environment, so the scripted answer above stands. In production this is where Claude would interpret the question against the same practice data — still read-only, still cited.');
        return;
      }
      var store = window.ClaimsStore;
      var open = store ? store.getAllClaims().filter(function (c) { return c.statusCat === 'open'; }) : [];
      var ctx = 'You are Sage, a read-only billing-portal assistant. You NEVER take actions (approve/edit/submit) — you find, aggregate, explain, navigate. Practice: ' + (store ? store.meta().practiceLabel : '') + '. Open claims: ' + open.length + ', open AR: ' + money(open.reduce(function (s, c) { return s + c.balance; }, 0)) + '. The deterministic engine answered: "' + (a.text || '') + '". User question: "' + q + '". Reply in 2-3 sentences, plain language, grounded only in the given figures; if you cannot know something, say so.';
      try {
        window.claude.complete(ctx).then(function (resp) {
          finish(typeof resp === 'string' ? resp : (resp && resp.completion) || 'No response.');
        }).catch(function () { finish('Live call failed — the scripted answer above stands.'); });
      } catch (e) { finish('Live call failed — the scripted answer above stands.'); }
    }

    _renderThread() {
      var self = this;
      var html = '';

      // charter + prompts when empty
      var prompts = PROMPTS[this._screen] || PROMPTS.home;
      if (!this._msgs.length) {
        html += '<div style="background:' + TINT + ';border:1px solid #D6CCFF;border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:6px;">' +
          '<span style="font-size:12.5px;font-weight:700;color:' + LAV_DARK + ';">I’ve read everything on this side of the portal.</span>' +
          '<span style="font-size:12px;line-height:18px;color:' + SUB + ';">Ask me to find claims, add them up, explain a code or a payment, or take you somewhere. I don’t approve, edit, or submit — those stay in your queues.</span>' +
        '</div>';
      }
      html += '<div style="display:flex;flex-direction:column;gap:6px;">' +
        (!this._msgs.length ? '<span style="font-size:10px;font-weight:700;color:' + FAINT + ';letter-spacing:0.07em;text-transform:uppercase;">Try asking</span>' : '') +
        (!this._msgs.length ? prompts.map(function (p) {
          return '<button class="sg-prompt" data-q="' + esc(p) + '" style="text-align:left;border:1px solid ' + BORDER + ';background:#FFFFFF;border-radius:9999px;padding:8px 14px;font-size:12.5px;color:' + INK + ';font-family:inherit;cursor:pointer;">' + esc(p) + '</button>';
        }).join('') : '') +
      '</div>';

      this._msgs.forEach(function (m) {
        if (m.role === 'user') {
          html += '<div style="align-self:flex-end;max-width:85%;background:' + TINT2 + ';border:1px solid #D6CCFF;border-radius:12px 12px 3px 12px;padding:9px 13px;font-size:13px;line-height:19px;color:' + INK + ';">' + esc(m.text) + '</div>';
        } else if (m.role === 'sys') {
          html += '<div style="align-self:center;max-width:92%;font-size:11px;line-height:16px;color:' + FAINT + ';text-align:center;padding:2px 8px;">' + esc(m.text) + '</div>';
        } else if (m.role === 'live-pending') {
          html += '<div style="align-self:flex-start;font-size:11.5px;color:' + FAINT + ';padding:2px 6px;">Live AI thinking\u2026</div>';
        } else if (m.role === 'live') {
          html += '<div style="align-self:flex-start;max-width:92%;background:#F0FBF8;border:1px solid #B8EADF;border-radius:12px 12px 12px 3px;padding:10px 13px;display:flex;flex-direction:column;gap:5px;">' +
            '<span style="font-size:9.5px;font-weight:700;color:#0B7D6C;letter-spacing:0.07em;">LIVE AI</span>' +
            '<span style="font-size:12.5px;line-height:19px;color:' + INK + ';">' + esc(m.text) + '</span></div>';
        } else if (m.role === 'sage') {
          html += self._renderAnswer(m.a);
        }
      });

      this._thread.innerHTML = html;
      this._thread.scrollTop = this._thread.scrollHeight;

      this._thread.querySelectorAll('.sg-prompt').forEach(function (b) {
        b.addEventListener('click', function () { self._ask(b.dataset.q); });
      });
      this._thread.querySelectorAll('.sg-save').forEach(function (b) {
        b.addEventListener('click', function () { self._saveView(); });
      });
      this._thread.querySelectorAll('.sg-chip-x').forEach(function (b) {
        b.addEventListener('click', function () { self._removeChip(b.dataset.label); });
      });
    }

    _renderAnswer(a) {
      var isDecline = a.kind === 'decline';
      var html = '<div style="align-self:flex-start;max-width:94%;background:#FFFFFF;border:1px solid ' + (isDecline ? '#F5C9C9' : BORDER) + ';border-radius:12px 12px 12px 3px;padding:12px 14px;display:flex;flex-direction:column;gap:9px;box-shadow:0 1px 2px rgba(15,27,46,0.04);">';
      if (isDecline) {
        html += '<span style="display:inline-flex;align-self:flex-start;padding:2px 9px;border-radius:9999px;background:#FEECEC;color:#DC2626;font-size:10px;font-weight:700;letter-spacing:0.05em;">NOT MY JOB \u2014 BY DESIGN</span>';
      }
      html += '<span style="font-size:12.5px;line-height:19px;color:' + INK + ';">' + esc(a.text) + '</span>';

      // filter chips
      if (a.chips && a.chips.length) {
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px;">' + a.chips.map(function (c) {
          return '<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 6px 3px 10px;border-radius:9999px;background:' + TINT2 + ';border:1px solid #D6CCFF;font-size:11px;font-weight:600;color:' + LAV_DARK + ';">' + esc(c) +
            '<button class="sg-chip-x" data-label="' + esc(c) + '" title="Remove this filter" style="border:none;background:transparent;cursor:pointer;padding:0;line-height:0;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="' + LAV_DARK + '" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"></path></svg></button></span>';
        }).join('') + '</div>';
      }

      // claim citations
      if (a.rows && a.rows.length) {
        html += '<div style="display:flex;flex-direction:column;border:1px solid ' + BORDER + ';border-radius:8px;overflow:hidden;">' + a.rows.map(function (c, i) {
          return '<a href="Claim Detail.dc.html" style="display:flex;flex-direction:column;gap:1px;padding:7px 11px;text-decoration:none;background:#FFFFFF;' + (i ? 'border-top:1px solid #F1F5F9;' : '') + '" onmouseover="this.style.background=\'#FBFAFE\'" onmouseout="this.style.background=\'#FFFFFF\'">' +
            '<span style="font-size:12px;font-weight:700;color:' + INK + ';">' + esc(c.patient) + ' <span style="font-family:JetBrains Mono,monospace;font-weight:400;font-size:10.5px;color:' + FAINT + ';">' + esc(c.claim) + '</span></span>' +
            '<span style="font-size:11px;color:' + SUB + ';">' + esc(c.payer) + ' \u00b7 ' + esc(c.status) + ' \u00b7 ' + esc(c.facility) + ' \u00b7 balance ' + esc(c.balanceStr) + '</span></a>';
        }).join('') + '</div>';
      }

      // decision citations
      if (a.decisionRows && a.decisionRows.length) {
        html += '<div style="display:flex;flex-direction:column;border:1px solid ' + BORDER + ';border-radius:8px;overflow:hidden;">' + a.decisionRows.map(function (d, i) {
          return '<a href="' + esc(d.href) + '" style="display:flex;flex-direction:column;gap:1px;padding:7px 11px;text-decoration:none;background:#FFFFFF;' + (i ? 'border-top:1px solid #F1F5F9;' : '') + '">' +
            '<span style="font-size:12px;font-weight:700;color:' + INK + ';">' + esc(d.label) + '</span>' +
            '<span style="font-size:11px;color:' + SUB + ';">' + esc(d.sub) + '</span></a>';
        }).join('') + '</div>';
      }

      // links (citations into screens)
      if (a.links && a.links.length) {
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px;">' + a.links.map(function (l) {
          if (!l.href) return '<span style="font-size:11.5px;color:' + FAINT + ';align-self:center;">(the / search box covers exact IDs)</span>';
          return '<a href="' + esc(l.href) + '" style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:5px;border:1px solid #D6CCFF;background:' + TINT2 + ';font-size:11.5px;font-weight:600;color:' + LAV_DARK + ';text-decoration:none;">' + esc(l.label) + ' \u2192</a>';
        }).join('') + '</div>';
      }

      // exit ramps
      if (a.ramps && a.ramps.length) {
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px;border-top:1px dashed ' + BORDER + ';padding-top:8px;">' + a.ramps.map(function (r) {
          if (r.action === 'saveView') {
            return '<button class="sg-save" style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:5px;border:1px solid ' + BORDER + ';background:#FFFFFF;font-size:11.5px;font-weight:600;color:' + SUB + ';font-family:inherit;cursor:pointer;">Save as a Register view</button>';
          }
          return '<a href="' + esc(r.href) + '" style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:5px;background:' + LAVENDER + ';font-size:11.5px;font-weight:600;color:#FFFFFF;text-decoration:none;">' + esc(r.label) + ' \u2192</a>';
        }).join('') + '</div>';
      }

      html += '</div>';
      return html;
    }

    _removeChip(label) {
      if (!this._workingSet) return;
      var labels = this._workingSet.labels.filter(function (l) { return l !== label; });
      var f = this._workingSet.filters;
      var nf = {};
      // rebuild filters from remaining labels
      Object.keys(f).forEach(function (k) { nf[k] = f[k]; });
      if (/^Payer:/.test(label)) delete nf.payer;
      if (/^Status:/.test(label)) delete nf.status;
      if (/^Reason:/.test(label)) delete nf.archKey;
      if (/^Balance owner:/.test(label)) delete nf.owner;
      if (/^Balance over/.test(label)) delete nf.minBal;
      if (/^Balance under/.test(label)) delete nf.maxBal;
      if (/^Age:/.test(label)) delete nf.bucket;
      if (/^Due today/.test(label)) delete nf.dueToday;
      if (/^DOS:/.test(label)) delete nf.thisMonth;
      if (/^Facility:/.test(label)) delete nf.facility;
      if (/^Patient:/.test(label)) delete nf.patient;
      if (/^Claim:/.test(label)) delete nf.claimId;
      var all = window.ClaimsStore ? window.ClaimsStore.getAllClaims() : [];
      var rows = applyFilters(all, nf);
      var sum = rows.reduce(function (s, c) { return s + c.balance; }, 0);
      this._workingSet = { filters: nf, labels: labels, count: rows.length, sum: sum };
      this._msgs.push({ role: 'sage', a: {
        kind: 'find',
        text: 'Removed \u201c' + label + '\u201d \u2014 ' + rows.length + ' claims \u00b7 ' + money(sum) + '.',
        chips: labels, rows: rows.slice(0, 5),
        ramps: [registerRamp(nf), { label: 'Save as a Register view', action: 'saveView' }].filter(function (r) { return r; })
      } });
      this._persist();
      this._renderThread();
    }

    _saveView() {
      if (!this._workingSet) return;
      var f = this._workingSet.filters;
      var filters = {};
      if (f.status) filters.statusFilter = f.status;
      if (f.payer) filters.payerFilter = f.payer;
      if (f.facility) filters.facilityFilter = f.facility;
      if (f.bucket) filters.agingFilter = f.bucket;
      if (f.owner) filters.ownerFilter = f.owner;
      if (f.patient) filters.search = f.patient;
      var name = 'Sage \u2014 ' + this._workingSet.labels.slice(0, 2).join(', ').replace(/^(Payer|Status|Reason|Balance owner|Facility|Patient): /g, '');
      try {
        var views = JSON.parse(localStorage.getItem('onb-register-views') || '[]') || [];
        views = views.filter(function (v) { return v.name !== name; }).concat([{ name: name, filters: filters }]);
        localStorage.setItem('onb-register-views', JSON.stringify(views));
      } catch (e) {}
      var extra = (f.minBal != null || f.maxBal != null || f.dueToday || f.thisMonth) ? ' (The amount/date parts of this set live only here \u2014 the Register\u2019s filters don\u2019t slice by them yet.)' : '';
      this._pushSystem('Saved \u201c' + name + '\u201d to the Register\u2019s views.' + extra);
    }
  }

  customElements.define('sage-panel', SagePanel);
})();
