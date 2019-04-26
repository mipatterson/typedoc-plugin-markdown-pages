import { expect } from "chai";
import "mocha";
import { makeHumanReadable } from "../../../src/utilities/path-utilities";

describe("Path Utilities", () => {
	describe("makeHumanReadable()", () => {
		it("handles standard markdown file names", () => {
			expect(makeHumanReadable("My_File_Name")).to.equal("My File Name");
		});

		it("uppercases the first character", () => {
			expect(makeHumanReadable("my_File_Name_")).to.equal("My File Name");
		});

		it("handles leading underscores", () => {
			expect(makeHumanReadable("_My_File_Name")).to.equal("My File Name");
		});

		it("handles trailing underscores", () => {
			expect(makeHumanReadable("My_File_Name_")).to.equal("My File Name");
		});
	});
});
