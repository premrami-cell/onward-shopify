// Main JS file
// This entry exists in `snippets/vite-tag.liquid`. Keep a tiny side-effect so it doesn't emit as an empty chunk.
if (typeof window !== 'undefined') {
    window.__theme_main_loaded__ = true;
}

