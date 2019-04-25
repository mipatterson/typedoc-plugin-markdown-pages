import { resolve } from "path";
import { OptionsReadMode } from "typedoc/dist/lib/utils/options";
import { Options } from "typedoc/dist/lib/utils/options";
import { Application } from "typedoc/dist/lib/application";
import { DEFAULT_OUTPUT_DIR_NAME, DEFAULT_PAGES_LABEL } from "../constants";
import { LABEL_OPTION, OUTPUT_DIR_NAME_OPTION, SOURCE_PATH_OPTION } from "../options";

/**
 * Helper for working with TypeDoc options
 */
export class OptionsHelper {
	private _application: Application;
	private _options: Options;

	/**
	 * Creates an instance of OptionsHelper
	 * @param application TypeDoc application
	 */
	constructor(application: Application) {
		this._application = application;
	}

	/**
	 * The pages source path option
	 * @readonly
	 */
	public get sourcePath(): string {
		try {
			const sourcePath = this._getOptions().getValue(SOURCE_PATH_OPTION.name);
			if (!sourcePath || sourcePath.length === 0) {
				throw new Error("Pages source path must be specified.");
			} else {
				return resolve(sourcePath);
			}
		} catch (e) {
			throw new Error(`Failed to get pages source path from options. ${e}`);
		}
	}

	/**
	 * The pages output directory name option or default value
	 * @readonly
	 */
	public get outputDirName(): string {
		try {
			const outputDirName = this._getOptions().getValue(OUTPUT_DIR_NAME_OPTION.name);
			if (!outputDirName || outputDirName.length === 0) {
				return DEFAULT_OUTPUT_DIR_NAME;
			} else {
				return outputDirName;
			}
		} catch (e) {
			throw new Error(`Failed to get pages output directory name from options. ${e}`);
		}
	}

	/**
	 * The pages label option or default value
	 * @readonly
	 */
	public get pagesLabel(): string {
		const label = this._getOptions().getValue(LABEL_OPTION.name);
		if (!label || label.length === 0) {
			return DEFAULT_PAGES_LABEL;
		} else {
			return label;
		}
	}

	/**
	 * The TypeDoc theme option
	 * @readonly
	 */
	public get theme(): string {
		return this._getOptions().getValue("theme");
	}

	/**
	 * Retrieves the TypeDoc application options from TypeDoc or cached version
	 * @returns TypeDoc application options
	 */
	private _getOptions(): Options {
		if (!this._options) {
			this._readTypeDocOptions();
		}
		return this._options;
	}

	/**
	 * Retrieves the application options from TypeDoc
	 */
	private _readTypeDocOptions(): void {
		this._options = this._application.options;
		this._options.read({}, OptionsReadMode.Prefetch);
	}
}