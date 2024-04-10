// declare any html file as an 'importable'
declare module '*.html' {
	const content: string;
	export default content;
}