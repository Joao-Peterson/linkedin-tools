import "./webpackPublicPathSet";
import { LnPost } from "./linkedin";
import { makeDownloadButton } from "./downloadButton";

// inject xhrIntercept into DOM
const element = document.createElement("script");
element.src = chrome.runtime.getURL("xhrIntercept.js");
(document.head || document.documentElement).appendChild(element);

// global posts
let posts: Map<string, LnPost> = new Map();

// set of added buttons, to avoid duplication issues
let seenPosts = new Set();

// listen for injected 'window.postMessage' and forward to background
window.addEventListener("message", ev => {
	// receiving updates
	if(ev.data.interceptedUpdates){
		let data: Array<{urn: string, post: LnPost}> = ev.data.interceptedUpdates;
		
		// store
		data.forEach(e => posts.set(e.urn, e.post));
	
		console.debug("Posts update update!");
		console.debug(posts);
	}
});

// wait for page load
document.addEventListener("DOMContentLoaded", () => {
	// theme
	let darkTheme = false;
	if(document.getElementsByTagName("html").item(0)?.classList.contains("theme--dark"))
		darkTheme = true;;
	
	// scrape html 'code' tags for posts metadata
	for(let code of Array.from(document.getElementsByTagName('code'))){
		if(!code.id.startsWith('bpr-guid')) continue;
		if(!code.textContent) continue;
		
		try {
			let json = JSON.parse(code.textContent);
			let updates = LnPost.parseLinkedinUpdate(json);
			if(updates.length == 0) continue;
			// store
			updates.forEach(e => posts.set(e.urn, e.post));
			console.debug("Posts update!");
			console.debug(posts);

		}catch (e) {
			console.warn(`Linkedin Tools: Could not parse code tag '${code.id}'. ` + e);
		}
	}
	
	// add buttons to posts
	function addButtonsToElements(elements: Element[]){
		for(let post of elements){
			const urn = 																// get urn and put into object
				post.attributes.getNamedItem("data-id")?.textContent ?? 
				post.attributes.getNamedItem("data-urn")?.textContent;
	
			if(!urn || !urn.startsWith("urn:li:activity:")) continue;					// filter out non posts
	
			let divs = Array.from(post.getElementsByTagName("div"));					// find bottom bar to insert button
			for(let bar of divs){
				if(!bar.classList.contains("feed-shared-social-action-bar")) continue;
	
				if(seenPosts.has(urn)) return;											// check if added before
				seenPosts.add(urn);
		
				bar.appendChild(makeDownloadButton(darkTheme, () => {					// add download button
					console.debug(`click for ${urn}`);
	
	
	
					// const meta = postsMeta.get(post.urn);									// get meta info
					// if(meta){
					// 	meta.download(postsMeta)
					// 	.then(() => console.debug(`downloaded!`))
					// 	.catch((err) => console.error(`error downloading: ${err}`));
					// }
					// else{
					// 	console.error(`No reference for '${post.urn}' in 'updateV2' data`);
					// }
				}));
			}
		}
	}
	
	// get main tag to access the post elements and inject our stuff
	let feed = document.getElementsByTagName('main').item(0);
	if(feed){
		// get the first posts from dom and add button 
		addButtonsToElements(Array.from(feed!.getElementsByTagName("div")));			// add buttons
	
		// get posts that come with 'updateV2' from dom, using 'mutationObserver', and then add the button 
		// listen for new nodes
		const feedObserver = new MutationObserver((mutations, observer) => {
	
			let divs = mutations.filter(m => m.type === "childList")					// mutation of added children
			.flatMap(m => Array.from(m.addedNodes))										// for each mutation record transform mutations into arrays, then flat them into a big array
			.filter(e => e instanceof Element)											// check for html element
			.map(e => e as Element);													// cast to html element
	
			addButtonsToElements(divs);													// add buttons
		});
	
		feedObserver.observe(feed, { 													// start observing
			childList: true,
			subtree: true
		});
	
		// context menu
	}
});