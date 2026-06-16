
const fs = require('fs');
const path = require('path');
const {
  defaultLocale,
  locales,
} = require('../app/lib/i18n-paths');
const {
  getArticlePath,
  getPostTranslationPath,
  hasPostTranslation,
} = require('../app/lib/blog-i18n');

const translatableMetadataKeys = [
  'title',
  'summary',
  'seoTitle',
  'seoDescription',
  'faq',
  'howto',
  'sourceUpdatedAt',
  'translatedAt',
];

// Helper function to process MDX files
// Copied slightly modified from app/blog/utils.ts to avoid TS compilation issues and import complexity in a standalone script
function parseFrontmatter(fileContent) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match[1];
  let content = fileContent.replace(frontmatterRegex, '').trim();
  let frontMatterLines = frontMatterBlock.trim().split('\n');
  let metadata = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes

    const trimmedKey = key.trim();
    if (trimmedKey === 'tags') {
       try {
        if (value.startsWith('[') && value.endsWith(']')) {
          metadata[trimmedKey] = JSON.parse(value);
        } else {
          metadata[trimmedKey] = value.split(',').map(tag => tag.trim());
        }
      } catch (e) {
        metadata[trimmedKey] = value.split(',').map(tag => tag.trim());
      }
    } else {
      metadata[trimmedKey] = value;
    }
  });

  return { metadata, content };
}

function getMDXFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function createCleanSlug(filename) {
  // Remove file extension
  const slug = filename.replace(/\.[^/.]+$/, '');

  // Custom mappings for special filenames
  // MUST MATCH app/lib/formatters.ts
  const slugMappings = {
    'SEO': 'seo-optimization-guide',
    'AI生成PPT': 'ai-generated-presentations',
    'AI-Revolution-Finance': 'ai-revolution-finance',
    'AI-Revolution-American-Workplaces': 'ai-revolution-american-workplaces',
  };

  if (slugMappings[slug]) {
    return slugMappings[slug];
  }

  // Standard normalization
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function mergeTranslationMetadata(source, translation) {
  const merged = { ...source };

  translatableMetadataKeys.forEach((key) => {
    if (translation[key] !== undefined && translation[key] !== '') {
      merged[key] = translation[key];
    }
  });

  return merged;
}

function toPlainText(content) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[*_#\[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 5000);
}

function buildSearchEntry({ slug, metadata, content, locale }) {
  return {
    slug,
    title: metadata.title,
    summary: metadata.summary,
    publishedAt: metadata.publishedAt,
    href: getArticlePath(slug, locale),
    locale,
    isTranslated: locale !== defaultLocale && hasPostTranslation(slug, locale),
    content: toPlainText(content)
  };
}

function buildSearchIndexForLocale(sourcePosts, locale) {
  return sourcePosts.map((sourcePost) => {
    if (locale !== defaultLocale && hasPostTranslation(sourcePost.slug, locale)) {
      const translation = readMDXFile(getPostTranslationPath(sourcePost.slug, locale));
      return buildSearchEntry({
        slug: sourcePost.slug,
        metadata: mergeTranslationMetadata(sourcePost.metadata, translation.metadata),
        content: translation.content,
        locale,
      });
    }

    return buildSearchEntry({
      slug: sourcePost.slug,
      metadata: sourcePost.metadata,
      content: sourcePost.content,
      locale: defaultLocale,
    });
  });
}

function generateSearchIndex() {
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'posts');
  const mdxFiles = getMDXFiles(postsDirectory);

  const sourcePosts = mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(postsDirectory, file));
    const slug = createCleanSlug(file);

    return { slug, metadata, content };
  });

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const indexes = Object.fromEntries(
    locales.map((locale) => [locale, buildSearchIndexForLocale(sourcePosts, locale)])
  );

  fs.writeFileSync(path.join(publicDir, 'search-index.json'), JSON.stringify(indexes.en));

  Object.entries(indexes).forEach(([locale, index]) => {
    fs.writeFileSync(path.join(publicDir, `search-index.${locale}.json`), JSON.stringify(index));
  });

  console.log(
    `Generated search indexes for ${locales.join(', ')} with ${sourcePosts.length} posts each.`
  );
}

generateSearchIndex();
