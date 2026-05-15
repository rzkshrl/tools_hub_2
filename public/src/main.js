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

      // RE-RUN SCRIPTS
      executeScripts(app);

      // HISTORY
      if (addToHistory) {
        history.pushState({ page }, "", `#${page}`);
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);

      app.innerHTML = `
        <div style="padding:40px;text-align:center;">
          <h2>Page not found</h2>
        </div>
      `;
    }
  }

  function executeScripts(container) {
    const scripts = container.querySelectorAll("script");

    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");

      // copy attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      newScript.textContent = oldScript.textContent;

      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  // Browser back button
  window.addEventListener("popstate", (event) => {
    const page = event.state?.page || "home";

    loadPage(page, false);
  });

  window.loadPage = loadPage;

  loadPage("home");
});
