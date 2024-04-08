import IconLight from './downloadLight.svg';
import IconDark from './downloadDark.svg';
import Button from './downloadButton.html';
import { Theme } from './theme';

// generate button
export function makeDownloadButton(theme: Theme, onClick: () => void) : HTMLElement{

	// create html button
	let temp = document.createElement('template');
	let html = Button.trim(); // Never return a space text node as a result
	temp.innerHTML = html;
	let button = temp.content.firstChild as HTMLElement;
	
	// add click
	button.getElementsByTagName('button').item(0)!.onclick = () => {
		onClick();
	};

	// icons
	let svg = button.getElementsByTagName('img').item(0)!;
	switch(theme){
		case Theme.light: svg.src = IconLight;
		break;
			
		case Theme.dark:  svg.src = IconDark;
		break;
	}

	return button;
}