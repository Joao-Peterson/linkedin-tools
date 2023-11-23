const element = document.createElement("script");
element.src = chrome.runtime.getURL("bundle.js");
(document.head || document.documentElement).appendChild(element);