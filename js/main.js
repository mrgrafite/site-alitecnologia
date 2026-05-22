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

// ── DDI Picker ───────────────────────────────────────────────
const ddiPicker = document.getElementById('ddiPicker');
if (ddiPicker) {
  const ddiBtn     = ddiPicker.querySelector('.ddi-picker__btn');
  const ddiList    = ddiPicker.querySelector('.ddi-picker__list');
  const ddiHidden  = ddiPicker.querySelector('input[type="hidden"]');
  const ddiFlag    = ddiBtn.querySelector('.ddi-picker__flag');
  const ddiCode    = ddiBtn.querySelector('.ddi-picker__code');
  const ddiChevron = ddiBtn.querySelector('.ddi-picker__chevron');
  let ddiOpen = false;

  // Move a lista para body para escapar do transform/overflow do modal
  document.body.appendChild(ddiList);

  function openDdi() {
    const r = ddiBtn.getBoundingClientRect();
    ddiList.style.top    = (r.bottom + 4) + 'px';
    ddiList.style.left   = r.left + 'px';
    ddiList.style.display = 'block';
    ddiChevron.classList.add('rotated');
    ddiOpen = true;
  }
  function closeDdi() {
    ddiList.style.display = 'none';
    ddiChevron.classList.remove('rotated');
    ddiOpen = false;
  }

  ddiBtn.addEventListener('click', e => { e.stopPropagation(); ddiOpen ? closeDdi() : openDdi(); });

  ddiList.addEventListener('click', e => {
    const opt = e.target.closest('.ddi-picker__option');
    if (!opt) return;
    ddiList.querySelectorAll('.ddi-picker__option').forEach(o => o.classList.remove('is-selected'));
    opt.classList.add('is-selected');
    const cc   = opt.dataset.cc;
    const code = opt.dataset.code;
    const name = opt.querySelector('.ddi-picker__name').textContent;
    ddiFlag.src = `https://flagcdn.com/20x15/${cc}.png`;
    ddiFlag.alt = name;
    ddiCode.textContent = code;
    ddiHidden.value = code;
    closeDdi();
  });

  document.addEventListener('click', () => { if (ddiOpen) closeDdi(); });
}

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
    const ddi      = modalForm.querySelector('[name="ddi"]').value;
    const telefone = modalForm.querySelector('[name="telefone"]').value;
    fd.append('telefone', ddi + ' ' + telefone);
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
