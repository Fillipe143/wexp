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
};
