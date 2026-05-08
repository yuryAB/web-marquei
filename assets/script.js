const currentYearNodes = document.querySelectorAll("[data-current-year]");
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

normalizeIndexUrl();

currentYearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

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

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatInlineText(text) {
  const escaped = escapeHtml(text);

  return escaped
    .replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noreferrer">$1</a>'
    )
    .replace(
      /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi,
      '<a href="mailto:$1">$1</a>'
    );
}

function renderLegalBlock(block) {
  if (block.type === "list") {
    return `
      <ul class="legal-list">
        ${block.items
          .map((item) => `<li>${formatInlineText(item)}</li>`)
          .join("")}
      </ul>
    `;
  }

  if (block.type === "paragraph") {
    return `<p>${formatInlineText(block.text)}</p>`;
  }

  return "";
}

function renderLegalSubsection(subsection) {
  return `
    <div class="legal-subsection">
      <h3>${escapeHtml(subsection.subtitle)}</h3>
      ${subsection.content.map(renderLegalBlock).join("")}
    </div>
  `;
}

function renderLegalSection(section) {
  return `
    <section class="legal-section-card" data-reveal="up">
      <h2>${escapeHtml(section.title)}</h2>
      ${section.content ? section.content.map(renderLegalBlock).join("") : ""}
      ${
        section.subsections
          ? `<div class="legal-subsections">${section.subsections
              .map(renderLegalSubsection)
              .join("")}</div>`
          : ""
      }
    </section>
  `;
}

async function renderLegalPage() {
  const legalRoot = document.querySelector("[data-legal-root]");

  if (!legalRoot) {
    return;
  }

  const source = legalRoot.dataset.legalSource;
  const home = legalRoot.dataset.legalHome;
  const icon = legalRoot.dataset.legalIcon;

  try {
    const response = await fetch(source, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load ${source}`);
    }

    const data = await response.json();
    document.title = `Marquei | ${data.hero.title}`;

    legalRoot.innerHTML = `
      <a class="text-link legal-back-link" href="${home}">← Início</a>
      <section class="legal-hero-panel" data-reveal="up">
        <a class="brand brand-legal" href="${home}" aria-label="Marquei">
          <img class="brand-logo brand-logo-legal" src="${icon}" alt="" />
          <span class="brand-wordmark">Marquei</span>
        </a>
        <p class="eyebrow">Documentos legais</p>
        <h1>${escapeHtml(data.hero.title)}</h1>
        <p class="legal-lead">${escapeHtml(data.hero.subtitle)}</p>
        <div class="legal-meta-row">
          <span class="legal-meta-pill">
            ${escapeHtml(data.hero.lastUpdatedLabel)} ${escapeHtml(
      data.hero.lastUpdated
    )}
          </span>
        </div>
        <p class="legal-summary">${escapeHtml(data.hero.summary)}</p>
      </section>
      <div class="legal-sections">
        ${data.sections.map(renderLegalSection).join("")}
      </div>
    `;

    initRevealNodes(legalRoot.querySelectorAll("[data-reveal]"));
  } catch (error) {
    legalRoot.innerHTML = `
      <a class="text-link legal-back-link" href="${home}">← Início</a>
      <section class="legal-hero-panel is-error">
        <p class="eyebrow">Documentos legais</p>
        <h1>Erro ao carregar o documento</h1>
        <p class="legal-lead">
          Nao foi possivel carregar o conteudo legal a partir de <code>${escapeHtml(
            source
          )}</code>.
        </p>
      </section>
    `;
  }
}

initRevealNodes();
void renderLegalPage();
