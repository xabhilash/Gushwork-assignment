export function initCarousel() {
  var carouselEl = document.querySelector(".carousel");
  var frameEl = document.querySelector(".carousel__frame");
  var imageEl = document.getElementById("carousel-image");
  var thumbsEl = document.getElementById("carousel-thumbs");
  var prevBtn = document.querySelector(".carousel__arrow--left");
  var nextBtn = document.querySelector(".carousel__arrow--right");

  if (!carouselEl || !frameEl || !imageEl || !thumbsEl || !prevBtn || !nextBtn) {
    return;
  }

  var slides = [
    {
      src: "./assets/images/img-carousel.jpg",
      alt: "Workers installing HDPE pipes",
    },
    {
      src: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=900&q=80",
      alt: "Industrial pipe connection closeup",
    },
    {
      src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
      alt: "Pipe infrastructure in construction site",
    },
    {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
      alt: "Engineers reviewing technical pipe drawings",
    },
    {
      src: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=900&q=80",
      alt: "Manufacturing quality check for pipe systems",
    },
    {
      src: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=900&q=80",
      alt: "Manufacturing quality check for pipe systems",
    }
  ];

  var current = 0;
  var isZooming = false;
  var zoomScale = 2.25;
  var zoomX = 0;
  var zoomY = 0;
  var zoomRafId = 0;
  var frameRect = null;
  var lensW = 0;
  var lensH = 0;
  var previewW = 0;
  var previewH = 0;
  var thumbButtons = [];

  var lensEl = document.createElement("div");
  lensEl.className = "carousel__lens";
  lensEl.innerHTML = '<span class="carousel__lens-icon" aria-hidden="true"></span>';

  var zoomPreviewEl = document.createElement("div");
  zoomPreviewEl.className = "carousel__zoom-preview";
  zoomPreviewEl.innerHTML = '<img class="carousel__zoom-image" alt="">';
  var zoomImageEl = zoomPreviewEl.querySelector(".carousel__zoom-image");

  frameEl.appendChild(lensEl);
  carouselEl.appendChild(zoomPreviewEl);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function preloadImage(src) {
    var img = new Image();
    img.decoding = "async";
    img.src = src;
  }

  function cacheZoomMetrics() {
    // Cache expensive layout reads once per zoom session/resize.
    frameRect = frameEl.getBoundingClientRect();
    lensW = lensEl.offsetWidth;
    lensH = lensEl.offsetHeight;
    previewW = zoomPreviewEl.clientWidth;
    previewH = zoomPreviewEl.clientHeight;
  }

  function updateZoomSource() {
    zoomImageEl.src = slides[current].src;
    zoomImageEl.alt = slides[current].alt;
  }

  function applyZoomPosition() {
    zoomRafId = 0;
    if (!isZooming) {
      return;
    }
    if (!frameRect || !frameRect.width || !frameRect.height) {
      cacheZoomMetrics();
    }
    // Convert viewport cursor coordinates to coordinates relative to the frame.
    var x = clamp(zoomX - frameRect.left, 0, frameRect.width);
    var y = clamp(zoomY - frameRect.top, 0, frameRect.height);
    var lensLeft = clamp(x - lensW / 2, 0, frameRect.width - lensW);
    var lensTop = clamp(y - lensH / 2, 0, frameRect.height - lensH);

    lensEl.style.left = lensLeft + "px";
    lensEl.style.top = lensTop + "px";

    var zoomW = frameRect.width * zoomScale;
    var zoomH = frameRect.height * zoomScale;
    var ratioX = frameRect.width ? x / frameRect.width : 0;
    var ratioY = frameRect.height ? y / frameRect.height : 0;

    zoomImageEl.style.width = zoomW + "px";
    zoomImageEl.style.height = zoomH + "px";
    zoomImageEl.style.left = -ratioX * (zoomW - previewW) + "px";
    zoomImageEl.style.top = -ratioY * (zoomH - previewH) + "px";
  }

  function requestZoomPosition(clientX, clientY) {
    zoomX = clientX;
    zoomY = clientY;
    // Throttle high-frequency mousemove updates to one paint frame.
    if (!zoomRafId) {
      zoomRafId = window.requestAnimationFrame(applyZoomPosition);
    }
  }

  function renderThumbs() {
    var frag = document.createDocumentFragment();
    thumbButtons = [];

    slides.forEach(function (slide, idx) {
      var button = document.createElement("button");
      button.className = "carousel__thumb";
      button.type = "button";
      button.dataset.index = String(idx);
      button.setAttribute("aria-label", "Show image " + (idx + 1));

      var img = document.createElement("img");
      img.src = slide.src;
      img.alt = slide.alt;
      img.loading = "lazy";
      img.decoding = "async";

      button.appendChild(img);
      thumbButtons.push(button);
      frag.appendChild(button);
    });

    thumbsEl.replaceChildren(frag);
  }

  function updateActiveThumb() {
    thumbButtons.forEach(function (button, idx) {
      button.classList.toggle("is-active", idx === current);
    });
  }

  function renderMain() {
    var activeSlide = slides[current];
    imageEl.src = activeSlide.src;
    imageEl.alt = activeSlide.alt;
    updateZoomSource();
    updateActiveThumb();
    // Preload the next slide image for smoother arrow navigation.
    preloadImage(slides[(current + 1) % slides.length].src);
  }

  prevBtn.addEventListener("click", function () {
    current = (current - 1 + slides.length) % slides.length;
    renderMain();
  });

  nextBtn.addEventListener("click", function () {
    current = (current + 1) % slides.length;
    renderMain();
  });

  thumbsEl.addEventListener("click", function (event) {
    var target = event.target;
    var button = target && target.closest("[data-index]");
    if (!button) {
      return;
    }
    current = Number(button.dataset.index);
    renderMain();
  });

  frameEl.addEventListener("mouseenter", function (event) {
    isZooming = true;
    carouselEl.classList.add("is-zooming");
    cacheZoomMetrics();
    requestZoomPosition(event.clientX, event.clientY);
  });

  frameEl.addEventListener("mousemove", function (event) {
    if (!isZooming) {
      return;
    }
    requestZoomPosition(event.clientX, event.clientY);
  });

  frameEl.addEventListener("mouseleave", function () {
    isZooming = false;
    carouselEl.classList.remove("is-zooming");
    if (zoomRafId) {
      window.cancelAnimationFrame(zoomRafId);
      zoomRafId = 0;
    }
  });

  window.addEventListener("resize", function () {
    if (isZooming) {
      cacheZoomMetrics();
      requestZoomPosition(zoomX, zoomY);
    }
  });

  renderThumbs();
  renderMain();
}
