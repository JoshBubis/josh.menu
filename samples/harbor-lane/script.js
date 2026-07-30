(function () {
  "use strict";

  document.documentElement.classList.add("js-ready");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");

  /* Content is always visible in CSS. IO only triggers a soft animation class —
     never required for readability (Telegram / in-app WebViews break IO). */
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.01 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  }

  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      menu.hidden = open;
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  var form = document.getElementById("plan-form");
  var status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = false;
    status.classList.remove("is-error");

    var name = (form.elements.namedItem("name") || {}).value || "";
    var email = (form.elements.namedItem("email") || {}).value || "";
    name = String(name).trim();
    email = String(email).trim();

    if (!name || !email || email.indexOf("@") < 1) {
      status.classList.add("is-error");
      status.textContent = "Add your name and a valid email so we can reply.";
      return;
    }

    status.innerHTML =
      "Got it — this is a demo form, so nothing was emailed. " +
      '<a class="jm-credit" href="https://josh.menu/contact.html">Contact Josh.Menu →</a>';
    form.reset();
  });
})();
