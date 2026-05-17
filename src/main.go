package main

import (
	"log"
	"net/http"

	"wexp/src/api"
	"wexp/src/live"
	"wexp/src/static"
)

func main() {
	http.HandleFunc("/", static.Handler)
	http.HandleFunc("/ws", live.WSHandler)
	http.HandleFunc("/api/v1/ping", api.PingHandler)

	go live.StartBroadcaster()
	go live.Watch("./public")

	log.Println("dev server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
