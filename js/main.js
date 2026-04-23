/* ============================================================
   DKS Automotive — JavaScript (Mobile-First Optimised)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Sticky header ---------------------------------------- */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Hamburger menu --------------------------------------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');

  if (hamburger && mobileNav) {
    const openMenu = () => {
      mobileNav.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      // Verander hamburger-icoon naar X
      hamburger.querySelector('svg').innerHTML =
        '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
    };
    const closeMenu = () => {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // Herstel hamburger-icoon
      hamburger.querySelector('svg').innerHTML =
        '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
    };

    hamburger.addEventListener('click', () => {
      mobileNav.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Sluit menu bij klik op link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Sluit menu bij Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
    });

    // Sluit menu als viewport groter wordt (bijv. draaien tablet)
    const mq = window.matchMedia('(min-width: 768px)');
    mq.addEventListener('change', e => { if (e.matches) closeMenu(); });
  }

  /* --- Actief nav-item op basis van huidige pagina ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile .nav-link').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Fade-up animaties (Intersection Observer) ------------ */
  // Reduceer animaties op langzame verbindingen of als gebruiker dat prefereert
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fadeEls = document.querySelectorAll('.fade-up');

  if (!prefersReduced && 'IntersectionObserver' in window && fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      // Minder offset op mobiel zodat elementen eerder animeren
      rootMargin: '0px 0px -24px 0px',
    });
    fadeEls.forEach(el => io.observe(el));
  } else {
    // Direct tonen als animaties niet gewenst/ondersteund zijn
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* --- Gallery Lightbox (touch-vriendelijk) ----------------- */
  const lightbox  = document.querySelector('.lightbox');
  const lbImg     = document.querySelector('.lightbox-img');
  const lbCaption = document.querySelector('.lightbox-caption');
  const lbClose   = document.querySelector('.lightbox-close');

  if (lightbox && lbImg) {
    const openLightbox = (src, title, desc) => {
      lbImg.src = src;
      lbImg.alt = title || '';
      if (lbCaption) {
        lbCaption.textContent = [title, desc].filter(Boolean).join(' — ');
      }
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Focus op sluitknop voor toegankelijkheid
      if (lbClose) lbClose.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
    };

    document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
      item.addEventListener('click', () => {
        openLightbox(item.dataset.src, item.dataset.title, item.dataset.desc);
      });
      // Toetsenbord toegankelijkheid
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item.dataset.src, item.dataset.title, item.dataset.desc);
        }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    // Klik buiten foto sluit lightbox
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    // Swipe naar beneden sluit lightbox op mobiel
    let touchStartY = 0;
    lightbox.addEventListener('touchstart', e => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      if (e.changedTouches[0].clientY - touchStartY > 80) closeLightbox();
    }, { passive: true });
  }

  /* --- Smooth scroll voor anker-links ----------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // compenseer sticky header
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- Contactformulier ------------------------------------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      const btn = contactForm.querySelector('[type="submit"]');
      if (btn) {
        btn.textContent = 'Versturen…';
        btn.disabled = true;
      }
    });
  }

});
