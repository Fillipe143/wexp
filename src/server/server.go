package server

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"wexp/src/api"
	"wexp/src/config"
	"wexp/src/livereload"
)

type Server struct {
	Config config.Config
	Echo   *echo.Echo
	Live   *livereload.Live
}

func New(cfg config.Config) *Server {
	s := &Server{
		Config: cfg,
		Echo:   echo.New(),
	}

	if cfg.LiveReload {
		s.Live = livereload.New()

		watcher := livereload.NewWatcher(cfg.PublicDir, s.Live)
		go watcher.Run()

		s.Echo.GET("/ws", livereload.WSHandler(s.Live))
	}

	s.registerRoutes()
	api.Register(s.Echo)

	return s
}

func (s *Server) Start() error {
	addr := ":" + s.Config.Port
	fmt.Println("server running at", addr)
	return s.Echo.Start(addr)
}
