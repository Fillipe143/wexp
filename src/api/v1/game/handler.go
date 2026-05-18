package game

import (
	"net/http"
	"github.com/labstack/echo/v4"
)

func Register(e *echo.Group) {
	e.GET("/game/:id", getGame)
}

func getGame(c echo.Context) error {
	id := c.Param("id")

	game, err := GetGame(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, game)
}