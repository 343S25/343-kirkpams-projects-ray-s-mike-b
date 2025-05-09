const projectList = document.getElementById('project-list');
const template = document.getElementById('project-template');

document.getElementById('import-btn').addEventListener('click', function (event) {
    event.preventDefault();
    const fileInput = document.getElementById('import-file');
    fileInput.click();
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            try {
                const project = JSON.parse(content);
                createProject(project);
                location.reload();
            } catch (error) {
                alert('Invalid file format. Please upload a valid JSON file.');
            }
        };
        reader.readAsText(file);
    });
});
function renderProjects() {
    let projectsString = localStorage.getItem('projects');
    if (!projectsString) {
        return;
    }
    let projects = JSON.parse(projectsString)
    projectList.innerHTML = '';
    projects.forEach(project => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.project-name').innerText = project.project_name;

        let view_button = clone.querySelector('.view-button');
        let edit_button = clone.querySelector('.edit-button');
        let delete_button = clone.querySelector('.delete-button');
        let export_button = clone.querySelector('.export-button');
        const params = new URLSearchParams();
        params.set('project_name', project.project_name);
        params.set('mode', 'view');

        view_button.href = `./project.html?${params.toString()}`;
        params.set('mode', 'edit');
        edit_button.href = `./project.html?${params.toString()}`;

        delete_button.addEventListener('click', function (event) {
            event.preventDefault();
            if (confirm(`Are you sure you want to delete ${project.project_name} ?`)) {
                deleteProject(project.project_name);
                location.reload();
            }
        });

        export_button.addEventListener('click', function (event) {
            event.preventDefault();
            const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.project_name}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        projectList.appendChild(clone);
    });
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

renderProjects();