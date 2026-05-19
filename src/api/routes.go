package api

import (
	v1 "wexp/src/api/v1"
	"wexp/src/clients/steam"
	"wexp/src/config"

	"github.com/labstack/echo/v4"
)

func Register(e *echo.Echo) {
	env := config.LoadEnv()
	steamClient := steam.New(env.SteamAPIKey)

	api := e.Group("/api")
	v1.Register(api, steamClient)
}
