const p = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const jsonCommented = require("comment-json");

module.exports = {
	mode: "production",	
	entry: {
		inject: from("src", [
			"inject.ts"
		]),
		bundle: from("src", [
			"main.ts",
		]),
		downloadWorker: from("src", [
			"downloadWorker.ts"
		])	
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
			{
				test: /\.css$/,
				use: 'css-loader',
				exclude: /node_modules/
			},
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
			// images
			{from: abs("images/icon16.png"), to: "images"},
			{from: abs("images/icon32.png"), to: "images"},
			{from: abs("images/icon48.png"), to: "images"},
			{from: abs("images/icon128.png"), to: "images"}
		]})
	]
}

function from(base, files){
	return files
		.map((f) => p.join(base, f))
		.map((f) => p.resolve(__dirname, f));
}

function abs(file){
	return p.resolve(__dirname, file);
}