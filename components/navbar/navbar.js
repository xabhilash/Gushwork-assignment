export function initNavbar() {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".site-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", function (event) {
    if (!nav.classList.contains("is-open")) {
      return;
    }
    var target = event.target;
    if (nav.contains(target) || toggle.contains(target)) {
      return;
    }
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
}
