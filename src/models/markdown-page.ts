import { readFileSync } from "fs";
import { parsePageTitleFromPath } from "../utilities/page-utilities";

/**
 * Class representing a markdown page
 */
export class MarkdownPage {
	/**
	 * Page title displayed in header, breadcrumbs, and navigation
	 */
	public title: string;

	/**
	 * Path to source file
	 */
	public path: string;

	/**
	 * URL of the rendered HTML page
	 */
	public url: string;

	/**
	 * Contents of the markdown source file
	 */
	public contents: string;

	/**
	 * Creates an instance of MarkdownPage
	 * @param path Path to source file
	 * @param url URL to render HTML page at
	 */
	constructor(path: string, url: string) {
		this.path = path;
		this.url = url;
		this.title = parsePageTitleFromPath(path);
	}

	/**
	 * Reads the contents of the page from the source file on disk and populates {@link MarkdownPage.contents} field
	 */
	public readContents(): void {
		try {
			this.contents = readFileSync(this.path, "utf8");
		} catch (e) {
			throw new Error(`Failed to read markdown page contents. ${e}`);
		}
	}
}
