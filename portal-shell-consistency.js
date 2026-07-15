(function () {
  'use strict';

  var BILLING_LABELS = [
    'Dashboard', 'Agent Inbox', 'Coverage', 'AR Worklist', 'Claims',
    'Payments', 'Rulebook', 'Contracts', 'Analytics', 'Settings'
  ];
  var BILLING_GROUPS = [
    { name: 'Overview', first: 'Dashboard' },
    { name: 'Work', first: 'Agent Inbox' },
    { name: 'Revenue', first: 'Claims' },
    { name: 'Insights', first: 'Analytics' },
    { name: 'Personal', first: 'Settings' }
  ];
  var OPS_GROUPS = ['Overview', 'People', 'System', 'Insights', 'Personal'];
  var scheduled = false;

  try {
    if (localStorage.getItem('onb-nav-expanded') === null) {
      localStorage.setItem('onb-nav-expanded', '1');
    }
  } catch (e) {}

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = './portal-shell-consistency.css';
  css.setAttribute('data-portal-shell-styles', 'true');
  document.head.appendChild(css);

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function addClass(node, className) {
    if (node && !node.classList.contains(className)) node.classList.add(className);
  }

  function currentBillingLabel() {
    var page = decodeURIComponent(location.pathname.split('/').pop() || '').toLowerCase();
    if (page.indexOf('billing home') === 0) return 'Dashboard';
    if (page.indexOf('agent inbox') === 0) return 'Agent Inbox';
    if (page.indexOf('coverage') === 0) return 'Coverage';
    if (page.indexOf('ar worklist') === 0) return 'AR Worklist';
    if (page.indexOf('claim detail') === 0 || page.indexOf('claims register') === 0) return 'Claims';
    if (page.indexOf('payments') === 0) return 'Payments';
    if (page.indexOf('rulebook') === 0) return 'Rulebook';
    if (page.indexOf('contracts') === 0) return 'Contracts';
    if (page.indexOf('analytics') === 0) return 'Analytics';
    if (page.indexOf('settings') === 0) return 'Settings';
    return '';
  }

  function billingItemLabel(node) {
    var title = normalize(node.getAttribute && node.getAttribute('title'));
    var text = normalize(node.textContent);
    for (var i = 0; i < BILLING_LABELS.length; i += 1) {
      var label = BILLING_LABELS[i];
      if (title === label || text === label || text.indexOf(label + ' ') === 0) return label;
    }
    return '';
  }

  function directFlexSpacer(header) {
    var children = Array.prototype.slice.call(header.children);
    return children.find(function (node) {
      var style = getComputedStyle(node);
      return (style.flexGrow === '1' || node.style.flex === '1') && !normalize(node.textContent) && !node.children.length;
    });
  }

  function markHeaderHost(header, selector, className) {
    var node = header.querySelector(selector);
    if (!node) return;
    addClass(node, className);
    var parent = node.parentElement;
    if (parent && parent !== header && parent.parentElement === header) addClass(parent, className + '-host');
  }

  function annotateTopBar(root) {
    var header = null;
    var opsHeader = root.querySelector('ops-header');
    if (opsHeader) {
      addClass(opsHeader, 'portal-ops-header');
      header = opsHeader.firstElementChild;
    } else {
      header = Array.prototype.slice.call(root.children).find(function (node) {
        return !!node.querySelector(':scope > img[alt="Otangeles Notes+"]');
      });
    }
    if (!header) return;

    addClass(header, 'portal-top-bar');
    var logo = header.querySelector(':scope > img[alt="Otangeles Notes+"], img[alt="Otangeles Notes+"]');
    addClass(logo, 'portal-brand-logo');

    var title = Array.prototype.slice.call(header.children).find(function (node) {
      var text = normalize(node.textContent);
      return node.tagName === 'SPAN' && (text === 'Billing Portal' || text === 'Practice Billing' || text === 'Operations Admin Portal');
    });
    addClass(title, 'portal-title');

    var spacer = directFlexSpacer(header);
    addClass(spacer, 'portal-header-spacer');
    markHeaderHost(header, 'search-bar', 'portal-search');
    markHeaderHost(header, 'sage-panel', 'portal-sage');
    markHeaderHost(header, 'practice-switcher', 'portal-practice');
    markHeaderHost(header, 'role-switcher', 'portal-account');

    Array.prototype.slice.call(header.querySelectorAll('button')).forEach(function (button) {
      var titleText = normalize(button.getAttribute('title'));
      if (titleText === 'Notifications') addClass(button, 'portal-notification');
      if (titleText.indexOf('Operations Admin') >= 0) addClass(button, 'portal-admin-account');
    });

    var directButtons = Array.prototype.slice.call(header.children).filter(function (node) { return node.tagName === 'BUTTON'; });
    directButtons.forEach(function (button) {
      if (button.querySelector('svg') && button.querySelector('span[style*="position: absolute"]')) {
        addClass(button, 'portal-notification');
      }
    });
  }

  function findInlineSidebar(container) {
    var opsNav = container.querySelector('ops-nav');
    if (opsNav) return opsNav;
    return Array.prototype.slice.call(container.children).find(function (node) {
      var style = getComputedStyle(node);
      var width = parseFloat(style.width || '0');
      return width > 40 && width <= 320 && style.display === 'flex' && style.flexDirection === 'column' && style.borderRightStyle !== 'none';
    });
  }

  function annotateBillingSidebar(sidebar) {
    var width = parseFloat(getComputedStyle(sidebar).width || '0');
    addClass(sidebar, 'portal-sidebar');
    sidebar.classList.toggle('is-collapsed', width < 100);

    var current = currentBillingLabel();
    Array.prototype.slice.call(sidebar.children).forEach(function (node) {
      var label = billingItemLabel(node);
      if (label) {
        addClass(node, 'portal-nav-item');
        node.setAttribute('data-portal-nav-label', label);
        node.classList.toggle('is-active', label === current);
        return;
      }

      var button = node.tagName === 'BUTTON' ? node : node.querySelector(':scope > button');
      if (button && /navigation/i.test(button.getAttribute('title') || '')) {
        var toggleRow = node;
        if (node.tagName === 'BUTTON' && node.parentElement === sidebar) {
          toggleRow = document.createElement('div');
          sidebar.insertBefore(toggleRow, node);
          toggleRow.appendChild(node);
        }
        addClass(toggleRow, 'portal-nav-toggle-row');
        addClass(button, 'portal-nav-toggle');
        if (!toggleRow.querySelector('.portal-nav-copyright')) {
          var copyright = document.createElement('span');
          copyright.className = 'portal-nav-copyright';
          copyright.textContent = '\u00a9 2026 Otangeles Note+';
          toggleRow.insertBefore(copyright, button);
        }
      }

      var style = getComputedStyle(node);
      if (!normalize(node.textContent) && !node.children.length && parseFloat(style.height || '0') <= 2 && parseFloat(style.width || '0') >= 24) {
        addClass(node, 'portal-nav-legacy-divider');
      }
      if ((style.flexGrow === '1' || node.style.flex === '1') && !normalize(node.textContent)) addClass(node, 'portal-nav-spacer');
      if (normalize(node.textContent).indexOf('Need help?') === 0) addClass(node, 'portal-nav-support');
    });

    BILLING_GROUPS.forEach(function (group) {
      if (sidebar.querySelector('.portal-nav-label[data-portal-group="' + group.name + '"]')) return;
      var first = sidebar.querySelector('[data-portal-nav-label="' + group.first + '"]');
      if (!first) return;
      var label = document.createElement('div');
      label.className = 'portal-nav-label';
      label.setAttribute('data-portal-group', group.name);
      label.textContent = group.name;
      sidebar.insertBefore(label, first);
    });
  }

  function annotateOpsSidebar(sidebar) {
    var activeKey = sidebar.getAttribute('active') || '';
    var keyByLabel = {
      'Dashboard': 'dashboard',
      'Medical Practices': 'practices',
      'Billing Companies': 'companies',
      'Users': 'users',
      'Onboarding': 'onboarding',
      'Facilities': 'facilities',
      'Notifications': 'notifications',
      'Roles & Permissions': 'roles',
      'Portal Configuration': 'portalconfig',
      'Analytics': 'analytics',
      'Audit Log': 'audit',
      'Settings': 'settings'
    };
    addClass(sidebar, 'portal-sidebar');
    addClass(sidebar, 'portal-ops-sidebar');

    Array.prototype.slice.call(sidebar.children).forEach(function (node) {
      var text = normalize(node.textContent);
      if (OPS_GROUPS.indexOf(text) >= 0) {
        addClass(node, 'portal-nav-label');
        return;
      }
      if ((node.tagName === 'A' || node.tagName === 'DIV') && node.querySelector(':scope > svg') && node.querySelector(':scope > span')) {
        addClass(node, 'portal-nav-item');
        var itemLabel = normalize(node.querySelector(':scope > span').textContent);
        node.classList.toggle('is-active', keyByLabel[itemLabel] === activeKey);
        return;
      }
      if (text.indexOf('All Systems Operational') >= 0) addClass(node, 'portal-system-status');
      if (text.indexOf('Operations Admin Mode') >= 0) addClass(node, 'portal-admin-mode');
      if (text.indexOf('\u00a9 2026') === 0) addClass(node, 'portal-ops-footer');
    });
  }

  function annotateLayout(root) {
    var label = root.getAttribute('data-screen-label') || '';
    if (label === 'Practice Billing View') {
      var main = Array.prototype.slice.call(root.children).find(function (node, index) {
        return index > 0 && getComputedStyle(node).display === 'flex' && getComputedStyle(node).flexDirection === 'column';
      });
      if (main) {
        addClass(main, 'portal-main');
        addClass(main, 'portal-standalone-main');
      }
      return;
    }

    var layout = Array.prototype.slice.call(root.children).find(function (node) {
      if (node.classList.contains('portal-top-bar') || node.tagName === 'OPS-HEADER') return false;
      return getComputedStyle(node).display === 'flex' && !!findInlineSidebar(node);
    });
    if (!layout) return;

    addClass(layout, 'portal-body');
    var sidebar = findInlineSidebar(layout);
    if (!sidebar) return;
    if (sidebar.tagName === 'OPS-NAV') annotateOpsSidebar(sidebar);
    else annotateBillingSidebar(sidebar);

    var main = Array.prototype.slice.call(layout.children).find(function (node) {
      return node !== sidebar && (getComputedStyle(node).flexGrow !== '0' || node.style.flex === '1');
    });
    if (main) addClass(main, 'portal-main');
  }

  function annotate() {
    scheduled = false;
    Array.prototype.slice.call(document.querySelectorAll('[data-screen-label]')).forEach(function (root) {
      addClass(root, 'portal-consistent-shell');
      annotateTopBar(root);
      annotateLayout(root);
    });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(annotate);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  else schedule();

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
