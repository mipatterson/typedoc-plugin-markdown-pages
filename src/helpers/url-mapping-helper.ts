import { UrlMapping } from "typedoc/dist/lib/output/models/UrlMapping";
import { Logger } from "typedoc/dist/lib/utils/loggers";
import { IMarkdownPage } from "../interfaces/markdown-page-interface";
import { IMarkdownPageCollection } from "../interfaces/markdown-page-collection-interface";
import { MarkdownPageCollection } from "../models/markdown-page-collection";

export class UrlMappingHelper {
	private _logger: Logger;

	constructor(logger: Logger) {
		this._logger = logger;
	}

	public getTemplateUrlMapping(mappings: UrlMapping[]): UrlMapping {
		try {
			this._logger.verbose("Getting template UrlMapping...");

			const templates = mappings.filter((mapping: UrlMapping): boolean => {
				return mapping.url === "index.html";
			});

			if (templates.length === 0) {
				throw new Error("Failed to find UrlMapping with URL 'index.html'.");
			}

			this._logger.verbose("Template UrlMapping found.");

			return templates[0];
		} catch (e) {
			const errorMessage = `Failed to get template UrlMapping. ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	public createUrlMappings(parentMapping: UrlMapping, page: IMarkdownPage): UrlMapping[] {
		try {
			this._logger.verbose(`Creating UrlMappings for page "${page.path}"...`);

			const mappings: UrlMapping[] = [];

			if (page instanceof MarkdownPageCollection) {
				const collection = page as IMarkdownPageCollection;

				// Create mapping for collection
				const collectionMapping = this._buildUrlMapping(parentMapping, collection.url, collection.title, collection.contents);
				mappings.push(collectionMapping);

				// Recursively create mappings for children
				for (const child of collection.children) {
					mappings.push.apply(mappings, this.createUrlMappings(collectionMapping, child));
				}
			} else {
				// Create mapping for page
				const pageMapping = this._buildUrlMapping(parentMapping, page.url, page.title, page.contents);
				mappings.push(pageMapping);
			}

			return mappings;
		} catch (e) {
			const errorMessage = `Failed to create UrlMappings. ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	private _buildUrlMapping(parentMapping: UrlMapping, url: string, name: string, contents: string): UrlMapping {
		try {
			const newModel: any = {};

			// Copy properties from parent mapping
			for (const prop in parentMapping) {
				if (parentMapping.hasOwnProperty(prop)) {
					newModel[prop] = parentMapping[prop];
				}
			}

			newModel.parent = parentMapping.model;
			newModel.url = url;
			newModel.name = name;
			newModel.contents = contents;

			return new UrlMapping(url, newModel, "page.hbs"); // TODO: make template configurable
		} catch (e) {
			const errorMessage = `Failed to build UrlMapping. ${e}`;
			this._logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}