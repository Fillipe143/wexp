package game

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) error(c echo.Context, err error) error {
	return c.JSON(http.StatusInternalServerError, map[string]string{
		"error": err.Error(),
	})
}

func (h *Handler) GetGame(c echo.Context) error {
	id := c.Param("id")

	data, err := h.service.GetGame(id)
	if err != nil {
		return h.error(c, err)
	}

	return c.JSON(http.StatusOK, data)
}

func (h *Handler) GetAchievements(c echo.Context) error {
	id := c.Param("id")

	data, err := h.service.GetAchievements(id)
	if err != nil {
		return h.error(c, err)
	}

	return c.JSON(http.StatusOK, data)
}

func (h *Handler) SearchGames(c echo.Context) error {
	q := c.QueryParam("q")

	data, err := h.service.SearchGames(q)
	if err != nil {
		return h.error(c, err)
	}

	return c.JSON(http.StatusOK, data)
}

func (h *Handler) Home(c echo.Context) error {
	data, err := h.service.Home()
	if err != nil {
		return h.error(c, err)
	}

	return c.JSON(http.StatusOK, data)
}
