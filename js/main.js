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
