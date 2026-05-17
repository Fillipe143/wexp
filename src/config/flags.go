package config

import "flag"

type Config struct {
	Port       string
	PublicDir  string
	LiveReload bool
}

func Parse() Config {
	port := flag.String("port", "8080", "")
	publicDir := flag.String("public", "./public", "")
	liveReload := flag.Bool("live-reload", false, "")

	flag.Parse()

	return Config{
		Port:       *port,
		PublicDir:  *publicDir,
		LiveReload: *liveReload,
	}
}
