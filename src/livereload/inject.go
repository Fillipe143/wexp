package livereload

import "strings"

func InjectReload(html []byte) []byte {
	script := `
<script>
(() => {
	const ws = new WebSocket("ws://" + location.host + "/ws");
	ws.onmessage = () => location.reload();
})();
</script>`

	return []byte(strings.Replace(string(html), "</body>", script+"</body>", 1))
}
