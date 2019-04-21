import { Application } from "typedoc/dist/lib/application";
import { PLUGIN_NAME } from "./constants";
import { LABEL_OPTION, OUTPUT_DIR_OPTION, SOURCE_DIR_OPTION } from "./options";
import { MarkdownPagesPlugin } from "./plugin";

module.exports = (PluginHost: Application): void => {
	const app = PluginHost.owner;

	// Register options
	app.options.addDeclaration(LABEL_OPTION);
	app.options.addDeclaration(OUTPUT_DIR_OPTION);
	app.options.addDeclaration(SOURCE_DIR_OPTION);

	// Register components
	app.renderer.addComponent(PLUGIN_NAME, new MarkdownPagesPlugin(app.renderer));
};