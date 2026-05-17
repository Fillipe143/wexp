package v1

import (
	"github.com/labstack/echo/v4"
	"wexp/src/api/v1/counter"
)

func Register(e *echo.Group) {
	v1Group := e.Group("/v1")

	counter.Register(v1Group)
}
