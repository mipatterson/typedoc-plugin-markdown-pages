import { OptionDeclaration, ParameterType } from "typedoc/dist/lib/utils/options/declaration";
import { PLUGIN_NAME } from "./constants";

export const LABEL_OPTION = new OptionDeclaration({
	component: PLUGIN_NAME,
	help: "Markdown Pages Plugin: The navigation label for markdown pages.",
	name: "mdPagesLabel",
	type: ParameterType.String,
});

export const OUTPUT_DIR_NAME_OPTION = new OptionDeclaration({
	component: PLUGIN_NAME,
	help: "Markdown Pages Plugin: The name of the directory pages will be output to",
	name: "mdPagesOutputDirName",
	type: ParameterType.String,
});

export const SOURCE_PATH_OPTION = new OptionDeclaration({
	component: PLUGIN_NAME,
	help: "Markdown Pages Plugin: The path to the directory where pages will be read from",
	name: "mdPagesSourcePath",
	type: ParameterType.String,
});
