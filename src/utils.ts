export async function jsonParseResponse(response: any, type: XMLHttpRequestResponseType): Promise<object>{
	let json: object;
	// call with response
	switch(type){
		case "":
		case "text":
			json = JSON.parse(response as string);
			if(!json)
				throw `xhrIntercept: Response was '${type}' but could not be parsed as json`;
			break;
			
		case "json":
			json = response;
			if(!json)
				throw `xhrIntercept: Response was '${type}' but not a valid one`;
		break;

		case "blob":
			json = JSON.parse(await (response as Blob).text());
			if(!json)
				throw `xhrIntercept: Response was '${type}' but could not be parsed as json`;
		break;

		case "arraybuffer":
			json = JSON.parse(new TextDecoder('UTF8').decode(response as ArrayBuffer));
			if(!json)
				throw `xhrIntercept: Response was '${type}' but could not be parsed as json`;
		break;

		default:
		case "document":
			throw `xhrIntercept: Response was '${type}'. Don't now how to read that json`;
		break;									
	}	

	return json;
}

export function camelcase(str: string) {
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
		return index === 0 ? word.toLowerCase() : word.toUpperCase();
	}).replace(/\s+/g, '');
}