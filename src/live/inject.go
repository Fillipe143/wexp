package live

import "strings"

func InjectReload(html []byte) []byte {
	script := `<script>new WebSocket("ws://localhost:8080/ws").onmessage=()=>location.reload();</script>`
	return []byte(strings.Replace(string(html), "</body>", script+"</body>", 1))
}
