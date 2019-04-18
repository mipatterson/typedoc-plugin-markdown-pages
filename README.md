# typedoc-plugin-markdown-pages

> A [TypeDoc](https://github.com/TypeStrong/typedoc) plugin that lets you integrate custom markdown pages into your documentation output

[![npm](https://img.shields.io/npm/v/typedoc-plugin-markdown-pages.svg?color=brightgreen)](https://www.npmjs.com/package/typedoc-plugin-markdown-pages)
[![build](https://img.shields.io/circleci/project/github/mipatterson/typedoc-plugin-markdown-pages/develop.svg)](https://circleci.com/gh/mipatterson/typedoc-plugin-markdown-pages/tree/develop)
[![coverage](https://img.shields.io/codecov/c/github/mipatterson/typedoc-plugin-markdown-pages/develop.svg)](https://codecov.io/gh/mipatterson/typedoc-plugin-markdown-pages)

> ⚠️ While this plugin is functional, it is still a work in progress and undergoing active development.

## Installation

```powershell
$ npm install typedoc-plugin-markdown-pages --save-dev
```

## Usage

After installing the plugin, add the `mdPagesSourceDir` option to your TypeDoc command. This option should point to the directory of your markdown files.

The following command will parse all the markdown files in the `/path/to/markdown/doc/pages` directory and add them as separate documentation pages to the TypeDoc output.

```powershell
$ node_modules/.bin/typedoc --out path/to/built/docs path/to/src/ --mdPagesSourceDir path/to/markdown/doc/pages
```

## Directory Structure

The directory structure of the source directory you point to with the `mdPagesSourceDir` option will determine how the pages are output in the TypeDoc build. For the most part, the output structure will match the input.

For example, consider the following documentation structure:

```
docs/
┠── GuideA.md
┠── GuideB.md
┠── CustomWorkflowOne/
┃   ┠── GuideC.md
┃   ┖── GuideD.md
┠── CustomWorkflowOne/
┃   ┠── index.md
┃   ┠── GuideC.md
┃   ┖── GuideD.md
┖── CustomWorkflowOne/
    ┠── README.md
    ┠── GuideC.md
    ┖── GuideD.md
```

The above documentation structure will produce the following HTML output structure:

```
pages/
┠── index.html
┠── GuideA.html
┠── GuideB.html
┠── CustomWorkflowOne/
┃   ┠── index.html
┃   ┠── GuideC.html
┃   ┖── GuideD.html
┠── CustomWorkflowOne/
┃   ┠── index.html
┃   ┠── GuideC.html
┃   ┖── GuideD.html
┖── CustomWorkflowOne/
    ┠── index.html
    ┠── GuideC.html
    ┖── GuideD.html
```

Each markdown source file resulted in an associated HTML output file.

## Page Naming

The file names of the markdown source files will be used to determine the names of the pages used in the documentation navigation and breadcrumbs. Markdown source files should use Pascal-cased in order to achieve nicely-named page names in the documentation output.

For example, a markdown file named "HowToDoSomething.md" will be displayed as "How To Do Something" in the documentation site's navigation and breadcrumbs.

## Custom Index Files

Each directory in the output will have an `index.html` file. By default, this file is auto-generated to include a list of links to the "child" pages inside that directory. You can provide your own custom index file by placing a markdown file in the source directory that named either `index.md` or `readme.md`.

_Note: Casing does not matter in the name of your custom index file._

## Navigation Label

By default, the navigation label shown above the page links in the navigation controls will display as "Pages". This can be customized by setting the `mdPagesLabel` option.

For example, the following command would rename this label to be "Guides":

```powershell
$ node_modules/.bin/typedoc --out path/to/built/docs path/to/src/ --mdPagesSourceDir path/to/markdown/doc/pages --mdPagesLabel Guides
```

_Note: If your custom label contains spaces, wrap it in double quotes. Don't forget to escape the quotation characters if you're defining an npm script._

## Options

The following options are available:

| Option           | Description                                                      | Default Value | Example                                    |
| ---------------- | ---------------------------------------------------------------- | ------------- | ------------------------------------------ |
| mdPagesSourceDir | The path to the directory where markdown pages will be read from | n/a           | `--mdPagesSourceDir ./custom/path/to/docs` |
| mdPagesLabel     | The navigation label for markdown pages                          | "Pages"       | `--mdPagesLabel \"Custom Label\"`          |