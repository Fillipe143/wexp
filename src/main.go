package main

import (
	"log"
	"wexp/src/config"
	"wexp/src/server"
)

func main() {
	cfg := config.Parse()
	srv := server.New(cfg)
	log.Fatal(srv.Start())
}
