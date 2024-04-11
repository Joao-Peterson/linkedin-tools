import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
import { downloadBlob, downloadUrl } from "./download";
import { uid } from "./uid";

// remote file
export interface RemoteFile{
	name: string;
	url: string;
}

// download type 
export enum downloadOptions{
	none = -1,
    unknown = 0,
    openExternal,
    text,
	textReshared,
    image,
    files,
    video,
    article,
    pollData
} 

// post class
export class LnPost{
	public author: string;
	public urn: string;
	public files: RemoteFile[] = [];
	public pollData?: string;
	public text?: string | undefined;
	public externalUrl?: string;
	public resharedEntityUrn?: string;
	public downloadType: downloadOptions = downloadOptions.none;
	
	public include: any;
	
	// constructor
	constructor(include: any){
		this.include = include;
		let author = include?.actor?.name?.text ?? "Unknown";
		
		this.author = author;
		this.urn = include?.updateMetadata?.urn ?? include?.metadata?.backendUrn;

		this.text = this.getText();
		let resharedEntityUrnRaw = include?.['*resharedUpdate'];
		let resharedEntityUrn: string | undefined | null = resharedEntityUrnRaw;
		resharedEntityUrn = resharedEntityUrn?.match(/(urn:li:activity:\d{19})/)?.at(1);
		this.resharedEntityUrn = resharedEntityUrn ? resharedEntityUrn: undefined
	}

	// download this post, or other posts in case we have reposted content
	public async fetchContent(option: downloadOptions, postsRefLookup: Map<string, LnPost>): Promise<{name: string; data: Blob}>{
		let post: LnPost = this;
		if(post.resharedEntityUrn){
			let ext = postsRefLookup.get(post.resharedEntityUrn);
			if(ext)
				post = ext;
		}
		
		switch(option){
			// download files from any file related 'downloadOptions'
			default:
				if(post.files.length == 1){
					let blob = await fetch(post.files[0].url).then(res => res.blob());
					return {
						name: post.files[0].name,
						data: blob
					};
				}
				else if(post.files.length > 1){
					// map all files to fetch promises and await all
					let zip = await Promise.all(this.files.map((file) => 
						fetch(file.url)
						// get blob
						.then((res) => res.blob())
						// return blob with name
						.then((blob) => ({name: file.name, blob: blob}))
					))
					// write zip
					.then((files) => {
						const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
		
						files.forEach((file) => {
							zipWriter.add(file.name, new BlobReader(file.blob));
						});
		
						// return zip blob
						return zipWriter.close();
					});

					return {
						name: post.uniqueName() + ".zip",
						data: zip
					};
				}
			break;

			// poll data as file
			case downloadOptions.pollData:
				if(!post.pollData) break;
				let data = new Blob([post.pollData], {type: "text/plain"});
				return {
					name: post.uniqueName() + ".txt",
					data: data
				};
			break;
				
			// the post text
			case downloadOptions.text:
				if(!this.text) break;
				let text = new Blob([this.text], {type: "text/plain"});
				return {
					name: this.uniqueName() + ".txt",
					data: text
				};
			break;
			
			// the reshared post text
			case downloadOptions.textReshared:
				if(!post.text) break;
				let rtext = new Blob([ post.text], {type: "text/plain"});
				return {
					name: post.uniqueName() + ".txt",
					data: rtext
				};
			break;
					
			// invalid cases
			case downloadOptions.openExternal:
			case downloadOptions.none:
			break;
		}
		
		throw new Error("Invalid fetch option");
	}

	// parse linkedin manifest and decode to posts
	public static parseLinkedinUpdate(LnUpdate: any): Array<{urn: string, post: LnPost}>{
		if(!(LnUpdate?.included)) throw new Error("No included update");

		let posts: Array<{urn: string, post: LnPost}> = [];

		for(var include of LnUpdate.included){
			// grab content type
			let includeType: string | null | undefined = include?.$type;
			if(!includeType) continue;
			let contentType: string | null | undefined;

			try{	
				switch(includeType){
					// updates
					case "com.linkedin.voyager.dash.feed.Update":
					case "com.linkedin.voyager.feed.render.UpdateV2":
						// content
						contentType = include?.content?.$type;
						// else grab carousel type
						if(!contentType)
							contentType = include?.carouselContent?.$type;
						
						// else grab lead
						if(!contentType)
							contentType = include?.leadGenFormContentV2?.$type;
						
						// else, suggested (aggregatedContent)
						if(!contentType)
							contentType = include?.aggregatedContent?.$type;
						
						// else, documentComponent
						if(!contentType)
							contentType = include?.content?.documentComponent?.$type;
						
						// else, just the text
						if(!contentType)
							contentType = include?.commentary?.$type;
						

						// urn
						let urn: string;
						urn = include?.updateMetadata?.urn;
						if(!urn)
							urn = include?.metadata?.backendUrn;
						if(!urn)
							continue;

						let post: LnPost | undefined;

						switch(contentType){
							// video
							case "com.linkedin.voyager.feed.render.LinkedInVideoComponent":
								post = new LnVideo(include, LnUpdate.included);
							break;
		
							// carousel
							case "com.linkedin.voyager.feed.render.CarouselContent":
								post = new LnCarousel(include);
							break;	
		
							// images
							case "com.linkedin.voyager.feed.render.ImageComponent":
								post = new LnImages(include);
							break;							
		
							// image
							case "com.linkedin.voyager.feed.render.ArticleComponent":
							// celebration, new jobs (celebration)
							case "com.linkedin.voyager.feed.render.CelebrationComponent":
							// promoted content
							case "com.linkedin.voyager.feed.render.PromoComponent":
								post = new LnImage(include);
							break;							
		
							// banner (event)
							case "com.linkedin.voyager.feed.render.EventComponent":
								post = new LnEvent(include);
							break;							
		
							// documents
							case "com.linkedin.voyager.feed.render.DocumentComponent":
							case "com.linkedin.voyager.dash.feed.component.document.DocumentComponent":
								post = new LnDocument(include);
							break;							

							// text
							case "com.linkedin.voyager.feed.render.TextComponent":
								post = new LnPost(include);
							break;
		
							// lead
							case "com.linkedin.voyager.feed.render.LeadGenFormContentV2":
								post = new LnLead(include);
							break;
		
							// job offer (entity component)
							case "com.linkedin.voyager.feed.render.EntityComponent":
								post = new LnPost(include);
							break;

							// youtube (ExternalVideoComponent)
							case "com.linkedin.voyager.feed.render.ExternalVideoComponent":
							// expert answers (conversation)
							case "com.linkedin.voyager.feed.render.ConversationsComponent":
								post = new LnExternal(include);
							break;
				
							// poll
							case "com.linkedin.voyager.feed.render.PollComponent":
								post = new LnPoll(include, LnUpdate.included);
							break;
				
							// suggested / promoted
							case "com.linkedin.voyager.feed.render.FeedDiscoveryEntityComponent":
							case "com.linkedin.voyager.feed.render.AggregatedContent":
							case "com.linkedin.voyager.feed.render.AnnouncementComponent":
							break;
							
							// unknown
							default:
								console.debug(`Linkedin Tools: Could not parse content type '${contentType}', entityUrn: '${include?.entityUrn}'`);
							break;
						}

						if(post)
							posts.push({urn, post});

						break;
							
					default:
						console.debug(`Linkedin Tools: Ignoring parse of type '${includeType}', entityUrn: '${include?.entityUrn}'`);
					break;	
				}
			}
			catch(e){
				throw new Error(`Linkedin Tools: Could not parse include type '${includeType}', entityUrn: '${include?.entityUrn}'. ` + e);
			}
		}

		return posts;
	}

	protected uniqueName(): string{
		return camelcase(this.author) + "-" + uid(10);
	}

	protected getText(): string | undefined{
		let text: string | null | undefined = this.include?.commentary?.text?.text; 
		return typeof text === "string" ? text : undefined;
	} 
}

// carousel
export class LnCarousel extends LnPost{
	
	constructor(include: any){		
		super(include);

		for(var image of include?.carouselContent?.items){
			if(!image) continue;

			let root: string | null | undefined = image?.content?.image?.attributes[0]?.vectorImage?.rootUrl; 
			let segment: string | null | undefined = image?.content?.image?.attributes[0]?.vectorImage?.artifacts[0]?.fileIdentifyingUrlPathSegment; 
			if(!root || !segment) continue;
			
			this.files.push({
				name: this.uniqueName(),
				url: root + segment
			});
		}

		if(this.files.length == 1)
			this.downloadType = downloadOptions.image;
		else
			this.downloadType = downloadOptions.files;
	}
}

// images
export class LnImages extends LnPost{
	
	constructor(include: any){		
		super(include);

		for(var image of include?.content?.images){
			if(!image) continue;

			let root: string | null | undefined = image?.attributes[0]?.vectorImage?.rootUrl; 
			let segment: string | null | undefined = image?.attributes[0]?.vectorImage?.artifacts[0]?.fileIdentifyingUrlPathSegment; 
			if(!root || !segment) continue;

			this.files.push({
				name: this.uniqueName() + ".png",
				url: root + segment
			});
		}

		if(this.files.length == 1)
			this.downloadType = downloadOptions.image;
		else
			this.downloadType = downloadOptions.files;
	}
}

// image
export class LnImage extends LnPost{

	constructor(include: any){
		super(include);
		this.downloadType = downloadOptions.image;

		let root: string | null | undefined = include?.content?.largeImage?.attributes[0]?.vectorImage?.rootUrl; 
		let segment: string | null | undefined = include?.content?.largeImage?.attributes[0]?.vectorImage?.artifacts[0]?.fileIdentifyingUrlPathSegment; 
		let url: string | null | undefined;

		if(!root || !segment)
			url = include?.content?.image?.attributes[0]?.imageUrl;
		else
			url = root + segment;
		
		if(!url)
			return;

		this.files.push({
			name: this.uniqueName() + ".png",
			url: url
		});
	}
}

// banner (event)
export class LnEvent extends LnPost{

	constructor(include: any){
		super(include);
		this.downloadType = downloadOptions.image;

		let root: string | null | undefined = include?.content?.banner?.attributes[0]?.vectorImage?.rootUrl; 
		let segment: string | null | undefined = include?.content?.banner?.attributes[0]?.vectorImage?.artifacts[0]?.fileIdentifyingUrlPathSegment; 

		if(!root || !segment)
			return;

		this.files.push({
			name: this.uniqueName(),
			url: root + segment
		});
	}
}

// poll
export class LnPoll extends LnPost{

	constructor(include: any, included: any){
		super(include);
		this.downloadType = downloadOptions.pollData;

		let summary: string | null | undefined = include?.content?.['*pollSummary']; 
		let question: string | null | undefined = include?.content?.question?.text; 
		let options: any[] | null | undefined = include?.content?.pollOptions;

		if(!question || !options || !summary) return;

		let questionsArr: string[] = [];
		for(let opt of options){
			if(typeof opt?.option?.text === "string")
				questionsArr.push(opt?.option?.text);
		}

		let votes: number;
		let poll: string = question + "\n\n";

		for(let inc of included){
			if(inc?.entityUrn === summary){
				let summaries = inc?.pollOptionSummaries;
				votes = inc?.uniqueVotersCount;

				poll += `Total votes: ${votes}\n\n`;
				
				for(let i = 0; i < questionsArr.length; i ++){
					let vote = summaries[i].voteCount;
					let percent = votes/vote*100
					poll += `'${questionsArr[i]}': ${percent.toFixed(2)}%. Votes: ${vote}\n`
				}

				break;
			}
		}

		this.pollData = poll;
	}
}

// lead
export class LnLead extends LnPost{

	constructor(include: any){
		super(include);
		this.downloadType = downloadOptions.unknown;

		let root: string | null | undefined = include?.leadGenFormContentV2?.content?.largeImage?.attributes[0]?.vectorImage?.rootUrl; 
		let segment: string | null | undefined = include?.leadGenFormContentV2?.content?.largeImage?.attributes[0]?.vectorImage?.artifacts[0]?.fileIdentifyingUrlPathSegment; 
		
		if(!root || !segment){
			root = include?.content?.largeImage?.attributes[0]?.vectorImage?.rootUrl;
			segment = include?.content?.largeImage?.attributes[0]?.vectorImage?.artifacts[0]?.fileIdentifyingUrlPathSegment; 
		}
		
		if(!root || !segment)
			return;
		
		if(!this.text)
			this.text = include?.leadGenFormContentV2?.content?.commentary?.text?.text;
		
		this.files.push({
			name: this.uniqueName(),
			url: root + segment
		});
	}
}

// article pdf like
export class LnDocument extends LnPost{
	constructor(include: any){
		super(include);
		this.downloadType = downloadOptions.article;

		let url = include?.content?.document?.transcribedDocumentUrl ?? include?.content?.documentComponent?.document?.transcribedDocumentUrl;
		let title = include?.content?.document?.title ?? include?.content?.documentComponent?.document?.title;

		if(!url || ! title)
			return;

		this.files.push({
			name: title,
			url: url
		});
	}
}

// video
export class LnVideo extends LnPost{
	constructor(include: any, included: any){
		super(include);
		
		let metadata = include?.content?.['*videoPlayMetadata'];

		for(let inc of included){
			let type: string | undefined | null = inc.$type;
			if(!type) continue;

			if(type.includes("com.linkedin.videocontent.VideoPlayMetadata")){
				let media: string | undefined | null = inc?.media;
				if(!media) continue;

				if(media != metadata) continue;

				let url = inc?.progressiveStreams[0]?.streamingLocations[0]?.url;
				if(!url) continue;

				this.files.push({
					name: this.uniqueName() + ".mp4",
					url: url
				})

				break;
			}
		}

		if(this.files.length == 1)
			this.downloadType = downloadOptions.video;
		else
			this.downloadType = downloadOptions.files;
	}
}

// external
export class LnExternal extends LnPost{
	constructor(include: any){
		super(include);
		this.downloadType = downloadOptions.openExternal;

		let provider: string | undefined | null = include?.content?.provider;
		let source: string | undefined | null = include?.content?.navigationContext?.actionTarget;

		if(!provider || !source)
			return;

		this.externalUrl = source;
	}
}

function camelcase(str: string) {
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
		return index === 0 ? word.toLowerCase() : word.toUpperCase();
	}).replace(/\s+/g, '');
}

