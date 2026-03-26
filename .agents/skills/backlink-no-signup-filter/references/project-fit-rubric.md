# Project Fit Rubric

Use this rubric when screening backlink targets for this repo.

## Project Profile

- Site: `https://tolearn.blog`
- Brand: `ToLearn Blog`
- Core themes:
  - AI systems
  - LLMs and machine learning
  - SEO and search visibility
  - modern web execution
  - frontend and developer workflow
  - design systems, typography, and portfolio pages

## High-Fit Targets

Keep pages in these buckets first:

- AI research or AI product coverage
- SEO, search, analytics, or content workflow blogs
- web design, typography, frontend, performance, or developer tooling blogs
- technical marketing content aimed at builders, SaaS teams, or site owners
- portfolio, UX, design system, or developer career resources

## Medium-Fit Targets

Keep only if the no-signup signal is strong and the page angle can support a natural comment:

- general digital marketing
- broader product, ecommerce, or creator workflow content
- university or organization blogs discussing search, technology, design, or software
- adjacent business content that overlaps with audience growth, conversions, or tooling

## Reject By Default

Reject these unless the user explicitly wants raw volume over relevance:

- food, travel, parenting, fitness, crafts, fashion, or celebrity blogs
- gaming-only sites or communities unrelated to web, AI, or search
- forum profiles, user profiles, member directories, bug trackers, and discussion accounts
- pages with obvious spam comment history if the page topic is unrelated to the repo
- pages without a website field when the goal is a no-signup backlink

## No-Signup Signals

Strong signals:

- visible comment or submission form with `Comment`, `Name`, `Email`, and `Website`
- no login or register prompt in the primary submission path
- no captcha visible in the submission path
- recent public comments from other sites using the website field

Weak signals:

- spreadsheet says `Has URL Field = Yes` but the page has not been live-checked
- comments exist, but the form is hidden behind tabs or moderation copy
- `in_content` strategy is required instead of a normal website field

Reject signals:

- `/login`, `/register`, `/account`, `/members`, `/profile`, `/forums`, `/discussion`, `/show_bug.cgi`
- comment form missing a website field
- visible captcha or anti-bot challenge

## Decision Standard

- `preapproved`: strong topical fit plus strong no-signup signal; still requires live verification
- `watchlist`: incomplete confidence on topic or form behavior
- `reject`: poor topical fit, high friction, or obvious spam risk
