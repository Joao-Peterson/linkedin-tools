# Linkedin Tools

Chrome extension that brings more tools for Linkedin, like better downloads and other stuff.

[Download it here!](https://chrome.google.com/webstore/detail/linkedin-tools/kcnmjginaijndlfgmgkhgbjjjagnaipi)

![](images/article.png)

# Features

* Download in a single click!
  * Article post as pdf  
  * Images  
  * Videos  
  * Post text
  * Poll's data
* Open up external media

# Development

## Build

```console
$ yarn install && yarn build
```

## Debug

1. Open chrome or similar and go to extensions: e.g. [chrome://extensions/](chrome://extensions/)
2. Enable `Developer mode`
3. Click on `Load unpacked`
4. Point to the `dist/` folder

# Acknowledgements

* [Twitter video downloader extension](https://github.com/mstfsnc/twitter-video-downloader-extension)
* [Linkedin icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/linkedin)
* [Bootstrap Download icon](https://icons.getbootstrap.com/icons/download/)

# References
* [Chrome Extension — When to use content scripts and injected scripts](https://radu-dita.medium.com/chrome-extension-when-to-use-content-scripts-and-injected-scripts-238563dce8af)
* [Chrome Extension Tutorial: How to Pass Messages from a Page's Context](https://www.freecodecamp.org/news/chrome-extension-message-passing-essentials/)

# TODO

* make the content script only scrape and move the `posts` global var to a background worker, so we can maintain context between page redirects, as it's the case with the linkedin redirect from `linkedin.com` to `linkedin.com/feed` when we visit the home page the first time. In this last case we lose some info about the first posts.
* some times when navigating pages or accessing it for the first time, the button is not injected, a reload may be necessary, fix this! 