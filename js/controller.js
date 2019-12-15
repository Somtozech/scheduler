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
				this.showAll();
			});
		}

		// update Project List in the sidebar
		showProjectList() {
			this.model.findProjects(data => {
				this.projectList.innerHTML = this.view.compileProjects(data);
			});
		}

		//add a new project
		addProject(name, cb) {
			this.model.createProject(name, (data, id) => {
				this.projectList.innerHTML = this.view.compileProjects(data, id);
			});
		}

		setActiveId(id) {
			this.model.setActiveId(id, () => {
				this.showAll();
				this.projectList.innerHTML = this.view.compileProjects(data, id);
			});
		}

		// show all tasks in a particular project
		showAll() {
			this.model.find(store => {
				let data = store.tasks;
				this.taskList.innerHTML = this.view.compile(data);
				this.summary.innerHTML = this.view.compileTaskCount(store);
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
			this.showAll();
		}
	}

	window.app.Controller = Controller;
})(window);
