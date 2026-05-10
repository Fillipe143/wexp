let globalSheet = null;

async function getGlobalStyle() {
    if (!globalSheet) {
        globalSheet = new CSSStyleSheet();
        try {
            const response = await fetch("./global.css");
            const cssText = await response.text();
            globalSheet.replaceSync(cssText);
        } catch (error) {
            console.error("Erro ao carregar o CSS global:", error);
        }
    }
    return globalSheet;
}

export class WxComponent extends HTMLElement {
    constructor(componentName, type = "component") {
        super();
        this.attachShadow({ mode: "open" });
        this.componentName = componentName;
        this.type = type;
    }

    async connectedCallback() {
        if (this.shadowRoot.childNodes.length > 0) return;

        try {
            const basePath = this.type === "page"
                ? `./pages/${this.componentName}`
                : `./components/${this.componentName}`;

            const [htmlRes, cssRes] = await Promise.all([
                fetch(`${basePath}/${this.componentName}.html`),
                fetch(`${basePath}/${this.componentName}.css`)
            ]);

            const htmlText = await htmlRes.text();
            const cssText = await cssRes.text();

            const componentSheet = new CSSStyleSheet();
            componentSheet.replaceSync(cssText);
            const sharedGlobalSheet = await getGlobalStyle();

            if (sharedGlobalSheet) {
                this.shadowRoot.adoptedStyleSheets = [sharedGlobalSheet, componentSheet];
            } else {
                this.shadowRoot.adoptedStyleSheets = [componentSheet];
            }

            const template = document.createElement("template");
            template.innerHTML = htmlText;
            this.shadowRoot.appendChild(template.content.cloneNode(true));

        } catch (error) {
            console.error(`Erro ao inicializar o componente ${this.componentName}:`, error);
            this.shadowRoot.innerHTML = `<p style="color: var(--text-bright); padding: 1rem;">Erro ao carregar ${this.componentName}.</p>`;
        }
    }

    $(selector) {
        return $(this.shadowRoot).find(selector);
    }
}
