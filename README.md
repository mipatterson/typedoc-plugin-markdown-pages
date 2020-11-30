# typedoc-plugin-markdown-pages

> A [TypeDoc](https://github.com/TypeStrong/typedoc) plugin that lets you integrate custom markdown pages into your documentation output

[![npm](https://img.shields.io/npm/v/typedoc-plugin-markdown-pages.svg?color=brightgreen)](https://www.npmjs.com/package/typedoc-plugin-markdown-pages)
[![build](https://img.shields.io/circleci/project/github/mipatterson/typedoc-plugin-markdown-pages/develop.svg)](https://circleci.com/gh/mipatterson/typedoc-plugin-markdown-pages/tree/develop)
[![coverage](https://img.shields.io/codecov/c/github/mipatterson/typedoc-plugin-markdown-pages/develop.svg)](https://codecov.io/gh/mipatterson/typedoc-plugin-markdown-pages)

> ⚠️ This plugin is still under active development and some options or formatting may change before the v1.0.0 release.

## Installation

```bash
$ npm install typedoc-plugin-markdown-pages --save-dev
```

## Usage

After installing the plugin, add the `mdPagesSourcePath` option to your TypeDoc command. This option should point to the directory of your markdown files.

The following command will parse all the markdown files in the `/path/to/markdown/doc/pages` directory and add them as separate documentation pages to the TypeDoc output.

```bash
$ node_modules/.bin/typedoc --out path/to/built/docs path/to/src/ --mdPagesSourcePath path/to/markdown/doc/pages --theme markdown-pages
```

## Directory Structure

The directory structure of the source directory you point to with the `mdPagesSourcePath` option will determine how the pages are output in the TypeDoc build. For the most part, the output structure will match the input.

For example, consider the following documentation structure:

```
docs/
├── GuideA.md
├── GuideB.md
├── CustomWorkflowOne/
│   ├── GuideC.md
│   └── GuideD.md
├── CustomWorkflowOne/
│   ├── index.md
│   ├── GuideC.md
│   └── GuideD.md
└── CustomWorkflowOne/
    ├── README.md
    ├── GuideC.md
    └── GuideD.md
```

The above documentation structure will produce the following HTML output structure:

```
pages/
├── index.html
├── GuideA.html
├── GuideB.html
├── CustomWorkflowOne/
│   ├── index.html
│   ├── GuideC.html
│   └── GuideD.html
├── CustomWorkflowOne/
│   ├── index.html
│   ├── GuideC.html
│   └── GuideD.html
└── CustomWorkflowOne/
    ├── index.html
    ├── GuideC.html
    └── GuideD.html
```

Each markdown source file resulted in an associated HTML output file.

## Page Naming

The file names of the markdown source files will be used to determine the names of the pages used in the documentation navigation and breadcrumbs. Markdown source files should use Pascal-cased in order to achieve nicely-named page names in the documentation output.

For example, a markdown file named `HowToDoSomething.md` will be displayed as `How To Do Something` in the documentation site's navigation and breadcrumbs.

## Index Files

Each markdown source file is represented as a "markdown page" and each directory in the source directory structure is represented as a "markdown page collection", which has child "markdown pages".

By default, each sub-directory in the source path will be output with an `index.html` file. Again by default, this file is auto-generated to include a list of links to the "child" pages inside that sub-directory. You can provide your own custom index file by placing a markdown file in the source sub-directory that is named either `index.md` or `readme.md`.

_Note: Casing does not matter in the name of your custom index file._

Alternatively, you can use one of the child pages as the index page. In this scenario, trying to navigate to the directory in the generated doc site will redirect you to the child page. To indicate that a child page should be used as an index page, prefix the markdown file name with an "_".

For example, the following source structure will generate the following HTML structure:

```
docs/                         pages/
├── GuideA.md                 ├── index.html (auto-generated)
├── GuideB.md                 ├── GuideA.html
├── SubDirectoryOne/          ├── GuideB.html
│   ├── GuideC.md             ├── SubDirectoryOne/
│   └── GuideD.md             │   ├── index.html (auto-generated)
├── SubDirectoryTwo/          │   ├── GuideC.html
│   ├── index.md              │   ├── GuideD.html
│   ├── GuideE.md             ├── SubDirectoryTwo/
│   └── GuideF.md             │   ├── index.html (generated from index.md)
├── SubDirectoryThree/        │   ├── GuideE.html
│   ├── README.md             │   ├── GuideF.html
│   ├── GuideG.md             ├── SubDirectoryThree/
│   └── GuideH.md             │   ├── index.html (generated from README.md)
└── SubDirectoryFour/         │   ├── GuideG.html
    ├── _GuideI.md            │   └── GuideH.html
    └── GuideJ.md             └── SubDirectoryFour/
                                  ├── GuideI.html (no index.html file - instead GuideI.html is used as index)
                                  └── GuideJ.html
```

## Themes

### Built-In Theme

This plugin comes with its own built-in theme that integrates the markdown pages into the site navigation and renders the markdown content. To use this theme pass `markdown-pages` as the value to the `--theme` option.

### Custom Themes

Alternatively, you can also integrate the extra markdown pages into your own themes.

Markdown pages are rendered using the `page.hbs` template and the page content can be accessed via `model.mdPage.contents`.

The page navigation elements can be accessed via `mdPagesNavigation.children`, similar to how standard navigation items are referenced.

For examples, see `/src/theme/templates/page.hbs` and `/src/theme/layouts/default.hbs`.

## Custom Navigation Label

By default, the navigation label shown above the page links in the navigation controls will display as "Pages". This can be customized by setting the `mdPagesLabel` option.

For example, the following command would rename this label to be "Guides":

```powershell
$ node_modules/.bin/typedoc --out path/to/built/docs path/to/src/ --mdPagesSourcePath path/to/markdown/doc/pages --theme markdown-pages --mdPagesLabel Guides
```

_Note: If your custom label contains spaces, wrap it in double quotes. Don't forget to escape the quotation characters if you're defining an npm script._

## Options

The following options are available and can be used by adding the arguments to your TypeDoc command:

* `--mdPagesSourcePath <path/to/markdown/pages>`<br>
  Specifies the path to the directory where your markdown pages are. This option is required.
* `--mdPagesOutputDirName <output directory name>`<br>
  Specifies the name of the output directory where the rendered HTML files for your markdown pages will be written. Defaults to "pages".
* `--mdPagesLabel <label name>`<br>
  Specifies the navigation label for markdown pages. Defaults to "Pages".
