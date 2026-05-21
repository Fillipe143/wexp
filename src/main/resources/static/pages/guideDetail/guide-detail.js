import { mdToHtml } from "/js/markdown_viewer/index.js";

window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameId = params.get("id");
  const achievement = params.get("achievement");
  const achievementIcon = params.get("icon");
  const gameName = params.get("name");
  const gameImage = params.get("image");
  const index = params.get("index");

  const titleEl = document.getElementById("guideTitle");
  const descEl = document.getElementById("guideDescription");

  if (!titleEl || !descEl) {
    alert("Erro no HTML");
    return;
  }

  const storage = JSON.parse(localStorage.getItem("guides")) || {};

  const guides = storage?.[gameId]?.[achievement] || [];

  const guide = guides[index];

  if (!guide) {
    titleEl.innerText = "Guia não encontrado";
    return;
  }

  // 🎯 preencher
  titleEl.innerText = guide.title;
  document.getElementById("achievementIcon").src = achievementIcon;
  document.getElementById("achievementTitle").innerText = achievement;
  document.getElementById("gameName").innerText = gameName;

  descEl.innerHTML = mdToHtml(guide.description);

  // Certifique-se de que este código está dentro do seu window.onload ou escopo principal da página
  const editBtn = document.getElementById("editBtn");

  // Em vez de definir apenas o atributo .href, vamos controlar o clique:
  editBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Impede o comportamento padrão do link temporariamente

    // 1. Monte a URL (Garanta que todas essas variáveis vieram da URL atual ou do seu banco de dados)
    const url =
      `/pages/guideForm/create-guide.html?id=${gameId}` +
      `&name=${encodeURIComponent(gameName)}` +
      `&image=${encodeURIComponent(gameImage)}` +
      `&achievement=${encodeURIComponent(achievement)}` +
      `&icon=${encodeURIComponent(achievementIcon)}` +
      `&guideId=${guide.id}`; // 👈 Se 'guide' for o objeto que você buscou do LocalStorage

    // 2. O SUPER TRUQUE DO DEBUG: Olhe o console do navegador ao clicar no botão!
    console.log("Tentando redirecionar para:", url);

    // 3. Faz o redirecionamento forçado via JavaScript
    window.location.href = url;
  });

  // 1. Cole a função compareText corrigida no seu arquivo
  function compareText(oldContent, newContent) {
    const oldLines = oldContent.split("\n");
    const newLines = newContent.split("\n");
    const result = [];
    let i = 0,
      j = 0;

    while (i < oldLines.length || j < newLines.length) {
      if (i >= oldLines.length) {
        result.push({ type: "new", content: newLines[j] });
        j++;
        continue;
      }
      if (j >= newLines.length) {
        result.push({ type: "delete", content: oldLines[i] });
        i++;
        continue;
      }
      if (oldLines[i] === newLines[j]) {
        result.push({ type: "default", content: oldLines[i] });
        i++;
        j++;
        continue;
      }
      if (j + 1 < newLines.length && oldLines[i] === newLines[j + 1]) {
        result.push({ type: "new", content: newLines[j] });
        j++;
        continue;
      }
      if (i + 1 < oldLines.length && oldLines[i + 1] === newLines[j]) {
        result.push({ type: "delete", content: oldLines[i] });
        i++;
        continue;
      }
      result.push({ type: "delete", content: oldLines[i] });
      result.push({ type: "new", content: newLines[j] });
      i++;
      j++;
    }
    return result;
  }

  // 2. Lógica para renderizar o histórico
  // (Certifique-se de que a variável 'guide' já foi buscada do localStorage no seu código atual)

  const historySection = document.getElementById("historySection");
  const historyContainer = document.getElementById("historyContainer");
  const toggleHistoryBtn = document.getElementById("toggleHistoryBtn");

  // Verifica se o guia tem histórico
  if (guide.history && guide.history.length > 0) {
    historySection.style.display = "block"; // Exibe a seção (o botão agora aparece)

    const timeline = [
      ...guide.history,
      {
        description: guide.description,
        updatedAt: Date.now(),
        isCurrent: true,
      },
    ];

    let historyHTML = "";

    for (let i = 1; i < timeline.length; i++) {
      const versaoAnterior = timeline[i - 1];
      const versaoAtualLoop = timeline[i];

      const diffs = compareText(
        versaoAnterior.description,
        versaoAtualLoop.description,
      );

      const diffHTML = diffs
        .map((line) => {
          if (line.type === "new")
            return `<div class="diff-line diff-new">+ ${line.content}</div>`;
          if (line.type === "delete")
            return `<div class="diff-line diff-delete">- ${line.content}</div>`;
          return `<div class="diff-line">  ${line.content}</div>`;
        })
        .join("");

      const dataFormatada = new Date(versaoAtualLoop.updatedAt).toLocaleString(
        "pt-BR",
      );
      const tituloEdicao = versaoAtualLoop.isCurrent
        ? "Última Edição (Atual)"
        : `Edição anterior`;

      historyHTML += `
      <div class="history-item">
        <div class="history-date"><strong>${tituloEdicao}</strong> • ${dataFormatada}</div>
        <div class="diff-container">${diffHTML}</div>
      </div>
    `;
    }

    // Injeta o conteúdo gerado dentro do container oculto
    historyContainer.innerHTML = historyHTML;

    // 👇 NOVA LÓGICA DO BOTÃO COM ANIMAÇÃO
    const historyWrapper = document.getElementById("historyWrapper");

    toggleHistoryBtn.addEventListener("click", () => {
      // A função toggle adiciona a classe "open" se não tiver, e remove se tiver
      historyWrapper.classList.toggle("open");

      // Verifica se a classe está lá para mudar o texto do botão
      if (historyWrapper.classList.contains("open")) {
        toggleHistoryBtn.innerText = "Ocultar histórico de alterações (▲)";
      } else {
        toggleHistoryBtn.innerText = "Visualizar histórico de alterações (▼)";
      }
    });
  }
};
