#!/usr/bin/env python3
"""Static checks for the DLI site. Run from the repo root: python3 tools/validate-site.py"""
import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.join(os.path.dirname(__file__), "..", "site")
errors = []
warnings = []


class Collector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.links = []
        self.h1 = 0
        self.title = ""
        self.in_title = False
        self.description = ""
        self.canonical = ""
        self.jsonld = []
        self._script_type = None
        self._script_buf = []
        self.imgs_no_alt = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "a" and "href" in a:
            self.links.append(a["href"])
        if tag == "h1":
            self.h1 += 1
        if tag == "title":
            self.in_title = True
        if tag == "meta" and a.get("name") == "description":
            self.description = a.get("content", "")
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href", "")
        if tag == "script" and a.get("type") == "application/ld+json":
            self._script_type = "jsonld"
            self._script_buf = []
        if tag == "img" and "alt" not in a:
            self.imgs_no_alt += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self._script_type == "jsonld":
            self.jsonld.append("".join(self._script_buf))
            self._script_type = None

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self._script_type == "jsonld":
            self._script_buf.append(data)


def page_path(rel):
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def resolve(url_path, page_url):
    """Resolve an internal URL path to a file under site/, or None if dynamic."""
    path = url_path.split("#")[0].split("?")[0]
    if not path:
        return page_url
    if path.startswith("/"):
        rel = path.lstrip("/")
    else:
        base = page_url.rsplit("/", 1)[0] + "/"
        rel = os.path.normpath(base + path).lstrip("/")
    if rel == "":
        rel = "index.html"
    if rel.endswith("/"):
        rel += "index.html"
    return rel


html_files = []
for dp, dn, fn in os.walk(ROOT):
    for f in fn:
        if f.endswith(".html"):
            html_files.append(os.path.relpath(os.path.join(dp, f), ROOT))
html_files.sort()

page_ids = {}
parsed = {}
for rel in html_files:
    path = os.path.join(ROOT, rel)
    src = open(path, encoding="utf-8").read()
    p = Collector()
    p.feed(src)
    parsed[rel] = (p, src)
    page_ids[page_path(rel)] = p.ids
    if p.h1 != 1:
        errors.append(f"{rel}: expected exactly one h1, found {p.h1}")
    if not p.title.strip():
        errors.append(f"{rel}: missing title")
    if rel != "404.html":
        if not p.description.strip():
            errors.append(f"{rel}: missing meta description")
        elif not (80 <= len(p.description) <= 200):
            warnings.append(f"{rel}: description length {len(p.description)}")
        if not p.canonical:
            errors.append(f"{rel}: missing canonical")
        else:
            expected = "https://deeplearningintelligence.com" + page_path(rel)
            if p.canonical != expected:
                errors.append(f"{rel}: canonical {p.canonical} != {expected}")
    if p.imgs_no_alt:
        errors.append(f"{rel}: {p.imgs_no_alt} img without alt")
    for i, block in enumerate(p.jsonld):
        try:
            json.loads(block)
        except Exception as e:
            errors.append(f"{rel}: JSON-LD block {i + 1} invalid: {e}")
    if "{{" in src and rel != "index.html":
        errors.append(f"{rel}: unresolved template placeholder")
    for bad in ["NaN", "undefined", "Lorem ipsum"]:
        if bad in src:
            warnings.append(f"{rel}: contains '{bad}'")

# Link resolution
for rel, (p, src) in parsed.items():
    url = page_path(rel)
    for href in p.links:
        if href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")) or "{{" in href:
            continue
        if href.startswith("#"):
            anchor = href[1:]
            if anchor and anchor not in p.ids:
                # Home page renders many ids from the DC template, which the parser sees.
                errors.append(f"{rel}: missing anchor #{anchor}")
            continue
        target = resolve(href, url)
        if target is None:
            continue
        full = os.path.join(ROOT, target)
        if not os.path.exists(full):
            errors.append(f"{rel}: broken link {href} -> {target}")

# Sitemap coverage
sitemap = open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read()
locs = re.findall(r"<loc>https://deeplearningintelligence.com([^<]*)</loc>", sitemap)
for loc in locs:
    target = resolve(loc, "/")
    if not os.path.exists(os.path.join(ROOT, target)):
        errors.append(f"sitemap: {loc} has no file ({target})")
for rel in html_files:
    u = page_path(rel)
    if rel != "404.html" and u not in locs:
        warnings.append(f"sitemap: {u} is not listed")

# Claim scan (manual review prompts, not hard failures)
for rel, (p, src) in parsed.items():
    text = re.sub(r"<script.*?</script>|<style.*?</style>", " ", src, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    for phrase in ["SOC 2", "ISO 27001", "ISO 42001", "zero leakage", "guaranteed determinism", "government partner", "guaranteed return"]:
        if phrase.lower() in text.lower():
            idx = text.lower().index(phrase.lower())
            warnings.append(f"{rel}: contains '{phrase}' -> …{text[max(0, idx-70):idx+90]}…")

print(f"pages checked: {len(html_files)}")
print(f"errors: {len(errors)}")
for e in errors:
    print("  ERROR", e)
print(f"warnings: {len(warnings)}")
for w in warnings:
    print("  WARN ", w)
sys.exit(1 if errors else 0)
