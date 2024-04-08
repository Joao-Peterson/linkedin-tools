import { LnPost } from "./linkedin";

// inject xhrIntercept into DOM
const element = document.createElement("script");
element.src = chrome.runtime.getURL("xhrIntercept.js");
(document.head || document.documentElement).appendChild(element);

// listen for injected 'window.postMessage' and forward to background
window.addEventListener("message", ev => {
	if(!ev.data.interceptedUpdates) return;

	console.debug("From xhrIntercept");
	console.debug(ev.data);
	chrome.runtime.sendMessage(ev.data); // send to background worker
});