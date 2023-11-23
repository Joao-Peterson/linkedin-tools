import { xhrIntercept } from "./xhrIntercept";

xhrIntercept(/voyager\/api\/feed\/updatesV2/, (response) => {
	console.log(response);
});
