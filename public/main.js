import { initRouter } from "./src/utils/router.js";
import { api } from "./src/utils/api.js";

window.api = api;

document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector("app-root");
    initRouter(root);
});
