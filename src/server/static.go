package server

import (
	"github.com/labstack/echo/v4"
	"net/http"
	"os"
	"path/filepath"
	"wexp/src/livereload"
)

func (s *Server) registerRoutes() {
	s.Echo.GET("/*", func(c echo.Context) error {
		reqPath := c.Request().URL.Path
		fullPath := filepath.Join(s.Config.PublicDir, reqPath)

		if info, err := os.Stat(fullPath); err == nil && !info.IsDir() {
			return c.File(fullPath)
		}

		return s.serveIndex(c)
	})
}

func (s *Server) serveIndex(c echo.Context) error {
	html, err := os.ReadFile(s.Config.PublicDir + "/index.html")
	if err != nil {
		return c.String(http.StatusInternalServerError, "error")
	}

	if s.Config.LiveReload {
		html = livereload.InjectReload(html)
	}

	return c.HTMLBlob(http.StatusOK, html)
}
