const ITEMS_PER_PAGE = 50;

let rawData = [];
let filteredData = [];
let domainsSet = new Set();
let allDomainsData = null;
let currentPage = 1;
let sortCol = 'index';
let sortAsc = true;

const elements = {
    // Stats
    total: document.getElementById('stat-total'),
    providers: document.getElementById('stat-providers'),
    domainsCount: document.getElementById('stat-domains-count'),
    updated: document.getElementById('stat-updated'),
    
    // Checker
    emailInput: document.getElementById('email-check-input'),
    btnCheck: document.getElementById('btn-check'),
    checkerCard: document.getElementById('checker-card'),
    checkResult: document.getElementById('check-result'),
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    
    // Services
    servicesGrid: document.getElementById('services-grid'),
    
    // Downloads
    downloadTxt: document.getElementById('download-txt'),
    downloadCsv: document.getElementById('download-csv'),
    downloadJson: document.getElementById('download-json'),

    // Table
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
        // Load Harvested Emails
        const emailResponse = await fetch('data.json').catch(() => null);
        let emailData = { emails: [], total_count: 0, providers_count: 0 };
        if (emailResponse && emailResponse.ok) {
            emailData = await emailResponse.json();
        }

        // Load Domain List
        const domainResponse = await fetch('domains.json').catch(() => null);
        let domainData = { domains: [], total_domains: 0, featured_services: {} };
        if (domainResponse && domainResponse.ok) {
            domainData = await domainResponse.json();
        }
        
        allDomainsData = domainData;
        domainsSet = new Set((domainData.domains || []).map(d => d.toLowerCase()));

        processData(emailData, domainData);
        setupEventListeners();
        render();
        renderServices(domainData.featured_services);
        setupDownloads();

    } catch (error) {
        console.error('Failed to load data:', error);
        elements.loading.textContent = 'Failed to load data. Please verify json files exist.';
    }
}

function processData(emailData, domainData) {
    elements.total.textContent = emailData.total_count || 0;
    elements.providers.textContent = emailData.providers_count || 0;
    elements.domainsCount.textContent = domainData.total_domains || 0;
    
    rawData = (emailData.emails || []).map((item, index) => {
        return { ...item, index: index + 1 };
    });
    
    if (emailData.last_updated) {
        const date = new Date(emailData.last_updated);
        elements.updated.textContent = date.toLocaleString();
    } else if (domainData.last_updated) {
        const date = new Date(domainData.last_updated);
        elements.updated.textContent = date.toLocaleString();
    }
    
    filteredData = [...rawData];
}

function renderServices(services) {
    if (!services || Object.keys(services).length === 0) {
        elements.servicesGrid.innerHTML = '<p>No services data available.</p>';
        return;
    }

    elements.servicesGrid.innerHTML = '';
    
    for (const [key, service] of Object.entries(services)) {
        const card = document.createElement('div');
        card.className = 'service-card';
        
        let domainsHtml = '';
        const limit = 3;
        const domains = service.known_domains || [];
        
        for (let i = 0; i < Math.min(domains.length, limit); i++) {
            domainsHtml += `<span class="domain-chip">${domains[i]}</span>`;
        }
        if (domains.length > limit) {
            domainsHtml += `<span class="domain-chip">+${domains.length - limit} more</span>`;
        }
        
        card.innerHTML = `
            <div class="service-header">
                <h3>${service.name}</h3>
                <span class="service-badge">${service.category}</span>
            </div>
            <a href="${service.url}" target="_blank" rel="noopener" class="service-link">${service.url}</a>
            <p class="service-desc">${service.description}</p>
            <div class="service-footer">
                ${domainsHtml}
            </div>
        `;
        
        elements.servicesGrid.appendChild(card);
    }
}

function setupDownloads() {
    // Generate TXT Blob from domainsSet
    if (domainsSet.size > 0) {
        const txtContent = Array.from(domainsSet).sort().join('\n');
        const txtBlob = new Blob([txtContent], { type: 'text/plain' });
        elements.downloadTxt.href = URL.createObjectURL(txtBlob);
    }
    
    // Existing files can be downloaded directly, or we can generate them from memory
}

function checkEmail() {
    const input = elements.emailInput.value.trim().toLowerCase();
    if (!input) return;

    let domainToCheck = input;
    
    // If it's an email, extract domain
    if (input.includes('@')) {
        domainToCheck = input.split('@')[1];
    }
    
    const isFake = domainsSet.has(domainToCheck);
    
    elements.checkerCard.classList.remove('status-fake', 'status-safe');
    elements.checkResult.classList.remove('hidden', 'result-fake', 'result-safe');
    
    if (isFake) {
        elements.checkerCard.classList.add('status-fake');
        elements.checkResult.classList.add('result-fake');
        elements.resultIcon.textContent = '🚨';
        elements.resultTitle.textContent = 'FAKE / DISPOSABLE DETECTED';
        elements.resultTitle.style.color = 'var(--accent-red)';
        elements.resultMessage.innerHTML = `The domain <strong>${domainToCheck}</strong> was found in our blocklist. This email is likely temporary or disposable.`;
    } else {
        elements.checkerCard.classList.add('status-safe');
        elements.checkResult.classList.add('result-safe');
        elements.resultIcon.textContent = '✅';
        elements.resultTitle.textContent = 'CLEAN / NOT IN BLOCKLIST';
        elements.resultTitle.style.color = 'var(--accent-green)';
        elements.resultMessage.innerHTML = `The domain <strong>${domainToCheck}</strong> appears to be safe and is not in our known disposable database.`;
    }
}

function setupEventListeners() {
    // Checker Event Listeners
    elements.btnCheck.addEventListener('click', checkEmail);
    elements.emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkEmail();
    });
    elements.emailInput.addEventListener('input', () => {
        if (!elements.emailInput.value.trim()) {
            elements.checkResult.classList.add('hidden');
            elements.checkerCard.classList.remove('status-fake', 'status-safe');
        }
    });

    // Table Filters
    let debounceTimer;
    elements.searchInput.addEventListener('input', () => {
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
            if (!col) return;
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
        if(!th.getAttribute('data-sort')) return;
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
