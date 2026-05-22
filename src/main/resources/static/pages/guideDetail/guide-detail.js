import { mdToHtml } from "/js/markdown_viewer/index.js";
import { createVersionCard } from "/js/components/VersionCard.js";

window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameId = params.get("id");
  const achievement = params.get("achievement");
  const achievementIcon = params.get("icon");
  const gameName = params.get("name");
  const gameImage = params.get("image");

  // Elementos do DOM
  const titleEl = document.getElementById("guideTitle");
  const descEl = document.getElementById("guideDescription");
  const votesBadge = document.getElementById("guideVotesBadge");
  const versionsCount = document.getElementById("versionsCount");
  const editBtn = document.getElementById("editBtn");

  // Elementos das Abas
  const tabMainBtn = document.getElementById("tabMainBtn");
  const tabVersionsBtn = document.getElementById("tabVersionsBtn");
  const paneMain = document.getElementById("paneMain");
  const paneVersions = document.getElementById("paneVersions");
  const versionsContainer = document.getElementById("versionsContainer");

  // Preenche o Hero (Cabeçalho da Conquista)
  document.getElementById("achievementIcon").src = achievementIcon;
  document.getElementById("achievementTitle").innerText = achievement;
  document.getElementById("gameName").innerText = gameName;

  // Carrega o Banco de Dados
  const storage = JSON.parse(localStorage.getItem("guides")) || {};
  const versions = storage?.[gameId]?.[achievement] || [];

  // Atualiza o contador de versões na aba
  versionsCount.innerText = versions.length;

  // Lógica de Abas
  tabMainBtn.addEventListener("click", () => {
    tabMainBtn.classList.add("active");
    tabVersionsBtn.classList.remove("active");
    paneMain.classList.add("active");
    paneVersions.classList.remove("active");
  });

  tabVersionsBtn.addEventListener("click", () => {
    tabVersionsBtn.classList.add("active");
    tabMainBtn.classList.remove("active");
    paneVersions.classList.add("active");
    paneMain.classList.remove("active");
  });

  // Botão de Editar (Sugerir Melhoria)
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const url =
      `/pages/guideForm/create-guide.html?id=${gameId}` +
      `&name=${encodeURIComponent(gameName)}` +
      `&image=${encodeURIComponent(gameImage)}` +
      `&achievement=${encodeURIComponent(achievement)}` +
      `&icon=${encodeURIComponent(achievementIcon)}`;
    window.location.href = url;
  });

  // Se não houver guias criados ainda
  if (versions.length === 0) {
    titleEl.innerText = "Nenhum guia criado ainda.";
    descEl.innerHTML =
      "<p class='muted'>Seja o primeiro a escrever um guia para esta conquista!</p>";
    votesBadge.style.display = "none";
    editBtn.innerText = "✏️ Criar primeiro guia";
    return;
  }

  // 1. ORDENA PARA ACHAR A CAMPEÃ (Mais upvotes no topo)
  const sortedVersions = [...versions].sort((a, b) => b.upvotes - a.upvotes);
  const topVersion = sortedVersions[0];

  // 2. RENDERIZA A CAMPEÃ NA ABA PRINCIPAL
  titleEl.innerText = topVersion.title;
  votesBadge.innerText = `⭐ ${topVersion.upvotes} upvotes`;
  descEl.innerHTML = mdToHtml(topVersion.description);

  // 3. RENDERIZA A LISTA DE VERSÕES NA SEGUNDA ABA
  versionsContainer.innerHTML = sortedVersions
    .map((ver) =>
      createVersionCard(ver, ver.versionId === topVersion.versionId),
    )
    .join("");

  // LÓGICA 1: Clique para Expandir/Recolher o Accordion
  document.querySelectorAll(".version-toggle-header").forEach((header) => {
    header.addEventListener("click", (e) => {
      // Encontra o wrapper de conteúdo que está logo após o cabeçalho
      const contentWrapper = header.nextElementSibling;
      const textSpan = header.querySelector("span style"); // Para atualizar o texto se quiser

      contentWrapper.classList.toggle("open");

      // Ajusta o indicador visual de aberto/fechado
      const infoDiv = header.querySelector("div div");
      const atualizado = contentWrapper.classList.contains("open")
        ? "(Clique para fechar ▲)"
        : "(Clique para ler ▼)";
      infoDiv.innerHTML = infoDiv.innerHTML.replace(
        /\(Clique para.*\)/,
        atualizado,
      );
    });
  });

  // LÓGICA 2: Clique no Botão de Votar
  document.querySelectorAll(".upvote-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // 🔥 CRUCIAL: Impede que o clique no botão também abra/feche o accordion!
      e.stopPropagation();

      const vId = e.currentTarget.getAttribute("data-id");
      const target = versions.find((v) => v.versionId === vId);
      if (target) {
        target.upvotes += 1;
        localStorage.setItem("guides", JSON.stringify(storage));
        window.location.reload();
      }
    });
  });
};
