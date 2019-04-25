import { NavigationItem } from "typedoc/dist/lib/output/models/NavigationItem";
import { PageEvent } from "typedoc/dist/lib/output/events";
import { Logger } from "typedoc/dist/lib/utils/loggers";
import { MarkdownPageCollection } from "../models/markdown-page-collection";

export class NavigationHelper {
	private _logger: Logger;

	constructor(logger: Logger) {
		this._logger = logger;
	}

	public getNavigationItem(pageEvent: PageEvent, overallPageCollection: MarkdownPageCollection, label: string): NavigationItem {
		try {
			this._logger.verbose(`Getting markdown page NavigationItem for page "${pageEvent.url}"...`);

			const isMarkdownPage = !!pageEvent.model.mdPage;

			if (isMarkdownPage) {
				const mdPage = pageEvent.model.mdPage; 
				const isCollection = !!mdPage.children;

				if (isCollection) {
					return this._buildNavigationItemForCollection(mdPage, label, pageEvent.url);
				} else {
					const parentPage: MarkdownPageCollection = pageEvent.model.parent.mdPage;
					return this._buildNavigationItemForCollection(parentPage, label, pageEvent.url);
				}
			} else {
				return this._buildNavigationItemForCollection(overallPageCollection, label, pageEvent.url);
			}
		} catch (e) {
			const errorMessage = `Failed to get pages NavigationItem. ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	private _buildNavigationItemForCollection(collection: MarkdownPageCollection, label: string, currentUrl: string): NavigationItem {
		try {
			this._logger.verbose(`Building NavigationItem for collection "${collection.title}"...`);

			const topLevelItem = new NavigationItem();
			topLevelItem.children = [];

			// Create label
			const labelItem = this._getLabelItem(label);
			topLevelItem.children.push(labelItem);

			// Build child items
			for (const page of collection.children) {
				const pageNav = new NavigationItem(page.title, page.url);
				// pageNav.isCurrent = page.url === pageEvent.url; // TODO: Determine if this needs to be set
				pageNav.isInPath = page.url === currentUrl;
				pageNav.isVisible = true;
				topLevelItem.children.push(pageNav);
			}

			return topLevelItem;
		} catch (e) {
			const errorMessage = `Failed to get NavigationItem for page collection "${collection.title}". ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	private _getLabelItem(text: string): NavigationItem {
		const labelItem = new NavigationItem(text);
		labelItem.isLabel = true;
		labelItem.isVisible = true;
		return labelItem;
	}
}