/**
 * Yahya Falhaoui — Portfolio 2027
 * Preloader · Scroll progress · Tilt · Tabs · Spotlight
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  /* --- Preloader --- */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloaderFill');
    if (!preloader) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (fill) fill.style.width = '100%';
        setTimeout(() => {
          preloader.classList.add('done');
          document.body.classList.add('loaded');
        }, 300);
      } else if (fill) {
        fill.style.width = progress + '%';
      }
    }, 80);
  }

  /* --- Scroll Progress --- */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* --- Typewriter --- */
  const typewriterEl = document.getElementById('typewriter');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typewriterTimer = null;

  function getRoles() {
    return window.i18nManager ? window.i18nManager.getTypewriterRoles() : [];
  }

  function typeWriter() {
    if (!typewriterEl || prefersReducedMotion) {
      if (typewriterEl) {
        const roles = getRoles();
        typewriterEl.textContent = roles[0] || '';
      }
      return;
    }

    const roles = getRoles();
    if (!roles.length) return;

    const current = roles[roleIndex];
    let speed = isDeleting ? 28 : 55;

    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 500;
    }

    typewriterTimer = setTimeout(typeWriter, speed);
  }

  function resetTypewriter() {
    if (typewriterTimer) clearTimeout(typewriterTimer);
    roleIndex = 0;
    charIndex = 0;
    isDeleting = false;
    if (typewriterEl) typewriterEl.textContent = '';
    typeWriter();
  }

  /* --- Counters --- */
  function animateCounter(el, target, suffix, duration = 1800) {
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(target * eased) + (suffix || '');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + (suffix || '');
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    document.querySelectorAll('[data-count]').forEach((el) => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !el.dataset.counted) {
          el.dataset.counted = 'true';
          animateCounter(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '');
          observer.unobserve(el);
        }
      }, { threshold: 0.5 });
      observer.observe(el);
    });
  }

  /* --- Skills Tabs --- */
  function initSkillsTabs() {
    const btns = document.querySelectorAll('.skills-tabs__btn');
    const panels = document.querySelectorAll('.skills-panel');

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        btns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
          b.tabIndex = -1;
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.tabIndex = 0;

        panels.forEach((panel) => {
          const isActive = panel.id === 'tab-' + tab;
          panel.classList.toggle('active', isActive);
          panel.hidden = !isActive;
        });
      });

      btn.addEventListener('keydown', (event) => {
        const currentIndex = Array.from(btns).indexOf(btn);
        const rtl = document.documentElement.dir === 'rtl';
        let nextIndex;
        if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = btns.length - 1;
        else if (event.key === 'ArrowRight') nextIndex = (currentIndex + (rtl ? -1 : 1) + btns.length) % btns.length;
        else if (event.key === 'ArrowLeft') nextIndex = (currentIndex + (rtl ? 1 : -1) + btns.length) % btns.length;
        else return;

        event.preventDefault();
        btns[nextIndex].focus();
        btns[nextIndex].click();
      });
    });
  }

  /* --- Reveal --- */
  function initReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0, 10);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  function initHeroReveal() {
    document.querySelectorAll('#hero .reveal').forEach((el) => {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('visible'), 600 + delay);
    });
  }

  /* --- Navigation --- */
  function initNav() {
    const nav = document.getElementById('nav');
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    const linkEls = document.querySelectorAll('.nav__link[data-section]');
    const sections = document.querySelectorAll('section[id]');

    let lastScroll = 0;
    let ticking = false;

    function onScroll() {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 40);

      if (y > lastScroll && y > 350) nav.classList.add('hidden');
      else nav.classList.remove('hidden');
      lastScroll = y;

      let current = '';
      sections.forEach((s) => {
        if (y >= s.offsetTop - 120) current = s.id;
      });

      linkEls.forEach((link) => {
        link.classList.toggle('active', link.dataset.section === current);
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    navToggle?.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', open);
    });

    document.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks?.classList.remove('open');
        navToggle?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Hero Spotlight --- */
  function initSpotlight() {
    if (isMobile || prefersReducedMotion) return;

    const hero = document.getElementById('hero');
    const spotlight = document.getElementById('heroSpotlight');
    if (!hero || !spotlight) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      spotlight.style.left = (e.clientX - rect.left) + 'px';
      spotlight.style.top = (e.clientY - rect.top) + 'px';
      spotlight.classList.add('active');
    });

    hero.addEventListener('mouseleave', () => spotlight.classList.remove('active'));
  }

  /* --- Tilt Cards --- */
  function initTilt() {
    if (isMobile || prefersReducedMotion) return;

    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* --- Cursor --- */
  function initCursor() {
    if (isMobile || prefersReducedMotion) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor');

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .magnetic, .magnetic-sm, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  /* --- Magnetic --- */
  function initMagnetic() {
    if (isMobile) return;

    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.12}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    document.querySelectorAll('.magnetic-sm').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.08}px, ${(e.clientY - r.top - r.height / 2) * 0.08}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* --- Contact Form (FormSubmit) --- */
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/deac9ed230c6153606b323aeecce0d69';

  function showFormStatus(status, messageKey, type) {
    if (!status) return;
    status.dataset.i18nStatus = messageKey;
    status.textContent = window.i18nManager.t(messageKey);
    status.className = `form-status ${type}`;
  }

  function checkContactSent() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sent') !== '1') return;

    const status = document.getElementById('formStatus');
    showFormStatus(status, 'contact.success', 'success');

    params.delete('sent');
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}#contact`;
    window.history.replaceState(null, '', nextUrl);
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('contactSubmit');
    const subjectHidden = document.getElementById('formSubmitSubject');
    if (!form) return;

    checkContactSent();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(form);
      if (String(data.get('_gotcha') || '').trim()) return;

      const nameVal = String(data.get('fullName') || '').trim();
      const emailVal = String(data.get('email') || '').trim();
      const subjectVal = String(data.get('subject') || '').trim();
      const messageVal = String(data.get('message') || '').trim();

      if (!nameVal || !emailVal || !subjectVal || !messageVal) {
        showFormStatus(status, 'contact.errorEmpty', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showFormStatus(status, 'contact.errorEmail', 'error');
        return;
      }

      const mailSubject = `[Portfolio] ${subjectVal}`;
      if (subjectHidden) subjectHidden.value = mailSubject;
      const replyHidden = document.getElementById('formSubmitReplyTo');
      if (replyHidden) replyHidden.value = emailVal;
      data.set('_subject', mailSubject);
      data.set('_replyto', emailVal);

      showFormStatus(status, 'contact.sending', 'loading');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data
        });

        const result = await res.json().catch(() => ({}));

        if (String(result.success) === 'true') {
          showFormStatus(status, 'contact.success', 'success');
          form.reset();
          return;
        }

        showFormStatus(status, 'contact.fallbackSend', 'loading');
        HTMLFormElement.prototype.submit.call(form);
      } catch {
        showFormStatus(status, 'contact.fallbackSend', 'loading');
        HTMLFormElement.prototype.submit.call(form);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* --- Theme Toggle --- */
  function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const meta = document.getElementById('themeColorMeta');

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      if (meta) meta.content = theme === 'light' ? '#f5f5f8' : '#04040a';
      if (toggle) {
        const label = theme === 'light'
          ? window.i18nManager.t('theme.dark')
          : window.i18nManager.t('theme.light');
        toggle.setAttribute('aria-label', label);
      }
    }

    toggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });

    const initial = document.documentElement.getAttribute('data-theme') || 'dark';
    if (toggle && window.i18nManager) {
      toggle.setAttribute('aria-label', initial === 'light'
        ? window.i18nManager.t('theme.dark')
        : window.i18nManager.t('theme.light'));
    }

    window.addEventListener('langchange', () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      if (toggle) {
        toggle.setAttribute('aria-label', theme === 'light'
          ? window.i18nManager.t('theme.dark')
          : window.i18nManager.t('theme.light'));
      }
    });
  }

  /* --- Sticky Recruiter CTA --- */
  function initStickyCta() {
    const sticky = document.getElementById('stickyCta');
    const hero = document.getElementById('hero');
    if (!sticky || !hero) return;

    let ticking = false;

    function update() {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const show = window.scrollY > heroBottom - 120;
      sticky.classList.toggle('visible', show);
      document.body.classList.toggle('sticky-active', show);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* --- Certifications Filter --- */
  function initCertsFilter() {
    const filters = document.querySelectorAll('.certs-filter');
    const cards = document.querySelectorAll('.cert-card');
    if (!filters.length || !cards.length) return;

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;

        // Update active filter
        filters.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Animate cards in/out
        cards.forEach((card) => {
          const cardCat = card.dataset.cat;
          const show = cat === 'all' || cardCat === cat;

          if (show) {
            card.classList.remove('hidden');
            // Stagger fade-in
            requestAnimationFrame(() => {
              card.style.opacity = '0';
              card.style.transform = 'translateY(16px)';
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out)';
                card.style.opacity = '';
                card.style.transform = '';
              });
            });
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* --- Init --- */
  document.addEventListener('DOMContentLoaded', () => {
    window.i18nManager.init();
    window.addEventListener('langchange', () => {
      const status = document.getElementById('formStatus');
      if (status?.dataset.i18nStatus) {
        status.textContent = window.i18nManager.t(status.dataset.i18nStatus);
      }
    });
    initTheme();
    initPreloader();
    initScrollProgress();
    initHeroReveal();
    setTimeout(typeWriter, 1200);
    window.addEventListener('langchange', resetTypewriter);
    initCounters();
    initSkillsTabs();
    initReveal();
    initNav();
    initStickyCta();
    initSpotlight();
    initTilt();
    initCursor();
    initMagnetic();
    initContactForm();
    initCertsFilter();
  });
})();
