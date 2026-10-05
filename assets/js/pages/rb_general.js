/**
 * Portal Reformasi Birokrasi
 * JavaScript Khusus RB General (Perencanaan dan Monev)
 */

document.addEventListener('DOMContentLoaded', () => {
  initRbgPerencanaan();
  initRbgModalUbah();
  initRbgRekapData();
});

let currentRowToEdit = null;

/**
 * 1. Inisialisasi Fitur Halaman Perencanaan dan Monev
 */
function initRbgPerencanaan() {
  const searchInput = document.getElementById('tableSearch');
  const btnLihatData = document.getElementById('btnLihatDataRbg');
  const selectIndikator = document.getElementById('filterIndikatorRbg');

  // Live Table Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      filterRbgTable(query);
    });
  }

  // Filter Dropdown Indikator
  if (btnLihatData && selectIndikator) {
    btnLihatData.addEventListener('click', () => {
      const val = selectIndikator.value;
      const rows = document.querySelectorAll('#rbgTableBody tr');
      let count = 0;

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const matches = (!val || val === 'all' || text.includes(val.toLowerCase()));
        row.style.display = matches ? '' : 'none';
        if (matches) count++;
      });

      const info = document.getElementById('rbgEntriesInfo');
      if (info) {
        info.textContent = `Showing 1 to ${count} of ${count} entries`;
      }
      showRbgToast('Menampilkan data sesuai filter indikator.');
    });
  }

  // Tombol Hapus Baris
  document.querySelectorAll('.btn-action-badge.badge-hapus').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const row = btn.closest('tr');
      if (confirm('Apakah Anda yakin ingin menghapus data baseline & target ini?')) {
        if (row) {
          row.style.opacity = '0.3';
          setTimeout(() => {
            row.remove();
            showRbgToast('Data berhasil dihapus.');
            updateRbgEntriesCount();
          }, 250);
        }
      }
    });
  });

  // Tombol Renaksi & Monev
  document.querySelectorAll('.btn-action-badge.badge-renaksi').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showRbgToast('Membuka detail Rencana Aksi RB General...');
    });
  });

  document.querySelectorAll('.btn-action-badge.badge-monev').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showRbgToast('Membuka modul Monitoring dan Evaluasi...');
    });
  });
}

/**
 * 2. Inisialisasi Modal Ubah Data Baseline & Target
 */
function initRbgModalUbah() {
  const modal = document.getElementById('modalUbahBaselineTarget');
  const btnClose = document.getElementById('btnCloseModalUbah');
  const btnCancel = document.getElementById('btnCancelModalUbah');
  const formUbah = document.getElementById('formUbahBaselineTarget');

  // Event Listener Tombol Ubah pada Setiap Baris
  document.querySelectorAll('.btn-action-badge.badge-ubah').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentRowToEdit = btn.closest('tr');

      const kegiatan = btn.getAttribute('data-kegiatan') || 'Pelaksanaan Sistem Kerja Baru dengan Model Fleksibel bagi Pegawai ASN';
      const indikator = btn.getAttribute('data-indikator') || 'Tingkat Capaian Sistem Kerja untuk Penyederhanaan Birokrasi';
      const baselineTahun = btn.getAttribute('data-baseline-tahun') || '2025';
      const baselineRealisasi = btn.getAttribute('data-baseline-realisasi') || '1';
      const targetTahun = btn.getAttribute('data-target-tahun') || '2028';
      const targetNilai = btn.getAttribute('data-target-nilai') || '5';

      // Isi nilai ke dalam modal
      const modalKegiatan = document.getElementById('modalKegiatanUtama');
      const modalInd = document.getElementById('modalIndikator');
      const inputBTahun = document.getElementById('inputBaselineTahun');
      const inputBRealisasi = document.getElementById('inputBaselineRealisasi');
      const inputTTahun = document.getElementById('inputTargetTahun');
      const inputTNilai = document.getElementById('inputTargetNilai');

      if (modalKegiatan) modalKegiatan.textContent = kegiatan;
      if (modalInd) modalInd.textContent = indikator;
      if (inputBTahun) inputBTahun.value = baselineTahun;
      if (inputBRealisasi) inputBRealisasi.value = baselineRealisasi;
      if (inputTTahun) inputTTahun.value = targetTahun;
      if (inputTNilai) inputTNilai.value = targetNilai;

      openRbgModal();
    });
  });

  // Close handlers
  if (btnClose) btnClose.addEventListener('click', closeRbgModal);
  if (btnCancel) btnCancel.addEventListener('click', closeRbgModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeRbgModal();
    });
  }

  // Form Submit Handler
  if (formUbah) {
    formUbah.addEventListener('submit', (e) => {
      e.preventDefault();

      const newBTahun = document.getElementById('inputBaselineTahun').value;
      const newBRealisasi = document.getElementById('inputBaselineRealisasi').value;
      const newTTahun = document.getElementById('inputTargetTahun').value;
      const newTNilai = document.getElementById('inputTargetNilai').value;

      // Update nilai pada tabel yang aktif
      if (currentRowToEdit) {
        const baselineCol = currentRowToEdit.querySelector('.cell-baseline');
        const targetCol = currentRowToEdit.querySelector('.cell-target');
        const ubahBtn = currentRowToEdit.querySelector('.badge-ubah');

        if (baselineCol) {
          baselineCol.innerHTML = `
            <div class="rbg-info-stack">
              <span>Tahun: ${newBTahun}</span>
              <span>Realisasi: ${newBRealisasi}</span>
            </div>
          `;
        }

        if (targetCol) {
          targetCol.innerHTML = `
            <div class="rbg-info-stack">
              <span>Tahun: ${newTTahun}</span>
              <span>Target: ${newTNilai}</span>
            </div>
          `;
        }

        if (ubahBtn) {
          ubahBtn.setAttribute('data-baseline-tahun', newBTahun);
          ubahBtn.setAttribute('data-baseline-realisasi', newBRealisasi);
          ubahBtn.setAttribute('data-target-tahun', newTTahun);
          ubahBtn.setAttribute('data-target-nilai', newTNilai);
        }
      }

      closeRbgModal();
      showRbgToast('Data Baseline & Target berhasil diperbarui!');
    });
  }
}

function openRbgModal() {
  const modal = document.getElementById('modalUbahBaselineTarget');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeRbgModal() {
  const modal = document.getElementById('modalUbahBaselineTarget');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function filterRbgTable(query) {
  const rows = document.querySelectorAll('#rbgTableBody tr');
  let count = 0;

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    const matches = text.includes(query);
    row.style.display = matches ? '' : 'none';
    if (matches) count++;
  });

  const info = document.getElementById('rbgEntriesInfo');
  if (info) {
    info.textContent = `Showing ${count ? 1 : 0} to ${count} of ${count} entries`;
  }
}

function updateRbgEntriesCount() {
  const rows = document.querySelectorAll('#rbgTableBody tr');
  let visibleCount = 0;
  rows.forEach(r => {
    if (r.style.display !== 'none') visibleCount++;
  });
  const info = document.getElementById('rbgEntriesInfo');
  if (info) {
    info.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${visibleCount} entries`;
  }
}

function showRbgToast(message) {
  let toast = document.getElementById('rbgToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'rbt-toast';
    toast.id = 'rbgToast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * 3. Inisialisasi Rekap Data RB General (Screenshot 1)
 */
function initRbgRekapData() {
  const searchInput = document.getElementById('rekapSearchInput');
  const btnLihatData = document.getElementById('btnLihatDataRekap');
  const selectTahun = document.getElementById('rekapFilterTahun');
  const selectIndikator = document.getElementById('rekapFilterIndikator');
  const btnExportPdf = document.getElementById('btnExportPdf');
  const btnExportExcel = document.getElementById('btnExportExcel');

  // Live Table Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      filterRekapTable(query);
    });
  }

  // Filter Lihat Data
  if (btnLihatData) {
    btnLihatData.addEventListener('click', () => {
      const indVal = selectIndikator ? selectIndikator.value.toLowerCase().trim() : '';
      const thnVal = selectTahun ? selectTahun.value.trim() : '';
      const rows = document.querySelectorAll('#rbgRekapTableBody tr');
      let count = 0;

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        let matches = true;

        if (indVal && indVal !== 'all' && !text.includes(indVal)) {
          matches = false;
        }

        row.style.display = matches ? '' : 'none';
        if (matches) count++;
      });

      const info = document.getElementById('rekapEntriesInfo');
      if (info) {
        info.textContent = `Showing 1 to ${count} of ${count} entries`;
      }
      showRbgToast(`Menampilkan rekap data tahun ${thnVal || 'berjalan'}.`);
    });
  }

  // Export Buttons
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', () => {
      showRbgToast('Mengunduh dokumen Rekap Data dalam format PDF...');
    });
  }

  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      showRbgToast('Mengunduh berkas Rekap Data dalam format Excel...');
    });
  }
}

function filterRekapTable(query) {
  const rows = document.querySelectorAll('#rbgRekapTableBody tr');
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
