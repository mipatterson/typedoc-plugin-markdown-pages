import { expect } from "chai";
import "mocha";
import { Options } from "typedoc/dist/lib/utils/options";
import { Application } from "typedoc/dist/lib/application";
import { IMock, Mock } from "typemoq";
import { DEFAULT_OUTPUT_DIR_NAME, DEFAULT_PAGES_LABEL } from "../../../src/constants";
import { LABEL_OPTION, OUTPUT_DIR_NAME_OPTION, SOURCE_PATH_OPTION } from "../../../src/options";
import { resolve } from "path";
import { OptionsHelper } from "../../../src/helpers/options-helper";

describe("OptionsHelper", () => {
	let optionsMock: IMock<Options>;
	let applicationMock: IMock<Application>;
	let sut: OptionsHelper;

	beforeEach(() => {
		optionsMock = Mock.ofType<Options>();
		applicationMock = Mock.ofType<Application>();
		applicationMock.setup(a => a.options).returns(() => optionsMock.object);
		sut = new OptionsHelper(applicationMock.object);
	});

	describe("sourcePath", () => {
		it("returns the source path from options", () => {
			// arrange
			const optionsVal = "../some/relative/path/";
			optionsMock.setup(o => o.getValue(SOURCE_PATH_OPTION.name)).returns(() => optionsVal);

			// act
			const result = sut.sourcePath;
			// assert
			expect(result).to.contain(resolve(optionsVal));
		});

		it("throws an error if no source path is specified in options", () => {
			// arrange
			optionsMock.setup(o => o.getValue(SOURCE_PATH_OPTION.name)).returns(() => undefined);

			// act / assert
			expect(() => {
				sut.sourcePath;
			}).to.throw;
		});

		it("throws an error if source path specified in options is an empty string", () => {
			// arrange
			optionsMock.setup(o => o.getValue(SOURCE_PATH_OPTION.name)).returns(() => "");

			// act / assert
			expect(() => {
				sut.sourcePath;
			}).to.throw;
		});
	});

	describe("outputDirName", () => {
		it("returns the output directory name from options", () => {
			// arrange
			const optionVal = "somename";
			optionsMock.setup(o => o.getValue(OUTPUT_DIR_NAME_OPTION.name)).returns(() => optionVal);

			// act
			const result = sut.outputDirName;

			// assert
			expect(result).to.contain(optionVal);
		});

		it("returns default value if no directory name is specified in options", () => {
			// arrange
			optionsMock.setup(o => o.getValue(OUTPUT_DIR_NAME_OPTION.name)).returns(() => undefined);

			// act
			const result = sut.outputDirName;

			// assert
			expect(result).to.contain(DEFAULT_OUTPUT_DIR_NAME);
		});

		it("returns default value if directory name specified in options is an empty string", () => {
			// arrange
			optionsMock.setup(o => o.getValue(OUTPUT_DIR_NAME_OPTION.name)).returns(() => "");

			// act
			const result = sut.outputDirName;

			// assert
			expect(result).to.contain(DEFAULT_OUTPUT_DIR_NAME);
		});
	});

	describe("pagesLabel", () => {
		it("returns the label from options", () => {
			// arrange
			const optionVal = "My Custom Label";
			optionsMock.setup(o => o.getValue(LABEL_OPTION.name)).returns(() => optionVal);

			// act
			const result = sut.pagesLabel;

			// assert
			expect(result).to.contain(optionVal);
		});

		it("returns default value if no label is specified in options", () => {
			// arrange
			optionsMock.setup(o => o.getValue(LABEL_OPTION.name)).returns(() => undefined);

			// act
			const result = sut.pagesLabel;

			// assert
			expect(result).to.contain(DEFAULT_PAGES_LABEL);
		});

		it("returns default value label specified in options is an empty string", () => {
			// arrange
			optionsMock.setup(o => o.getValue(LABEL_OPTION.name)).returns(() => "");

			// act
			const result = sut.pagesLabel;

			// assert
			expect(result).to.contain(DEFAULT_PAGES_LABEL);
		});
	});

	describe("theme", () => {
		it("returns value from options", () => {
			// arrange
			const optionVal = "theme/option";
			optionsMock.setup(o => o.getValue("theme")).returns(() => optionVal);

			// act
			const result = sut.theme;

			// assert
			expect(result).to.equal(optionVal);
		});
	});
});
