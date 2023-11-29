import IconLight from './downloadLight.svg';
import IconDark from './downloadDark.svg';

// theme
enum Theme{
	light,
	dark
};

// generate button
export function makeDownloadButton(onClick: (ev: MouseEvent) => any) : HTMLElement{

	// theme
	var theme: Theme = Theme.light;

	if(document.getElementsByTagName("html").item(0)?.classList.contains("theme--dark")){
		theme = Theme.dark;
	}

	// make divs
	var div = document.createElement("div");
	div.classList.add('feed-shared-social-action-bar__action-button');
	
	var span = document.createElement("span");
	span.classList.add('artdeco-hoverable-trigger', 'artdeco-hoverable-trigger--content-placed-top', 'artdeco-hoverable-trigger--is-hoverable', 'ember-view');

	var button = document.createElement("button");
	button.classList.add(
		'social-actions-button',
		'artdeco-button',
		'artdeco-button--4',
		'artdeco-button--tertiary',
		'flex-wrap',
		'artdeco-button--muted'
	);
	
	button.onclick = onClick; 

	// icons
	var svg = document.createElement('img');
	svg.width = 24;
	svg.height = 24;
	svg.classList.add("extensionDownloadIcon");
	// switch(theme){
	// 	case Theme.light:
	// 		console.log(IconLight);
	// 		svg.src = IconLight;
	// 		break;
			
	// 		case Theme.dark:
	// 		console.log(IconDark);
	// 		svg.src = IconDark;
	// 		break;
	// }
	svg.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"1em\" viewBox=\"0 0 512 512\"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d=\"M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z\"/></svg>";

	var text = document.createElement("span");
	text.classList.add('artdeco-button__text');
	text.textContent = "Download";

	// build
	div.appendChild(span);
	span.appendChild(button);
	button.appendChild(svg);
	button.appendChild(text);
	
	return div;
}