import { createComponent } from "../../utils/componentFactory.js";

export default createComponent("home-page", {
  template: "/src/pages/home/HomePage.html",
  async mounted($) {
    const input = $("#game-id-input");
    const button = $("#search-button");
    const result = $("#game-result");

    const topSellers = $("#top-sellers");
    const newReleases = $("#new-releases");
    const specials = $("#specials");

    function renderGames(container, games) {
      container.html(
        games
          .map(
            (game) => `
              <div class="col">
                <div class="card h-100 shadow-sm border-0 overflow-hidden">
                  <img
                    src="${game.header_image}"
                    class="card-img-top"
                    alt="${game.name}"
                  />

                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">
                      ${game.name}
                    </h5>

                    <div class="mt-auto">
                      ${
                        game.discount_percent > 0
                          ? `
                            <span class="badge text-bg-success mb-2">
                              -${game.discount_percent}%
                            </span>
                          `
                          : ""
                      }

                      <div class="fw-bold">
                        ${
                          game.final_price === 0
                            ? "Grátis"
                            : `R$ ${(game.final_price / 100).toFixed(2)}`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `,
          )
          .join(""),
      );
    }

    async function loadHome() {
      try {
        const response = await fetch("/api/v1/store/home");

        if (!response.ok) {
          throw new Error("Erro ao carregar homepage");
        }

        const data = await response.json();

        renderGames(topSellers, data.top_sellers);
        renderGames(newReleases, data.new_releases);
        renderGames(specials, data.specials);
      } catch (error) {
        console.error(error);
      }
    }

    button.on("click", async () => {
      const gameId = input.val()?.trim();

      if (!gameId) {
        alert("Digite um ID");
        return;
      }

      result.html(`
        <div class="alert alert-secondary">
          Carregando...
        </div>
      `);

      try {
        const response = await fetch(`/api/v1/game/${gameId}`);

        if (!response.ok) {
          throw new Error("Erro ao buscar jogo");
        }

        const game = await response.json();

        result.html(`
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="card-title mb-3">
                ${game.name}
              </h2>

              <p class="text-muted">
                ${game.achievements.length} conquistas
              </p>

              <ul class="list-group mt-4">
                ${game.achievements
                  .map(
                    (achievement) => `
                      <li class="list-group-item">
                        <strong>${achievement.name}</strong>
                        <br />
                        <small>
                          ${achievement.description || "Sem descrição"}
                        </small>
                      </li>
                    `,
                  )
                  .join("")}
              </ul>
            </div>
          </div>
        `);
      } catch (error) {
        result.html(`
          <div class="alert alert-danger">
            Erro ao buscar jogo
          </div>
        `);

        console.error(error);
      }
    });

    loadHome();
  },
});
