import { xhrIntercept } from "./xhrIntercept";
import { LnPost, LnPosts } from "./post"
import { jsonParseResponse, mapCat } from "./utils";
import { domListenNewNodes, domNewElem, domNewElements } from "./domObserver";
import { makeDownloadButton } from "./downloadButton";
import { downloadUrl } from "./downloader";

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

let posts: Map<string, HTMLCollection> = new Map(); 

// get the first posts from dom and add button 


// get posts that come with 'updateV2' from dom, using 'mutationObserver', and then add the button 
domNewElem(document, "scaffold-finite-scroll__content")
// on feed
.then((feed) => {
	// listen for new nodes
	domListenNewNodes(feed, (elements) => {
		// add button
		elements
		.map((e) => ({post: e, urn: e.attributes.getNamedItem("data-id")?.textContent}))	// get urn and put into object
		.filter((e) => (e.urn && e.urn.startsWith("urn:li:activity:")))						// filter out non posts
		.map((post) => {																	// find bottom bar to insert button
			let bottomBar = domNewElements(post.post, "feed-shared-social-action-bar");		// listen for botton buttons to render 
			return {
				post: post.post,
				urn: post.urn!,
				bottomBar: bottomBar
			};
		})
		.forEach((post) => {																// for each post
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
})