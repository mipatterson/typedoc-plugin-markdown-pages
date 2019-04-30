import { MarkdownPage } from "../../../src/models/markdown-page";
import { expect } from "chai";
import "mocha";
import { isIndexChildPage, sortPages } from "../../../src/utilities/page-utilities";
import { Mock, It } from "typemoq";
import { isDirectory } from "../../../src/utilities/filesystem-utilities";

describe("Page Utilities", () => {
	describe("isIndexChildPage()", () => {
		it("returns true when the fileName is for an index child page", () => {
			// arrange
			const fileName = "_My_File_Name.md";

			// act
			const result = isIndexChildPage(fileName);

			// assert
			expect(result).to.be.true;
		});

		it("returns false when the fileName is not for an index child page", () => {
			// arrange
			const fileName = "My_File_Name.md";

			// act
			const result = isIndexChildPage(fileName);

			// assert
			expect(result).to.be.false;
		});

		it("returns false when filename is a single underscore", () => {
			// arrange
			const fileName = "_";

			// act
			const result = isIndexChildPage(fileName);

			// assert
			expect(result).to.be.false;
		});

		it("returns false when filename is an empty string", () => {
			// arrange
			const fileName = "";

			// act
			const result = isIndexChildPage(fileName);

			// assert
			expect(result).to.be.false;
		});
	});

	describe("sortPages()", () => {
		let pagesToSort;

		before(() => {
			const isDirectoryMock = Mock.ofInstance(isDirectory);
			(isDirectory as any) = isDirectoryMock.object;
			isDirectoryMock.setup(i => i(It.isAny())).returns(() => false);
			pagesToSort = [
				new MarkdownPage("./p/01_My_Page.md", ""),
				new MarkdownPage("./p/_My_Page.md", ""),
				new MarkdownPage("./p/99_My_Page.md", ""),
				new MarkdownPage("./p/Some_Other_Page.md", ""),
				new MarkdownPage("./p/Amplification.md", ""),
				new MarkdownPage("./p/4_2_For_1.md", ""),
				new MarkdownPage("./p/Another_Page.md", ""),
			];
		});

		it("places index page at front", () => {
			// act
			const result = sortPages(pagesToSort);

			// assert
			expect(result.length).to.be.equal(7);
			expect(result[0]).to.be.equal(pagesToSort[1]);
		});

		it("sorts prefixed pages right after index page", () => {
			// act
			const result = sortPages(pagesToSort);

			// assert
			expect(result.length).to.be.equal(7);
			expect(result[1]).to.be.equal(pagesToSort[0]);
			expect(result[2]).to.be.equal(pagesToSort[5]);
			expect(result[3]).to.be.equal(pagesToSort[2]);
		});

		it("sorts unprefixed pages right after prefixed pages", () => {
			// act
			const result = sortPages(pagesToSort);

			// assert
			expect(result.length).to.be.equal(7);
			expect(result[4]).to.be.equal(pagesToSort[4]);
			expect(result[5]).to.be.equal(pagesToSort[6]);
			expect(result[6]).to.be.equal(pagesToSort[3]);
		});
	});
});
