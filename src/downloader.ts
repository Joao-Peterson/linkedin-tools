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
