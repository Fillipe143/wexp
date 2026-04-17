window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameId = params.get("id");
  const gameName = params.get("name");
  const gameImage = params.get("image");

  const titleEl = document.getElementById("gameTitle");
  const imgEl = document.getElementById("gameImage");
  const content = document.getElementById("content");

  const tabAchievements = document.getElementById("tabAchievements");
  const tabGuides = document.getElementById("tabGuides");

  if (!titleEl || !imgEl || !content) {
    alert("Erro no HTML");
    return;
  }

  titleEl.innerText = gameName;
  imgEl.src = gameImage;

  // 🔥 BUSCAR CONQUISTAS REAIS
  async function loadAchievements() {
    content.innerHTML = "Carregando conquistas...";

    try {
      const response = await fetch(`http://localhost:8080/api/games/${gameId}/achievements`);
      const data = await response.json();

      renderAchievements(data);
    } catch (error) {
      content.innerHTML = "Erro ao carregar conquistas.";
      console.error(error);
    }
  }

  function renderAchievements(data) {
    content.innerHTML = "";

    const achievements = data?.game?.availableGameStats?.achievements;

    if (!achievements || achievements.length === 0) {
      content.innerHTML = "Nenhuma conquista encontrada.";
      return;
    }

    achievements.forEach(a => {
      const div = document.createElement("div");
      div.classList.add("achievement");

      div.innerHTML = `
        <div class="achievement-row">
          <div>
            <strong>${a.displayName || a.name}</strong>
            <p>${a.description || "Sem descrição"}</p>
          </div>
        </div>
      `;

      // 👉 clique leva para guia
      div.onclick = () => {
        window.location.href = `guide.html?id=${gameId}&name=${encodeURIComponent(gameName)}&image=${encodeURIComponent(gameImage)}&achievement=${encodeURIComponent(a.displayName || a.name)}`;
      };

      content.appendChild(div);
    });
  }

  // 📘 GUIAS (mock por enquanto)
  function renderGuides() {
    content.innerHTML = `
      <div class="achievement">
        <strong>Guia geral</strong>
        <p>Não há guias disponíveis no momento.</p>
      </div>
    `;
  }

  // eventos
  tabAchievements.onclick = () => {
    tabAchievements.classList.add("active");
    tabGuides.classList.remove("active");
    loadAchievements();
  };

  tabGuides.onclick = () => {
    tabGuides.classList.add("active");
    tabAchievements.classList.remove("active");
    renderGuides();
  };

  // inicial
  loadAchievements();
};

function goBack() {
  window.location.href = "index.html";
}