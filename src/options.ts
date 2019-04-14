import { OptionDeclaration, ParameterType } from "typedoc/dist/lib/utils/options/declaration";
import { PLUGIN_NAME } from "./constants";

export const SOURCE_DIR_OPTION = new OptionDeclaration({
	component: PLUGIN_NAME,
	help: "Markdown Pages Plugin: The path to the directory where pages will be read from",
	name: "mdPagesSourceDir",
	type: ParameterType.String,
	// scope: ParameterScope.TypeDoc
	// hint: ParameterHint.Directory
});

export const OUTPUT_DIR_OPTION = new OptionDeclaration({
	component: PLUGIN_NAME,
	help: "Markdown Pages Plugin: The name of the directory pages will be rendered to",
	name: "mdPagesOutputDir",
	type: ParameterType.String,
	// scope: ParameterScope.TypeDoc
	// hint: ParameterHint.Directory
});
