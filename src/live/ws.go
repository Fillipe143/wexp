package live

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var Clients = make(map[*websocket.Conn]bool)
var Broadcast = make(chan string)

func WSHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("ws error:", err)
		return
	}

	Clients[conn] = true
	log.Println("client connected")

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			delete(Clients, conn)
			conn.Close()
			log.Println("client disconnected")
			break
		}
	}
}
