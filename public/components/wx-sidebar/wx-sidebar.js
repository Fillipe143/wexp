import { WxComponent } from "../../utils/wx-component.js";

class WxSidebar extends WxComponent {
    constructor() {
        super("wx-sidebar", "component");
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.syncActiveLink();

        // Atualiza o menu ativo quando clicar
        this.$("a").on("click", (e) => {
            this.$("a").removeClass("active");
            this.$(e.currentTarget).addClass("active");
        });
    }

    syncActiveLink() {
        // Atualiza o menu ativo de acordo com o hashparam
        const currentHash = window.location.hash || "#home";
        this.$("a").removeClass("active");

        this.$("a").each((_, link)=> {
            if (this.$(link).attr("href") === currentHash) {
                this.$(link).addClass("active");
            }
        });
    }
}

customElements.define("wx-sidebar", WxSidebar);
