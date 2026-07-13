// team-store.js — Bell Medics roster + invites, shared by Settings and the Dashboard.
// Base roster mirrors the reps already assigned to claims in claims-store.js.
// Edits (status, practice assignment) and invites persist in localStorage 'onb-team'.
(function () {
  'use strict';

  var BASE = [
    { id: 'am', name: 'Angela Mensah', initials: 'AM', role: 'AR Rep', practices: ['ifc', 'wfm'], lastActive: 'Today, 9:41 AM' },
    { id: 'do', name: 'Derek Okafor', initials: 'DO', role: 'Billing Manager', practices: ['ifc', 'wfm'], lastActive: 'Today, 8:15 AM' },
    { id: 'rt', name: 'Rob Tanaka', initials: 'RT', role: 'AR Rep', practices: ['ifc'], lastActive: 'Today, 9:02 AM' },
    { id: 'pk', name: 'Priya Kapoor', initials: 'PK', role: 'AR Rep', practices: ['ifc', 'wfm'], lastActive: 'Yesterday, 4:48 PM' },
    { id: 'so', name: 'Sam Osei', initials: 'SO', role: 'AR Rep', practices: ['ifc'], lastActive: 'Jul 6, 11:20 AM' },
  ];
  var PRACTICE_NAMES = { ifc: 'Ibekie Foundation Clinics', wfm: 'Westbrook Family Medicine' };
  var PRACTICE_SHORT = { ifc: 'IFC', wfm: 'Westbrook' };

  function load() {
    try { return JSON.parse(localStorage.getItem('onb-team') || '{}'); } catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem('onb-team', JSON.stringify(data)); } catch (e) {}
  }

  function getRoster() {
    var ovr = load();
    var edits = ovr.edits || {};
    var members = BASE.map(function (m) {
      var e = edits[m.id] || {};
      return {
        id: m.id, name: m.name, initials: m.initials, role: m.role,
        practices: e.practices || m.practices,
        status: e.status || 'Active',
        lastActive: m.lastActive,
        pending: false,
      };
    });
    var invites = (ovr.invites || []).map(function (iv) {
      return {
        id: iv.id, name: iv.email, initials: iv.email.slice(0, 2).toUpperCase(),
        email: iv.email, role: iv.role, practices: iv.practices,
        status: iv.accepted ? 'Active' : 'Pending',
        lastActive: iv.accepted ? 'Just accepted' : ('Invited ' + iv.invitedAt),
        pending: !iv.accepted, invite: true,
      };
    });
    return members.concat(invites);
  }

  function invite(email, role, practices) {
    var ovr = load();
    ovr.invites = ovr.invites || [];
    var id = 'inv-' + Date.now();
    ovr.invites.push({ id: id, email: email, role: role, practices: practices, invitedAt: 'Jul 9', accepted: false });
    save(ovr);
    return id;
  }
  function setInviteAccepted(id, accepted) {
    var ovr = load();
    (ovr.invites || []).forEach(function (iv) { if (iv.id === id) iv.accepted = accepted; });
    save(ovr);
  }
  function revokeInvite(id) {
    var ovr = load();
    ovr.invites = (ovr.invites || []).filter(function (iv) { return iv.id !== id; });
    save(ovr);
  }
  function editMember(id, patch) {
    var ovr = load();
    ovr.edits = ovr.edits || {};
    // invites are edited in place
    var iv = (ovr.invites || []).find(function (x) { return x.id === id; });
    if (iv) { Object.assign(iv, patch); save(ovr); return; }
    ovr.edits[id] = Object.assign({}, ovr.edits[id], patch);
    save(ovr);
  }

  // Live due-today load per rep from the shared claims store (if loaded on the page).
  function dueTodayByRep(practice) {
    var out = {};
    if (!window.ClaimsStore) return out;
    window.ClaimsStore.openAR(practice).forEach(function (c) {
      if (c.dueToday) out[c.repInitials] = (out[c.repInitials] || 0) + 1;
    });
    return out;
  }

  // Same loads scaled to the portal's headline due-today totals (Dashboard stat
  // card: 26 for IFC, 8 for Westbrook) so every screen quotes consistent numbers.
  var DUE_TARGETS = { ifc: 26, wfm: 8 };
  function dueTodayScaled(practice) {
    var raw = dueTodayByRep(practice);
    var target = DUE_TARGETS[practice] || 0;
    var keys = Object.keys(raw);
    var rawTotal = keys.reduce(function (s, k) { return s + raw[k]; }, 0);
    var out = {};
    if (!rawTotal || !target) return out;
    var assigned = 0;
    keys.forEach(function (k) { out[k] = Math.floor(raw[k] / rawTotal * target); assigned += out[k]; });
    keys.sort(function (a, b) { return raw[b] - raw[a]; }).forEach(function (k) {
      if (assigned < target) { out[k]++; assigned++; }
    });
    return out;
  }
  function openByRep(practice) {
    var out = {};
    if (!window.ClaimsStore) return out;
    window.ClaimsStore.openAR(practice).forEach(function (c) {
      out[c.repInitials] = (out[c.repInitials] || 0) + 1;
    });
    return out;
  }

  // Company profile (editable by the manager on Settings).
  var COMPANY_DEFAULT = {
    name: 'Bell Medics',
    contact: 'Derek Okafor',
    email: 'billing@bellmedics.com',
    phone: '(574) 555-0182',
    address: '2200 Commerce Dr, Suite 410, South Bend, IN 46601',
  };
  function getCompany() {
    try { return Object.assign({}, COMPANY_DEFAULT, JSON.parse(localStorage.getItem('onb-company') || '{}')); } catch (e) { return Object.assign({}, COMPANY_DEFAULT); }
  }
  function saveCompany(patch) {
    var cur;
    try { cur = JSON.parse(localStorage.getItem('onb-company') || '{}'); } catch (e) { cur = {}; }
    try { localStorage.setItem('onb-company', JSON.stringify(Object.assign(cur, patch))); } catch (e) {}
  }

  // Notification prefs, per persona.
  var NOTIF_DEFAULTS = { sla: true, appeals: true, practiceReplies: true, weeklyReport: false };
  function getNotifs(roleId) {
    try { return Object.assign({}, NOTIF_DEFAULTS, JSON.parse(localStorage.getItem('onb-notifs-' + roleId) || '{}')); } catch (e) { return Object.assign({}, NOTIF_DEFAULTS); }
  }
  function setNotif(roleId, key, val) {
    var cur = getNotifs(roleId);
    cur[key] = val;
    try { localStorage.setItem('onb-notifs-' + roleId, JSON.stringify(cur)); } catch (e) {}
  }

  window.TeamStore = {
    getRoster: getRoster,
    invite: invite,
    setInviteAccepted: setInviteAccepted,
    revokeInvite: revokeInvite,
    editMember: editMember,
    dueTodayByRep: dueTodayByRep,
    dueTodayScaled: dueTodayScaled,
    DUE_TARGETS: DUE_TARGETS,
    openByRep: openByRep,
    getCompany: getCompany,
    saveCompany: saveCompany,
    getNotifs: getNotifs,
    setNotif: setNotif,
    PRACTICE_NAMES: PRACTICE_NAMES,
    PRACTICE_SHORT: PRACTICE_SHORT,
  };
})();
