import { IMarkdownPageCollection } from "../interfaces/markdown-page-collection-interface";
import { IMarkdownPage } from "../interfaces/markdown-page-interface";
import { getFileExtension, getFileName, getHumanReadableNameFromFileName } from "../utilities/path-utilities";
import { MarkdownPage } from "./markdown-page";
import { join } from "path";
import { resolve } from "url";
import { getDirectoryContents, isDirectory } from "../utilities/filesystem-utilities";

export class MarkdownPageCollection implements IMarkdownPageCollection, IMarkdownPage {
	public title: string;
	public index: IMarkdownPage;
	public children: IMarkdownPage[];
	public path: string;
	public url: string;
	public contents: string;

	constructor(path: string, url: string) {
		this.path = path;
		this.url = url;
		this.children = [];

		this._parseTitle(path);
	}

	public readContents(): void {
		try {
			const childItems = getDirectoryContents(this.path);

			for (const childItem of childItems) {
				let childPage: IMarkdownPage;
				const childPath = join(this.path, childItem)
				const childUrl = resolve(this.url, this._getItemOutputFilename(childItem));

				if (isDirectory(childPath)) {
					childPage = new MarkdownPageCollection(childPath, childUrl);
				} else {
					childPage = new MarkdownPage(childPath, childUrl);
				}

				childPage.readContents();

				if (["index.md", "readme.md"].includes(childItem.toLowerCase())) {
					this.contents = childPage.contents;
				} else {
					this.children.push(childPage);
				}


			}

			// Add option for creating an index file
		} catch (e) {
			throw new Error(`Failed to read page collection contents. ${e}`);
		}
	}

	private _parseTitle(path: string): void {
		const fileName = getFileName(path);
		const fileExtension = getFileExtension(fileName);
		const itemNameWithoutExtension = fileName.slice(0, (1 + fileExtension.length) * -1);
		const humanReadableName = getHumanReadableNameFromFileName(itemNameWithoutExtension);
		this.title = humanReadableName;
	}

	private _getItemOutputFilename(sourceItemName: string): string { // TODO: rename this
		const fileExtension = getFileExtension(sourceItemName);
		const itemNameWithoutExtension = sourceItemName.slice(0, (1 + fileExtension.length) * -1);
		return itemNameWithoutExtension + ".html";
	}
}