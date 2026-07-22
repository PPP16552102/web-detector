import { parseArgs } from 'node:util'
import pkg from '../package.json' with { type: 'json' }
import { dirname, format, relative, resolve } from 'node:path'
import esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const {
  values: { format: rawFormat, prod, inline },
  positionals,
} = parseArgs({
  allowPositionals: true,
  options: {
    format: {
      type: 'string',
      short: 'f',
      default: 'global',
    },
    prod: {
      type: 'boolean',
      short: 'p',
      default: false,
    },
    inline: {
      type: 'boolean',
      short: 'i',
      default: false,
    },
  },
})

const targets = positionals.length ? positionals : []

const outputFormat = rawFormat.startsWith('global')
  ? 'iife'
  : rawFormat === 'cjs'
    ? 'cjs'
    : 'esm'

for (const target of targets) {
  const pkgPath = `../packages/${target}`
  const pkg = await import(`${pkgPath}/package.json`, {
    with: { type: 'json' },
  })
  const outfile = resolve(
    __dirname,
    `${pkgPath}/dist/${target}.${rawFormat}.${prod ? `prod.` : ''}js`,
  )

  const relativeOutfile = relative(process.cwd(), outfile)

  /** @type {Array<import('esbuild').Plugin>} */
  const plugins = [
    {
      name: 'log-rebuild',
      setup(build) {
        build.onEnd(() => {
          console.log(`built: ${relativeOutfile}`)
        })
      },
    },
  ]

  esbuild
    .context({
      entryPoints: [resolve(__dirname, `${pkgPath}/src/index.ts`)],
      outfile,
      bundle: true,
      sourcemap: true,
      format: outputFormat,
      plugins,
      globalName: pkg?.buildOptions?.name,
      platform: rawFormat === 'cjs' ? 'node' : 'browser',
      define: {
        __VERSION__: `"${pkg.version}"`,
      },
    })
    .then(ctx => ctx.watch())
}
