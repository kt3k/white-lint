# white-lint v1.2.1 [![Build Status](https://travis-ci.org/kt3k/white-lint.svg?branch=master)](https://travis-ci.org/kt3k/white-lint) [![codecov.io](https://codecov.io/github/kt3k/white-lint/coverage.svg?branch=master)](https://codecov.io/github/kt3k/white-lint?branch=master)

> A tool for creating a cli tool like [standard](https://github.com/feross/standard).

# Install

```
npm install --save white-lint
```

# Usage

```js
var myLint = require('white-lint')({
    cmdName: "snowball",
    version: "1.0.0",
    cmdOptions: {
        eslintrc: {
            "extends": "eslint-config-foobar"
        },
        parser: "parser"
    }
})

// execute lint as a cli
myLint.lintAsCli()
```

The above example works as a lint checker similar to [standard](https://github.com/feross/standard), but using `eslint-config-foobar` shareable config in this case.

# How cli works

Here is the cli help message.

```
Usage:
    $(cmdName) <flags> [FILES...]

    If FILES is omitted, then all JavaScript source files (*.js, *.jsx) in the current
    working directory are checked, recursively.

    Certain paths (node_modules/, .git/, coverage/, *.min.js, bundle.js) are
    automatically ignored.

Flags:
        --global    Declare global variable (can be set multiple times)
        --parser    Use custom js parser (e.g. babel-eslint)
    -2, --2         Use 2 space indent
    -4, --4         Use 4 space indent
        --tab       Use tab indent
        --semi      Use semicolon
        --no-semi   Don't use semicolon
    -h, --help      Show usage information
    -v, --version   Show current version
```

# Tool Options

## cmdName: String

The name of the command.

## version: String

The version name.

## cmdOptions: Object

The default options for the command.

### cmdOptions.eslintrc: Object

The default contents of the eslint config.

### cmdOptions.parser: String

The parser.

# License

MIT
