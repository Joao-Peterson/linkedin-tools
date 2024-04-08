// set the webpack public path dynamically to the chrome extension path
// this makes imports of assets automatically point to chrome extension URL
// !Remember to add this import before other imports in your file with: "import "./webpackPublicPathSet";"
__webpack_public_path__ = chrome.runtime.getURL("");