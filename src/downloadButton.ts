import IconLight from './downloadLight.svg';
import IconDark from './downloadDark.svg';

// theme
enum Theme{
	light,
	dark
};

// generate button
export function makeDownloadButton(onClick: () => void) : HTMLElement{

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
	// classes from other buttons
	button.classList.add(
		'social-actions-button',
		'artdeco-button',
		'artdeco-button--4',
		'artdeco-button--tertiary',
		'flex-wrap',
		'artdeco-button--muted'
	);
	
	button.onclick = () => {
		onClick();
	};

	// icons
	var svg = document.createElement('img');
	svg.width = 24;
	svg.height = 24;
	svg.classList.add("extensionDownloadIcon");
	switch(theme){
		case Theme.light:
			svg.src = IconLight;
			break;
			
			case Theme.dark:
			svg.src = IconDark;
			break;
	}

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