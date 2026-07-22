import path from 'node:path'
import fs from 'node:fs'
import { parseArgs } from 'node:util'
import { fuzzyMatchTarget, targets as allTargets, exec } from './utils.js'
import { cpus } from 'node:os'

const {
  values: {
    size: writeSize,
    all: buildAllMatching,
    devOnly,
    prodOnly,
    formats,
  },
  positionals: targets,
} = parseArgs({
  allowPositionals: true,
  options: {
    all: {
      type: 'boolean',
      short: 'a',
    },
    size: {
      type: 'boolean',
    },
    devOnly: {
      type: 'boolean',
      short: 'd',
    },
    prodOnly: {
      type: 'boolean',
      short: 'p',
    },
    formats: {
      type: 'string',
      short: 'f',
    },
  },
})

const sizeDir = path.resolve('temp/size')

run()

async function run() {
  if (writeSize) fs.mkdirSync(sizeDir, { recursive: true })

  const solvedTargets = targets?.length
    ? fuzzyMatchTarget(targets, buildAllMatching)
    : allTargets
  await buildAll(solvedTargets)
  try {
  } catch (error) {}
}

/**
 * Builds all the targets in parallel.
 * @param {Array<string>} targets - An array of targets to build.
 * @returns {Promise<void>} - A promise representing the build process.
 */
async function buildAll(targets) {
  await runParallel(cpus().length, targets, build)
}

/**
 * Runs iterator function in parallel.
 * @template T - The type of items in the data source
 * @param {number} maxConcurrency - The maximum concurrency.
 * @param {Array<T>} source - The data source
 * @param {(item: T) => Promise<void>} iteratorFn - The iteratorFn
 * @returns {Promise<void[]>} - A Promise array containing all iteration results.
 */
async function runParallel(maxConcurrency, source, iteratorFn) {
  /**@type {Promise<void>[]} */
  const ret = []
  /**@type {Promise<void>[]} */
  const executing = []

  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e = p.then(() => {
        executing.splice(executing.indexOf(e), 1)
      })

      executing.push(e)

      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }

  return Promise.all(ret)
}

/**
 * Builds the target.
 * @param {string} target - The target to build.
 * @returns {Promise<void>} - A promise representing the build process.
 */
async function build(target) {
  console.log('build -> ', target)
  const pkgPath = path.resolve(`packages/${target}/package.json`)
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  const env =
    (pkg.buildOptions && pkg.buildOptions.env) ||
    (devOnly ? 'development' : 'production')

  await exec(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `NODE_ENV:${env}`,
        `TARGET:${target}`,
        formats ? `FORMATS:${formats}` : ``,
        prodOnly ? `PROD_ONLY:true` : ``,
      ]
        .filter(Boolean)
        .join(','),
    ],
    {
      stdio: 'inherit',
    },
  )
}
