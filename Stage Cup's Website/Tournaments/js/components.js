function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      const container = document.getElementById(id);
      if (container) {
        // Create a temporary container to parse HTML
        const temp = document.createElement("div");
        temp.innerHTML = data;

        // Append child nodes one by one to avoid Live Server breaking inline SVGs
        while (temp.firstChild) {
          container.appendChild(temp.firstChild);
        }
      }
    })
    .catch(error => console.error("Error loading component:", error));
}

function fancyLoadComponent(id, file, callback) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      const container = document.getElementById(id);
      if (container) {
        // Create a temporary container to parse HTML
        const temp = document.createElement("div");
        temp.innerHTML = data;

        // Append child nodes one by one to avoid Live Server breaking inline SVGs
        while (temp.firstChild) {
          container.appendChild(temp.firstChild);
        }

        // Call callback if provided
        if (callback) callback();
      }
    })
    .catch(error => console.error("Error loading component:", error));
}

// Mobile menu setup function
function setupMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const buttonsContainer = document.querySelector(".buttons-container");

  if (menuToggle && mobileMenu) {
    // Toggle menu when burger button in header is clicked
    menuToggle.addEventListener("click", function(event) {
      event.stopPropagation();
      mobileMenu.classList.toggle("active");
      if (buttonsContainer) {
        buttonsContainer.classList.toggle("menu-open");
      }
    });

    // Toggle menu when burger button inside mobile menu is clicked
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener("click", function(event) {
        event.stopPropagation();
        mobileMenu.classList.toggle("active");
        if (buttonsContainer) {
          buttonsContainer.classList.toggle("menu-open");
        }
      });
    }

    // Close menu when a link is clicked
    const menuLinks = mobileMenu.querySelectorAll("a:not(.logo)");
    menuLinks.forEach(link => {
      link.addEventListener("click", function() {
        mobileMenu.classList.remove("active");
        if (buttonsContainer) {
          buttonsContainer.classList.remove("menu-open");
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function(event) {
      if (!mobileMenu.classList.contains("active")) {
        return; // Menu is not open, do nothing
      }

      // Don't close if clicking on a burger button (they handle their own toggle)
      if (event.target.closest("#menu-toggle") || event.target.closest("#mobile-menu-toggle")) {
        return;
      }

      // Close if clicking inside the mobile menu content (nav links)
      if (event.target.closest("#mobile-menu")) {
        mobileMenu.classList.remove("active");
        if (buttonsContainer) {
          buttonsContainer.classList.remove("menu-open");
        }
        return;
      }

      // Close if clicking outside both header and mobile menu
      if (!event.target.closest("header")) {
        mobileMenu.classList.remove("active");
        if (buttonsContainer) {
          buttonsContainer.classList.remove("menu-open");
        }
      }
    });
  }
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const navLinks = document.querySelectorAll('nav#header a, .mobile-menu a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    try {
      const url = new URL(href, window.location.origin);
      const linkPath = url.pathname.replace(/\/$/, "");
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    } catch (error) {
      // ignore invalid URLs
    }
  });
}

// Use the function as before
fancyLoadComponent("header", "/Tournaments/templates/header.xml", () => {
  setupMobileMenu();
  highlightActiveNav();
});
loadComponent("footer", "/Tournaments/templates/footer.html");

// hero initialization helper
function setupHero() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  // allow page to specify its own image via data-image attribute
  const imgSrc = hero.dataset.image || "/Tournaments/assets/images/rl-1920x1080-image.webp";
  hero.classList.add("hero");
  hero.style.backgroundImage = `url('${imgSrc}')`;

  // Add a default hero overlay (title + subtitle) when none exists
  if (!hero.querySelector(".hero-inner")) {
    const titleText = hero.dataset.title || document.title || "";
    const subtitleText = hero.dataset.subtitle || "Made by our hands";

    const inner = document.createElement("div");
    inner.className = "hero-inner";

    if (titleText) {
      const h1 = document.createElement("h1");
      h1.textContent = titleText;
      inner.appendChild(h1);
    }

    if (subtitleText) {
      const p = document.createElement("p");
      p.textContent = subtitleText;
      inner.appendChild(p);
    }

    hero.appendChild(inner);
  }
}

// run hero setup once the DOM is available (script is deferred so DOM is ready)
setupHero();