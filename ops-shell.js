// ops-shell.js — Operations Admin portal chrome (header + side nav), recreated
// from the app.otangeles.com screenshots. Two web components:
//   <ops-header></ops-header>
//   <ops-nav active="dashboard|companies|..."></ops-nav>
(function () {
  'use strict';

  var TEAL = '#22C5A7', GREEN = '#22C5A7', INK = '#0F1B2E', GRAY = '#6B7280', LABEL = '#94A3B8';

  function icon(name, color, size) {
    size = size || 20;
    var s = 'width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    var paths = {
      dashboard: '<rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect>',
      stethoscope: '<path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle>',
      billing: '<rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line>',
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
      key: '<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"></path>',
      building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path>',
      bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
      chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path>',
      history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path>',
      gear: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle>',
      search: '<circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.3-4.3"></path>',
      user: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>',
      shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>',
      chevrons: '<path d="m11 17-5-5 5-5"></path><path d="m18 17-5-5 5-5"></path>',
    };
    return '<svg ' + s + '>' + (paths[name] || '') + '</svg>';
  }

  // ---------- Header ----------
  if (!customElements.get('ops-header')) {
    class OpsHeader extends HTMLElement {
      connectedCallback() {
        this.style.cssText = 'display:block;flex-shrink:0;';
        this.innerHTML =
          '<div style="height:76px;background:#FFFFFF;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;padding:0 28px;gap:18px;font-family:Inter,-apple-system,sans-serif;">' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
              '<img src="assets/otangeles-notes.png" alt="Otangeles Notes+" style="width:145px;height:36px;display:block;">' +
            '</div>' +
            '<div style="width:1px;height:34px;background:#E5E7EB;"></div>' +
            '<span style="font-size:16px;color:#334155;font-weight:500;white-space:nowrap;">Operations Admin Portal</span>' +
            '<div style="flex:1;"></div>' +
            '<div style="flex:0 1 560px;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:10px;height:46px;display:flex;align-items:center;gap:12px;padding:0 16px;font-size:14px;color:#94A3B8;">' +
              icon('search', '#94A3B8', 17) +
              '<span style="flex:1;">Search users, roles, settings, audit log...</span>' +
              '<span style="font-family:JetBrains Mono,monospace;font-size:11px;border:1px solid #E5E7EB;border-radius:6px;padding:3px 8px;color:#94A3B8;">Ctrl K</span>' +
            '</div>' +
            '<button title="Notifications" style="width:46px;height:46px;border-radius:9999px;background:#FFFFFF;border:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;">' +
              icon('bell', '#6B7280', 19) +
              '<span style="position:absolute;top:9px;right:11px;width:7px;height:7px;border-radius:9999px;background:' + TEAL + ';"></span>' +
            '</button>' +
            '<button title="Michael Ops Admin \u00b7 Operations Admin" style="width:46px;height:46px;border-radius:9999px;background:#FFFFFF;border:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;cursor:pointer;">' +
              icon('user', '#6B7280', 24) +
            '</button>' +
          '</div>';
      }
    }
    customElements.define('ops-header', OpsHeader);
  }

  // ---------- Side nav ----------
  if (!customElements.get('ops-nav')) {
    var GROUPS = [
      { label: 'Overview', items: [
        { key: 'dashboard', label: 'Dashboard', ic: 'dashboard', href: 'Ops Dashboard.dc.html' },
        { key: 'practices', label: 'Medical Practices', ic: 'stethoscope', href: 'Ops Medical Practices.dc.html' },
        { key: 'companies', label: 'Billing Companies', ic: 'billing', href: 'Ops Billing Companies.dc.html', isNew: true },
      ]},
      { label: 'People', items: [
        { key: 'users', label: 'Users', ic: 'users', href: 'Ops Users.dc.html' },
        { key: 'onboarding', label: 'Onboarding', ic: 'key', href: 'Ops Onboarding.dc.html' },
        { key: 'facilities', label: 'Facilities', ic: 'building', href: null },
      ]},
      { label: 'System', items: [
        { key: 'notifications', label: 'Notifications', ic: 'bell', href: 'Ops Notifications.dc.html' },
        { key: 'roles', label: 'Roles & Permissions', ic: 'shield', href: 'Ops Roles.dc.html', isNew: true },
        { key: 'portalconfig', label: 'Portal Configuration', ic: 'gear', href: 'Ops Portal Config.dc.html', isNew: true },
      ]},
      { label: 'Insights', items: [
        { key: 'analytics', label: 'Analytics', ic: 'chart', href: 'Ops Analytics.dc.html' },
        { key: 'audit', label: 'Audit Log', ic: 'history', href: 'Ops Audit Log.dc.html' },
      ]},
      { label: 'Personal', items: [
        { key: 'settings', label: 'Settings', ic: 'gear', href: null },
      ]},
    ];

    class OpsNav extends HTMLElement {
      connectedCallback() {
        var active = this.getAttribute('active') || '';
        this.style.cssText = 'display:flex;flex-direction:column;width:300px;flex-shrink:0;background:#FFFFFF;border-right:1px solid #E5E7EB;padding:22px 18px 18px;font-family:Inter,-apple-system,sans-serif;min-height:0;';
        var html = '';
        GROUPS.forEach(function (g) {
          html += '<div style="font-size:11px;font-weight:700;color:' + LABEL + ';text-transform:uppercase;letter-spacing:0.08em;padding:14px 12px 8px;">' + g.label + '</div>';
          g.items.forEach(function (it) {
            var isActive = it.key === active;
            var color = isActive ? TEAL : '#334155';
            var inner = icon(it.ic, isActive ? TEAL : '#6B7280', 19) +
              '<span style="flex:1;">' + it.label + '</span>' +
              (it.isNew && !isActive ? '<span style="font-size:9px;font-weight:700;color:' + TEAL + ';background:#E6F7F2;border:1px solid #B9E8DC;border-radius:9999px;padding:1px 7px;">NEW</span>' : '');
            var base = 'display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:10px;font-size:14.5px;font-weight:600;color:' + color + ';text-decoration:none;';
            if (isActive) base += 'border:1.5px solid ' + TEAL + ';background:#FFFFFF;';
            else base += 'border:1.5px solid transparent;';
            if (it.href && !isActive) {
              html += '<a href="' + it.href + '" style="' + base + 'cursor:pointer;" onmouseenter="this.style.background=\'#F8FAFC\'" onmouseleave="this.style.background=\'transparent\'">' + inner + '</a>';
            } else if (isActive) {
              html += '<div style="' + base + '">' + inner + '</div>';
            } else {
              html += '<div title="Not part of this prototype" style="' + base + 'cursor:default;">' + inner + '</div>';
            }
          });
        });
        html += '<div style="flex:1;min-height:24px;"></div>';
        html += '<div style="display:flex;align-items:center;gap:10px;background:#E6F7F2;border-radius:10px;padding:13px 16px;font-size:13.5px;font-weight:600;color:#0B7D6C;margin-bottom:12px;"><span style="width:9px;height:9px;border-radius:9999px;background:' + GREEN + ';"></span>All Systems Operational</div>';
        html += '<div style="background:#F1EEFF;border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:4px;margin-bottom:16px;">' +
          '<span style="display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:700;color:#5B46D6;">' + icon('shield', '#5B46D6', 15) + 'Operations Admin Mode</span>' +
          '<span style="font-size:12.5px;color:#6B7280;line-height:18px;">Live access is active. Changes are audited.</span>' +
        '</div>';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">' +
          '<span style="font-size:12px;color:#94A3B8;">\u00a9 2026 Otangeles Note+</span>' +
          '<span style="width:40px;height:40px;border-radius:10px;border:1px solid #E5E7EB;display:inline-flex;align-items:center;justify-content:center;">' + icon('chevrons', TEAL, 18) + '</span>' +
        '</div>';
        this.innerHTML = html;
      }
    }
    customElements.define('ops-nav', OpsNav);
  }
})();
