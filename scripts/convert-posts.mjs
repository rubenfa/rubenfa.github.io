
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

const SOURCE_DIR = '../_posts/2018';
const TARGET_DIR = '../src/content/blog/es';

function normalizeString(str) {
    return str
        .toLowerCase()
        // Reemplazar acentos y ñ
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/g, 'n')
        // Reemplazar espacios y caracteres especiales por guiones
        .replace(/[^a-z0-9]+/g, '-')
        // Eliminar guiones al inicio y final
        .replace(/^-+|-+$/g, '');
}

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
                cover: '../images/quite-old.png'
            };
            
            // Create new directory name from original filename
            var dirName = file.slice(0, -3); // remove .md extension
            dirName = normalizeString(dirName);
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