package v1

import (
	"github.com/labstack/echo/v4"

	"wexp/src/api/v1/game"
	"wexp/src/clients/steam"
)

func Register(e *echo.Group, steamClient *steam.Client) {
	v1 := e.Group("/v1")

	gameService := game.NewService(steamClient)
	gameHandler := game.NewHandler(gameService)
	game.Register(v1, gameHandler)
}
