import { WxComponent } from "../../utils/wx-component.js";

class WxSidebar extends WxComponent {
    constructor() {
        super("wx-sidebar", "component");
    }
}

customElements.define("wx-sidebar", WxSidebar);
