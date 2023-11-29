import { camelcase } from "./utils"

// remote file
export interface RemoteFile{
	name: string;
	url: string;
}

// posts
export type LnPosts = Map<string, LnPost>; 

// post
export class LnPost{
	public author: string;
	public urn: string;
	public files: RemoteFile[] = [];
	public text?: string | undefined;
	public externalUrl?: string;
	public resharedEntityUrn?: string;

	public include: any;
	
	constructor(include: any){
		this.include = include;
		let author = include?.actor?.name?.text ?? "Unknown";
		
		this.author = author;
		this.urn = include.updateMetadata.urn;

		this.text = this.getText();
		let resharedEntityUrn = include?.['*resharedUpdate'];
		this.resharedEntityUrn = !resharedEntityUrn ? undefined : resharedEntityUrn;
	}

	public static parseLinkedinUpdate(LnUpdate: any): LnPosts | null{
		if(!(LnUpdate?.included)) return null;

		let posts: LnPosts = new Map();

		for(var include of LnUpdate.included){
			// grab content type
			let includeType: string | null | undefined = include?.$type;
			if(!includeType) continue;
			let contentType: string | null | undefined;

			try{	
				switch(includeType){
					// updates
					case "com.linkedin.voyager.feed.render.UpdateV2":
						// content
						contentType = include?.content?.$type;
						// else grab carousel type
						if(!contentType) contentType = include?.carouselContent?.$type;
						// else grab lead
						if(!contentType) contentType = include?.leadGenFormContentV2?.$type;
						// else, suggested (aggregatedContent)
						if(!contentType) contentType = include?.aggregatedContent?.$type;
						// else, just the text
						if(!contentType) contentType = include?.commentary?.$type;

						let urn = include?.updateMetadata?.urn;
						if(!urn){
							console.warn(`Linkedin Tools: Could not get urn for type '${contentType}'`);
							continue;
						}

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
								post = new LnImage(include);
							break;							
		
							// banner (event)
							case "com.linkedin.voyager.feed.render.EventComponent":
								post = new LnEvent(include);
							break;							
		
							// documents
							case "com.linkedin.voyager.feed.render.DocumentComponent":
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
								post = new LnExternal(include);
							break;
				
							// expert answers (conversation)
							case "com.linkedin.voyager.feed.render.ConversationsComponent":
								post = new LnExternal(include);
							break;
							
							// celebration, new jobs (celebration)
							case "com.linkedin.voyager.feed.render.CelebrationComponent":
								post = new LnImage(include);
							break;

							// promoted content
							case "com.linkedin.voyager.feed.render.PromoComponent":
								post = new LnImage(include);
							break;
				
							// suggested
							case "com.linkedin.voyager.feed.render.FeedDiscoveryEntityComponent":
							case "com.linkedin.voyager.feed.render.AggregatedContent":
							break;
							
							// unknown
							default:
								console.warn(`Linkedin Tools: Could not parse content type '${contentType}', entityUrn: '${include?.entityUrn}'`);
							break;
						}

						if(post)
							posts.set(urn, post);

						break;
							
					default:
						console.debug(`Linkedin Tools: Ignoring parse of type '${includeType}', entityUrn: '${include?.entityUrn}'`);
					break;	
				}
			}
			catch(e){
				console.warn(`Linkedin Tools: Could not parse include type '${includeType}', entityUrn: '${include?.entityUrn}'. ` + e);
			}
		}

		return posts;
	}

	protected uniqueName(): string{
		return camelcase(this.author) + "-" + crypto.randomUUID();
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
				name: this.uniqueName(),
				url: root + segment
			});
		}
	}
}

// image
export class LnImage extends LnPost{

	constructor(include: any){
		super(include);

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
			name: this.uniqueName(),
			url: url
		});
	}
}

// banner (event)
export class LnEvent extends LnPost{

	constructor(include: any){
		super(include);

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

// lead
export class LnLead extends LnPost{

	constructor(include: any){
		super(include);

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

		let url = include?.content?.document?.transcribedDocumentUrl;
		let title = include?.content?.document?.title;

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
					name: this.uniqueName(),
					url: url
				})

				break;
			}
		}
	}
}

// external
export class LnExternal extends LnPost{
	constructor(include: any){
		super(include);

		let provider: string | undefined | null = include?.content?.provider;
		let source: string | undefined | null = include?.content?.navigationContext?.actionTarget;

		if(!provider || !source)
			return;

		this.externalUrl = source;
	}
}
