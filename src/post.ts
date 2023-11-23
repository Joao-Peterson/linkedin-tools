import { camelcase } from "./utils"

// remote file
export interface RemoteFile{
	name: string;
	url: string;
}

// post
export class LnPost{
	public author: string;
	public id: string;
	public files: RemoteFile[] = [];
	public externalUrl?: string;
	public text?: string | undefined;

	public include: any;
	
	constructor(include: any){
		this.include = include;
		let author = include?.actor?.name?.text ?? "Unknown";
		
		this.author = author;
		this.id = "";

		this.text = this.getText();
	}

	public static parseLinkedinUpdate(LnUpdate: any): LnPost[] | null{
		if(!(LnUpdate?.included)) return null;

		let posts: LnPost[] = [];

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
						// else, just the text
						if(!contentType) contentType = include?.commentary?.$type;
						// else, suggested (aggregatedContent)
						if(!contentType) contentType = include?.aggregatedContent?.$type;

						// TODO else, reshared  "include.*resharedUpdate"
						// if(!contentType) contentType = include?.aggregatedContent?.$type;

						switch(contentType){
							// video
							case "com.linkedin.voyager.feed.render.LinkedInVideoComponent":
								posts.push(new LnVideo(include, LnUpdate.included));
							break;
		
							// carousel
							case "com.linkedin.voyager.feed.render.CarouselContent":
								posts.push(new LnCarousel(include));
							break;	
		
							// images
							case "com.linkedin.voyager.feed.render.ImageComponent":
								posts.push(new LnImages(include));
							break;							
		
							// image
							case "com.linkedin.voyager.feed.render.ArticleComponent":
								posts.push(new LnImage(include));
							break;							
		
							// documents
							case "com.linkedin.voyager.feed.render.DocumentComponent":
								posts.push(new LnDocument(include));
							break;							
								
							// text
							case "com.linkedin.voyager.feed.render.TextComponent":
								posts.push(new LnPost(include));
							break;
		
							// lead
							case "com.linkedin.voyager.feed.render.LeadGenFormContentV2":
								posts.push(new LnLead(include));
							break;
		
							// job offer (entity component)
							case "com.linkedin.voyager.feed.render.EntityComponent":
								posts.push(new LnPost(include));
							break;

							// youtube (ExternalVideoComponent)
							case "com.linkedin.voyager.feed.render.ExternalVideoComponent":
								posts.push(new LnExternal(include));
							break;
				
							// suggested
							case "com.linkedin.voyager.feed.render.FeedDiscoveryEntityComponent":
							case "com.linkedin.voyager.feed.render.AggregatedContent":
							break;
							
							// unknown
							default:
								console.warn(`Linkedin Tools: Could not parse content type '${contentType}', objectUrn: '${include?.objectUrn}'`);
							break;
						}
						break;
							
					default:
						console.info(`Linkedin Tools: Ignoring parse of type '${includeType}', objectUrn: '${include?.objectUrn}'`);
					break;	
				}
			}
			catch(e){
				console.warn(`Linkedin Tools: Could not parse include type '${includeType}', objectUrn: '${include?.objectUrn}'. ` + e);
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

		if(!root || !segment)
			return;

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

// https://www.linkedin.com/voyager/api/feed/updatesV2
// ?commentsCount=0
// &count=9
// &likesCount=0
// &moduleKey=home-feed%3Adesktop
// &paginationToken=718769390-1700570588141-4c2b759ceb40f8a82951b03440963ef5
// &q=feed
// &sortOrder=RELEVANCE
// &start=10

// content: null, for commentaries or reposts
// "commentary": {
// 	"numLines": 3,
// 	"dashTranslationUrn": "urn:li:fsd_translation:(urn:li:share:7130980321616932865,pt)",
// 	"translationUrn": "urn:li:fs_translation:(urn:li:share:7130980321616932865,pt)",
// 	"text": {
// 	  "textDirection": "FIRST_STRONG",
// 	  "text": "Será que trabalhar pra gringa é só sobre ganhar em dólar? É óbvio que isso tem um peso gigantesco, a vida muda muito quando isso acontece.\n\nE na maioria das vezes isso é a motivação principal, foi para mim, é para a maioria das pessoas que eu faço mentoria. Mas abrem-se muitas outras portas quando você trabalha para uma empresa internacional.\n\nMuitas empresas fazem offsites anuais ou semestrais, possibilitando que você conheça o time pessoalmente, além de outros países e culturas.\n\nMuitas empresas oferecem mais tempo de folga e PTO ilimitado - inclusive já vi algumas que oferecem um bônus ($$$) se você tira mais do que 25 dias de férias por ano 🤯\n\nMuitas empresas são globais e você aprende sobre outras culturas todos os dias. Assim como você aprende muito mais sobre a sua cultura e porque você faz as coisas do jeito que faz.\n\nPara quem é aberto a se conhecer, pode ser uma experiência muito transformadora a nível psíquico mesmo.\n\nSabe o inglês que possibilitou você conseguir sua primeira vaga? Ele fica muito melhor e abre novas oportunidades, seja para cargos maiores, liderar pessoas, ou só para melhorar sua autoconfiança.\n\nIsso sem falar das empresas que patrocinam visto e custeiam quase toda a mudança. Outra vida em outro país.\n\nMas não vou mentir para vocês: o trabalho de conseguir uma vaga internacional não é fácil, leva tempo e pode ser bem estressante. Eu participei de vários processos até conseguir meu sim, meus mentorandos também e é raro ver alguém que consegue em 1 - 2 meses.\n\nPor isso não gosto de prometer nada, cada um tem seu tempo e seu processo, mas gosto de compartilhar o que eu aprendi e ainda aprendo no mercado internacional.\n\nE vou compartilhar tudo de forma bem aprofundada nesse domingo! Vai rolar um workshop intensivão sobre carreira internacional indo desde o básico sobre o mercado até como montar currículo e LinkedIn atrativo, se preparar para entrevistas e muito mais.\n\nAinda terão bônus:\n\n- aula sobre entrevistas técnicas\n- aula sobre contabilidade internacional\n- lista de prompts para usar no ChatGPT\n- lista de sites e plataformas para pesquisar vagas\n- template de CV\n\nBora? Link com todas as informações nos comentários 👇",
// 	  "$type": "com.linkedin.voyager.common.TextViewModel"
// 	},
// 	"originalLanguage": "Portuguese",
// 	"$type": "com.linkedin.voyager.feed.render.TextComponent"
//   },

// repost:
// "*resharedUpdate": "urn:li:fs_updateV2:(urn:li:activity:7123311033103917056,MAIN_FEED,EMPTY,RESHARED,false)",

// poll's:
// "content": {
// 	"creatorView": false,
// 	"question": {
// 	  "text": "Tenho uma dúvida para galera que trabalha na gringa vale a pena trocar a localização para o País que está buscando vaga?",
// 	  "$type": "com.linkedin.voyager.common.TextViewModel"
// 	},
// 	"*pollSummary": "urn:li:fs_pollSummary:7124752283321393152",
// 	"showPollSummaryInfo": true,
// 	"pollOptions": [
// 	  {
// 		"dashPollOptionUrn": "urn:li:fsu_pollOption:urn:li:pollOption:(urn:li:poll:7124752283321393152,7124752283531173888)",
// 		"pollOptionUrn": "urn:li:fs_pollOption:urn:li:pollOption:(urn:li:poll:7124752283321393152,7124752283531173888)",
// 		"option": {
// 		  "text": "Sim",
// 		  "$type": "com.linkedin.voyager.common.TextViewModel"
// 		},
// 		"$type": "com.linkedin.voyager.feed.PollOption"
// 	  },
// 	  {
// 		"dashPollOptionUrn": "urn:li:fsu_pollOption:urn:li:pollOption:(urn:li:poll:7124752283321393152,7124752283535302656)",
// 		"pollOptionUrn": "urn:li:fs_pollOption:urn:li:pollOption:(urn:li:poll:7124752283321393152,7124752283535302656)",
// 		"option": {
// 		  "text": "Não",
// 		  "$type": "com.linkedin.voyager.common.TextViewModel"
// 		},
// 		"$type": "com.linkedin.voyager.feed.PollOption"
// 	  }
// 	],
// 	"visibilityInfo": {
// 	  "textDirection": "USER_LOCALE",
// 	  "attributes": [
// 		{
// 		  "link": "https://www.linkedin.com/help/linkedin/answer/119171?lang=en",
// 		  "start": 33,
// 		  "length": 10,
// 		  "type": "HYPERLINK_OPEN_EXTERNALLY",
// 		  "$type": "com.linkedin.voyager.common.TextAttribute"
// 		}
// 	  ],
// 	  "text": "The author can see how you vote. Learn more",
// 	  "$type": "com.linkedin.voyager.common.TextViewModel"
// 	},
// 	"$type": "com.linkedin.voyager.feed.render.PollComponent"
//   },