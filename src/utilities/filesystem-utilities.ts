import { lstatSync, readdirSync } from "fs";

export function getDirectoryContents(path: string): string[] {
	try {
		return readdirSync(path);
	} catch (e) {
		throw new Error(`Failed to get contents of directory "${path}". ${e}`);
	}
}

export function isDirectory(path: string): boolean {
	try {
		return lstatSync(path).isDirectory();
	} catch (e) {
		throw new Error(`Failed to determine if path '${path}' is a directory. ${e}`);
	}
}