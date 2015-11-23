# white-lint v1.1.1 [![Build Status](https://travis-ci.org/kt3k/white-lint.svg?branch=master)](https://travis-ci.org/kt3k/white-lint) [![codecov.io](https://codecov.io/github/kt3k/white-lint/coverage.svg?branch=master)](https://codecov.io/github/kt3k/white-lint?branch=master)

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
            "options": "..."
        },
        parser: "parser"
    }
})

// execute lint as a cli
myLint.lintAsCli()
```

# Options

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
