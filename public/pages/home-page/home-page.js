import { WxComponent } from "../../utils/wx-component.js";

class HomePage extends WxComponent {
    constructor() {
        super("home-page", "page");
    }
}

customElements.define("home-page", HomePage);
