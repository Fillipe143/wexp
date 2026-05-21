import { mdToHtml } from "/js/markdown_viewer/index.js";

window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameName = params.get("name");
  const gameId = params.get("id");
  const gameImage = params.get("image");
  const achievement = params.get("achievement");
  const achievementIcon = params.get("icon");

  // 👇 Pega o ID do guia caso seja uma edição
  const guideId = params.get("guideId");

  const form = document.getElementById("guideForm");
  const titleInput = document.getElementById("title");
  const textarea = document.getElementById("description");
  const preview = document.getElementById("markdownPreview");
  const pageTitle = document.querySelector("h1");

  // Carrega o banco de dados local
  const storage = JSON.parse(localStorage.getItem("guides")) || {};

  // --- MODO EDIÇÃO ---
  // Se houver um guideId na URL, significa que estamos editando
  if (guideId) {
    pageTitle.innerText = "Editar guia";

    // Busca o guia específico que queremos editar
    const guidesList = storage[gameId]?.[achievement] || [];
    const guideToEdit = guidesList.find((g) => g.id === guideId);

    if (guideToEdit) {
      // Preenche os campos com os dados atuais do guia
      titleInput.value = guideToEdit.title;
      textarea.value = guideToEdit.description;

      // Renderiza o preview inicial
      preview.innerHTML = mdToHtml(guideToEdit.description);
    }
  }

  // Altera o nome da conquista no topo da página
  document.getElementById("achievementName").innerText =
    achievement + " - " + gameName;

  // Atualiza o preview em tempo real enquanto o usuário digita
  textarea.addEventListener("input", () => {
    preview.innerHTML = mdToHtml(textarea.value);
  });

  // --- SALVAMENTO (SUBMIT) ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value;
    const description = textarea.value;

    if (!storage[gameId]) storage[gameId] = {};
    if (!storage[gameId][achievement]) storage[gameId][achievement] = [];

    if (guideId) {
      // 📝 LOGICA DE EDIÇÃO
      const guidesList = storage[gameId][achievement];
      const guideIndex = guidesList.findIndex((g) => g.id === guideId);

      if (guideIndex !== -1) {
        const currentGuide = guidesList[guideIndex];

        // Se o histórico não existir no objeto antigo, inicializa ele
        if (!currentGuide.history) currentGuide.history = [];

        // 1. Salva a versão atual no histórico ANTES de alterar
        currentGuide.history.push({
          title: currentGuide.title,
          description: currentGuide.description,
          updatedAt: Date.now(),
        });

        // 2. Atualiza com os novos dados informados no formulário
        currentGuide.title = title;
        currentGuide.description = description;

        guidesList[guideIndex] = currentGuide;
      }
    } else {
      // ➕ LOGICA DE CRIAÇÃO (Guia Novo)
      storage[gameId][achievement].push({
        id: String(Date.now()), // Gera um ID único baseado no tempo
        title,
        description,
        createdAt: Date.now(),
        history: [], // Inicializa o histórico vazio
      });
    }

    // Grava as alterações no LocalStorage
    localStorage.setItem("guides", JSON.stringify(storage));

    // Redireciona de volta para a lista de guias
    window.location.href =
      `/pages/guideList/guides.html?id=${gameId}` +
      `&name=${encodeURIComponent(gameName)}` +
      `&image=${encodeURIComponent(gameImage)}` +
      `&achievement=${encodeURIComponent(achievement)}` +
      `&icon=${encodeURIComponent(achievementIcon)}`;
  });
};
