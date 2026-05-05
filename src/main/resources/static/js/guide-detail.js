window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameId = params.get("id");
  const achievement = params.get("achievement");
  const index = params.get("index");

  const titleEl = document.getElementById("guideTitle");
  const metaEl = document.getElementById("guideMeta");
  const descEl = document.getElementById("guideDescription");
  const linkEl = document.getElementById("guideLink");

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
  metaEl.innerText = achievement;

  descEl.innerText = guide.description;

  if (guide.url) {
    linkEl.href = guide.url;
    linkEl.classList.remove("hidden");
  }

  document
    .getElementById("backBtn")
    .addEventListener("click", () => history.back());
};
