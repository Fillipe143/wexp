package static

import (
	"net/http"
	"os"
	"strings"

	"wexp/src/live"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	path := "./public" + r.URL.Path

	if strings.HasSuffix(r.URL.Path, "/") {
		path += "index.html"
	}

	file, err := os.ReadFile(path)

	if err != nil {
		indexPath := "./public/index.html"
		indexFile, err := os.ReadFile(indexPath)
		if err != nil {
			http.NotFound(w, r)
			return
		}

		w.Header().Set("Content-Type", "text/html")
		w.Write(live.InjectReload(indexFile))
		return
	}

	if strings.HasSuffix(path, ".html") {
		w.Header().Set("Content-Type", "text/html")
		w.Write(live.InjectReload(file))
		return
	}

	http.ServeFile(w, r, path)
}
