window.onload = () => {
  const params = new URLSearchParams(window.location.search);

  const gameId = params.get("id");
  const achievement = params.get("achievement");

  document.getElementById("achievementName").innerText = achievement;

  const form = document.getElementById("guideForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const storage = JSON.parse(localStorage.getItem("guides")) || {};

    if (!storage[gameId]) {
      storage[gameId] = {};
    }

    if (!storage[gameId][achievement]) {
      storage[gameId][achievement] = [];
    }

    storage[gameId][achievement].push({
      title,
      description,
      createdAt: Date.now(),
    });

    localStorage.setItem("guides", JSON.stringify(storage));

    // redireciona de volta pra lista
    window.location.href =
      `/pages/guideList/guides.html?id=${gameId}` +
      `&achievement=${encodeURIComponent(achievement)}`;
  });

  document
    .getElementById("backBtn")
    .addEventListener("click", () => history.back());
};
