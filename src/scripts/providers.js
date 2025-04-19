const providerList = document.getElementById('provider-list');
const providerTemplate = document.getElementById('provider-template');

async function loadProviders() {
    const providers = await fetch('data/providers.json');
    const providersData = await providers.json();
    providersData.forEach(provider => {
        const providerElement = providerTemplate.content.cloneNode(true);
        providerElement.querySelector('.provider-name').textContent = provider.name;
        providerElement.querySelector('.provider-icon').src = provider.logo;
        providerElement.querySelector('.provider-website').href = provider.website;

        const collapseId = provider.name.replace(/\s+/g, '-');
        providerElement.querySelector('button').setAttribute('data-bs-target', `#${collapseId}`);
        providerElement.querySelector('div.collapse').setAttribute('id', `${collapseId}`);

        const plansTable = providerElement.querySelector('table');
        const plansHeaderRow = plansTable.querySelector('thead tr');
        const plansBody = plansTable.querySelector('tbody');

        // Generate table headers dynamically
        Object.keys(provider.plans[0]).forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            plansHeaderRow.appendChild(th);
        });

        // Generate table rows dynamically
        provider.plans.forEach(plan => {
            const tr = document.createElement('tr');
            Object.entries(plan).forEach(([key, value]) => {
                const td = document.createElement('td');
                if (['Memory', 'Storage', 'Free Bandwidth'].includes(key)) {
                    td.textContent = `${value} GB`;
                } else if (key.toLowerCase().includes('price')) {
                    td.textContent = `$${value}`;
                } else {
                    td.textContent = value;
                }
                tr.appendChild(td);
            });
            plansBody.appendChild(tr);
        });

        providerList.appendChild(providerElement);
    });
}

loadProviders();