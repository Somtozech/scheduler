(function(window) {
	class Controller {
		constructor(store, view) {
			this.model = store;
			this.view = view;
			this.taskList = $$('#taskList');
			this.summary = $$('#summary');
			this.projectList = $$('#navList');

			this.showAll = this.showAll.bind(this);
			this.showCompleted = this.showCompleted.bind(this);
			this.showActive = this.showActive.bind(this);

			window.addEventListener('load', () => {
				this.showProjectList();
				this.showActive();
			});
		}

		// update Project List in the sidebar
		showProjectList() {
			this.model.findProjects((data, activeId) => {
				this.projectList.innerHTML = this.view.compileProjects(data, activeId);
			});
		}

		//add a new project
		addProject(name) {
			this.model.createProject(name, (data, id) => {
				this.setActiveId(id);
			});
		}

		setActiveId(id) {
			this.model.setActiveId(id, data => {
				this.showActive();
				this.projectList.innerHTML = this.view.compileProjects(data, id);
			});
		}

		// show all tasks in a particular project
		showAll() {
			this.model.find(store => {
				let data = store.tasks;
				this.taskList.innerHTML = this.view.compile(data);
				this.model.findAll(data => {
					this.summary.innerHTML = this.view.compileTaskCount(data);
				});
			});
		}

		// show only completed tasks in the project
		showCompleted() {
			this.model.findTasks({ completed: true }, data => {
				this.taskList.innerHTML = this.view.compile(data);
			});
		}

		// show tasks that occur today
		showActive() {
			this.model.findTasks({ completed: false }, data => {
				let filtered = data.filter(task => {
					const today = new Date();
					let taskDate = new Date(task.date);
					return (
						taskDate.getDate() == today.getDate() &&
						taskDate.getMonth() == today.getMonth() &&
						taskDate.getFullYear() == today.getFullYear()
					);
				});

				this.taskList.innerHTML = this.view.compile(filtered);
				this.model.findAll(data => {
					this.summary.innerHTML = this.view.compileTaskCount(data);
				});
			});
		}

		// toggle tasks completion
		toggleComplete(id, checkbox) {
			let completed = checkbox.checked ? true : false;

			this.model.save(id, { completed: completed }, () => {
				this.showAll();
			});
		}

		//create tasks
		createTask(task) {
			this.model.save(task, task => {
				// console.log(task);
				this.showAll();
				chrome.runtime.sendMessage({ setAlarm: true, task });
			});
		}
	}

	window.app.Controller = Controller;
})(window);
