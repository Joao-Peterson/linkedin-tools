"use strict";
/* --------------------------------------------- Main Script -------------------------------------------- */
// downloader
chrome.runtime.onMessage.addListener((downloads, sender, res) => {
    switch (downloads.type) {
        case DownloadType.article:
            downloads.urls.forEach((download) => {
                chrome.downloads.download({
                    url: download.url,
                    method: "GET",
                    filename: download.name,
                    // conflictAction: "prompt",
                    // saveAs: true
                }, (id) => {
                    console.log(`Downloaded file with id: ${id}`);
                });
                res();
            });
            break;
        default:
        case DownloadType.image:
        case DownloadType.video:
            console.log("This extension doesn't download image or video yet!");
            break;
    }
});
//# sourceMappingURL=service-worker.js.map