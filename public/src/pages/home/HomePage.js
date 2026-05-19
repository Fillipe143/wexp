import { createComponent } from "../../utils/componentFactory.js";

export default createComponent("home-page", {
  template: "/src/pages/home/HomePage.html",
  async mounted($) {
    const input = $("#search-input");
    const button = $("#search-button");
    const searchResults = $("#search-results");

    const topSellers = $("#top-sellers");
    const newReleases = $("#new-releases");
    const specials = $("#specials");

    function attachCardEvents(container) {
      container.find(".game-card").on("click", function () {
        const gameId = $(this).data("game-id");

        history.pushState({}, "", `/game/${gameId}`);
      });
    }

    function renderGames(container, games) {
      if (!Array.isArray(games)) {
        console.error("games não é array:", games);
        return;
      }

      container.html(
        games
          .map(
            (game) => `
              <div class="col">
                <div
                  class="card h-100 shadow-sm border-0 overflow-hidden game-card"
                  data-game-id="${game.id || game.appid}"
                  style="cursor: pointer;"
                >
                  <img
                    src="${game.header_image || game.tiny_image}"
                    class="card-img-top"
                    alt="${game.name}"
                  />

                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">
                      ${game.name}
                    </h5>

                    ${
                      game.final_price !== undefined
                        ? `
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
                        `
                        : ""
                    }
                  </div>
                </div>
              </div>
            `,
          )
          .join(""),
      );

      attachCardEvents(container);
    }

    async function loadHome() {
      try {
        const response = await fetch("/api/v1/games/featured");

        if (!response.ok) {
          throw new Error("Erro ao carregar homepage");
        }

        const data = await response.json();

        renderGames(topSellers, data.top_sellers.items);
        renderGames(newReleases, data.new_releases.items);
        renderGames(specials, data.specials.items);
      } catch (error) {
        console.error(error);
      }
    }

    button.on("click", async () => {
      const query = input.val()?.trim();

      if (!query) {
        return;
      }

      searchResults.html(`
        <div class="col-12">
          <div class="alert alert-secondary">
            Buscando jogos...
          </div>
        </div>
      `);

      try {
        const response = await fetch(
          `/api/v1/games/search?q=${encodeURIComponent(query)}`,
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar jogo");
        }

        const games = await response.json();

        renderGames(searchResults, games);
      } catch (error) {
        searchResults.html(`
          <div class="col-12">
            <div class="alert alert-danger">
              Erro ao buscar jogos
            </div>
          </div>
        `);

        console.error(error);
      }
    });

    loadHome();
  },
});
