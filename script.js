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
  const waText = `Halo, saya ${nama} (${email}).\n\n${pesan}`;
  window.open(`https://wa.me/6282343560094?text=${encodeURIComponent(waText)}`, '_blank');

  alert('Pesan Anda telah dikirim! Anda akan diarahkan ke WhatsApp.');
  form.reset();
});

// ===== CMS: LOAD ALL DATA FROM LOCALSTORAGE =====
(function loadCMS() {
  try {
    const d = JSON.parse(localStorage.getItem('cinnongtabi_cms'));
    if (!d) return;

    // Helper for safe text update
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el && text !== undefined) el.textContent = text;
    };
    // Helper for safe src update
    const setSrc = (id, src) => {
      const el = document.getElementById(id);
      if (el && src) el.src = src;
    };

    // Branding & Logo
    if (d.logoUrl) {
      setSrc('navLogo', d.logoUrl);
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) favicon.href = d.logoUrl;
    }
    if (d.namaDesa) {
      setText('navBrandName', d.namaDesa);
      setText('footerDesaName', d.namaDesa);
    }

    // Hero
    setText('heroBadge', d.heroBadge);
    setText('heroTitle', d.heroTitle);
    setText('heroSubtitle', d.heroSubtitle);

    // Ringkasan Cards
    setText('ringkasanTitle', d.ringkasanTitle);
    setText('ringkasanDesc', d.ringkasanDesc);
    setText('card1Title', d.card1Title);
    setText('card1Desc', d.card1Desc);
    setSrc('card1Img', d.card1Img);
    setText('card2Title', d.card2Title);
    setText('card2Desc', d.card2Desc);
    setSrc('card2Img', d.card2Img);
    setText('card3Title', d.card3Title);
    setText('card3Desc', d.card3Desc);
    setSrc('card3Img', d.card3Img);

    // Sejarah
    setText('sejarahDesc', d.sejarahContent);

    // Sejarah Pemerintahan / Timeline
    if (d.pemerintahanList && d.pemerintahanList.length) {
      const timelineEl = document.getElementById('timelineList');
      if (timelineEl) {
        timelineEl.innerHTML = d.pemerintahanList.map(item => `
          <div class="timeline__item">
            <h4>${item.nama}</h4>
            <p>${item.periode}</p>
          </div>
        `).join('');
      }
    }

    // Visi & Misi
    setText('visiDesc', d.visiContent);
    if (d.misiContent) {
      const misiEl = document.getElementById('misiList');
      if (misiEl) {
        const items = d.misiContent.split('\n').filter(s => s.trim());
        misiEl.innerHTML = items.map(m => `<li>${m}</li>`).join('');
      }
    }

    // Struktur Organisasi
    if (d.strukturImg) {
      const orgContainer = document.getElementById('strukturContainer');
      if (orgContainer) {
        orgContainer.innerHTML = `<img src="${d.strukturImg}" alt="Struktur Organisasi Desa" style="max-width:100%;border-radius:12px;box-shadow:var(--shadow-md)">`;
      }
    }

    // Geografi
    setText('statLuas', d.geoLuas);
    setText('statSawah', d.geoSawah);
    setText('statKering', d.geoKering);
    setText('geoUtara', d.geoUtara);
    setText('geoSelatan', d.geoSelatan);
    setText('geoTimur', d.geoTimur);
    setText('geoBarat', d.geoBarat);

    // Data Kependudukan
    setText('statTotalPenduduk', d.pendudukTotal);
    setText('statLaki', d.pendudukLaki);
    setText('statPerempuan', d.pendudukPerempuan);

    // Dusun Table
    if (d.dusunList && d.dusunList.length) {
      const dusunBody = document.getElementById('tableDusunBody');
      if (dusunBody) {
        dusunBody.innerHTML = d.dusunList.map(row => `
          <tr><td>${row.nama}</td><td>${row.laki}</td><td>${row.perempuan}</td><td>${row.total}</td></tr>
        `).join('');
      }
    }

    // Pendidikan Table
    if (d.pendidikanList) {
      const body = document.getElementById('tablePendidikanBody');
      if (body) {
        const rows = d.pendidikanList.split('\n').filter(s => s.trim());
        body.innerHTML = rows.map((r, i) => {
          const parts = r.split(':');
          return `<tr><td>${i+1}</td><td>${parts[0]?.trim() || ''}</td><td>${parts[1]?.trim() || '-'}</td></tr>`;
        }).join('');
      }
    }

    // Mata Pencaharian Table
    if (d.pencaharianList) {
      const body = document.getElementById('tablePencaharianBody');
      if (body) {
        const rows = d.pencaharianList.split('\n').filter(s => s.trim());
        body.innerHTML = rows.map(r => {
          const parts = r.split(':');
          return `<tr><td>${parts[0]?.trim() || ''}</td><td>${parts[1]?.trim() || '-'}</td></tr>`;
        }).join('');
      }
    }

    // Kepemilikan Hewan Ternak Table
    if (d.ternakList) {
      const body = document.getElementById('tableTernakBody');
      if (body) {
        const rows = d.ternakList.split('\n').filter(s => s.trim());
        body.innerHTML = rows.map(r => {
          const parts = r.split(':');
          return `<tr><td>${parts[0]?.trim() || ''}</td><td>${parts[1]?.trim() || '-'}</td></tr>`;
        }).join('');
      }
    }

    // Prasarana Badges
    if (d.prasaranaList) {
      const list = document.getElementById('prasaranaBadgeList');
      if (list) {
        const badges = d.prasaranaList.split('\n').filter(s => s.trim());
        list.innerHTML = badges.map(b => `<span class="badge">${b}</span>`).join('');
      }
    }

    // Potensi Desa
    setText('potensiHeaderTitle', d.potensiTitle);
    setText('potensiHeaderDesc', d.potensiSub);
    setText('potensiTaniTitle', d.potensiTaniTitle);
    setText('potensiTaniDesc', d.potensiTani);
    setSrc('potensiTaniImg', d.potensiTaniImg);
    setText('potensiTernakTitle', d.potensiTernakTitle);
    setText('potensiTernakDesc', d.potensiTernak);
    setSrc('potensiTernakImg', d.potensiTernakImg);

    // Kontak & Footer
    setText('kontakAlamat', d.kontakAlamat);
    if (d.kontakWA) {
      const waFormatted = d.kontakWA.replace(/^62/, '0').replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
      const waUrl = `https://wa.me/${d.kontakWA}`;
      
      const waLink = document.getElementById('kontakWA');
      if (waLink) { waLink.href = waUrl; waLink.textContent = waFormatted; }
      
      const footerWA = document.getElementById('footerWA');
      if (footerWA) footerWA.href = waUrl;

      const waFloat = document.querySelector('.wa-float');
      if (waFloat) waFloat.href = waUrl;
    }
    if (d.kontakEmail) {
      const emailLink = document.getElementById('kontakEmail');
      if (emailLink) { emailLink.href = `mailto:${d.kontakEmail}`; emailLink.textContent = d.kontakEmail; }
      const footerEmail = document.getElementById('footerEmail');
      if (footerEmail) footerEmail.href = `mailto:${d.kontakEmail}`;
    }
    if (d.kontakKode) {
      setText('kontakKode', d.kontakKode);
      const footerKode = document.getElementById('footerKode');
      if (footerKode) footerKode.textContent = `Kode Wilayah: ${d.kontakKode}`;
    }

    // Gallery
    if (d.gallery && d.gallery.length) {
      const grid = document.getElementById('galleryGrid');
      if (grid) {
        grid.innerHTML = d.gallery.map(item =>
          `<div class="gallery-item"><img src="${item.src}" alt="${item.alt || 'Foto Galeri'}"></div>`
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
  } catch (e) { /* silent fail — fallback to index.html static markup */ }
})();
