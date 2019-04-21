import { MarkdownPagesPlugin } from "../../src/plugin";
import "mocha";
import { Renderer } from "typedoc/dist/lib/output/renderer";
import { Options } from "typedoc/dist/lib/utils/options";
import { IMock, It, Mock, Times } from "typemoq";
import { THEME_NAME } from "../../src/constants";

describe("MarkdownPagesPlugin", () => {
	describe("_setupTheme()", () => {
		let rendererMock: IMock<Renderer>;
		let optionsMock: IMock<Options>;
		let sut: MarkdownPagesPlugin;

		beforeEach(() => {
			rendererMock = Mock.ofType<Renderer>();
			optionsMock = Mock.ofType<Options>();
			
			sut = new MarkdownPagesPlugin(rendererMock.object);
		});

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
