const routes = {
    "": { tag: "home-page", path: "../pages/home-page/home-page.js" },
    "#": { tag: "home-page", path: "../pages/home-page/home-page.js" },
    "#home": { tag: "home-page", path: "../pages/home-page/home-page.js" },
    "#error": { tag: "error-page", path: "../pages/error-page/error-page.js" },
};

async function handleRouteChange() {
    const appContainer = document.getElementById("app");
    const hash = window.location.hash;
    let route = routes[hash];

    if (!route) {
        history.replaceState(null, "", "#error");
        route = routes["#error"];
    }

    if (route) {
        try {
            if (!customElements.get(route.tag)) await import(route.path);
            appContainer.innerHTML = `<${route.tag}></${route.tag}>`;
        } catch (error) {
            console.error(`Erro ao carregar a página ${route.tag}:`, error);
            appContainer.innerHTML = `<h2 style="color: white; padding: 2rem;">Erro ao carregar a página.</h2>`;
        }
    }
}

window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("DOMContentLoaded", handleRouteChange);
