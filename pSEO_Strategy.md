# Portfolio Starter Kit 程序化 SEO (pSEO) 策略

## 1. 策略核心目标

利用 Next.js 的动态路由能力，批量生成针对长尾关键词的高质量落地页，吸引寻找
"作品集模板"、"开发者博客" 或特定技术栈解决方案的用户。

## 2. 关键词与用户意图分析 (Keyword Strategy)

我们需要捕捉以下几类搜索意图：

### A. 技术栈组合意图 (Tech Stack Combinations)

用户搜索特定技术的组合解决方案。

- **关键词模式**: `[Technology] Portfolio Template`,
  `[Technology] Blog Starter`, `[CMS] Next.js Portfolio`
- **变量举例**:
  - `Technology`: React, TypeScript, Tailwind CSS, Framer Motion
  - `CMS`: Markdown, MDX, Notion, Contentlayer
  - `Type`: Portfolio, Blog, Landing Page

### B. 职业角色意图 (Role -based Intent)

用户根据自己的职业寻找模板。

- **关键词模式**: `Portfolio Template for [Role]`,
  `Best [Role] Personal Website`
- **变量举例**:
  - `Role`: Developers, Software Engineers, Frontend Devs, Backend Devs,
    Fullstack Devs

### C. 功能特性意图 (Feature-based Intent)

用户寻找具有特定功能的模板。

- **关键词模式**: `[Feature] Portfolio Template`,
  `Next.js Portfolio with [Feature]`
- **变量举例**:
  - `Feature`: Dark Mode, SEO Optimized, Fast Performance, Analytics, RSS Feed

## 3. 数据结构模型 (Data Modeling)

建议创建一个轻量级的 JSON 数据源 `data/pseo_data.json` 来驱动页面生成。

```json
{
    "technologies": [
        {
            "slug": "react",
            "name": "React",
            "description": "A JavaScript library for building user interfaces.",
            "related_posts": ["react-guide", "hooks-tutorial"]
        },
        {
            "slug": "nextjs",
            "name": "Next.js",
            "description": "The React Framework for the Web.",
            "related_posts": ["nextjs-seo", "app-router-migration"]
        }
    ],
    "roles": [
        {
            "slug": "software-engineer",
            "name": "Software Engineer",
            "keywords": ["coding", "programming", "github"]
        }
    ],
    "templates": [
        {
            "type": "portfolio",
            "title_pattern": "Best {Technology} Portfolio Template for {Role}",
            "description_pattern": "Build your {Role} portfolio with {Technology} in minutes."
        }
    ]
}
```

## 4. 技术实现路径 (Implementation Plan)

### 步骤 1: 创建动态路由

创建新的目录结构以捕获长尾流量： `app/templates/[tech]/[role]/page.tsx`

### 2. 使用 `generateStaticParams`

利用 Next.js 的 SSG 能力在构建时生成所有组合页面。

```typescript
export async function generateStaticParams() {
    const techs = data.technologies;
    const roles = data.roles;

    return techs.flatMap((tech) =>
        roles.map((role) => ({
            tech: tech.slug,
            role: role.slug,
        }))
    );
}
```

### 3. 这是最重要的：内容差异化 (Content Uniqueness)

pSEO 最大的风险是"重复内容" (Duplicate
Content)。我们需要确保每个生成的页面都有独特的价值：

- **动态标题与Meta**: 针对特定组合优化 `title` 和 `description`。
- **关联内容聚合**: 在页面上展示与该技术或角色相关的博客文章（通过 `utils.ts`
  中的 tags 匹配）。
- **特有描述**: 如果可能，使用 AI
  预先生成针对每个组合的一段简短介绍，存入数据源。
- **FAQ 模块**: 针对该技术栈的常见问题。

### 4. 内部链接策略 (Internal Linking)

- 在博客文章底部推荐相关的 "Template Pages"。
- 在 "Template Pages" 侧边栏展示相关的博客文章。
- 更新 `sitemap.ts` 以包含这些新生成的页面。

## 5. 执行路线图

1. **数据准备**: 整理本项目支持的所有技术栈和目标人群。
2. **原型开发**: 创建 `app/solutions/[slug]/page.tsx` 原型。
3. **内容填充**: 编写通用的文案模板，并确保可以动态替换变量。
4. **验证与上线**: 本地构建测试，检查生成的页面数量和质量，最后提交。
