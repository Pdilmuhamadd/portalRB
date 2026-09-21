/**
 * Portal Reformasi Birokrasi - Centralized Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Megamenu Dropdown Navigasi
  initMegamenu();

  // 2. Hero Carousel Slider (Khusus Halaman Beranda)
  initHeroCarousel();

  // 3. Tab Switcher Navigation (Khusus Halaman Evaluasi)
  initTabSwitcher();

  // 4. Action Popup Menu Dropdown (Datatable / Tabel Dokumen)
  initActionDropdowns();

  // 5. Modal Popup Upload & Dropzone (Khusus Halaman Dokumen)
  initModals();

  // 6. Dynamic PIC Form Generator (Khusus Halaman LHKAN)
  initDynamicForm();
});

/**
 * 1. Megamenu Dropdown Navigasi
 */
function initMegamenu() {
  const dropdowns = document.querySelectorAll('.dropdown-container');
  if (!dropdowns.length) return;

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdowns.forEach((d) => {
          if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.megamenu-dropdown')) {
      dropdowns.forEach((d) => d.classList.remove('active'));
    }
  });
}

/**
 * 2. Hero Carousel Slider (Beranda)
 */
function initHeroCarousel() {
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.carousel-dots .dot');

  if (!track || !cards.length) return;

  let realIndex = 3;
  let isTransitioning = false;
  let autoSlideInterval;

  function getDimensions() {
    return { cardWidth: 800, gap: 24 };
  }

  function updateCarousel(index, animate = true) {
    realIndex = index;

    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

    cards.forEach((card, idx) => {
      card.classList.toggle('active-card', idx === realIndex);
    });

    let activeDotIndex = realIndex - 1;
    if (realIndex === 0) activeDotIndex = 4;
    if (realIndex === cards.length - 1) activeDotIndex = 0;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeDotIndex);
    });

    const { cardWidth, gap } = getDimensions();
    const centerOffset = (window.innerWidth / 2) - (cardWidth / 2);
    const activePosition = realIndex * (cardWidth + gap);
    const translateX = centerOffset - activePosition;

    track.style.transform = `translate3d(${translateX}px, 0px, 0px)`;
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (realIndex === cards.length - 1) updateCarousel(1, false);
    if (realIndex === 0) updateCarousel(cards.length - 2, false);
  });

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    updateCarousel(realIndex + 1, true);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      updateCarousel(idx + 1, true);
      resetAutoSlide();
    });
  });

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      updateCarousel(idx, true);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  window.addEventListener('resize', () => updateCarousel(realIndex, false));

  updateCarousel(realIndex, false);
  startAutoSlide();
}

/**
 * 3. Tab Switcher Navigation (Evaluasi)
 */
function initTabSwitcher() {
  const tabs = document.querySelectorAll('.eval-tab-item');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

/**
 * 4. Action Popup Menu Dropdown (Datatable / Table Action)
 */
function initActionDropdowns() {
  const actionWrappers = document.querySelectorAll('.action-dropdown-wrapper');
  if (!actionWrappers.length) return;

  actionWrappers.forEach((wrapper) => {
    const btn = wrapper.querySelector('.btn-action-more, .btn-action-dropdown');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        actionWrappers.forEach((w) => {
          if (w !== wrapper) w.classList.remove('active');
        });
        wrapper.classList.toggle('active');
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-dropdown-wrapper')) {
      actionWrappers.forEach((w) => w.classList.remove('active'));
    }
  });
}

/**
 * 5. Modal Popup Upload & File Dropzone (Halaman Dokumen)
 */
function initModals() {
  const modal = document.getElementById('uploadModal');
  const btnOpen = document.getElementById('btnOpenModal');
  const btnClose = document.getElementById('btnCloseModal');
  const btnCancel = document.getElementById('btnCancelModal');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');

  if (!modal) return; // Guard Clause jika halaman tidak memiliki modal upload

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Dropzone Input & Drag-and-Drop
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        showSelectedFileName(e.target.files[0].name);
      }
    });

    // Drag and Drop Effects
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-active');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-active');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        fileInput.files = files;
        showSelectedFileName(files[0].name);
      }
    });
  }

  function showSelectedFileName(name) {
    const mainText = dropzone.querySelector('.dropzone-text-main');
    if (mainText) mainText.textContent = `File terpilih: ${name}`;
  }
}

/**
 * 6. Dynamic PIC Form Generator (Halaman Form LHKAN)
 */
function initDynamicForm() {
  const btnAddPic = document.getElementById('btnAddPic');
  const picGrid = document.getElementById('picGrid');
  let picCount = 1;

  if (btnAddPic && picGrid) {
    btnAddPic.addEventListener('click', () => {
      picCount++;
      const picRow = document.createElement('div');
      picRow.className = 'pic-row';
      picRow.innerHTML = `
        <div class="form-group flex-1">
          <label class="form-label">Nama PIC ${picCount} <span class="text-required">*</span></label>
          <input type="text" class="custom-input" placeholder="Masukkan nama PIC" required />
        </div>
        <div class="form-group flex-1">
          <label class="form-label">Nomor HP PIC ${picCount} <span class="text-required">*</span></label>
          <input type="tel" class="custom-input" placeholder="Masukkan nomor HP aktif" required />
        </div>
      `;
      picGrid.appendChild(picRow);
    });
  }
}