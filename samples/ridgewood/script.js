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
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
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

  /* Listing filter chips — signature interaction */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var listings = document.querySelectorAll(".listing[data-status]");
  var count = document.getElementById("listing-count");

  function applyFilter(filter) {
    var visible = 0;
    listings.forEach(function (item) {
      var status = item.getAttribute("data-status");
      var show = filter === "all" || status === filter;
      item.hidden = !show;
      if (show) visible += 1;
    });
    if (count) {
      count.textContent = "Showing " + visible + " of " + listings.length + " homes";
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter") || "all";
      chips.forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      applyFilter(filter);
    });
  });

  /* "Ask about this home" links prefill the inquiry form's interest field */
  var interestField = document.getElementById("interest");
  var askLinks = document.querySelectorAll(".listing__ask[data-listing]");
  askLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (!interestField) return;
      var label = link.getAttribute("data-listing") || "";
      var matched = false;
      for (var i = 0; i < interestField.options.length; i++) {
        if (interestField.options[i].value === label || interestField.options[i].text === label) {
          interestField.value = interestField.options[i].value || label;
          matched = true;
          break;
        }
      }
      if (!matched) interestField.value = label;
    });
  });

  var tourCta = document.getElementById("hero-tour-cta");
  if (tourCta && interestField) {
    tourCta.addEventListener("click", function () {
      interestField.value = "Schedule a private tour";
    });
  }

  /* Inquiry form — demo only, does not email */
  var form = document.getElementById("inquiry-form");
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
