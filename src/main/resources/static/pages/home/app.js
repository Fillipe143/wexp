const API_URL = "http://localhost:8080/api";

// 💡 FUNÇÃO AUXILIAR: Cria a estrutura de card para qualquer seção
function createGameCard(game) {
  const card = document.createElement("div");
  card.classList.add("game-card");

  card.innerHTML = `
    <img src="${game.image}" alt="${game.name}" />
    <div class="game-info">
      <h3>${game.name}</h3>
    </div>
  `;

  card.onclick = () => {
    window.location.href = `/pages/game/game.html?id=${game.id}&name=${encodeURIComponent(game.name)}&image=${encodeURIComponent(game.image)}`;
  };

  return card;
}

// 🌟 NOVA FUNÇÃO: Carrega os jogos em destaque e em alta ao entrar na página
// 🌟 NOVA FUNÇÃO: Carrega as 3 categorias oficiais e distribui na tela
async function loadHomeContent() {
  try {
    const response = await fetch(`${API_URL}/featured`);
    const data = await response.json();

    const topSellersContainer = document.getElementById("topSellersContainer");
    const newReleasesContainer = document.getElementById(
      "newReleasesContainer",
    );
    const specialsContainer = document.getElementById("specialsContainer");

    // Limpa os textos de "Carregando..."
    topSellersContainer.innerHTML = "";
    newReleasesContainer.innerHTML = "";
    specialsContainer.innerHTML = "";

    // Converte para array caso a API envie chaves numéricas ("0", "1", "2")
    const categoriesArray = Object.values(data);

    // Identifica cada categoria de forma flexível (pela chave ou pelo campo 'id' interno)
    const topSellersData =
      data.top_sellers || categoriesArray.find((c) => c.id === "top_sellers");
    const newReleasesData =
      data.new_releases || categoriesArray.find((c) => c.id === "new_releases");
    const specialsData =
      data.specials || categoriesArray.find((c) => c.id === "specials");

    // Função interna para padronizar e mapear os itens recebidos da Steam
    const mapItems = (categoryData) => {
      if (!categoryData || !categoryData.items) return [];

      return categoryData.items.map((item) => {
        // Se a Steam mandar o link em vez do ID (comum em banners), extrai o ID. Caso contrário, usa o ID direto.
        let gameId = item.id;
        if (!gameId && item.url && item.url.includes("/app/")) {
          gameId = item.url.split("/app/")[1].split("/")[0];
        }

        return {
          id: gameId || "store",
          name: item.name || "Jogo Steam",
          // Garante que vai pegar alguma imagem válida da resposta da Steam
          image:
            item.header_image ||
            item.large_capsule_image ||
            item.small_capsule_image ||
            "",
        };
      });
    };

    // Mapeia os jogos de cada categoria
    const topSellers = mapItems(topSellersData);
    const newReleases = mapItems(newReleasesData);
    const specials = mapItems(specialsData);

    // Renderiza limitando a 4 ou 5 itens por linha para o visual não quebrar
    if (topSellers.length > 0) {
      topSellers
        .slice(0, 5)
        .forEach((game) =>
          topSellersContainer.appendChild(createGameCard(game)),
        );
    } else {
      topSellersContainer.innerHTML =
        "<p style='color:#888;'>Nenhum jogo nesta categoria.</p>";
    }

    if (newReleases.length > 0) {
      newReleases
        .slice(0, 5)
        .forEach((game) =>
          newReleasesContainer.appendChild(createGameCard(game)),
        );
    } else {
      newReleasesContainer.innerHTML =
        "<p style='color:#888;'>Nenhum jogo nesta categoria.</p>";
    }

    if (specials.length > 0) {
      specials
        .slice(0, 5)
        .forEach((game) => specialsContainer.appendChild(createGameCard(game)));
    } else {
      specialsContainer.innerHTML =
        "<p style='color:#888;'>Nenhum jogo nesta categoria.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar conteúdo da home:", error);
    document.getElementById("topSellersContainer").innerText =
      "Erro ao carregar dados.";
    document.getElementById("newReleasesContainer").innerText =
      "Erro ao carregar dados.";
    document.getElementById("specialsContainer").innerText =
      "Erro ao carregar dados.";
  }
}

// ALTERADO: Controla a exibição das seções ao buscar algo
async function searchGames() {
  const term = document.getElementById("searchInput").value.trim();

  const defaultContent = document.getElementById("defaultHomeContent");
  const searchSection = document.getElementById("gamesSection");

  // Se o usuário limpar o campo de busca, os destaques voltam a aparecer
  if (!term) {
    defaultContent.classList.remove("hidden");
    searchSection.classList.add("hidden");
    return;
  }

  // Esconde os destaques e mostra a seção de busca
  defaultContent.classList.add("hidden");
  searchSection.classList.remove("hidden");

  const response = await fetch(`${API_URL}/games?term=${term}`);
  const games = await response.json();

  renderGames(games);
}

function renderGames(games) {
  const container = document.getElementById("gamesContainer");
  container.innerHTML = "";

  const title = document.querySelector("#gamesSection .section-title");
  title.textContent = `Resultados para "${document.getElementById("searchInput").value}"`;

  if (games.length === 0) {
    container.innerHTML = "<p style='color: #888;'>Nenhum jogo encontrado.</p>";
    return;
  }

  games.forEach((game) => {
    container.appendChild(createGameCard(game));
  });
}

// --- MANUTENÇÃO DE CÓDIGO (Suas funções originais mantidas) ---
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
        <img class="achievement-icon" src="${a.icon || a.icongray || ""}" />
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

// --- EVENTOS DE DISPARO ---
document.getElementById("searchBtn").addEventListener("click", searchGames);

// Escuta a tecla Enter no input para facilitar a busca
document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchGames();
});

// Inicializa a página trazendo os destaques da API
document.addEventListener("DOMContentLoaded", loadHomeContent);
