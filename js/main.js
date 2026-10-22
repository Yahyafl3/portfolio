/** Yahya Falhaoui portfolio — accessible navigation and focused interactions. */
(function () {
  'use strict';

  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/deac9ed230c6153606b323aeecce0d69';
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  function storageGet(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* Storage may be unavailable in private contexts. */ }
  }

  function initNavigation() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navLinks');
    if (!toggle || !menu) return;

    const closeMenu = (returnFocus = false) => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (open) menu.querySelector('a')?.focus();
    });

    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu(true);
    });
    document.addEventListener('click', (event) => {
      if (menu.classList.contains('open') && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    window.matchMedia('(min-width: 1161px)').addEventListener?.('change', (event) => {
      if (event.matches) closeMenu();
    });

    if ('IntersectionObserver' in window) {
      const links = Array.from(menu.querySelectorAll('.nav__link[data-section]'));
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            const active = link.dataset.section === entry.target.id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-24% 0px -66% 0px', threshold: 0 });
      document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    }
  }

  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    let queued = false;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
      queued = false;
    };
    const queueUpdate = () => {
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate, { passive: true });
    update();
  }

  function initReveals() {
    const elements = document.querySelectorAll('.reveal');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    elements.forEach((element) => observer.observe(element));
  }

  function initTheme() {
    const button = document.getElementById('themeToggle');
    const meta = document.getElementById('themeColorMeta');

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      storageSet('theme', theme);
      if (meta) meta.content = theme === 'light' ? '#f0f0e8' : '#111714';
      if (button && window.i18nManager) {
        button.setAttribute('aria-label', window.i18nManager.t(theme === 'light' ? 'theme.dark' : 'theme.light'));
      }
    }

    setTheme(storageGet('theme', 'dark'));
    button?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
    window.addEventListener('langchange', () => setTheme(document.documentElement.getAttribute('data-theme') || 'dark'));
  }

  function initStickyActions() {
    const sticky = document.getElementById('stickyCta');
    const hero = document.getElementById('hero');
    if (!sticky || !hero) return;
    let queued = false;
    let lastScrollY = window.scrollY;
    let scrollingUp = false;

    const update = () => {
      const pastHero = window.scrollY > hero.offsetTop + hero.offsetHeight - 110;
      const finalSection = ['certifications', 'contact'].some((id) => {
        const section = document.getElementById(id);
        if (!section) return false;
        const bounds = section.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
      });
      const show = pastHero && scrollingUp && !finalSection;
      sticky.classList.toggle('visible', show);
      queued = false;
    };
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      scrollingUp = currentScrollY < lastScrollY - 1;
      lastScrollY = currentScrollY;
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  function initCertificationFilters() {
    const filters = document.querySelectorAll('.certs-filter');
    const cards = document.querySelectorAll('.cert-card');
    if (!filters.length || !cards.length) return;

    filters.forEach((button) => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      cards.forEach((card) => { card.hidden = filter !== 'all' && card.dataset.cat !== filter; });
    }));
  }

  function setFormStatus(element, key, state) {
    if (!element) return;
    element.dataset.i18nStatus = key;
    element.textContent = window.i18nManager?.t(key) || key;
    element.className = `form-status ${state}`;
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');
    const submit = document.getElementById('contactSubmit');

    const params = new URLSearchParams(window.location.search);
    if (params.get('sent') === '1') {
      setFormStatus(status, 'contact.success', 'success');
      params.delete('sent');
      const query = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}#contact`);
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      if (String(data.get('_gotcha') || '').trim()) return;

      const name = String(data.get('fullName') || '').trim();
      const email = String(data.get('email') || '').trim();
      const subject = String(data.get('subject') || '').trim();
      const message = String(data.get('message') || '').trim();
      if (!name || !email || !subject || !message) {
        setFormStatus(status, 'contact.errorEmpty', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormStatus(status, 'contact.errorEmail', 'error');
        return;
      }

      const subjectValue = `[Portfolio] ${subject}`;
      data.set('_subject', subjectValue);
      data.set('_replyto', email);
      const subjectField = document.getElementById('formSubmitSubject');
      const replyField = document.getElementById('formSubmitReplyTo');
      if (subjectField) subjectField.value = subjectValue;
      if (replyField) replyField.value = email;
      setFormStatus(status, 'contact.sending', 'loading');
      if (submit) submit.disabled = true;

      try {
        const response = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
        const result = await response.json().catch(() => ({}));
        if (String(result.success) === 'true') {
          setFormStatus(status, 'contact.success', 'success');
          form.reset();
        } else {
          setFormStatus(status, 'contact.fallbackSend', 'loading');
          HTMLFormElement.prototype.submit.call(form);
        }
      } catch (_) {
        setFormStatus(status, 'contact.fallbackSend', 'loading');
        HTMLFormElement.prototype.submit.call(form);
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.i18nManager?.init();
    initNavigation();
    initScrollProgress();
    initReveals();
    initTheme();
    initStickyActions();
    initCertificationFilters();
    initContactForm();

    const year = document.getElementById('currentYear');
    if (year) year.textContent = String(new Date().getFullYear());

    window.addEventListener('langchange', () => {
      const status = document.getElementById('formStatus');
      if (status?.dataset.i18nStatus) status.textContent = window.i18nManager.t(status.dataset.i18nStatus);
    });
  });
})();
