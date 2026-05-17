import { loadHTML } from "./templateCache.js";

function scoped(root) {
    return (selector) => $(root).find(selector);
}

export function createComponent(tag, config) {
    const Component = class extends HTMLElement {
        async connectedCallback() {
            const html = await loadHTML(config.template);

            this.innerHTML = html;
            this.$ = scoped(this);

            if (config.mounted) {
                config.mounted.call(this, this.$);
            }
        }

        disconnectedCallback() {
            $(this).off();

            if (config.unmounted) {
                config.unmounted.call(this);
            }
        }
    };

    customElements.define(tag, Component);
    return tag;
}
