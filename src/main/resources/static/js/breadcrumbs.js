function generateBreadcrumb() {
  const container = document.getElementById("breadcrumb");

  if (!container) return;

  const path = window.location.pathname;

  const params = new URLSearchParams(window.location.search);

  const gameName = params.get("name");

  // página atual
  const currentFile = path.split("/").filter(Boolean).pop();

  const page = currentFile.replace(".html", "");

  const gameId = params.get("id");
  const gameImage = params.get("image");
  const achievement = params.get("achievement");

  const gameQuery =
    `?id=${gameId}` +
    `&name=${encodeURIComponent(gameName)}` +
    `&image=${encodeURIComponent(gameImage)}`;

  const guidesQuery =
    `${gameQuery}` + `&achievement=${encodeURIComponent(achievement)}`;

  const gameHref = `/pages/game/game.html${gameQuery}`;

  const guidesHref = `/pages/guideList/guides.html${guidesQuery}`;

  // estrutura
  const items = [
    {
      label: "Home",
      href: "/pages/home/home.html",
    },
  ];

  // adiciona jogo
  if (page !== "home" && gameName) {
    items.push({
      label: decodeURIComponent(gameName),
      href: gameHref,
    });
  }

  // páginas extras
  if (page === "guides") {
    items.push({
      label: "Guias",
    });
  }

  if (page === "guide-detail") {
    items.push({
      label: "Guias",
      href: guidesHref,
    });

    items.push({
      label: "Guia",
    });
  }

  if (page === "create-guide") {
    items.push({
      label: "Guias",
      href: guidesHref,
    });

    items.push({
      label: "Criar guia",
    });
  }

  // render
  container.innerHTML = items
    .map((item, index) => {
      const isLast = index === items.length - 1;

      if (isLast || !item.href) {
        return `<span>${item.label}</span>`;
      }

      return `
        <a href="${item.href}">
          ${item.label}
        </a>
        <span class="breadcrumb-separator">
          ›
        </span>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", generateBreadcrumb);
