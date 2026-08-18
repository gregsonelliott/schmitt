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

// Contact form: posts to a Google Form (responses land in a Google Sheet).
// Google's endpoint does not allow reading the response cross-origin, so the
// request is sent no-cors and success is reported optimistically. If the form
// IDs have not been filled in yet, fall back to opening the visitor's email app
// so the form is never a dead end.
const form = document.querySelector('.contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const configured = !form.action.includes('GOOGLE_FORM_ID');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    // Spam trap: bots fill hidden fields, people do not.
    if (data.get('website')) { form.reset(); return; }
    data.delete('website');

    if (!configured) {
      const to = form.dataset.fallbackEmail;
      const val = (id) => (document.getElementById(id) || {}).value || '';
      const subject = encodeURIComponent('[steveschmitt.ca] ' + (val('cf-topic') || 'Message'));
      const body = encodeURIComponent(
        'Name: ' + val('cf-name') + '\n' +
        'Email: ' + val('cf-email') + '\n' +
        'Phone: ' + (val('cf-phone') || 'not given') + '\n\n' +
        val('cf-message')
      );
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
      status.textContent = 'Opening your email app. If nothing happens, please email ' + to + ' directly.';
      status.className = 'form-status ok';
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Sending...';
    status.className = 'form-status';
    try {
      await fetch(form.action, { method: 'POST', mode: 'no-cors', body: data });
      form.reset();
      status.textContent = 'Thanks! Your message is on its way to Steve.';
      status.className = 'form-status ok';
    } catch (err) {
      status.textContent = 'Something went wrong. Please email ' + form.dataset.fallbackEmail + ' directly.';
      status.className = 'form-status err';
    } finally {
      button.disabled = false;
    }
  });
}

// Gallery lightbox: click a photo to view it large, with arrow/Esc support.
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  const figures = [...document.querySelectorAll('.gallery figure')];
  let index = 0;
  let lastFocused = null;

  const usable = () => figures.filter(f => !f.classList.contains('img-missing'));

  function show(i) {
    const list = usable();
    if (!list.length) return;
    index = (i + list.length) % list.length;
    const fig = list[index];
    const img = fig.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = fig.querySelector('figcaption').textContent;
    const many = list.length > 1;
    lightbox.querySelector('.lb-prev').hidden = !many;
    lightbox.querySelector('.lb-next').hidden = !many;
  }

  function open(i) {
    lastFocused = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lb-close').focus();
  }

  function close() {
    lightbox.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  figures.forEach((fig) => {
    if (fig.classList.contains('img-missing')) return;
    fig.tabIndex = 0;
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', 'View photo: ' + fig.querySelector('figcaption').textContent);
    fig.addEventListener('click', () => open(usable().indexOf(fig)));
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(usable().indexOf(fig)); }
    });
  });

  lightbox.querySelector('.lb-close').addEventListener('click', close);
  lightbox.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  lightbox.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}
