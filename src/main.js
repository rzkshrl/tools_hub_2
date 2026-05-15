window.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  async function loadPage(page, addToHistory = true) {
    try {
      const response = await fetch(`/public/pages/${page}.html`);

      if (!response.ok) {
        throw new Error("Page not found");
      }

      const html = await response.text();

      app.innerHTML = html;

      if (addToHistory) {
        history.pushState({ page }, "", `#${page}`);
      }
    } catch (error) {
      console.error(error);

      app.innerHTML = `
        <div style="padding:40px">
          <h2>Page not found</h2>
        </div>
      `;
    }
  }

  window.loadPage = loadPage;

  loadPage("home");

  window.addEventListener("popstate", (event) => {
    const page = event.state?.page || "home";

    loadPage(page, false);
  });
});
