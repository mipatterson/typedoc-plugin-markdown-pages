import { Component, RendererComponent } from "typedoc/dist/lib/output/components";
import { Converter } from 'typedoc/dist/lib/converter/converter';
import { PageEvent, RendererEvent } from "typedoc/dist/lib/output/events";
import { DEFAULT_PAGES_LABEL, PLUGIN_NAME, THEME_NAME } from "./constants";
import { OptionsReadMode } from "typedoc/dist/lib/utils/options";
import { LABEL_OPTION, SOURCE_DIR_OPTION } from "./options";
import { join, resolve } from "path";
import { Logger } from "typedoc/dist/lib/utils/loggers";
import { ExtendedPageEvent } from "./models/extended-page-event";
import { MarkdownPageCollection } from "./models/markdown-page-collection";
import { IMarkdownPageCollection } from "./interfaces/markdown-page-collection-interface";
import { Options } from "typedoc/dist/lib/utils/options";
import { NavigationHelper } from "./helpers/navigation-helper";
import { UrlMappingHelper } from "./helpers/url-mapping-helper";
import { DefaultTheme } from "typedoc/dist/lib/output/themes/DefaultTheme";
import { Renderer } from "typedoc/dist/lib/output/renderer";

@Component({ name: PLUGIN_NAME })
export class MarkdownPagesPlugin extends RendererComponent {
	private _navigationHelper: NavigationHelper;
	private _urlMappingHelper: UrlMappingHelper;
	private _pageCollection: IMarkdownPageCollection

	/**
	 * Create a new plugin instance.
	 */
  	public initialize() {
		this._navigationHelper = new NavigationHelper(this._logger);
		this._urlMappingHelper = new UrlMappingHelper(this._logger);

		this.listenTo(this.application.converter, {
			[Converter.EVENT_RESOLVE_BEGIN]: this._converterResolveBeginEventHandler,
		});

        this.listenTo(this.owner, {
			[RendererEvent.BEGIN]: this.renderBeginEventHandler,
			[PageEvent.BEGIN]: this.pageBeginEventHandler,
		});
	}

	private get _logger(): Logger {
		return this.application.logger;
	}

	private _converterResolveBeginEventHandler(): void {
		this._setupTheme(this.application.renderer, this._getOptions());
	}

	/**
     * An event emitted by the Renderer class at the very beginning and ending of the entire rendering process.
     *
     * @param renderer  An event object describing the current render operation.
     */
	private renderBeginEventHandler(renderer: RendererEvent): void {
		this._logger.verbose("Beginning rendering...");

		const options = this._getOptions();

		this._pageCollection = this._getPageCollection(options);

		// Get a template UrlMapping that will be used to create our own mappings
		const templateMapping = this._urlMappingHelper.getTemplateUrlMapping(renderer.urls);

		// Build UrlMappings for the extra pages that need to be rendered
		const markdownPageMappings = this._urlMappingHelper.createUrlMappings(templateMapping, this._pageCollection);
		renderer.urls.push.apply(renderer.urls, markdownPageMappings);
	}
	
	/**
     * Triggered before a document will be rendered.
     *
     * @param page An event object describing the current render operation.
     */
    private pageBeginEventHandler(pageEvent: ExtendedPageEvent) {
		if (this._pageCollection) { // TODO: Make sure this check works if there are no pages
			const options = this._getOptions();
			const labelText = this._getPagesLabel(options);
			pageEvent.mdPagesNavigation = this._navigationHelper.getNavigationItem(pageEvent, this._pageCollection, labelText);
		}
	}

	private _getPageCollection(options: Options): IMarkdownPageCollection {
		try {
			// Get options
			const pagesSrcDir = this._getPagesSourceLocation(options);
			const label = this._getPagesLabel(options);

			// Get pages and read contents
			const collection = new MarkdownPageCollection(this._logger, pagesSrcDir, "pages/index.html"); // TODO: make url configurable
			collection.title = label;
			collection.readContents();
			collection.log();

			return collection;
		} catch (e) {
			const errorMessage = `Failed to get page collection. ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	/**
	 * Retrieves the application options from TypeDoc
	 * @returns Application options
	 */
	private _getOptions(): Options {
		const options = this.application.options;
		options.read({}, OptionsReadMode.Prefetch);
		return options;
	}

	/**
	 * Retrieves the pages source location option
	 * @param options Application options
	 * @returns The pages source location
	 */
	private _getPagesSourceLocation(options: Options): string {
		try {
			// Get option
			const pagesSourceDir = options.getValue(SOURCE_DIR_OPTION.name);

			if (!pagesSourceDir || pagesSourceDir.length === 0) {
				// TODO: Try to use path relative to readme path
				return pagesSourceDir;
			} else {
				return resolve(pagesSourceDir);
			}
		} catch (e) {
			const errorMessage = `Failed to get pages source location from options. ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	/**
	 * Retrieves the pages label option or default value
	 * @param options Application options
	 * @returns The pages label
	 */
	private _getPagesLabel(options: Options): string {
		const label = options.getValue(LABEL_OPTION.name);
		if (!label || label.length === 0) {
			return DEFAULT_PAGES_LABEL;
		} else {
			return label;
		}
	}

	/**
	 * Applies the plugin theme if the user specified its name in options
	 * @param renderer Application renderer
	 * @param options Application options
	 */
	private _setupTheme(renderer: Renderer, options: Options): void {
		const themePath = join(__dirname, "theme");

		// Get the theme option
		const themeNameOption = options.getValue("theme");
	
		// Setup theme if it was requested
		if (themeNameOption === THEME_NAME) {
			const pluginTheme = new DefaultTheme(renderer, themePath);
			renderer.theme = renderer.addComponent("theme", pluginTheme);
		}
	}
}