import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';
import fs from 'fs-extra';
import path from 'path';

// ===== PATHS =====
const rootDir = process.cwd();
const themingDir = path.join(rootDir, 'theming');
const scssDir = path.join(themingDir, 'scss');
const jsDir = path.join(themingDir, 'js');

// ===== ENSURE STRUCTURE =====
fs.ensureDirSync(scssDir);

// ===== SCAN SCSS ONLY =====
const getFilesRecursively = (dir, extensions) => {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(getFilesRecursively(fullPath, extensions));
        } else if (extensions.some(ext => file.name.endsWith(ext))) {
            results.push(fullPath);
        }
    });

    return results;
};

const scssFiles = getFilesRecursively(scssDir, ['.scss']);
const jsFiles = getFilesRecursively(jsDir, ['.js']);

const inputFiles = Object.fromEntries([
    // SCSS -> emitted as CSS assets
    scssFiles.map(file => [
        path
            .relative(scssDir, file)
            .replace(/\\/g, '-')
            .replace('.scss', '.css'),
        file
    ]),
    // JS -> bundled/minified into assets/*.js (no hashes)
    jsFiles.map(file => [
        path
            .relative(jsDir, file)
            .replace(/\\/g, '-')
            .replace('.js', ''),
        file
    ])
].flat());

// ===== VITE CONFIG =====
export default defineConfig({
    appType: 'custom',
    publicDir: false,

    plugins: [
        shopify({
            tunnel: false,
            additionalEntrypoints: [
                'theming/js/**/*.js',   // ✅ Shopify controls JS
                'theming/scss/**/*.scss'
            ]
        }),
        {
            name: 'rename-assets',
            writeBundle() {
                const assetsDir = path.resolve(rootDir, 'assets');
                if (!fs.existsSync(assetsDir)) return;

                fs.readdirSync(assetsDir).forEach(file => {
                    if (file.startsWith('other-')) {
                        fs.renameSync(
                            path.join(assetsDir, file),
                            path.join(assetsDir, file.replace('other-', ''))
                        );
                    }
                });
            }
        }
    ],

    build: {
        emptyOutDir: false,
        manifest: true,
        sourcemap: true,
        rollupOptions: {
            input: inputFiles,
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                dir: 'assets',
                // IMPORTANT:
                // We intentionally do NOT set `manualChunks` here.
                // With many independent entrypoints (your Shopify theme scripts),
                // forcing manualChunks creates extra shared chunk files.
                // If your entrypoints don't import each other, Rollup will emit one .js per entry.
            }
        }
    }
});
