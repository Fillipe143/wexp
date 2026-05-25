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
    const tabContent = document.getElementById("tabContent");

    // 1. Injeta a estrutura da linha do tempo direto na div única de conteúdo
    tabContent.innerHTML = `
    <div class="activity-timeline">
      <h3 class="timeline-title">🕒 Atividade Recente no Jogo</h3>
      <div id="timelineContainer" class="timeline-list">
        <p class="empty-timeline">Carregando atividades...</p>
      </div>
    </div>
  `;

    // 2. Pega o ID do jogo na URL e renderiza os dados do LocalStorage
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("id");

    renderGameTimeline(gameId);
  }

  function renderGameTimeline(currentGameId) {
    const timelineContainer = document.getElementById("timelineContainer");
    if (!timelineContainer) return;

    const storage = JSON.parse(localStorage.getItem("guides")) || {};
    let gameActivities = [];

    const gameObject = storage[currentGameId];

    if (gameObject) {
      Object.keys(gameObject).forEach((achievementName) => {
        const guidesArray = gameObject[achievementName] || [];

        guidesArray.forEach((version) => {
          let rawDate = version.createdAt;
          if (rawDate && !isNaN(rawDate)) {
            rawDate = Number(rawDate);
          }

          // 🔍 Busca o ícone da conquista dentro da lista carregada da API
          const foundAchievement = allAchievements.find(
            (a) => (a.displayName || a.name) === achievementName,
          );
          const iconUrl = foundAchievement
            ? foundAchievement.icon || foundAchievement.icongray
            : "";

          gameActivities.push({
            achievementName: achievementName,
            createdAt: rawDate ? new Date(rawDate) : new Date(),
            icon: iconUrl || "",
          });
        });
      });
    }

    gameActivities.sort((a, b) => b.createdAt - a.createdAt);

    if (gameActivities.length === 0) {
      timelineContainer.innerHTML =
        '<p class="empty-timeline">Nenhum guia foi criado para este jogo ainda.</p>';
      return;
    }

    timelineContainer.innerHTML = gameActivities
      .map((activity) => {
        const timeAgo = formatRelativeTime(activity.createdAt);

        // 🛠️ Monta a URL idêntica à do clique do card de conquistas
        const targetUrl =
          `/pages/guideDetail/guide-detail.html?id=${currentGameId}` +
          `&name=${encodeURIComponent(gameName)}` +
          `&image=${encodeURIComponent(gameImage)}` +
          `&achievement=${encodeURIComponent(activity.achievementName)}` +
          `&icon=${encodeURIComponent(activity.icon)}`;

        return `
          <div class="timeline-item clickable-activity" onclick="window.location.href='${targetUrl}'">
            <div class="timeline-meta">⏰ ${timeAgo}</div>
            <p class="timeline-text">
              Uma nova versão de guia foi publicada para a conquista 
              <strong>"${activity.achievementName}"</strong>.
            </p>
          </div>
        `;
      })
      .join("");
  }

  // Função auxiliar de tempo que usamos antes
  function formatRelativeTime(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours} h`;
    if (diffDays === 1) return "Ontem";
    return `Há ${diffDays} dias`;
  }

  // 🎯 TABS
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const selected = tab.dataset.tab;
      const searchInput = document.getElementById("achievementSearch");

      if (selected === "achievements") {
        // Mostra o campo de busca de conquistas de volta
        searchInput.style.display = "block";
        loadAchievements();
      } else {
        // Esconde o campo de busca de conquistas, já que estamos na aba de guias
        searchInput.style.display = "none";
        loadGuides();
      }
    });
  });

  // inicial
  loadAchievements();
};
