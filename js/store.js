(function(window) {
	let defaultCallback = function() {};

	class Store {
		constructor(name, callback = defaultCallback) {
			this.dbName = name;

			chrome.storage.local.get(name, function(store) {
				callback.call(this, store[name].projects);
			});
		}

		//save or update a task
		save(id, data, callback = defaultCallback) {
			chrome.storage.local.get(this.dbName, store => {
				let projects = store[this.dbName].projects;
				let activeId = store[this.dbName].activeId;
				let activeProject;

				for (let project of projects) {
					if (activeId == project.id) {
						activeProject = project;
						break;
					}
				}

				if (typeof id !== 'object') {
					let tasks = activeProject.tasks;
					for (let task of tasks) {
						if (task.id == id) {
							for (let x in data) {
								task[x] = data[x];
							}
							break;
						}
					}
				} else {
					callback = data;
					data = id;
					data.completed = false;
					data.id = Date.now();
					activeProject.tasks.push(data);
				}

				chrome.storage.local.set(store, () => {
					callback.call(this, data);
				});
			});
		}

		//find all tasks and project
		findAll(callback) {
			chrome.storage.local.get(this.dbName, store => {
				callback.call(this, store[this.dbName].projects);
			});
		}

		// find all tasks  available in the active Project if any or just return the tasks in the first project
		find(callback) {
			chrome.storage.local.get(this.dbName, store => {
				let projects = store[this.dbName].projects;
				let activeId = store[this.dbName].activeId;
				if (typeof activeId !== 'undefined') {
					for (let project of projects) {
						if (project.id == activeId) {
							return callback.call(this, project);
						}
					}
				}

				store[this.dbName].activeId = projects[0].id;

				chrome.storage.local.set(store, () => {
					callback.call(this, projects[0]);
				});
			});
		}

		findTasks(query, callback = defaultCallback) {
			if (!query) return;
			chrome.storage.local.get(this.dbName, store => {
				let projects = store[this.dbName].projects;
				let activeId = store[this.dbName].activeId;

				let activeProject = projects.find(p => p.id == activeId);

				let activeTasks = activeProject.tasks.filter(task => {
					for (let x in query) {
						return query[x] === task[x];
					}
				});

				callback.call(this, activeTasks);
			});
		}

		findProjects(callback = defaultCallback) {
			chrome.storage.local.get(this.dbName, store => {
				let projects = store[this.dbName].projects;
				let activeId = store[this.dbName].activeId;
				callback.call(this, projects, activeId);
			});
		}

		// save projects
		createProject(name, callback = defaultCallback) {
			chrome.storage.local.get(this.dbName, store => {
				let projects = store[this.dbName].projects;
				let data = {
					name,
					id: Date.now(),
					tasks: []
				};

				projects.push(data);
				chrome.storage.local.set(store, () => {
					callback.call(this, store[this.dbName].projects, data.id);
				});
			});
		}

		// sets the active Project Id

		setActiveId(id, callback = defaultCallback) {
			chrome.storage.local.get(this.dbName, store => {
				store[this.dbName].activeId = id;
				chrome.storage.local.set(store, () => {
					callback.call(this, store[this.dbName].projects);
				});
			});
		}

		//delete task
		remove(id, callback) {
			chrome.storage.local.get(this.dbName, store => {
				let projects = store[this.dbName].projects;
				let activeId = store[this.dbName].activeId;

				let activeProject;

				for (let project of projects) {
					if (project.id == activeId) {
						activeProject = project;
						break;
					}
				}

				let tasks = activeProject.tasks;
				tasks.forEach((task, i) => {
					if (task.id == id) {
						tasks.splice(i, 1);
					}
				});

				chrome.storage.local.set(store, () => {
					callback.call(this);
				});
			});
		}
	}

	window.app.Store = Store;
})(window);
