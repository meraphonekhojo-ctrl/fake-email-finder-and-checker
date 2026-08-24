document.addEventListener('DOMContentLoaded', () => {
    const checkerInput = document.getElementById('checker-input');
    const btnCheck = document.getElementById('btn-check');
    const checkerResult = document.getElementById('checker-result');
    
    const statsList = document.getElementById('stats-list');
    const searchProvider = document.getElementById('search-provider');
    
    const accordionContainer = document.getElementById('accordion-container');
    const searchEmails = document.getElementById('search-emails');
    
    const btnGenerate = document.getElementById('btn-generate');
    const btnCopyEmails = document.getElementById('btn-copy-emails');
    const btnCopyDomains = document.getElementById('btn-copy-domains');
    
    const btnExportTxt = document.getElementById('btn-export-txt');
    const btnExportCsv = document.getElementById('btn-export-csv');
    const btnExportJson = document.getElementById('btn-export-json');
    
    const toast = document.getElementById('toast');
    
    let mockDomains = [
        "temp-mail.org", "ehwit.com", "yopmail.com", "guerrillamail.com", "maildrop.cc", "1secmail.com", "armyspy.com", "cuvox.de", "dayrep.com", "inxt.me", "smailpro.com", "trash-mail.com"
    ];
    
    let mockData = [
        { domain: "temp-mail.org", provider: "Temp-Mail", emails: ["user1@temp-mail.org", "user2@temp-mail.org"] },
        { domain: "ehwit.com", provider: "Temp-Mail", emails: ["solomi1729@ehwit.com", "test@ehwit.com"] },
        { domain: "yopmail.com", provider: "YOPmail", emails: ["random@yopmail.com"] },
        { domain: "guerrillamail.com", provider: "GuerrillaMail", emails: ["fake@guerrillamail.com"] },
        { domain: "maildrop.cc", provider: "Maildrop", emails: ["drop@maildrop.cc"] },
        { domain: "1secmail.com", provider: "1secmail", emails: ["sec@1secmail.com"] },
        { domain: "armyspy.com", provider: "FakeMailGenerator", emails: ["user@armyspy.com"] },
        { domain: "inxt.me", provider: "Internxt", emails: ["temp@inxt.me"] },
        { domain: "smailpro.com", provider: "SmailPro", emails: ["alias@smailpro.com"] },
        { domain: "trash-mail.com", provider: "Trash-Mail", emails: ["box@trash-mail.com"] }
    ];

    async function fetchLiveData() {
        try {
            const [domRes, dataRes] = await Promise.all([
                fetch('domains.json').catch(() => null),
                fetch('data.json').catch(() => null)
            ]);
            if (domRes && domRes.ok) {
                const domJson = await domRes.json();
                if (Array.isArray(domJson) && domJson.length > 0) {
                    mockDomains = domJson.map(d => d.domain);
                }
            }
            if (dataRes && dataRes.ok) {
                const dataJson = await dataRes.json();
                if (dataJson.emails && Array.isArray(dataJson.emails)) {
                    const groupedMap = {};
                    dataJson.emails.forEach(item => {
                        const d = item.domain || 'unknown';
                        const p = item.provider || 'Disposable Mail';
                        if (!groupedMap[d]) {
                            groupedMap[d] = { domain: d, provider: p, emails: [] };
                        }
                        if (item.email && !groupedMap[d].emails.includes(item.email)) {
                            groupedMap[d].emails.push(item.email);
                        }
                    });
                    mockData = Object.values(groupedMap);
                }
            }
        } catch (e) {
            console.log('Using local dataset', e);
        }
        renderStats();
        renderAccordion();
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function renderStats(filter = "") {
        statsList.innerHTML = '';
        let providerStats = {};
        mockData.forEach(d => {
            if (d.provider.toLowerCase().includes(filter.toLowerCase())) {
                providerStats[d.provider] = (providerStats[d.provider] || 0) + 1;
            }
        });
        
        for (const [provider, count] of Object.entries(providerStats)) {
            const item = document.createElement('div');
            item.className = 'stat-item';
            item.innerHTML = `
                <span><span class="badge badge-provider">${provider}</span></span>
                <span class="badge badge-count">${count} Domains</span>
            `;
            statsList.appendChild(item);
        }
    }

    function renderAccordion(filter = "") {
        accordionContainer.innerHTML = '';
        mockData.forEach(d => {
            if (d.domain.toLowerCase().includes(filter.toLowerCase()) || d.emails.some(e => e.toLowerCase().includes(filter.toLowerCase()))) {
                const details = document.createElement('details');
                const summary = document.createElement('summary');
                summary.innerHTML = `
                    <span>${d.domain} <span class="badge badge-provider" style="margin-left:10px">${d.provider}</span></span>
                    <span class="badge badge-count">${d.emails.length} Emails</span>
                `;
                
                const emailsContainer = document.createElement('div');
                emailsContainer.className = 'domain-emails';
                d.emails.forEach(e => {
                    if (e.toLowerCase().includes(filter.toLowerCase()) || filter === "") {
                        const emailDiv = document.createElement('div');
                        emailDiv.textContent = e;
                        emailsContainer.appendChild(emailDiv);
                    }
                });
                
                details.appendChild(summary);
                details.appendChild(emailsContainer);
                accordionContainer.appendChild(details);
            }
        });
    }

    btnCheck.addEventListener('click', () => {
        const input = checkerInput.value.trim().toLowerCase();
        if (!input) return;
        
        checkerResult.classList.remove('hidden', 'danger', 'success');
        
        let domain = input.includes('@') ? input.split('@')[1] : input;
        
        const found = mockData.find(d => d.domain === domain);
        if (found) {
            checkerResult.classList.add('danger');
            checkerResult.innerHTML = `
                <strong>⚠️ Disposable Email Detected!</strong><br>
                Email/Domain: ${input}<br>
                Provider: <span class="badge badge-provider">${found.provider}</span><br>
                Risk Score: 100%
            `;
        } else {
            checkerResult.classList.add('success');
            checkerResult.innerHTML = `
                <strong>✅ Clean</strong><br>
                Email/Domain: ${input}<br>
                No disposable provider detected.
            `;
        }
    });

    searchProvider.addEventListener('input', (e) => {
        renderStats(e.target.value);
    });

    searchEmails.addEventListener('input', (e) => {
        renderAccordion(e.target.value);
    });

    btnGenerate.addEventListener('click', () => {
        const randomDomain = mockDomains[Math.floor(Math.random() * mockDomains.length)];
        const randomStr = Math.random().toString(36).substring(2, 10);
        const newEmail = `${randomStr}@${randomDomain}`;
        
        const dataEntry = mockData.find(d => d.domain === randomDomain);
        if (dataEntry) {
            dataEntry.emails.push(newEmail);
            renderAccordion(searchEmails.value);
            showToast(`Generated: ${newEmail}`);
        }
    });

    btnCopyEmails.addEventListener('click', () => {
        let allEmails = [];
        mockData.forEach(d => allEmails.push(...d.emails));
        navigator.clipboard.writeText(allEmails.join('\n'));
        showToast('All emails copied!');
    });

    btnCopyDomains.addEventListener('click', () => {
        let allDomains = mockData.map(d => d.domain);
        navigator.clipboard.writeText(allDomains.join('\n'));
        showToast('All domains copied!');
    });
    
    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    btnExportTxt.addEventListener('click', () => {
        const domains = mockData.map(d => d.domain).join('\n');
        downloadFile(domains, 'blocklist.txt', 'text/plain');
        showToast('TXT Exported');
    });

    btnExportCsv.addEventListener('click', () => {
        const csv = "Domain,Provider\n" + mockData.map(d => `${d.domain},${d.provider}`).join('\n');
        downloadFile(csv, 'blocklist.csv', 'text/csv');
        showToast('CSV Exported');
    });

    btnExportJson.addEventListener('click', () => {
        downloadFile(JSON.stringify(mockData, null, 2), 'blocklist.json', 'application/json');
        showToast('JSON Exported');
    });

    // Initial render & fetch live dataset
    fetchLiveData();
});
