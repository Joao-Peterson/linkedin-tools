import { xhrIntercept } from "./xhrIntercept";
import "../css/style.css";

xhrIntercept(/voyager\/api\/feed\/updatesV2/, (response) => {
	console.log(response);
});
