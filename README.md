<h1 align="center">Welcome to zip-build 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/zip-build" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/zip-build.svg">
  </a>
  <a href="https://github.com/tribal2/zip-build#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/tribal2/zip-build/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/tribal2/zip-build/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/tribal2/zip-build" />
  </a>
  <a href="https://twitter.com/r_tribaldos" target="_blank">
    <img alt="Twitter: r\_tribaldos" src="https://img.shields.io/twitter/follow/r_tribaldos.svg?style=social" />
  </a>
</p>

> Node package to zip your build directory and name it according to your package.json name and version.

## Install

```sh
$ npm install --save-dev zip-build
```

## Usage

```sh
$ zip-build --help

  #  zip-build <build-dir> <zip-dir> [options]
  #
  #  Positionals:
  #    build-dir  Directory of your build output         [default: "build"]
  #    zip-dir    Directory for your zipped backup        [default: "dist"]
  #
  #  Options:
  #        --version  Show version number                         [boolean]
  #    -h, --help     Show help                                   [boolean]
  #    -f, --format   Format of output file
  #                       [string] [choices: "zip", "tar"] [default: "zip"]
  #    -n, --name     Ask for output archive filename
  #                                              [boolean] [default: false]
  #    -t, --template Template for output archive filename using variables
  #                   from your package.json file (eg: name, version,
  #                   license, description, author, etc.)
  #                   [string] [default: %NAME%_%VERSION%_%TIMESTAMP%.%EXT%]
  #    -s, --subDir   Creates a directory inside the zip file where all
  #                   files gonna be
  #                   [string] [default: '']
  #
  #  Examples:
  #  (1) Using defaults:
  #  $ index.js                      Zip 'build' directory and put archive
  #                                  under 'dist' directory.
  #
  #  (2) Using your own directory names:
  #  $ index.js out backup           Zip 'out' directory and put archive
  #                                  under 'backup' directory.
  #
  #  (3) Using your own directory names and TAR format:
  #  $ index.js out backup -f tar    Archive 'out' directory and put
  #                                  archive under 'backup' directory
  #                                  compressed with TAR.
```

Include it as part of your npm build workflow:
```javascript
//package.json
  {
    "name": "your-project",
    // ...
    "scripts": {
      // ...
      "build": "build && zip-build",
      // ...
    },
    // ...
  }
```

## Author

👤 **Ricardo Tribaldos (https://barustudio.com)**

* Github: [@tribal2](https://github.com/tribal2)
* Twitter: [@r_tribaldos](https://twitter.com/r_tribaldos)
* LinkedIn: [@rtribaldos](https://linkedin.com/in/rtribaldos)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Ricardo Tribaldos (https://barustudio.com)](https://github.com/tribal2).<br />
This project is [MIT](https://github.com/tribal2/zip-build/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_