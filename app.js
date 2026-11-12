/* Add verified business contact details here when they are available. */
const SITE_CONTACT = { email: '', phone: '201-210-4027' };

(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // The navigation stays usable with a keyboard and closes after a selection.
  const mobileToggle = $('#mobile-toggle');
  const mobileMenu = $('#mobile-menu');
  function closeMenu() {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Open navigation');
  }
  mobileToggle?.addEventListener('click', () => {
    const willOpen = mobileMenu.hidden;
    mobileMenu.hidden = !willOpen;
    mobileToggle.setAttribute('aria-expanded', String(willOpen));
    mobileToggle.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
  });
  $$('#mobile-menu a, #mobile-menu [data-open-brief]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu && !mobileMenu.hidden) {
      closeMenu();
      mobileToggle.focus();
    }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  // Filtering is progressive enhancement; every service is present in the HTML.
  const filterButtons = $$('[data-filter]');
  const serviceCards = $$('[data-category]');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let visibleCount = 0;
      serviceCards.forEach(card => {
        const show = category === 'all' || card.dataset.category === category;
        card.hidden = !show;
        if (show) visibleCount += 1;
      });
      const status = $('#filter-status');
      if (status) status.textContent = `${visibleCount} services shown`;
    });
  });

  const dialog = $('#brief-dialog');
  const form = $('#brief-form');
  if (!dialog || !form) return;

  const panels = $$('[data-step]', form);
  const backButton = $('#brief-back');
  const nextButton = $('#brief-next');
  const status = $('#brief-status');
  const summary = $('#brief-summary');
  const shareButton = $('#share-brief');
  const emailButton = $('#email-brief');
  let currentStep = 1;
  let opener = null;

  // Native validation is run only on the active step, avoiding hidden-field errors.
  form.noValidate = true;
  [backButton, nextButton, ...$$('[data-close-dialog]'), $('#copy-brief'),
    $('#download-brief'), shareButton, emailButton].filter(Boolean).forEach(button => {
    if (button.tagName === 'BUTTON') button.type = 'button';
  });
  if (shareButton) shareButton.hidden = typeof navigator.share !== 'function';
  const contactEmail = SITE_CONTACT.email.trim();
  if (emailButton) emailButton.hidden = !contactEmail;

  function announce(message = '') {
    if (status) status.textContent = message;
  }

  function fieldValue(id) {
    return $(`#${id}`)?.value.trim() || '';
  }

  function buildBrief() {
    const service = $('input[name="service"]:checked', form)?.value || 'To be discussed';
    const lines = [
      '2TONE IMAGERY — PROJECT BRIEF',
      `Contact: ${SITE_CONTACT.phone}`,
      '',
      `Service: ${service}`,
      `Name / business: ${fieldValue('project-name') || 'Not provided'}`,
      `Email: ${fieldValue('project-email') || 'Not provided'}`,
      `Quantity: ${fieldValue('project-quantity') || 'To be discussed'}`,
      `Requested date: ${fieldValue('project-date') || 'Flexible / to be discussed'}`,
      '',
      'PROJECT DETAILS',
      fieldValue('project-details'),
      '',
      'Please confirm artwork requirements, materials, pricing, and availability with 2Tone Imagery.',
      'This is a project brief, not a confirmed order or quote.'
    ];
    return lines.join('\n');
  }

  function focusStep() {
    const activePanel = panels.find(panel => Number(panel.dataset.step) === currentStep);
    if (!activePanel) return;
    const target = currentStep === 3 ? summary : activePanel.querySelector('h2, h3, legend, input, textarea, button');
    if (!target) return;
    if (!target.matches('input, textarea, button, select, a')) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }

  function renderStep(step, moveFocus = true) {
    currentStep = step;
    dialog.scrollTop = 0;
    panels.forEach(panel => {
      panel.hidden = Number(panel.dataset.step) !== step;
    });
    $$('[data-step-count]').forEach(counter => {
      counter.textContent = `0${step} / 03`;
      counter.setAttribute('aria-label', `Step ${step} of 3`);
    });
    if (backButton) backButton.hidden = step === 1;
    if (nextButton) {
      nextButton.hidden = step === 3;
      nextButton.textContent = step === 2 ? 'Build my brief' : 'Continue';
    }
    if (step === 3 && summary) summary.textContent = buildBrief();
    announce();
    if (moveFocus) focusStep();
  }

  function validateStep() {
    if (currentStep === 1) {
      const radios = $$('input[name="service"]', form);
      if (!radios.some(radio => radio.checked)) {
        announce('Choose a service to continue.');
        radios[0]?.focus();
        return false;
      }
    }
    if (currentStep === 2) {
      const details = $('#project-details');
      if (details) {
        details.setCustomValidity(details.value.trim().length < 10
          ? 'Add a little more detail about your project (at least 10 characters).'
          : '');
      }
      const panel = panels.find(item => item.dataset.step === '2');
      const invalidField = $$('input, textarea, select', panel || form)
        .find(field => !field.checkValidity());
      if (invalidField) {
        invalidField.reportValidity();
        invalidField.focus();
        return false;
      }
    }
    return true;
  }

  function advance() {
    if (currentStep < 3 && validateStep()) renderStep(currentStep + 1);
  }

  $$('[data-open-brief]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      opener = button;
      const selectedService = button.dataset.service;
      if (selectedService) {
        $$('input[name="service"]', form).forEach(radio => {
          radio.checked = radio.value === selectedService;
        });
      }
      closeMenu();
      renderStep(1, false);
      if (!dialog.open) dialog.showModal();
      document.documentElement.classList.add('dialog-open');
      focusStep();
    });
  });

  $$('[data-close-dialog]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('dialog-open');
    if (opener?.isConnected && opener.getClientRects().length) opener.focus({ preventScroll: true });
  });
  backButton?.addEventListener('click', () => renderStep(Math.max(1, currentStep - 1)));
  nextButton?.addEventListener('click', advance);
  form.addEventListener('submit', event => {
    event.preventDefault();
    advance();
  });
  $('#project-details')?.addEventListener('input', event => event.target.setCustomValidity(''));

  $('#copy-brief')?.addEventListener('click', async () => {
    const text = buildBrief();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      announce('Brief copied. Paste it into your message to 2Tone Imagery.');
    } catch {
      if (summary) {
        summary.tabIndex = 0;
        summary.focus();
        const range = document.createRange();
        range.selectNodeContents(summary);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      announce('The brief is selected. Use your device’s Copy command, or download it below.');
    }
  });

  $('#download-brief')?.addEventListener('click', () => {
    const blob = new Blob([buildBrief()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const download = document.createElement('a');
    download.href = url;
    download.download = '2tone-imagery-project-brief.txt';
    document.body.append(download);
    download.click();
    download.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('Download started. Share the saved brief with 2Tone Imagery to discuss your project.');
  });

  shareButton?.addEventListener('click', async () => {
    try {
      await navigator.share({ title: 'My 2Tone Imagery project', text: buildBrief() });
      announce('Check your chosen app to finish sharing your brief.');
    } catch (error) {
      if (error.name !== 'AbortError') {
        announce('Sharing is unavailable. You can copy or download your brief instead.');
      }
    }
  });

  emailButton?.addEventListener('click', event => {
    event.preventDefault();
    if (!contactEmail) return;
    window.location.href = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent('New project brief — 2Tone Imagery')}&body=${encodeURIComponent(buildBrief())}`;
    announce('Your email app will open with the brief. Review it and send when you are ready.');
  });

  renderStep(1, false);
})();
