const cache = new Map();

export async function loadHTML(path) {
    if (cache.has(path)) return cache.get(path);

    const res = await fetch(path);
    const html = await res.text();

    cache.set(path, html);

    return html;
}
