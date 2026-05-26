(() => {
  const PRESET_IMAGES = Array.from({ length: 12 }, (_, index) => {
    const presetNumber = String(index + 1).padStart(2, "0");

    return {
      file: `m-preset-${presetNumber}.png`,
      alt: `Modelo ${index + 1} de calendário personalizado do Marquei`,
    };
  });

  const EAGER_PRESET_COUNT = 6;

  function createPresetCard({ file, alt }, basePath, isDuplicate, index) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const shouldLoadEarly = !isDuplicate && index < EAGER_PRESET_COUNT;

    figure.className = "showcase-card";
    image.className = "showcase-image";
    image.src = `${basePath}${file}`;
    image.alt = isDuplicate ? "" : alt;
    image.width = 640;
    image.height = 940;
    image.loading = shouldLoadEarly ? "eager" : "lazy";
    image.decoding = "async";

    if (shouldLoadEarly) {
      image.setAttribute("fetchpriority", "low");
    }

    figure.append(image);
    return figure;
  }

  function createPresetStrip(basePath, isDuplicate = false) {
    const strip = document.createElement("div");
    strip.className = "showcase-strip";

    if (isDuplicate) {
      strip.setAttribute("aria-hidden", "true");
    }

    PRESET_IMAGES.forEach((preset, index) => {
      strip.append(createPresetCard(preset, basePath, isDuplicate, index));
    });

    return strip;
  }

  function startGalleryWhenReady(root, track) {
    const earlyImages = [
      ...track.querySelectorAll(".showcase-strip:not([aria-hidden]) img"),
    ].slice(0, EAGER_PRESET_COUNT);
    let isReady = false;

    function markAsReady() {
      if (isReady) {
        return;
      }

      isReady = true;
      root.classList.remove("is-loading");
      root.classList.add("is-ready");
    }

    const pendingImages = earlyImages.filter((image) => !image.complete);

    if (!pendingImages.length) {
      markAsReady();
      return;
    }

    let pendingCount = pendingImages.length;
    const fallbackTimer = window.setTimeout(markAsReady, 1600);

    function handleImageComplete() {
      pendingCount -= 1;

      if (pendingCount <= 0) {
        window.clearTimeout(fallbackTimer);
        markAsReady();
      }
    }

    pendingImages.forEach((image) => {
      image.addEventListener("load", handleImageComplete, { once: true });
      image.addEventListener("error", handleImageComplete, { once: true });
    });
  }

  function renderPresetGallery(root) {
    if (root.dataset.galleryReady) {
      return;
    }

    const basePath =
      root.dataset.presetBasePath || "./assets/images/landing/presets/";
    const track = document.createElement("div");

    track.className = "showcase-track";
    track.append(createPresetStrip(basePath));
    track.append(createPresetStrip(basePath, true));

    root.classList.add("is-loading");
    root.replaceChildren(track);
    root.dataset.galleryReady = "true";
    startGalleryWhenReady(root, track);
  }

  document.querySelectorAll("[data-preset-gallery]").forEach(renderPresetGallery);
})();
