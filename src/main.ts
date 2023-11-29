import { xhrIntercept } from "./xhrIntercept";
import { LnPost, LnPosts } from "./post"
import { jsonParseResponse, mapCat } from "./utils";
import { domListenNewNodes, domNewElem, domNewElements } from "./domObserver";
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

function addButton(post: HTMLElement){
	const buttonBar = post.getElementsByClassName("feed-shared-social-action-bar").item(0)
	if(buttonBar)
		console.log("buttonBarFunction");
}

let posts: Map<string, HTMLCollection> = new Map(); 

// listen for changes on dom
// grab feed
domNewElem(document, "scaffold-finite-scroll__content")
// on feed
.then((feed) => {
	// listen for new nodes
	domListenNewNodes(feed, (elements) => {
		elements
		.map((e) => ({post: e, urn: e.attributes.getNamedItem("data-id")?.textContent}))	// get urn and put into object
		.filter((e) => (e.urn && e.urn.startsWith("urn:li:activity:")))						// filter out non posts
		.map((post) => {																	// find bottom bar to insert button
			let bottomBar = domNewElements(post.post, "feed-shared-social-action-bar");		// listen for botton buttons to render 
			return Object.assign({}, post, {bottomBar: bottomBar});							// return new object
		})
		.map((e) => {console.log(`post on feed: ${e.urn}`); return e})
		.forEach((e) => {																	// for each post
			e.bottomBar.then((b) => {														// when bottom bar arrives
				console.log(`bottomBar.then ${e.urn}: ${b.at(0)}`);
				b.at(0)?.appendChild(makeDownloadButton(() => {								// add download button
					console.log(`click from ${e.urn}`);
				}));
			})
		});
	})
})