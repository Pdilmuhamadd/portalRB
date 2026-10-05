/**
 * pelaporan_lhkan.js
 * Logika interaktivitas Form Pelaporan LHKAN & Riwayat Pelaporan LHKAN (Kalkulasi, Dynamic PIC, Filter, Paginasi, Modal Detail)
 */

document.addEventListener('DOMContentLoaded', function () {
  initFormPelaporanLhkan();
  initRiwayatPelaporanLhkan();
});

/**
 * 1. Inisialisasi Logika Halaman Form Pelaporan LHKAN
 */
function initFormPelaporanLhkan() {
  const lhkanForm = document.getElementById('lhkanForm');
  if (!lhkanForm) return;

  const picGrid = document.getElementById('picGrid');
  const btnAddPic = document.getElementById('btnAddPic');

  // Input Fields untuk kalkulasi
  const inputTotalAparatur = document.getElementById('inputTotalAparatur');
  const inputWajibLhkpn = document.getElementById('inputWajibLhkpn');
  const inputTidakWajibLhkpn = document.getElementById('inputTidakWajibLhkpn');
  const inputRealisasiLhkpn = document.getElementById('inputRealisasiLhkpn');
  const inputRealisasiSpt = document.getElementById('inputRealisasiSpt');
  const inputBelumLaporSpt = document.getElementById('inputBelumLaporSpt');
  const displayCalculatedTotal = document.getElementById('displayCalculatedTotal');

  // Fungsi Kalkulasi Otomatis
  function calculateLhkan() {
    const totalAparatur = parseInt(inputTotalAparatur?.value) || 0;
    const wajibLhkpn = parseInt(inputWajibLhkpn?.value) || 0;
    const tidakWajibLhkpn = parseInt(inputTidakWajibLhkpn?.value) || 0;
    const realisasiLhkpn = parseInt(inputRealisasiLhkpn?.value) || 0;
    const realisasiSpt = parseInt(inputRealisasiSpt?.value) || 0;

    // Belum Lapor SPT = Tidak Wajib LHKPN - Realisasi SPT
    const belumLaporSpt = Math.max(0, tidakWajibLhkpn - realisasiSpt);
    if (inputBelumLaporSpt) {
      inputBelumLaporSpt.value = belumLaporSpt;
    }

    // Formula: (Jumlah Wajib LHKPN - Realisasi LHKPN) + Belum Lapor SPT
    const selisihWajib = Math.max(0, wajibLhkpn - realisasiLhkpn);
    const totalBelumLapor = selisihWajib + belumLaporSpt;

    if (displayCalculatedTotal) {
      displayCalculatedTotal.textContent = totalBelumLapor;
    }
  }

  // Event listener input kalkulasi
  [inputTotalAparatur, inputWajibLhkpn, inputTidakWajibLhkpn, inputRealisasiLhkpn, inputRealisasiSpt].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', calculateLhkan);
    }
  });

  // Tambah PIC dinamis
  let picCount = 1;
  if (btnAddPic && picGrid) {
    btnAddPic.addEventListener('click', function () {
      picCount++;
      const newPicRow = document.createElement('div');
      newPicRow.className = 'pic-row';
      newPicRow.style.marginTop = '12px';
      newPicRow.innerHTML = `
        <div class="form-group flex-1">
          <label class="form-label">Nama PIC ${picCount} <span class="text-required">*</span></label>
          <input type="text" class="custom-input" placeholder="Masukkan nama PIC" required />
        </div>
        <div class="form-group flex-1">
          <label class="form-label">Nomor HP PIC ${picCount} <span class="text-required">*</span></label>
          <div style="display: flex; gap: 8px;">
            <input type="tel" class="custom-input" placeholder="Masukkan nomor HP aktif" required />
            <button type="button" class="btn-remove-pic" title="Hapus PIC" style="border: 1px solid #f87171; background: #fee2e2; color: #dc2626; border-radius: 4px; padding: 0 10px; cursor: pointer; font-size: 16px;">&times;</button>
          </div>
        </div>
      `;

      newPicRow.querySelector('.btn-remove-pic').addEventListener('click', function () {
        newPicRow.remove();
      });

      picGrid.appendChild(newPicRow);
    });
  }

  // Handle Form Submit
  lhkanForm.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Data Formulir Pelaporan LHKAN berhasil disubmit ke sistem!');
    window.location.href = 'riwayat_pelaporan.html';
  });
}

/**
 * 2. Inisialisasi Logika Halaman Riwayat Pelaporan LHKAN (Filter, Search, Pagination Realtime, Modal Detail)
 */
function initRiwayatPelaporanLhkan() {
  const table = document.querySelector('.riwayat-data-table');
  if (!table) return;

  const searchInput = document.querySelector('.riwayat-search-input');
  const filterYear = document.querySelector('.select-filter-year select');
  const filterStatus = document.querySelector('.select-filter-status select');
  const entriesInfo = document.querySelector('.entries-info');
  const btnPrev = document.querySelector('.pagination-nav button:first-child');
  const btnNext = document.querySelector('.pagination-nav button:last-child');
  const tbody = table.querySelector('tbody');
  const allRows = Array.from(tbody.querySelectorAll('tr'));

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const yearVal = filterYear ? filterYear.value.toLowerCase() : 'all';
    const statusVal = filterStatus ? filterStatus.value.toLowerCase() : 'all';

    let visibleCount = 0;

    allRows.forEach(row => {
      const year = row.children[0]?.textContent.trim().toLowerCase() || '';
      const instansi = row.children[2]?.textContent.trim().toLowerCase() || '';
      const statusBadge = row.children[4]?.textContent.trim().toLowerCase() || '';

      const matchQuery = !query || instansi.includes(query) || year.includes(query);
      const matchYear = yearVal === 'all' || year === yearVal;
      let matchStatus = true;
      if (statusVal !== 'all') {
        if (statusVal === 'approved' && !statusBadge.includes('disetujui')) matchStatus = false;
        if (statusVal === 'process' && !statusBadge.includes('proses')) matchStatus = false;
        if (statusVal === 'revision' && !statusBadge.includes('revisi')) matchStatus = false;
      }

      if (matchQuery && matchYear && matchStatus) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (entriesInfo) {
      if (visibleCount === 0) {
        entriesInfo.textContent = 'Showing 0 to 0 of 0 entries';
      } else {
        entriesInfo.textContent = `Showing 1 to ${visibleCount} of ${visibleCount} entries`;
      }
    }

    if (btnPrev) btnPrev.disabled = true;
    if (btnNext) btnNext.disabled = true;
  }

  // Event Listeners Filter
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (filterYear) filterYear.addEventListener('change', applyFilters);
  if (filterStatus) filterStatus.addEventListener('change', applyFilters);

  // Inisialisasi awal tabel saat pertama kali dimuat
  applyFilters();

  // 3. Modal Detail Handler
  const detailModal = document.getElementById('modalDetailLhkan');
  const detailButtons = document.querySelectorAll('.btn-detail-outline');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      if (!row) return;

      const tahun = row.children[0]?.textContent.trim();
      const periode = row.children[1]?.textContent.trim();
      const instansi = row.children[2]?.textContent.trim();
      const tglKirim = row.children[3]?.textContent.trim();
      const statusBadge = row.children[4]?.querySelector('.status-badge');

      if (detailModal) {
        const elTahunPeriode = document.getElementById('modalDetailTahunPeriode');
        const elInstansi = document.getElementById('modalDetailInstansi');
        const elTglKirim = document.getElementById('modalDetailTglKirim');
        const modalStatusBadge = document.getElementById('modalDetailStatusBadge');

        if (elTahunPeriode) elTahunPeriode.textContent = `${tahun} - ${periode}`;
        if (elInstansi) elInstansi.textContent = instansi;
        if (elTglKirim) elTglKirim.textContent = tglKirim;

        if (modalStatusBadge && statusBadge) {
          modalStatusBadge.className = statusBadge.className;
          modalStatusBadge.textContent = statusBadge.textContent;
        }

        detailModal.classList.add('active');
      }
    });
  });

  // Close Modal Handler
  if (detailModal) {
    const closeButtons = detailModal.querySelectorAll('.btn-modal-close, .btn-modal-cancel');
    closeButtons.forEach(b => {
      b.addEventListener('click', () => {
        detailModal.classList.remove('active');
      });
    });

    detailModal.addEventListener('click', function (e) {
      if (e.target === detailModal) {
        detailModal.classList.remove('active');
      }
    });
  }
}
