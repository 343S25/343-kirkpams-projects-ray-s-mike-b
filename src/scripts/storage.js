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


/**
 * 
 * @param {Project} project 
 * @returns 
 */
function createProject(project, no_confirm = false) {
    let projectList = getProjects();
    const projectName = project.project_name;
    const existingProject = getProjectByName(projectName);
    if (existingProject) {
        if (!no_confirm) {
            let confirmOverride = confirm(
                `Project with name ${projectName} already exists. Do you want to overwrite it?`
            );
            if (!confirmOverride) {
                alert('Project not created');
                return;
            }
        }
        updateProjectByName(projectName, project);
        projectList = getProjects();
    } else {
        projectList.push(project);
    }
    localStorage.setItem('projects', JSON.stringify(projectList));
    console.log(projectList);
}

function deleteProject(projectName) {
    const projectList = JSON.parse(localStorage.getItem('projects'));
    const index = projectList.findIndex((project) => project.project_name === projectName);
    if (index !== -1) {
        projectList.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projectList));
    }
}

function getProjects() {
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem('projects'));
}

function getProjectByName(projectName) {
    const projectList = JSON.parse(localStorage.getItem('projects'));
    return projectList.find((project) => project.project_name === projectName);
}

function updateProjectByName(projectName, project) {
    const projectList = JSON.parse(localStorage.getItem('projects'));
    const index = projectList.findIndex((project) => project.project_name === projectName);
    if (index !== -1) {
        projectList[index] = project;
        localStorage.setItem('projects', JSON.stringify(projectList));
    }
}