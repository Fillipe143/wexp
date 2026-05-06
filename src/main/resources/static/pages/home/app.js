const API_URL = "http://localhost:8080/api";

async function searchGames() {
  const term = document.getElementById("searchInput").value;

  if (!term) return;

  const response = await fetch(`${API_URL}/games?term=${term}`);
  const games = await response.json();

  renderGames(games);
}

function renderGames(games) {
  const container = document.getElementById("gamesContainer");
  container.innerHTML = "";

  games.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add("game-card");

    card.innerHTML = `
      <img src="${game.image}" />
      <div class="game-info">
      <h3>${game.name}</h3>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `/pages/game/game.html?id=${game.id}&name=${encodeURIComponent(game.name)}&image=${game.image}`;
    };

    container.appendChild(card);
  });
}

async function loadAchievements(appId) {
  const container = document.getElementById("achievementsContainer");
  const list = document.getElementById("achievementsList");

  list.innerHTML = "Carregando...";
  container.classList.remove("hidden");

  try {
    const response = await fetch(`${API_URL}/games/${appId}/achievements`);
    const data = await response.json();

    renderAchievements(data, list);
  } catch (error) {
    list.innerHTML = "Erro ao carregar conquistas.";
  }
}

function renderAchievements(data, list) {
  list.innerHTML = "";

  const achievements = data?.game?.availableGameStats?.achievements;

  if (!achievements || achievements.length === 0) {
    list.innerHTML = "Nenhuma conquista encontrada.";
    return;
  }

  achievements.forEach((a) => {
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

        <span class="achievement-arrow">→</span>

      </div>
    `;
    list.appendChild(div);
  });
}

document.getElementById("searchBtn").addEventListener("click", searchGames);
