import { IMarkdownPage } from "./markdown-page-interface";

export interface IMarkdownPageCollection extends IMarkdownPage {
	children: IMarkdownPage[];
}