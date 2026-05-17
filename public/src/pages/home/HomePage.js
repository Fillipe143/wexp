import { createComponent } from "../../utils/componentFactory.js";

export default createComponent("home-page", {
    template: "/src/pages/home/HomePage.html",

    async mounted($) {
        async function updateCounter({ value }) {
            $("p").text("Contador: " + value);
        }

        updateCounter(await api.counter.get());

        $("button").on("click", async () => {
            updateCounter(await api.counter.add());
        });
    }
});
