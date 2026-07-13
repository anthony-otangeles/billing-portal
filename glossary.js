// Billing Portal — inline glossary (web component, Phase 10.4)
// <gloss-t term="835">the 835</gloss-t> renders its children with a dotted
// underline; hover/focus/tap shows a plain-language definition. Terms are
// defined here once so every screen explains the same jargon the same way.
(function () {
  if (customElements.get('gloss-t')) return;

  var TERMS = {
    '835': 'Electronic remittance advice (ERA) — the payer\u2019s itemized statement of what it paid, adjusted, or denied on each claim line.',
    'era': 'Electronic remittance advice — the payer\u2019s itemized statement of what it paid, adjusted, or denied on each claim line. Same thing as "the 835."',
    '837': 'The electronic claim file sent to the payer or clearinghouse. "Submitting a claim" means sending an 837.',
    'eft': 'Electronic funds transfer — the bank deposit. Every EFT should tie to its ERA to the cent, matched on the trace number.',
    'plb': 'Provider-level adjustment on an 835 — money added or recouped at the check level rather than on a claim line: takebacks (WO), interest (L6).',
    'carc': 'Claim adjustment reason code — the standard code on an 835 explaining why paid \u2260 billed (CO = contractual, PR = patient responsibility).',
    'co-45': 'Contractual adjustment — the charge exceeded the payer\u2019s fee schedule. The difference is written down per the contract; nobody owes it.',
    'co-253': 'Sequestration — the federal 2% reduction applied to Medicare payments.',
    'pr-1': 'Deductible — the payer allowed the amount but moved it to patient responsibility because the annual deductible isn\u2019t met.',
    'ma18': 'Remark code meaning the payer automatically forwarded (crossed over) the claim to the patient\u2019s supplemental payer — no second submission needed unless it stalls.',
    '271': 'Eligibility response from a payer: active coverage, plan details, deductible remaining. (The request we send is a 270.)',
    '270/271': 'The eligibility check: we send a 270 request, the payer answers with a 271 — active coverage, plan details, deductible remaining.',
    '277ca': 'Clearinghouse acknowledgment that a submitted claim passed front-end checks and was accepted for processing.',
    '276/277': 'The automated claim-status check: we send a 276 inquiry, the payer answers with a 277 status.',
    'cob': 'Coordination of benefits — the order in which a patient\u2019s payers are responsible: primary pays first, then secondary, then tertiary.',
    'crossover': 'Automatic forwarding of a processed Medicare claim to the supplemental (Medigap) payer, flagged by MA18 on the 835.',
    'timely filing': 'The payer\u2019s deadline for receiving a claim, counted from the date of service. Missed deadlines deny outright — usually not appealable without proof.',
    'allowed amount': 'The most the payer will recognize for a service under the contract. Payment + patient responsibility never exceed it.',
    'trace number': 'The shared reference (EFT or check number) printed on both the ERA and the bank deposit — how the two are matched.',
  };

  class GlossT extends HTMLElement {
    connectedCallback() {
      var key = (this.getAttribute('term') || this.textContent || '').trim().toLowerCase();
      var def = TERMS[key];
      this.style.cssText = 'border-bottom:1px dotted #94A3B8;cursor:help;position:relative;';
      if (!def) return;
      this.setAttribute('tabindex', '0');
      var self = this;
      var tip = null;
      function show() {
        if (tip) return;
        tip = document.createElement('div');
        tip.textContent = def;
        tip.style.cssText = 'position:fixed;max-width:320px;background:#0F1B2E;color:#FFFFFF;font-size:12px;line-height:17px;font-weight:400;font-family:Inter,-apple-system,sans-serif;padding:10px 13px;border-radius:8px;box-shadow:0 8px 24px rgba(15,27,46,0.3);z-index:9999;pointer-events:none;text-transform:none;letter-spacing:0;';
        document.body.appendChild(tip);
        var r = self.getBoundingClientRect();
        var top = r.top - tip.offsetHeight - 8;
        var left = Math.max(8, Math.min(r.left + r.width / 2 - tip.offsetWidth / 2, window.innerWidth - tip.offsetWidth - 8));
        if (top < 8) top = r.bottom + 8;
        tip.style.top = top + 'px';
        tip.style.left = left + 'px';
      }
      function hide() { if (tip) { tip.remove(); tip = null; } }
      this.addEventListener('mouseenter', show);
      this.addEventListener('mouseleave', hide);
      this.addEventListener('focus', show);
      this.addEventListener('blur', hide);
      this.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (tip) hide(); else show(); });
      this._cleanup = hide;
    }
    disconnectedCallback() { if (this._cleanup) this._cleanup(); }
  }
  customElements.define('gloss-t', GlossT);
})();
