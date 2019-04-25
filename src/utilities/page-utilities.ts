import { isDirectory } from "./filesystem-utilities";
import { getFileExtension, getItemNameFromPath, makeHumanReadable } from "./path-utilities";

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
	}

	const humanReadable = makeHumanReadable(itemName);
	return humanReadable;
}
