import { PageEvent } from "typedoc/dist/lib/output/events";
import { NavigationItem } from "typedoc/dist/lib/output/models/NavigationItem";

export class ExtendedPageEvent extends PageEvent {
	public mdPagesNavigation: NavigationItem;
}
