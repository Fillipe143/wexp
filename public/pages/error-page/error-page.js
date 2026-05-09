import { WxComponent } from "../../utils/wx-component.js";

class ErrorPage extends WxComponent {
    constructor() {
        super("error-page", "page");
    }
}

customElements.define("error-page", ErrorPage);
