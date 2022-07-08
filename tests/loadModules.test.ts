import { loadModules } from '../src'
import Post from './__fixtures__/models/Post.model'
import User from './__fixtures__/models/User.model'

describe('loadModules', (): void => {
  it('load modules deeply in a directory', async (): Promise<void> => {
    const modules = await loadModules('./tests/__fixtures__')

    expect(modules).toEqual([
      {
        location: expect.stringMatching(/__fixtures__\/error.ts/),
        error: new TypeError('ErrorDude.error is not a function'),
        type: 'file'
      },
      {
        location: expect.stringMatching(/__fixtures__\/level1.js/),
        exports: { js: 1 },
        type: 'file'
      },
      {
        location: expect.stringMatching(/__fixtures__\/level1.ts/),
        exports: { ts: 1 },
        type: 'file'
      },
      {
        location: expect.stringMatching(/__fixtures__\/level2\/level2.js/),
        exports: { js: 2 },
        type: 'file'
      },
      {
        location: expect.stringMatching(/__fixtures__\/level2\/level2.ts/),
        exports: { ts: 2 },
        type: 'file'
      },
      {
        location: expect.stringMatching(/__fixtures__\/level2\/indexed\/index.js/),
        exports: { indexed: true },
        type: 'index'
      },
      {
        location: expect.stringMatching(/__fixtures__\/models\/Post.model.ts/),
        exports: Post,
        type: 'file'
      },
      {
        location: expect.stringMatching(/__fixtures__\/models\/User.model.ts/),
        exports: User,
        type: 'file'
      },
      {
        location: expect.stringMatching(/__fixtures__\/package\/src\/index.js/),
        exports: { package: true },
        type: 'package'
      }
    ])
  })

  describe('options', (): void => {
    describe('onlyDefault', (): void => {
      it('loads all if false', async (): Promise<void> => {
        const modules = await loadModules('./tests/__fixtures__', { onlyDefault: false })

        expect(modules).toEqual([
          {
            location: expect.stringMatching(/__fixtures__\/error.ts/),
            error: new TypeError('ErrorDude.error is not a function'),
            type: 'file'
          },
          {
            location: expect.stringMatching(/__fixtures__\/level1.js/),
            exports: { js: 1, default: { js: 1 } },
            type: 'file'
          },
          {
            location: expect.stringMatching(/__fixtures__\/level1.ts/),
            exports: { extra: 'ts-extra', default: { ts: 1 } },
            type: 'file'
          },
          {
            location: expect.stringMatching(/__fixtures__\/level2\/level2.js/),
            exports: { js: 2, default: { js: 2 } },
            type: 'file'
          },
          {
            location: expect.stringMatching(/__fixtures__\/level2\/level2.ts/),
            exports: { extra: 'ts-extra', default: { ts: 2 } },
            type: 'file'
          },
          {
            location: expect.stringMatching(/__fixtures__\/level2\/indexed\/index.js/),
            exports: { indexed: true, default: { indexed: true } },
            type: 'index'
          },
          {
            location: expect.stringMatching(/__fixtures__\/models\/Post.model.ts/),
            exports: { default: Post },
            type: 'file'
          },
          {
            location: expect.stringMatching(/__fixtures__\/models\/User.model.ts/),
            exports: { default: User },
            type: 'file'
          },
          {
            location: expect.stringMatching(/__fixtures__\/package\/src\/index.js/),
            exports: { package: true, default: { package: true } },
            type: 'package'
          }
        ])
      })
    })

    describe('conventionPrefix', (): void => {
      it('loads only modules with file name convetion prefix', async (): Promise<void> => {
        const modules = await loadModules('./tests/__fixtures__', { conventionPrefix: 'model' })

        expect(modules).toEqual([
          {
            location: expect.stringMatching(/__fixtures__\/models\/Post.model.ts/),
            exports: Post,
            type: 'file'
          },
          {
            location: expect.stringMatching(/__fixtures__\/models\/User.model.ts/),
            exports: User,
            type: 'file'
          }
        ])
      })
    })
  })
})
