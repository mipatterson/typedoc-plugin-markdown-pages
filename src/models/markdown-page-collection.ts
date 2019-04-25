import { MarkdownPage } from "./markdown-page";
import { getDirectoryName, getFileExtension, getItemNameFromPath, makeHumanReadable } from "../utilities/path-utilities";
import { join, relative } from "path";
import { resolve } from "url";
import { getDirectoryContents, isDirectory } from "../utilities/filesystem-utilities";
import { Logger } from "typedoc/dist/lib/utils/loggers";
import { isIndexChildPage, parsePageTitleFromPath } from "../utilities/page-utilities";

export class MarkdownPageCollection extends MarkdownPage {
	public index: MarkdownPage;
	public children: MarkdownPage[];
	private _logger: Logger;

	constructor(logger: Logger, path: string, url: string) {
		if (!isDirectory(path)) {
			throw new Error(`Markdown page collection path "${path}" is not a directory.`);
		}

		super(path, url);

		this._logger = logger;
		this.path = path;
		this.url = url;
		this.children = [];
		this.title = parsePageTitleFromPath(path);
	}

	public readContents(): void {
		try {
			const childItems = getDirectoryContents(this.path);

			for (const childItem of childItems) {
				let childPage: MarkdownPage;
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
				} else if (isIndexChildPage(childItem)) {
					this.contents = "";
					this.url = childPage.url;
					this.children.unshift(childPage);
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
		this._recursiveLog(this as MarkdownPage, 0);
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
			let sourceItemNameWithoutExtension = sourceItemName.slice(0, (1 + fileExtension.length) * -1);
			if (isIndexChildPage(sourceItemNameWithoutExtension)) {
				sourceItemNameWithoutExtension = sourceItemNameWithoutExtension.substr(1);
			}
			return resolve(urlPathToCollection, sourceItemNameWithoutExtension) + ".html";
		}
	}

	private _recursiveLog(page: MarkdownPage, depth: number): void {
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
			for (const child of (page as MarkdownPageCollection).children) {
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
				const childUrl = getItemNameFromPath(child.url);
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