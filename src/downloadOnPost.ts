// // get share button
// var shareBtn = document.getElementsByClassName('div.feed-shared-social-action-bar__action-button').item(0);

// if(!shareBtn){
// 	console.log('could not find share button to append the download button next to');
// }
// else{
// 	// append download button
// 	// var button = makeDownloadButton();
// 	// shareBtn.insertAdjacentElement("afterend", button);
// }

// /* --------------------------------------------- Functions -------------------------------------------- */

// // download article as pdf
// function downloadArticle(){
// 	var sources = document.querySelectorAll('code');
// 	var includedData : any;
	
// 	sources.forEach((code) => {
// 		if(code.id.includes('datalet')) return;
// 		if(!code.textContent) return;
// 		if(!code.textContent.includes('feedshare-document-url-metadata-scrapper-pdf')) return;

// 		includedData = JSON.parse(code.textContent);
// 	});

// 	if(!includedData || !includedData.included)
// 		throw new Error("[ArticlePost]: could not parse document includedData as json");
	
// 	var doc;

// 	for (let i = 0; i < includedData.included.length; i++) {
// 		var type : string | undefined | null = includedData?.included[i]?.content?.$type;
// 		if(!type) continue; 

// 		if(!type.includes('DocumentComponent')) continue;
		
// 		doc = includedData?.included[i]?.content?.document;
// 	}
		
// 	if(!doc || !doc.transcribedDocumentUrl || !doc.title)
// 		throw new Error("[ArticlePost]: error trying to read 'document' data in includedData json");

// 	// var download : Downloads =  {
// 	// 	type: "article",
// 	// 	urls: [{
// 	// 		name: doc.title + '.pdf',
// 	// 		url: doc.transcribedDocumentUrl
// 	// 	}]
// 	// };

// 	// console.log(`downloading request: ${download}`);
// 	// chrome.runtime.sendMessage(download).then((value) => console.log(`downloaded: ${value}`)).catch((err) => console.log(`error downloading: ${err}`));
// }

// // try and get post
// function downloadPost(){
// 	var article = document.querySelector('iframe');

// 	if(article){
// 		downloadArticle();
// 		return;
// 	}
// }

// // Download button callback
// function onDownloadPost(ev: MouseEvent) : any{
// 	try {
// 		downloadPost();
// 	} catch (error) {
// 		console.log(error);
// 	}
// }