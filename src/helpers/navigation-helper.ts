import { NavigationItem } from "typedoc/dist/lib/output/models/NavigationItem";
import { PageEvent } from "typedoc/dist/lib/output/events";
import { Logger } from "typedoc/dist/lib/utils/loggers";
import { IMarkdownPageCollection } from "../interfaces/markdown-page-collection-interface";

export class NavigationHelper {
	private _logger: Logger;

	constructor(logger: Logger) {
		this._logger = logger;
	}

	public getNavigationItem(pageEvent: PageEvent, pageCollection: IMarkdownPageCollection): NavigationItem {
		try {
			this._logger.verbose("Getting pages navigation item...");

			const topLevelItem = new NavigationItem();
			topLevelItem.children = [];

			const labelItem = new NavigationItem("Pages"); // TODO: Make this configurable
			labelItem.isLabel = true;
			labelItem.isVisible = true;
			topLevelItem.children.push(labelItem);

			for (const page of pageCollection.children) {
				const pageNav = new NavigationItem(page.title, page.url);
				// pageNav.isCurrent = page.url === pageEvent.url; // TODO: Determine if this needs to be set
				pageNav.isInPath = page.url === pageEvent.url;
				pageNav.isVisible = true;
				topLevelItem.children.push(pageNav);
			}

			return topLevelItem;
		} catch (e) {
			const errorMessage = `Failed to get pages NavigationItem. ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}