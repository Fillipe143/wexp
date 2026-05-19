import { createComponent } from "../../utils/componentFactory.js";

export default createComponent("game-card", {
  template: "/src/components/game-card/GameCard.html",

  mounted($) {
    const game = this.game;

    $("#game-image").attr("src", game.header_image || game.tiny_image);

    $("#game-image").attr("alt", game.name);

    $("#game-name").text(game.name);

    if (game.discount_percent > 0) {
      $("#discount-container").html(`
        <span class="badge text-bg-success mb-2">
          -${game.discount_percent}%
        </span>
      `);
    }

    if (game.final_price !== undefined) {
      $("#price").text(
        game.final_price === 0
          ? "Grátis"
          : `R$ ${(game.final_price / 100).toFixed(2)}`,
      );
    }

    $(this).on("click", () => {
      history.pushState({}, "", `/game/${game.id || game.appid}`);
    });
  },
});
