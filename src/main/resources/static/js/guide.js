window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const game = params.get("game");
  const achievement = params.get("achievement");

  // pegar elementos
  const titleEl = document.getElementById("achievementTitle");
  const gameEl = document.getElementById("gameName");
  const container = document.getElementById("guidesContainer");

  /* 🔒 evitar erro caso algo não exista
  if (!titleEl || !gameEl || !container) {
    console.error("Elementos do HTML não encontrados!");
    return;
  }
*/
  // preencher dados
  titleEl.innerText = achievement || "Conquista";
  gameEl.innerText = game || "Jogo";

  // 🔥 MOCK de guias por conquista
  const guides = [
    {
      title: "Guia completo",
      content: "Para desbloquear essa conquista, complete todas as missões secundárias."
    },
    {
      title: "Guia rápido",
      content: "Foque apenas nos objetivos principais e ignore extras."
    }
  ];

  // renderizar guias
  container.innerHTML = "";

  guides.forEach(g => {
    const div = document.createElement("div");
    div.classList.add("achievement");

    div.innerHTML = `
      <strong>${g.title}</strong>
      <p>${g.content}</p>
    `;

    container.appendChild(div);
  });

  function goBack() {
  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");
  const name = params.get("name");
  const image = params.get("image");

  window.location.href = `game.html?id=${id}&name=${encodeURIComponent(name)}&image=${encodeURIComponent(image)}`;
  }
};