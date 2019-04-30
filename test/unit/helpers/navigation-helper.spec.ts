import { expect } from "chai";
import "mocha";
import { Mock } from "typemoq";
import { NavigationHelper } from "../../../src/helpers/navigation-helper";
import { PageEvent } from "typedoc/dist/lib/output/events";
import { NavigationItem } from "typedoc/dist/lib/output/models/NavigationItem";
import { MarkdownPageCollection } from "../../../src/models/markdown-page-collection";

describe("NavigationHelper", () => {
	let sut: NavigationHelper;

	beforeEach(() => {
		sut = new NavigationHelper();
	})

	describe("getNavigationItem()", () => {
		it("returns a NavigationItem", () => {
			// arrange
			const eventMock = Mock.ofType<PageEvent>();
			eventMock.setup(e => e.url).returns(() => "fake/url/page.html");
			const collectionMock = Mock.ofType<MarkdownPageCollection>();
			collectionMock.setup(c => c.children).returns(() => []);

			// act
			const result = sut.getNavigationItem(eventMock.object, collectionMock.object, "labelText");

			// assert
			expect(result).to.not.be.undefined;
			expect(result instanceof NavigationItem).to.be.true;
		})
	});
});
