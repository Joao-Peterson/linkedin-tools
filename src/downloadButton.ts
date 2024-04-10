import IconLight from './icons/downloadLight.svg';
import IconDark from './icons/downloadDark.svg';
import Button from './html/downloadButton.html';
import { ContextMenu } from './contextMenu';

// generate button
export function makeDownloadButton(darkTheme: boolean, menu: ContextMenu<string>) : HTMLElement{

	// create html button
	let temp = document.createElement('template');
	let html = Button.trim();
	temp.innerHTML = html;
	let button = temp.content.firstChild as HTMLElement;
	
	// add click
	// button.getElementsByTagName('button').item(0)!.onclick = () => {
	// 	onClick();
	// };

	// add context menu
	menu.addMenuEventListener(button, "click", ev => {
		if(menu.hidden){
			menu.items = [];
			


			menu.show();
		}
	});

	// icons
	let svg = button.getElementsByTagName('img').item(0)!;
	if(darkTheme)
		svg.src = IconDark;
	else
		svg.src = IconLight;

	return button;
}