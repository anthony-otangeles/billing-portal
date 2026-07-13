// portal-config-store.js — Per-portal feature settings, set by Operations and
// read by the portals themselves (the Billing Portal reads the 'billing' column).
// Persists in localStorage 'onb-portal-config'.
(function () {
  'use strict';

  var DEFAULTS = {
    // Billing portal (live-wired)
    'billing.autonomy': 'approval',      // draft | approval | report
    'billing.slaHours': 24,
    'billing.appeals': true,
    'billing.weeklyReport': 'monday',
    'billing.mfa': true,
    // Static context columns
    'provider.autonomy': 'draft',
    'scribe.autonomy': 'draft',
    'clerk.autonomy': 'draft',
  };

  function load() {
    try { return JSON.parse(localStorage.getItem('onb-portal-config') || '{}'); } catch (e) { return {}; }
  }
  function get(key) {
    var ovr = load();
    return ovr[key] !== undefined ? ovr[key] : DEFAULTS[key];
  }
  function set(key, val) {
    var ovr = load();
    ovr[key] = val;
    try { localStorage.setItem('onb-portal-config', JSON.stringify(ovr)); } catch (e) {}
  }

  window.PortalConfig = { get: get, set: set, DEFAULTS: DEFAULTS };
})();
