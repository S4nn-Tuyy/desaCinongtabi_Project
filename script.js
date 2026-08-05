// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
// close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navItems = navLinks.querySelectorAll('a');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// ===== TABS (ABOUT PAGE) =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.tabs').parentElement;
    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = group.querySelector(`#${btn.dataset.tab}`);
    target.classList.add('active', 'visible');
  });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('.lightbox__caption');
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) lightboxCaption.textContent = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});
// dokumentasi items reuse lightbox
document.querySelectorAll('.doc-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) lightboxCaption.textContent = item.querySelector('.doc-item__caption')?.textContent || img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});
lightbox?.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
function closeLightbox() {
  lightbox?.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== CONTACT FORM (UI ONLY) =====
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const nama = form.querySelector('#nama').value;
  const email = form.querySelector('#email').value;
  const pesan = form.querySelector('#pesan').value;

  // Submit to Netlify Forms (silent)
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(form)).toString()
  }).catch(() => {}); // silent fail — WA is the primary channel

  // Redirect to WhatsApp
  const waText = `Halo, saya *${nama}* (${email}).%0A%0A${pesan}`;
  window.open(`https://wa.me/62895324603443?text=${encodeURIComponent(waText)}`, '_blank');

  alert('Pesan Anda telah dikirim! Anda akan diarahkan ke WhatsApp.');
  form.reset();
});

// ===== CMS: LOAD DATA FROM LOCALSTORAGE =====
(function loadCMS() {
  try {
    const d = JSON.parse(localStorage.getItem('cinnongtabi_cms'));
    if (!d) return;

    // Hero
    const heroH1 = document.querySelector('.hero h1');
    const heroSub = document.querySelector('.hero__subtitle');
    if (d.heroTitle && heroH1) heroH1.textContent = d.heroTitle;
    if (d.heroSubtitle && heroSub) heroSub.textContent = d.heroSubtitle;

    // Sejarah
    const sejarahP = document.querySelector('#tab-sejarah .subsection p');
    if (d.sejarahContent && sejarahP) sejarahP.textContent = d.sejarahContent;

    // Visi
    const visiP = document.querySelector('.visi-box p');
    if (d.visiContent && visiP) visiP.textContent = d.visiContent;

    // Misi
    if (d.misiContent) {
      const misiList = document.querySelector('.misi-list');
      if (misiList) {
        const items = d.misiContent.split('\n').filter(s => s.trim());
        misiList.innerHTML = items.map(m => `<li>${m}</li>`).join('');
      }
    }

    // Potensi
    const potensiCards = document.querySelectorAll('.potensi-card__body p');
    if (d.potensiTani && potensiCards[0]) potensiCards[0].textContent = d.potensiTani;
    if (d.potensiTernak && potensiCards[1]) potensiCards[1].textContent = d.potensiTernak;

    // Kontak
    const kontakItems = document.querySelectorAll('.contact-item');
    if (d.kontakAlamat && kontakItems[0]) kontakItems[0].querySelector('p').textContent = d.kontakAlamat;
    if (d.kontakWA && kontakItems[1]) {
      const waLink = kontakItems[1].querySelector('a');
      waLink.href = `https://wa.me/${d.kontakWA}`;
      waLink.textContent = d.kontakWA.replace(/^62/, '0').replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
      // Update floating WA button too
      const waFloat = document.querySelector('.wa-float');
      if (waFloat) waFloat.href = `https://wa.me/${d.kontakWA}`;
    }
    if (d.kontakEmail && kontakItems[2]) {
      const emailLink = kontakItems[2].querySelector('a');
      emailLink.href = `mailto:${d.kontakEmail}`;
      emailLink.textContent = d.kontakEmail;
    }
    if (d.kontakKode && kontakItems[3]) kontakItems[3].querySelector('p').textContent = d.kontakKode;

    // Gallery
    if (d.gallery && d.gallery.length) {
      const grid = document.querySelector('.gallery-grid');
      if (grid) {
        grid.innerHTML = d.gallery.map(item =>
          `<div class="gallery-item"><img src="${item.src}" alt="${item.alt}"></div>`
        ).join('');
        // Re-bind lightbox
        grid.querySelectorAll('.gallery-item').forEach(item => {
          item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const lb = document.getElementById('lightbox');
            if (lb && img) {
              lb.querySelector('img').src = img.src;
              lb.querySelector('.lightbox__caption').textContent = img.alt;
              lb.classList.add('active');
              document.body.style.overflow = 'hidden';
            }
          });
        });
      }
    }
  } catch (e) { /* silent fail — show default content */ }
})();
