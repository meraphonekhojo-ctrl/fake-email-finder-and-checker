let domainsMap = new Map();
let emailsData = [];
let providersMap = new Map();

async function init() {
    try {
        const [domRes, dataRes] = await Promise.all([
            fetch('./domains.json'),
            fetch('./data.json')
        ]);
        const domData = await domRes.json();
        emailsData = await dataRes.json();

        domData.forEach(d => {
            domainsMap.set(d.domain, d.provider);
            providersMap.set(d.provider, (providersMap.get(d.provider) || 0) + 1);
        });

        renderStats();
        renderAccordion();
    } catch (e) {
        console.error("Failed to load data:", e);
    }
}

function renderStats(filter = "") {
    const list = document.getElementById('stats-list');
    list.innerHTML = '';
    const sorted = [...providersMap.entries()].sort((a,b) => b[1] - a[1]);
    
    sorted.forEach(([provider, count]) => {
        if (filter && !provider.toLowerCase().includes(filter.toLowerCase())) return;
        const div = document.createElement('div');
        div.className = 'stat-item';
        div.innerHTML = `<span>${provider}</span> <span class="badge count">${count} domains</span>`;
        list.appendChild(div);
    });
}

document.getElementById('search-provider').addEventListener('input', (e) => renderStats(e.target.value));

function renderAccordion(filterQuery = "") {
    const container = document.getElementById('accordion-container');
    container.innerHTML = '';

    const grouped = {};
    emailsData.forEach(e => {
        if (filterQuery && !e.email.toLowerCase().includes(filterQuery.toLowerCase()) && !e.domain.toLowerCase().includes(filterQuery.toLowerCase())) return;
        if (!grouped[e.domain]) grouped[e.domain] = [];
        grouped[e.domain].push(e);
    });

    const sortedDomains = Object.keys(grouped).sort((a, b) => grouped[b].length - grouped[a].length);

    sortedDomains.forEach(domain => {
        const emails = grouped[domain];
        const provider = domainsMap.get(domain) || 'Unknown';
        const details = document.createElement('details');
        details.className = 'domain-card';

        const summary = document.createElement('summary');
        summary.innerHTML = `
            <div class="summary-content">
                <span class="domain-name">${domain}</span>
                <div class="badges">
                    <span class="badge count">${emails.length} emails</span>
                    <span class="badge provider">Source: ${provider}</span>
                </div>
            </div>
        `;
        details.appendChild(summary);

        const ul = document.createElement('ul');
        ul.className = 'email-list';
        emails.forEach(e => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="email-text">${e.email}</span>
                <button class="btn-copy-small" onclick="copyText('${e.email}')">Copy</button>
            `;
            ul.appendChild(li);
        });
        details.appendChild(ul);
        container.appendChild(details);
    });
}

document.getElementById('search-emails').addEventListener('input', (e) => renderAccordion(e.target.value));

// Checker
document.getElementById('btn-check').addEventListener('click', () => {
    const input = document.getElementById('checker-input').value.trim().toLowerCase();
    if (!input) return;

    let domain = input;
    if (input.includes('@')) {
        domain = input.split('@')[1];
    }

    const resBox = document.getElementById('checker-result');
    resBox.classList.remove('hidden', 'danger', 'success');

    if (domainsMap.has(domain)) {
        const provider = domainsMap.get(domain);
        resBox.classList.add('danger');
        resBox.innerHTML = `🚨 <strong>FAKE / DISPOSABLE EMAIL DETECTED</strong><br>Provider: ${provider}<br>Risk Score: 100%<br>Domain: ${domain}`;
    } else {
        resBox.classList.add('success');
        resBox.innerHTML = `🟢 <strong>CLEAN / LEGITIMATE EMAIL</strong><br>No disposable domain matched.<br>Risk Score: 0%<br>Domain: ${domain}`;
    }
});

window.copyText = function(text) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
};

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Generate Button
document.getElementById('btn-generate').addEventListener('click', () => {
    const domainsArray = Array.from(domainsMap.keys());
    if (domainsArray.length === 0) return;
    const randomDomain = domainsArray[Math.floor(Math.random() * domainsArray.length)];
    const provider = domainsMap.get(randomDomain);
    const randomPrefix = Math.random().toString(36).substring(2, 10);
    const newEmail = `${randomPrefix}@${randomDomain}`;

    emailsData.unshift({ email: newEmail, domain: randomDomain, provider });
    showToast(`Generated: ${newEmail}`);
    
    renderAccordion(document.getElementById('search-emails').value);
    
    const firstDetails = document.querySelector('.domain-card');
    if (firstDetails) firstDetails.open = true;
});

// Bulk Copy
document.getElementById('btn-copy-emails').addEventListener('click', () => {
    const text = emailsData.map(e => e.email).join('\n');
    navigator.clipboard.writeText(text).then(() => showToast(`${emailsData.length} emails copied!`));
});

document.getElementById('btn-copy-domains').addEventListener('click', () => {
    const unique = [...new Set(emailsData.map(e => e.domain))];
    navigator.clipboard.writeText(unique.join('\n')).then(() => showToast(`${unique.length} domains copied!`));
});

// Export Buttons
document.getElementById('btn-export-txt').addEventListener('click', () => {
    const text = Array.from(domainsMap.keys()).join('\n');
    downloadBlob(text, 'blocklist.txt', 'text/plain');
});
document.getElementById('btn-export-csv').addEventListener('click', () => {
    const csv = "Domain,Provider\n" + Array.from(domainsMap.entries()).map(e => `${e[0]},${e[1]}`).join('\n');
    downloadBlob(csv, 'blocklist.csv', 'text/csv');
});
document.getElementById('btn-export-json').addEventListener('click', () => {
    const jsonStr = JSON.stringify(Array.from(domainsMap.entries()).map(e => ({domain: e[0], provider: e[1]})), null, 2);
    downloadBlob(jsonStr, 'blocklist.json', 'application/json');
});

function downloadBlob(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${fileName}`);
}

init();
