window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameId = params.get("id");
  const gameName = params.get("name");
  const achievement = params.get("achievement");

  document.getElementById("achievementTitle").innerText = achievement;
  document.getElementById("gameName").innerText = gameName;

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
          `&achievement=${encodeURIComponent(achievement)}` +
          `&index=${index}`;
      };

      container.appendChild(div);
    });
  }

  document.getElementById("createGuideBtn").addEventListener("click", () => {
    window.location.href =
      `/pages/guideForm/create-guide.html?id=${gameId}` +
      `&achievement=${encodeURIComponent(achievement)}`;
  });

  document
    .getElementById("backBtn")
    .addEventListener("click", () => history.back());
};
