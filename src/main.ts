import "./webpackPublicPathSet";
import { LnCarousel, LnDocument, LnEvent, LnExternal, LnImage, LnImages, LnLead, LnPoll, LnPost, LnVideo, downloadOptions } from "./linkedin";
import { ContextMenu, ContextMenuItem } from "./contextMenu";
import downloadButton from './html/downloadButton.html';
import { downloadBlob } from "./download";

// global posts
let posts: Map<string, LnPost> = new Map();

// set of added buttons, to avoid duplication issues
let seenPosts = new Set<string>();

// set of context menus for the download buttons
let addedPostMenus = new Set<string>();

// inject xhrIntercept into DOM
const injected = document.createElement("script");
injected.src = chrome.runtime.getURL("xhrIntercept.js");
(document.head || document.documentElement).appendChild(injected);

// listen for injected 'window.postMessage' and forward to background
window.addEventListener("message", ev => {
    // receiving updates
    if(ev.data.interceptedUpdates){
        let data: Array<{urn: string, post: LnPost}> = LnPost.parseLinkedinUpdate(ev.data.interceptedUpdates);
        
        // store
        data.forEach(e => posts.set(e.urn, e.post));
    
        console.debug("Posts update update!");
        console.debug(posts);
    }
});

// bootstrap icons, had to inject it cause the content script one wasnt working
const bootstrap = document.createElement("link");
bootstrap.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
bootstrap.rel = 'stylesheet';
bootstrap.type = 'text/css';
(document.head || document.documentElement).appendChild(bootstrap);

const downloadOptionMenuItemMap: ContextMenuItem<downloadOptions>[] = [
    {icon: "bi-question", 				text: "Unknown file type",  data: downloadOptions.unknown		},
    {icon: "bi-box-arrow-up-right", 	text: "Open external",	    data: downloadOptions.openExternal  },
    {icon: "bi-blockquote-left", 		text: "Text",         	    data: downloadOptions.text          },
    {icon: "bi-blockquote-left", 		text: "Text (reshared)",    data: downloadOptions.textReshared  },
    {icon: "bi-image",           		text: "Image",        	    data: downloadOptions.image         },
    {icon: "bi-files",          		text: "Files",       	    data: downloadOptions.files         },
    {icon: "bi-film",            		text: "Video",        	    data: downloadOptions.video         },
    {icon: "bi-filetype-pdf",    		text: "Article",      	    data: downloadOptions.article       },
    {icon: "bi-ui-checks",       		text: "Poll results",    	data: downloadOptions.pollData      }
];

// enumerate download options for a given LnPost
function optionsOfPost(post: LnPost): ContextMenuItem<downloadOptions>[]{
    let items: ContextMenuItem<downloadOptions>[] = [];
    
    let refPost = post;

    // if reshared, get that post instead
    if(post.resharedEntityUrn){
        let ext = posts.get(post.resharedEntityUrn);
        if(ext)
            refPost = ext;
    }

    // get types
    if(refPost.downloadType != downloadOptions.none)
        items.push(downloadOptionMenuItemMap[refPost.downloadType]) 

    // text
    if(post.text)
        items.push(downloadOptionMenuItemMap[downloadOptions.text])
    
    // ref text
    if(post != refPost && refPost.text){
        items.push(downloadOptionMenuItemMap[downloadOptions.textReshared])
    }
    
    return items;
}

// https://stackoverflow.com/a/33248636
// wait for page load
document.addEventListener("DOMContentLoaded", () => { setTimeout(() => {
    // theme
    let darkTheme = false;
    if(document.getElementsByTagName("html").item(0)?.classList.contains("theme--dark"))
        darkTheme = true;

    // context menu
    let downloadMenu = new ContextMenu<string, downloadOptions>((source, option) => {
        // console.log(`Context from ${source.author}, data: ${downloadOptions[data]}`);
        const post = posts.get(source);
        if(post){
            document.body.style.cursor = "wait";
            post.fetchContent(option, posts)
            .then(blob => downloadBlob(blob.data, blob.name))
            .catch(err => console.warn(err))
            .finally(() => document.body.style.cursor = "auto");
        }
    });
    
    // scrape html 'code' tags for posts metadata
    for(let code of Array.from(document.getElementsByTagName('code'))){
        if(!code.id.startsWith('bpr-guid')) continue;
        if(!code.textContent) continue;
        
        try {
            let json = JSON.parse(code.textContent);
            let updates = LnPost.parseLinkedinUpdate(json);
            if(updates.length == 0) continue;
            // store
            updates.forEach(e => posts.set(e.urn, e.post));
            console.debug("Posts update!");
            console.debug(posts);

        }catch (e) {
            console.warn(`Linkedin Tools: Could not parse code tag '${code.id}'. ` + e);
        }
    }
    
    // add buttons to posts
    function addButtonsToElements(elements: Element[]){
        for(let post of elements){
            const urn = 																// get urn and put into object
                post.attributes.getNamedItem("data-id")?.textContent ?? 
                post.attributes.getNamedItem("data-urn")?.textContent;
    
            if(!urn || !urn.startsWith("urn:li:activity:")) continue;					// filter out non posts
    
            let divs = Array.from(post.getElementsByTagName("div"));					// find bottom bar to insert button
            for(let bar of divs){
                if(!bar.classList.contains("feed-shared-social-action-bar")) continue;
    
                if(seenPosts.has(urn)) return;											// check if added before
                seenPosts.add(urn);
        
                bar.insertAdjacentHTML("beforeend", downloadButton);					// add download button
                downloadMenu.addMenuEventListener(bar.lastElementChild! as HTMLElement, "click", ev => {
                    if(downloadMenu.hidden){
                        const post = posts.get(urn);
                        if(post){
                            downloadMenu.items = optionsOfPost(post);
                            downloadMenu.show(urn);
                        }
                    }
                })
            }
        }
    }
    
    // get main tag to access the post elements and inject our stuff
    let feed = document.getElementsByTagName('main').item(0);
    if(feed){
        // get the first posts from dom and add button 
        addButtonsToElements(Array.from(feed!.getElementsByTagName("div")));			// add buttons
    
        // get posts that come with 'updateV2' from dom, using 'mutationObserver', and then add the button 
        // listen for new nodes
        const feedObserver = new MutationObserver((mutations, observer) => {
    
            let divs = mutations.filter(m => m.type === "childList")					// mutation of added children
            .flatMap(m => Array.from(m.addedNodes))										// for each mutation record transform mutations into arrays, then flat them into a big array
            .filter(e => e instanceof Element)											// check for html element
            .map(e => e as Element);													// cast to html element
    
            addButtonsToElements(divs);													// add buttons
        });
    
        feedObserver.observe(feed, { 													// start observing
            childList: true,
            subtree: true
        });
    
        // context menu
    }
    
}, 500)});