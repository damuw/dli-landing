#!/usr/bin/env python3
"""Rebuild the four aperture window masks from the hero window plate.

`continuum-windows-mask.png` is the hand-built 716x510 plate used by the live
window flow. It already matches the hero canvas exactly, so the aperture study
can reuse it instead of deriving masks from the ribbon layer (the ribbon render
is not pixel-aligned with the cutout and would ghost when layered).

The city and globe shapes meet at a narrow cusp; a short barrier splits them
before the components are labelled.

Run from the repository root:

    python3 tools/make-aperture-masks.py

Outputs (in site/assets):

    continuum-ap-city.png
    continuum-ap-globe.png
    continuum-ap-wave.png
    continuum-ap-code.png
    continuum-peel-holes.webp   base plate with the openings cut out
"""

from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "site" / "assets"
PLATE = ASSETS / "continuum-windows-mask.png"
PEEL = ASSETS / "continuum-peel.webp"

# Cuts the cusp between the left city window and the top-right globe.
BARRIER = [(250, 108), (363, 175)]

# Approximate centres of the four windows on the 716x510 plate.
CENTRES = {
    "city": (163, 237),
    "globe": (439, 129),
    "wave": (293, 381),
    "code": (528, 300),
}


def label(mask):
    """Four-connectivity component labels, returning labels and boxes."""
    height, width = len(mask), len(mask[0])
    labels = [[0] * width for _ in range(height)]
    boxes = {}
    current = 0
    for y in range(height):
        for x in range(width):
            if not mask[y][x] or labels[y][x]:
                continue
            current += 1
            queue = deque([(y, x)])
            labels[y][x] = current
            xs, ys = [], []
            while queue:
                cy, cx = queue.popleft()
                xs.append(cx)
                ys.append(cy)
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < height and 0 <= nx < width and mask[ny][nx] and not labels[ny][nx]:
                        labels[ny][nx] = current
                        queue.append((ny, nx))
            boxes[current] = (min(xs), min(ys), max(xs), max(ys), len(xs))
    return labels, boxes


def fill_holes(component):
    """Fill enclosed transparent pixels (specular pinholes) in a mask."""
    height, width = len(component), len(component[0])
    padded = [[False] * (width + 2) for _ in range(height + 2)]
    for y in range(height):
        for x in range(width):
            padded[y + 1][x + 1] = bool(component[y][x])
    outside = [[False] * (width + 2) for _ in range(height + 2)]
    outside[0][0] = True
    queue = deque([(0, 0)])
    while queue:
        y, x = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < height + 2 and 0 <= nx < width + 2 and not padded[ny][nx] and not outside[ny][nx]:
                outside[ny][nx] = True
                queue.append((ny, nx))
    return [
        [padded[y + 1][x + 1] or not outside[y + 1][x + 1] for x in range(width)]
        for y in range(height)
    ]


def mask_image(component, expand=1, feather=1.0):
    """Turn a boolean component into a soft-edged alpha mask."""
    height, width = len(component), len(component[0])
    image = Image.new("L", (width, height), 0)
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            if component[y][x]:
                pixels[x, y] = 255
    if expand:
        image = image.filter(ImageFilter.MaxFilter(expand * 2 + 1))
    if feather:
        image = image.filter(ImageFilter.GaussianBlur(feather))
    white = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    white.putalpha(image)
    return white


def main():
    plate = Image.open(PLATE).convert("RGBA")
    alpha = plate.getchannel("A").load()
    width, height = plate.size

    windows = [[alpha[x, y] > 128 for x in range(width)] for y in range(height)]

    barrier = Image.new("L", (width, height), 0)
    ImageDraw.Draw(barrier).line(BARRIER, fill=255, width=10)
    barrier = barrier.load()
    split = [
        [windows[y][x] and not barrier[x, y] for x in range(width)]
        for y in range(height)
    ]

    labels, boxes = label(split)
    by_name = {}
    for component, (x0, y0, x1, y1, area) in boxes.items():
        if area < 4000:
            continue
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        name = min(
            CENTRES,
            key=lambda key: (CENTRES[key][0] - cx) ** 2 + (CENTRES[key][1] - cy) ** 2,
        )
        by_name[name] = component
    missing = sorted(set(CENTRES) - set(by_name))
    if missing:
        raise SystemExit(f"could not isolate windows: {', '.join(missing)}")

    patch_union = Image.new("L", (width, height), 0)
    for name, component in by_name.items():
        rows = [[labels[y][x] == component for x in range(width)] for y in range(height)]
        patch = mask_image(fill_holes(rows))
        patch.save(ASSETS / f"continuum-ap-{name}.png")
        patch_union = ImageChops.lighter(patch_union, patch.getchannel("A"))

    # A slightly smaller hole in the base plate means the four world patches
    # overlap the plate by a few pixels, so the seam stays closed while they
    # move. Build the hole from the patch union (not the raw plate) so the
    # split between the city and globe never leaves an uncovered sliver.
    peel = Image.open(PEEL).convert("RGBA")
    if peel.size != plate.size:
        raise SystemExit(f"plate and peel sizes differ: {plate.size} vs {peel.size}")
    hole = patch_union.filter(ImageFilter.MinFilter(5))
    cut = ImageChops.multiply(peel.getchannel("A"), ImageChops.invert(hole))
    peel.putalpha(cut)
    peel.save(ASSETS / "continuum-peel-holes.webp", "WEBP", quality=92, method=6)

    print("wrote:", ", ".join(f"continuum-ap-{n}.png" for n in CENTRES))
    print("wrote: continuum-peel-holes.webp")


if __name__ == "__main__":
    main()
