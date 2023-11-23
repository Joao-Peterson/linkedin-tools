const p = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const jsonCommented = require("comment-json");

module.exports = {
	mode: "production",	
	entry: {
		inject: [
			abs("src/inject.ts")
		],
		bundle: [
			abs("src/main.ts",)
		],
		downloadWorker: [
			abs("src/downloadWorker.ts")
		]	
	},
	output: {
		path: abs("dist"),
		filename: "[name].js",
		clean: true,
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.html$/,
				use: 'html-loader',
				exclude: /node_modules/
			},
			// {
			// 	test: /\.css$/,
			// 	use: 'css-loader',
			// 	exclude: /node_modules/
			// },
			{
				test: /\.(svg|png|bmp|gif)$/,
				type: 'asset/resource',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new CopyPlugin({patterns: [
			// manifest
			{
				from: abs("manifest.json"),
				to: "manifest.json",
				force: true,
				transform: function (content) {
					var manifest = jsonCommented.parse(content.toString(), undefined, true);
					manifest.$schema = undefined;
					return Buffer.from(
						JSON.stringify({
							version: process.env.npm_package_version,
							description: process.env.npm_package_description,
							...manifest
						})
					);
				},
			},
			// css
			{from: abs("css/style.css")},
			// images
			{from: abs("images/downloadDark.svg"), to: "images"},
			{from: abs("images/downloadLight.svg"), to: "images"},
			{from: abs("images/icon16.png"), to: "images"},
			{from: abs("images/icon32.png"), to: "images"},
			{from: abs("images/icon48.png"), to: "images"},
			{from: abs("images/icon128.png"), to: "images"},
		]})
	]
}

function abs(file){
	return p.resolve(__dirname, file);
}