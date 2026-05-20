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

// ── Modal Proposta ────────────────────────────────────────────
const modalOverlay = document.getElementById('modalProposta');
const modalClose   = document.getElementById('modalClose');

function openModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-trigger').forEach(btn => {
  btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Modal form submit
const modalForm = document.getElementById('modalForm');
if (modalForm) {
  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = modalForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const fd = new FormData();
    const nome      = modalForm.querySelector('[name="nome"]').value.trim();
    const sobrenome = modalForm.querySelector('[name="sobrenome"]').value.trim();
    fd.append('nome',     nome + ' ' + sobrenome);
    fd.append('email',    modalForm.querySelector('[name="email"]').value);
    fd.append('telefone', modalForm.querySelector('[name="telefone"]').value);
    fd.append('empresa',  modalForm.querySelector('[name="empresa"]').value || '');
    fd.append('mensagem', 'Solicitação de proposta via site.');

    try {
      const res  = await fetch('enviar.php', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        modalForm.innerHTML = `
          <div class="modal__success" style="display:block;">
            <p style="font-size:1.8rem;margin-bottom:8px;">&#10003;</p>
            <p><strong>Solicitação enviada com sucesso!</strong></p>
            <p style="margin-top:8px;font-size:.9rem;color:#2d6a4f;">Nossa equipe entrará em contato em breve. Obrigado!</p>
          </div>`;
      } else {
        btn.disabled = false;
        btn.textContent = 'Enviar';
        alert(json.message || 'Erro ao enviar. Tente novamente.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Enviar';
      alert('Erro de conexão. Verifique sua internet e tente novamente.');
    }
  });
}

// ── Add data-reveal to key elements ──────────────────────────
(function addRevealAttributes() {
  const targets = [
    { sel: '.sobre__text',   delay: '' },
    { sel: '.sobre__visual', delay: '2' },
    { sel: '.servico-card',  delay: '' },
    { sel: '.diferencial',   delay: '' },
    { sel: '.setor-card',    delay: '' },
  ];
  targets.forEach(({ sel, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      if (delay || i > 0) el.setAttribute('data-reveal-delay', delay || String(i));
    });
  });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
})();
