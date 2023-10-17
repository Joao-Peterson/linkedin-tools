# reverse engineering linkedin

# Articles

## iframe communication

## Fetch images sizes sources

### Manifest URL

```json
{
	"context": "native-document",
	"action": "init",
	"doc": {
		"type": "presentation",
		"width": 374,
		"height": 484,
		"coverPages": [
			{
				"type": "image",
				"config": {
					"src": "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-cover-images_480/0/1696567398052?e=1697990400&v=beta&t=xh26FBzfixkqDlOlPbInG90gjbbXZOE03fUV_g8umNo"
				}
			},
			{
				"type": "image",
				"config": {
					"src": "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-cover-images_480/1/1696567398052?e=1697990400&v=beta&t=_n-PhAaQmLmyeC8HUoRnurT2GEVRNIzoFpH_tZTrhzk"
				}
			},
			{
				"type": "image",
				"config": {
					"src": "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-cover-images_480/2/1696567398052?e=1697990400&v=beta&t=35fyw3rndUpBS8I9p3ckpUarIoI_Pmvguh31JL3eKs0"
				}
			}
		],
		"manifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-master-manifest/0/1696567401214?e=1697990400&v=beta&t=u14-EUHRGZguMMxn2rEIgAI2x2X5dQkbM4rVhS7MxKw",
		"manifestUrlExpiresAt": 1697990400000,
		"totalPageCount": 12,
		"title": "API",
		"downloadTitle": "API PDF",
		"subtitle": "12 pages",
		"isScanRequired": true,
		"isRtl": false
	},
	"a11y": {
		"topbar": {
			"downloadButton": "Download document",
			"cancelButton": "Exit full screen"
		},
		"toolbarA11y": {
			"fullscreenOnButtonA11yControlText": "Enter full screen. An accessible version of the document is available in full screen mode.",
			"zoomInButtonA11yControlText": "Zoom in",
			"zoomOutButtonA11yControlText": "Zoom out",
			"zoomA11yControlText": "Zoom"
		},
		"accessibilityMode": {
			"embed": "Accessible PDF document"
		},
		"pagination": {
			"paginationValue": "Current page",
			"paginationLength": "Total pages"
		},
		"sidepanelLeft": {
			"navButton": "Go to previous page of document"
		},
		"sidepanelRight": {
			"navButton": "Go to next page of document"
		},
		"progress": {
			"progressBar": "Pagination"
		}
	},
	"i18n": {
		"topbar": {
			"accessibilityButtonText": "Accessibility mode"
		},
		"virusScan": {
			"cancelButtonText": "Cancel",
			"skipButtonText": "Skip",
			"downloadButtonText": "Download",
			"forceProceedButtonText": "Proceed anyways",
			"progressDescriptionText": "Scanning for viruses…",
			"cleanProgressDescriptionText": "Ready to download",
			"timeoutTitle": "Can’t scan this document for viruses",
			"dirtyTitle": "This document is not safe",
			"timeoutSubtitle": "We were unable to scan this document for viruses. Would you still like to proceed?",
			"dirtySubtitle": "We detected a virus in this document that could harm your device."
		}
	}
}
```

### Manifest data

Got from [Manifest URL](#manifest-url) `doc.manifestUrl`:

```json
{
	"asset": "urn:li:digitalmediaAsset:D4D1FAQGSM7jsM-oVWQ",
	"transcriptManifestUrl": "https://media.licdn.com/dms/document/media/D4D1FAQGSM7jsM-oVWQ/feedshare-document-transcript/0/1696567401214?e=1698278400&v=beta&t=J7qGFg4XBuNtPZ6OpBxHFY0Um9DmA_CjY2jDZZ3IVS0",
	"transcribedDocumentUrl": "https://media.licdn.com/dms/document/media/D4D1FAQGSM7jsM-oVWQ/feedshare-document-pdf-analyzed/0/1696567401214?e=1698278400&v=beta&t=GBILTDAkO-UYKBJ4P-_OW3VoZeWKrPcFuB_QOPTHA78",
	"scanRequiredForDownload": true,
	"perResolutions": [
		{
			"width": 127,
			"height": 165,
			"imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_160/0/1696567401214?e=1698278400&v=beta&t=d_cIvRLE6FzYMX2VWhggGgurfljJ8ndeEYtKgQoR6CI"
		},
		{
			"width": 374,
			"height": 484,
			"imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_480/0/1696567401214?e=1698278400&v=beta&t=nn0i3Q2AXkGXH-5cWilhE_3eCg7zu8otseNP5yhZm6s"
		},
		{
			"width": 994,
			"height": 1287,
			"imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1280/0/1696567401214?e=1698278400&v=beta&t=w8VdE5dJTOBDC0_lTcEQtS8FA_oZK-GUkePgkQPHm3U"
		},
		{
			"width": 620,
			"height": 802,
			"imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_800/0/1696567401214?e=1698278400&v=beta&t=j7hQfGg7Tuc4kEuuboqwtp7vqsv68MXD1Abn45ZX5ro"
		},
		{
			"width": 1487,
			"height": 1925,
			"imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/0/1696567401214?e=1698278400&v=beta&t=rdt_A8gRyZRmeL2YKgHKgYpQFv25eUBk4IAjHhIOuqY"
		}
	]
}
```

### Pdf link

Got from [Manifest data](#manifest-data) `transcribedDocumentUrl`:

`https://media.licdn.com/dms/document/media/D4D1FAQGSM7jsM-oVWQ/feedshare-document-pdf-analyzed/0/1696567401214?e=1698278400&v=beta&t=GBILTDAkO-UYKBJ4P-_OW3VoZeWKrPcFuB_QOPTHA78`



Request:
```js
fetch("https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-master-manifest/0/1696567401214?e=1697904000&v=beta&t=cD8onpPtiGqs5CzahKEpgiUVx60iQWNuSAdw9RbQ5ME", {
	"headers": {
		"sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\""
  },
  "referrer": "",
  "referrerPolicy": "no-referrer",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
});
```

Response:
```json
{
    "asset": "urn:li:digitalmediaAsset:D4D1FAQGSM7jsM-oVWQ",
    "transcriptManifestUrl": "https://media.licdn.com/dms/document/media/D4D1FAQGSM7jsM-oVWQ/feedshare-document-transcript/0/1696567401214?e=1698278400&v=beta&t=J7qGFg4XBuNtPZ6OpBxHFY0Um9DmA_CjY2jDZZ3IVS0",
    "transcribedDocumentUrl": "https://media.licdn.com/dms/document/media/D4D1FAQGSM7jsM-oVWQ/feedshare-document-pdf-analyzed/0/1696567401214?e=1698278400&v=beta&t=GBILTDAkO-UYKBJ4P-_OW3VoZeWKrPcFuB_QOPTHA78",
    "scanRequiredForDownload": true,
    "perResolutions": [
        {
            "width": 127,
            "height": 165,
            "imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_160/0/1696567401214?e=1698278400&v=beta&t=d_cIvRLE6FzYMX2VWhggGgurfljJ8ndeEYtKgQoR6CI"
        },
        {
            "width": 374,
            "height": 484,
            "imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_480/0/1696567401214?e=1698278400&v=beta&t=nn0i3Q2AXkGXH-5cWilhE_3eCg7zu8otseNP5yhZm6s"
        },
        {
            "width": 994,
            "height": 1287,
            "imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1280/0/1696567401214?e=1698278400&v=beta&t=w8VdE5dJTOBDC0_lTcEQtS8FA_oZK-GUkePgkQPHm3U"
        },
        {
            "width": 620,
            "height": 802,
            "imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_800/0/1696567401214?e=1698278400&v=beta&t=j7hQfGg7Tuc4kEuuboqwtp7vqsv68MXD1Abn45ZX5ro"
        },
        {
            "width": 1487,
            "height": 1925,
            "imageManifestUrl": "https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/0/1696567401214?e=1698278400&v=beta&t=rdt_A8gRyZRmeL2YKgHKgYpQFv25eUBk4IAjHhIOuqY"
        }
    ]
}
```

## Fetch images

Request:
```js
fetch("https://media.licdn.com/dms/document/pl/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/0/1696567401214?e=1698278400&v=beta&t=rdt_A8gRyZRmeL2YKgHKgYpQFv25eUBk4IAjHhIOuqY", {
  "headers": {
    "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\""
  },
  "referrer": "",
  "referrerPolicy": "no-referrer",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
});
```

Response:
****
```json
{
    "pages": [
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/1/1696567401159?e=1698278400&v=beta&t=WBT0SMR5ZsNn4IrofkkBSILLP02tNU7AID4XFWNMF4E",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/2/1696567401159?e=1698278400&v=beta&t=soWthYE_0TqUpLGECpd3zaNZ-mQBPNNF69C7mphOTd8",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/3/1696567401159?e=1698278400&v=beta&t=cDXol9ItTRvBmgU8clrXE1OWzJJDHmhSUfwNsguZ-r8",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/4/1696567401159?e=1698278400&v=beta&t=lqEREfVbTwhlXmSR5h0Gbup06exUakckKJaIdB34H8A",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/5/1696567401159?e=1698278400&v=beta&t=JPbwJIQrWqnFdp6ZCc4yqPoGqFya_fl3rZM3Ca2G8s8",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/6/1696567401159?e=1698278400&v=beta&t=E1Ue3SgG4kPe50VyLeGc4ikEjCMD1GlD3-VoWYIR7E8",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/7/1696567401159?e=1698278400&v=beta&t=6t7REsUFMGcRWikCp3elxb4HG6mSs38av2vrlCYPBv8",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/8/1696567401159?e=1698278400&v=beta&t=g8qC84sUUUiIsqxMM9NNI1w-N-o0wh-XQlZYOzMpgQ4",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/9/1696567401159?e=1698278400&v=beta&t=eKmKWQxgJs4nK6QoCM11q4qrA42JFvxZ79L0HENf2KI",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/10/1696567401159?e=1698278400&v=beta&t=QnZXuP91T5kyJf2t9MvYW96zrvmhzM1LHmDZXOxBFzk",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/11/1696567401159?e=1698278400&v=beta&t=_TqwOFFcZUK4pYfbgjEcbaH6ZagnEvJJSiP0W2cmmCY",
        "https://media.licdn.com/dms/image/D4D1FAQGSM7jsM-oVWQ/feedshare-document-images_1920/12/1696567401159?e=1698278400&v=beta&t=6xkhJLZPZ2c5ewrJzjspgjh93wcNAwLhcNkmIV_CQ_Q"
    ]
}
```