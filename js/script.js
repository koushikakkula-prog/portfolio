/**
 * Akula Koushik - Portfolio Interactive Scripts
 * Pure vanilla JavaScript with high-performance event handling & animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const scrollProgress = document.getElementById('scrollProgress');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const contactForm = document.getElementById('contactForm');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-scale');

  let toastTimeout;

  /**
   * 1. Scroll Progress Bar & Sticky Header
   */
  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progressPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    // Update progress bar
    if (scrollProgress) {
      scrollProgress.style.width = `${progressPercent}%`;
    }

    // Update navbar background
    if (navbar) {
      if (scrollTop > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /**
   * 2. Mobile Drawer Navigation
   */
  const toggleMenu = () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    mobileNav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', toggleMenu);

    // Close on mobile link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /**
   * 3. Active Nav Link Highlighting (Intersection Observer)
   */
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /**
   * 4. Scroll Reveal Animations (Intersection Observer)
   */
  const revealObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  /**
   * 5. Toast Notification Helper
   */
  const showToast = (message, duration = 3000) => {
    if (!toast) return;
    
    if (toastMessage) {
      toastMessage.textContent = message;
    }
    
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  /**
   * 6. Copy Email to Clipboard
   */
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'koushikakkula@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast('Email copied to clipboard!');
      } catch (err) {
        showToast('koushikakkula@gmail.com');
      }
    });
  }

  /**
   * 7. Interactive Contact Form Handler
   */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('senderName')?.value.trim();
      const email = document.getElementById('senderEmail')?.value.trim();
      const subject = document.getElementById('messageSubject')?.value.trim();
      const message = document.getElementById('messageText')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Compose mailto link
      const mailtoUrl = `mailto:koushikakkula@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(`Hi Koushik,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      
      // Open user's default email client
      window.location.href = mailtoUrl;

      // Friendly UI feedback
      showToast('Opening email client to send message...');
      contactForm.reset();
    });
  }
});
