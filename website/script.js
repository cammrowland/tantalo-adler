const SITE_PASSWORD = "mydemo";

(function passwordGate() {
  if (sessionStorage.getItem('fn-unlocked') === '1') return;

  document.documentElement.classList.add('gate-pending');

  function mount() {
    document.body.classList.add('gate-active');

    const overlay = document.createElement('div');
    overlay.className = 'gate-overlay';
    overlay.innerHTML = `
      <div class="gate-modal">
        <div class="gate-wordmark">Tantalo &amp; Adler LLP</div>
        <p class="gate-copy">Speculative redesign. Enter password to view.</p>
        <form class="gate-form" autocomplete="off">
          <input type="password" class="gate-input" placeholder="Password" aria-label="Password" required />
          <button type="submit" class="btn btn-primary">Enter</button>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    const form = overlay.querySelector('.gate-form');
    const input = overlay.querySelector('.gate-input');
    input.focus();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value === SITE_PASSWORD) {
        sessionStorage.setItem('fn-unlocked', '1');
        document.body.classList.remove('gate-active');
        overlay.remove();
      } else {
        input.classList.remove('shake');
        void input.offsetWidth;
        input.classList.add('shake');
        input.value = '';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 4);
    });
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
});
