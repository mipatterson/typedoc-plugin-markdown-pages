import { isDirectory } from "./filesystem-utilities";
import { getFileExtension, getItemNameFromPath, makeHumanReadable } from "./path-utilities";
import { PAGE_PREFIX_CHAR } from "../constants";

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
