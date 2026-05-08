import { mdToHtml } from "/js/markdown_viewer/index.js";

window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameName = params.get("name");
  const gameId = params.get("id");
  const gameImage = params.get("image");
  const achievement = params.get("achievement");
  const achievementIcon = params.get("icon");
  document.getElementById("achievementName").innerText =
    achievement + " - " + gameName;

  const form = document.getElementById("guideForm");

  const textarea = document.getElementById("description");

  const preview = document.getElementById("markdownPreview");

  textarea.addEventListener("input", () => {
    preview.innerHTML = mdToHtml(textarea.value);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const storage = JSON.parse(localStorage.getItem("guides")) || {};

    if (!storage[gameId]) {
      storage[gameId] = {};
    }

    if (!storage[gameId][achievement]) {
      storage[gameId][achievement] = [];
    }

    storage[gameId][achievement].push({
      title,
      description,
      createdAt: Date.now(),
    });

    localStorage.setItem("guides", JSON.stringify(storage));

    // redireciona de volta pra lista
    window.location.href =
      `/pages/guideList/guides.html?id=${gameId}` +
      `&name=${encodeURIComponent(gameName)}` +
      `&image=${encodeURIComponent(gameImage)}` +
      `&achievement=${encodeURIComponent(achievement)}` +
      `&icon=${encodeURIComponent(achievementIcon)}`;
  });
};
