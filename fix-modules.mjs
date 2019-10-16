/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 15.10.2019
 * Time: 10:27
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagesToFix = ['lodash-es']

for (const pkg of packagesToFix) {
  const pkgJsonPath = path.join(__dirname, '..', 'node_modules', pkg, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath).toString())
  pkgJson.type = 'module'
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
  console.log(`Fixed ${pkg}`)
}
console.log('All done')
