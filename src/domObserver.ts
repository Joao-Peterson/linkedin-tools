export function domListenNewNodes(rootNode: Node, callback: ((node: HTMLElement[]) => void)){
	const observer = new MutationObserver(function (mutations, observer){
		let elements = mutations
		.filter((m) => m.type === "childList")
		.flatMap((m) => Array.from(m.addedNodes))
		.filter((n) => n instanceof HTMLElement).map((n) => n as HTMLElement);

		if(elements.length > 0)
			callback(elements);
	});

	observer.observe(rootNode, { 
		childList: true,
		subtree: true
	});
}

export async function domWaitNewElements(rootNode: Node, classList: string): Promise<HTMLElement[]>{
	return new Promise((res, rej) => {
		const observer = new MutationObserver(function (mutations, observer){
			let nodes = mutations
				.filter((m) => m.type === "childList")
				.flatMap((m) => Array.from(m.addedNodes))
				.filter((n) => n instanceof HTMLElement).map((n) => n as HTMLElement)
				.filter((e) => e.classList.contains(classList));

			// return, otherwise continue
			if(nodes.length > 0){
				res(nodes);
				observer.disconnect();
			}
		});
	
		observer.observe(rootNode, { 
			childList: true,
			subtree: true
		});
	});
}

export async function domWaitNewElem(rootNode: Node, classList: string): Promise<HTMLElement>{
	return (await domWaitNewElements(rootNode, classList))[0];
}
