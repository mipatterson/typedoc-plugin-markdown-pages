export interface IMarkdownPage {
	title: string;
	path: string;
	url: string;
	contents: string;
	readContents(): void;
}