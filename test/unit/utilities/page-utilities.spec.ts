import { expect } from "chai";
import "mocha";
import { isIndexChildPage } from "../../../src/utilities/page-utilities";

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
});
