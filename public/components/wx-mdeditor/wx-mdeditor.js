import { WxComponent } from "../../utils/wx-component.js";

class WxMdEditor extends WxComponent {
    constructor() {
        super("wx-mdeditor", "component");
    }

    async connectedCallback() {
        await super.connectedCallback();

        document.addEventListener("keydown", ({key}) => {
            switch (key) {
                case "Backspace":
                    this.$("h1").html(this.$("h1").html().slice(0, -1))
                    break
                case "Enter":
                    this.$("h1").html(this.$("h1").html() + "<br>")
                case "Shift":
                    break
                default:
                    this.$("h1").html(this.$("h1").html() + key)
            }
        })
    }
}

customElements.define("wx-mdeditor", WxMdEditor);
