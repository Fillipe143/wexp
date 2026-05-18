package v1

import (
	"github.com/labstack/echo/v4"
	"wexp/src/api/v1/counter"
	"wexp/src/api/v1/game"
	"wexp/src/api/v1/store"
)

func Register(e *echo.Group) {
	v1Group := e.Group("/v1")

	counter.Register(v1Group)
	game.Register(v1Group)
	store.Register(v1Group)
}
