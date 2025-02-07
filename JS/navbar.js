document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  let showSearchBar = false;
  if (currentPath === "/agents.html" || currentPath === "/maps.html") {
    showSearchBar = true;
  }

  const navElement = document.createElement("nav");
  navElement.className = "navbar navbar-expand-lg bg-dark navbar-dark";
  navElement.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Valorant</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="agents.html">Agents</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="maps.html">Maps</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.html">About</a>
                    </li>
                </ul>
                ${
                  showSearchBar
                    ? `<form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form> `
                    : ""
                } 
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

  console.log(showSearchBar);
});
