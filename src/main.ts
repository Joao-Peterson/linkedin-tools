import { xhrIntercept } from "./xhrIntercept";
import { LnPost, LnPosts } from "./post"
import { jsonParseResponse, mapCat } from "./utils";
import { domListenNewNodes, domWaitNewElements } from "./domObserver";
import { makeDownloadButton } from "./downloadButton";

// posts, global
let postsMeta: LnPosts = new Map();

// grab first posts from the html directly
addEventListener("DOMContentLoaded", () => {	
	for(let code of Array.from(document.getElementsByTagName('code'))){
		if(!code.id.startsWith('bpr-guid')) continue;
		if(!code.textContent) continue;
		
		try {
			let json = JSON.parse(code.textContent);
			// console.log("DOM includes: " + json);
			let update = LnPost.parseLinkedinUpdate(json);
			if(update){
				mapCat(postsMeta, update);
				console.debug(postsMeta);
			}		
		}
		catch (e) {
			console.warn(`Linkedin Tools: Could not parse code tag '${code.id}'. ` + e);
		}
	
	}
})

// intercept and parse linkedin 'updateV2' requests
xhrIntercept(/voyager\/api\/feed\/updatesV2/, (response, type) => {
	jsonParseResponse(response, type)
	.then((json) => {
		// console.log("UpdateV2 includes: " + json);
		let update = LnPost.parseLinkedinUpdate(json);
		if(update){
			mapCat(postsMeta, update);
			console.debug(postsMeta);
		}
	})
	.catch((e) => {
		console.warn("Linkedin Tools: " + e);
	});
});

let posts: Map<string, string> = new Map(); 

// get posts that come with 'updateV2' from dom, using 'mutationObserver', and then add the button 
domListenNewNodes(document, (nodes) => {
	// check feed
	// let feed = nodes.find((n) => n.classList.contains("scaffold-finite-scroll__content"));
	let feed = nodes.find((n) => n.tagName === "MAIN");
	if(!feed) return;

	// get the first posts from dom and add button 
	Array.from(feed.getElementsByTagName("div"))
	.map((e) => ({post: e, urn: e.attributes.getNamedItem("data-id")?.textContent ?? e.attributes.getNamedItem("data-urn")?.textContent})) // get urn and put into object
	.filter((e) => (e.urn && e.urn.startsWith("urn:li:activity:")))							// filter out non posts
	.map((post) => {																		// find bottom bar to insert button
		let bottomBar = post.post.getElementsByClassName("feed-shared-social-action-bar");	// get bottom buttons
		return {
			post: post.post,
			urn: post.urn!,
			bottomBar: bottomBar
		};
	})
	.forEach((post) => {																// for each post
		if(posts.get(post.urn)) return;													// check if exists

		posts.set(post.urn, post.urn);

		if(post.bottomBar && post.bottomBar.item(0)){									// when bottom bar
			post.bottomBar.item(0)!.appendChild(makeDownloadButton(() => {				// add download button
				const meta = postsMeta.get(post.urn);									// get meta info
				if(meta){
					meta.download(postsMeta)
					.then(() => console.debug(`downloaded!`))
					.catch((err) => console.error(`error downloading: ${err}`));
				}
				else{
					console.error(`No reference for '${post.urn}' in 'updateV2' data`);
				}
			}));
		}
	});

	// listen for new nodes
	domListenNewNodes(feed, (elements) => {
		// add button
		elements
		.map((e) => ({post: e, urn: e.attributes.getNamedItem("data-id")?.textContent ?? e.attributes.getNamedItem("data-urn")?.textContent}))	// get urn and put into object
		.filter((e) => (e.urn && e.urn.startsWith("urn:li:activity:")))						// filter out non posts
		.map((post) => {																	// find bottom bar to insert button
			let bottomBar = domWaitNewElements(post.post, "feed-shared-social-action-bar");		// listen for bottom buttons to render 
			return {
				post: post.post,
				urn: post.urn!,
				bottomBar: bottomBar
			};
		})
		.forEach((post) => {																// for each post
			if(posts.get(post.urn)) return;													// check if exists

			posts.set(post.urn, post.urn);	
			
			post.bottomBar.then((bottomBar) => {											// when bottom bar arrives
				bottomBar.at(0)?.appendChild(makeDownloadButton(() => {						// add download button
					const meta = postsMeta.get(post.urn);									// get meta info
					if(meta){
						meta.download(postsMeta)
						.then(() => console.debug(`downloaded!`))
						.catch((err) => console.error(`error downloading: ${err}`));
					}
					else{
						console.error(`No reference for '${post.urn}' in 'updateV2' data`);
					}
				}));
			})
		});
	})
});