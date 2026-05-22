import { mdToHtml } from "/js/markdown_viewer/index.js";

window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameName = params.get("name");
  const gameId = params.get("id");
  const gameImage = params.get("image");
  const achievement = params.get("achievement");
  const achievementIcon = params.get("icon");

  const form = document.getElementById("guideForm");
  const titleInput = document.getElementById("title");
  const textarea = document.getElementById("description");
  const preview = document.getElementById("markdownPreview");
  const pageTitle = document.querySelector("h1");

  // 1. Carrega o banco de dados do LocalStorage
  const storage = JSON.parse(localStorage.getItem("guides")) || {};

  // 2. Busca o histórico de versões desta conquista específica
  const currentVersions = storage[gameId]?.[achievement] || [];

  // --- DETECTANDO SE É UMA NOVA VERSÃO (EDIÇÃO) OU O PRIMEIRO GUIA ---
  if (currentVersions.length > 0) {
    pageTitle.innerText = "Sugerir melhoria (Nova versão)";

    // Para preencher o formulário, precisamos achar a versão MAIS VOTADA atual.
    // Clonamos e ordenamos por upvotes (do maior para o menor)
    const sortedVersions = [...currentVersions].sort(
      (a, b) => b.upvotes - a.upvotes,
    );
    const topVersion = sortedVersions[0];

    // Preenche os campos do formulário com a versão que está atualmente na frontpage
    titleInput.value = topVersion.title;
    textarea.value = topVersion.description;

    // Atualiza o preview de Markdown inicial
    preview.innerHTML = mdToHtml(topVersion.description);
  } else {
    pageTitle.innerText = "Criar primeiro guia";
  }

  // Define o título da conquista no topo da página
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

    // Inicializa os nós do objeto caso o jogo ou conquista nunca tenham tido guias
    if (!storage[gameId]) storage[gameId] = {};
    if (!storage[gameId][achievement]) storage[gameId][achievement] = [];

    // 3. CRIA A NOVA VERSÃO
    // Não importa se é o primeiro guia ou a décima edição, salvamos como um novo item na lista!
    const newVersion = {
      versionId: String(Date.now()), // ID único para podermos computar os votos nele depois
      title: title,
      description: description,
      createdAt: Date.now(),
      upvotes: 0, // Toda versão nasce com zero votos
    };

    // Adiciona a nova versão na array da conquista
    storage[gameId][achievement].push(newVersion);

    // Salva o banco atualizado no LocalStorage
    localStorage.setItem("guides", JSON.stringify(storage));

    // Redireciona de volta para a tela da conquista
    window.location.href =
      `/pages/guideList/guide-detail.html?id=${gameId}` +
      `&name=${encodeURIComponent(gameName)}` +
      `&image=${encodeURIComponent(gameImage)}` +
      `&achievement=${encodeURIComponent(achievement)}` +
      `&icon=${encodeURIComponent(achievementIcon)}`;
  });
};
