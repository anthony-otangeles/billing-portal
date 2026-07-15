// Billing Portal — practice switcher (web component)
// Practices served by the signed-in billing company (Bell Medics).
// Selection persists in localStorage 'onb-practice'; switching reloads the page re-scoped.
(function () {
  if (customElements.get('practice-switcher')) return;

  var PRACTICES = [
    { id: 'ifc', name: 'Ibekie Foundation Clinics', tag: '4 facilities · primary' },
    { id: 'wfm', name: 'Westbrook Family Medicine', tag: '1 facility' },
  ];
  function getPractice() {
    try {
      var v = localStorage.getItem('onb-practice');
      return PRACTICES.some(function (p) { return p.id === v; }) ? v : PRACTICES[0].id;
    } catch (e) { return PRACTICES[0].id; }
  }

  var BUILDING = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5B46D6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>';
  var CHEV = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>';
  var CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B7D6C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>';

  class PracticeSwitcher extends HTMLElement {
    connectedCallback() {
      var cur = PRACTICES.find(function (p) { return p.id === getPractice(); }) || PRACTICES[0];
      this.style.cssText = 'position:relative;display:inline-block;font-family:Inter,-apple-system,sans-serif;';
      this.innerHTML =
        '<button id="ps-btn" aria-haspopup="dialog" aria-expanded="false" style="height:40px;display:flex;align-items:center;gap:9px;padding:0 14px;border-radius:5px;border:1px solid #C9BCF5;background:#F8F6FF;cursor:pointer;font-family:inherit;" title="Switch practice">' +
          BUILDING +
          '<span style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.2;">' +
            '<span style="font-size:9px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.07em;">Practice</span>' +
            '<span style="font-size:13px;font-weight:700;color:#0F1B2E;">' + cur.name + '</span>' +
          '</span>' + CHEV +
        '</button>' +
        '<div id="ps-menu" role="dialog" aria-label="Choose a practice" style="display:none;position:absolute;top:46px;left:0;width:340px;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:10px;box-shadow:0 10px 30px rgba(15,27,46,0.14);padding:6px;z-index:600;">' +
          '<div style="padding:8px 12px 6px;font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.07em;">Practices served by Bell Medics</div>' +
          '<div style="padding:4px 6px 8px;">' +
            '<input id="ps-search" type="search" aria-label="Search practices" autocomplete="off" placeholder="Search practices\u2026" style="width:100%;height:38px;border:1px solid #E5E7EB;border-radius:6px;background:#F7F7F7;padding:0 12px;outline:none;font-family:inherit;font-size:13px;color:#0F1B2E;">' +
          '</div>' +
          '<div id="ps-options" style="max-height:280px;overflow-y:auto;">' +
          PRACTICES.map(function (p) {
            var active = p.id === cur.id;
            return '<button data-pid="' + p.id + '" data-search="' + (p.name + ' ' + p.tag).toLowerCase() + '" role="option" aria-selected="' + active + '" style="width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;border:none;border-radius:7px;background:' + (active ? '#F1EEFF' : '#FFFFFF') + ';cursor:pointer;text-align:left;font-family:inherit;">' +
              '<span style="flex:1;display:flex;flex-direction:column;gap:1px;">' +
                '<span style="font-size:13px;font-weight:700;color:#0F1B2E;">' + p.name + '</span>' +
                '<span style="font-size:11px;color:#6B7280;">' + p.tag + '</span>' +
              '</span>' + (active ? CHECK : '') +
            '</button>';
          }).join('') +
          '</div>' +
          '<div id="ps-empty" style="display:none;padding:16px 12px;text-align:center;font-size:12.5px;color:#6B7280;">No practices found.</div>' +
        '</div>';

      var self = this;
      var btn = this.querySelector('#ps-btn');
      var menu = this.querySelector('#ps-menu');
      var search = this.querySelector('#ps-search');
      var empty = this.querySelector('#ps-empty');
      var practiceButtons = Array.prototype.slice.call(menu.querySelectorAll('button[data-pid]'));

      function filterPractices() {
        var query = search.value.trim().toLowerCase();
        var visible = 0;
        practiceButtons.forEach(function (practiceButton) {
          var matches = !query || practiceButton.dataset.search.indexOf(query) >= 0;
          practiceButton.style.display = matches ? 'flex' : 'none';
          if (matches) visible += 1;
        });
        empty.style.display = visible ? 'none' : 'block';
      }

      function closeMenu() {
        menu.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
      }

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var opening = menu.style.display === 'none';
        if (!opening) { closeMenu(); return; }
        menu.style.display = 'block';
        btn.setAttribute('aria-expanded', 'true');
        search.value = '';
        filterPractices();
        setTimeout(function () { search.focus(); }, 0);
      });
      search.addEventListener('click', function (e) { e.stopPropagation(); });
      search.addEventListener('input', filterPractices);
      search.addEventListener('focus', function () { search.style.borderColor = '#845EC2'; search.style.background = '#FFFFFF'; });
      search.addEventListener('blur', function () { search.style.borderColor = '#E5E7EB'; search.style.background = '#F7F7F7'; });
      search.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeMenu();
          btn.focus();
        } else if (e.key === 'ArrowDown') {
          var first = practiceButtons.find(function (practiceButton) { return practiceButton.style.display !== 'none'; });
          if (first) { e.preventDefault(); first.focus(); }
        } else if (e.key === 'Enter') {
          var visible = practiceButtons.filter(function (practiceButton) { return practiceButton.style.display !== 'none'; });
          if (visible.length === 1) { e.preventDefault(); visible[0].click(); }
        }
      });
      this._onDoc = closeMenu;
      document.addEventListener('click', this._onDoc);
      practiceButtons.forEach(function (b) {
        b.addEventListener('mouseenter', function () { if (b.dataset.pid !== cur.id) b.style.background = '#F8FAFC'; });
        b.addEventListener('mouseleave', function () { b.style.background = b.dataset.pid === cur.id ? '#F1EEFF' : '#FFFFFF'; });
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          if (b.dataset.pid === cur.id) { closeMenu(); return; }
          try { localStorage.setItem('onb-practice', b.dataset.pid); } catch (err) {}
          location.reload();
        });
      });
    }
    disconnectedCallback() { if (this._onDoc) document.removeEventListener('click', this._onDoc); }
  }
  customElements.define('practice-switcher', PracticeSwitcher);
  window.__getPractice = getPractice;
})();
