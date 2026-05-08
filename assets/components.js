const DOWNLOAD_LINKS = window.MARQUEI_ENV ?? {};

const APPLE_ICON = `
  <span class="apple-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
      <path
        d="M17.57 12.63c.02 2.69 2.36 3.58 2.38 3.59-.02.06-.37 1.27-1.2 2.52-.72 1.08-1.47 2.16-2.64 2.18-1.15.02-1.52-.68-2.84-.68-1.32 0-1.73.66-2.81.7-1.13.04-1.99-1.13-2.72-2.21-1.49-2.16-2.63-6.12-1.1-8.77.76-1.31 2.12-2.14 3.6-2.16 1.12-.02 2.19.76 2.88.76.69 0 1.98-.94 3.34-.8.57.02 2.18.23 3.21 1.74-.08.05-1.91 1.11-1.9 3.13Zm-2.37-7.6c.6-.72 1-1.72.89-2.72-.86.03-1.91.57-2.53 1.28-.56.64-1.05 1.66-.92 2.63.96.07 1.95-.49 2.56-1.19Z"
        fill="currentColor"
      />
    </svg>
  </span>
`;

const DOWNLOAD_BUTTON_CONFIG = {
  "app-store": {
    url: () => (DOWNLOAD_LINKS.APP_STORE_URL ?? "").trim(),
    hero: {
      className: "store-badge-button",
      markup: `
        <a class="app-store-button" href="#">
          ${APPLE_ICON}
          <span class="app-store-copy">
            <span class="app-store-overline">Disponível na</span>
            <span class="app-store-label">App Store</span>
          </span>
        </a>
      `,
    },
    cta: {
      className: "store-cta-button",
      markup: `
        <a class="cta-button" href="#">
          Baixar na App Store
          <span aria-hidden="true">→</span>
        </a>
      `,
    },
  },
  testflight: {
    url: () => (DOWNLOAD_LINKS.TESTFLIGHT_URL ?? "").trim(),
    hero: {
      className: "store-badge-button",
      markup: `
        <a class="app-store-button" href="#">
          ${APPLE_ICON}
          <span class="app-store-copy">
            <span class="app-store-overline">Disponível no</span>
            <span class="app-store-label">TestFlight</span>
            <span class="download-button-subline">Em breve na App Store</span>
          </span>
        </a>
      `,
    },
    cta: {
      className: "store-cta-button",
      markup: `
        <a class="cta-button" href="#">
          Entrar no TestFlight
          <span aria-hidden="true">→</span>
        </a>
      `,
    },
  },
};

function bindDownloadLink(link, getUrl) {
  const url = getUrl();

  if (url) {
    link.href = url;
    link.classList.remove("is-disabled");
    link.removeAttribute("aria-disabled");
    link.target = "_blank";
    link.rel = "noreferrer";
    return;
  }

  link.href = "#";
  link.classList.add("is-disabled");
  link.setAttribute("aria-disabled", "true");
  link.removeAttribute("target");
  link.removeAttribute("rel");

  if (!link.dataset.downloadDisabledBound) {
    link.addEventListener("click", (event) => event.preventDefault());
    link.dataset.downloadDisabledBound = "true";
  }
}

function renderDownloadButtons() {
  const roots = document.querySelectorAll('[data-download-component="button"]');

  roots.forEach((root) => {
    if (root.dataset.componentReady) {
      return;
    }

    const platform = root.dataset.downloadPlatform || "app-store";
    const variant = root.dataset.downloadVariant || "hero";
    const platformConfig = DOWNLOAD_BUTTON_CONFIG[platform];
    const buttonConfig = platformConfig?.[variant];

    if (!buttonConfig) {
      return;
    }

    root.classList.add("download-component", buttonConfig.className);
    root.innerHTML = buttonConfig.markup;
    bindDownloadLink(root.querySelector("a"), platformConfig.url);
    root.dataset.componentReady = "true";
  });
}

renderDownloadButtons();
