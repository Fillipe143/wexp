window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameId = params.get("id");
  const gameName = params.get("name");
  const gameImage = params.get("image");
  const achievement = params.get("achievement");
  const achievementIcon = params.get("icon");

  document.getElementById("achievementTitle").innerText = achievement;
  document.getElementById("gameName").innerText = gameName;

  if (achievementIcon) {
    document.getElementById("achievementIcon").src = achievementIcon;
  }

  loadGuides();

  function loadGuides() {
    const storage = JSON.parse(localStorage.getItem("guides")) || {};

    const guides = storage?.[gameId]?.[achievement] || [];

    renderList(guides);
  }

  function renderList(guides) {
    const container = document.getElementById("guidesList");
    container.innerHTML = "";

    if (guides.length === 0) {
      container.innerHTML = "<p class='muted'>Nenhum guia ainda.</p>";
      return;
    }

    guides.forEach((g, index) => {
      const div = document.createElement("div");
      div.classList.add("guide-list-item");

      div.innerHTML = `
        <strong>${g.title}</strong>
      `;

      div.onclick = () => {
        window.location.href =
          `/pages/guideDetail/guide-detail.html?id=${gameId}` +
          `&name=${encodeURIComponent(gameName)}` +
          `&image=${encodeURIComponent(gameImage)}` +
          `&achievement=${encodeURIComponent(achievement)}` +
          `&icon=${encodeURIComponent(achievementIcon)}` +
          `&index=${index}`;
      };

      container.appendChild(div);
    });
  }

  document.getElementById("createGuideBtn").addEventListener("click", () => {
    window.location.href =
      `/pages/guideForm/create-guide.html?id=${gameId}` +
      `&name=${encodeURIComponent(gameName)}` +
      `&image=${encodeURIComponent(gameImage)}` +
      `&achievement=${encodeURIComponent(achievement)}` +
      `&icon=${encodeURIComponent(params.get("icon") || "")}`;
  });
};
