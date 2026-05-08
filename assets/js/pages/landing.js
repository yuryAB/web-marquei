(() => {
  const PRESET_IMAGES = [
    {
      file: "m-preset-01.png",
      alt: "Calendário do Marquei em tons rosados",
    },
    {
      file: "m-preset-02.png",
      alt: "Calendário do Marquei com composição suave",
    },
    {
      file: "m-preset-03.png",
      alt: "Calendário do Marquei com visual claro e neutro",
    },
    {
      file: "m-preset-04.png",
      alt: "Calendário do Marquei com paleta delicada",
    },
    {
      file: "m-preset-05.png",
      alt: "Calendário do Marquei com visual leve",
    },
    {
      file: "m-preset-06.png",
      alt: "Calendário do Marquei com contraste quente e marcante",
    },
    {
      file: "m-preset-07.png",
      alt: "Calendário do Marquei com visual moderno",
    },
    {
      file: "m-preset-08.png",
      alt: "Calendário do Marquei com leitura vibrante",
    },
    {
      file: "m-preset-09.png",
      alt: "Calendário do Marquei com visual delicado",
    },
    {
      file: "m-preset-10.png",
      alt: "Calendário do Marquei com composição escura",
    },
  ];

  function createPresetCard({ file, alt }, basePath, isDuplicate) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    figure.className = "showcase-card";
    image.className = "showcase-image";
    image.src = `${basePath}${file}`;
    image.alt = isDuplicate ? "" : alt;
    image.loading = "lazy";
    image.decoding = "async";

    figure.append(image);
    return figure;
  }

  function createPresetStrip(basePath, isDuplicate = false) {
    const strip = document.createElement("div");
    strip.className = "showcase-strip";

    if (isDuplicate) {
      strip.setAttribute("aria-hidden", "true");
    }

    PRESET_IMAGES.forEach((preset) => {
      strip.append(createPresetCard(preset, basePath, isDuplicate));
    });

    return strip;
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

    root.replaceChildren(track);
    root.dataset.galleryReady = "true";
  }

  document.querySelectorAll("[data-preset-gallery]").forEach(renderPresetGallery);
})();
