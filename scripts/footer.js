document.addEventListener("DOMContentLoaded", function () {
  let footerId = document.getElementById("footerId");

  footerId.innerHTML = `
        <footer class="py-3 mt-4">
          <ul class="nav justify-content-center border-bottom pb-3 mb-3">
            <li class="nav-item">
              <a href="/" class="nav-link px-2 text-light">Home</a>
            </li>
            <li class="nav-item">
              <a href="/navigation/agents.html" class="nav-link px-2 text-light">Agents</a>
            </li>
            <li class="nav-item">
              <a href="/navigation/maps.html" class="nav-link px-2 text-light">Maps</a>
            </li>
            <li class="nav-item">
              <a href="/navigation/fakeshop.html" class="nav-link px-2 text-light">Fake shop</a>
            </li>
            <li class="nav-item">
              <a href="/navigation/about.html" class="nav-link px-2 text-light">About us</a>
            </li>
          </ul>
          <p class="text-center text-body-danger">© 2025 Vaken, Inc</p>
        </footer>
      `;

  document.body.appendChild(footerId);
});
