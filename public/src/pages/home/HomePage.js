import { createComponent } from "../../utils/componentFactory.js";

export default createComponent("home-page", {
  template: "/src/pages/home/HomePage.html",

  async mounted($) {
    const input = $("#game-id-input");
    const button = $("#search-button");
    const result = $("#game-result");

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
                    <div class="card">
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
  },
});
