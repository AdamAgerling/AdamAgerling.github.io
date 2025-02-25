document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  const navElement = document.createElement("nav");
  navElement.className = "navbar navbar-expand-lg bg-dark navbar-dark";
  navElement.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand text-danger fs-2" href="/">Vaken</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/navigation/agents.html">Agents</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/navigation/maps.html">Maps</a>
                    </li>
                    <li class="nav-item">
                       <a class="nav-link" href="/navigation/fakeshop.html">Fake Shop</a>
                   </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/navigation/about.html">About</a>
                    </li>
                </ul>
            </div>
        </div>
    `;

  document.body.prepend(navElement);

  const navLinks = document.querySelectorAll(".navbar-nav a");

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
});
