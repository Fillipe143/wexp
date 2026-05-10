import { WxComponent } from "../../utils/wx-component.js";
import "../../components/wx-mdeditor/wx-mdeditor.js";

class HomePage extends WxComponent {
    constructor() {
        super("guide-page", "page");
    }
}

customElements.define("guide-page", HomePage);
