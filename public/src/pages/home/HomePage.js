import { createComponent } from "../../utils/componentFactory.js";
import "../../components/game-card/gameCard.js";

export default createComponent("home-page", {
  template: "/src/pages/home/HomePage.html",
  async mounted($) {
    const input = $("#search-input");
    const button = $("#search-button");
    const searchResults = $("#search-results");

    const topSellers = $("#top-sellers");
    const newReleases = $("#new-releases");
    const specials = $("#specials");

    function renderGames(container, games) {
      container.html(`
    ${games
      .map(
        (_, index) => `
          <div class="col">
            <game-card data-index="${index}"></game-card>
          </div>
        `,
      )
      .join("")}
  `);

      container.find("game-card").each(function () {
        const index = $(this).data("index");

        this.game = games[index];
      });
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
