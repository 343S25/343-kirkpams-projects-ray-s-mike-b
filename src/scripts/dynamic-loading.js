document.addEventListener("DOMContentLoaded", async () => {
    const placeholders = document.querySelectorAll("[data-hydrate]");
    for (const el of placeholders) {
        const src = el.getAttribute("data-hydrate");
        try {
            const response = await fetch(src);
            if (!response.ok) throw new Error(`Failed to load ${src}`);
            const html = await response.text();
            el.outerHTML = html;
        } catch (err) {
            console.error(`Hydration failed for ${src}:`, err);
        }
    }
});