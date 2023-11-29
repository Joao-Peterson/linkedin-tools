/* --------------------------------------------- Main Script -------------------------------------------- */

chrome.runtime.onStartup.addListener(() => {
	console.log("[Downloader startup!]");
});

chrome.runtime.onInstalled.addListener((details) => {
	console.log("[Downloader installed!]");
});

// downloader
chrome.runtime.onMessage.addListener((downloads : any, sender, res) => {	
});