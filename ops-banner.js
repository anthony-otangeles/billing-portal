// ops-banner.js — "Viewing as Operations" banner for the Billing Portal.
// Enter Portal links append ?ops=1; the flag persists in sessionStorage so it
// survives navigation inside the billing portal. Dismiss ends the ops view.
(function () {
  'use strict';
  try {
    if (new URLSearchParams(location.search).get('ops') === '1') {
      sessionStorage.setItem('onb-ops-view', '1');
    }
  } catch (e) {}

  if (customElements.get('ops-banner')) return;

  class OpsBanner extends HTMLElement {
    connectedCallback() {
      var on = false;
      try { on = sessionStorage.getItem('onb-ops-view') === '1'; } catch (e) {}
      if (!on) { this.style.display = 'none'; return; }
      this.style.cssText = 'display:block;flex-shrink:0;';
      this.innerHTML =
        '<div style="height:40px;background:#5B46D6;color:#FFFFFF;display:flex;align-items:center;justify-content:center;gap:10px;padding:0 24px;font-family:Inter,-apple-system,sans-serif;font-size:12.5px;font-weight:600;">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D8CFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>' +
          '<span>Viewing as Operations (Michael Ops Admin) \u00b7 access is audited</span>' +
          '<a href="Ops Billing Companies.dc.html" style="color:#D8CFFF;font-weight:700;text-decoration:underline;margin-left:6px;">Back to Ops Admin</a>' +
          '<button id="ops-dismiss" style="margin-left:2px;background:transparent;border:1px solid rgba(255,255,255,0.35);border-radius:6px;color:#FFFFFF;font-family:inherit;font-size:11.5px;font-weight:600;padding:3px 10px;cursor:pointer;">End ops view</button>' +
        '</div>';
      var self = this;
      this.querySelector('#ops-dismiss').addEventListener('click', function () {
        try { sessionStorage.removeItem('onb-ops-view'); } catch (e) {}
        self.style.display = 'none';
      });
    }
  }
  customElements.define('ops-banner', OpsBanner);
})();
