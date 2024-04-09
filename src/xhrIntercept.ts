import { LnPost } from "./linkedin";

// intercept ajax calls
export function xhrIntercept(urlFilter: RegExp, callback: (response: any, type: XMLHttpRequestResponseType) => void){
	const xhrOpen = XMLHttpRequest.prototype.open as ((method: string, requestUrl: string | URL) => void);

	XMLHttpRequest.prototype.open = function (method: string, requestUrl: string | URL){
		if(urlFilter.test(requestUrl.toString())){
			const xhrSend = this.send;
			
			this.send = function (body?: Document | XMLHttpRequestBodyInit | null){
				const xhrOnreadystatechange = this.onreadystatechange;

				// override onreadystatechange
				this.onreadystatechange = function (ev: Event){
					const { readyState, response, responseType } = this;

					// if ok and response text
					if(readyState === XMLHttpRequest.DONE && response){
						callback(response, responseType);
					}

					return xhrOnreadystatechange?.apply(this, [ev]);
				}

				return xhrSend?.apply(this, [body]);
			}
		}

		return xhrOpen.apply(this, [method, requestUrl]);
	}
}

// parse http response: any acording to received type
export async function jsonParseResponse(response: any, type: XMLHttpRequestResponseType): Promise<object>{
	return new Promise(async (res, rej) => {
		let json: object | undefined = undefined;
		
		// call with response
		switch(type){
			case "":
			case "text":
				json = JSON.parse(response as string);
			break;
				
			case "json":
				json = response;
			break;
	
			case "blob":
				json = JSON.parse(await (response as Blob).text());
			break;
	
			case "arraybuffer":
				json = JSON.parse(new TextDecoder('UTF8').decode(response as ArrayBuffer));
			break;
			
			default:
			case "document":
				rej(`xhrIntercept: Response was '${type}'. Don't now how to read that json`);
				return;
		}	
		
		// return
		if(json)
			res(json);
		else
			rej(`xhrIntercept: Response was '${type}' but could not be parsed as json`);
	});
}

// intercept and parse linkedin 'updateV2' requests
xhrIntercept(/voyager\/api\/feed\/updatesV2/, (response, type) => {
	console.debug("UpdateV2 received!");
	jsonParseResponse(response, type)
	.then((json) => {
		try{
			let updates = LnPost.parseLinkedinUpdate(json);
			window.postMessage({interceptedUpdates: updates}); // send out to downloader content script
		}catch(error){
			console.warn(error);		
		}
	})
	.catch((e) => {
		console.warn("Linkedin Tools: " + e);
	});
});