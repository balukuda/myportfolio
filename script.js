/**
 * ==========================================================
 * BALU PORTFOLIO - JAVASCRIPT INTERACTIONS
 * ==========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Typing Text Effect
  const typedTextSpan = document.getElementById('typed-text');
  const roles = [
    'Web Developer',
    'Frontend Designer',
    'Creative Thinker',
    'Problem Solver'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingDelay = 110;
  const erasingDelay = 60;
  const newTextDelay = 1600;

  function typeEffect() {
    if (!typedTextSpan) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, newTextDelay);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 400);
    } else {
      setTimeout(typeEffect, isDeleting ? erasingDelay : typingDelay);
    }
  }

  setTimeout(typeEffect, 500);

  // 3. Theme Toggle (Dark / Light) with LocalStorage
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('balu-theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }

  if (themeToggleBtn && themeIcon) {
    themeToggleBtn.addEventListener('click', () => {
      if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('balu-theme', 'light');
        showToast('Switched to Light Theme ☀️');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('balu-theme', 'dark');
        showToast('Switched to Dark Theme 🌙');
      }
    });
  }

  // 4. Mobile Hamburger Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navbar.classList.toggle('open');
    });

    // Close menu when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navbar.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !hamburger.contains(e.target) && navbar.classList.contains('open')) {
        hamburger.classList.remove('active');
        navbar.classList.remove('open');
      }
    });
  }

  // 5. Header Scroll Effect & Active Section Highlighting (ScrollSpy)
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header blur/compact on scroll
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // ScrollSpy active link detection
    let current = '';
    const atBottom = (window.innerHeight + window.pageYOffset) >= (document.documentElement.scrollHeight - 60);

    if (atBottom) {
      current = 'contact';
    } else {
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 130;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
    }

    if (current) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}` || href.endsWith(`#${current}`)) {
          link.classList.add('active');
        }
      });
    }
  });

  // 6. Contact Form Submission Handler
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Please fill out all fields before submitting.';
        }
        return;
      }

      // Button loading indicator
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing message...';

      setTimeout(() => {
        // Construct mailto link
        const mailtoLink = `mailto:balukuda4@gmail.com?subject=${encodeURIComponent(
          `[Portfolio Contact] ${subject} - from ${name}`
        )}&body=${encodeURIComponent(
          `Hi Balu,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        window.location.href = mailtoLink;

        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `✓ Thank you <strong>${name}</strong>! Your email draft has been generated.`;
        }

        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showToast('Message ready! Opening email client...');
      }, 700);
    });
  }
});

// 7. Toast Notification Utility
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// 8. Clipboard Copy Helper
function copyText(text, successMessage) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage || 'Copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage || 'Copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy. Please copy manually.');
  }
  document.body.removeChild(textArea);
}

// 9. Quick Copy All Contact Details
function copyContactInfo() {
  const info = `Name: Balu\nEmail: balukuda4@gmail.com\nPhone: +91 6300328575`;
  copyText(info, 'Balu\'s contact details copied to clipboard!');
}
