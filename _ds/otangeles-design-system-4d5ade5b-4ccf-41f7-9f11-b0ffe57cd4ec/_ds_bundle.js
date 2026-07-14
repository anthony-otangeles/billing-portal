/* @ds-bundle: {"format":4,"namespace":"OtangelesDesignSystem_4d5ade","components":[],"sourceHashes":{"ui_kits/clerk-portal/kit-primitives.jsx":"e78e0b3b0c8f","ui_kits/encounter/encounter-bodies.jsx":"70d6653ca50d","ui_kits/encounter/encounter-shell.jsx":"f2fbc932c69f","ui_kits/encounter/kit-primitives.jsx":"e78e0b3b0c8f","ui_kits/provider-portal/dashboard.jsx":"58ce56f21cf1","ui_kits/provider-portal/kit-primitives.jsx":"e78e0b3b0c8f","ui_kits/provider-portal/login.jsx":"75157c7c0f97","ui_kits/provider-portal/shell.jsx":"08101deee6e3","ui_kits/scribe-portal/kit-primitives.jsx":"e78e0b3b0c8f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OtangelesDesignSystem_4d5ade = window.OtangelesDesignSystem_4d5ade || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/clerk-portal/kit-primitives.jsx
try { (() => {
// Otangeles Notes+ Provider-Portal — shared UI primitives
// Figma: /Provider-Portal, /Initial/Logo
// Fonts: Inter everywhere; Montserrat is reserved for the <Brand> logo lockup.

const {
  useState
} = React;
const COLORS = {
  primary: '#7B61FF',
  primaryDark: '#6A52E5',
  primaryTint: '#F0EDFF',
  coral: '#EF4444',
  coralTint: '#FEF5E7',
  peach: '#F59E0B',
  mint: '#22C5A7',
  mintDark: '#22C5A7',
  mintTint: '#E6F8F4',
  pink: '#EF4444',
  pinkTint: '#FDECEC',
  blue: '#3B82F6',
  gold: '#F59E0B',
  fg1: '#0F1B2E',
  fg2: '#6B7280',
  fg3: '#94A3B8',
  border: '#E5E7EB',
  borderStrong: '#D1D5DC',
  divider: '#EEEEEE',
  surface: '#FFFFFF',
  canvas: '#F8FAFC',
  hover: '#F1F5F9',
  surfaceAlt: '#F9FAFB'
};
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2
}) {
  // Lightweight Lucide-style outline icons inline so we don't depend on a lib.
  const paths = {
    dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    encounter: 'M9 11l3 3 L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    patients: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    schedules: 'M21 10H3 M8 2v4 M16 2v4 M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z',
    metrics: 'M3 3v18h18 M7 14l4-4 4 4 5-5',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z',
    bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3',
    chevronDown: 'm6 9 6 6 6-6',
    chevronRight: 'm9 18 6-6-6-6',
    chevronLeft: 'm15 18-6-6 6-6',
    plus: 'M12 5v14 M5 12h14',
    x: 'M18 6 6 18 M6 6l12 12',
    check: 'M20 6 9 17l-5-5',
    pill: 'M10.5 20.5a6.5 6.5 0 1 1 9.2-9.2L11 20a6.5 6.5 0 0 1-.5.5Z M8.5 8.5l7 7',
    clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    stetho: 'M6 3v6a6 6 0 0 0 12 0V3 M18 16a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z M12 15v3a3 3 0 0 0 3 3',
    fileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z M14 2v6h6 M8 13h8 M8 17h8 M8 9h3',
    arrowRight: 'm5 12h14 m-6-6 6 6-6 6',
    alert: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z M12 9v4 M12 17h.01',
    filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
    menu: 'M3 6h18 M3 12h18 M3 18h18',
    more: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
  };
  const d = paths[name] || paths.dashboard;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, d.split(' M').map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: i ? 'M' + p : p
  })));
}
function Logo({
  size = 35,
  src = '../../assets/brand/logo-mark.png'
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    width: size,
    height: size,
    alt: "Otangeles",
    style: {
      display: 'block',
      flexShrink: 0
    }
  });
}

// Full horizontal wordmark lockup (icon + "Otangeles Notes+"). The SVG is a
// single asset — height in px controls overall size; width scales proportionally
// (native 145×35).
function Brand({
  height = 28,
  src = '../../assets/brand/logo-horizontal.jpeg'
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    height: height,
    alt: "Otangeles Notes+",
    style: {
      display: 'block',
      height,
      width: 'auto'
    }
  });
}
function Avatar({
  initials = 'JC',
  size = 36,
  gradient = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9999,
      background: gradient ? 'linear-gradient(#7B61FF, #22C5A7)' : '#F0EDFF',
      color: gradient ? '#fff' : '#7B61FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: size * 0.38,
      fontFamily: 'Inter'
    }
  }, initials);
}
function Chip({
  tone = 'todo',
  children
}) {
  const tones = {
    todo: {
      bg: '#F0EDFF',
      fg: '#6A52E5'
    },
    review: {
      bg: '#FEF5E7',
      fg: '#EF4444'
    },
    signing: {
      bg: '#FDECEC',
      fg: '#EF4444'
    },
    signed: {
      bg: '#E6F8F4',
      fg: '#22C5A7'
    },
    voided: {
      bg: '#F3F4F6',
      fg: '#6B7280'
    },
    pending: {
      bg: '#FEF5E7',
      fg: '#B45309'
    }
  };
  const t = tones[tone] || tones.todo;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 9999,
      background: t.bg,
      color: t.fg,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.02em',
      fontFamily: 'Inter'
    }
  }, children);
}
function Button({
  variant = 'primary',
  icon,
  children,
  onClick,
  style
}) {
  const base = {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '20px',
    padding: '10px 16px',
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 150ms ease-out'
  };
  const variants = {
    primary: {
      background: '#7B61FF',
      color: '#fff'
    },
    secondary: {
      background: '#fff',
      color: '#6B7280',
      borderColor: '#E5E7EB'
    },
    ghost: {
      background: 'transparent',
      color: '#7B61FF'
    },
    danger: {
      background: '#fff',
      color: '#EF4444',
      borderColor: '#EF4444'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: variants[variant].color
  }), children);
}
function Input({
  icon,
  rightIcon,
  placeholder,
  value,
  onChange,
  type = 'text',
  style
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      border: `1px solid ${focus ? '#7B61FF' : '#E5E7EB'}`,
      borderRadius: 5,
      padding: '14px 15px',
      height: 48,
      background: '#fff',
      boxSizing: 'border-box',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: "#94A3B8"
  }), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 0,
      outline: 0,
      font: '14px Inter',
      color: '#0F1B2E',
      minWidth: 0
    }
  }), rightIcon && /*#__PURE__*/React.createElement(Icon, {
    name: rightIcon,
    size: 18,
    color: "#6B7280"
  }));
}
function Card({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.1)',
      padding: 20,
      ...style
    }
  }, children);
}
Object.assign(window, {
  COLORS,
  Icon,
  Logo,
  Brand,
  Avatar,
  Chip,
  Button,
  Input,
  Card
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/clerk-portal/kit-primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/encounter/encounter-bodies.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Encounter section bodies — HPI, ROS, PE, TP examples built on primitives.

function HPIBody() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 8,
      color: '#0F1B2E'
    }
  }, "Chief Complaint"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      fontSize: 14,
      color: '#0F1B2E',
      lineHeight: '22px'
    }
  }, "Patient presents for follow-up after fall. Reports mild pain in left hip, 3/10, intermittent. No loss of consciousness. No head strike.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 8,
      color: '#0F1B2E'
    }
  }, "Onset"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    tone: "todo"
  }, "Acute"), /*#__PURE__*/React.createElement(Chip, {
    tone: "voided"
  }, "Gradual"), /*#__PURE__*/React.createElement(Chip, {
    tone: "voided"
  }, "Chronic"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 8,
      color: '#0F1B2E'
    }
  }, "Associated Symptoms"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, ['Hip pain', 'Bruising', 'Limited ROM', 'Dizziness', 'Nausea'].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      padding: '8px 12px',
      borderRadius: 9999,
      background: '#F0EDFF',
      color: '#6A52E5',
      fontSize: 12,
      fontWeight: 600
    }
  }, s)))));
}
function ROSBody() {
  const systems = [{
    name: 'General',
    neg: true
  }, {
    name: 'Eyes',
    pos: true,
    note: 'Blurred vision intermittent'
  }, {
    name: 'Ears, Nose, Mouth, Throat',
    neg: true
  }, {
    name: 'Cardiovascular',
    neg: true
  }, {
    name: 'Respiratory',
    pos: true,
    note: 'Mild SOB on exertion'
  }, {
    name: 'Gastrointestinal',
    neg: true
  }, {
    name: 'Musculoskeletal',
    pos: true,
    note: 'L hip pain, see HPI'
  }, {
    name: 'Neurological',
    neg: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "check"
  }, "Denies All"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Reset Findings")), systems.map(s => /*#__PURE__*/React.createElement(FindingItem, {
    key: s.name,
    label: s.name,
    value: s.note || (s.neg ? 'Denies' : s.pos ? 'Reports' : 'Not set'),
    pos: !!s.pos,
    neg: !!s.neg
  })));
}
function PEBody() {
  const findings = [{
    name: 'Well-nourished',
    neg: true,
    note: 'Appears well-nourished'
  }, {
    name: 'Level of Consciousness',
    neg: true,
    note: 'Alert and oriented ×3'
  }, {
    name: 'Speech',
    neg: true,
    note: 'Clear, fluent'
  }, {
    name: 'Heart sounds',
    neg: true,
    note: 'RRR, no murmurs'
  }, {
    name: 'CTA (Clear to Auscultation)',
    pos: true,
    note: 'Faint wheeze L base'
  }, {
    name: 'Bowel sounds',
    neg: true,
    note: 'Normoactive'
  }, {
    name: 'Edema in lower extremities',
    pos: true,
    note: '1+ pitting bilaterally'
  }, {
    name: 'Gait',
    pos: true,
    note: 'Antalgic, favoring L hip'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, findings.map(f => /*#__PURE__*/React.createElement(FindingItem, _extends({
    key: f.name
  }, f))));
}
function TPBody() {
  const problems = [{
    problem: 'Fall without injury',
    action: 'Continue PT',
    code: 'Z91.81',
    status: 'todo',
    statusLabel: 'ACTIVE'
  }, {
    problem: 'HTN, essential',
    action: 'Continue lisinopril',
    code: 'I10',
    status: 'todo',
    statusLabel: 'STABLE'
  }, {
    problem: 'T2DM, uncomplicated',
    action: 'Monitor A1c',
    code: 'E11.9',
    status: 'pending',
    statusLabel: 'MONITOR'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus"
  }, "Add Problem"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Generate")), problems.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.code,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 120px 120px',
      gap: 16,
      alignItems: 'center',
      padding: '16px 20px',
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: '#0F1B2E'
    }
  }, p.problem), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#6B7280',
      marginTop: 2,
      fontFamily: 'JetBrains Mono',
      fontWeight: 700
    }
  }, p.code)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#0F1B2E'
    }
  }, p.action), /*#__PURE__*/React.createElement(Chip, {
    tone: p.status
  }, p.statusLabel), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Edit"))));
}
Object.assign(window, {
  HPIBody,
  ROSBody,
  PEBody,
  TPBody
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/encounter/encounter-bodies.jsx", error: String((e && e.message) || e) }); }

// ui_kits/encounter/encounter-shell.jsx
try { (() => {
// Encounter editor shell — the heart of Otangeles Notes+.
// Figma: /Encounter/Encounter-Container, /Encounter-Components/*

const SECTIONS = [{
  id: 'hpi',
  label: 'HPI'
}, {
  id: 'ros',
  label: 'ROS'
}, {
  id: 'pe',
  label: 'PE'
}, {
  id: 'ap',
  label: 'A&P'
}, {
  id: 'tp',
  label: 'Treatment Plan'
}, {
  id: 'meds',
  label: 'Medications'
}, {
  id: 'allergies',
  label: 'Allergies'
}, {
  id: 'labs',
  label: 'Labs'
}, {
  id: 'codes',
  label: 'Codes'
}];
function EncounterHeader({
  patient
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderBottom: '1px solid #E5E7EB',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: patient.initials,
    size: 48
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: '#0F1B2E'
    }
  }, patient.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      fontSize: 12,
      color: '#6B7280'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono',
      fontWeight: 700
    }
  }, "MRN ", patient.mrn), /*#__PURE__*/React.createElement("span", null, "DOB ", patient.dob), /*#__PURE__*/React.createElement("span", null, patient.age, "y \xB7 ", patient.sex), /*#__PURE__*/React.createElement("span", null, patient.facility))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Chip, {
    tone: "review"
  }, "For Review"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "fileText"
  }, "Preview Note"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "check"
  }, "Submit to Provider"));
}
function EncounterTabs({
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderBottom: '1px solid #E5E7EB',
      padding: '0 32px',
      display: 'flex',
      gap: 4
    }
  }, SECTIONS.map(s => {
    const isActive = s.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      onClick: () => onChange(s.id),
      style: {
        border: 0,
        background: 'transparent',
        padding: '14px 16px',
        cursor: 'pointer',
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: isActive ? 700 : 600,
        color: isActive ? '#7B61FF' : '#6B7280',
        borderBottom: `2px solid ${isActive ? '#7B61FF' : 'transparent'}`
      }
    }, s.label);
  }));
}

// ----- finding primitives (replicates PE/ROS Finding Item pattern) -----
function FindingItem({
  label,
  value = 'Not set',
  pos = false,
  neg = false,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 14,
      fontWeight: 600,
      color: '#0F1B2E'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#6B7280',
      marginRight: 8
    }
  }, value), /*#__PURE__*/React.createElement("button", {
    onClick: () => onToggle && onToggle('neg'),
    style: togglePill(neg, '#EF4444', '#FDECEC')
  }, "Neg"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onToggle && onToggle('pos'),
    style: togglePill(pos, '#22C5A7', '#E6F8F4')
  }, "Pos"));
}
const togglePill = (active, fg, bg) => ({
  padding: '6px 14px',
  borderRadius: 9999,
  border: 0,
  fontFamily: 'Inter',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  background: active ? fg : bg,
  color: active ? '#fff' : fg,
  transition: 'all 120ms ease-out'
});
function SectionAccordion({
  title,
  status = 'todo',
  statusLabel = 'TO DO',
  children,
  defaultOpen = true
}) {
  const [open, setOpen] = useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 24px',
      background: '#fff',
      border: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: open ? 'chevronDown' : 'chevronRight',
    size: 18,
    color: "#6B7280"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'left',
      fontSize: 16,
      fontWeight: 700,
      color: '#0F1B2E'
    }
  }, title), /*#__PURE__*/React.createElement(Chip, {
    tone: status
  }, statusLabel)), open && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      borderTop: '1px solid #E5E7EB',
      background: '#F9FAFB'
    }
  }, children));
}
Object.assign(window, {
  SECTIONS,
  EncounterHeader,
  EncounterTabs,
  FindingItem,
  SectionAccordion
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/encounter/encounter-shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/encounter/kit-primitives.jsx
try { (() => {
// Otangeles Notes+ Provider-Portal — shared UI primitives
// Figma: /Provider-Portal, /Initial/Logo
// Fonts: Inter everywhere; Montserrat is reserved for the <Brand> logo lockup.

const {
  useState
} = React;
const COLORS = {
  primary: '#7B61FF',
  primaryDark: '#6A52E5',
  primaryTint: '#F0EDFF',
  coral: '#EF4444',
  coralTint: '#FEF5E7',
  peach: '#F59E0B',
  mint: '#22C5A7',
  mintDark: '#22C5A7',
  mintTint: '#E6F8F4',
  pink: '#EF4444',
  pinkTint: '#FDECEC',
  blue: '#3B82F6',
  gold: '#F59E0B',
  fg1: '#0F1B2E',
  fg2: '#6B7280',
  fg3: '#94A3B8',
  border: '#E5E7EB',
  borderStrong: '#D1D5DC',
  divider: '#EEEEEE',
  surface: '#FFFFFF',
  canvas: '#F8FAFC',
  hover: '#F1F5F9',
  surfaceAlt: '#F9FAFB'
};
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2
}) {
  // Lightweight Lucide-style outline icons inline so we don't depend on a lib.
  const paths = {
    dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    encounter: 'M9 11l3 3 L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    patients: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    schedules: 'M21 10H3 M8 2v4 M16 2v4 M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z',
    metrics: 'M3 3v18h18 M7 14l4-4 4 4 5-5',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z',
    bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3',
    chevronDown: 'm6 9 6 6 6-6',
    chevronRight: 'm9 18 6-6-6-6',
    chevronLeft: 'm15 18-6-6 6-6',
    plus: 'M12 5v14 M5 12h14',
    x: 'M18 6 6 18 M6 6l12 12',
    check: 'M20 6 9 17l-5-5',
    pill: 'M10.5 20.5a6.5 6.5 0 1 1 9.2-9.2L11 20a6.5 6.5 0 0 1-.5.5Z M8.5 8.5l7 7',
    clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    stetho: 'M6 3v6a6 6 0 0 0 12 0V3 M18 16a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z M12 15v3a3 3 0 0 0 3 3',
    fileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z M14 2v6h6 M8 13h8 M8 17h8 M8 9h3',
    arrowRight: 'm5 12h14 m-6-6 6 6-6 6',
    alert: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z M12 9v4 M12 17h.01',
    filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
    menu: 'M3 6h18 M3 12h18 M3 18h18',
    more: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
  };
  const d = paths[name] || paths.dashboard;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, d.split(' M').map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: i ? 'M' + p : p
  })));
}
function Logo({
  size = 35,
  src = '../../assets/brand/logo-mark.png'
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    width: size,
    height: size,
    alt: "Otangeles",
    style: {
      display: 'block',
      flexShrink: 0
    }
  });
}

// Full horizontal wordmark lockup (icon + "Otangeles Notes+"). The SVG is a
// single asset — height in px controls overall size; width scales proportionally
// (native 145×35).
function Brand({
  height = 28,
  src = '../../assets/brand/logo-horizontal.jpeg'
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    height: height,
    alt: "Otangeles Notes+",
    style: {
      display: 'block',
      height,
      width: 'auto'
    }
  });
}
function Avatar({
  initials = 'JC',
  size = 36,
  gradient = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9999,
      background: gradient ? 'linear-gradient(#7B61FF, #22C5A7)' : '#F0EDFF',
      color: gradient ? '#fff' : '#7B61FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: size * 0.38,
      fontFamily: 'Inter'
    }
  }, initials);
}
function Chip({
  tone = 'todo',
  children
}) {
  const tones = {
    todo: {
      bg: '#F0EDFF',
      fg: '#6A52E5'
    },
    review: {
      bg: '#FEF5E7',
      fg: '#EF4444'
    },
    signing: {
      bg: '#FDECEC',
      fg: '#EF4444'
    },
    signed: {
      bg: '#E6F8F4',
      fg: '#22C5A7'
    },
    voided: {
      bg: '#F3F4F6',
      fg: '#6B7280'
    },
    pending: {
      bg: '#FEF5E7',
      fg: '#B45309'
    }
  };
  const t = tones[tone] || tones.todo;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 9999,
      background: t.bg,
      color: t.fg,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.02em',
      fontFamily: 'Inter'
    }
  }, children);
}
function Button({
  variant = 'primary',
  icon,
  children,
  onClick,
  style
}) {
  const base = {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '20px',
    padding: '10px 16px',
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 150ms ease-out'
  };
  const variants = {
    primary: {
      background: '#7B61FF',
      color: '#fff'
    },
    secondary: {
      background: '#fff',
      color: '#6B7280',
      borderColor: '#E5E7EB'
    },
    ghost: {
      background: 'transparent',
      color: '#7B61FF'
    },
    danger: {
      background: '#fff',
      color: '#EF4444',
      borderColor: '#EF4444'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: variants[variant].color
  }), children);
}
function Input({
  icon,
  rightIcon,
  placeholder,
  value,
  onChange,
  type = 'text',
  style
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      border: `1px solid ${focus ? '#7B61FF' : '#E5E7EB'}`,
      borderRadius: 5,
      padding: '14px 15px',
      height: 48,
      background: '#fff',
      boxSizing: 'border-box',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: "#94A3B8"
  }), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 0,
      outline: 0,
      font: '14px Inter',
      color: '#0F1B2E',
      minWidth: 0
    }
  }), rightIcon && /*#__PURE__*/React.createElement(Icon, {
    name: rightIcon,
    size: 18,
    color: "#6B7280"
  }));
}
function Card({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.1)',
      padding: 20,
      ...style
    }
  }, children);
}
Object.assign(window, {
  COLORS,
  Icon,
  Logo,
  Brand,
  Avatar,
  Chip,
  Button,
  Input,
  Card
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/encounter/kit-primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/provider-portal/dashboard.jsx
try { (() => {
// Dashboard page — recreated from /Provider-Portal/Main-Screens/Dashboard (133:4120)

function Dashboard() {
  return /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: 32,
      background: '#F8FAFC',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'Inter',
      fontWeight: 700,
      fontSize: 30,
      lineHeight: 1,
      color: '#7B61FF'
    }
  }, "Hi, John!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: '#6B7280'
    }
  }, "Select a facility you want to view:"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      height: 40,
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 5,
      display: 'flex',
      alignItems: 'center',
      padding: '0 14px',
      justifyContent: 'space-between',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, "Sunnybrook Skilled Nursing \xB7 Bld A"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 16,
    color: "#6B7280"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "New Admissions",
    value: "12",
    tone: "primary",
    delta: "+3 today"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Open Encounters",
    value: "28",
    tone: "coral",
    delta: "4 overdue"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "W-RVU This Week",
    value: "146.8",
    tone: "mint",
    delta: "\u25B2 8% vs last"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(PatientSchedulesCard, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(DiagnosticResultsCard, null), /*#__PURE__*/React.createElement(DocumentsCard, null))));
}
function StatCard({
  label,
  value,
  tone,
  delta
}) {
  const tones = {
    primary: {
      bar: '#7B61FF',
      tint: '#F0EDFF'
    },
    coral: {
      bar: '#EF4444',
      tint: '#FEF5E7'
    },
    mint: {
      bar: '#22C5A7',
      tint: '#E6F8F4'
    }
  };
  const t = tones[tone];
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 16,
      minWidth: 200,
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 12,
      background: t.tint,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "activity",
    size: 22,
    color: t.bar
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: 600
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: '#0F1B2E',
      lineHeight: 1.1,
      marginTop: 2
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: t.bar,
      fontWeight: 600,
      marginTop: 2
    }
  }, delta)));
}
function PatientSchedulesCard() {
  const rows = [{
    name: 'Adam Linda',
    mrn: '0034-772',
    room: '312B',
    status: 'signing',
    label: 'FOR SIGNING',
    time: '09:00'
  }, {
    name: 'Marjorie Bell',
    mrn: '0034-781',
    room: '218A',
    status: 'review',
    label: 'FOR REVIEW',
    time: '09:30'
  }, {
    name: 'Harold Chen',
    mrn: '0034-799',
    room: '104C',
    status: 'todo',
    label: 'TO DO',
    time: '10:15'
  }, {
    name: 'Priscilla Owens',
    mrn: '0034-803',
    room: '221B',
    status: 'signed',
    label: 'SIGNED',
    time: '11:00'
  }, {
    name: 'Rafael Moreno',
    mrn: '0034-815',
    room: '305A',
    status: 'todo',
    label: 'TO DO',
    time: '13:15'
  }, {
    name: 'Gladys Howe',
    mrn: '0034-829',
    room: '117',
    status: 'voided',
    label: 'VOIDED',
    time: '14:00'
  }];
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #EEEEEE'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 700
    }
  }, "Patient Schedules"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "filter"
  }, "Filter"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus"
  }, "Add Patient"))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'Inter'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: 600,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Patient"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "MRN"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Room"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Time"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: th
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderTop: '1px solid #EEEEEE'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: r.name.split(' ').map(s => s[0]).join(''),
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, r.name))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontFamily: 'JetBrains Mono',
      fontSize: 12,
      color: '#6B7280'
    }
  }, r.mrn), /*#__PURE__*/React.createElement("td", {
    style: td
  }, r.room), /*#__PURE__*/React.createElement("td", {
    style: td
  }, r.time), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Chip, {
    tone: r.status
  }, r.label)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Open Encounter")))))));
}
const th = {
  padding: '12px 24px',
  fontWeight: 600
};
const td = {
  padding: '14px 24px',
  fontSize: 14,
  color: '#0F1B2E'
};
function DiagnosticResultsCard() {
  const rows = [{
    code: 'CBC',
    label: 'Complete Blood Count',
    flag: 'Normal',
    tone: 'signed'
  }, {
    code: 'BMP',
    label: 'Basic Metabolic Panel',
    flag: 'H · K+ 5.4',
    tone: 'review'
  }, {
    code: 'CXR',
    label: 'Chest X-Ray',
    flag: 'New',
    tone: 'todo'
  }];
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      fontWeight: 700,
      fontSize: 16,
      borderBottom: '1px solid #EEEEEE'
    }
  }, "Diagnostic Results"), /*#__PURE__*/React.createElement("div", null, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: i ? '1px solid #EEEEEE' : 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, r.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#6B7280',
      fontFamily: 'JetBrains Mono'
    }
  }, r.code)), /*#__PURE__*/React.createElement(Chip, {
    tone: r.tone
  }, r.flag)))));
}
function DocumentsCard() {
  const rows = [{
    name: 'H&P · A. Linda',
    date: 'Apr 22'
  }, {
    name: 'Discharge summary · P. Owens',
    date: 'Apr 21'
  }, {
    name: 'Wound care order · H. Chen',
    date: 'Apr 21'
  }];
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      fontWeight: 700,
      fontSize: 16,
      borderBottom: '1px solid #EEEEEE'
    }
  }, "Documents"), /*#__PURE__*/React.createElement("div", null, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '12px 20px',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      borderTop: i ? '1px solid #EEEEEE' : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      background: '#F0EDFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "fileText",
    size: 18,
    color: "#7B61FF"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#6B7280'
    }
  }, r.date)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 16,
    color: "#94A3B8"
  })))));
}
Object.assign(window, {
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider-portal/dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/provider-portal/kit-primitives.jsx
try { (() => {
// Otangeles Notes+ Provider-Portal — shared UI primitives
// Figma: /Provider-Portal, /Initial/Logo
// Fonts: Inter everywhere; Montserrat is reserved for the <Brand> logo lockup.

const {
  useState
} = React;
const COLORS = {
  primary: '#7B61FF',
  primaryDark: '#6A52E5',
  primaryTint: '#F0EDFF',
  coral: '#EF4444',
  coralTint: '#FEF5E7',
  peach: '#F59E0B',
  mint: '#22C5A7',
  mintDark: '#22C5A7',
  mintTint: '#E6F8F4',
  pink: '#EF4444',
  pinkTint: '#FDECEC',
  blue: '#3B82F6',
  gold: '#F59E0B',
  fg1: '#0F1B2E',
  fg2: '#6B7280',
  fg3: '#94A3B8',
  border: '#E5E7EB',
  borderStrong: '#D1D5DC',
  divider: '#EEEEEE',
  surface: '#FFFFFF',
  canvas: '#F8FAFC',
  hover: '#F1F5F9',
  surfaceAlt: '#F9FAFB'
};
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2
}) {
  // Lightweight Lucide-style outline icons inline so we don't depend on a lib.
  const paths = {
    dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    encounter: 'M9 11l3 3 L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    patients: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    schedules: 'M21 10H3 M8 2v4 M16 2v4 M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z',
    metrics: 'M3 3v18h18 M7 14l4-4 4 4 5-5',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z',
    bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3',
    chevronDown: 'm6 9 6 6 6-6',
    chevronRight: 'm9 18 6-6-6-6',
    chevronLeft: 'm15 18-6-6 6-6',
    plus: 'M12 5v14 M5 12h14',
    x: 'M18 6 6 18 M6 6l12 12',
    check: 'M20 6 9 17l-5-5',
    pill: 'M10.5 20.5a6.5 6.5 0 1 1 9.2-9.2L11 20a6.5 6.5 0 0 1-.5.5Z M8.5 8.5l7 7',
    clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    stetho: 'M6 3v6a6 6 0 0 0 12 0V3 M18 16a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z M12 15v3a3 3 0 0 0 3 3',
    fileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z M14 2v6h6 M8 13h8 M8 17h8 M8 9h3',
    arrowRight: 'm5 12h14 m-6-6 6 6-6 6',
    alert: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z M12 9v4 M12 17h.01',
    filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
    menu: 'M3 6h18 M3 12h18 M3 18h18',
    more: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
  };
  const d = paths[name] || paths.dashboard;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, d.split(' M').map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: i ? 'M' + p : p
  })));
}
function Logo({
  size = 35,
  src = '../../assets/brand/logo-mark.png'
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    width: size,
    height: size,
    alt: "Otangeles",
    style: {
      display: 'block',
      flexShrink: 0
    }
  });
}

// Full horizontal wordmark lockup (icon + "Otangeles Notes+"). The SVG is a
// single asset — height in px controls overall size; width scales proportionally
// (native 145×35).
function Brand({
  height = 28,
  src = '../../assets/brand/logo-horizontal.jpeg'
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    height: height,
    alt: "Otangeles Notes+",
    style: {
      display: 'block',
      height,
      width: 'auto'
    }
  });
}
function Avatar({
  initials = 'JC',
  size = 36,
  gradient = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9999,
      background: gradient ? 'linear-gradient(#7B61FF, #22C5A7)' : '#F0EDFF',
      color: gradient ? '#fff' : '#7B61FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: size * 0.38,
      fontFamily: 'Inter'
    }
  }, initials);
}
function Chip({
  tone = 'todo',
  children
}) {
  const tones = {
    todo: {
      bg: '#F0EDFF',
      fg: '#6A52E5'
    },
    review: {
      bg: '#FEF5E7',
      fg: '#EF4444'
    },
    signing: {
      bg: '#FDECEC',
      fg: '#EF4444'
    },
    signed: {
      bg: '#E6F8F4',
      fg: '#22C5A7'
    },
    voided: {
      bg: '#F3F4F6',
      fg: '#6B7280'
    },
    pending: {
      bg: '#FEF5E7',
      fg: '#B45309'
    }
  };
  const t = tones[tone] || tones.todo;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 9999,
      background: t.bg,
      color: t.fg,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.02em',
      fontFamily: 'Inter'
    }
  }, children);
}
function Button({
  variant = 'primary',
  icon,
  children,
  onClick,
  style
}) {
  const base = {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '20px',
    padding: '10px 16px',
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 150ms ease-out'
  };
  const variants = {
    primary: {
      background: '#7B61FF',
      color: '#fff'
    },
    secondary: {
      background: '#fff',
      color: '#6B7280',
      borderColor: '#E5E7EB'
    },
    ghost: {
      background: 'transparent',
      color: '#7B61FF'
    },
    danger: {
      background: '#fff',
      color: '#EF4444',
      borderColor: '#EF4444'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: variants[variant].color
  }), children);
}
function Input({
  icon,
  rightIcon,
  placeholder,
  value,
  onChange,
  type = 'text',
  style
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      border: `1px solid ${focus ? '#7B61FF' : '#E5E7EB'}`,
      borderRadius: 5,
      padding: '14px 15px',
      height: 48,
      background: '#fff',
      boxSizing: 'border-box',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: "#94A3B8"
  }), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 0,
      outline: 0,
      font: '14px Inter',
      color: '#0F1B2E',
      minWidth: 0
    }
  }), rightIcon && /*#__PURE__*/React.createElement(Icon, {
    name: rightIcon,
    size: 18,
    color: "#6B7280"
  }));
}
function Card({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.1)',
      padding: 20,
      ...style
    }
  }, children);
}
Object.assign(window, {
  COLORS,
  Icon,
  Logo,
  Brand,
  Avatar,
  Chip,
  Button,
  Input,
  Card
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider-portal/kit-primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/provider-portal/login.jsx
try { (() => {
// Login screen — /Provider-Portal/Login (681:24890)
function Login({
  onSignIn
}) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 578,
      background: '#fff',
      borderRadius: 24,
      boxShadow: '0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.1)',
      padding: 64,
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Brand, {
    height: 42
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontWeight: 700,
      fontSize: 24,
      color: '#7B61FF',
      marginBottom: 8
    }
  }, "Welcome Back!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: '#6B7280'
    }
  }, "Sign in to continue to your dashboard.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: '#6B7280',
      marginBottom: 12
    }
  }, "Email Address"), /*#__PURE__*/React.createElement(Input, {
    icon: "encounter",
    placeholder: "you@company.com",
    value: email,
    onChange: e => setEmail(e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: '#6B7280',
      marginBottom: 12
    }
  }, "Password"), /*#__PURE__*/React.createElement(Input, {
    rightIcon: "search",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: pw,
    onChange: e => setPw(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      fontSize: 13,
      color: '#6B7280'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: true
  }), " Remember me"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: '#7B61FF',
      fontSize: 13,
      fontWeight: 600,
      textDecoration: 'none'
    }
  }, "Forgot password?")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    style: {
      width: '100%',
      justifyContent: 'center',
      height: 48,
      fontSize: 16
    },
    onClick: onSignIn
  }, "Sign In")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#6B7280',
      textAlign: 'center'
    }
  }, "By signing in, you agree to the Otangeles Notes+ Terms of Service and HIPAA Privacy Notice.")));
}
Object.assign(window, {
  Login
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider-portal/login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/provider-portal/shell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Header + SideNav shells for Provider Portal

function Header({
  userInitials = 'JC',
  userName = 'Dr. John Carter'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      background: '#fff',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(Brand, {
    height: 30
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 16,
      flex: 1,
      maxWidth: 520,
      background: '#F8FAFC',
      border: '1px solid #E5E7EB',
      borderRadius: 5,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 14px',
      fontSize: 14,
      color: '#94A3B8',
      fontFamily: 'Inter'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    color: "#94A3B8"
  }), "Search patients, MRN, encounters\u2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: iconBtn
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 18,
    color: "#6B7280"
  }), /*#__PURE__*/React.createElement("span", {
    style: notifDot
  })), /*#__PURE__*/React.createElement("button", {
    style: iconBtn
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 18,
    color: "#6B7280"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginLeft: 4,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: userInitials,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: '#0F1B2E'
    }
  }, userName), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#6B7280'
    }
  }, "Provider")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 16,
    color: "#6B7280"
  })));
}
const iconBtn = {
  width: 40,
  height: 40,
  borderRadius: 9999,
  background: '#fff',
  border: '1px solid #E5E7EB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'pointer'
};
const notifDot = {
  position: 'absolute',
  top: 8,
  right: 8,
  width: 8,
  height: 8,
  borderRadius: 9999,
  background: '#EF4444',
  border: '2px solid #fff'
};
function SideNav({
  active,
  onNav,
  collapsed = false
}) {
  const items = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard'
  }, {
    id: 'encounters',
    label: 'Encounters',
    icon: 'encounter'
  }, {
    id: 'patients',
    label: 'Patients',
    icon: 'patients'
  }, {
    id: 'schedules',
    label: 'Schedules',
    icon: 'schedules'
  }, {
    id: 'metrics',
    label: 'Metrics',
    icon: 'metrics'
  }, {
    id: 'settings',
    label: 'Settings',
    icon: 'settings'
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: collapsed ? 72 : 280,
      background: '#fff',
      borderRight: '1px solid #E5E7EB',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: 64
    }
  }, items.map(it => /*#__PURE__*/React.createElement(NavItem, _extends({
    key: it.id
  }, it, {
    active: active === it.id,
    collapsed: collapsed,
    onClick: () => onNav && onNav(it.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderRadius: 8,
      background: '#F0EDFF',
      fontSize: 12,
      color: '#6A52E5',
      lineHeight: '18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginBottom: 4
    }
  }, "Need help?"), "Reach the clinical support desk 24/7."));
}
function NavItem({
  icon,
  label,
  active,
  collapsed,
  onClick
}) {
  const [hover, setHover] = useState(false);
  const bg = active ? '#7B61FF' : hover ? '#F1F5F9' : '#fff';
  const color = active ? '#fff' : '#6B7280';
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: collapsed ? 12 : '12px 14px',
      borderRadius: 4,
      background: bg,
      color,
      border: 0,
      cursor: 'pointer',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 700,
      justifyContent: collapsed ? 'center' : 'flex-start',
      transition: 'background 120ms ease-out'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20,
    color: color
  }), !collapsed && label);
}
Object.assign(window, {
  Header,
  SideNav,
  NavItem
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider-portal/shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/scribe-portal/kit-primitives.jsx
try { (() => {
// Otangeles Notes+ Provider-Portal — shared UI primitives
// Figma: /Provider-Portal, /Initial/Logo
// Fonts: Inter everywhere; Montserrat is reserved for the <Brand> logo lockup.

const {
  useState
} = React;
const COLORS = {
  primary: '#7B61FF',
  primaryDark: '#6A52E5',
  primaryTint: '#F0EDFF',
  coral: '#EF4444',
  coralTint: '#FEF5E7',
  peach: '#F59E0B',
  mint: '#22C5A7',
  mintDark: '#22C5A7',
  mintTint: '#E6F8F4',
  pink: '#EF4444',
  pinkTint: '#FDECEC',
  blue: '#3B82F6',
  gold: '#F59E0B',
  fg1: '#0F1B2E',
  fg2: '#6B7280',
  fg3: '#94A3B8',
  border: '#E5E7EB',
  borderStrong: '#D1D5DC',
  divider: '#EEEEEE',
  surface: '#FFFFFF',
  canvas: '#F8FAFC',
  hover: '#F1F5F9',
  surfaceAlt: '#F9FAFB'
};
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2
}) {
  // Lightweight Lucide-style outline icons inline so we don't depend on a lib.
  const paths = {
    dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    encounter: 'M9 11l3 3 L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    patients: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    schedules: 'M21 10H3 M8 2v4 M16 2v4 M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z',
    metrics: 'M3 3v18h18 M7 14l4-4 4 4 5-5',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z',
    bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3',
    chevronDown: 'm6 9 6 6 6-6',
    chevronRight: 'm9 18 6-6-6-6',
    chevronLeft: 'm15 18-6-6 6-6',
    plus: 'M12 5v14 M5 12h14',
    x: 'M18 6 6 18 M6 6l12 12',
    check: 'M20 6 9 17l-5-5',
    pill: 'M10.5 20.5a6.5 6.5 0 1 1 9.2-9.2L11 20a6.5 6.5 0 0 1-.5.5Z M8.5 8.5l7 7',
    clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    stetho: 'M6 3v6a6 6 0 0 0 12 0V3 M18 16a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z M12 15v3a3 3 0 0 0 3 3',
    fileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z M14 2v6h6 M8 13h8 M8 17h8 M8 9h3',
    arrowRight: 'm5 12h14 m-6-6 6 6-6 6',
    alert: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z M12 9v4 M12 17h.01',
    filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
    menu: 'M3 6h18 M3 12h18 M3 18h18',
    more: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
  };
  const d = paths[name] || paths.dashboard;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, d.split(' M').map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: i ? 'M' + p : p
  })));
}
function Logo({
  size = 35,
  src = '../../assets/brand/logo-mark.png'
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    width: size,
    height: size,
    alt: "Otangeles",
    style: {
      display: 'block',
      flexShrink: 0
    }
  });
}

// Full horizontal wordmark lockup (icon + "Otangeles Notes+"). The SVG is a
// single asset — height in px controls overall size; width scales proportionally
// (native 145×35).
function Brand({
  height = 28,
  src = '../../assets/brand/logo-horizontal.jpeg'
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    height: height,
    alt: "Otangeles Notes+",
    style: {
      display: 'block',
      height,
      width: 'auto'
    }
  });
}
function Avatar({
  initials = 'JC',
  size = 36,
  gradient = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9999,
      background: gradient ? 'linear-gradient(#7B61FF, #22C5A7)' : '#F0EDFF',
      color: gradient ? '#fff' : '#7B61FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: size * 0.38,
      fontFamily: 'Inter'
    }
  }, initials);
}
function Chip({
  tone = 'todo',
  children
}) {
  const tones = {
    todo: {
      bg: '#F0EDFF',
      fg: '#6A52E5'
    },
    review: {
      bg: '#FEF5E7',
      fg: '#EF4444'
    },
    signing: {
      bg: '#FDECEC',
      fg: '#EF4444'
    },
    signed: {
      bg: '#E6F8F4',
      fg: '#22C5A7'
    },
    voided: {
      bg: '#F3F4F6',
      fg: '#6B7280'
    },
    pending: {
      bg: '#FEF5E7',
      fg: '#B45309'
    }
  };
  const t = tones[tone] || tones.todo;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 9999,
      background: t.bg,
      color: t.fg,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.02em',
      fontFamily: 'Inter'
    }
  }, children);
}
function Button({
  variant = 'primary',
  icon,
  children,
  onClick,
  style
}) {
  const base = {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '20px',
    padding: '10px 16px',
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 150ms ease-out'
  };
  const variants = {
    primary: {
      background: '#7B61FF',
      color: '#fff'
    },
    secondary: {
      background: '#fff',
      color: '#6B7280',
      borderColor: '#E5E7EB'
    },
    ghost: {
      background: 'transparent',
      color: '#7B61FF'
    },
    danger: {
      background: '#fff',
      color: '#EF4444',
      borderColor: '#EF4444'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: variants[variant].color
  }), children);
}
function Input({
  icon,
  rightIcon,
  placeholder,
  value,
  onChange,
  type = 'text',
  style
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      border: `1px solid ${focus ? '#7B61FF' : '#E5E7EB'}`,
      borderRadius: 5,
      padding: '14px 15px',
      height: 48,
      background: '#fff',
      boxSizing: 'border-box',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: "#94A3B8"
  }), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 0,
      outline: 0,
      font: '14px Inter',
      color: '#0F1B2E',
      minWidth: 0
    }
  }), rightIcon && /*#__PURE__*/React.createElement(Icon, {
    name: rightIcon,
    size: 18,
    color: "#6B7280"
  }));
}
function Card({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.1)',
      padding: 20,
      ...style
    }
  }, children);
}
Object.assign(window, {
  COLORS,
  Icon,
  Logo,
  Brand,
  Avatar,
  Chip,
  Button,
  Input,
  Card
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/scribe-portal/kit-primitives.jsx", error: String((e && e.message) || e) }); }

})();
