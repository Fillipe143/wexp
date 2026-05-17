package live

import (
	"log"
	"os"
	"path/filepath"
	"time"
)

func Watch(dir string) {
	var last time.Time

	for {
		time.Sleep(500 * time.Millisecond)

		filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
			if err != nil || info.IsDir() {
				return nil
			}

			if info.ModTime().After(last) {
				last = info.ModTime()
				log.Println("change detected → reload")
				TriggerReload()
			}

			return nil
		})
	}
}
