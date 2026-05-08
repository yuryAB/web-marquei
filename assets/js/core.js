(() => {
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let revealObserver = null;

  function normalizeIndexUrl() {
    if (!window.location.pathname.endsWith("/index.html")) {
      return;
    }

    const cleanPath = window.location.pathname.slice(0, -"index.html".length);
    const cleanUrl = `${cleanPath}${window.location.search}${window.location.hash}`;
    window.history.replaceState(null, "", cleanUrl);
  }

  function syncCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  }

  function initRevealNodes(nodes = document.querySelectorAll("[data-reveal]")) {
    document.documentElement.classList.add("has-reveal");

    const revealList = [...nodes].filter((node) => !node.dataset.revealBound);

    if (!revealList.length) {
      return;
    }

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      revealList.forEach((node) => {
        node.dataset.revealBound = "true";
        node.classList.add("is-visible");
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -80px 0px",
        }
      );
    }

    revealList.forEach((node) => {
      node.dataset.revealBound = "true";
      revealObserver.observe(node);
    });
  }

  normalizeIndexUrl();
  syncCurrentYear();
  initRevealNodes();

  window.MarqueiCore = Object.freeze({
    initRevealNodes,
  });
})();
