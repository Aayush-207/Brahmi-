"""
brahmi_normalize.py
-------------------
Reads Brahmi SVG path data from stdin (JSON) and outputs a normalized
TypeScript-ready data structure.

Algorithm per character:
  1. Collect all strokes for that character
  2. Find combined bounding box (using all coordinate values incl. control points)
  3. Compute uniform scale so max(width, height) = 80 SVG units
  4. Center the result within a 100x100 viewBox (10 units padding on each side)
  5. Rebuild path strings with transformed coordinates

No external dependencies. Uses only Python stdlib.
"""

import json
import re
import sys
from collections import defaultdict
from typing import List, Tuple, Dict


# ─── Path tokenizer ────────────────────────────────────────────────────────────

_TOKEN = re.compile(
    r'([MmLlCcQqZzHhVvSsTtAa])'  # SVG command letter
    r'|'
    r'([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)'  # number (int or float, scientific)
)

def tokenize(path: str) -> List[str]:
    return [m.group(0) for m in _TOKEN.finditer(path)]


# ─── Bounding box (coordinate extraction) ──────────────────────────────────────
# We extract every coordinate pair in the path (including Bezier control points).
# For Bezier curves this slightly over-estimates the bbox, but always contains
# the actual curve, which is all we need for normalization.

def _all_coords(path: str) -> List[Tuple[float, float]]:
    tokens = tokenize(path)
    coords: List[Tuple[float, float]] = []
    i = 0
    cmd = ''

    while i < len(tokens):
        t = tokens[i]

        if t.upper() in 'MLCQZSTHVA' and t.isalpha():
            cmd = t.upper()
            i += 1
            if cmd == 'Z':
                continue
            continue

        # How many numbers does each command consume per iteration?
        step = {
            'M': 2, 'L': 2,
            'C': 6,               # 3 x (x,y)
            'Q': 4,               # 2 x (x,y)
            'S': 4, 'T': 2,
            'H': 1, 'V': 1,
        }.get(cmd, 2)

        try:
            nums = [float(tokens[i + k]) for k in range(step)]
        except (IndexError, ValueError):
            i += 1
            continue

        # Pair up all numbers as (x, y) — for H/V this is imperfect but
        # those commands don't appear in our data
        for j in range(0, len(nums) - 1, 2):
            coords.append((nums[j], nums[j + 1]))

        i += step

    return coords


def bounding_box(paths: List[str]) -> Tuple[float, float, float, float]:
    """Return (xmin, xmax, ymin, ymax) over all paths."""
    all_c: List[Tuple[float, float]] = []
    for p in paths:
        all_c.extend(_all_coords(p))
    if not all_c:
        return 0.0, 100.0, 0.0, 100.0
    xs = [c[0] for c in all_c]
    ys = [c[1] for c in all_c]
    return min(xs), max(xs), min(ys), max(ys)


# ─── Path coordinate transformer ───────────────────────────────────────────────

def _fmt(v: float) -> str:
    """Format a float to max 2 decimal places, stripping trailing zeros."""
    s = f"{v:.2f}"
    if '.' in s:
        s = s.rstrip('0').rstrip('.')
    return s


def transform_path(
    path: str,
    xmin: float,
    ymin: float,
    scale: float,
    pad_x: float,
    pad_y: float,
) -> str:
    """
    Apply the linear transform:
        x' = (x - xmin) * scale + pad_x
        y' = (y - ymin) * scale + pad_y
    to every coordinate pair in the path, then rebuild the path string.
    """
    def tx(x: float) -> str:
        return _fmt((x - xmin) * scale + pad_x)

    def ty(y: float) -> str:
        return _fmt((y - ymin) * scale + pad_y)

    tokens = tokenize(path)
    out: List[str] = []
    i = 0
    cmd = ''

    while i < len(tokens):
        t = tokens[i]

        # Command letter
        if t.upper() in 'MLCQZSTHVA' and t.isalpha():
            cmd = t.upper()
            i += 1
            if cmd == 'Z':
                out.append('Z')
            else:
                out.append(cmd)
            continue

        # Consume coordinates based on current command
        try:
            if cmd in ('M', 'L', 'T'):
                x, y = float(tokens[i]), float(tokens[i + 1])
                out.append(f"{tx(x)} {ty(y)}")
                i += 2

            elif cmd == 'C':
                cx1, cy1 = float(tokens[i]),     float(tokens[i + 1])
                cx2, cy2 = float(tokens[i + 2]), float(tokens[i + 3])
                x,   y   = float(tokens[i + 4]), float(tokens[i + 5])
                out.append(
                    f"{tx(cx1)} {ty(cy1)} {tx(cx2)} {ty(cy2)} {tx(x)} {ty(y)}"
                )
                i += 6

            elif cmd == 'Q':
                cx, cy = float(tokens[i]),     float(tokens[i + 1])
                x,  y  = float(tokens[i + 2]), float(tokens[i + 3])
                out.append(f"{tx(cx)} {ty(cy)} {tx(x)} {ty(y)}")
                i += 4

            elif cmd == 'S':
                cx2, cy2 = float(tokens[i]),     float(tokens[i + 1])
                x,   y   = float(tokens[i + 2]), float(tokens[i + 3])
                out.append(f"{tx(cx2)} {ty(cy2)} {tx(x)} {ty(y)}")
                i += 4

            else:
                # Unknown / unhandled command — pass token through unchanged
                out.append(tokens[i])
                i += 1

        except (IndexError, ValueError):
            out.append(tokens[i])
            i += 1

    return ' '.join(out)


# ─── Per-character normalization ────────────────────────────────────────────────

PADDING = 5.0          # units around each edge (5 = 5% of 100)
EFFECTIVE = 100.0 - 2 * PADDING   # = 90


def normalize_character(strokes: List[Dict]) -> List[Dict]:
    """
    Normalize all strokes for one character into a 0-100 coordinate space.
    All strokes share the same transform so they remain aligned.
    """
    raw_paths = [s['path'] for s in strokes]
    xmin, xmax, ymin, ymax = bounding_box(raw_paths)

    width  = xmax - xmin
    height = ymax - ymin

    # Guard against degenerate paths
    if width == 0 and height == 0:
        return [{'id': f"stroke_{idx+1}", 'path': s['path']} for idx, s in enumerate(strokes)]

    # Uniform scale: fit the larger dimension into EFFECTIVE units
    max_dim = max(width, height) if max(width, height) > 0 else 1.0
    scale   = EFFECTIVE / max_dim

    # Center the smaller dimension
    scaled_w = width  * scale
    scaled_h = height * scale
    pad_x = PADDING + (EFFECTIVE - scaled_w) / 2.0
    pad_y = PADDING + (EFFECTIVE - scaled_h) / 2.0

    result = []
    for idx, stroke in enumerate(strokes):
        normalized = transform_path(stroke['path'], xmin, ymin, scale, pad_x, pad_y)
        result.append({
            'id': stroke.get('id', f"stroke_{idx+1}"),
            'path': normalized,
        })

    return result


# ─── Validation ─────────────────────────────────────────────────────────────────

def validate(char: str, strokes: List[Dict]) -> List[str]:
    errors = []
    for s in strokes:
        coords = _all_coords(s['path'])
        for x, y in coords:
            if x < -0.5 or x > 100.5:
                errors.append(f"  [{char}/{s['id']}] x out of range: {x:.2f}")
            if y < -0.5 or y > 100.5:
                errors.append(f"  [{char}/{s['id']}] y out of range: {y:.2f}")
    return errors


# ─── TypeScript emitter ──────────────────────────────────────────────────────────

def emit_typescript(grouped: Dict[str, List[Dict]]) -> str:
    lines = [
        "// Auto-generated by brahmi_normalize.py",
        "// viewBox: '0 0 100 100'",
        "// All coordinates normalized to [0, 100]",
        "",
        "import type { StrokeDefinition } from '@/components/PathSliderTracer/types'",
        "",
        "export const brahmiStrokePaths: Record<string, StrokeDefinition[]> = {",
    ]

    for char, strokes in sorted(grouped.items()):
        lines.append(f"  // Brahmi: {char}")
        lines.append(f"  {json.dumps(char)}: [")
        for s in strokes:
            lines.append(f"    {{")
            lines.append(f"      id: {json.dumps(s['id'])},")
            lines.append(f"      path: {json.dumps(s['path'])},")
            lines.append(f"    }},")
        lines.append(f"  ],")
        lines.append("")

    lines.append("}")
    lines.append("")
    lines.append(
        "export function getBrahmiStrokePaths(letter: string): StrokeDefinition[] {"
    )
    lines.append("  return brahmiStrokePaths[letter] ?? []")
    lines.append("}")
    lines.append("")

    return '\n'.join(lines)


# ─── Main ────────────────────────────────────────────────────────────────────────

def main():
    data = json.load(sys.stdin)
    paths = data['paths']

    # Step 1: Group by character
    by_char: Dict[str, List[Dict]] = defaultdict(list)
    for entry in paths:
        char = entry['character']
        by_char[char].append({'id': entry['id'], 'path': entry['path']})

    # Step 2 + 3: Normalize each character
    normalized: Dict[str, List[Dict]] = {}
    all_errors: List[str] = []

    for char, strokes in sorted(by_char.items()):
        norm = normalize_character(strokes)
        normalized[char] = norm
        errors = validate(char, norm)
        all_errors.extend(errors)

    # Step 4: Emit TypeScript
    ts = emit_typescript(normalized)
    print(ts)

    # Validation report to stderr
    if all_errors:
        print("\n⚠️  Validation warnings:", file=sys.stderr)
        for e in all_errors:
            print(e, file=sys.stderr)
    else:
        total = sum(len(v) for v in normalized.values())
        print(
            f"✅ {len(normalized)} characters, {total} strokes — all coordinates in [0, 100]",
            file=sys.stderr
        )


if __name__ == '__main__':
    main()
