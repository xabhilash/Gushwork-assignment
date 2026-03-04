import { initNavbar } from "../components/navbar/navbar.js";
import { initCarousel } from "../components/carousel/carousel.js";

const initMobileCarouselPlacement = () => {
  var mobileQuery = window.matchMedia("(max-width: 560px)");
  var heroContent = document.querySelector(".hero__content");
  var productDetails = document.querySelector(".hero__content .product-details");
  var carousel = document.querySelector(".hero__content .carousel");
  var priceCard = document.querySelector(".hero__content .price-card");

  if (!heroContent || !productDetails || !carousel || !priceCard) {
    return;
  }

  function placeForMobile() {
    if (mobileQuery.matches) {
      if (carousel.parentElement !== productDetails) {
        productDetails.insertBefore(carousel, priceCard);
      }
      return;
    }

    if (carousel.parentElement !== heroContent) {
      heroContent.insertBefore(carousel, productDetails);
    }
  }

  placeForMobile();
  mobileQuery.addEventListener("change", placeForMobile);
}

/* Enable sticky header when cross first fold */

function initStickyHeaderAfterFirstFold() {
  var header = document.querySelector(".site-header");
  var firstSection = document.querySelector("main > section:first-of-type");

  if (!header || !firstSection) {
    return;
  }

  var stickyThreshold = 0;

  function calculateThreshold() {
    var headerHeight = header.offsetHeight || 0;
    stickyThreshold = firstSection.offsetTop + firstSection.offsetHeight - headerHeight;
  }

  function updateStickyState() {
    var shouldStick = window.scrollY >= stickyThreshold;
    header.classList.toggle("is-sticky", shouldStick);
  }

  var scrollTicking = false;
  function onScroll() {
    if (scrollTicking) {
      return;
    }
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      updateStickyState();
      scrollTicking = false;
    });
  }

  calculateThreshold();
  updateStickyState();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    calculateThreshold();
    updateStickyState();
  });
}

// Modal component

function initDatasheetModal() {
  var openBtn = document.getElementById("openDatasheetModal");
  var modal = document.getElementById("datasheetModal");
  var closeBtn = document.getElementById("closeDatasheetModal");

  if (!openBtn || !modal || !closeBtn) {
    return;
  }

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", function (event) {
    if (event.target.closest("[data-close-modal]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initNavbar();
  initCarousel();
  initMobileCarouselPlacement();
  initStickyHeaderAfterFirstFold();
  initDatasheetModal();
});
