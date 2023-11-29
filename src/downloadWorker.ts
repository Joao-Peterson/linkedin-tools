import { LnPost } from "./post";

chrome.runtime.onStartup.addListener(() => {
	// console.log("[Downloader startup!]");
});

chrome.runtime.onInstalled.addListener((details) => {
	// console.log("[Downloader installed!]");
});

// downloader
chrome.runtime.onMessage.addListener((download : LnPost) => {	
	download.files.forEach((file) => {
		chrome.downloads.download({
			url: file.url,
			filename: file.name,
			method: "GET",
			conflictAction: "prompt",
			saveAs: true
		});
	})
});