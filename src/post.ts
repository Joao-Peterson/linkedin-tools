// post
abstract class LnPost{
	public static parse(LnUpdate: any): LnPost[] | null{
		if(!LnUpdate?.included) return null;

		for(var include of LnUpdate.included){
			// ignore other non conntent types, like assets
			if(include.content === undefined) continue;

			if(include.content === null){

			}
			
			// // images
			// if(content?.images) return new LnImages(content);
			// // image
			// if(content?.largeImage) return new LnLargeImage(content);
			// // video
			// if(content?.['*videoPlayMetadata']) return new LnVideo(content);
			// // article
			// if(content?.document) return new LnDocument(content);

		}
		
		return null;
	}
}

// images
class LnImages extends LnPost{
	constructor(content: any){
		super();
		
	}
}

// image
class LnLargeImage extends LnPost{
	constructor(content: any){
		super();
		
	}
}

// video
class LnVideo extends LnPost{
	constructor(content: any){
		super();
		
	}

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
class LnDocument extends LnPost{
	constructor(content: any){
		super();
		
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