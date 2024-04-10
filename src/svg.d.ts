// declare any svg file as an 'importable'
declare module '*.svg' {
	const content: string;
	export default content;
}