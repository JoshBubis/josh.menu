(function () {
  "use strict";

  document.documentElement.classList.add("js-ready");

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

  /* Sailings board filter chips */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var rows = document.querySelectorAll(".sail-row[data-line]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter") || "all";
      chips.forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      rows.forEach(function (row) {
        var line = row.getAttribute("data-line");
        row.hidden = filter !== "all" && line !== filter;
      });
    });
  });

  var form = document.getElementById("plan-form");
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

    status.innerHTML =
      "Got it — this is a demo form, so nothing was emailed. " +
      '<a class="jm-credit" href="https://josh.menu/contact.html">Contact Josh.Menu →</a>';
    form.reset();
  });
})();
