const ITEMS_PER_PAGE = 50;

let rawData = [];
let filteredData = [];
let currentPage = 1;
let sortCol = 'index';
let sortAsc = true;

const elements = {
    total: document.getElementById('stat-total'),
    providers: document.getElementById('stat-providers'),
    api: document.getElementById('stat-api'),
    domain: document.getElementById('stat-domain'),
    updated: document.getElementById('stat-updated'),
    searchInput: document.getElementById('search-input'),
    methodFilter: document.getElementById('method-filter'),
    tableBody: document.getElementById('table-body'),
    loading: document.getElementById('loading'),
    noResults: document.getElementById('no-results'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    currentPageSpan: document.getElementById('current-page'),
    totalPagesSpan: document.getElementById('total-pages'),
    toast: document.getElementById('toast'),
    headers: document.querySelectorAll('th[data-sort]')
};

async function init() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        processData(data);
        setupEventListeners();
        render();
    } catch (error) {
        console.error('Failed to load data:', error);
        elements.loading.textContent = 'Failed to load data. Please make sure data.json exists and is valid JSON.';
    }
}

function processData(data) {
    // Populate stats
    elements.total.textContent = data.total_count || 0;
    elements.providers.textContent = data.providers_count || 0;
    
    // Add index to emails and count methods
    let apiCount = 0;
    let domainCount = 0;
    
    rawData = (data.emails || []).map((item, index) => {
        if (item.method === 'api') apiCount++;
        else if (item.method === 'domain') domainCount++;
        
        return {
            ...item,
            index: index + 1
        };
    });
    
    elements.api.textContent = apiCount;
    elements.domain.textContent = domainCount;
    
    if (data.last_updated) {
        const date = new Date(data.last_updated);
        elements.updated.textContent = date.toLocaleString();
    }
    
    filteredData = [...rawData];
}

function setupEventListeners() {
    let debounceTimer;
    elements.searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            applyFilters();
        }, 300);
    });

    elements.methodFilter.addEventListener('change', () => {
        applyFilters();
    });
    
    elements.btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    
    elements.btnNext.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    elements.headers.forEach(th => {
        th.addEventListener('click', () => {
            const col = th.getAttribute('data-sort');
            if (sortCol === col) {
                sortAsc = !sortAsc;
            } else {
                sortCol = col;
                sortAsc = true;
            }
            sortData();
            renderTable();
            updateSortIndicators();
        });
    });
}

function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const methodTerm = elements.methodFilter.value;
    
    filteredData = rawData.filter(item => {
        const matchesSearch = !searchTerm || 
            (item.email && item.email.toLowerCase().includes(searchTerm)) ||
            (item.provider && item.provider.toLowerCase().includes(searchTerm)) ||
            (item.domain && item.domain.toLowerCase().includes(searchTerm));
            
        const matchesMethod = methodTerm === 'all' || item.method === methodTerm;
        
        return matchesSearch && matchesMethod;
    });
    
    currentPage = 1;
    sortData();
    renderTable();
}

function sortData() {
    filteredData.sort((a, b) => {
        let valA = a[sortCol];
        let valB = b[sortCol];
        
        if (valA == null) valA = '';
        if (valB == null) valB = '';
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
    });
}

function updateSortIndicators() {
    elements.headers.forEach(th => {
        th.textContent = th.textContent.replace(' ↑', '').replace(' ↓', '');
        if (th.getAttribute('data-sort') === sortCol) {
            th.textContent += sortAsc ? ' ↑' : ' ↓';
        }
    });
}

function render() {
    elements.loading.classList.add('hidden');
    renderTable();
    updateSortIndicators();
}

function renderTable() {
    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    
    if (currentPage > totalPages) currentPage = totalPages;
    
    elements.currentPageSpan.textContent = currentPage;
    elements.totalPagesSpan.textContent = totalPages;
    
    elements.btnPrev.disabled = currentPage === 1;
    elements.btnNext.disabled = currentPage === totalPages || totalPages === 0;
    
    elements.tableBody.innerHTML = '';
    
    if (filteredData.length === 0) {
        elements.noResults.classList.remove('hidden');
        return;
    }
    
    elements.noResults.classList.add('hidden');
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);
    const pageData = filteredData.slice(startIndex, endIndex);
    
    const fragment = document.createDocumentFragment();
    
    pageData.forEach(item => {
        const tr = document.createElement('tr');
        
        const tdIndex = document.createElement('td');
        tdIndex.textContent = item.index;
        
        const tdEmail = document.createElement('td');
        tdEmail.textContent = item.email;
        tdEmail.style.fontWeight = '500';
        
        const tdProvider = document.createElement('td');
        tdProvider.textContent = item.provider || '-';
        
        const tdDomain = document.createElement('td');
        tdDomain.textContent = item.domain || '-';
        
        const tdMethod = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `badge badge-${item.method || 'default'}`;
        badge.textContent = item.method || '-';
        tdMethod.appendChild(badge);
        
        const tdDate = document.createElement('td');
        if (item.harvested_at) {
            const d = new Date(item.harvested_at);
            tdDate.textContent = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        } else {
            tdDate.textContent = '-';
        }
        
        const tdAction = document.createElement('td');
        const btnCopy = document.createElement('button');
        btnCopy.className = 'btn-copy';
        btnCopy.textContent = 'Copy';
        btnCopy.onclick = () => copyToClipboard(item.email);
        tdAction.appendChild(btnCopy);
        
        tr.append(tdIndex, tdEmail, tdProvider, tdDomain, tdMethod, tdDate, tdAction);
        fragment.appendChild(tr);
    });
    
    elements.tableBody.appendChild(fragment);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast();
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

let toastTimeout;
function showToast() {
    elements.toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 2000);
}

document.addEventListener('DOMContentLoaded', init);
