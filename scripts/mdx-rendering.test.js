const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const source = fs.readFileSync(path.join(process.cwd(), 'app/components/mdx.tsx'), 'utf8')

test('MDX keeps inline code phrasing-only and renders fenced blocks outside paragraphs', () => {
  assert.match(source, /function Pre\(/)
  assert.match(source, /pre: Pre/)
  assert.match(source, /function Code[\s\S]*?<code className=\{className\}/)
  assert.match(source, /<CodeBlock[\s\S]*?rawCode=\{codeString\}/)
})
