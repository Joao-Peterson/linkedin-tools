import Menu from "./html/contextMenu.html";
import MenuItem from "./html/contextMenuItem.html";
import { uid } from "./uid";

export interface ContextMenuItem<T>{
	// bootstrap icon
	icon: string;
	// text icon
	text: string;
	// data to be passed to the callback
	data: T;
}

// all HTMLElementEventMap that are 'MouseEvent', so we can have 'e.pageX', 'e.pageY' and 'e.preventDefault()'
export type MouseEventsMap = {
	[K in keyof HTMLElementEventMap]: HTMLElementEventMap[K] extends MouseEvent ? K : never;
}[keyof HTMLElementEventMap];

// context menu class
export class ContextMenu<S, T>{

	// element id
	public id: string;
	public htmlId: string;
	
	// context menu element
	public menu: HTMLElement;
	
	// callback
	private callback: (source: S, option: T) => void;

	// items
	private _items: ContextMenuItem<T>[] = [];

	// who showed the menu last
	public origin?: S;

	// constructor
	constructor(callback: (source: S, option: T) => void, id?: string){
		this.id = id ?? uid(10);
		this.htmlId = this.id + "-context-menu";
		this.callback = callback;
		
		// template
		let html = Menu.replace(/{{id}}/g, this.id);

		// inject into DOM
		document.body.insertAdjacentHTML("beforeend", html);

		// save ref
		let menu = document.getElementById(this.htmlId);
		if(!menu) throw new Error("Could create ContextMenu element!");
		this.menu = menu;

		// hover out
		this.menu.addEventListener("mouseleave", ev => {
			this.hide();
		});

		this.hide();
	}
	
	// relates menu to element, so when we right click th element the menu shows up
	addMenuEventListener(element: HTMLElement, event: MouseEventsMap, callback: (event: MouseEvent) => void){
		element.addEventListener(event, (e) => {
			e.preventDefault();
			this.menu.style.left = e.pageX + "px";
			this.menu.style.top = e.pageY + "px";
			callback(e);
		});
	}

	// is hidden
	get hidden(): boolean {
		return this.menu.style.display == "none";
	}

	// hide menu
	hide(){
		this.menu.style.display = "none";
	}
	
	// show menu
	show(source: S){
		this.origin = source;
		this.menu.style.display = "block";
	}

	// sync array with list
	set items(value: ContextMenuItem<T>[]){
		this._items = value;
		
		// empty ul
		let ul = (this.menu.firstElementChild! as HTMLElement);
		ul.innerHTML = "";

		// add items
		for(let item of this._items){
			let itemHtml = MenuItem;
			itemHtml = itemHtml.replace(/{{icon}}/g, item.icon);
			itemHtml = itemHtml.replace(/{{text}}/g, item.text);
			ul.insertAdjacentHTML("beforeend", itemHtml);

			// add callback
			(ul.lastElementChild! as HTMLLIElement).addEventListener("click", ev => {
				if(this.origin){
					this.callback(this.origin, item.data);
				}
			});
		}
	}

	get items(){
		return this._items;
	}
}
