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
				let id = data[0].id;
				this.projectList.innerHTML = this.view.compileProjects(data, id);
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
				this.showAll();
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
			this.showAll();
		}
	}

	window.app.Controller = Controller;
})(window);
