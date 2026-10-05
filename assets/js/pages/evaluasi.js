/**
 * evaluasi.js
 * Logika interaktivitas Halaman Hasil Evaluasi (Overview & Kertas Kerja)
 */

document.addEventListener('DOMContentLoaded', function () {
  initEvaluasiTabs();
  initKertasKerjaTable();
});

/**
 * Inisialisasi Navigasi Tab Overview & Kertas Kerja
 */
function initEvaluasiTabs() {
  const tabButtons = document.querySelectorAll('.eval-tab-item');
  const tabPanes = document.querySelectorAll('.eval-tab-pane');

  if (!tabButtons.length || !tabPanes.length) return;

  function switchTab(targetTab) {
    tabButtons.forEach(btn => {
      const tabName = btn.getAttribute('data-tab');
      if (tabName === targetTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabPanes.forEach(pane => {
      if (pane.id === (targetTab === 'overview' ? 'paneOverview' : 'paneKertasKerja')) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Update URL hash smoothly without jump
    if (history.replaceState) {
      history.replaceState(null, null, '#' + targetTab);
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Cek hash URL jika ada #kertas-kerja atau #overview
  const hash = window.location.hash.replace('#', '');
  if (hash === 'kertas-kerja') {
    switchTab('kertas-kerja');
  } else {
    switchTab('overview');
  }
}

/**
 * Inisialisasi Tabel Kertas Kerja (Pencarian, Filter Entries, Sorting, Ekspor)
 */
function initKertasKerjaTable() {
  const searchInput = document.getElementById('kkSearchInput');
  const selectEntries = document.getElementById('kkSelectEntries');
  const tableBody = document.getElementById('kkTableBody');
  const entriesInfo = document.getElementById('kkEntriesInfo');
  const btnExportPdf = document.getElementById('btnKkExportPdf');
  const btnExportExcel = document.getElementById('btnKkExportExcel');
  const sortHeaders = document.querySelectorAll('.th-sortable');

  if (!tableBody) return;

  const originalRows = Array.from(tableBody.querySelectorAll('tr'));
  const totalEntries = originalRows.length;

  function updateTable() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    originalRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    // Handle empty row if none found
    let emptyRow = tableBody.querySelector('.tr-empty-state');
    if (visibleCount === 0) {
      if (!emptyRow) {
        emptyRow = document.createElement('tr');
        emptyRow.className = 'tr-empty-state';
        emptyRow.innerHTML = `<td colspan="11" style="text-align: center; padding: 24px; color: #64748b;">Tidak ada data yang sesuai dengan pencarian "${query}".</td>`;
        tableBody.appendChild(emptyRow);
      } else {
        emptyRow.style.display = '';
        emptyRow.querySelector('td').textContent = `Tidak ada data yang sesuai dengan pencarian "${query}".`;
      }
    } else if (emptyRow) {
      emptyRow.style.display = 'none';
    }

    if (entriesInfo) {
      if (visibleCount === 0) {
        entriesInfo.textContent = `Showing 0 to 0 of ${totalEntries} entries`;
      } else {
        entriesInfo.textContent = `Showing 1 to ${visibleCount} of ${totalEntries} entries`;
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', updateTable);
  }

  if (selectEntries) {
    selectEntries.addEventListener('change', function () {
      updateTable();
    });
  }

  // Sorting Handler
  let currentSortCol = null;
  let isAscending = true;

  sortHeaders.forEach((th, colIndex) => {
    th.addEventListener('click', function () {
      const rows = Array.from(tableBody.querySelectorAll('tr:not(.tr-empty-state)'));
      if (rows.length <= 1) return;

      if (currentSortCol === colIndex) {
        isAscending = !isAscending;
      } else {
        currentSortCol = colIndex;
        isAscending = true;
      }

      rows.sort((a, b) => {
        const aText = a.children[colIndex] ? a.children[colIndex].textContent.trim() : '';
        const bText = b.children[colIndex] ? b.children[colIndex].textContent.trim() : '';

        const aNum = parseFloat(aText.replace(',', '.'));
        const bNum = parseFloat(bText.replace(',', '.'));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return isAscending ? aNum - bNum : bNum - aNum;
        }

        return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });

      rows.forEach(r => tableBody.appendChild(r));
    });
  });

  // Ekspor Handlers
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', function () {
      alert('Memproses Ekspor PDF Lembar Kerja Evaluasi...');
    });
  }

  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', function () {
      alert('Memproses Ekspor Excel Lembar Kerja Evaluasi...');
    });
  }
}
