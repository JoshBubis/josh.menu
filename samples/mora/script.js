(function () {
  "use strict";

  document.documentElement.classList.add("js-ready");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");

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
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
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

  var panel = document.getElementById("piece-panel");
  var panelName = document.getElementById("piece-panel-name");
  var panelPrice = document.getElementById("piece-panel-price");
  var panelClear = document.getElementById("piece-panel-clear");
  var formPiece = document.getElementById("form-piece");
  var interest = document.getElementById("interest");
  var hits = document.querySelectorAll(".piece__hit");

  function clearHold() {
    hits.forEach(function (hit) {
      hit.classList.remove("is-held");
    });
    if (panel) panel.hidden = true;
    if (formPiece) formPiece.value = "";
  }

  hits.forEach(function (hit) {
    hit.addEventListener("click", function () {
      var name = hit.getAttribute("data-piece") || "";
      var price = hit.getAttribute("data-price") || "";
      hits.forEach(function (other) {
        other.classList.toggle("is-held", other === hit);
      });
      if (panelName) panelName.textContent = name;
      if (panelPrice) panelPrice.textContent = price;
      if (panel) panel.hidden = false;
      if (formPiece) formPiece.value = name;
      if (interest) {
        var opts = interest.options;
        for (var i = 0; i < opts.length; i++) {
          if (opts[i].value === name || opts[i].text === name) {
            interest.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  if (panelClear) {
    panelClear.addEventListener("click", clearHold);
  }

  var form = document.getElementById("inquire-form");
  var status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = false;
    status.classList.remove("is-error");

    var name = String((form.elements.namedItem("name") || {}).value || "").trim();
    var email = String((form.elements.namedItem("email") || {}).value || "").trim();

    if (!name || !email || email.indexOf("@") < 1) {
      status.classList.add("is-error");
      status.textContent = "Add your name and a valid email so we can reply.";
      return;
    }

    var piece = String((form.elements.namedItem("interest") || {}).value || "").trim();
    status.textContent = piece
      ? "Demo hold noted for " + piece + " — nothing was sent. On a real site, Mora would email you."
      : "Demo inquire noted — nothing was sent. On a real site, Mora would email you.";
    form.reset();
    clearHold();
  });
})();
