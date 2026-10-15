#!/usr/bin/env python3
"""Rounds SVG path coordinates to shrink a logo, e.g. to fit Shopify's
inline_asset_content size cap (an 18 KB wordmark came down to 9.5 KB).

    python3 shrink-svg.py in.svg out.svg [decimals=1]
"""
import re
import sys

src, dst = sys.argv[1], sys.argv[2]
decimals = int(sys.argv[3]) if len(sys.argv) > 3 else 1
svg = open(src).read()


def shrink_path(match):
    d = match.group(1)
    d = re.sub(r'-?\d+\.\d+', lambda n: f'{float(n.group()):.{decimals}f}'.rstrip('0').rstrip('.'), d)
    d = re.sub(r' ?([A-Za-z]) ?', r'\1', d)
    d = re.sub(r' -', '-', d)
    return f'd="{d}"'


out = re.sub(r'd="([^"]+)"', shrink_path, svg)
open(dst, 'w').write(out)
print(f'{len(svg)} -> {len(out)} bytes')
