package game

import "github.com/labstack/echo/v4"

func Register(e *echo.Group, h *Handler) {
	g := e.Group("/games")

	g.GET("/featured", h.Home)
	g.GET("/:id", h.GetGame)
	g.GET("/:id/achievements", h.GetAchievements)
	g.GET("/search", h.SearchGames)
}
