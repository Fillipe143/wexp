import { WxComponent } from "../../utils/wx-component.js";

class HomePage extends WxComponent {
    constructor() {
        super("home-page", "page");
    }

    async connectedCallback() {
        await super.connectedCallback();

        // Atualiza o botão de filtro ativo ao clicar
        this.$(".filter-btn").on("click", (e) => {
            this.$(".filter-btn").removeClass("active");
            this.$("#category-name").text(e.target.innerText);
            this.$(e.target).addClass("active");
        });
    }
}

customElements.define("home-page", HomePage);
