function generateBreadcrumb() {
  const container = document.getElementById("breadcrumb");
  if (!container) return;

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  const gameName = params.get("name");
  const gameId = params.get("id");
  const gameImage = params.get("image");
  const achievement = params.get("achievement");
  const achievementIcon = params.get("icon");

  // Identifica a página atual
  const currentFile = path.split("/").filter(Boolean).pop() || "";
  const page = currentFile.replace(".html", "");

  // String de parâmetros completa para manter o estado entre as páginas
  const fullQuery =
    `?id=${gameId}` +
    `&name=${encodeURIComponent(gameName || "")}` +
    `&image=${encodeURIComponent(gameImage || "")}` +
    `&achievement=${encodeURIComponent(achievement || "")}` +
    `&icon=${encodeURIComponent(achievementIcon || "")}`;

  // URLs de retorno corrigidas
  const gameHref = `/pages/game/game.html${fullQuery}`; // Volta para a lista de conquistas do jogo
  const guideDetailHref = `/pages/guideDetail/guide-detail.html${fullQuery}`; // Volta para o detalhe do guia

  // Estrutura base: Sempre começa apontando para a raiz (Home)
  const items = [
    {
      label: "Home",
      href: "/index.html", // Ajustado para bater com o link do seu logo no Header
    },
  ];

  // Adiciona o Jogo no caminho
  if (page !== "home" && gameName) {
    items.push({
      label: decodeURIComponent(gameName),
      href: gameHref,
    });
  }

  // Se estiver na tela de Detalhes: Home › Jogo › [Nome da Conquista]
  if (page === "guide-detail") {
    items.push({
      label: achievement ? decodeURIComponent(achievement) : "Guia",
    });
  }

  // Se estiver na tela de Formulário: Home › Jogo › [Nome da Conquista] › Sugerir Melhoria
  if (page === "create-guide") {
    if (achievement) {
      items.push({
        label: decodeURIComponent(achievement),
        href: guideDetailHref, // Clicar no nome da conquista volta para o guia dela
      });
    }
    items.push({
      label: "Sugerir melhoria",
    });
  }

  // Renderização no HTML
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
        <span class="breadcrumb-separator">›</span>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", generateBreadcrumb);
