
const fs = require('fs');
const path = require('path');

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

function generateSearchIndex() {
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'posts');
  const mdxFiles = getMDXFiles(postsDirectory);
  
  const searchIndex = mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(postsDirectory, file));
    const slug = createCleanSlug(file);

    // Simple plain text extraction: remove code blocks, html tags, etc.
    // This is a naive heuristic for "content" search
    const plainText = content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[*_#\[\]()]/g, '') // Remove basic markdown syntax
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim()
      .substring(0, 5000); // Truncate to reasonable length per post to keep index size down

    return {
      slug,
      title: metadata.title,
      summary: metadata.summary,
      publishedAt: metadata.publishedAt,
      content: plainText
    };
  });

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'search-index.json'), JSON.stringify(searchIndex));
  console.log(`Generated search-index.json with ${searchIndex.length} posts.`);
}

generateSearchIndex();
