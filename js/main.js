// Steve Schmitt for Ward 1 — small enhancements only. Site works without JS.

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.matches('a')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Contact form: submit to Formspree via fetch. If the form ID hasn't been
// configured yet (action still contains YOUR_FORM_ID), fall back to opening
// the visitor's email app with the message pre-filled.
const form = document.querySelector('.contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const configured = !form.action.includes('YOUR_FORM_ID');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    if (!configured) {
      const to = form.dataset.fallbackEmail;
      const subject = encodeURIComponent('[steveschmitt.ca] ' + (data.get('topic') || 'Message'));
      const body = encodeURIComponent(
        'Name: ' + data.get('name') + '\n' +
        'Email: ' + data.get('email') + '\n\n' +
        data.get('message')
      );
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
      status.textContent = 'Opening your email app… If nothing happens, please email ' + to + ' directly.';
      status.className = 'form-status ok';
      return;
    }

    status.textContent = 'Sending…';
    status.className = 'form-status';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.reset();
        status.textContent = 'Thanks! Your message is on its way to Steve.';
        status.className = 'form-status ok';
      } else {
        throw new Error('Bad response');
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please email ' + form.dataset.fallbackEmail + ' directly.';
      status.className = 'form-status err';
    }
  });
}
