const translatedPostSlugsByLocale = Object.freeze({
  zh: Object.freeze([
    '2026-04-02-claw-code-ai-coding-agent-architecture',
    '2026-04-02-rust-python-ai-agent-runtime-architecture',
    '2026-04-02-tooling-permissions-mcp-coding-agents',
    '2026-04-02-hooks-plugins-sessions-ai-agents',
    '2026-04-02-clean-room-rewrites-parity-audits-ai-agents',
  ]),
  de: Object.freeze([
    '2026-04-02-claw-code-ai-coding-agent-architecture',
    '2026-04-02-rust-python-ai-agent-runtime-architecture',
    '2026-04-02-tooling-permissions-mcp-coding-agents',
    '2026-04-02-hooks-plugins-sessions-ai-agents',
    '2026-04-02-clean-room-rewrites-parity-audits-ai-agents',
  ]),
  fr: Object.freeze([
    '2026-04-02-claw-code-ai-coding-agent-architecture',
    '2026-04-02-rust-python-ai-agent-runtime-architecture',
    '2026-04-02-tooling-permissions-mcp-coding-agents',
    '2026-04-02-hooks-plugins-sessions-ai-agents',
    '2026-04-02-clean-room-rewrites-parity-audits-ai-agents',
  ]),
  th: Object.freeze([
    '2026-04-02-claw-code-ai-coding-agent-architecture',
    '2026-04-02-rust-python-ai-agent-runtime-architecture',
    '2026-04-02-tooling-permissions-mcp-coding-agents',
    '2026-04-02-hooks-plugins-sessions-ai-agents',
    '2026-04-02-clean-room-rewrites-parity-audits-ai-agents',
  ]),
  pt: Object.freeze([
    '2026-04-02-claw-code-ai-coding-agent-architecture',
    '2026-04-02-rust-python-ai-agent-runtime-architecture',
    '2026-04-02-tooling-permissions-mcp-coding-agents',
    '2026-04-02-hooks-plugins-sessions-ai-agents',
    '2026-04-02-clean-room-rewrites-parity-audits-ai-agents',
  ]),
})

function hasKnownPostTranslation(slug, locale) {
  return Boolean(translatedPostSlugsByLocale[locale]?.includes(String(slug || '').trim()))
}

module.exports = {
  hasKnownPostTranslation,
  translatedPostSlugsByLocale,
}
