// theme
enum Theme{
	light,
	dark
};

// generate button
function makeDownloadButton(onClick: (ev: MouseEvent) => any) : HTMLElement{

	// theme
	var theme: Theme = Theme.light;

	if(document.getElementsByTagName("html").item(0)?.classList.contains("theme--dark")){
		theme = Theme.dark;
	}

	// make divs
	var div = document.createElement("div");
	div.classList.add('feed-shared-social-action-bar__action-button');
	
	var span = document.createElement("span");
	div.classList.add('artdeco-hoverable-trigger', 'artdeco-hoverable-trigger--content-placed-top', 'artdeco-hoverable-trigger--is-hoverable', 'ember-view');

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
	switch(theme){
		case Theme.light:
			svg.src = chrome.runtime.getURL("images/downloadLight.svg");
			break;

		case Theme.dark:
			svg.src = chrome.runtime.getURL("images/downloadDark.svg");
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