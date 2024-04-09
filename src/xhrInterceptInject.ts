// inject xhrIntercept into DOM
const element = document.createElement("script");
element.src = chrome.runtime.getURL("xhrIntercept.js");
(document.head || document.documentElement).appendChild(element);