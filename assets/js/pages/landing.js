(() => {
  const PRESET_IMAGES = Array.from({ length: 12 }, (_, index) => {
    const presetNumber = String(index + 1).padStart(2, "0");

    return {
      file: `m-preset-${presetNumber}.png`,
      alt: `Modelo ${index + 1} de calendário personalizado do Marquei`,
    };
  });

  const EAGER_PRESET_COUNT = PRESET_IMAGES.length;
  const MIN_SEQUENCE_COUNT = 2;
  const MOBILE_QUERY = "(max-width: 760px)";
  const MOBILE_PORTRAIT_QUERY = "(max-width: 900px) and (orientation: portrait)";
  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

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

  function createPresetSequence(basePath, isDuplicate = false) {
    const sequence = document.createElement("div");

    sequence.className = "showcase-strip";

    if (isDuplicate) {
      sequence.setAttribute("aria-hidden", "true");
    }

    PRESET_IMAGES.forEach((preset, index) => {
      sequence.append(createPresetCard(preset, basePath, isDuplicate, index));
    });

    return sequence;
  }

  function getTrackGap(track) {
    const trackStyles = window.getComputedStyle(track);

    return Number.parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
  }

  function getGallerySpeed() {
    if (window.matchMedia?.(REDUCED_MOTION_QUERY).matches) {
      return 0;
    }

    if (window.matchMedia?.(MOBILE_PORTRAIT_QUERY).matches) {
      return 18;
    }

    if (window.matchMedia?.(MOBILE_QUERY).matches) {
      return 24;
    }

    return 49;
  }

  function removeDuplicateSequences(track) {
    track
      .querySelectorAll('.showcase-strip[aria-hidden="true"]')
      .forEach((sequence) => sequence.remove());
  }

  function syncGalleryTrack(root, track, basePath) {
    const firstSequence = track.querySelector(".showcase-strip");

    if (!firstSequence) {
      return;
    }

    removeDuplicateSequences(track);

    const gap = getTrackGap(track);
    const rootWidth = root.getBoundingClientRect().width;
    const sequenceWidth = firstSequence.getBoundingClientRect().width;

    if (rootWidth <= 0 || sequenceWidth <= 0) {
      return;
    }

    const distance = sequenceWidth + gap;
    const targetWidth = distance + rootWidth;
    let sequenceCount = 1;
    let trackWidth = sequenceWidth;

    while (
      sequenceCount < MIN_SEQUENCE_COUNT ||
      trackWidth < targetWidth
    ) {
      track.append(createPresetSequence(basePath, true));
      sequenceCount += 1;
      trackWidth += sequenceWidth + gap;
    }

    const speed = getGallerySpeed();
    const duration = speed > 0 ? distance / speed : 0;

    root.style.setProperty("--showcase-translate", `${distance * -1}px`);
    root.style.setProperty("--showcase-duration", `${duration}s`);
  }

  function restartGalleryAnimation(track) {
    track.style.animation = "none";
    window.requestAnimationFrame(() => {
      track.style.animation = "";
    });
  }

  function bindGalleryLayout(root, track, basePath) {
    let frameId = null;

    function scheduleSync({ shouldRestart = false } = {}) {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        syncGalleryTrack(root, track, basePath);

        if (shouldRestart) {
          restartGalleryAnimation(track);
        }
      });
    }

    syncGalleryTrack(root, track, basePath);

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => {
        scheduleSync({ shouldRestart: true });
      });

      resizeObserver.observe(root);
      resizeObserver.observe(track.firstElementChild);
      root._showcaseResizeObserver = resizeObserver;
    } else {
      window.addEventListener("resize", () => {
        scheduleSync({ shouldRestart: true });
      });
    }

    [MOBILE_QUERY, MOBILE_PORTRAIT_QUERY, REDUCED_MOTION_QUERY].forEach(
      (query) => {
        const mediaQuery = window.matchMedia?.(query);

        if (!mediaQuery) {
          return;
        }

        mediaQuery.addEventListener?.("change", () => {
          scheduleSync({ shouldRestart: true });
        });
      }
    );
  }

  function bindGalleryViewport(root) {
    if (!("IntersectionObserver" in window)) {
      root.classList.add("is-in-view");
      return;
    }

    const viewportObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          root.classList.toggle("is-in-view", entry.isIntersecting);
        });
      },
      {
        rootMargin: "120px 0px",
        threshold: 0,
      }
    );

    viewportObserver.observe(root);
    root._showcaseViewportObserver = viewportObserver;
  }

  function startGalleryWhenReady(root, track) {
    const earlyImages = [...track.querySelectorAll(".showcase-strip:first-child img")];
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
    const fallbackTimer = window.setTimeout(markAsReady, 1800);

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
    track.append(createPresetSequence(basePath));

    root.classList.add("is-loading");
    root.replaceChildren(track);
    root.dataset.galleryReady = "true";

    bindGalleryLayout(root, track, basePath);
    bindGalleryViewport(root);
    startGalleryWhenReady(root, track);
  }

  document.querySelectorAll("[data-preset-gallery]").forEach(renderPresetGallery);
})();
