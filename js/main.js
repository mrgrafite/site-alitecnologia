/* Ali Tecnologia — main.js */

// ── Header scroll shadow ─────────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile hamburger menu ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  nav.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu on link click
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── Scroll reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ── Active nav link on scroll ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Contact form — envia para enviar.php ─────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const res  = await fetch('enviar.php', { method: 'POST', body: new FormData(form) });
      const json = await res.json();

      if (json.success) {
        form.innerHTML = `
          <div class="form-success" style="display:block;">
            <p style="font-size:1.5rem;margin-bottom:8px;">&#10003;</p>
            <p><strong>Mensagem enviada com sucesso!</strong></p>
            <p style="margin-top:8px;font-size:.92rem;">Retornaremos em até 1 dia útil. Obrigado pelo contato!</p>
          </div>`;
      } else {
        btn.disabled = false;
        btn.textContent = 'Enviar mensagem';
        alert(json.message || 'Erro ao enviar. Tente novamente.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Enviar mensagem';
      alert('Erro de conexão. Verifique sua internet e tente novamente.');
    }
  });
}

// ── Add data-reveal to key elements ──────────────────────────
(function addRevealAttributes() {
  const targets = [
    { sel: '.sobre__text',    delay: '' },
    { sel: '.sobre__visual',  delay: '2' },
    { sel: '.servico-card',   delay: '' },
    { sel: '.diferencial',    delay: '' },
    { sel: '.contato__info',  delay: '' },
    { sel: '.contato__form',  delay: '2' },
  ];
  targets.forEach(({ sel, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      if (delay || i > 0) el.setAttribute('data-reveal-delay', delay || String(i));
    });
  });
  // Re-observe after adding attributes
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
})();
