(() => {
  const details = {
    portraiture: { title: 'Portraiture', number: '01', label: 'People', description: 'Presence, character and the stories held in a face.' },
    architecture: { title: 'Architecture', number: '02', label: 'Places', description: 'Form, rhythm and the spaces we move through.' },
    wildlife: { title: 'Wildlife', number: '03', label: 'Nature', description: 'A patient study of the wild and its inhabitants.' }
  };
  const gallery = document.querySelector('#gallery');
  const tabs = [...document.querySelectorAll('.category-tab')];
  const title = document.querySelector('#work-title');
  const kicker = document.querySelector('#category-kicker');
  const description = document.querySelector('#category-description');
  const count = document.querySelector('#work-count');
  const lightbox = document.querySelector('#lightbox');
  const viewerImage = document.querySelector('.lightbox-image');
  const viewerCaption = document.querySelector('.lightbox-caption');
  const viewerCount = document.querySelector('.lightbox-count');
  let currentCategory = 'portraiture';
  let currentIndex = 0;
  let visibleArtworks = [];

  function showCategory(category) {
    currentCategory = category;
    const info = details[category];
    const artworks = window.PORTFOLIO_ARTWORKS[category] || [];
    visibleArtworks = artworks;
    document.body.dataset.category = category;
    title.innerHTML = `${info.title}<span class="period">.</span>`;
    kicker.textContent = `${info.number} / ${info.label}`;
    description.textContent = info.description;
    count.textContent = `${artworks.length} works`;
    tabs.forEach(tab => {
      const active = tab.dataset.category === category;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    gallery.replaceChildren(...artworks.map((artwork, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-card';
      button.style.setProperty('--i', index % 12);
      button.setAttribute('aria-label', `View ${info.title.toLowerCase()} work ${index + 1}`);
      const img = document.createElement('img');
      img.src = artwork.src;
      img.alt = `${info.title} work ${String(index + 1).padStart(2, '0')}`;
      img.loading = index < 6 ? 'eager' : 'lazy';
      img.decoding = 'async';
      const classifyImage = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        button.classList.toggle('is-wide', ratio > 1.75);
        button.classList.toggle('is-landscape', ratio > 1.18 && ratio <= 1.75);
        button.classList.toggle('is-portrait', ratio < 0.82);
        button.classList.toggle('is-square', ratio >= 0.82 && ratio <= 1.18);
      };
      img.addEventListener('load', classifyImage, { once: true });
      if (img.complete && img.naturalWidth) classifyImage();
      button.append(img);
      button.addEventListener('click', () => openViewer(index));
      return button;
    }));
  }

  function openViewer(index) {
    currentIndex = index;
    updateViewer();
    lightbox.showModal();
    document.querySelector('.lightbox-close').focus();
  }

  function updateViewer() {
    const artwork = visibleArtworks[currentIndex];
    viewerImage.src = artwork.src;
    viewerImage.alt = `${details[currentCategory].title} work ${currentIndex + 1}`;
    viewerCaption.textContent = `${details[currentCategory].title} · ${String(currentIndex + 1).padStart(2, '0')}`;
    viewerCount.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(visibleArtworks.length).padStart(2, '0')}`;
  }

  function moveViewer(amount) {
    currentIndex = (currentIndex + amount + visibleArtworks.length) % visibleArtworks.length;
    updateViewer();
  }

  tabs.forEach(tab => tab.addEventListener('click', () => showCategory(tab.dataset.category)));
  document.querySelectorAll('[data-home-category]').forEach(link => {
    link.addEventListener('click', () => showCategory(link.dataset.homeCategory));
  });
  document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  document.querySelector('.lightbox-prev').addEventListener('click', () => moveViewer(-1));
  document.querySelector('.lightbox-next').addEventListener('click', () => moveViewer(1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') moveViewer(1);
    if (event.key === 'ArrowLeft') moveViewer(-1);
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
  showCategory('portraiture');
})();
