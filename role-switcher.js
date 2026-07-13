// Billing Portal — role switcher (web component)
// Replaces the static avatar block in the top bar on every page.
// Selection persists in localStorage 'onb-role'; switching reloads the page re-scoped.
// Exposes window.RoleStore = { getRole, isManager, persona }.
(function () {
  var PERSONAS = [
    { id: 'am', name: 'Angela Mensah', initials: 'AM', title: 'AR Rep', sub: 'Bell Medics · AR Rep' },
    { id: 'do', name: 'Derek Okafor', initials: 'DO', title: 'Billing Manager', sub: 'Bell Medics · Billing Manager' },
  ];
  function getRole() {
    try { var v = localStorage.getItem('onb-role'); return v === 'do' ? 'do' : 'am'; } catch (e) { return 'am'; }
  }
  function persona() { return PERSONAS.find(function (p) { return p.id === getRole(); }) || PERSONAS[0]; }
  window.RoleStore = {
    getRole: getRole,
    isManager: function () { return getRole() === 'do'; },
    persona: persona,
    personas: PERSONAS,
  };

  if (customElements.get('role-switcher')) return;

  var CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>';
  var CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B7D6C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>';
  function avatar(p, size) {
    return '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:9999px;background:linear-gradient(#7B61FF, #22C5A7);color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:' + Math.round(size * 0.36) + 'px;flex-shrink:0;">' + p.initials + '</div>';
  }

  class RoleSwitcher extends HTMLElement {
    connectedCallback() {
      var cur = persona();
      this.style.cssText = 'position:relative;display:inline-block;font-family:Inter,-apple-system,sans-serif;';
      this.innerHTML =
        '<button id="rs-btn" style="display:flex;align-items:center;gap:10px;margin-left:4px;padding:4px 6px;border:none;background:transparent;border-radius:8px;cursor:pointer;font-family:inherit;" title="Account">' +
          avatar(cur, 36) +
          '<span style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.25;">' +
            '<span style="font-weight:700;font-size:13px;color:#0F1B2E;white-space:nowrap;">' + cur.name + '</span>' +
            '<span style="font-size:11px;color:#6B7280;white-space:nowrap;">' + cur.sub + '</span>' +
          '</span>' + CHEV +
        '</button>' +
        '<div id="rs-menu" style="display:none;position:absolute;top:50px;right:0;min-width:280px;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:10px;box-shadow:0 10px 30px rgba(15,27,46,0.14);padding:6px;z-index:600;">' +
          '<div style="padding:8px 12px 6px;font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.07em;">Sign in as</div>' +
          PERSONAS.map(function (p) {
            var active = p.id === cur.id;
            return '<button data-rid="' + p.id + '" style="width:100%;display:flex;align-items:center;gap:10px;padding:9px 12px;border:none;border-radius:7px;background:' + (active ? '#F1EEFF' : '#FFFFFF') + ';cursor:pointer;text-align:left;font-family:inherit;">' +
              avatar(p, 30) +
              '<span style="flex:1;display:flex;flex-direction:column;gap:1px;">' +
                '<span style="font-size:13px;font-weight:700;color:#0F1B2E;">' + p.name + '</span>' +
                '<span style="font-size:11px;color:#6B7280;">' + p.title + '</span>' +
              '</span>' + (active ? CHECK : '') +
            '</button>';
          }).join('') +
          '<div style="border-top:1px solid #EEEEEE;margin:6px 0;"></div>' +
          '<a href="Settings.dc.html" style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:7px;text-decoration:none;font-size:13px;font-weight:600;color:#6B7280;" onmouseenter="this.style.background=\'#F8FAFC\'" onmouseleave="this.style.background=\'transparent\'">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>' +
            'Settings' +
          '</a>' +
        '</div>';

      var btn = this.querySelector('#rs-btn');
      var menu = this.querySelector('#rs-menu');
      btn.addEventListener('mouseenter', function () { btn.style.background = '#F8FAFC'; });
      btn.addEventListener('mouseleave', function () { btn.style.background = 'transparent'; });
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      });
      this._onDoc = function () { menu.style.display = 'none'; };
      document.addEventListener('click', this._onDoc);
      menu.querySelectorAll('button[data-rid]').forEach(function (b) {
        var active = b.dataset.rid === cur.id;
        b.addEventListener('mouseenter', function () { if (!active) b.style.background = '#F8FAFC'; });
        b.addEventListener('mouseleave', function () { b.style.background = active ? '#F1EEFF' : '#FFFFFF'; });
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          if (active) { menu.style.display = 'none'; return; }
          try { localStorage.setItem('onb-role', b.dataset.rid); } catch (err) {}
          location.reload();
        });
      });
    }
    disconnectedCallback() { if (this._onDoc) document.removeEventListener('click', this._onDoc); }
  }
  customElements.define('role-switcher', RoleSwitcher);
})();
