import { LnPost } from "./linkedin";

// global posts
// let posts: Map<string, LnPost> = new Map();

// listen for injected 'window.postMessage' and forward to background
// window.addEventListener("message", ev => {
// 	// receiving updates
// 	if(ev.data.interceptedUpdates){
// 		let data: Array<{urn: string, post: LnPost}> = ev.data.interceptedUpdates;
		
// 		// store
// 		data.forEach(e => posts.set(e.urn, e.post));
	
// 		console.debug("Posts update update!");
// 		console.debug(posts);
// 	}

// 	// downloading stuff
// 	if(ev.data.download){
// 		let post = posts.get(ev.data.download);
// 		post?.download(posts);
// 	}

// 	// respond with download options
// 	if(ev.data.info){
		
// 	}
// });

// adapted from: https://github.com/mstfsnc/twitter-video-downloader-extension/blob/master/src/content/download.js
export async function downloadBlob(blob: Blob, name: string): Promise<void>{
	const element = document.createElement("a");
	element.style.display = "none";
	document.body.appendChild(element);
	element.href = window.URL.createObjectURL(blob);
	element.setAttribute("target", "_blank");
	element.setAttribute("download", `${name}`);
	element.click();

	window.URL.revokeObjectURL(element.href);
	document.body.removeChild(element);
}

export async function downloadUrl(url: string, name: string): Promise<void>{
	return fetch(url)
	.then((res) => res.blob())
	.then((blob) => downloadBlob(blob, name));
}
