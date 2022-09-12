# Module Loader

[![npm version](https://badge.fury.io/js/@universal-packages%2Fmodule-loader.svg)](https://www.npmjs.com/package/@universal-packages/module-loader)
[![Testing](https://github.com/universal-packages/universal-module-loader/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-module-loader/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-module-loader/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-module-loader)

Imports deeply all modules in a directory as a list to use later, this is useful when you are expecting a arbitrary amount of modules that behaves the same and can be used without the need of importing them manually or even importing them manually will be a hasel, it can also be useful to activate modules (probably with decorators) that need to be activated before being imported manually later.

## Install

```shell
npm install @universal-packages/module-loader
```

## loadModules()

Load recusively a directory until it finds a package, index file or just a file in that order, If it finds a package.json it will just import the main file in the package, If it find and index file it will just import that index file, If any of above it will just import files deep in the hierarchy.

```js
import { loadModules } from '@universal-packages/module-loader'

async function test() {
  const modules = await loadconfig('./modules')

  console.log(modules)
}

test()

// > [
// >   { location: './modules/module.js' exports: { load: Function, unload: Function }, type: 'file' }
// >   { location: './modules/utils.js' exports: { pad: Function }, type: 'file' }
// >   ...
// > ]
```

## Options

- **`onlyDefault`** `boolean`
  When loading the module directly only set `exports` as the `exports.default`, usefull if you are importing classes or components that predominate in the module.

- **`conventionPrefix`** `string`
  Only load modules that follow the convention `<module>.<conventionPrefix>.js`, exp: `User.model.js`.

  ```js
  import { loadModules } from '@universal-packages/module-loader'

  async function test() {
    const modules = await loadconfig('./modules', { conventionPrefix:  })

    console.log(modules)
  }

  test()

  // > [
  // >   { location: './models/Post.model.js' exports: [class Post], type: 'file' }
  // >   { location: './models/User.model.js' exports: [class User], type: 'file' }
  // >   ...
  // > ]
  ```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
