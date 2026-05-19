import { createComponent } from "../../utils/componentFactory.js";

export default createComponent("not-found-page", {
    template: "/src/pages/not-found/NotFoundPage.html",

    async mounted($) {
        $("#go-home").on("click", () => history.pushState({}, "", "/"));
        $("#go-back").on("click", () => history.back());
    }
});
