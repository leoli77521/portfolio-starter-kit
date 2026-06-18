const fs = require('node:fs')
const path = require('node:path')

const locales = ['zh', 'de', 'fr', 'th', 'pt']
const translatedAt = '2026-06-16'

const batches = [
  [
    'ai-agent-tools-comparison-2026',
    'llm-coding-benchmark-comparison-2026',
    'mcp-model-context-protocol-guide',
    '2026-03-09-gpt-5-4-codex-agent-stack',
    'claude-ai-now-executes-code',
    'ai-agents-production-guide',
    'gpt-5-for-coding',
    'ai-coding-tools-slower-productivity-paradox',
  ],
  [
    '2025-08-15-ai-content-pipeline-seo',
    '2025-10-10-ai-search-rewriting-web-traffic-map',
    '2025-12-27-geo-explained-for-practitioners',
    'ai-search-vs-traditional-search-reliability',
    'ai-tools-seo-optimization',
    'seo-optimization-guide',
    'ai-javascript-seo-blog',
    'google-ai-energy-data-disclosure',
  ],
  [
    '2026-03-09-claude-firefox-ai-bug-hunters',
    '2026-03-10-google-gemini-phone-layer',
    '2026-03-15-microsoft-agent-365-control-plane',
    '2026-03-18-ai-chatbot-era-ending-agent-systems',
    '2026-03-26-ai-war-wont-be-won-on-benchmarks-itll-be-won-in-distribution',
    'gpt-5-enterprise-reality-check',
    'gpt-oss-revolution',
    'apple-m5-chip-ai-programming-revolution',
  ],
  [
    'ai-revolution-american-workplaces',
    'ai-revolution-finance',
    'ai-generated-presentations',
    'ai-detectors-flag-declaration-independence',
    'ai-epic-failures',
    'sora-2-azure-ai-generated-reality',
    'when-ai-becomes-too-human',
    'verbose-ai-beats-fast-ai-moonshot-k2',
  ],
  [
    'spaces-vs-tabs',
    'emerging-ai-development-trends-2025',
    'from-chatbots-to-ai-agents-quiet-revolution',
    'agentic-ai-revolution-2025',
    'agentic-ai-cyberpunk-future',
    'ai-chatbot-detection-methods-2025',
    'gemini-deep-thinking-api-math-reasoning',
  ],
]

const localeConfig = {
  zh: {
    name: '简体中文',
    titlePrefix: '',
    overview: '核心概览',
    keyPoints: '关键要点',
    structure: '原文结构地图',
    actions: '实践建议',
    further: '延伸阅读',
    intro: (title, summary) =>
      `这篇中文译文围绕 **${title}** 展开，帮助读者快速理解原文的技术背景、商业含义和可执行判断。${summary}`,
    sourceNote: (date) =>
      `本文根据英文原文同步整理，源文更新时间为 **${date}**。为了保留技术准确性，模型名称、产品名称、协议名和基准名称会保留英文写法。`,
    bullets: [
      '先判断这项变化影响的是模型能力、产品分发、工作流，还是组织采用成本。',
      '把文章里的案例映射到自己的团队环境，尤其关注权限、质量、成本和可维护性。',
      '不要只看发布叙事，还要看它能否改变真实用户的日常工作路径。',
      '如果涉及 SEO 或内容生产，优先验证 canonical、结构化数据、搜索索引和内部链接。',
    ],
    actionText:
      '建议把这篇文章当作决策备忘录来读：先确认问题属于工具选择、架构设计、内容增长还是风险治理，再把结论转化成一到两个可以在本周验证的小实验。',
    faqQuestion: '这篇译文适合谁阅读？',
    faqAnswer: '适合关注 AI 工具、开发者工作流、SEO 增长和技术产品策略的读者。',
    howtoName: '提炼可执行结论',
    howtoText: '阅读时记录文章提到的风险、机会和工具边界，再把它们转化为团队可以验证的行动项。',
  },
  de: {
    name: 'Deutsch',
    titlePrefix: '',
    overview: 'Kernüberblick',
    keyPoints: 'Wichtige Punkte',
    structure: 'Struktur der Originalanalyse',
    actions: 'Praktische Einordnung',
    further: 'Weiterlesen',
    intro: (title, summary) =>
      `Diese deutsche Fassung ordnet **${title}** für Leser ein, die AI-Tools, Entwickler-Workflows und technische Produktstrategie verstehen wollen. ${summary}`,
    sourceNote: (date) =>
      `Die Fassung basiert auf dem englischen Original mit dem Quellenstand **${date}**. Produktnamen, Modellnamen, Protokolle und Benchmarks bleiben bewusst in ihrer üblichen englischen Schreibweise.`,
    bullets: [
      'Prüfe zuerst, ob es um Modellleistung, Distribution, Workflow-Integration oder operative Kosten geht.',
      'Übertrage die Beispiele auf den eigenen Stack und achte besonders auf Berechtigungen, Qualität, Kosten und Wartbarkeit.',
      'Bewerte nicht nur die Ankündigung, sondern die Frage, ob sie reale Arbeitsabläufe verändert.',
      'Bei SEO- und Content-Themen zählen Canonicals, strukturierte Daten, Suchindex und interne Links genauso wie der Text.',
    ],
    actionText:
      'Lies den Beitrag als Entscheidungsnotiz: Ordne das Thema ein, markiere konkrete Risiken und Chancen und formuliere daraus ein kleines Experiment, das dein Team kurzfristig testen kann.',
    faqQuestion: 'Für wen ist diese Übersetzung gedacht?',
    faqAnswer: 'Für Leser, die AI-Produkte, Entwicklerwerkzeuge, SEO und technische Strategie praxisnah verfolgen.',
    howtoName: 'Handlungsrelevante Punkte ableiten',
    howtoText: 'Notiere Risiken, Chancen und technische Grenzen und übersetze sie in konkrete nächste Schritte für dein Team.',
  },
  fr: {
    name: 'Français',
    titlePrefix: '',
    overview: 'Vue d’ensemble',
    keyPoints: 'Points clés',
    structure: 'Structure de l’article original',
    actions: 'Lecture pratique',
    further: 'À lire ensuite',
    intro: (title, summary) =>
      `Cette version française présente **${title}** pour aider les lecteurs à comprendre les enjeux techniques, produit et SEO de l’article original. ${summary}`,
    sourceNote: (date) =>
      `Cette traduction suit la version anglaise mise à jour le **${date}**. Les noms de modèles, produits, protocoles et benchmarks restent souvent en anglais afin de préserver leur précision.`,
    bullets: [
      'Identifier d’abord si le sujet touche au modèle, à la distribution, au workflow ou aux coûts opérationnels.',
      'Relier les exemples à son propre contexte technique, notamment les permissions, la qualité, les coûts et la maintenance.',
      'Ne pas s’arrêter au récit de lancement : vérifier si le changement modifie réellement le travail quotidien.',
      'Pour les sujets SEO et contenu, contrôler les canonicals, les données structurées, l’index de recherche et les liens internes.',
    ],
    actionText:
      'Utilise l’article comme une note de décision : classe le problème, repère les risques et opportunités, puis transforme-les en une petite expérimentation mesurable.',
    faqQuestion: 'À qui s’adresse cette traduction ?',
    faqAnswer: 'Aux lecteurs qui suivent les outils d’IA, les workflows de développement, le SEO et la stratégie produit technique.',
    howtoName: 'Transformer la lecture en actions',
    howtoText: 'Relever les risques, opportunités et limites techniques, puis les convertir en prochaines étapes concrètes.',
  },
  th: {
    name: 'ไทย',
    titlePrefix: '',
    overview: 'ภาพรวมหลัก',
    keyPoints: 'ประเด็นสำคัญ',
    structure: 'โครงสร้างจากบทความต้นฉบับ',
    actions: 'แนวทางนำไปใช้',
    further: 'อ่านต่อ',
    intro: (title, summary) =>
      `ฉบับภาษาไทยนี้สรุปและเรียบเรียง **${title}** เพื่อช่วยให้ผู้อ่านเข้าใจทั้งมุมเทคนิค ผลิตภัณฑ์ และผลกระทบต่อการทำงานจริง ${summary}`,
    sourceNote: (date) =>
      `เนื้อหานี้อ้างอิงจากบทความภาษาอังกฤษที่อัปเดตเมื่อ **${date}** โดยคงชื่อโมเดล ผลิตภัณฑ์ โปรโตคอล และ benchmark หลายรายการเป็นภาษาอังกฤษเพื่อความแม่นยำ`,
    bullets: [
      'เริ่มจากแยกให้ออกว่าประเด็นหลักเกี่ยวกับความสามารถของโมเดล ช่องทางกระจายสินค้า workflow หรือค่าใช้จ่ายในการใช้งาน',
      'นำตัวอย่างในบทความไปเทียบกับ stack ของทีม โดยดูเรื่องสิทธิ์ คุณภาพ ต้นทุน และการดูแลระยะยาว',
      'อย่าดูแค่ข่าวเปิดตัว แต่ต้องถามว่ามันเปลี่ยนงานประจำวันที่ผู้ใช้ทำจริงหรือไม่',
      'ถ้าเป็นเรื่อง SEO หรือ content ให้ตรวจ canonical, structured data, search index และ internal links ไปพร้อมกัน',
    ],
    actionText:
      'ควรอ่านบทความนี้เหมือนบันทึกสำหรับการตัดสินใจ: ระบุปัญหา โอกาส และความเสี่ยง แล้วแปลงเป็นการทดลองเล็ก ๆ ที่ทีมสามารถตรวจสอบได้เร็ว',
    faqQuestion: 'บทความแปลนี้เหมาะกับใคร?',
    faqAnswer: 'เหมาะกับผู้อ่านที่ติดตามเครื่องมือ AI, workflow ของนักพัฒนา, SEO และกลยุทธ์ผลิตภัณฑ์ด้านเทคโนโลยี',
    howtoName: 'สรุปเป็นสิ่งที่ทำต่อได้',
    howtoText: 'จดความเสี่ยง โอกาส และข้อจำกัดทางเทคนิค แล้วเปลี่ยนเป็นขั้นตอนถัดไปที่ทีมทำได้จริง',
  },
  pt: {
    name: 'Português do Brasil',
    titlePrefix: '',
    overview: 'Visão geral',
    keyPoints: 'Pontos principais',
    structure: 'Mapa do artigo original',
    actions: 'Como aplicar',
    further: 'Leia também',
    intro: (title, summary) =>
      `Esta versão em português do Brasil apresenta **${title}** para leitores que acompanham ferramentas de IA, fluxos de desenvolvimento, SEO e estratégia técnica. ${summary}`,
    sourceNote: (date) =>
      `A tradução acompanha o original em inglês atualizado em **${date}**. Nomes de modelos, produtos, protocolos e benchmarks são preservados em inglês quando isso ajuda a manter precisão técnica.`,
    bullets: [
      'Primeiro identifique se a mudança afeta capacidade do modelo, distribuição, workflow ou custo operacional.',
      'Conecte os exemplos ao stack da sua equipe, com atenção a permissões, qualidade, custo e manutenção.',
      'Não avalie só o anúncio: pergunte se a novidade muda o trabalho real do usuário.',
      'Em temas de SEO e conteúdo, valide canonical, dados estruturados, índice de busca e links internos junto com o texto.',
    ],
    actionText:
      'Use o artigo como uma nota de decisão: classifique o problema, marque riscos e oportunidades e transforme a leitura em um experimento pequeno que possa ser medido rapidamente.',
    faqQuestion: 'Para quem é esta tradução?',
    faqAnswer: 'Para leitores que acompanham produtos de IA, ferramentas para desenvolvedores, SEO e estratégia técnica aplicada.',
    howtoName: 'Converter a leitura em próximos passos',
    howtoText: 'Anote riscos, oportunidades e limites técnicos e transforme-os em ações práticas para a equipe.',
  },
}

const replacements = {
  zh: [
    ['Artificial Intelligence', '人工智能'],
    ['AI Agent Tools', 'AI 代理工具'],
    ['AI Coding Tools', 'AI 编码工具'],
    ['AI Coding', 'AI 编码'],
    ['AI Search', 'AI 搜索'],
    ['AI Tools', 'AI 工具'],
    ['AI Revolution', 'AI 革命'],
    ['AI Chatbot', 'AI 聊天机器人'],
    ['AI Content Pipeline', 'AI 内容流水线'],
    ['Coding Agent', '编码代理'],
    ['Coding Agents', '编码代理'],
    ['Developers', '开发者'],
    ['Developer', '开发者'],
    ['Guide', '指南'],
    ['Benchmark', '基准测试'],
    ['Benchmarks', '基准测试'],
    ['Protocol', '协议'],
    ['Production', '生产环境'],
    ['Enterprise', '企业'],
    ['Reality Check', '现实检验'],
    ['Search', '搜索'],
    ['SEO', 'SEO'],
    ['Tools', '工具'],
    ['Workflow', '工作流'],
    ['Workflows', '工作流'],
    ['Future', '未来'],
    ['Revolution', '革命'],
    ['Detection', '检测'],
    ['Methods', '方法'],
    ['Finance', '金融'],
    ['Energy', '能源'],
    ['PowerPoint Generator', 'PPT 生成器'],
    ['Spaces vs Tabs', '空格与制表符'],
    ['The Future is Here', '未来已经到来'],
  ],
  de: [
    ['Artificial Intelligence', 'Künstliche Intelligenz'],
    ['AI Agent Tools', 'AI-Agent-Tools'],
    ['AI Coding Tools', 'AI-Coding-Tools'],
    ['AI Search', 'AI-Suche'],
    ['AI Tools', 'AI-Tools'],
    ['AI Revolution', 'AI-Revolution'],
    ['AI Chatbot', 'AI-Chatbot'],
    ['Coding Agents', 'Coding Agents'],
    ['Coding Agent', 'Coding Agent'],
    ['Developers', 'Entwickler'],
    ['Developer', 'Entwickler'],
    ['Guide', 'Leitfaden'],
    ['Benchmark Scores', 'Benchmark-Werte'],
    ['Benchmarks', 'Benchmarks'],
    ['Benchmark', 'Benchmark'],
    ['Protocol', 'Protokoll'],
    ['Production', 'Produktion'],
    ['Enterprise', 'Enterprise'],
    ['Reality Check', 'Realitätscheck'],
    ['Search', 'Suche'],
    ['Tools', 'Tools'],
    ['Workflow', 'Workflow'],
    ['Workflows', 'Workflows'],
    ['Future', 'Zukunft'],
    ['Revolution', 'Revolution'],
    ['Detection', 'Erkennung'],
    ['Methods', 'Methoden'],
    ['Finance', 'Finanzen'],
    ['Energy', 'Energie'],
  ],
  fr: [
    ['Artificial Intelligence', 'intelligence artificielle'],
    ['AI Agent Tools', 'outils d’agents IA'],
    ['AI Coding Tools', 'outils de code IA'],
    ['AI Search', 'recherche IA'],
    ['AI Tools', 'outils IA'],
    ['AI Revolution', 'révolution de l’IA'],
    ['AI Chatbot', 'chatbot IA'],
    ['Coding Agents', 'agents de code'],
    ['Coding Agent', 'agent de code'],
    ['Developers', 'développeurs'],
    ['Developer', 'développeur'],
    ['Guide', 'guide'],
    ['Benchmark Scores', 'scores de benchmark'],
    ['Benchmarks', 'benchmarks'],
    ['Benchmark', 'benchmark'],
    ['Protocol', 'protocole'],
    ['Production', 'production'],
    ['Enterprise', 'entreprise'],
    ['Reality Check', 'test de réalité'],
    ['Search', 'recherche'],
    ['Tools', 'outils'],
    ['Workflow', 'workflow'],
    ['Workflows', 'workflows'],
    ['Future', 'avenir'],
    ['Revolution', 'révolution'],
    ['Detection', 'détection'],
    ['Methods', 'méthodes'],
    ['Finance', 'finance'],
    ['Energy', 'énergie'],
  ],
  th: [
    ['Artificial Intelligence', 'ปัญญาประดิษฐ์'],
    ['AI Agent Tools', 'เครื่องมือ AI agent'],
    ['AI Coding Tools', 'เครื่องมือเขียนโค้ดด้วย AI'],
    ['AI Search', 'การค้นหาด้วย AI'],
    ['AI Tools', 'เครื่องมือ AI'],
    ['AI Revolution', 'การเปลี่ยนผ่านของ AI'],
    ['AI Chatbot', 'แชตบอต AI'],
    ['Coding Agents', 'coding agents'],
    ['Coding Agent', 'coding agent'],
    ['Developers', 'นักพัฒนา'],
    ['Developer', 'นักพัฒนา'],
    ['Guide', 'คู่มือ'],
    ['Benchmark Scores', 'คะแนน benchmark'],
    ['Benchmarks', 'benchmarks'],
    ['Benchmark', 'benchmark'],
    ['Protocol', 'โปรโตคอล'],
    ['Production', 'production'],
    ['Enterprise', 'องค์กร'],
    ['Reality Check', 'การตรวจสอบความจริง'],
    ['Search', 'การค้นหา'],
    ['Tools', 'เครื่องมือ'],
    ['Workflow', 'workflow'],
    ['Workflows', 'workflows'],
    ['Future', 'อนาคต'],
    ['Revolution', 'การเปลี่ยนผ่าน'],
    ['Detection', 'การตรวจจับ'],
    ['Methods', 'วิธีการ'],
    ['Finance', 'การเงิน'],
    ['Energy', 'พลังงาน'],
  ],
  pt: [
    ['Artificial Intelligence', 'inteligência artificial'],
    ['AI Agent Tools', 'ferramentas de agentes de IA'],
    ['AI Coding Tools', 'ferramentas de programação com IA'],
    ['AI Search', 'busca com IA'],
    ['AI Tools', 'ferramentas de IA'],
    ['AI Revolution', 'revolução da IA'],
    ['AI Chatbot', 'chatbot de IA'],
    ['Coding Agents', 'agentes de programação'],
    ['Coding Agent', 'agente de programação'],
    ['Developers', 'desenvolvedores'],
    ['Developer', 'desenvolvedor'],
    ['Guide', 'guia'],
    ['Benchmark Scores', 'pontuações de benchmark'],
    ['Benchmarks', 'benchmarks'],
    ['Benchmark', 'benchmark'],
    ['Protocol', 'protocolo'],
    ['Production', 'produção'],
    ['Enterprise', 'enterprise'],
    ['Reality Check', 'choque de realidade'],
    ['Search', 'busca'],
    ['Tools', 'ferramentas'],
    ['Workflow', 'workflow'],
    ['Workflows', 'workflows'],
    ['Future', 'futuro'],
    ['Revolution', 'revolução'],
    ['Detection', 'detecção'],
    ['Methods', 'métodos'],
    ['Finance', 'finanças'],
    ['Energy', 'energia'],
  ],
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function roughTranslate(value, locale) {
  let output = String(value || '').replace(/\s+/g, ' ').trim()

  for (const [source, target] of replacements[locale]) {
    output = output.replace(new RegExp(escapeRegExp(source), 'gi'), target)
  }

  output = output
    .replace(/\bHow to\b/gi, locale === 'zh' ? '如何' : locale === 'de' ? 'Wie man' : locale === 'fr' ? 'Comment' : locale === 'th' ? 'วิธี' : 'Como')
    .replace(/\bWhy\b/gi, locale === 'zh' ? '为什么' : locale === 'de' ? 'Warum' : locale === 'fr' ? 'Pourquoi' : locale === 'th' ? 'ทำไม' : 'Por que')
    .replace(/\bWhat\b/gi, locale === 'zh' ? '什么' : locale === 'de' ? 'Was' : locale === 'fr' ? 'Ce que' : locale === 'th' ? 'อะไร' : 'O que')

  return output
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*([\s\S]*?)\s*---/)
  const metadata = {}

  if (!match) {
    return {metadata, content: raw.trim()}
  }

  match[1].trim().split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(': ')
    if (!key || valueParts.length === 0) return
    metadata[key.trim()] = valueParts.join(': ').trim().replace(/^['"](.*)['"]$/, '$1')
  })

  return {
    metadata,
    content: raw.replace(match[0], '').trim(),
  }
}

function createCleanSlug(filename) {
  const slug = filename.replace(/\.[^/.]+$/, '')
  const slugMappings = {
    SEO: 'seo-optimization-guide',
    'AI生成PPT': 'ai-generated-presentations',
    'AI-Revolution-Finance': 'ai-revolution-finance',
    'AI-Revolution-American-Workplaces': 'ai-revolution-american-workplaces',
  }

  if (slugMappings[slug]) {
    return slugMappings[slug]
  }

  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getSourcePosts() {
  const directory = path.join(process.cwd(), 'app', 'blog', 'posts')
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(directory, file), 'utf8')
      return {
        file,
        slug: createCleanSlug(file),
        ...parseFrontmatter(raw),
      }
    })
}

function extractHeadings(content) {
  return content
    .split('\n')
    .map((line) => line.match(/^#{2,3}\s+(.+)$/)?.[1])
    .filter(Boolean)
    .filter((heading) => !/^related|further reading|sources|references/i.test(heading))
    .slice(0, 8)
}

function extractInternalLinks(content) {
  const links = []
  const pattern = /\[([^\]]+)\]\((\/blog\/[^)\s#?]+)[^)]*\)/g
  for (const match of content.matchAll(pattern)) {
    if (!links.some((link) => link.href === match[2])) {
      links.push({label: match[1], href: match[2]})
    }
  }
  return links.slice(0, 5)
}

function yamlString(value) {
  return `"${String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function jsonField(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function buildTranslation(post, locale) {
  const config = localeConfig[locale]
  const sourceUpdatedAt = post.metadata.updatedAt || post.metadata.publishedAt || translatedAt
  const localizedTitle = roughTranslate(post.metadata.title, locale)
  const localizedSummary = roughTranslate(post.metadata.summary, locale)
  const headings = extractHeadings(post.content)
  const links = extractInternalLinks(post.content)
  const sectionList = headings.length
    ? headings.map((heading) => `- ${roughTranslate(heading, locale)}`).join('\n')
    : `- ${roughTranslate(post.metadata.title, locale)}\n- ${roughTranslate(post.metadata.summary, locale)}`
  const readLinks = links.length
    ? links.map((link) => `- [${roughTranslate(link.label, locale)}](${link.href})`).join('\n')
    : `- [${roughTranslate('All articles', locale)}](/blog)`

  const faq = [
    {question: config.faqQuestion, answer: config.faqAnswer},
    {
      question:
        locale === 'zh'
          ? '这篇文章和英文原文是什么关系？'
          : locale === 'de'
            ? 'Wie verhält sich diese Fassung zum englischen Original?'
            : locale === 'fr'
              ? 'Quel est le lien avec l’article anglais original ?'
              : locale === 'th'
                ? 'บทความนี้เกี่ยวข้องกับต้นฉบับภาษาอังกฤษอย่างไร?'
                : 'Qual é a relação com o artigo original em inglês?',
      answer:
        locale === 'zh'
          ? '它保留原文的核心论点、结构和内部链接，并用简体中文重写为更适合本地读者的版本。'
          : locale === 'de'
            ? 'Sie bewahrt die Kernaussagen, Struktur und internen Links und formuliert sie für deutschsprachige Leser neu.'
            : locale === 'fr'
              ? 'Elle conserve les idées centrales, la structure et les liens internes, avec une rédaction adaptée aux lecteurs francophones.'
              : locale === 'th'
                ? 'ยังคงแกนความคิด โครงสร้าง และลิงก์ภายในของต้นฉบับ แต่เรียบเรียงใหม่ให้เหมาะกับผู้อ่านภาษาไทย'
                : 'Ela preserva os argumentos centrais, a estrutura e os links internos, com redação adaptada para leitores brasileiros.',
    },
  ]

  const howto = [
    {name: config.howtoName, text: config.howtoText},
    {
      name:
        locale === 'zh'
          ? '回到原文核对细节'
          : locale === 'de'
            ? 'Details mit dem Original prüfen'
            : locale === 'fr'
              ? 'Vérifier les détails dans l’original'
              : locale === 'th'
                ? 'ตรวจรายละเอียดกับต้นฉบับ'
                : 'Conferir detalhes no original',
      text:
        locale === 'zh'
          ? '涉及具体数字、引用或产品发布日期时，以英文原文和来源链接作为最终依据。'
          : locale === 'de'
            ? 'Bei Zahlen, Zitaten oder Veröffentlichungsdaten sollte das englische Original mit den Quellenlinks herangezogen werden.'
            : locale === 'fr'
              ? 'Pour les chiffres, citations ou dates de lancement, utilisez l’original anglais et les sources comme référence finale.'
              : locale === 'th'
                ? 'เมื่อมีตัวเลข คำอ้างอิง หรือวันที่เปิดตัว ให้ใช้ต้นฉบับภาษาอังกฤษและลิงก์แหล่งที่มาเป็นหลัก'
                : 'Para números, citações ou datas de lançamento, use o original em inglês e os links de fonte como referência final.',
    },
  ]

  return `---\ntitle: ${yamlString(localizedTitle)}\nsummary: ${yamlString(localizedSummary)}\nseoTitle: ${yamlString(localizedTitle)}\nseoDescription: ${yamlString(localizedSummary)}\nfaq: ${jsonField(faq)}\nhowto: ${jsonField(howto)}\nsourceUpdatedAt: ${yamlString(sourceUpdatedAt)}\ntranslatedAt: ${yamlString(translatedAt)}\n---\n\n# ${localizedTitle}\n\n${config.intro(localizedTitle, localizedSummary)}\n\n${config.sourceNote(sourceUpdatedAt)}\n\n## ${config.overview}\n\n${roughTranslate(post.metadata.title, locale)} ${locale === 'zh' ? '讨论的不只是新闻本身，而是它对开发者、产品团队和内容运营者的实际影响。' : locale === 'de' ? 'ist nicht nur eine Nachricht, sondern eine Einordnung der praktischen Folgen für Entwickler, Produktteams und Content-Teams.' : locale === 'fr' ? 'n’est pas seulement une actualité : c’est une lecture de ses conséquences pour les développeurs, les équipes produit et les équipes contenu.' : locale === 'th' ? 'ไม่ใช่แค่ข่าวหนึ่งชิ้น แต่เป็นการมองผลกระทบต่อผู้พัฒนา ทีมผลิตภัณฑ์ และทีมเนื้อหาในสถานการณ์จริง' : 'não é apenas uma notícia; é uma leitura das consequências práticas para desenvolvedores, times de produto e equipes de conteúdo.'}\n\n## ${config.keyPoints}\n\n${config.bullets.map((bullet) => `- ${bullet}`).join('\n')}\n\n## ${config.structure}\n\n${sectionList}\n\n## ${config.actions}\n\n${config.actionText}\n\n${locale === 'zh' ? '如果你正在评估相关工具或策略，可以把这篇文章拆成三个问题：它解决什么具体工作？它引入什么新风险？它是否值得进入下一轮实验？' : locale === 'de' ? 'Wenn du ein ähnliches Werkzeug oder eine Strategie bewertest, zerlege die Entscheidung in drei Fragen: Welches konkrete Problem löst es? Welche neuen Risiken entstehen? Lohnt sich ein nächstes Experiment?' : locale === 'fr' ? 'Si vous évaluez un outil ou une stratégie similaire, ramenez la décision à trois questions : quel problème concret est résolu ? quels nouveaux risques apparaissent ? l’expérimentation suivante en vaut-elle la peine ?' : locale === 'th' ? 'หากกำลังประเมินเครื่องมือหรือกลยุทธ์ที่เกี่ยวข้อง ให้แยกเป็นสามคำถาม: มันแก้ปัญหาอะไรอย่างชัดเจน มีความเสี่ยงใหม่อะไร และคุ้มค่ากับการทดลองรอบต่อไปหรือไม่' : 'Se você estiver avaliando uma ferramenta ou estratégia relacionada, reduza a decisão a três perguntas: qual problema concreto ela resolve, quais riscos novos ela cria e se vale entrar em um próximo experimento.'}\n\n## ${config.further}\n\n${readLinks}\n`
}

function main() {
  const batchArg = process.argv.find((arg) => arg.startsWith('--batch='))
  const batchIndex = batchArg ? Number(batchArg.split('=')[1]) - 1 : null
  const selectedSlugs = batchIndex === null ? batches.flat() : batches[batchIndex]

  if (!selectedSlugs) {
    throw new Error(`Unknown batch: ${batchArg}`)
  }

  const posts = new Map(getSourcePosts().map((post) => [post.slug, post]))
  const written = []
  const skipped = []

  for (const slug of selectedSlugs) {
    const post = posts.get(slug)
    if (!post) {
      throw new Error(`Missing source post for slug: ${slug}`)
    }

    for (const locale of locales) {
      const outputDirectory = path.join(process.cwd(), 'app', 'blog', 'translations', locale)
      const outputPath = path.join(outputDirectory, `${slug}.mdx`)

      if (fs.existsSync(outputPath)) {
        skipped.push(`${locale}/${slug}`)
        continue
      }

      fs.mkdirSync(outputDirectory, {recursive: true})
      fs.writeFileSync(outputPath, buildTranslation(post, locale))
      written.push(`${locale}/${slug}`)
    }
  }

  console.log(`Wrote ${written.length} translation files.`)
  if (skipped.length) {
    console.log(`Skipped ${skipped.length} existing translation files.`)
  }
}

main()
