import decisions from '@/data/seo-indexing-decisions.json'

export type SeoIndexingDecision = 'index' | 'noindex'

type DecisionRecord = {
  path: string
  decision: SeoIndexingDecision
  target: string
  rationale: string
  nextAction: string
}

const typedDecisions: DecisionRecord[] = decisions.decisions.map((decision) => ({
  ...decision,
  decision: decision.decision as SeoIndexingDecision,
}))

const decisionByPath = new Map<string, DecisionRecord>(
  typedDecisions.map((decision) => [decision.path, decision])
)

function normalizePath(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0] || '/'
  return path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
}

export function getReviewedSeoDecision(pathname: string): DecisionRecord | undefined {
  return decisionByPath.get(normalizePath(pathname))
}

export function getTemplateSeoDecision(tech: string, role: string): SeoIndexingDecision {
  return getReviewedSeoDecision(`/templates/${tech}/${role}`)?.decision || (decisions.defaults.templateDetail as SeoIndexingDecision)
}

export function shouldIndexTemplate(tech: string, role: string): boolean {
  return getTemplateSeoDecision(tech, role) === 'index'
}

export function getSeoDecisionRecords(): DecisionRecord[] {
  return typedDecisions
}
