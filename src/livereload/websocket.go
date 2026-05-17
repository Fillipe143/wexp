package livereload

import (
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func WSHandler(l *Live) echo.HandlerFunc {
	return func(c echo.Context) error {
		conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
		if err != nil {
			return err
		}

		l.Add(conn)
		defer l.Remove(conn)

		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				return nil
			}
		}
	}
}
