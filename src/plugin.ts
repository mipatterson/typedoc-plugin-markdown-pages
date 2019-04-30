import { Component, RendererComponent } from "typedoc/dist/lib/output/components";
import { Converter } from 'typedoc/dist/lib/converter/converter';
import { PageEvent, RendererEvent } from "typedoc/dist/lib/output/events";
import { PLUGIN_NAME, THEME_NAME } from "./constants";
import { join } from "path";
import { ExtendedPageEvent } from "./models/extended-page-event";
import { MarkdownPageCollection } from "./models/markdown-page-collection";
import { NavigationHelper } from "./helpers/navigation-helper";
import { UrlMappingHelper } from "./helpers/url-mapping-helper";
import { DefaultTheme } from "typedoc/dist/lib/output/themes/DefaultTheme";
import { Renderer } from "typedoc/dist/lib/output/renderer";
import { OptionsHelper } from "./helpers/options-helper";

@Component({ name: PLUGIN_NAME })
export class MarkdownPagesPlugin extends RendererComponent {
	private _optionsHelper: OptionsHelper;
	private _navigationHelper: NavigationHelper;
	private _urlMappingHelper: UrlMappingHelper;
	private _pageCollection: MarkdownPageCollection

	/**
	 * Create a new plugin instance.
	 */
  	public initialize() {
		this._optionsHelper = new OptionsHelper(this.application);
		this._navigationHelper = new NavigationHelper();
		this._urlMappingHelper = new UrlMappingHelper();

		this.listenTo(this.application.converter, {
			[Converter.EVENT_RESOLVE_BEGIN]: this._converterResolveBeginEventHandler,
		});

        this.listenTo(this.owner, {
			[RendererEvent.BEGIN]: this.renderBeginEventHandler,
			[PageEvent.BEGIN]: this._pageBeginEventHandler,
		});
	}

	private _converterResolveBeginEventHandler(): void {
		this._setupTheme(this.application.renderer);
	}

	/**
     * An event emitted by the Renderer class at the very beginning and ending of the entire rendering process.
     *
     * @param renderer  An event object describing the current render operation.
     */
	private renderBeginEventHandler(renderer: RendererEvent): void {
		this._pageCollection = this._getPageCollection();

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
    private _pageBeginEventHandler(pageEvent: ExtendedPageEvent) {
		if (this._pageCollection) { // TODO: Make sure this check works if there are no pages
			pageEvent.mdPagesNavigation = this._navigationHelper.getNavigationItem(pageEvent, this._pageCollection, this._optionsHelper.pagesLabel);
		}
	}

	private _getPageCollection(): MarkdownPageCollection {
		try {
			// Get pages and read contents
			const collection = new MarkdownPageCollection(this._optionsHelper.sourcePath, `${this._optionsHelper.outputDirName}/index.html`);
			collection.title = this._optionsHelper.pagesLabel;
			collection.readContents();

			return collection;
		} catch (e) {
			throw new Error(`Failed to get page collection. ${e}`);
		}
	}

	/**
	 * Applies the plugin theme if the user specified its name in options
	 * @param renderer Application renderer
	 */
	private _setupTheme(renderer: Renderer): void {
		const themePath = join(__dirname, "theme");
	
		// Setup theme if it was requested
		if (this._optionsHelper.theme === THEME_NAME) {
			const pluginTheme = new DefaultTheme(renderer, themePath);
			renderer.theme = renderer.addComponent("theme", pluginTheme);
		}
	}
}