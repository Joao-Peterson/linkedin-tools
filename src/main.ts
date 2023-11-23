import { xhrIntercept } from "./xhrIntercept";
import { LnPost } from "./post"
import { jsonParseResponse } from "./utils";

let posts: LnPost[] = [];

// grab first posts from the html directly
addEventListener("DOMContentLoaded", () => {	
	for(let code of Array.from(document.getElementsByTagName('code'))){
		if(!code.id.startsWith('bpr-guid')) continue;
		if(!code.textContent) continue;
		
		try {
			let json = JSON.parse(code.textContent);
			console.log("DOM includes: " + json);
			let update = LnPost.parseLinkedinUpdate(json);
			if(update){
				posts = posts.concat(update);
				console.log(posts);
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
		console.log("UpdateV2 includes: " + json);
		let update = LnPost.parseLinkedinUpdate(json);
		if(update){
			posts = posts.concat(update);
			console.log(posts);
		}
	})
	.catch((e) => {
		console.warn("Linkedin Tools: " + e);
	});
});
