import { Application } from 'typedoc/dist/lib/application';
import { PLUGIN_NAME } from "./constants";
import { OUTPUT_DIR_OPTION, SOURCE_DIR_OPTION } from "./options";
import { MarkdownPagesPlugin } from "./plugin";

module.exports = (PluginHost: Application): void => {
	const app = PluginHost.owner;
	
	if (app.converter.hasComponent(PLUGIN_NAME)) {
		return;
	}

	// Register options
	app.options.addDeclaration(SOURCE_DIR_OPTION);
	app.options.addDeclaration(OUTPUT_DIR_OPTION);

	// Register components
	app.renderer.addComponent(PLUGIN_NAME, new MarkdownPagesPlugin(app.renderer));
};