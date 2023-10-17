"use strict";
/* --------------------------------------------- Types -------------------------------------------- */
// theme type 
var Theme;
(function (Theme) {
    Theme[Theme["light"] = 0] = "light";
    Theme[Theme["dark"] = 1] = "dark";
})(Theme || (Theme = {}));
;
/* --------------------------------------------- Globals -------------------------------------------- */
// theme
var htmlTag = document.querySelector('html');
var theme = Theme.light;
if (htmlTag.classList.contains("theme--dark")) {
    theme = Theme.dark;
}
/* --------------------------------------------- Functions -------------------------------------------- */
// JSON.parse(document.querySelector('iframe~code').textContent).included[69].content.document.transcribedDocumentUrl
// download article as pdf
function downloadArticle() {
    var sources = document.querySelectorAll('code');
    var includedData;
    sources.forEach((code) => {
        if (code.id.includes('datalet'))
            return;
        if (!code.textContent)
            return;
        if (!code.textContent.includes('feedshare-document-url-metadata-scrapper-pdf'))
            return;
        includedData = JSON.parse(code.textContent);
    });
    if (!includedData || !includedData.included)
        throw new Error("[ArticlePost]: could not parse document includedData as json");
    var doc;
    for (let i = 0; i < includedData.included.length; i++) {
        var type = includedData?.included[i]?.content?.$type;
        if (!type)
            continue;
        if (!type.includes('DocumentComponent'))
            continue;
        doc = includedData?.included[i]?.content?.document;
    }
    if (!doc || !doc.transcribedDocumentUrl || !doc.title)
        throw new Error("[ArticlePost]: error trying to read 'document' data in includedData json");
    var download = {
        type: "article",
        urls: [{
                name: doc.title + '.pdf',
                url: doc.transcribedDocumentUrl
            }]
    };
    console.log(`downloading request: ${download}`);
    chrome.runtime.sendMessage(download).then((value) => console.log(`downloaded: ${value}`)).catch((err) => console.log(`error downloading: ${err}`));
}
// try and get post
function downloadPost() {
    var article = document.querySelector('iframe');
    if (article) {
        downloadArticle();
        return;
    }
}
// Download button callback
function onDownloadPost(ev) {
    try {
        downloadPost();
    }
    catch (error) {
        console.log(error);
    }
}
// generate button
function makeDownloadButton() {
    var div = document.createElement("div");
    div.classList.add('feed-shared-social-action-bar__action-button');
    var span = document.createElement("span");
    div.classList.add('artdeco-hoverable-trigger', 'artdeco-hoverable-trigger--content-placed-top', 'artdeco-hoverable-trigger--is-hoverable', 'ember-view');
    var button = document.createElement("button");
    button.classList.add('social-actions-button', 'artdeco-button', 'artdeco-button--4', 'artdeco-button--tertiary', 'flex-wrap', 'artdeco-button--muted');
    button.onclick = onDownloadPost;
    var svg = document.createElement('img');
    svg.width = 24;
    svg.height = 24;
    svg.classList.add("extensionDownloadIcon");
    switch (theme) {
        case Theme.light:
            svg.src = chrome.runtime.getURL("images/downloadLight.svg");
            break;
        case Theme.dark:
            svg.src = chrome.runtime.getURL("images/downloadDark.svg");
            break;
    }
    var text = document.createElement("span");
    text.classList.add('artdeco-button__text');
    text.textContent = "Download";
    div.appendChild(span);
    span.appendChild(button);
    button.appendChild(svg);
    button.appendChild(text);
    return div;
}
/* --------------------------------------------- Main Script -------------------------------------------- */
// get share button
var shareBtn = document.querySelectorAll('div.feed-shared-social-action-bar__action-button');
if (!shareBtn) {
    console.log('could not find share button to append the download button next to');
}
// append download button
var button = makeDownloadButton();
shareBtn.item(shareBtn.length - 1).insertAdjacentElement("afterend", button);
//# sourceMappingURL=download.js.map