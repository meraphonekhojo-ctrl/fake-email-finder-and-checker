let allDomains = [];
const itemsPerPage = 50;
let currentPage = 1;

const featuredProviders = [
    'fake-email.pro', 'tempmail.co.uk', 'armyspy.com', 'cuvox.de', 'dayrep.com',
    'einrot.com', 'flddf.com', 'gustr.com', 'jourrapide.com', 'rhyta.com',
    'superrito.com', 'teleworm.us', 'anonymmail.net', 'temp-mail.org', 'smailpro.com',
    'trash-mail.com', 'rcpt.at', 'fakeemail.net', 'inxt.me', 'internxt.com',
    'maildrop.cc', 'disposablemail.com', 'emailondeck.com', 'temp-mail.io', 'openinbox.io',
    'mailsac.com', 'msr.sh', 'yopmail.com', 'cool.fr.nf', 'tempail.com', 'mails.org', 'adguard.com'
];

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupSearch();
    setupPagination();
    renderFeaturedProviders();
});

async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        allDomains = data.domains || [];
        
        // Update stats
        if (data.stats) {
            document.getElementById('stat-total').textContent = data.stats.total || allDomains.length;
            document.getElementById('stat-providers').textContent = data.stats.providers || '-';
            document.getElementById('stat-api').textContent = data.stats.api_providers || '-';
            document.getElementById('stat-updated').textContent = new Date(data.stats.last_updated).toLocaleDateString() || '-';
        }
        
        renderTable();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('domain-table-body').innerHTML = '<tr><td colspan="2">Failed to load data. Please make sure data.json exists and is valid JSON.</td></tr>';
    }
}

function renderTable() {
    const tbody = document.getElementById('domain-table-body');
    tbody.innerHTML = '';
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageDomains = allDomains.slice(start, end);
    
    pageDomains.forEach(domain => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${domain}</td>
            <td><button class="copy-btn" onclick="copyText('${domain}')">Copy</button></td>
        `;
        tbody.appendChild(tr);
    });
    
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${Math.ceil(allDomains.length / itemsPerPage) || 1}`;
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === Math.ceil(allDomains.length / itemsPerPage) || allDomains.length === 0;
}

function setupPagination() {
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < Math.ceil(allDomains.length / itemsPerPage)) {
            currentPage++;
            renderTable();
        }
    });
}

function setupSearch() {
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');
    const resultDiv = document.getElementById('search-result');
    
    const checkEmail = () => {
        const query = input.value.trim().toLowerCase();
        if (!query) return;
        
        let domainToCheck = query;
        if (query.includes('@')) {
            domainToCheck = query.split('@')[1];
        }
        
        const isDisposable = allDomains.includes(domainToCheck);
        
        resultDiv.className = 'result-message ' + (isDisposable ? 'disposable' : 'safe');
        resultDiv.textContent = isDisposable 
            ? `⚠️ WARNING: ${domainToCheck} is a known disposable/fake email domain!`
            : `✅ SAFE: ${domainToCheck} is not in our disposable domain database.`;
    };
    
    btn.addEventListener('click', checkEmail);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkEmail();
    });
}

function renderFeaturedProviders() {
    const grid = document.querySelector('.provider-grid');
    grid.innerHTML = '';
    
    // Only show up to 24 featured providers
    featuredProviders.slice(0, 24).forEach(provider => {
        const div = document.createElement('div');
        div.className = 'provider-card';
        div.textContent = provider;
        grid.appendChild(div);
    });
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}
