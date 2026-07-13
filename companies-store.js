// companies-store.js — Billing companies registry for the Operations Admin portal.
// Base data + wizard-added companies and status edits persisted in localStorage 'onb-companies'.
(function () {
  'use strict';

  var BASE = [
    {
      id: 'bell', name: 'Bell Medics', status: 'Active',
      address: '2200 Commerce Dr, Suite 410, South Bend, IN 46601',
      manager: 'Derek Okafor', managerEmail: 'de******@b********.com',
      practices: ['ifc', 'wfm'], users: 5, onboarded: 'Mar 12, 2026',
      note: '',
    },
    {
      id: 'meridian', name: 'Meridian Revenue Partners', status: 'Onboarding',
      address: '880 Lakeview Pkwy, Chicago, IL 60601',
      manager: 'Invitation sent', managerEmail: 'rc******@m********.com',
      practices: [], users: 0, onboarded: '',
      note: 'Manager invitation sent Jul 7 \u2014 awaiting acceptance.',
    },
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem('onb-companies') || '{}'); } catch (e) { return {}; }
  }
  function save(d) { try { localStorage.setItem('onb-companies', JSON.stringify(d)); } catch (e) {} }

  function getCompanies() {
    var ovr = load();
    var edits = ovr.edits || {};
    var list = BASE.map(function (c) {
      var e = edits[c.id] || {};
      return Object.assign({}, c, e);
    });
    return list.concat(ovr.added || []);
  }
  function getCompany(id) {
    return getCompanies().find(function (c) { return c.id === id; }) || null;
  }
  function setStatus(id, status) {
    var ovr = load();
    var added = (ovr.added || []).find(function (c) { return c.id === id; });
    if (added) { added.status = status; save(ovr); return; }
    ovr.edits = ovr.edits || {};
    ovr.edits[id] = Object.assign({}, ovr.edits[id], { status: status });
    save(ovr);
  }
  function addCompany(c) {
    var ovr = load();
    ovr.added = ovr.added || [];
    var id = 'co-' + Date.now();
    ovr.added.push(Object.assign({
      id: id, status: 'Onboarding', practices: [], users: 0, onboarded: '',
      note: 'Manager invitation sent Jul 9 \u2014 awaiting acceptance.',
    }, c, { id: id }));
    save(ovr);
    return id;
  }
  function removeCompany(id) {
    var ovr = load();
    ovr.added = (ovr.added || []).filter(function (c) { return c.id !== id; });
    save(ovr);
  }

  window.CompaniesStore = {
    getCompanies: getCompanies,
    getCompany: getCompany,
    setStatus: setStatus,
    addCompany: addCompany,
    removeCompany: removeCompany,
    getAssignments: getAssignments,
    reassign: reassign,
    getAuditEvents: getAuditEvents,
    addAudit: addAudit,
  };

  // ---- Practice-billing assignments (Phase 4a) ----
  // Which billing company bills for each practice; reassignment persists.
  var ASSIGN_BASE = {
    ifc: { company: 'bell', since: 'Mar 12, 2026' },
    wfm: { company: 'bell', since: 'May 4, 2026' },
  };
  function getAssignments() {
    var ovr = load();
    return Object.assign({}, ASSIGN_BASE, ovr.assignments || {});
  }
  function reassign(practiceId, companyId, effective) {
    var ovr = load();
    ovr.assignments = ovr.assignments || {};
    ovr.assignments[practiceId] = { company: companyId, since: effective, transition: true };
    save(ovr);
  }

  // ---- Audit events (Phase 4a) ----
  var AUDIT_BASE = [
    { ts: 'Jul 13, 9:41 AM', type: 'company', who: 'Derek Okafor', what: 'Approved write-off', detail: 'Bell Medics \u00b7 $9.20 \u00b7 reason SB (small balance) \u00b7 approved from the Agent Inbox' },
    { ts: 'Jul 12, 3:05 PM', type: 'company', who: 'Derek Okafor', what: 'Changed write-off thresholds', detail: 'Bell Medics \u00b7 rep $50 \u00b7 manager $500 \u00b7 within the $2,500 Ops ceiling' },
    { ts: 'Jul 10, 9:04 AM', type: 'access', who: 'Michael Ops Admin', what: 'Entered Bell Medics Billing Portal', detail: 'Live access session \u00b7 read/write \u00b7 audited' },
    { ts: 'Jul 9, 4:12 PM', type: 'company', who: 'Michael Ops Admin', what: 'Onboarded billing company', detail: 'Meridian Revenue Partners created \u00b7 manager invited' },
    { ts: 'Jul 9, 9:12 AM', type: 'user', who: 'Derek Okafor', what: 'Invited AR Rep', detail: 'Bell Medics \u00b7 pending acceptance' },
    { ts: 'Jul 7, 3:20 PM', type: 'user', who: 'Derek Okafor', what: 'Updated practice assignments', detail: 'Priya Kapoor \u00b7 added Westbrook Family Medicine' },
    { ts: 'Jul 2, 11:40 AM', type: 'access', who: 'Kailee Swift', what: 'Practice Admin sign-in', detail: 'Ibekie Foundation Clinics \u00b7 2FA verified' },
    { ts: 'May 4, 2:05 PM', type: 'practice', who: 'Michael Ops Admin', what: 'Linked practice to billing company', detail: 'Westbrook Family Medicine \u2192 Bell Medics' },
    { ts: 'Mar 12, 2:41 PM', type: 'practice', who: 'Michael Ops Admin', what: 'Linked practice to billing company', detail: 'Ibekie Foundation Clinics \u2192 Bell Medics' },
    { ts: 'Mar 12, 2:38 PM', type: 'company', who: 'Michael Ops Admin', what: 'Onboarded billing company', detail: 'Bell Medics created \u00b7 Billing Manager invited' },
  ];
  function getAuditEvents() {
    var ovr = load();
    return (ovr.audit || []).concat(AUDIT_BASE);
  }
  function addAudit(ev) {
    var ovr = load();
    ovr.audit = ovr.audit || [];
    ovr.audit.unshift(ev);
    save(ovr);
  }
})();
