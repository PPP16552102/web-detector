import { existsSync, readdirSync } from 'node:fs'
import dts from 'rollup-plugin-dts'

if (!existsSync('temp/packages')) {
  console.warn(
    'no temp dts files found. run `tsc -p tsconfig.build.json --noCheck` first.',
  )
  process.exit(1)
}

const packages = readdirSync('temp/packages')
const targets = process.env.TARGETS ? process.env.TARGETS.split(',') : null
const targetPackages = targets
  ? packages.filter(pkg => targets.includes(pkg))
  : packages

export default targetPackages.map(
  /** @returns {import('rollup').RollupOptions} */ pkg => {
    return {
      input: `./temp/packages/${pkg}/src/index.d.ts`,
      output: {
        file: `packages/${pkg}/dist/${pkg}.d.ts`,
        format: 'es',
      },
      plugins: [dts()],
      onwarn: (msg, warn) => {
        if (msg.code === 'UNRESOLVED_IMPORT' && !msg.exporter.startsWith('.')) {
          return
        }
        warn(msg)
      },
    }
  },
)
