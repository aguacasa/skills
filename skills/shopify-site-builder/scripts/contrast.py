#!/usr/bin/env python3
"""WCAG 2.1 contrast ratios for a palette against text colours.

    python3 contrast.py "#054FB8" "#CEFF65" "#FF7654" --text "#CEFF65" "#FFFFFF" "#05060B"

4.5:1 is the minimum for body text, 3:1 for large text (24px+, or 18.66px+ bold).
"""
import argparse


def luminance(hex_color):
    hex_color = hex_color.lstrip('#')
    channels = [int(hex_color[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    linear = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]


def ratio(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


parser = argparse.ArgumentParser()
parser.add_argument('backgrounds', nargs='+')
parser.add_argument('--text', nargs='+', default=['#FFFFFF', '#000000'])
args = parser.parse_args()

print('background  ' + '  '.join(f'{t:>9}' for t in args.text))
for bg in args.backgrounds:
    cells = []
    for text in args.text:
        r = ratio(bg, text)
        mark = 'ok' if r >= 4.5 else 'lg' if r >= 3 else '--'
        cells.append(f'{r:5.2f} {mark}')
    print(f'{bg:>10}  ' + '  '.join(f'{c:>9}' for c in cells))
print('ok = body text, lg = large text only, -- = fails')
