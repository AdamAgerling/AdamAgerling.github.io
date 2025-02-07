document.addEventListener("DOMContentLoaded", function () {
  const footerElement = document.createElement("div");
  footerElement.className = "bg-dark text-light";
  footerElement.innerHTML = `
      <footer class="py-3 my-4">
        <ul class="nav justify-content-center border-bottom pb-3 mb-3">
          <li class="nav-item">
            <a href="/" class="nav-link px-2 text-danger">Home</a>
          </li>
          <li class="nav-item">
            <a href="/navigation/agents.html" class="nav-link px-2 text-danger">Agents</a>
          </li>
          <li class="nav-item">
            <a href="/navigation/maps.html" class="nav-link px-2 text-danger">Maps</a>
          </li>
          <li class="nav-item">
            <a href="/navigation/fakeshop.html" class="nav-link px-2 text-danger">Fake shop</a>
          </li>
          <li class="nav-item">
            <a href="/navigation/about.html" class="nav-link px-2 text-danger">About us</a>
          </li>
        </ul>
        <p class="text-center text-body-danger">© 2025 Vaken, Inc</p>
      </footer>
    `;

  document.body.appendChild(footerElement);
});
