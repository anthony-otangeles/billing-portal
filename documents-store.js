// documents-store.js — Shared document & attachment store (Phase 6c, slice 1).
// Every uploaded or agent-fetched document across the portal lives here.
// - DocumentsStore.forEntity(type, id): docs attached to a need / claim / exception.
// - DocumentsStore.add(doc): practice or billing upload (persists in localStorage).
// - DocumentsStore.needStatus / setNeedStatus: state of each "billing needs from you" item,
//   readable by Coverage and the Agent Inbox (slice 2).
(function () {
  'use strict';
  var DOCS_KEY = 'onb-docs';
  var NEEDS_KEY = 'onb-needs-status';

  function loadDocs() { try { return JSON.parse(localStorage.getItem(DOCS_KEY) || '[]'); } catch (e) { return []; } }
  function saveDocs(l) { try { localStorage.setItem(DOCS_KEY, JSON.stringify(l)); } catch (e) {} }
  function loadNeeds() { try { return JSON.parse(localStorage.getItem(NEEDS_KEY) || '{}'); } catch (e) { return {}; } }
  function saveNeeds(m) { try { localStorage.setItem(NEEDS_KEY, JSON.stringify(m)); } catch (e) {} }

  // Seeded documents — agent-fetched and billing-side, so the store isn't empty on day one.
  var SEED = [
    { id: 'DOC-S1', entityType: 'need', entityId: 'moore', name: 'Medicaid redetermination packet — MOORE, CHARLES.pdf', docType: 'Redetermination packet', source: 'agent', by: 'Coverage Agent (Bell Medics)', when: 'Jul 10, 2026', size: '412 KB' },
    { id: 'DOC-S2', entityType: 'need', entityId: 'fox', name: 'COB annual form — pre-filled for signature.pdf', docType: 'COB form', source: 'agent', by: 'Coverage Agent (Bell Medics)', when: 'Jul 9, 2026', size: '188 KB' },
    { id: 'DOC-S3', entityType: 'need', entityId: 'allen', name: 'Prior-auth request + clinicals (Availity submission copy).pdf', docType: 'Auth request', source: 'agent', by: 'Coverage Agent (Bell Medics)', when: 'Jul 8, 2026', size: '650 KB' },
    { id: 'DOC-S4', entityType: 'claim', entityId: 'ENCT0000432-01', name: 'Medicare remittance advice (835) \u2014 human-readable EOB.pdf', docType: 'EOB', source: 'agent', by: 'Payment Reconciliation Agent', when: 'Jul 8, 2026', size: '96 KB', note: 'Fetched from the Medicare portal when the $7.20 variance was flagged' },
    { id: 'DOC-S5', entityType: 'claim', entityId: 'ENCT0000432-01', name: 'Clearinghouse acceptance report (277CA) \u2014 v2 submission.pdf', docType: 'Acceptance report', source: 'agent', by: 'Submission Agent', when: 'Jul 3, 2026', size: '41 KB', note: 'Proof of timely filing, kept with the claim' },
    { id: 'DOC-S6', entityType: 'claim', entityId: 'ENCT0000432-01', name: 'Signed provider note \u2014 Dr. Ibekie, DOS 07-02.pdf', docType: 'Source note', source: 'billing', by: 'Synced from Otangeles Note+', when: 'Jul 2, 2026', size: '210 KB', note: 'Never sent to the payer \u2014 on file as supporting documentation' }
  ];

  function all() { return SEED.concat(loadDocs()); }
  function forEntity(type, id) {
    return all().filter(function (d) { return d.entityType === type && d.entityId === id; });
  }
  function add(doc) {
    var l = loadDocs();
    doc.id = 'DOC-' + Date.now().toString(36).toUpperCase();
    if (!doc.when) {
      var d = new Date();
      doc.when = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }
    l.push(doc);
    saveDocs(l);
    return doc;
  }

  function needStatus(id) { return loadNeeds()[id] || { status: 'open' }; }
  function setNeedStatus(id, status, extra) {
    var m = loadNeeds();
    m[id] = Object.assign({ status: status }, extra || {});
    saveNeeds(m);
    return m[id];
  }
  function allNeedStatuses() { return loadNeeds(); }

  window.DocumentsStore = {
    all: all, forEntity: forEntity, add: add,
    needStatus: needStatus, setNeedStatus: setNeedStatus, allNeedStatuses: allNeedStatuses
  };
})();
