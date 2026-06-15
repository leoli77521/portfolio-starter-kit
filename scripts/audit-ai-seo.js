#!/usr/bin/env node

const { runAudit } = require('../app/lib/seo-audit')

if (require.main === module) {
  const report = runAudit({ rootDir: process.cwd() })
  console.log(JSON.stringify(report, null, 2))
}

module.exports = {
  runAudit,
}
