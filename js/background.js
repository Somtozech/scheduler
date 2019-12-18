chrome.runtime.onInstalled.addListener(function() {
	const projects = [
		{
			name: 'Welcome to Scheduler',
			id: Date.now(),
			tasks: [
				{
					id: Date.now(),
					title: 'Create a new Project',
					completed: false,
					date: Date.now()
				}
			]
		}
	];
	let dbName = 'scheduler-list';

	chrome.storage.local.get(dbName, function(store) {
		if (!store[dbName]) {
			store = {};
			store[dbName] = { projects, activeId: projects[0].id };
			chrome.storage.local.set(store, function() {});
		}
	});
});
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// Send a message to the active tab
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
	});

	// chrome.windows.create({
	// 	url: chrome.runtime.getURL('index.html')
	// });
});

function showNotification(a) {
	let dbName = 'scheduler-list';
	chrome.storage.local.get(dbName, store => {
		let activeId = store[dbName].activeId;
		let projects = store[dbName].projects;

		let activeProject = projects.find(p => p.id == activeId);

		let task = activeProject.tasks.find(t => t.id == a);

		if ((task && task.completed) || !task) {
			chrome.alarms.clear(a);
		} else {
			chrome.notifications.create(
				String(task.id),
				{
					iconUrl: chrome.runtime.getURL('icon/icon.png'),
					title: 'Overdue',
					type: 'basic',
					message: `Time Scheduled For completion of '${task.title}' has passed. Completion overdue`
				},
				function(id) {
					toggleAlarmSound(a);
				}
			);
		}
	});
}
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
	if (msg.setAlarm) {
		let taskDate = new Date(msg.task.date).getTime();
		let nowsDate = new Date().getTime();
		let ms = taskDate - nowsDate;
		let min = parseInt(ms / 6e4);

		console.log(min);
		chrome.alarms.create(String(msg.task.id), { delayInMinutes: min + 1 });
	}
});

function toggleAlarmSound(a) {
	let audio = new Audio('tones/analog.mp3');
	a ? audio.play() : audio.pause();
}
// when there are alarms
chrome.alarms.onAlarm.addListener(function(a) {
	showNotification(a.name);
});
