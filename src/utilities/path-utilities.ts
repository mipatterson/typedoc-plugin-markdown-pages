import { basename, dirname, extname } from "path";

export function getItemNameFromPath(filePath: string): string {
	return basename(filePath);
}

export function getDirectoryName(filePath: string): string {
	return dirname(filePath);
}

export function getFileExtension(fileName: string): string {
	let extensionWithDot = extname(fileName);
	if (extensionWithDot && extensionWithDot.length > 0 && extensionWithDot.charAt(0) === ".") {
		extensionWithDot = extensionWithDot.slice(1);
	}
	return extensionWithDot;
}

export function makeHumanReadable(fileName: string): string {
	let humanReadable = fileName;

	// Remove leading underscores
	if (humanReadable.charAt(0) === "_") {
		humanReadable = humanReadable.substr(1);
	}

	// Remove trailing underscores
	if (humanReadable.charAt(humanReadable.length - 1) === "_") {
		humanReadable = humanReadable.slice(0, -1);
	}

	// Remove sort-prefixes
	humanReadable = humanReadable.replace(/^(\d+_)/gm, "");

	return humanReadable
		// replace underscores with spaces
		.replace(/_/g, " ")
		// uppercase the first character
		.replace(/^./, (str: string) => { return str.toUpperCase(); });
}

export function getSortIndexFromPath(path: string): number {
	const itemName = getItemNameFromPath(path);
	const sortPrefix = itemName.match(/^(\d+_)/);
	if (sortPrefix && sortPrefix.length > 0) {
		const unpaddedPrefix = sortPrefix[0].replace(/^0+/, "");
		return parseInt(unpaddedPrefix.slice(0, -1));
	} else {
		return undefined;
	}
}
