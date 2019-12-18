const closeModal = $$('#close-modal');
const openModal = $$('#open-modal');
const modal = $$('#modal');
const taskModal = $$('#taskModal');
const createTask = $$('#createTask');
const closeTaskModal = $$('#closeTaskModal');
const tabs = $('.tabs');
const navLinks = $('.navlink');
const createProjectForm = $$('#createProject');
const projectInput = $$('#createProject input');

tabs.forEach(tab =>
	tab.addEventListener('click', e => {
		const type = e.target.textContent.trim().toLowerCase();
		changeTab(e, type);
	})
);

closeModal.onclick = function() {
	modal.style.display = 'none';
};

createTask.onclick = function() {
	taskModal.style.display = 'block';
	let date = new Date();
	$$("input[type='date']").value = date.toISOString().substr(0, 10);
	$$("input[type='time']").value = new Date().toISOString().substr(11, 5);
};

closeTaskModal.onclick = function() {
	taskModal.style.display = 'none';
};

openModal.onclick = function() {
	modal.style.display = 'block';
};

window.onclick = function(e) {
	if (e.target === taskModal) taskModal.style.display = 'none';
	if (e.target === modal) modal.style.display = 'none';
};

function changeTab(e, type) {
	let map = {
		completed: Project.controller.showCompleted,
		all: Project.controller.showAll,
		today: Project.controller.showActive
	};
	tabs.forEach(tab => tab.classList.remove('active'));
	e.target.classList.add('active');
	map[type]();
}

createProjectForm.addEventListener('submit', e => {
	e.preventDefault();
	let name = projectInput.value.trim();
	Project.controller.addProject(name);
	modal.style.display = 'none';
});

/**
 * Noticed That if i clicked on the project list. Am also able to click it the child element ie label and span
 *  I created this function to check if the clicked element is the project list or its child
 */

function hasClassorParent(element, classname) {
	if (element.classList && element.classList.contains(classname)) {
		return element;
	}

	return element.parentNode && hasClassorParent(element.parentNode, classname);
}

$$('#navList').addEventListener('click', e => {
	let target = hasClassorParent(e.target, 'navlink');
	if (target) {
		Project.controller.setActiveId(target.dataset.id);
		tabs[0].click();
	}
});

$$('#taskList').addEventListener('click', e => {
	let SpanOrInput = e.target.nodeName === 'INPUT';
	if (SpanOrInput) {
		let target = hasClassorParent(e.target, 'task');
		if (target) {
			Project.controller.toggleComplete(target.dataset.id, e.target);
			// Project.controller.setActiveId(target.dataset.id);
		}
	}
});

$$('#taskModal form').addEventListener('submit', e => {
	e.preventDefault();
	let title = $$("input[name='title']").value;
	let date = $$("input[name='date']").value;
	let time = $$("input[name='time']").value;

	let [hour, min] = time.split(':');
	let dateTime = new Date(date).setHours(hour, min);
	Project.controller.createTask({ title, date: dateTime });
	taskModal.style.display = 'none';
});

class App {
	constructor() {
		this.storage = new app.Store('scheduler-list');
		this.view = new app.View();
		this.controller = new app.Controller(this.storage, this.view);
	}
}

const Project = new App();
