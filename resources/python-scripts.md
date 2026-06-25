---
title: Python Scripts
description: Collection of useful Python scripts and utilities.
---

A collection of reusable Python scripts for automation, file processing, and development workflows.

---

## PDF Utilities

### Merge PDF Pages Into a Single Long Page

Combines all pages of a PDF into a single continuous page while automatically removing page margins and whitespace between pages.

#### Features

* Converts every PDF page into a high-resolution image
* Detects and removes blank top and bottom margins
* Joins pages seamlessly with no visible page breaks
* Preserves the original top margin from the first page
* Mirrors that margin at the bottom of the final page
* Outputs a single-page PDF suitable for long-form reading

#### Dependencies

```bash
pip install pdf2image pillow numpy
```

You will also need Poppler installed for `pdf2image`.

#### Usage

```bash
python merge_pdf_pages.py input.pdf
```

Specify a custom output file:

```bash
python merge_pdf_pages.py input.pdf output.pdf
```

Customize rendering quality:

```bash
python merge_pdf_pages.py input.pdf --dpi 600
```

Adjust blank-space detection:

```bash
python merge_pdf_pages.py input.pdf --threshold 240
```

#### Command Line Options

| Option        | Description                     | Default |
| ------------- | ------------------------------- | ------- |
| `--dpi`       | Rendering DPI                   | `300`   |
| `--threshold` | Blank pixel detection threshold | `245`   |
| `--padding`   | Content edge padding in pixels  | `6`     |

#### Script

```python title="merge_pdf_pages.py"
#!/usr/bin/env python3
"""
merge_pdf_pages.py
------------------
Converts a multi-page PDF into a single seamless long-page PDF by:
  1. Rendering every page at high DPI
  2. Detecting and trimming the blank top/bottom margins on each page
  3. Stitching all pages together (no gap between them)
  4. Cropping trailing whitespace below the last content line
  5. Saving the result as a single-page PDF
"""

import argparse
import sys
from pathlib import Path

from pdf2image import convert_from_path
from PIL import Image
import numpy as np


def to_gray(img):
    return np.array(img.convert("L"))


def first_content_row(gray, threshold):
    for i, row in enumerate(gray):
        if np.any(row < threshold):
            return i
    return 0


def last_content_row(gray, threshold):
    for i in range(len(gray) - 1, -1, -1):
        if np.any(gray[i] < threshold):
            return i
    return len(gray) - 1


def merge_pdf(
    input_path,
    output_path,
    dpi=300,
    threshold=245,
    padding=6,
):
    pages = convert_from_path(input_path, dpi=dpi)

    first_gray = to_gray(pages[0])
    top_margin_px = first_content_row(first_gray, threshold)

    trimmed = []

    for i, page in enumerate(pages):
        gray = to_gray(page)

        if i == 0:
            top = 0
        else:
            top = first_content_row(gray, threshold)

        if i == len(pages) - 1:
            last_row = last_content_row(gray, threshold)
            bottom = min(page.height, last_row + 1 + top_margin_px)
        else:
            bottom = last_content_row(gray, threshold) + 1

        trimmed.append(page.crop((0, top, page.width, bottom)))

    total_height = sum(img.height for img in trimmed)
    width = trimmed[0].width

    canvas = Image.new(
        "RGB",
        (width, total_height),
        color=(255, 255, 255),
    )

    y = 0
    for img in trimmed:
        canvas.paste(img, (0, y))
        y += img.height

    canvas.save(output_path, "PDF", resolution=dpi)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("output", nargs="?")
    parser.add_argument("--dpi", type=int, default=300)
    parser.add_argument("--threshold", type=int, default=245)
    parser.add_argument("--padding", type=int, default=6)

    args = parser.parse_args()

    output = (
        args.output
        or str(Path(args.input).with_suffix("")) + "_merged.pdf"
    )

    merge_pdf(
        input_path=args.input,
        output_path=output,
        dpi=args.dpi,
        threshold=args.threshold,
        padding=args.padding,
    )


if __name__ == "__main__":
    main()
```

#### Example

Input:

```text
document.pdf
├── Page 1
├── Page 2
├── Page 3
└── Page 4
```

Output:

```text
document_merged.pdf
└── Single continuous page
```
