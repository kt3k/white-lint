# white-lint v1.1.0

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
        ignore: [],
        globals: [],
        parser: "parser"
    }
})

// execute lint as a node API
myLint.lint()

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
