const projects = [
    { name: "Project One" },
    { name: "Project Two" },
    { name: "Project Three" }
]; // Example project data
// This will eventually be fetched from local storage

const projectList = document.getElementById('project-list');
const template = document.getElementById('project-template');

function renderProjects() {
    projectList.innerHTML = '';
    projects.forEach(project => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.project-name').textContent = project.name;
        projectList.appendChild(clone);
    });
}

renderProjects();