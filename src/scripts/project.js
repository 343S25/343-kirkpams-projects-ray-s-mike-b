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
 * @property {string} Provider - The name of the service provider.
 * @property {number} totalCost - The total cost of the plan after considering additional storage and bandwidth.
 */

const form = document.getElementById('project-form');
const changePlanButton = document.getElementById('change-plan-button');
let mode = "";
let projectName = "";
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('mode')) {
    mode = urlParams.get('mode');
}
if (urlParams.has('project_name')) {
    projectName = urlParams.get('project_name');
}
if (mode === 'edit') {
    document.querySelector('h1').innerText = `Edit Project: ${projectName}`;
    const project = getProjectByName(projectName);
    if (project) {
        populateForm(project);
        document.getElementById('calculate-button').innerText = 'Save Changes';
        document.getElementById('calculate-button').disabled = false;

    } else {
        alert('Project not found');
        window.location.href = './projects-list.html';
    }

} else if (mode === 'view') {
    document.querySelector('h1').innerText = `${projectName}`;
    const project = getProjectByName(projectName);
    if (project) {
        console.log(project);
        populateForm(project);
        disableForm();
    } else {
        alert('Project not found');
        window.location.href = './projects-list.html';
    }
}

async function populateForm(project) {
    document.getElementById('project-name').value = project.project_name;
    document.getElementById('project-desc').value = project.project_description;
    document.getElementById('cpu').value = project.requirements.cpus;
    document.getElementById('storage').value = project.requirements.storage;
    document.getElementById('memory').value = project.requirements.memory;
    document.getElementById('bandwidth').value = project.requirements.bandwidth;

    if (project.plan) {
        document.getElementById('plan-table').classList.remove('hidden');
        document.getElementById('provider-logo').src = project.plan.Provider.logo;
        document.getElementById('provider-logo').alt = project.plan.Provider.name;
        document.getElementById('provider-name').innerText = project.plan.Provider.name;
        document.getElementById('plan-name').innerText = project.plan.Plan_Name;
        document.getElementById('plan-cpus').innerText = project.plan.CPUS;
        document.getElementById('plan-memory').innerText = project.plan.Memory;
        document.getElementById('plan-cost-hour').innerText = await formatCurrency(project.plan.totalCost);
        document.getElementById('plan-cost-month').innerText = await formatCurrency(project.plan.totalCost * 730);
    }
}
function disableForm() {
    document.getElementById('project-name').disabled = true;
    document.getElementById('project-desc').disabled = true;
    document.getElementById('cpu-kind').disabled = true;
    document.getElementById('cpu').disabled = true;
    document.getElementById('storage').disabled = true;
    document.getElementById('memory').disabled = true;
    document.getElementById('bandwidth').disabled = true;
    document.getElementById('calculate-button').disabled = true;
    document.getElementById('calculate-button').style.display = 'none';
    document.getElementById('change-plan-button').disabled = true;
}


function getValue(id) {
    return document.getElementById(id).value;
}
function getInt(id) {
    return Number.parseInt(getValue(id));
}
function getFloat(id) {
    return Number.parseFloat(getValue(id));
}
form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (mode === 'edit') {
        const project = getProject();
        project.plan = getProjectByName(projectName).plan;
        updateProjectByName(projectName, project);
        window.location.href = './projects-list.html';
        return
    }
    window.location.href = getCalculateUrl();
});
changePlanButton.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = getCalculateUrl();
});


function getProject() {
    const project_name = getValue('project-name');
    const projectDescription = getValue('project-desc');
    const cpuKind = getValue('cpu-kind');
    const cpus = getInt('cpu');
    const storage = getInt('storage');
    const memory = getFloat('memory');
    const bandwidth = getInt('bandwidth');
    const requirements = {
        cpu_kind: cpuKind,
        cpus: cpus,
        storage: storage,
        memory: memory,
        bandwidth: bandwidth
    };
    const project = {
        project_name: project_name,
        project_description: projectDescription,
        requirements: requirements
    };
    return project;
}
function getCalculateUrl(no_confirm = false) {
    const project = getProject();
    const projectEncoded = encodeURIComponent(JSON.stringify(project));
    let url = `./calculate.html?project=${projectEncoded}`;
    if (!no_confirm) {
        url += '&noconfirm=true';
    }
    return url;
}

/**
 * @typedef {Object} Project
 * @property {string} project_name - The name of the project.
 * @property {string} project_description - A brief description of the project.
 * @property {Object} requirements - The hardware requirements for the project.
 * @property {string} requirements.cpu_kind - The type of CPU required (e.g., "dedicated").
 * @property {number} requirements.cpus - The number of CPUs required.
 * @property {number} requirements.storage - The amount of storage required (in GB).
 * @property {number} requirements.memory - The amount of memory required (in GB).
 * @property {number} requirements.bandwidth - The bandwidth required (in Mbps).
 * @property {Object} plan - The plan details for the project.
 * @property {string} plan.provider_name - The name of the service provider.
 * @property {number} plan.price - The price of the plan (per hour or unit).
 * @property {Object} plan.details - Additional details fetched from the API.
 */