# Shrinkhack

The usefulness of this module will (hopefully) be short lived. This works around some bugs in npm to allow you to [shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap) without extra manual work.

## What?

This module will clean up all `extraneous` packages in `node_modules`.

## Why?

I <3 [Shrinkpack](https://github.com/JamieMason/shrinkpack). It's a fantastic tool that has sped up installs for my projects, both locally and in CI.

Unfortunately, there are some problems currently that prevent every project from being able to use it, including some of mine.

### Problems

1. Shrinkwrap [requires a minimum npm version of `3.10.4`](https://github.com/JamieMason/shrinkpack/issues/58#issuecomment-231796840)

2. npm versions < `3.10.6` && => `3.10.4` have a bug that will install all `devDependencies` associated with any module you rely on. This means a _lot_ of extraneous dependencies end up in `node_modules`.

3. Number 2 was fixed in npm `3.10.6`. BUT, [`3.10.6` introduced a bug that causes dependency trees with cycles to fail during shrinkwrap](https://github.com/npm/npm/issues/13327).

4. `npm prune` _would_ solve the problem this module addresses, but [it has not been updated for the flat dependency tree in npm 3](https://github.com/npm/npm/issues/11167#issuecomment-172133960), so it fails to prune all modules that it should.

## How?

This module does the following:

1. Run `npm list` (which _does_ identify the correct list of `extraneous` packages, unlike `npm prune`)
2. Removes all those packages from `node_modules`
3. Runs again, which is necessary due to npm's flat dependency tree. Once a package is removed in a prior run, more dependencies are then identified by `npm list` as extraneous.
