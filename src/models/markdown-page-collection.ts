import { IMarkdownPageCollection } from "../interfaces/markdown-page-collection-interface";
import { IMarkdownPage } from "../interfaces/markdown-page-interface";
import { getFileExtension, getFileName, getHumanReadableNameFromFileName } from "../utilities/path-utilities";
import { MarkdownPage } from "./markdown-page";
import { join } from "path";
import { resolve } from "url";
import { getDirectoryContents, isDirectory } from "../utilities/filesystem-utilities";
import { Logger } from "typedoc/dist/lib/utils/loggers";

export class MarkdownPageCollection implements IMarkdownPageCollection, IMarkdownPage {
	public title: string;
	public index: IMarkdownPage;
	public children: IMarkdownPage[];
	public path: string;
	public url: string;
	public contents: string;

	private _logger: Logger;

	constructor(logger: Logger, path: string, url: string) {
		this._logger = logger;
		this.path = path;
		this.url = url;
		this.children = [];

		if (!isDirectory(path)) {
			throw new Error(`Markdown page collection path "${path}" is not a directory.`);
		}

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
					childPage = new MarkdownPageCollection(this._logger, childPath, childUrl);
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

	public log(): void {
		this._recursiveLog(this as IMarkdownPage, 0);
	}

	private _parseTitle(path: string): void {
		const dirName = getFileName(path);
		const humanReadableName = getHumanReadableNameFromFileName(dirName);
		this.title = humanReadableName;
	}

	private _getItemOutputFilename(sourceItemName: string): string { // TODO: rename this
		const fileExtension = getFileExtension(sourceItemName);
		const itemNameWithoutExtension = sourceItemName.slice(0, fileExtension.length * -1);
		return itemNameWithoutExtension + ".html";
	}

	private _recursiveLog(page: IMarkdownPage, depth: number): void {
		const isCollection = !!(page as any).children;

		if (depth === 0) {
			this._logger.verbose(page.title);
		} else {
			let prefix = "";
			for (let i = 0; i < depth; i++) {
				prefix += " ";
			}
			prefix += "|__"
			this._logger.verbose(`${prefix}${page.title}`);
		}

		if (isCollection) {
			for (const child of (page as IMarkdownPageCollection).children) {
				const newDepth = depth + Math.floor(page.title.length / 2) + (depth === 0 ? 0 : 3);
				this._recursiveLog(child, newDepth);
			}
		}
	}
}