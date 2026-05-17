package api

import (
	v1 "wexp/src/api/v1"

	"github.com/labstack/echo/v4"
)

func Register(e *echo.Echo) {
	apiGroup := e.Group("/api")
	v1.Register(apiGroup)
}
