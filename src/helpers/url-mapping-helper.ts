import { UrlMapping } from "typedoc/dist/lib/output/models/UrlMapping";
import { MarkdownPageCollection } from "../models/markdown-page-collection";
import { MarkdownPage } from "../models/markdown-page";

export class UrlMappingHelper {
	public getTemplateUrlMapping(mappings: UrlMapping[]): UrlMapping {
		try {
			const templates = mappings.filter((mapping: UrlMapping): boolean => {
				return mapping.url === "index.html";
			});

			if (templates.length === 0) {
				throw new Error("Failed to find UrlMapping with URL 'index.html'.");
			}

			return templates[0];
		} catch (e) {
			throw new Error(`Failed to get template UrlMapping. ${e}`);
		}
	}

	public createUrlMappings(parentMapping: UrlMapping, page: MarkdownPage): UrlMapping[] {
		try {
			const mappings: UrlMapping[] = [];

			if (page instanceof MarkdownPageCollection) {
				const collection = page as MarkdownPageCollection;

				// Create mapping for collection
				const collectionMapping = this._buildUrlMapping(parentMapping, collection);
				mappings.push(collectionMapping);

				// Recursively create mappings for children
				for (const child of collection.children) {
					mappings.push.apply(mappings, this.createUrlMappings(collectionMapping, child));
				}
			} else {
				// Create mapping for page
				const pageMapping = this._buildUrlMapping(parentMapping, page);
				mappings.push(pageMapping);
			}

			return mappings;
		} catch (e) {
			throw new Error(`Failed to create UrlMappings. ${e}`);
		}
	}

	private _buildUrlMapping(parentMapping: UrlMapping, page: MarkdownPage): UrlMapping {
		try {
			const newModel: any = {};

			// Copy properties from parent mapping
			for (const prop in parentMapping) {
				if (parentMapping.hasOwnProperty(prop)) {
					newModel[prop] = parentMapping[prop];
				}
			}

			newModel.parent = parentMapping.model;
			newModel.url = page.url;
			newModel.name = page.title;
			newModel.mdPage = page;

			return new UrlMapping(page.url, newModel, "page.hbs"); // TODO: make template configurable
		} catch (e) {
			throw new Error(`Failed to build UrlMapping. ${e}`);
		}
	}
}