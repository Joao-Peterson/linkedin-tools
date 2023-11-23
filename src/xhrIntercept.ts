export function xhrIntercept(urlFilter: RegExp, callback: (response: object) => void){
	const xhrOpen = XMLHttpRequest.prototype.open as ((method: string, requestUrl: string | URL) => void);

	XMLHttpRequest.prototype.open = function (method: string, requestUrl: string | URL){
		if(urlFilter.test(requestUrl.toString())){
			const xhrSend = this.send;
			
			this.send = function (body?: Document | XMLHttpRequestBodyInit | null){
				const xhrOnreadystatechange = this.onreadystatechange;

				// override onreadystatechange
				this.onreadystatechange = async function (ev: Event){
					const { readyState, response, responseType } = this;

					// if ok and response text
					if(readyState === XMLHttpRequest.DONE && response){
						try {
							let json: object;
							// call with response
							switch(responseType){
								case "":
								case "text":
									json = JSON.parse(response as string);
									if(!json)
										throw `xhrIntercept: Response was '${responseType}' but could not be parsed as json`;
									break;
									
								case "json":
									json = response;
									if(!json)
										throw `xhrIntercept: Response was '${responseType}' but not a valid one`;
								break;

								case "blob":
									json = JSON.parse(await (response as Blob).text());
									if(!json)
										throw `xhrIntercept: Response was '${responseType}' but could not be parsed as json`;
								break;

								case "arraybuffer":
									json = JSON.parse(new TextDecoder('UTF8').decode(response as ArrayBuffer));
									if(!json)
										throw `xhrIntercept: Response was '${responseType}' but could not be parsed as json`;
								break;

								default:
								case "document":
									throw `xhrIntercept: Response was '${responseType}'. Don't now how to read that json`;
								break;									
							}			
							
							callback(json);

						} catch (error) {
							var msg = "";
							if(error instanceof Error)
								msg = error.message;
							else if(typeof error === "string")
								msg = error;

							console.error("Erro calling callback in xhrIntercept: " + msg);
						}
					}

					return xhrOnreadystatechange?.apply(this, [ev]);
				}

				return xhrSend?.apply(this, [body]);
			}
		}

		return xhrOpen.apply(this, [method, requestUrl]);
	}
}