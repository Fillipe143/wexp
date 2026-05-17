import { createComponent } from "../../utils/componentFactory.js";

export default createComponent("home-page", {
    template: "/src/pages/home/HomePage.html",

    mounted($) {
        let contador = 0;

        $("button").on("click", () => {
            $("p").text("Contador: " + ++contador);
        });
    }
});
