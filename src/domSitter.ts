import "./webpackPublicPathSet";
import { LnPost } from "./linkedin";
import { makeDownloadButton } from "./downloadButton";
import { Theme } from "./theme";

// scrape html 'code' tags for posts metadata
for(let code of Array.from(document.getElementsByTagName('code'))){
	if(!code.id.startsWith('bpr-guid')) continue;
	if(!code.textContent) continue;
	
	try {
		let json = JSON.parse(code.textContent);
		let updates = LnPost.parseLinkedinUpdate(json);
		if(updates.length == 0) continue;
		chrome.runtime.sendMessage({interceptedUpdates: updates}); // send out to extension content script
	}catch (e) {
		console.warn(`Linkedin Tools: Could not parse code tag '${code.id}'. ` + e);
	}
}

// // wait for new 'code' tags
// const observer = new MutationObserver((mutations, observer) => {

// 	let muts = mutations.filter(m => m.type === "childList")						// mutation of added children
// 	.flatMap(m => Array.from(m.addedNodes));										// for each mutation record transform mutations into arrays, then flat them into a big array

// 	for(let m of muts){
// 		if(!(m instanceof HTMLElement)) continue;									// check for html element
// 		let n = m as HTMLElement;													// cast to html element
// 		if(n.tagName !== "code") continue;											// only 'code' tags
// 		if(!n.id.startsWith('bpr-guid')) continue;									// id must start with 
// 		if(!n.textContent) continue;												// must have textContent
// 		let j = JSON.parse(n.textContent);											// parse json

// 		try{
// 			let posts = LnPost.parseLinkedinUpdate(j);								// decode posts
// 			if(posts.length > 0){
// 				console.debug("")
// 				chrome.runtime.sendMessage({interceptedUpdates: posts}); 				// send out to extension content script
// 			} 
// 		}
// 		catch(e){
// 			console.warn(`Linkedin Tools: Could not parse code tag '${n.id}'. ` + e);
// 		}
// 	}
// });

// observer.observe(document,{ 														// start observing
// 	childList: true,
// 	subtree: true
// });

// set of added buttons
let seenPosts = new Set();

// theme
let theme: Theme = Theme.light;
if(document.getElementsByTagName("html").item(0)?.classList.contains("theme--dark")){
	theme = Theme.dark;
}

// get main tag to access the post elements and inject our stuff
let feed = document.getElementsByTagName('main').item(0);
if(feed){
	console.debug("Got feed!")
	// get the first posts from dom and add button 
	Array.from(feed!.getElementsByTagName("div"))
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
	.forEach((post) => {																	// for each post
		console.debug("scrapped post from html!");

		if(seenPosts.has(post.urn)) return;													// check if adddd before
		seenPosts.add(post.urn);

		if(post.bottomBar && post.bottomBar.item(0)){										// when bottom bar
			post.bottomBar.item(0)!.
				appendChild(makeDownloadButton(theme, () => {					// add download button
				const urn = post.urn;														// get meta info
				console.debug(`click download for ${urn}`);
				
				// const meta = postsMeta.get(post.urn);										// get meta info
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
	});
	
	// get posts that come with 'updateV2' from dom, using 'mutationObserver', and then add the button 
	// listen for new nodes
	const feedObserver = new MutationObserver((mutations, observer) => {

		let muts = mutations.filter(m => m.type === "childList")					// mutation of added children
		.flatMap(m => Array.from(m.addedNodes));									// for each mutation record transform mutations into arrays, then flat them into a big array

		for(let n of muts){
			if(!(n instanceof HTMLElement)) continue;								// check for html element
			let post = n as HTMLElement;											// cast to html element
			const urn = 																// get urn and put into object
				post.attributes.getNamedItem("data-id")?.textContent ?? 
				post.attributes.getNamedItem("data-urn")?.textContent;

			if(!urn || !urn.startsWith("urn:li:activity:")) continue;				// filter out non posts

			let divs = Array.from(post.getElementsByTagName("div"));				// find bottom bar to insert button
			for(let bar of divs){
				if(!bar.classList.contains("feed-shared-social-action-bar")) continue;

				if(seenPosts.has(urn)) return;										// check if added before
				seenPosts.add(urn);
		
				bar.appendChild(makeDownloadButton(theme, () => {							// add download button
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
	});

	feedObserver.observe(feed, { 															// start observing
		childList: true,
		subtree: true
	});
}

