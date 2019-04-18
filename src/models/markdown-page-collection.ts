import { IMarkdownPageCollection } from "../interfaces/markdown-page-collection-interface";
import { IMarkdownPage } from "../interfaces/markdown-page-interface";
import { getDirectoryName, getFileExtension, getFileName, getHumanReadableNameFromFileName } from "../utilities/path-utilities";
import { MarkdownPage } from "./markdown-page";
import { join, relative } from "path";
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
				const isChildADirectory = isDirectory(childPath);
				const childUrl = this._getItemUrl(childItem, isChildADirectory);

				if (isChildADirectory) {
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

			if (!this.contents) {
				this._generateIndexContents();
			}
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

	private _getItemUrl(sourceItemName: string, isDirectory: boolean): string {
		const urlPathToCollection = getDirectoryName(this.url)
			.replace(/\/?$/, "/"); // ensure last character is a slash

		if (isDirectory) {
			const newDir = resolve(urlPathToCollection, sourceItemName)
				.replace(/\/?$/, "/"); // ensure last character is a slash
			return resolve(newDir, "index.html");
		} else {
			const fileExtension = getFileExtension(sourceItemName);
			const sourceItemNameWithoutExtension = sourceItemName.slice(0, (1 + fileExtension.length) * -1);
			return resolve(urlPathToCollection, sourceItemNameWithoutExtension) + ".html";
		}
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

	private _generateIndexContents(): void {
		try {
			this._logger.verbose(`Generating index contents for page "${this.title}"...`);

			let contents = "## Contents";

			for (const child of this.children) {
				const childUrl = getFileName(child.url);
				contents += `\n- [${child.title}](${childUrl})`;
			}

			this.contents = contents;
			this._logger.verbose(this.contents);
		} catch (e) {
			const errorMessage = `Failed to generate index contents. ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}