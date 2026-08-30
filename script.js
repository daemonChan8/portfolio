document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Active nav link by current page ---------- */
const navAnchors = document.querySelectorAll('.nav-links a');
const currentPage = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
navAnchors.forEach(a => {
  a.classList.toggle('active', a.dataset.nav === currentPage);
});

/* ---------- Scroll reveal ---------- */
const revealTargets = document.querySelectorAll(
  '.about-main, .about-side, .service-card, .project-card, .blog-card, .process-list, .contact-side'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

/* ---------- Testimonial carousel ---------- */
const track = document.getElementById('testimonialTrack');
const dotsWrap = document.getElementById('testimonialDots');
const slides = Array.from(track.children);
let current = 0;
let autoplayTimer;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i, true));
  dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.children);

function goToSlide(index, userTriggered) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  if (userTriggered) restartAutoplay();
}

function restartAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goToSlide(current + 1, false), 5500);
}
restartAutoplay();

/* ---------- Contact form validation (client-side demo) ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

function setError(fieldId, message) {
  const el = form.querySelector(`[data-error-for="${fieldId}"]`);
  if (el) el.textContent = message || '';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name) { setError('cf-name', 'Please enter your name.'); valid = false; }
  else setError('cf-name', '');

  if (!email) { setError('cf-email', 'Please enter your email.'); valid = false; }
  else if (!isValidEmail(email)) { setError('cf-email', 'That email doesn\'t look right.'); valid = false; }
  else setError('cf-email', '');

  if (!message) { setError('cf-message', 'Tell me a bit about the project.'); valid = false; }
  else setError('cf-message', '');

  if (!valid) {
    status.textContent = '';
    return;
  }

  // No backend wired up — this simulates a successful send.
  status.textContent = `Thanks, ${name.split(' ')[0]} — message received. I'll reply by email soon.`;
  form.reset();
});