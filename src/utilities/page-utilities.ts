import { isDirectory } from "./filesystem-utilities";
import { getFileExtension, getItemNameFromPath, getSortIndexFromPath, makeHumanReadable } from "./path-utilities";
import { PAGE_PREFIX_CHAR } from "../constants";
import { MarkdownPage } from "../models/markdown-page";

/**
 * Parses a page or page collection title from the provided source path
 * @param path Path to the source file or directory
 * @returns Page title
 */
export function parsePageTitleFromPath(path: string): string {
	let itemName = getItemNameFromPath(path);
	const isItemADirectory = isDirectory(path);

	if (!isItemADirectory) {
		const fileExtension = getFileExtension(itemName);
		itemName = itemName.slice(0, (1 + fileExtension.length) * -1);

		if (isIndexChildPage(itemName)) {
			itemName = itemName.substr(1);
		}
	}

	const humanReadable = makeHumanReadable(itemName);
	return humanReadable;
}

export function isIndexChildPage(fileName: string): boolean {
	return fileName.length > 1 && fileName.charAt(0) === PAGE_PREFIX_CHAR;
}

export function sortPages(pages: MarkdownPage[]): MarkdownPage[] {
	const sortedPages = [];
	const pagesWithSortPrefix = [];
	const pagesWithoutSortPrefix = [];

	// Find index child, and split children based on presence of prefix
	for (const page of pages) {
		const itemName = getItemNameFromPath(page.path);
		if (isIndexChildPage(itemName)) {
			sortedPages.push(page);
		} else {
			if (getSortIndexFromPath(page.path)) {
				pagesWithSortPrefix.push(page);
			} else {
				pagesWithoutSortPrefix.push(page);
			}
		}
	}

	// Sort prefixed pages by prefix and add to new array
	sortedPages.push.apply(sortedPages, pagesWithSortPrefix.sort((a: MarkdownPage, b: MarkdownPage) => {
		return getSortIndexFromPath(a.path) - getSortIndexFromPath(b.path);
	}));

	// Sort unprefixed pages alphabetically and add to new array
	sortedPages.push.apply(sortedPages, pagesWithoutSortPrefix.sort((a: MarkdownPage, b: MarkdownPage) => {
		const nameA = a.title;
		const nameB = b.title;
		if (nameA === nameB) {
			return 0;
		}
		const sorted = [nameA, nameB].sort();
		if (sorted[0] === nameA) {
			return -1;
		} else {
			return 1;
		}
	}));

	return sortedPages;
}
