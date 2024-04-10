const p = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const jsonCommented = require("comment-json");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: "production",	
	entry: {
		main: [
			abs("src/main.ts")
		],
		xhrIntercept: [
			abs("src/xhrIntercept.ts")
		]
	},
	output: {
		filename: "[name].js",
		path: abs("dist"),
		assetModuleFilename: 'assets/[name][ext]',
		clean: true,
		publicPath: ""
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
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
			// 	use: [
			// 		MiniCssExtractPlugin.loader,
			// 		'css-loader'
			// 	],
			// 	exclude: /node_modules/
			// },
			{
				test: /\.(svg|png|bmp|gif)$/,
				type: 'asset/resource',
				exclude: /node_modules/
			}
		],
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
			// manual css
			{from: abs("src/css/style.css"), to: ""},
			{from: abs("src/css/contextMenu.css"), to: ""},
			// images
			{from: abs("images/icon16.png"), to: "images"},
			{from: abs("images/icon32.png"), to: "images"},
			{from: abs("images/icon48.png"), to: "images"},
			{from: abs("images/icon128.png"), to: "images"},
		]}),
		new MiniCssExtractPlugin()
	]
}

function abs(file){
	return p.resolve(__dirname, file);
}