import { Options } from "typedoc/dist/lib/utils/options";
import { join } from "path";
import { THEME_NAME } from "../constants";

export function setupTheme(options: Options): void {
	const themePath = join(__dirname, "../theme/");
	
	// Check if the theme name was passed in
	const themeNameOption = options.getValue("theme");

	// Setup theme if passed in
	if (themeNameOption === THEME_NAME) {
		options.setValue("theme", themePath);
	}
}