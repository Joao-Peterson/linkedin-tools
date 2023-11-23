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
	public text?: string | undefined;

	public include: any;
	
	constructor(include: any){
		this.include = include;
		let author = include?.actor?.name?.text;

		if(!author)
			throw "Authot not found";
		
		this.author = author;
		this.id = "";

		this.text = this.getText();
	}

	public static parseLinkedinUpdate(LnUpdate: any): LnPost[] | null{
		if(!(LnUpdate?.included)) return null;

		let posts: LnPost[] = [];

		for(var include of LnUpdate.included){
			try{
				let content = include?.content;
				
				// ignore other non content types, like assets
				if(content === undefined) continue;
	
				// text and reposts
				if(content === null){
					posts.push(new LnPost(include));
					continue;
				}
	
				// images
				if(content?.images) posts.push(new LnImages(include));
				// image
				if(content?.largeImage) posts.push(new LnImage(include));
				// video
				// if(content?.['*videoPlayMetadata']) posts.push(new LnVideo(include));
				// article
				// if(content?.document) posts.push(new LnDocument(include));
			}
			catch(e){
				console.warn("Linkedin Tools: Could not parse 'included'. " + e);
			}
		}

		return posts;
	}

	protected imageName(): string{
		return camelcase(this.author) + "-" + crypto.randomUUID();
	}

	protected getText(): string | undefined{
		let text: string | null | undefined = this.include?.commentary?.text?.text; 
		return typeof text === "string" ? text : undefined;
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
				name: this.imageName(),
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
			name: this.imageName(),
			url: root + segment
		});
	}
}

// video
export class LnVideo extends LnPost{
	// constructor(include: any){
	// 	super();
		
	// }

	// "content": {
	// 	"headlineBackgroundColor": "DEFAULT",
	// 	"mediaDisplayVariant": "CLASSIC",
	// 	"*videoPlayMetadata": "urn:li:digitalmediaAsset:D4E05AQGDBCR12IRwVw",
	// 	"tapTargets": [],
	// 	"$type": "com.linkedin.voyager.feed.render.LinkedInVideoComponent"
	//   },

	// cross referenced asset:
	// {
	// 	"thumbnail": {
	// 	  "artifacts": [
	// 		{
	// 		  "width": 1280,
	// 		  "fileIdentifyingUrlPathSegment": "high/0/1700057547285?e=1701176400&v=beta&t=ciKcQsv0uMc_hHgvLPjyNfnMoB_sjLVWQ1okRxG7ZPs",
	// 		  "expiresAt": 1701176400000,
	// 		  "height": 720,
	// 		  "$type": "com.linkedin.common.VectorArtifact"
	// 		},
	// 		{
	// 		  "width": 640,
	// 		  "fileIdentifyingUrlPathSegment": "low/0/1700057546030?e=1701176400&v=beta&t=xbEPlYelLTng_xt0kbs7oBG6bo9mT5AmJJrMdVINjus",
	// 		  "expiresAt": 1701176400000,
	// 		  "height": 360,
	// 		  "$type": "com.linkedin.common.VectorArtifact"
	// 		}
	// 	  ],
	// 	  "rootUrl": "https://media.licdn.com/dms/image/D4E05AQGDBCR12IRwVw/videocover-",
	// 	  "$type": "com.linkedin.common.VectorImage"
	// 	},
	// 	"progressiveStreams": [
	// 	  {
	// 		"streamingLocations": [
	// 		  {
	// 			"url": "https://dms.licdn.com/playlist/vid/D4E05AQGDBCR12IRwVw/mp4-720p-30fp-crf28/0/1700057581004?e=1701176400&v=beta&t=YCropMkDP8VpIeXZ6lJ4DTRbmoajQVTY7wZ-VEjca1I",
	// 			"expiresAt": 1701176400000,
	// 			"$type": "com.linkedin.videocontent.StreamingLocation"
	// 		  }
	// 		],
	// 		"size": 0,
	// 		"bitRate": 232223,
	// 		"width": 1280,
	// 		"mediaType": "video/mp4",
	// 		"height": 720,
	// 		"$type": "com.linkedin.videocontent.ProgressiveDownloadMetadata"
	// 	  },
}

// article pdf like
export class LnDocument extends LnPost{
	// constructor(content: any){
	// 	super();
		
	// }
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