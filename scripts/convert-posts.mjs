
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

const SOURCE_DIR = '../_posts/2013';
const TARGET_DIR = '../src/content/blog/es';

async function convertPosts() {
    try {
        // Create target directory if it doesn't exist
        await fs.mkdir(TARGET_DIR, { recursive: true });
        
        // Get all markdown files from 2013
        const files = await fs.readdir(SOURCE_DIR);
        const mdFiles = files.filter(f => f.endsWith('.md'));
        
        for (const file of mdFiles) {
            // Read source file
            const content = await fs.readFile(path.join(SOURCE_DIR, file), 'utf8');
            const { data, content: markdown } = matter(content);
            
            // Create new frontmatter
            const newFrontmatter = {
                title: data.title,
                description: data.description || data.title,
                date: file.slice(0, 10),
                cover: './cover.png'
            };
            
            // Create new directory name from original filename
            const dirName = file.slice(0, -3); // remove .md extension
            const targetDir = path.join(TARGET_DIR, dirName);
            
            // Create directory and write new file
            await fs.mkdir(targetDir, { recursive: true });
            
            // Create new content
            const newContent = `---
${Object.entries(newFrontmatter)
    .map(([key, value]) => `${key}: '${value}'`)
    .join('\n')}
---

${markdown.trim()}`;
            
            await fs.writeFile(
                path.join(targetDir, 'index.mdx'),
                newContent
            );
            
            console.log(`Converted ${file} -> ${dirName}/index.mdx`);
        }
        
    } catch (err) {
        console.error('Error:', err);
    }
}

convertPosts();