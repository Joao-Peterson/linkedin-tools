export function xhrIntercept(urlFilter: RegExp, callback: (response: any) => void){
	const xhrOpen = XMLHttpRequest.prototype.open.prototype;

	XMLHttpRequest.prototype.open = function (method: string, requestUrl: string | URL){
		if(urlFilter.test(requestUrl.toString())){
			const xhrSend = this.send;
			
			this.send = function (body?: Document | XMLHttpRequestBodyInit | null){
				const xhrOnreadystatechange = this.onreadystatechange;

				// override onreadystatechange
				this.onreadystatechange = function (ev: Event){
					const { readyState, responseText } = this;

					// if ok and response text
					if(readyState === XMLHttpRequest.DONE && responseText){
						try {
							// call with response
							callback(JSON.parse(responseText));
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