// claims-store.js — Single source of truth for all claims across the Billing Portal.
// Every page (Claims Register, AR Worklist, Agent Inbox, Analytics) reads from here.
// - getAllClaims(practice): the full population (all statuses) — the register.
// - openAR(practice): the open/needs-work subset — the AR Worklist (fully enriched).
// - aggregate(practice): rolled-up figures for Analytics.
// - Edit overlay (localStorage) so a touch / write-off / appeal in one page shows everywhere.
(function () {
  'use strict';

  var REPS = [['Angela Mensah', 'AM'], ['Rob Tanaka', 'RT'], ['Priya Kapoor', 'PK'], ['Sam Osei', 'SO']];
  var LAST = ['OWENS','STRYCKER','STOREY','JOHNSON','SCHULER','HUTTON','WARNER','WILLIAMS','VOREIS','SAUNDERS','GILLESPY','MARQUEZ','ALLEN','DUNCAN','MORGAN','GLOVER','LORD','PARE','RAMIREZ','WEDER','SCHEERINGA','FOLEY','HOWARD','FOX','CRIPE','BURKS','CORLEY','HOYT','WARD','MOORE','MASON','HARPER','BREAUX','WEBBS','BROCKWAY','RILEY','WILSON','HOLLOWAY','OKONKWO','ADEYEMI','VASQUEZ','KOWALSKI','TRAN','PETERSEN','GALLAGHER','NAKAMURA','OSEI','MORALES','ABERNATHY','DUBOIS'];
  var FIRST = ['STEVE','JAMES','DAVID','DEBRA','CAROLYN','ANN','CARMEN','KENT','KAREN','DENISE','ERNEST','ED','MITCHELL','JACK','TERRI','HUGO','DOREEN','BRIDGET','LEON','KELLEY','SCOTT','JEFFREY','CRAIG','WALTER','ERIC','CHARLES','RHONDA','NANNIE','JACQUELINE','MARVIN','JOHN','DIERDRE','MARCY','DANNY','GRACE','HAROLD','IRENE','JOSEPH','MARGARET','NORMAN'];

  // [name, phone, ivr, hours, category, timelyFilingLimitDays]
  var PAYERS_IFC = [
    ['Medicare of Indiana', '1-866-518-3285', 'IVR: 1 \u2192 3 \u2192 claim status', '8 AM \u2013 4 PM CT', 'Medicare', 365],
    ['Medicare of Michigan', '1-866-234-7331', 'IVR: 1 \u2192 3 \u2192 claim status', '8 AM \u2013 4 PM CT', 'Medicare', 365],
    ['Provider Partners Health Plan', '1-800-405-9681', 'IVR: 2 \u2192 claim inquiry', '8 AM \u2013 5 PM ET', 'Provider Partners', 180],
    ['Anthem Blue Cross Blue Shield', '1-800-676-2583', 'IVR: 3 \u2192 1 \u2192 status', '8 AM \u2013 6 PM ET', 'Anthem BCBS', 90],
    ['Anthem HIP', '1-844-533-1995', 'IVR: provider \u2192 claims', '8 AM \u2013 6 PM ET', 'Anthem BCBS', 90],
    ['MHS (Managed Health Services)', '1-877-647-4848', 'IVR: provider \u2192 2 \u2192 claims', '8 AM \u2013 8 PM ET', 'MHS', 90],
    ['UHC Medicare Complete', '1-877-842-3210', 'Say \u201cclaims\u201d twice', '7 AM \u2013 7 PM CT', 'UHC', 90],
    ['Humana MA PPO', '1-800-457-4708', 'IVR: provider \u2192 claim inquiry', '8 AM \u2013 8 PM ET', 'Humana', 180],
    ['Indiana Medicaid', '1-800-457-4584', 'IVR: 2 \u2192 provider \u2192 claims', '8 AM \u2013 6 PM ET', 'Medicaid', 90],
    ['Aetna MA HMO', '1-800-624-0756', 'IVR: 2 \u2192 claim status', '8 AM \u2013 5 PM ET', 'Aetna', 120]
  ];
  var PAYER_VA = ['Veterans Administration', '1-877-881-7618', 'IVR: 1 \u2192 claim status', '8 AM \u2013 6 PM ET', 'Veterans Administration', 180];
  var PAYERS_WFM = [
    ['Medicare of Indiana', '1-866-518-3285', 'IVR: 1 \u2192 3 \u2192 claim status', '8 AM \u2013 4 PM CT', 'Medicare', 365],
    ['Anthem Blue Cross Blue Shield', '1-800-676-2583', 'IVR: 3 \u2192 1 \u2192 status', '8 AM \u2013 6 PM ET', 'Anthem BCBS', 90],
    ['Aetna MA HMO', '1-800-624-0756', 'IVR: 2 \u2192 claim status', '8 AM \u2013 5 PM ET', 'Aetna', 120],
    ['UHC Medicare Complete', '1-877-842-3210', 'Say \u201cclaims\u201d twice', '7 AM \u2013 7 PM CT', 'UHC', 90],
    ['Humana MA PPO', '1-800-457-4708', 'IVR: provider \u2192 claim inquiry', '8 AM \u2013 8 PM ET', 'Humana', 180],
    ['Indiana Medicaid', '1-800-457-4584', 'IVR: 2 \u2192 provider \u2192 claims', '8 AM \u2013 6 PM ET', 'Medicaid', 90]
  ];

  var FAC_IFC = ['Niles Care Center', 'Maplewood Skilled Nursing', 'Cedar Ridge Post-Acute', 'Harborview Rehab'];
  var FAC_WFM = ['Westbrook Main Office'];

  // Kind = a bundle of (register status, statusCat, worklist archetype). weight drives the mix.
  // archKey ties an open claim to its call-prep archetype (below). closed claims have archKey ''.
  var KINDS = [
    { key: 'inprocess',    status: 'Submitted',        cat: 'open', archKey: 'inprocess',    weight: 14 },
    { key: 'notonfile',    status: 'Accepted (277CA)', cat: 'open', archKey: 'notonfile',    weight: 6 },
    { key: 'cob',          status: 'Denied',           cat: 'open', archKey: 'cob',          weight: 9 },
    { key: 'timely',       status: 'Appealed',         cat: 'open', archKey: 'timely',       weight: 6 },
    { key: 'underpay',     status: 'Partially paid',   cat: 'open', archKey: 'underpay',     weight: 7 },
    { key: 'priorauth',    status: 'Denied',           cat: 'open', archKey: 'priorauth',    weight: 6 },
    { key: 'coverageterm', status: 'Denied',           cat: 'open', archKey: 'coverageterm', weight: 6 },
    { key: 'reprocess',    status: 'Submitted',        cat: 'open', archKey: 'reprocess',    weight: 5 },
    { key: 'vahold',       status: 'On hold',          cat: 'open', archKey: 'vahold',       weight: 3, vaOnly: true },
    { key: 'ready',        status: 'Ready to submit',  cat: 'open', archKey: 'ready',        weight: 4 },
    { key: 'draft',        status: 'Draft',            cat: 'open', archKey: 'draft',         weight: 3 },
    { key: 'paid',         status: 'Paid',             cat: 'paid', archKey: '',              weight: 24 },
    { key: 'closed',       status: 'Closed',           cat: 'void', archKey: '',              weight: 5 },
    { key: 'voided',       status: 'Voided',           cat: 'void', archKey: '',              weight: 2 }
  ];

  // Status chip colors (register).
  var STATUS_STYLE = {
    'Paid': ['#E6F7F2', '#0B7D6C'], 'Closed': ['#F1F5F9', '#6B7280'], 'Submitted': ['#EBF2FE', '#1D4ED8'],
    'Accepted (277CA)': ['#F1EEFF', '#5B46D6'], 'Denied': ['#FEECEC', '#DC2626'], 'Partially paid': ['#FEF3DF', '#B45309'],
    'Appealed': ['#FFF3EF', '#C2410C'], 'On hold': ['#F1F5F9', '#6B7280'], 'Voided': ['#F1F5F9', '#94A3B8'],
    'Draft': ['#F8FAFC', '#6B7280'], 'Ready to submit': ['#F1EEFF', '#5B46D6']
  };
  var STATUS_ACTION = {
    'Paid': 'EFT posted', 'Closed': 'Reconciled & closed', 'Submitted': 'Sent to clearinghouse',
    'Accepted (277CA)': 'Clearinghouse accepted', 'Denied': 'Denial received', 'Partially paid': 'Partial remit posted',
    'Appealed': 'Appeal filed', 'On hold': 'Held \u2014 practice guidance', 'Voided': 'Voided \u2014 duplicate',
    'Draft': 'Awaiting coding review', 'Ready to submit': 'Queued for submission'
  };

  // Worklist call-prep archetypes keyed by archKey. Mirrors the AR Worklist's ARCH definitions.
  var ARCH = {
    inprocess: {
      wStatus: 'No payer response', reason: 'In Process',
      ask: 'Claim status and why no 835 after 45+ days. Get a reference number and a specific adjudication date before ending the call.',
      tl: function (c) { return [
        { who: 'A/R Follow-up Agent', tag: 'Status check', tagBg: '#F1EEFF', tagFg: '#5B46D6', dot: '#7B61FF', when: c.ago(4), text: 'Ran automated claim status (276/277) \u2014 payer returned "in process," no adjudication date. Flagged for a live call since it exceeds the payer\u2019s 30-day norm.', meta: '' },
        { who: 'Submission Agent', tag: 'Submitted', tagBg: '#F1F5F9', tagFg: '#6B7280', dot: '#94A3B8', when: c.ago(0), text: 'Claim accepted by clearinghouse; 277CA clean. No payer response since.', meta: '' }
      ]; }
    },
    notonfile: {
      wStatus: 'Claim not on file', reason: 'Claim Not on File',
      ask: 'Confirm whether the claim is on file. If not, get the correct EDI payer ID or fax, and a name for the receipt confirmation.',
      tl: function (c) { return [
        { who: 'A/R Follow-up Agent', tag: 'Status check', tagBg: '#F1EEFF', tagFg: '#5B46D6', dot: '#7B61FF', when: c.ago(2), text: 'Automated status inquiry returned "claim not found" despite a clean clearinghouse acceptance. Possible payer intake issue \u2014 needs a live call.', meta: '' }
      ]; }
    },
    cob: {
      wStatus: 'Denied \u2014 COB', reason: 'Coordination of Benefits',
      ask: 'Denied per COB \u2014 verify which coverage was active on the DOS and confirm the other policy termed. Ask the rep to resubmit for review and get a case number.',
      tl: function (c) { return [
        { who: 'Denial Triage Agent', tag: 'COB denial', tagBg: '#FEF3DF', tagFg: '#B45309', dot: '#E9C05F', when: c.ago(3), text: 'Denied CO-22 \u2014 \u201cmay be covered by another payer per coordination of benefits.\u201d Eligibility cross-check suggests the other policy termed before the DOS. Needs a live call to sort primacy.', meta: '' }
      ]; }
    },
    timely: {
      wStatus: 'Denied \u2014 appeal drafted', reason: 'Timely Filing', hasDraft: true,
      draft: 'Denied CO-29 (timely filing), but the clearinghouse acceptance report shows the original submission was accepted inside the filing window. Appeal letter + acceptance report are bundled and ready to send.',
      ask: 'If calling before filing: confirm the appeal address/fax and the review turnaround for timely-filing appeals with proof of submission.',
      tl: function (c) { return [
        { who: 'Denial Triage Agent', tag: 'Appeal drafted', tagBg: '#F1EEFF', tagFg: '#5B46D6', dot: '#7B61FF', when: c.ago(2), text: 'Denied CO-29 (timely filing). Located clearinghouse acceptance proving on-time filing \u2014 appeal packet drafted with the acceptance report attached. Ready for your approval.', meta: '' }
      ]; }
    },
    underpay: {
      wStatus: 'Underpaid \u2014 dispute open', reason: 'Underpayment',
      ask: 'Why the allowed amount is below the contracted fee schedule for this CPT. Request reprocessing; get the adjustment reference and completion date.',
      tl: function (c) { return [
        { who: 'Payment Reconciliation Agent', tag: 'Variance flagged', tagBg: '#FEF3DF', tagFg: '#B45309', dot: '#E9C05F', when: c.ago(3), text: 'Payment posted below the contracted rate. Variance does not match any standard adjustment code pattern \u2014 dispute recommended.', meta: '' }
      ]; }
    },
    priorauth: {
      wStatus: 'Prior auth required', reason: 'Prior Authorization',
      ask: 'Ask whether retro-authorization is accepted for this service and the submission window. Get the auth request fax/portal and reference number.',
      tl: function (c) { return [
        { who: 'Denial Triage Agent', tag: 'Auth denial', tagBg: '#FEF3DF', tagFg: '#B45309', dot: '#E9C05F', when: c.ago(2), text: 'Denied CO-197 \u2014 no prior authorization on file. The practice must request retro-auth; recommend requesting the payer\u2019s auth requirements from the practice Front Office.', meta: '' }
      ]; }
    },
    coverageterm: {
      wStatus: 'Coverage terminated', reason: 'Coverage Terminated',
      ask: 'Confirm the exact term date and whether the payer shows any other active coverage on file for the DOS.',
      tl: function (c) { return [
        { who: 'A/R Follow-up Agent', tag: 'Eligibility', tagBg: '#FEF3DF', tagFg: '#B45309', dot: '#E9C05F', when: c.ago(5), text: 'Eligibility (271) shows coverage terminated before the DOS. No replacement coverage in the chart \u2014 updated insurance needed from the practice.', meta: '' }
      ]; }
    },
    reprocess: {
      wStatus: 'Reprocessing promised', reason: 'In Process',
      ask: 'Confirm reprocessing completed as promised on the last call. If not finished, escalate to a supervisor and get a firm date.',
      tl: function (c) { return [
        { who: 'Priya Kapoor', tag: 'Phone call', tagBg: '#E6F7F2', tagFg: '#0B7D6C', dot: '#22C5A7', when: c.ago(10), text: 'Payer acknowledged processing error on their end. Rep initiated reprocessing, quoted 10 business days. Follow up if no payment by then.', meta: 'Rep: Marcus \u00b7 Ref #C-88' + (20000 + c.id) },
        { who: 'Payment Reconciliation Agent', tag: 'Underpayment', tagBg: '#FEF3DF', tagFg: '#B45309', dot: '#E9C05F', when: c.ago(14), text: 'Remittance posted at 40% of expected. No matching adjustment codes \u2014 flagged for payer contact.', meta: '' }
      ]; }
    },
    vahold: {
      wStatus: 'VA claim \u2014 on hold', reason: 'VA Claims (On Hold)', vaHold: true,
      ask: 'On hold per practice guidance \u2014 do not call. Awaiting VA credentialing to complete.',
      tl: function (c) { return [
        { who: 'A/R Follow-up Agent', tag: 'On hold', tagBg: '#F1F5F9', tagFg: '#6B7280', dot: '#94A3B8', when: c.ago(8), text: 'VA claims remain on hold per practice guidance until credentialing completes. Excluded from the calling queue; will resume automatically.', meta: '' }
      ]; }
    },
    ready: {
      wStatus: 'Ready to submit', reason: 'In Process',
      ask: 'No payer call needed yet \u2014 queued for submission. The Submission Agent files it automatically in the next batch.',
      tl: function (c) { return [
        { who: 'Claim Validation Agent', tag: 'Validated', tagBg: '#E6F7F2', tagFg: '#0B7D6C', dot: '#22C5A7', when: c.ago(0), text: 'Passed all payer rule checks. Queued for the next submission batch.', meta: '' }
      ]; }
    },
    draft: {
      wStatus: 'Draft \u2014 coding review', reason: 'In Process',
      ask: 'No payer call needed \u2014 awaiting coding review before submission. No action required from A/R yet.',
      tl: function (c) { return [
        { who: 'Claim Generation Agent', tag: 'Drafted', tagBg: '#F1EEFF', tagFg: '#5B46D6', dot: '#7B61FF', when: c.ago(0), text: 'Codes extracted from the signed note; awaiting a coding confidence review before validation.', meta: '' }
      ]; }
    }
  };

  var BALS = [12.97, 18.79, 21.76, 75.06, 90.54, 97.35, 100, 108.82, 135.13];
  var BILLED = [100, 108.43, 120, 125, 140, 168, 185, 210, 240, 96.5];
  var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function makeRng(seed) {
    var s = seed;
    return function () {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      var t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function money(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function moneyK(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  var _cache = {};

  function build(practice) {
    if (_cache[practice]) return _cache[practice];
    var isWFM = practice === 'wfm';
    var vol = isWFM ? 480 : 2400;
    var rnd = makeRng(isWFM ? 55123 : 20260707);
    var pick = function (a) { return a[Math.floor(rnd() * a.length)]; };

    var PAYERS = isWFM ? PAYERS_WFM.slice() : PAYERS_IFC.slice();
    var FAC = isWFM ? FAC_WFM : FAC_IFC;

    // weighted kind list (drop VA for WFM)
    var kinds = KINDS.filter(function (k) { return !(k.vaOnly && isWFM); });
    var wTotal = kinds.reduce(function (s, k) { return s + k.weight; }, 0);
    var pickKind = function () {
      var r = rnd() * wTotal;
      for (var i = 0; i < kinds.length; i++) { r -= kinds[i].weight; if (r <= 0) return kinds[i]; }
      return kinds[kinds.length - 1];
    };

    var claims = [];
    for (var i = 0; i < vol; i++) {
      var id = i + 1;
      var kind = pickKind();
      var arch = kind.archKey ? ARCH[kind.archKey] : null;
      // age distribution similar to the worklist
      var r = rnd();
      var age = r < 0.35 ? Math.floor(5 + rnd() * 25) : r < 0.65 ? Math.floor(31 + rnd() * 29) : r < 0.85 ? Math.floor(61 + rnd() * 29) : Math.floor(91 + rnd() * 160);
      var billed = pick(BILLED);
      var paid = 0, balance = 0;
      if (kind.cat === 'paid') { paid = billed; balance = 0; }
      else if (kind.cat === 'void') { paid = 0; balance = 0; }
      else if (kind.archKey === 'underpay') { paid = Math.round(billed * 0.4 * 100) / 100; balance = Math.round((billed - paid) * 100) / 100; }
      else {
        var partial = rnd() < 0.30;
        balance = partial ? pick(BALS.filter(function (b) { return b < billed; })) : billed;
        paid = partial ? Math.round((billed - balance) * 100) / 100 : 0;
      }
      // payer (VA only on vahold)
      var pi = (kind.archKey === 'vahold') ? PAYER_VA : pick(PAYERS);
      var rep = i % 3 === 0 ? REPS[0] : pick(REPS);
      var dd = new Date(2026, 6, 7 - age);
      var dos = (dd.getMonth() + 1) + '/' + dd.getDate() + '/' + String(dd.getFullYear()).slice(-2);
      // timely filing
      var filingLimit = pi[5];
      var daysLeft = filingLimit - age;
      var dlTier = daysLeft < 0 ? 'breached' : daysLeft <= 14 ? 'critical' : daysLeft <= 30 ? 'warning' : 'ok';
      var dlD = new Date(2026, 6, 7 + daysLeft);
      var dlDate = M[dlD.getMonth()] + ' ' + dlD.getDate() + (dlD.getFullYear() !== 2026 ? ' \u201927' : '');
      var isOpen = kind.cat === 'open';
      var dueToday = isOpen && kind.archKey !== 'vahold' && kind.archKey !== 'draft' && kind.archKey !== 'ready' && rnd() < 0.14;
      var fuDay = Math.floor(8 + rnd() * 20);
      var actAgo = Math.max(0, Math.floor(rnd() * Math.min(age, 20)));
      var ss = STATUS_STYLE[kind.status] || ['#F1F5F9', '#6B7280'];

      claims.push({
        id: id,
        claim: 'ENCT' + String(600 + id).padStart(7, '0') + '-01',
        patient: pick(LAST) + ', ' + pick(FIRST),
        dos: dos, age: age,
        bucket: age <= 30 ? '0-30' : age <= 60 ? '31-60' : age <= 90 ? '61-90' : '90+',
        facility: FAC[id % FAC.length],
        payer: pi[0], payerCat: pi[4], payerPhone: pi[1], ivr: pi[2], payerHours: pi[3],
        payerRef: (pi[4] === 'Medicare' ? '2126MC' : '2126PR') + (40000 + id * 7),
        filingLimit: filingLimit, daysLeft: daysLeft, dlTier: dlTier, dlDate: dlDate,
        billed: billed, paid: paid, balance: balance,
        billedStr: money(billed), paidStr: paid > 0 ? money(paid) : '$0.00', balanceStr: money(balance),
        status: kind.status, statusCat: kind.cat,
        statusBg: ss[0], statusFg: ss[1],
        archKey: kind.archKey,
        reason: arch ? arch.reason : '\u2014',
        rep: rep[0], repInitials: rep[1], mine: rep[1] === 'AM',
        dueToday: dueToday,
        nextFu: !isOpen ? '\u2014' : (dueToday ? 'Today' : 'Jul ' + fuDay),
        lastAction: (STATUS_ACTION[kind.status] || 'Updated') + ' \u00b7 ' + (actAgo === 0 ? 'today' : actAgo + 'd ago')
      });
    }

    _cache[practice] = { practice: practice, isWFM: isWFM, claims: claims,
      practiceLabel: isWFM ? 'Westbrook Family Medicine' : 'Ibekie Foundation Clinics' };
    return _cache[practice];
  }

  // ---- edit overlay (shared write-back) ----
  function ovrKey(practice) { return 'onb-claim-ovr-' + practice; }
  function getOverrides(practice) {
    try { return JSON.parse(localStorage.getItem(ovrKey(practice)) || '{}'); } catch (e) { return {}; }
  }
  function saveOverride(practice, id, patch) {
    var all = getOverrides(practice);
    all[id] = Object.assign({}, all[id], patch);
    try { localStorage.setItem(ovrKey(practice), JSON.stringify(all)); } catch (e) {}
  }
  function applyOverrides(practice, claims) {
    var ovr = getOverrides(practice);
    if (!ovr || !Object.keys(ovr).length) return claims;
    return claims.map(function (c) {
      var o = ovr[c.id];
      if (!o) return c;
      var m = Object.assign({}, c, o);
      if (o.balance != null) m.balanceStr = money(o.balance);
      if (o.paid != null) m.paidStr = o.paid > 0 ? money(o.paid) : '$0.00';
      if (o.status && STATUS_STYLE[o.status]) { m.statusBg = STATUS_STYLE[o.status][0]; m.statusFg = STATUS_STYLE[o.status][1]; }
      return m;
    });
  }

  function currentPractice() {
    try { var v = localStorage.getItem('onb-practice'); return v === 'wfm' ? 'wfm' : 'ifc'; } catch (e) { return 'ifc'; }
  }

  function getAllClaims(practice) {
    practice = practice || currentPractice();
    return applyOverrides(practice, build(practice).claims);
  }
  function openAR(practice) {
    practice = practice || currentPractice();
    return getAllClaims(practice).filter(function (c) { return c.statusCat === 'open'; });
  }
  function meta(practice) {
    practice = practice || currentPractice();
    var b = build(practice);
    return { practice: b.practice, isWFM: b.isWFM, practiceLabel: b.practiceLabel };
  }

  // Rolled-up figures for Analytics (computed from the live store).
  function aggregate(practice) {
    practice = practice || currentPractice();
    var all = getAllClaims(practice);
    var open = all.filter(function (c) { return c.statusCat === 'open'; });
    var buckets = { '0-30': { n: 0, $: 0 }, '31-60': { n: 0, $: 0 }, '61-90': { n: 0, $: 0 }, '90+': { n: 0, $: 0 } };
    open.forEach(function (c) { buckets[c.bucket].n++; buckets[c.bucket].$ += c.balance; });
    var openAr = open.reduce(function (s, c) { return s + c.balance; }, 0);
    var billedAll = all.reduce(function (s, c) { return s + c.billed; }, 0);
    var paidAll = all.reduce(function (s, c) { return s + c.paid; }, 0);
    // by payer
    var byPayer = {};
    open.forEach(function (c) {
      var k = c.payerCat;
      if (!byPayer[k]) byPayer[k] = { n: 0, $: 0, old90: 0 };
      byPayer[k].n++; byPayer[k].$ += c.balance;
      if (c.bucket === '90+') byPayer[k].old90 += c.balance;
    });
    // denial reasons
    var reasons = {};
    open.forEach(function (c) { if (c.reason && c.reason !== '\u2014') { reasons[c.reason] = (reasons[c.reason] || 0) + 1; } });
    return {
      totalClaims: all.length, openCount: open.length, openAr: openAr,
      billedAll: billedAll, paidAll: paidAll,
      pcRatio: billedAll ? Math.round(paidAll / billedAll * 100) : 0,
      buckets: buckets, byPayer: byPayer, reasons: reasons,
      past90Pct: openAr ? (buckets['90+'].$ / openAr * 100) : 0
    };
  }

  // Per-claim transaction ledger (Phase 7): charge → payments → adjustments →
  // transfers → balance, always summing to the claim's live balance.
  function ledgerFor(claim) {
    var rows = [];
    var bal = 0;
    function add(type, ref, note, amt) {
      bal = Math.round((bal + amt) * 100) / 100;
      rows.push({ type: type, ref: ref, note: note, amount: amt, balance: bal });
    }
    add('Charge', claim.claim, 'Billed charges', claim.billed);
    if (claim.paid > 0) add('ERA payment (835)', 'EFT-44' + (78000 + claim.id), 'Payer payment posted', -claim.paid);
    var adj = Math.round((claim.billed - claim.paid - claim.balance) * 100) / 100;
    if (adj > 0.004) add('Contractual adjustment', 'CO-45', 'Charge exceeds fee schedule', -adj);
    // Phase 8: ownership transitions ride the ledger (amount 0 — the balance moves, it doesn't change).
    var own = balanceOwner(claim);
    if (own.owner !== 'PRIMARY' && own.owner !== 'ZERO') {
      rows.push({ type: 'Balance moved to ' + own.owner.toLowerCase(), ref: own.trigger, note: own.detail, amount: 0, balance: bal, transfer: true });
    }
    return rows;
  }

  // Phase 8: balance ownership — a balance is owned until it is zero.
  // PRIMARY → SECONDARY → TERTIARY → PATIENT → ZERO, each transition on the ledger.
  var STATEMENT_STATES = ['pending', 'sent', 'plan'];
  function balanceOwner(c) {
    if (c.statusCat !== 'open' || c.balance <= 0) {
      return { owner: 'ZERO', trigger: '835 posted', detail: 'Balance fully resolved' };
    }
    if (c.archKey === 'cob') {
      if (c.id % 5 === 0) return { owner: 'TERTIARY', trigger: 'Secondary EOB', detail: 'Secondary adjudicated; remainder moved to the tertiary payer in the COB stack' };
      return { owner: 'SECONDARY', trigger: '835 posted', detail: 'Primary posted; balance with the secondary payer (COB stack from Coverage)' };
    }
    if (c.archKey === 'underpay' && c.id % 2 === 0) {
      // Phase 9: a slice of aged patient balances has exhausted the statement cycle
      // and been approved for the agency — handed off, still on the books.
      if (c.id % 14 === 0) return { owner: 'PATIENT', trigger: 'Collections approved', detail: 'UNCOLLECTIBLE-REQUESTED — cycle exhausted (3 statements, no contact); agency export pending the practice veto window', statement: 'collections' };
      return { owner: 'PATIENT', trigger: 'Last payer EOB', detail: 'Patient responsibility after all payers', statement: STATEMENT_STATES[c.id % 3] };
    }
    return { owner: 'PRIMARY', trigger: '837 submitted', detail: 'With the primary payer' };
  }

  window.ClaimsStore = {
    getAllClaims: getAllClaims,
    openAR: openAR,
    aggregate: aggregate,
    ledgerFor: ledgerFor,
    balanceOwner: balanceOwner,
    meta: meta,
    ARCH: ARCH,
    saveOverride: saveOverride,
    getOverrides: getOverrides,
    currentPractice: currentPractice,
    money: money, moneyK: moneyK
  };
})();
