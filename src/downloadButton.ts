import IconLight from './icons/downloadLight.svg';
import IconDark from './icons/downloadDark.svg';
import Button from './html/downloadButton.html';

// generate button
export function makeDownloadButton(darkTheme: boolean, onClick: () => void) : HTMLElement{

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
	if(darkTheme)
		svg.src = IconDark;
	else
		svg.src = IconLight;

	return button;
}