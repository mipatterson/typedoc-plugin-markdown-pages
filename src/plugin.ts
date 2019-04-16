import { Component, RendererComponent } from "typedoc/dist/lib/output/components";
import { PageEvent, RendererEvent } from "typedoc/dist/lib/output/events";
import { PLUGIN_NAME } from "./constants";
import { OptionsReadMode } from "typedoc/dist/lib/utils/options";
import { LABEL_OPTION, SOURCE_DIR_OPTION } from "./options";
import { resolve } from "path";
import { Logger } from "typedoc/dist/lib/utils/loggers";
import { ExtendedPageEvent } from "./models/extended-page-event";
import { setupTheme } from "./utilities/theme-utilities";
import { MarkdownPageCollection } from "./models/markdown-page-collection";
import { IMarkdownPageCollection } from "./interfaces/markdown-page-collection-interface";
import { Options } from "typedoc/dist/lib/utils/options";
import { NavigationHelper } from "./helpers/navigation-helper";
import { UrlMappingHelper } from "./helpers/url-mapping-helper";

@Component({ name: PLUGIN_NAME })
export class MarkdownPagesPlugin extends RendererComponent {
	private _navigationHelper: NavigationHelper;
	private _urlMappingHelper: UrlMappingHelper;
	private _pageCollection: IMarkdownPageCollection

	/**
	 * Create a new TocPlugin instance.
	 */
  public initialize() {
        this.listenTo(this.owner, {
			[RendererEvent.BEGIN]: this.renderBeginEventHandler,
			[PageEvent.BEGIN]: this.pageBeginEventHandler,
		});
		
		this._navigationHelper = new NavigationHelper(this._logger);
		this._urlMappingHelper = new UrlMappingHelper(this._logger);
	}

	private get _logger(): Logger {
		return this.application.logger;
	}

	/**
     * An event emitted by the Renderer class at the very beginning and ending of the entire rendering process.
     *
     * @param renderer  An event object describing the current render operation.
     */
	private renderBeginEventHandler(renderer: RendererEvent): void {
		this._logger.verbose("Beginning rendering...");

		const options = this._getOptions();

		setupTheme(options);

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

	private _getOptions(): Options {
		const options = this.application.options;
		options.read({}, OptionsReadMode.Prefetch);
		return options;
	}

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

	private _getPagesLabel(options: Options): string {
		try {
			// Get option
			const label = options.getValue(LABEL_OPTION.name);

			if (!label || label.length === 0) {
				return "Pages";
			} else {
				return label;
			}
		} catch (e) {
			const errorMessage = `Failed to get pages label from options. ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}