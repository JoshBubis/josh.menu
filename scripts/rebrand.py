#!/usr/bin/env python3
"""One-shot rebrand of the copied portfolio into the Josh Menu studio site.

Kept as a record of exactly what changed; safe to delete once the site settles.
"""
import re
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS_VER = "jm1"


def sub_all(text, pairs):
    for old, new in pairs:
        text = text.replace(old, new)
    return text


def drop_josh_menu_work_panel(html):
    """The GPU tracker was retired and its domain is now this very site."""
    start = html.find('<article class="work-panel">\n                            <a class="work-shot-link" href="https://josh.menu"')
    if start == -1:
        print("  ! josh.menu work panel not found")
        return html
    end = html.find("</article>", start)
    if end == -1:
        sys.exit("could not find end of josh.menu work panel")
    end += len("</article>\n")
    # Trim the leading whitespace of the removed block too.
    line_start = html.rfind("\n", 0, start) + 1
    print("  - removed the josh.menu work panel")
    return html[:line_start] + html[end:]


def drop_source_links(html):
    """github.com/JoshBubis/* links would put the surname on the studio site."""
    pattern = re.compile(
        r"\n\s*<a href=\"https://github\.com/JoshBubis/[^\"]*\"[^>]*>Source"
        r"<span class=\"sr-only\">[^<]*</span></a>"
    )
    html, n = pattern.subn("", html)
    print(f"  - removed {n} GitHub source link(s)")
    return html


BRAND = [
    # Mark: same ink-block motif, paper letter changes B -> M.
    ('<span class="jb-mark" aria-hidden="true"><span class="jb-mark__j">J</span>B</span>',
     '<span class="jm-mark" aria-hidden="true"><span class="jm-mark__j">J</span>M</span>'),
    ('<span class="jb-mark"><span class="jb-mark__j">J</span>B</span>',
     '<span class="jm-mark"><span class="jm-mark__j">J</span>M</span>'),
    ('<span class="jb-mark jb-mark--lg" aria-hidden="true"><span class="jb-mark__j">J</span>B</span>',
     '<span class="jm-mark jm-mark--lg" aria-hidden="true"><span class="jm-mark__j">J</span>M</span>'),
    # Wordmark + hero brand.
    ('<a class="wordmark" href="/">Josh Bubis</a>', '<a class="wordmark" href="/">Josh Menu</a>'),
    ('aria-label="Josh Bubis"', 'aria-label="Josh Menu"'),
    ('<span class="brand-line" aria-hidden="true"><span class="brand-ch">B</span><span class="brand-ch">u</span><span class="brand-ch">b</span><span class="brand-ch">i</span><span class="brand-ch">s</span></span>',
     '<span class="brand-line" aria-hidden="true"><span class="brand-ch">M</span><span class="brand-ch">e</span><span class="brand-ch">n</span><span class="brand-ch">u</span></span>'),
    # Identity + contact.
    ("Josh Bubis", "Josh Menu"),
    ("josh@joshbubis.com", "josh@josh.menu"),
    ("https://joshbubis.com", "https://josh.menu"),
    ("joshbubis.com", "josh.menu"),
    # Cache busting.
    ("?v=jb1", f"?v={CSS_VER}"),
    ("?v=atelier22", f"?v={CSS_VER}"),
]

# Anonymity: the studio brand must not link to the personal identity.
STRIP_LINES = [
    '<a href="https://linkedin.com/in/joshbubis"',
    '<a href="https://github.com/JoshBubis"',
]


def strip_identity_links(html):
    out = []
    for line in html.split("\n"):
        if any(marker in line for marker in STRIP_LINES):
            print(f"  - stripped identity link:{line.strip()[:60]}")
            continue
        out.append(line)
    return "\n".join(out)


for name in ("index.html", "contact.html"):
    path = ROOT / name
    html = path.read_text()
    print(name)
    if name == "index.html":
        html = drop_josh_menu_work_panel(html)
        html = drop_source_links(html)
    html = strip_identity_links(html)
    html = sub_all(html, BRAND)
    path.write_text(html)

# CSS/JS: rename the mark class and repoint the API origin.
for name in ("style.css", "script.js", "chat.js", "contact.js", "fonts.css"):
    path = ROOT / name
    if not path.exists():
        continue
    text = path.read_text()
    text = text.replace("jb-mark", "jm-mark").replace("jb__", "jm__")
    text = text.replace("JB maker's mark", "JM maker's mark")
    text = text.replace("<span class=\"jm-mark__j\">J</span>B", "<span class=\"jm-mark__j\">J</span>M")
    text = text.replace("https://hub.joshbubis.com", "https://api.josh.menu")
    text = text.replace("josh@joshbubis.com", "josh@josh.menu")
    text = text.replace("joshbubis.com", "josh.menu")
    text = text.replace("Josh Bubis", "Josh Menu")
    path.write_text(text)
    print(f"{name}: updated")

print("done")
