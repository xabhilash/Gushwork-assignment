export function initAccordion() {
  var faqList = document.getElementById("faqList");
  if (!faqList) {
    return;
  }

  faqList.addEventListener("click", function (event) {
    var trigger = event.target.closest(".faq-item__trigger");
    if (!trigger) {
      return;
    }

    var item = trigger.closest(".faq-item");
    var content = item && item.querySelector(".faq-item__content");
    if (!item || !content) {
      return;
    }

    var isOpen = item.classList.contains("is-open");
    var nextState = !isOpen;

    item.classList.toggle("is-open", nextState);
    trigger.setAttribute("aria-expanded", String(nextState));
    content.hidden = !nextState;
  });
}
