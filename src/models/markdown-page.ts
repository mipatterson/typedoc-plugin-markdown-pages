import { IMarkdownPage } from "../interfaces/markdown-page-interface";
import { readFileSync } from "fs";
import { getFileExtension, getFileName, getHumanReadableNameFromFileName } from "../utilities/path-utilities";

export class MarkdownPage implements IMarkdownPage {
	public title: string;
	public path: string;
	public url: string;
	public contents: string;

	constructor(path: string, url: string) {
		this.path = path;
		this.url = url;

		this._parseTitle(path);
	}

	public readContents(): void {
		try {
			this.contents = readFileSync(this.path, "utf8");
		} catch (e) {
			throw new Error(`Failed to read page contents. ${e}`);
		}
	}

	private _parseTitle(path: string): void {
		const fileName = getFileName(path);
		const fileExtension = getFileExtension(fileName);
		const itemNameWithoutExtension = fileName.slice(0, (1 + fileExtension.length) * -1);
		const humanReadableName = getHumanReadableNameFromFileName(itemNameWithoutExtension);
		this.title = humanReadableName;
	}
}