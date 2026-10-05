/**
 * Portal Reformasi Birokrasi
 * JavaScript Khusus RB Tematik (Tema & Sasaran, Permasalahan, dan Rencana Aksi)
 */

document.addEventListener('DOMContentLoaded', () => {
  initRbtTemaSasaran();
  initRbtPermasalahan();
  initRbtRencanaAksi();
  initRbtRekapData();
  initRbtModalsGlobal();
});

let currentSasaranRowToEdit = null;

/**
 * 0. Modul Halaman Tema dan Sasaran Tematik (Figma Screenshot 2 & 3)
 */
function initRbtTemaSasaran() {
  const btnTambahRoadmap = document.getElementById('btnOpenTambahSasaranRoadmap');
  const modalSasaran = document.getElementById('modalSasaranTematikRoadmap');
  const formSasaran = document.getElementById('formSasaranTematikRoadmap');
  const temaSelect = document.getElementById('modalTemaSelect');
  const sasaranInput = document.getElementById('modalSasaranInput');
  const btnDashedAdd = document.getElementById('btnTambahSasaranRoadmapDashed');
  const searchInput = document.getElementById('tableSearchTemaSasaran');
  const btnTemplate = document.getElementById('btnRbtTemplate');
  const btnImport = document.getElementById('btnRbtImport');
  const btnExportPdf = document.getElementById('btnRbtExportPdf');
  const btnExportExcel = document.getElementById('btnRbtExportExcel');

  // Tombol Tambah Sasaran Tematik Roadmap (Header Button)
  if (btnTambahRoadmap) {
    btnTambahRoadmap.addEventListener('click', (e) => {
      e.preventDefault();
      currentSasaranRowToEdit = null;
      if (formSasaran) formSasaran.reset();
      if (temaSelect) temaSelect.value = 'Pengentasan Kemiskinan';
      if (sasaranInput) sasaranInput.value = '';
      openRbtModal('modalSasaranTematikRoadmap');
    });
  }

  // Tombol Edit Sasaran Tematik (dari dropdown aksi ⋮)
  document.querySelectorAll('.btn-action-edit-sasaran').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const row = btn.closest('tr');
      currentSasaranRowToEdit = row;

      const currentTema = row ? row.querySelector('.col-tema-val')?.textContent.trim() : 'Pengentasan Kemiskinan';
      const currentSasaran = row ? row.querySelector('.col-sasaran-val')?.textContent.trim() : 'Menurunnya Angka Kemiskinan';

      if (temaSelect) temaSelect.value = currentTema;
      if (sasaranInput) sasaranInput.value = currentSasaran;

      // Close action dropdown
      document.querySelectorAll('.action-dropdown-wrapper').forEach(w => w.classList.remove('active'));

      openRbtModal('modalSasaranTematikRoadmap');
    });
  });

  // Tombol Tambah Indikator (dari dropdown aksi ⋮)
  document.querySelectorAll('.btn-action-tambah-indikator').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.action-dropdown-wrapper').forEach(w => w.classList.remove('active'));
      openRbtModal('modalTambahIndikator');
    });
  });

  // Tombol Edit Indikator (dari dropdown aksi ⋮)
  document.querySelectorAll('.btn-action-edit-indikator').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.action-dropdown-wrapper').forEach(w => w.classList.remove('active'));
      openRbtModal('modalEditIndikator');
    });
  });

  // Tombol Hapus Sasaran Tematik (dari dropdown aksi ⋮)
  document.querySelectorAll('.btn-action-hapus-sasaran').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.action-dropdown-wrapper').forEach(w => w.classList.remove('active'));
      const row = btn.closest('tr');
      if (confirm('Apakah Anda yakin ingin menghapus sasaran tematik ini beserta seluruh indikator di dalamnya?')) {
        if (row) {
          row.style.opacity = '0.3';
          setTimeout(() => {
            row.remove();
            showRbtToast('Sasaran tematik berhasil dihapus.');
            updateTemaSasaranEntriesCount();
          }, 250);
        }
      }
    });
  });

  // Tombol Hapus Indikator (dari dropdown aksi ⋮)
  document.querySelectorAll('.btn-action-hapus-indikator').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.action-dropdown-wrapper').forEach(w => w.classList.remove('active'));
      if (confirm('Apakah Anda yakin ingin menghapus indikator ini?')) {
        const row = btn.closest('tr');
        if (row) {
          const colInd = row.querySelector('.col-indikator-val');
          if (colInd) colInd.textContent = '-';
          showRbtToast('Indikator berhasil dihapus.');
        }
      }
    });
  });

  // Tombol Monev (dari dropdown aksi ⋮)
  document.querySelectorAll('.btn-action-monev').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.action-dropdown-wrapper').forEach(w => w.classList.remove('active'));
      showRbtToast('Membuka modul Monev Sasaran Tematik...');
    });
  });

  // Dashed button + Tambah Sasaran Tematik Roadmap di dalam modal
  if (btnDashedAdd) {
    btnDashedAdd.addEventListener('click', () => {
      showRbtToast('Menambahkan baris sasaran roadmap baru...');
    });
  }

  // Submit Form Sasaran Tematik Roadmap (Modal Screenshot 3)
  if (formSasaran) {
    formSasaran.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTema = temaSelect ? temaSelect.value : '';
      const newSasaran = sasaranInput ? sasaranInput.value.trim() : '';

      if (currentSasaranRowToEdit) {
        const colTema = currentSasaranRowToEdit.querySelector('.col-tema-val');
        const colSasaran = currentSasaranRowToEdit.querySelector('.col-sasaran-val');
        if (colTema && newTema) colTema.textContent = newTema;
        if (colSasaran && newSasaran) colSasaran.textContent = newSasaran;
        showRbtToast('Perubahan sasaran tematik berhasil disimpan!');
      } else {
        showRbtToast('Sasaran tematik roadmap baru berhasil ditambahkan!');
      }

      closeAllRbtModals();
    });
  }

  // Live Table Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#tableTemaSasaranBody tr');
      let count = 0;

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(query);
        row.style.display = matches ? '' : 'none';
        if (matches) count++;
      });

      const info = document.getElementById('entriesInfoTemaSasaran');
      if (info) {
        info.textContent = `Showing ${count ? 1 : 0} to ${count} of ${count} entries`;
      }
    });
  }

  // Toolbar Actions
  if (btnTemplate) {
    btnTemplate.addEventListener('click', () => showRbtToast('Mengunduh template data rencana aksi RB Tematik...'));
  }
  if (btnImport) {
    btnImport.addEventListener('click', () => showRbtToast('Membuka form impor data rencana aksi...'));
  }
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', () => showRbtToast('Mengunduh data rencana aksi dalam format PDF...'));
  }
  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => showRbtToast('Mengunduh data rencana aksi dalam format Excel...'));
  }
}

function updateTemaSasaranEntriesCount() {
  const rows = document.querySelectorAll('#tableTemaSasaranBody tr');
  let visibleCount = 0;
  rows.forEach(r => {
    if (r.style.display !== 'none') visibleCount++;
  });
  const info = document.getElementById('entriesInfoTemaSasaran');
  if (info) {
    info.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${visibleCount} entries`;
  }
}

/**
 * 1. Modul Halaman Permasalahan dan Rencana Aksi
 */

function initRbtPermasalahan() {
  const filterIndikator = document.getElementById('filterIndikatorRoadmap');
  const displayTarget = document.getElementById('displayTarget');
  const displaySatuan = document.getElementById('displaySatuanTarget');
  const btnOpenTambah = document.getElementById('btnOpenTambahPermasalahan');
  const searchInput = document.getElementById('tableSearch');

  // Dynamic Filter Target & Satuan
  if (filterIndikator && displayTarget && displaySatuan) {
    filterIndikator.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'Persentase Penduduk Miskin') {
        displayTarget.textContent = '10.85';
        displaySatuan.textContent = 'persen';
      } else if (val === 'Jumlah Realisasi Investasi') {
        displayTarget.textContent = '500';
        displaySatuan.textContent = 'Miliar Rupiah';
      } else {
        displayTarget.textContent = '-';
        displaySatuan.textContent = '-';
      }
    });
  }

  // Tombol Tambah Permasalahan
  if (btnOpenTambah) {
    btnOpenTambah.addEventListener('click', () => {
      openRbtModal('modalTambahPermasalahan');
    });
  }

  // Auto-fill Target & Satuan pada Modal Tambah Permasalahan (Figma Photo 3)
  const tpIndikator = document.getElementById('tpIndikatorRoadmap');
  const tpTarget = document.getElementById('tpTargetIndikator');
  const tpSatuan = document.getElementById('tpSatuanTarget');
  if (tpIndikator && tpTarget && tpSatuan) {
    tpIndikator.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'Persentase Penduduk Miskin') {
        tpTarget.value = '10.85';
        tpSatuan.value = 'persen';
      } else if (val === 'Jumlah Realisasi Investasi') {
        tpTarget.value = '500';
        tpSatuan.value = 'Miliar Rupiah';
      } else {
        tpTarget.value = '';
        tpSatuan.value = '';
      }
    });
  }

  // Auto-fill Target & Satuan pada Modal Edit Permasalahan
  const epIndikator = document.getElementById('epIndikatorRoadmap');
  const epTarget = document.getElementById('epTargetIndikator');
  const epSatuan = document.getElementById('epSatuanTarget');
  if (epIndikator && epTarget && epSatuan) {
    epIndikator.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'Persentase Penduduk Miskin') {
        epTarget.value = '10.85';
        epSatuan.value = 'persen';
      } else if (val === 'Jumlah Realisasi Investasi') {
        epTarget.value = '500';
        epSatuan.value = 'Miliar Rupiah';
      }
    });
  }

  // Live Table Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#permasalahanTableBody tr');
      let count = 0;

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(query);
        row.style.display = matches ? '' : 'none';
        if (matches) count++;
      });

      const info = document.getElementById('entriesInfo');
      if (info) {
        info.textContent = `Showing ${count ? 1 : 0} to ${count} of ${count} entries`;
      }
    });
  }

  // Form Submissions
  const formTambah = document.getElementById('formTambahPermasalahan');
  if (formTambah) {
    formTambah.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllRbtModals();
      showRbtToast('Permasalahan baru berhasil ditambahkan!');
      formTambah.reset();
    });
  }

  const formEditPermasalahan = document.getElementById('formEditPermasalahan');
  if (formEditPermasalahan) {
    formEditPermasalahan.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllRbtModals();
      showRbtToast('Perubahan permasalahan berhasil disimpan!');
    });
  }

  const formTambahIndikator = document.getElementById('formTambahIndikator');
  if (formTambahIndikator) {
    formTambahIndikator.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllRbtModals();
      showRbtToast('Indikator permasalahan baru berhasil ditambahkan!');
      formTambahIndikator.reset();
    });
  }

  const formEditIndikator = document.getElementById('formEditIndikator');
  if (formEditIndikator) {
    formEditIndikator.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllRbtModals();
      showRbtToast('Indikator permasalahan berhasil diperbarui!');
    });
  }
}

/**
 * 2. Modul Halaman RB Tematik - Rencana Aksi
 */
function initRbtRencanaAksi() {
  const btnOpenTambahRA = document.getElementById('btnOpenTambahRencanaAksi');
  const searchInputRA = document.getElementById('tableSearchRA');
  const formTambahRA = document.getElementById('formTambahRencanaAksi');

  if (btnOpenTambahRA) {
    btnOpenTambahRA.addEventListener('click', () => {
      openRbtModal('modalTambahRencanaAksi');
    });
  }

  if (searchInputRA) {
    searchInputRA.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#rencanaAksiTableBody tr');
      let count = 0;

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(query);
        row.style.display = matches ? '' : 'none';
        if (matches) count++;
      });

      const info = document.getElementById('entriesInfoRA');
      if (info) {
        info.textContent = `Showing ${count ? 1 : 0} to ${count} of ${count} entries`;
      }
    });
  }

  if (formTambahRA) {
    formTambahRA.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllRbtModals();
      showRbtToast('Rencana Aksi baru berhasil ditambahkan!');
      formTambahRA.reset();
    });
  }
}

/**
 * 3. Modul Halaman Rekap Data RB Tematik
 */
function initRbtRekapData() {
  const searchInput = document.getElementById('tableSearchRekap');
  const btnLihatData = document.getElementById('btnLihatData');
  const filterTema = document.getElementById('rekapFilterTema');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      filterRekapTable(query);
    });
  }

  if (btnLihatData && filterTema) {
    btnLihatData.addEventListener('click', () => {
      const temaVal = filterTema.value;
      const rows = document.querySelectorAll('#rekapTableBody tr');
      let count = 0;

      rows.forEach((row) => {
        const rowTema = row.children[1] ? row.children[1].textContent.trim() : '';
        const matches = (temaVal === 'all' || rowTema.toLowerCase().includes(temaVal.toLowerCase()));
        row.style.display = matches ? '' : 'none';
        if (matches) count++;
      });

      const info = document.getElementById('rekapEntriesInfo');
      if (info) {
        info.textContent = `Showing 1 to ${count} of ${count} entries`;
      }
      showRbtToast(`Menampilkan data untuk filter terpilih.`);
    });
  }

  function filterRekapTable(query) {
    const rows = document.querySelectorAll('#rekapTableBody tr');
    let count = 0;

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const matches = text.includes(query);
      row.style.display = matches ? '' : 'none';
      if (matches) count++;
    });

    const info = document.getElementById('rekapEntriesInfo');
    if (info) {
      info.textContent = `Showing ${count ? 1 : 0} to ${count} of ${count} entries`;
    }
  }
}

/**
 * 4. Modal Global & Backdrop Management
 */
function initRbtModalsGlobal() {
  // Tutup modal ketika overlay latar belakang diklik
  const overlays = document.querySelectorAll('.rbt-modal-overlay');
  overlays.forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllRbtModals();
      }
    });
  });

  // Tombol close & cancel modal
  const closeBtns = document.querySelectorAll('.btn-modal-close, .btn-modal-cancel');
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      closeAllRbtModals();
    });
  });

  // Tombol aksi baris (Aksi dropdown delegation)
  document.querySelectorAll('[data-rbt-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-rbt-modal');
      if (modalId) {
        openRbtModal(modalId);
      }
    });
  });
}

function openRbtModal(id) {
  closeAllRbtModals();
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllRbtModals() {
  document.querySelectorAll('.rbt-modal-overlay').forEach((m) => {
    m.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Global functions for inline action buttons or external triggers
window.openModal = openRbtModal;
window.closeAllModals = closeAllRbtModals;

window.openTambahIndikatorModal = function () {
  openRbtModal('modalTambahIndikator');
};

window.openEditIndikatorModal = function () {
  openRbtModal('modalEditIndikator');
};

window.openEditPermasalahanModal = function () {
  openRbtModal('modalEditPermasalahan');
};

window.openEditRencanaAksiModal = function () {
  openRbtModal('modalTambahRencanaAksi');
};

window.hapusPermasalahan = function (id) {
  if (confirm('Apakah Anda yakin ingin menghapus permasalahan ini?')) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.style.opacity = '0.3';
      setTimeout(() => {
        row.remove();
        showRbtToast('Permasalahan berhasil dihapus.');
        const info = document.getElementById('entriesInfo');
        if (info) info.textContent = 'Showing 0 to 0 of 0 entries';
      }, 300);
    }
  }
};

window.hapusRencanaAksi = function (id) {
  if (confirm('Apakah Anda yakin ingin menghapus rencana aksi ini?')) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.style.opacity = '0.3';
      setTimeout(() => {
        row.remove();
        showRbtToast('Rencana Aksi berhasil dihapus.');
        const info = document.getElementById('entriesInfoRA');
        if (info) info.textContent = 'Showing 0 to 0 of 0 entries';
      }, 300);
    }
  }
};

window.showRbtToast = function (message) {
  let toast = document.getElementById('rbtToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'rbt-toast';
    toast.id = 'rbtToast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};
