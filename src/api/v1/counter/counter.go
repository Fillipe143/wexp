package counter

import "github.com/labstack/echo/v4"

var globalCounter = 0

func getCounter(c echo.Context) error {
	return c.JSON(200, map[string]any{
		"value": globalCounter,
	})
}

func addCounter(c echo.Context) error {
	globalCounter++
	return c.JSON(200, map[string]any{
		"value": globalCounter,
	})
}
