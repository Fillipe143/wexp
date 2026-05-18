package store

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func Register(e *echo.Group) {
	e.GET("/store/home", getHome)
}

func getHome(c echo.Context) error {
	home, err := GetHome()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, home)
}