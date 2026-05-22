let allAchievements = [];

window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameId = params.get("id");
  const gameName = params.get("name");
  const gameImage = params.get("image");

  const titleSecondary = document.getElementById("gameTitleSecondary");
  const imgEl = document.getElementById("gameImage");
  const content = document.getElementById("tabContent");

  const tabs = document.querySelectorAll(".tab");

  if (!titleSecondary || !imgEl || !content) {
    alert("Erro no HTML");
    return;
  }

  if (titleSecondary) titleSecondary.innerText = gameName;
  imgEl.src = gameImage;

  // 🔥 BUSCAR CONQUISTAS
  async function loadAchievements() {
    content.innerHTML = "Carregando conquistas...";

    try {
      const response = await fetch(
        `http://localhost:8080/api/games/${gameId}/achievements`,
      );

      const data = await response.json();

      const achievements = data?.game?.availableGameStats?.achievements || [];

      allAchievements = achievements;

      renderAchievementsList(allAchievements);
    } catch (error) {
      content.innerHTML = "Erro ao carregar conquistas.";
      console.error(error);
    }
  }

  // 🎯 RENDER ÚNICO
  function renderAchievementsList(list) {
    content.innerHTML = "";

    if (!list || list.length === 0) {
      content.innerHTML = "Nenhuma conquista encontrada.";
      return;
    }

    list.forEach((a) => {
      const div = document.createElement("div");
      div.classList.add("achievement");

      div.innerHTML = `
        <div class="achievement-row">

          <img 
            class="achievement-icon" 
            src="${a.icon || a.icongray || ""}" 
          />

          <div class="achievement-info">
            <strong>${a.displayName || a.name}</strong>
            <small>${a.description || "Sem descrição"}</small>
          </div>

        </div>
      `;

      div.onclick = () => {
        window.location.href =
          `/pages/guideDetail/guide-detail.html?id=${gameId}` +
          `&name=${encodeURIComponent(gameName)}` +
          `&image=${encodeURIComponent(gameImage)}` +
          `&achievement=${encodeURIComponent(a.displayName || a.name)}` +
          `&icon=${encodeURIComponent(a.icon || a.icongray || "")}`;
      };

      content.appendChild(div);
    });
  }

  // 🔎 FILTRO
  function filterAchievements(term) {
    const filtered = allAchievements.filter((a) =>
      (a.displayName || a.name).toLowerCase().includes(term.toLowerCase()),
    );

    renderAchievementsList(filtered);
  }

  document
    .getElementById("achievementSearch")
    ?.addEventListener("input", (e) => {
      filterAchievements(e.target.value);
    });

  // 📘 GUIAS
  function loadGuides() {
    content.innerHTML = `
      <div class="achievement">
        <strong>Guias</strong>
        <p>Nenhum guia disponível ainda.</p>
      </div>
    `;
  }

  // 🎯 TABS
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const selected = tab.dataset.tab;

      if (selected === "achievements") {
        loadAchievements();
      } else {
        loadGuides();
      }
    });
  });

  // inicial
  loadAchievements();
};
