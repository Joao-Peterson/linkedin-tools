import { LnPost } from "./linkedin";

// global posts
let posts: Map<string, LnPost> = new Map();

// listen for other content scripts of the extension 
chrome.runtime.onMessage.addListener((msg, sender, res) => {
	// receiving updates
	if(msg.interceptedUpdates){
		let data: Array<{urn: string, post: LnPost}> = msg.interceptedUpdates;
		
		// store
		data.forEach(e => posts.set(e.urn, e.post));
	
		console.debug("Background worker update!");
		console.debug(posts);
	}

	// downloading stuff
	if(msg.download){
		
	}
})