package counter

import "github.com/labstack/echo/v4"

func Register(e *echo.Group) {
	e.GET("/counter", getCounter)
	e.POST("/counter", addCounter)
}
