document.addEventListener("DOMContentLoaded", async () => {
    const placeholders = document.querySelectorAll("[data-hydrate]");
    const cacheVersion = "v1"; // Update this version to invalidate the cache
    for (const el of placeholders) {
        const src = el.getAttribute("data-hydrate");
        const cacheKey = `cache:${cacheVersion}:${src}`;
        try {
            // Check if the content is already cached
            let html = localStorage.getItem(cacheKey);
            if (!html) {
                // Fetch the content if not cached
                const response = await fetch(src);
                if (!response.ok) throw new Error(`Failed to load ${src}`);
                html = await response.text();
                // Cache the fetched content
                localStorage.setItem(cacheKey, html);
            }
            el.outerHTML = html;
        } catch (err) {
            console.error(`Hydration failed for ${src}:`, err);
        }
    }
});