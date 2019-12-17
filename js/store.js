(function(window) {
	const projects = [
		{
			id: '1',
			name: 'Javascript',
			tasks: [
				{
					id: '1_1',
					title: 'Started Learning Javascript',
					date: new Date(),
					completed: true
				},
				{
					id: '1_2',
					title: 'Started Object Types in Javascript',
					date: new Date(),
					completed: false
				},
				{
					id: '1_3',
					title: 'Data Structure and Algorithm',
					date: new Date(),
					completed: false
				}
			]
		},
		{
			id: 2,
			name: 'Project Defense',
			tasks: [
				{
					id: '1_3',
					title: 'Data Structure and Algorithm',
					date: new Date(),
					completed: false
				}
			]
		},
		{
			id: 3,
			name: 'IT Defense',
			tasks: []
		}
	];

	let defaultCallback = function() {};

	class Store {
		constructor(name, callback = defaultCallback) {
			this.dbName = name;

			chrome.storage.sync.get(name, function(store) {
				if (name in store) {
					callback.call(this, store[name].projects);
				} else {
					store = {};
					store[name] = { projects: projects };
					chrome.storage.sync.set(store, function() {
						callback.call(this, store[name].projects);
					});
				}
			});
		}

		//save or update a task
		save(id, data, callback = defaultCallback) {
			chrome.storage.sync.get(this.dbName, store => {
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
					data = id;
					callback = data;
					data.id = Date.now();
					activeProject.tasks.push(data);
				}

				chrome.storage.sync.set(store, () => {
					callback.call(this);
				});
			});
		}

		//find all tasks and project
		findAll(callback) {
			chrome.storage.sync.get(this.dbName, store => {
				callback.call(this, store[this.dbName].projects);
			});
		}

		// find all tasks  available in the active Project if any or just return the tasks in the first project
		find(callback) {
			chrome.storage.sync.get(this.dbName, store => {
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

				chrome.storage.sync.set(store, () => {
					callback.call(this, projects[0]);
				});
			});
		}

		findTasks(query, callback = defaultCallback) {
			if (!query) return;
			chrome.storage.sync.get(this.dbName, store => {
				let projects = store[this.dbName].projects;

				let filtered = [];
				for (let project of projects) {
					let filteredTask = project.tasks.filter(task => {
						for (let x in query) {
							return query[x] === task[x];
						}
					});

					filtered = [...filtered, ...filteredTask];
				}

				callback.call(this, filtered);
			});
		}

		findProjects(callback = defaultCallback) {
			chrome.storage.sync.get(this.dbName, store => {
				let projects = store[this.dbName].projects;
				callback.call(this, projects);
			});
		}

		// save projects
		createProject(name, callback = defaultCallback) {
			chrome.storage.sync.get(this.dbName, store => {
				let projects = store[this.dbName].projects;
				let data = {
					name,
					id: Date.now(),
					tasks: []
				};

				projects.push(data);
				chrome.storage.sync.set(store, () => {
					callback.call(this, store[this.dbName].projects, data.id);
				});
			});
		}

		// sets the active Project Id

		setActiveId(id, callback = defaultCallback) {
			chrome.storage.sync.get(this.dbName, store => {
				store[this.dbName].activeId = id;
				chrome.storage.sync.set(store, () => {
					callback.call(this, store[this.dbName].projects);
				});
			});
		}
	}

	window.app.Store = Store;
})(window);
