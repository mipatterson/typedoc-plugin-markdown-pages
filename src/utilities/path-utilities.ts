import { basename, dirname, extname } from "path";

export function getFileName(filePath: string): string {
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

export function getHumanReadableNameFromFileName(fileName: string): string {
	return fileName
		// insert a space before all caps
		.replace(/([A-Z])/g, " $1")
		// uppercase the first character
		.replace(/^./, (str: string) => { return str.toUpperCase(); });
}
