class WexpHeader extends HTMLElement {
  connectedCallback() {
    const subtitleText = this.getAttribute("subtitle") || "";

    this.innerHTML = `
      <header class="header">
        <div class="container header-content">
          
          <div class="logo-container" onclick="window.location.href='/'">
            
            
            <div class="wasd-icon" aria-label="Ícone WASD">
              <div class="key key-w"></div>
              <div class="key key-a"></div>
              <div class="key key-s"></div>
              <div class="key key-d"></div>
            </div>
            <h1 class="logo">WeXP</h1>
          </div>

          <span class="subtitle">${subtitleText}</span>
        </div>
      </header>
    `;
  }
}

customElements.define("wexp-header", WexpHeader);
