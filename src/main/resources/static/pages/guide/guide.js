window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameId = params.get("id");
  const gameName = params.get("name");
  const achievement = params.get("achievement");

  const titleEl = document.getElementById("achievementTitle");
  const gameNameEl = document.getElementById("gameName");
  const container = document.getElementById("guidesContainer");

  if (!titleEl || !container) {
    alert("Erro no HTML");
    return;
  }

  titleEl.innerText = achievement;
  gameNameEl.innerText = gameName;

  loadGuides();

  function loadGuides() {
    const storage = JSON.parse(localStorage.getItem("guides")) || {};

    const gameGuides = storage[gameId] || {};
    const guides = gameGuides[achievement] || [];

    renderGuides(guides);
  }

  function renderGuides(guides) {
    container.innerHTML = "";

    if (!guides || guides.length === 0) {
      container.innerHTML = `
        <p class="muted">Nenhum guia encontrado para esta conquista.</p>
      `;
      return;
    }

    guides.forEach((g) => {
      const div = document.createElement("div");
      div.classList.add("guide-card");

      div.innerHTML = `
        <h3 class="guide-title">${g.title}</h3>
        <p class="guide-description">${g.description || ""}</p>
        <a class="guide-link" href="${g.url}" target="_blank">
          Ver guia →
        </a>
      `;

      container.appendChild(div);
    });
  }

  document.getElementById("backBtn")?.addEventListener("click", goBack);

  const toggleBtn = document.getElementById("toggleGuideForm");
  const form = document.getElementById("guideForm");

  toggleBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
  });

  document.getElementById("guideForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("guideTitle").value;
    const description = document.getElementById("guideDescription").value;
    const url = document.getElementById("guideUrl").value;

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
      url,
      createdAt: Date.now(),
    });

    localStorage.setItem("guides", JSON.stringify(storage));

    // limpar form
    e.target.reset();
    form.classList.add("hidden");

    // recarregar lista
    loadGuides();

    document.getElementById("createGuideBtn").addEventListener("click", () => {
      window.location.href =
        `create-guide.html?id=${gameId}` +
        `&achievement=${encodeURIComponent(achievement)}`;
    });
  });
};

function goBack() {
  history.back();
}
