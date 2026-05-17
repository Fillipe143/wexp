package live

import "github.com/gorilla/websocket"

func StartBroadcaster() {
	for range Broadcast {
		for client := range Clients {
			err := client.WriteMessage(websocket.TextMessage, []byte("reload"))
			if err != nil {
				client.Close()
				delete(Clients, client)
			}
		}
	}
}

func TriggerReload() {
	Broadcast <- "reload"
}
