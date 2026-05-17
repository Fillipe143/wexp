import "../pages/not-found/NotFoundPage.js"

const routes = {
    "/": () => import("../pages/home/HomePage.js")
};

export function initRouter(root) {
    const getPath = () => window.location.pathname;

    async function render() {
        const route = routes[getPath()];

        if (!route) {
            root.innerHTML = "<not-found-page></not-found-page>";
            return;
        }

        const tag = (await route()).default;
        root.innerHTML = `<${tag}></${tag}>`;
    }

    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function() {
        pushState.apply(history, arguments);
        render();
    };

    history.replaceState = function() {
        replaceState.apply(history, arguments);
        render();
    };

    window.addEventListener("popstate", render);
    render();
}
