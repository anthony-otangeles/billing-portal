// Billing Portal — global search (web component, Phase 10.1)
// One shared search box for every billing screen. Indexes the shared stores
// (claims, contracts) plus payment traces and open decisions, groups results,
// supports keyboard navigation, and deep-links into the right screen.
// Overflow rows land on the Claims Register pre-filtered (?q=).
(function () {
  if (customElements.get('search-bar')) return;

  // Ensure shared stores are loaded (screens differ in what they already include).
  function ensureScript(src, globalName) {
    if (window[globalName]) return;
    if (document.querySelector('script[src="' + src + '"]')) return;
    var s = document.createElement('script');
    s.src = src;
    document.head.appendChild(s);
  }
  ensureScript('./claims-store.js', 'ClaimsStore');
  ensureScript('./contracts-store.js', 'ContractsStore');

  // Static indices for surfaces without a shared store.
  var TRACES = [
    { label: 'EFT-4479102', sub: 'Medicare of Indiana \u00b7 $8,412.36 \u00b7 Jul 13 \u00b7 matched', href: 'Payments.dc.html' },
    { label: 'EFT-2214887', sub: 'MHS HIP \u00b7 $1,508.40 \u00b7 Jul 13 \u00b7 12 lines in variance', href: 'Payments.dc.html' },
    { label: 'BANK-DEP-2214', sub: 'UHC \u00b7 $2,204.18 \u00b7 Jul 13 \u00b7 awaiting ERA', href: 'Payments.dc.html' },
    { label: 'CHK #48812', sub: 'Anthem MA \u00b7 $4,110.40 \u00b7 Jul 12 \u00b7 $100.00 short', href: 'Payments.dc.html' },
    { label: 'EFT-9931205', sub: 'Humana MA PPO \u00b7 $1,882.75 \u00b7 Jul 12 \u00b7 includes takeback', href: 'Payments.dc.html' },
    { label: 'EFT-5521904', sub: 'Aetna MA HMO \u00b7 $946.10 \u00b7 Jul 12 \u00b7 matched', href: 'Payments.dc.html' },
    { label: 'EFT-4478990', sub: 'Medicare of Indiana \u00b7 $7,918.55 \u00b7 Jul 11 \u00b7 reconciled', href: 'Payments.dc.html' },
    { label: 'EFT-1108824', sub: 'Indiana Medicaid \u00b7 $1,204.66 \u00b7 Jul 11 \u00b7 reconciled', href: 'Payments.dc.html' },
  ];
  var DECISIONS = [
    { label: 'MHS underpaid 99309 \u2014 12-claim reprocess batch', sub: 'Variance disposition \u00b7 $186.00', href: 'Payments.dc.html' },
    { label: 'Rate review \u2014 MHS HIP drift on 99309', sub: 'Contracts \u00b7 89% of contract since Jun 14', href: 'Contracts.dc.html' },
    { label: 'Humana takeback \u2014 post & reopen for COB rebilling', sub: 'Variance disposition \u00b7 $212.40', href: 'Payments.dc.html' },
    { label: 'Secondary claim review \u2014 Medigap, no auto-crossover', sub: 'Secondary Billing Agent', href: 'Agent Inbox v3.dc.html' },
    { label: 'Stalled crossover \u2014 14 days silent, submit direct', sub: 'Secondary Billing Agent', href: 'Agent Inbox v3.dc.html' },
    { label: 'Returned mail \u2014 address unknown', sub: 'Patient Balance Agent', href: 'Agent Inbox v3.dc.html' },
    { label: 'Payment plan request \u2014 4 \u00d7 $85', sub: 'Patient Balance Agent', href: 'Agent Inbox v3.dc.html' },
    { label: 'Collections proposal \u2014 cycle exhausted, veto window open', sub: 'Patient Balance Agent', href: 'Agent Inbox v3.dc.html' },
    { label: 'Write-off request \u2014 $9.20 residual (reason SB)', sub: 'Payment Reconciliation Agent', href: 'Agent Inbox v3.dc.html' },
    { label: 'E/M coding \u2014 99308 vs 99309 with expected payment', sub: 'Coding Agent', href: 'Agent Inbox v3.dc.html' },
  ];

  var SEARCH_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.3-4.3"></path></svg>';
  var CAP = 5;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildGroups(q) {
    var needle = q.toLowerCase();
    var hit = function (s) { return s && String(s).toLowerCase().indexOf(needle) >= 0; };
    var groups = [];

    // Claims + patients (shared claims store, scoped to the selected practice)
    if (window.ClaimsStore) {
      var all = window.ClaimsStore.getAllClaims();
      var claims = all.filter(function (c) {
        return hit(c.patient) || hit(c.claim) || hit(c.payer) || hit(c.facility) || hit(c.status);
      });
      if (claims.length) {
        groups.push({
          name: 'Claims', total: claims.length,
          overflowHref: 'Claims Register.dc.html?q=' + encodeURIComponent(q),
          rows: claims.slice(0, CAP).map(function (c) {
            return {
              label: c.patient + ' \u00b7 ' + c.claim,
              sub: c.payer + ' \u00b7 ' + c.facility + ' \u00b7 ' + c.status + ' \u00b7 balance ' + c.balanceStr,
              href: 'Claim Detail.dc.html', mono: c.claim
            };
          })
        });
      }
    }

    // Payers & contracts + CPT rates
    if (window.ContractsStore) {
      var payerRows = window.ContractsStore.payers().filter(function (p) {
        return p.names.some(hit) || hit(p.basisLabel);
      }).map(function (p) {
        return {
          label: p.short,
          sub: p.basisLabel + ' \u00b7 effective ' + p.effective + ' \u00b7 ' + p.covered + ' of ' + p.billed + ' codes' + (p.drift ? ' \u00b7 DRIFT on ' + p.drift.cpt : ''),
          href: 'Contracts.dc.html'
        };
      });
      var cptRows = window.ContractsStore.cpts().filter(function (c) {
        return hit(c.cpt) || hit(c.desc);
      }).map(function (c) {
        return { label: c.cpt, sub: c.desc + ' \u00b7 rate lookup', href: 'Contracts.dc.html?cpt=' + encodeURIComponent(c.cpt), mono: c.cpt };
      });
      var rows = payerRows.concat(cptRows);
      if (rows.length) groups.push({ name: 'Payers & Contracts', total: rows.length, rows: rows.slice(0, CAP) });
    }

    // Payment traces
    var traces = TRACES.filter(function (t) { return hit(t.label) || hit(t.sub); });
    if (traces.length) groups.push({ name: 'Payments', total: traces.length, rows: traces.slice(0, CAP).map(function (t) { return { label: t.label, sub: t.sub, href: t.href, mono: t.label }; }) });

    // Open decisions
    var dec = DECISIONS.filter(function (d) { return hit(d.label) || hit(d.sub); });
    if (dec.length) groups.push({ name: 'Decisions', total: dec.length, rows: dec.slice(0, CAP) });

    return groups;
  }

  class SearchBar extends HTMLElement {
    connectedCallback() {
      this.style.cssText = 'position:relative;display:block;margin-left:16px;flex:0 1 480px;font-family:Inter,-apple-system,sans-serif;';
      this.innerHTML =
        '<div id="sb-box" style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:5px;height:40px;display:flex;align-items:center;gap:10px;padding:0 14px;">' +
          SEARCH_ICON +
          '<input id="sb-input" placeholder="Search patients, claims, payers, CPTs, traces\u2026" autocomplete="off" style="flex:1;border:none;background:transparent;outline:none;font-size:14px;color:#0F1B2E;font-family:inherit;min-width:0;">' +
          '<span id="sb-hint" style="font-size:10px;font-weight:700;color:#C4CAD4;border:1px solid #E5E7EB;border-radius:4px;padding:1px 6px;background:#FFFFFF;">/</span>' +
        '</div>' +
        '<div id="sb-panel" style="display:none;position:absolute;top:46px;left:0;right:0;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:10px;box-shadow:0 14px 40px rgba(15,27,46,0.16);z-index:700;max-height:520px;overflow-y:auto;padding:4px;"></div>';

      var self = this;
      var input = this.querySelector('#sb-input');
      var panel = this.querySelector('#sb-panel');
      var box = this.querySelector('#sb-box');
      this._items = [];
      this._active = -1;

      function close() { panel.style.display = 'none'; self._active = -1; }

      function render() {
        var q = input.value.trim();
        if (q.length < 2) { close(); return; }
        var groups = buildGroups(q);
        self._items = [];
        if (!groups.length) {
          panel.innerHTML = '<div style="padding:16px 14px;font-size:12.5px;color:#94A3B8;">Nothing matches \u201c' + esc(q) + '\u201d in this practice \u2014 try a patient, claim ID, payer, CPT, or trace number.</div>';
          panel.style.display = 'block';
          return;
        }
        var html = '';
        groups.forEach(function (g) {
          html += '<div style="padding:9px 12px 4px;font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.07em;">' + g.name + (g.total > g.rows.length ? ' \u00b7 showing ' + g.rows.length + ' of ' + g.total : '') + '</div>';
          g.rows.forEach(function (r) {
            var idx = self._items.length;
            self._items.push(r.href);
            html += '<a data-idx="' + idx + '" href="' + esc(r.href) + '" style="display:flex;flex-direction:column;gap:1px;padding:8px 12px;border-radius:7px;text-decoration:none;">' +
              '<span style="font-size:13px;font-weight:700;color:#0F1B2E;' + (r.mono ? 'font-family:JetBrains Mono,monospace;font-size:12px;' : '') + '">' + esc(r.label) + '</span>' +
              '<span style="font-size:11.5px;color:#6B7280;">' + esc(r.sub) + '</span>' +
            '</a>';
          });
          if (g.total > g.rows.length && g.overflowHref) {
            var idx2 = self._items.length;
            self._items.push(g.overflowHref);
            html += '<a data-idx="' + idx2 + '" href="' + esc(g.overflowHref) + '" style="display:block;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:700;color:#7B61FF;text-decoration:none;">Show all ' + g.total + ' in the Claims Register \u2192</a>';
          }
        });
        panel.innerHTML = html;
        panel.style.display = 'block';
        self._active = -1;
        panel.querySelectorAll('a[data-idx]').forEach(function (a) {
          a.addEventListener('mouseenter', function () { self._setActive(parseInt(a.dataset.idx, 10)); });
        });
      }

      this._setActive = function (i) {
        self._active = i;
        panel.querySelectorAll('a[data-idx]').forEach(function (a) {
          a.style.background = parseInt(a.dataset.idx, 10) === i ? '#F1EEFF' : '#FFFFFF';
        });
      };

      input.addEventListener('input', render);
      input.addEventListener('focus', function () { box.style.borderColor = '#C9BCF5'; box.style.background = '#FFFFFF'; if (input.value.trim().length >= 2) render(); });
      input.addEventListener('blur', function () { box.style.borderColor = '#E5E7EB'; box.style.background = '#F8FAFC'; });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { close(); input.blur(); return; }
        if (panel.style.display === 'none') return;
        if (e.key === 'ArrowDown') { e.preventDefault(); self._setActive(Math.min(self._active + 1, self._items.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); self._setActive(Math.max(self._active - 1, 0)); }
        else if (e.key === 'Enter' && self._active >= 0) { e.preventDefault(); location.href = self._items[self._active]; }
      });

      this._onDoc = function (e) { if (!self.contains(e.target)) close(); };
      document.addEventListener('click', this._onDoc);
      this._onSlash = function (e) {
        if (e.key === '/' && document.activeElement !== input) {
          var tag = (document.activeElement && document.activeElement.tagName) || '';
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
          e.preventDefault();
          input.focus();
        }
      };
      document.addEventListener('keydown', this._onSlash);
    }
    disconnectedCallback() {
      if (this._onDoc) document.removeEventListener('click', this._onDoc);
      if (this._onSlash) document.removeEventListener('keydown', this._onSlash);
    }
  }
  customElements.define('search-bar', SearchBar);
})();
