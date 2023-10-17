/* --------------------------------------------- Main Script -------------------------------------------- */

chrome.runtime.onStartup.addListener(() => {
	console.log("[Downloader startup!]");
});

chrome.runtime.onInstalled.addListener((details) => {
	console.log("[Downloader installed!]");
});

// downloader
chrome.runtime.onMessage.addListener((downloads : Downloads, sender, res) => {
	console.log(`downloading receive: ${downloads}`);

	switch(downloads.type){
		case "article":
			downloads.urls.forEach((download) => {
				chrome.downloads.download(
					{
						url: download.url,
						method: "GET",
						filename: download.name,
						conflictAction: "prompt",
						saveAs: true
					},
					(id) => {
						console.log(`Downloaded file with id: ${id}`);
					}
				);

				res();
			});
			break;
			
		default:
		case "image":
		case "video":
			console.log("This extension doesn't download image or video yet!");
			break;

	}
});