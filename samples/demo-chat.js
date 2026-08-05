/**
 * Sample-site demo chat — proactive teaser, no Turnstile, no Hub API.
 * Dummy bot always replies the same canned line so visitors see the widget
 * shape without thinking it's a live concierge.
 *
 * Set before this script loads:
 *   window.JM_DEMO_CHAT = {
 *     brand: "Marlowe",
 *     greeting: "Looking for a table tonight?",
 *     reply: "…",
 *     fabLabel: "Chat",
 *     delayMs: 2200
 *   };
 */
(function () {
  var cfg = window.JM_DEMO_CHAT || {};
  var brand = cfg.brand || "Sample";
  var greeting =
    cfg.greeting ||
    "Hi — this is a sample chat widget. Ask anything to see how it feels.";
  var reply =
    cfg.reply ||
    "This is a demo chat on a Josh.Menu sample site — not a live inbox. " +
      "It always replies the same way so you can feel the widget. " +
      "If you want something like this on a real site, start a project at josh.menu.";
  var fabLabel = cfg.fabLabel || "Chat";
  var delayMs = typeof cfg.delayMs === "number" ? cfg.delayMs : 2200;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  var root = el("div", "demo-chat");
  root.setAttribute("data-demo-chat", "");

  var teaser = el("button", "demo-chat__teaser");
  teaser.type = "button";
  teaser.hidden = true;
  teaser.setAttribute("aria-label", "Open sample chat: " + greeting);
  teaser.appendChild(el("span", "demo-chat__teaser-brand", brand));
  teaser.appendChild(el("span", "demo-chat__teaser-text", greeting));
  teaser.appendChild(el("span", "demo-chat__teaser-hint", "Sample widget · tap to reply"));

  var fab = el("button", "demo-chat__fab");
  fab.type = "button";
  fab.setAttribute("aria-label", "Open sample chat");
  fab.setAttribute("aria-expanded", "false");
  fab.appendChild(el("span", "demo-chat__fab-dot", ""));
  fab.appendChild(el("span", "demo-chat__fab-label", fabLabel));

  var panel = el("aside", "demo-chat__panel");
  panel.hidden = true;
  panel.setAttribute("aria-label", brand + " sample chat");

  var head = el("header", "demo-chat__head");
  head.appendChild(el("p", "demo-chat__title", brand + " · chat"));
  var closeBtn = el("button", "demo-chat__close");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close chat");
  closeBtn.innerHTML = "&times;";
  head.appendChild(closeBtn);

  var log = el("div", "demo-chat__log");
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");

  var note = el(
    "p",
    "demo-chat__note",
    "Demo only — replies are canned. Real studio chat lives on josh.menu."
  );

  var form = el("form", "demo-chat__form");
  var input = el("textarea", "demo-chat__input");
  input.rows = 2;
  input.maxLength = 500;
  input.placeholder = "Type a message…";
  input.setAttribute("aria-label", "Your message");
  var send = el("button", "demo-chat__send", "Send");
  send.type = "submit";
  form.appendChild(input);
  form.appendChild(send);

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(note);
  panel.appendChild(form);
  root.appendChild(teaser);
  root.appendChild(panel);
  root.appendChild(fab);
  document.body.appendChild(root);

  var open = false;
  var greeted = false;

  function bubble(kind, text) {
    var row = el("div", "demo-chat__msg demo-chat__msg--" + kind);
    row.appendChild(el("p", "", text));
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function ensureGreeting() {
    if (greeted) return;
    greeted = true;
    bubble("bot", greeting);
  }

  function setOpen(next) {
    open = next;
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    teaser.hidden = true;
    if (open) {
      ensureGreeting();
      input.focus();
    }
  }

  function showTeaser() {
    if (open) return;
    teaser.hidden = false;
    if (!reduceMotion) teaser.classList.add("is-in");
  }

  teaser.addEventListener("click", function () {
    setOpen(true);
  });
  fab.addEventListener("click", function () {
    setOpen(!open);
  });
  closeBtn.addEventListener("click", function () {
    setOpen(false);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = (input.value || "").trim();
    if (!text) return;
    bubble("user", text);
    input.value = "";
    window.setTimeout(
      function () {
        bubble("bot", reply);
      },
      reduceMotion ? 0 : 450
    );
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  window.setTimeout(showTeaser, reduceMotion ? 0 : delayMs);
})();
