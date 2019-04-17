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

## Options

The following options are available:

| Option           | Description                                                      | Default Value | Example                                    |
| ---------------- | ---------------------------------------------------------------- | ------------- | ------------------------------------------ |
| mdPagesSourceDir | The path to the directory where markdown pages will be read from | n/a           | `--mdPagesSourceDir ./custom/path/to/docs` |
| mdPagesLabel     | The navigation label for markdown pages                          | "Pages"       | `--mdPagesLabel \"Custom Label\"`          |