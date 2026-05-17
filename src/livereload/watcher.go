package livereload

import (
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/fsnotify/fsnotify"
)

type Watcher struct {
	dir  string
	live *Live

	mu    sync.Mutex
	timer *time.Timer
}

func NewWatcher(dir string, live *Live) *Watcher {
	return &Watcher{
		dir:  dir,
		live: live,
	}
}

func (w *Watcher) Run() error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}
	defer watcher.Close()

	err = filepath.Walk(w.dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			return watcher.Add(path)
		}
		return nil
	})

	if err != nil {
		return err
	}

	log.Println("fsnotify watcher running...")

	for {
		select {

		case event, ok := <-watcher.Events:
			if !ok {
				return nil
			}

			if w.shouldIgnore(event.Name) {
				continue
			}

			if event.Op&(fsnotify.Write|fsnotify.Create|fsnotify.Remove|fsnotify.Rename) != 0 {
				w.scheduleReload(event.Name)
			}

		case err, ok := <-watcher.Errors:
			if !ok {
				return nil
			}

			log.Println("watcher error:", err)
		}
	}
}

func (w *Watcher) scheduleReload(path string) {
	w.mu.Lock()
	defer w.mu.Unlock()

	if w.timer != nil {
		w.timer.Stop()
	}

	w.timer = time.AfterFunc(150*time.Millisecond, func() {
		log.Println("reload triggered:", path)
		w.live.Reload()
	})
}

func (w *Watcher) shouldIgnore(path string) bool {
	base := filepath.Base(path)

	if base == "" {
		return true
	}

	if strings.HasPrefix(base, ".") {
		return true
	}

	if strings.HasSuffix(base, "~") {
		return true
	}

	if strings.Contains(base, "4913") {
		return true
	}

	switch filepath.Ext(base) {
	case ".swp", ".tmp", ".log":
		return true
	}

	return false
}
