chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.set;
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
