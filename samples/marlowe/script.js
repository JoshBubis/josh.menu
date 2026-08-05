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

  /* —— Sticky hours bar: live open/closed status from local device time ——
     Hours mirror the #hours table. Sunday = 0 … Saturday = 6, decimal 24h. */
  var HOURS = [
    { label: "Sunday", ranges: [[17, 21]] },
    { label: "Monday", ranges: [] },
    { label: "Tuesday", ranges: [[17, 22]] },
    { label: "Wednesday", ranges: [[17, 22]] },
    { label: "Thursday", ranges: [[17, 22]] },
    { label: "Friday", ranges: [[11.5, 14], [17, 23]] },
    { label: "Saturday", ranges: [[11.5, 14], [17, 23]] }
  ];

  function formatHour(decimalHour) {
    var wrapped = ((decimalHour % 24) + 24) % 24;
    var hh = Math.floor(wrapped);
    var mm = Math.round((wrapped - hh) * 60);
    var period = hh >= 12 ? "pm" : "am";
    var displayHour = hh % 12;
    if (displayHour === 0) displayHour = 12;
    var minStr = mm ? ":" + (mm < 10 ? "0" + mm : String(mm)) : "";
    return displayHour + minStr + period;
  }

  function getStatus(date) {
    var day = date.getDay();
    var hour = date.getHours() + date.getMinutes() / 60;
    var today = HOURS[day];

    for (var i = 0; i < today.ranges.length; i++) {
      var range = today.ranges[i];
      if (hour >= range[0] && hour < range[1]) {
        return { open: true, text: "Open now · kitchen until " + formatHour(range[1]) };
      }
    }

    for (var j = 0; j < today.ranges.length; j++) {
      var later = today.ranges[j];
      if (hour < later[0]) {
        return { open: false, text: "Closed now · opens today at " + formatHour(later[0]) };
      }
    }

    for (var k = 1; k <= 7; k++) {
      var idx = (day + k) % 7;
      var next = HOURS[idx];
      if (next.ranges.length) {
        var when = k === 1 ? "tomorrow" : next.label;
        return { open: false, text: "Closed now · opens " + when + " at " + formatHour(next.ranges[0][0]) };
      }
    }

    return { open: false, text: "See hours below" };
  }

  var statusEl = document.getElementById("hours-status");
  var statusText = document.getElementById("hours-status-text");

  function renderStatus() {
    if (!statusEl || !statusText) return;
    var status = getStatus(new Date());
    statusText.textContent = status.text;
    statusEl.classList.remove("is-open", "is-closed");
    statusEl.classList.add(status.open ? "is-open" : "is-closed");
  }

  if (statusEl && statusText) {
    renderStatus();
    setInterval(renderStatus, 60000);
  }

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
      status.textContent = "Add your name and a valid email so we can confirm the table.";
      return;
    }

    /* Demo only — does not book a table or email anyone. */
    status.innerHTML =
      "Got it — this is a demo form, so no table was actually booked. " +
      '<a class="jm-credit" href="https://josh.menu/contact.html">Contact Josh.Menu →</a>';
    form.reset();
  });
})();
