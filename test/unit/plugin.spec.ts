import { MarkdownPagesPlugin } from "../../src/plugin";
import { expect } from "chai";
import "mocha";
import { Renderer } from "typedoc/dist/lib/output/renderer";
import { Options } from "typedoc/dist/lib/utils/options";
import { Application } from "typedoc/dist/lib/application";
import { IMock, It, Mock, Times } from "typemoq";
import { DEFAULT_OUTPUT_DIR_NAME, DEFAULT_PAGES_LABEL, THEME_NAME } from "../../src/constants";
import { LABEL_OPTION, OUTPUT_DIR_NAME_OPTION, SOURCE_PATH_OPTION } from "../../src/options";
import { resolve } from "path";
import { Logger } from "typedoc/dist/lib/utils/loggers";

describe("MarkdownPagesPlugin", () => {
	let rendererMock: IMock<Renderer>;
	let optionsMock: IMock<Options>;
	let sut: MarkdownPagesPlugin;

	beforeEach(() => {
		rendererMock = Mock.ofType<Renderer>();
		optionsMock = Mock.ofType<Options>();
		
		sut = new MarkdownPagesPlugin(rendererMock.object);
	});

	describe("_getOptions()", () => {
		it("gets option values from TypeDoc", () => {
			// arrange
			const applicationMock = Mock.ofType<Application>();
			applicationMock.setup(a => a.options).returns(() => optionsMock.object);
			rendererMock.setup(r => r.application).returns(() => applicationMock.object);
			
			// act
			const result = (sut as any)._getOptions();

			// assert
			optionsMock.verify(o => o.read(It.isAny(), It.isAny()), Times.once());
			expect(result === optionsMock.object).to.true;
		});
	});

	describe("_getPagesSourceLocation()", () => {
		it("returns the source location from options", () => {
			// arrange
			const optionVal = "../some/relative/path/";
			optionsMock.setup(o => o.getValue(SOURCE_PATH_OPTION.name)).returns(() => optionVal);

			// act
			const result = (sut as any)._getPagesSourceLocation(optionsMock.object);

			// assert
			expect(result).to.contain(resolve(optionVal));
		});

		it("throws an error if no source location is specified in options", () => {
			// arrange
			const applicationMock = Mock.ofType<Application>();
			const loggerMock = Mock.ofType<Logger>();
			applicationMock.setup(a => a.logger).returns(() => loggerMock.object);
			rendererMock.setup(r => r.application).returns(() => applicationMock.object);
			optionsMock.setup(o => o.getValue(SOURCE_PATH_OPTION.name)).returns(() => undefined);

			// act / assert
			expect(() => {
				(sut as any)._getPagesSourceLocation(optionsMock.object);
			}).to.throw;
		});

		it("throws an error if source location specified in options is an empty string", () => {
			// arrange
			const applicationMock = Mock.ofType<Application>();
			const loggerMock = Mock.ofType<Logger>();
			applicationMock.setup(a => a.logger).returns(() => loggerMock.object);
			rendererMock.setup(r => r.application).returns(() => applicationMock.object);
			optionsMock.setup(o => o.getValue(SOURCE_PATH_OPTION.name)).returns(() => "");

			// act / assert
			expect(() => {
				(sut as any)._getPagesSourceLocation(optionsMock.object);
			}).to.throw;
		});
	});

	describe("_getPagesOutputDirName()", () => {
		it("returns the output directory name from options", () => {
			// arrange
			const optionVal = "somename";
			optionsMock.setup(o => o.getValue(OUTPUT_DIR_NAME_OPTION.name)).returns(() => optionVal);

			// act
			const result = (sut as any)._getPagesOutputDirName(optionsMock.object);

			// assert
			expect(result).to.contain(optionVal);
		});

		it("returns default value if no directory name is specified in options", () => {
			// arrange
			optionsMock.setup(o => o.getValue(OUTPUT_DIR_NAME_OPTION.name)).returns(() => undefined);

			// act
			const result = (sut as any)._getPagesOutputDirName(optionsMock.object);

			// assert
			expect(result).to.contain(DEFAULT_OUTPUT_DIR_NAME);
		});

		it("returns default value if directory name specified in options is an empty string", () => {
			// arrange
			optionsMock.setup(o => o.getValue(OUTPUT_DIR_NAME_OPTION.name)).returns(() => "");

			// act
			const result = (sut as any)._getPagesOutputDirName(optionsMock.object);

			// assert
			expect(result).to.contain(DEFAULT_OUTPUT_DIR_NAME);
		});
	});

	describe("_getPagesLabel()", () => {
		it("returns the label from options", () => {
			// arrange
			const optionVal = "My Custom Label";
			optionsMock.setup(o => o.getValue(LABEL_OPTION.name)).returns(() => optionVal);

			// act
			const result = (sut as any)._getPagesLabel(optionsMock.object);

			// assert
			expect(result).to.contain(optionVal);
		});

		it("returns default value if no label is specified in options", () => {
			// arrange
			optionsMock.setup(o => o.getValue(LABEL_OPTION.name)).returns(() => undefined);

			// act
			const result = (sut as any)._getPagesLabel(optionsMock.object);

			// assert
			expect(result).to.contain(DEFAULT_PAGES_LABEL);
		});

		it("returns default value label specified in options is an empty string", () => {
			// arrange
			optionsMock.setup(o => o.getValue(LABEL_OPTION.name)).returns(() => "");

			// act
			const result = (sut as any)._getPagesLabel(optionsMock.object);

			// assert
			expect(result).to.contain(DEFAULT_PAGES_LABEL);
		});
	});

	describe("_setupTheme()", () => {
		it("does nothing if theme is not specified in options", () => {
			// arrange
			optionsMock.setup(o => o.getValue("theme")).returns(() => undefined);

			// act
			(sut as any)._setupTheme(rendererMock.object, optionsMock.object);

			// assert
			rendererMock.verify(r => r.addComponent(It.isAnyString(), It.isAny()), Times.never());
		});

		it("does nothing if theme name is not specified in options", () => {
			// arrange
			optionsMock.setup(o => o.getValue("theme")).returns(() => "not-the-theme-name");

			// act
			(sut as any)._setupTheme(rendererMock.object, optionsMock.object);

			// assert
			rendererMock.verify(r => r.addComponent(It.isAnyString(), It.isAny()), Times.never());
		});

		it("registers the theme if the theme name is specified in options", () => {
			// arrange
			optionsMock.setup(o => o.getValue("theme")).returns(() => THEME_NAME);

			// act
			(sut as any)._setupTheme(rendererMock.object, optionsMock.object);

			// assert
			rendererMock.verify(r => r.addComponent("theme", It.isAny()), Times.once());
		});
	});
});
