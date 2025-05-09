/**
 * @typedef {Object} Project
 * @property {string} project_name - The name of the project.
 * @property {string} project_description - A brief description of the project.
 * @property {Object} requirements - The hardware requirements for the project.
 * @property {string} requirements.cpu_kind - The type of CPU required (e.g., "dedicated").
 * @property {number} requirements.cpus - The number of CPUs required.
 * @property {number} requirements.storage - The amount of storage required (in GB).
 * @property {number} requirements.memory - The amount of memory required (in GB).
 * @property {number} requirements.bandwidth - The egress bandwidth required (in GBs).
 * @property {Plan} plan - The selected plan for the project
 */

/**
 * @typedef {Object} Plan
 * @property {string} Plan_Name - The name of the plan.
 * @property {number} CPUS - The number of CPUs included in the plan.
 * @property {string} CPU_Type - The type of CPU (e.g., "Shared" or "Dedicated").
 * @property {number} Memory - The amount of memory included in the plan (in GB).
 * @property {number} Included_Storage - The amount of storage included in the plan (in GB).
 * @property {number} Additional_Storage_Price - The price for additional storage (per GB).
 * @property {number} Price - The base price of the plan.
 * @property {number} Included_Bandwidth - The amount of bandwidth included in the plan (in Mbps).
 * @property {number} Additional_Bandwidth_Price - The price for additional bandwidth (per Mbps).
 * @property {Object} Provider - The name of the service provider.
 * @property {number} totalCost - The total cost of the plan after considering additional storage and bandwidth.
 */

/**
 * @typedef {Object} Provider
 * @property {Array<Plan>} plans - An array of plans offered by the provider.
 */

/**
 * 
 * @param {Array<Provider>} providers 
 * @param {Project} project 
 * @returns 
 */
function filterValidPlans(providers, project) {
    const validPlans = [];
    console.log(providers);
    console.log(project);
    providers.forEach(provider => {
        provider.plans.forEach(plan => {
            if (plan.CPUS >= project.requirements.cpus &&
                plan.Memory >= project.requirements.memory && plan.CPU_Type === project.requirements.cpu_kind
            ) {
                validPlans.push({
                    ...plan,
                    Provider: {
                        name: provider.name,
                        logo: provider.logo,
                        website: provider.website
                    }
                });
            }
        });
    });

    return validPlans;
}

/**
 * Calculates the cost of a plan based on the project requirements.
 * @param {Plan} plan 
 * @param {Project} project 
 * @returns {number} - The total cost of the plan.
 */
function calculateCostForPlan(plan, project) {
    let totalCost = plan.Price;

    if (plan.Included_Storage < project.requirements.storage) {
        totalCost += (project.requirements.storage - plan.Included_Storage) * plan.Additional_Storage_Price;
    }
    if (plan.Included_Bandwidth < project.requirements.bandwidth) {
        let bandwidthPrice = (project.requirements.bandwidth - plan.Included_Bandwidth) * plan.Additional_Bandwidth_Price;
        // this is distributed over 730 hours
        totalCost += bandwidthPrice / 730;

    }
    return totalCost;
}

async function fetchData() {
    const providers = await fetch('data/providers.json');
    const providersData = await providers.json();
    return providersData;
}

async function generateTable(validPlans, project) {
    const table = document.getElementById('plan-table');
    const tbody = table.querySelector('tbody');
    validPlans.forEach((plan) => {
        plan.totalCost = calculateCostForPlan(plan, project);
    });

    validPlans.sort((a, b) => a.totalCost - b.totalCost);

    for (let plan of validPlans) {
        let newRow = document.createElement('tr');
        const selectButton = document.createElement('button');
        selectButton.classList.add('select-plan', 'btn', 'btn-primary');
        selectButton.innerText = 'Select Plan';

        selectButton.addEventListener('click', () => {
            project.plan = plan;
            const params = new URLSearchParams(window.location.search);
            const noconfirm = params.get('noconfirm') ? true : false;
            createProject(project, noconfirm);
            window.location.href = 'projects-list.html';
        });
        const providerTd = document.createElement('td');
        const providerLogo = document.createElement('img');
        const providerName = document.createElement('span');
        providerLogo.src = plan.Provider.logo;
        providerLogo.alt = plan.Provider.name;
        providerLogo.classList.add('provider-logo');
        providerName.innerText = plan.Provider.name;

        providerTd.appendChild(providerLogo);
        providerTd.appendChild(providerName);
        newRow.appendChild(providerTd);
        newRow.innerHTML += `
            <td>${plan.Plan_Name}</td>
            <td>${plan.CPUS}</td>
            <td>${plan.Memory} GB</td>
            <td>${await formatCurrency(plan.totalCost, 4)}</td>
            <td>${await formatCurrency(plan.totalCost * 730)}</td>
        `;
        // <td>$${plan.totalCost.toFixed(4)}</td>
        // <td>$${(plan.totalCost * 730).toFixed(4)}</td>
        let td = document.createElement('td');
        td.appendChild(selectButton);
        newRow.appendChild(td);
        tbody.appendChild(newRow);
    }
}

fetchData().then((data) => {
    // check the project from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectRaw = urlParams.get('project');
    const project = JSON.parse(projectRaw);
    console.log(project);
    const validPlans = filterValidPlans(data, project);
    console.log(validPlans);
    generateTable(validPlans, project);
}
).catch((error) => {
    console.error('Error fetching data:', error);
});