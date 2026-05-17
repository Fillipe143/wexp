package livereload

import "sync"

type Live struct {
	clients map[client]bool
	mu      sync.Mutex
	events  chan string
}

type client interface {
	WriteMessage(int, []byte) error
	Close() error
}

func New() *Live {
	l := &Live{
		clients: make(map[client]bool),
		events:  make(chan string, 1),
	}

	go l.broadcaster()
	return l
}

func (l *Live) Add(c client) {
	l.mu.Lock()
	l.clients[c] = true
	l.mu.Unlock()
}

func (l *Live) Remove(c client) {
	l.mu.Lock()
	delete(l.clients, c)
	l.mu.Unlock()
	c.Close()
}

func (l *Live) Reload() {
	select {
	case l.events <- "reload":
	default:
	}
}

func (l *Live) broadcaster() {
	for range l.events {
		l.mu.Lock()

		for c := range l.clients {
			_ = c.WriteMessage(1, []byte("reload"))
		}

		l.mu.Unlock()
	}
}
