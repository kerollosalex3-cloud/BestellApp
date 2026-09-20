# Saved design reference

[Original Figma](https://www.figma.com/design/aIpHIHDuEvIcn2ptFpmTGC/BestellApp?node-id=137-1525)

Reference frames: desktop `55:1663`, mobile `58:683`, confirmation `137:1518` in the working Figma copy `edn4B42ZLAt3xJZPsifDCL`.

## Measurements

| Element | Desktop reference |
| --- | --- |
| Page | 1440 × 3377 px |
| Header | 128 px high |
| Hero | 1440 × 508 px at y59; visible from y128 to y567 |
| Restaurant logo | 200 × 200 px, 13 px outside border, shadow |
| Restaurant name group | y654, 872 × 104 px |
| Basket | x1005, y838, 435 × 794 px |
| Category bars | y838, y1597, y2417; height60 px |
| Food lists | x119, y924 / y1689 / y2514, width713 px |
| Food cards | height141 px, radius12 px, padding10 px, gap16 px |
| Food images | 207 × 120 px |
| Footer | y3249, height128 px |

Colours: orange `#E76C1F`, text and basket `#363534`, cards `#FDEADC`, rating `#FACAAC`, muted text `#726D6D`.

Fonts: Palanquin and Palanquin Dark, bundled locally with their OFL licenses. The restaurant description uses Palanquin Bold, 24 px, 120% line height.

The mobile reference is 375 × 4593 px. It has an 80 px header, a 343 × 346 px hero at x16/y104, the rating above the restaurant title, vertical food cards, stacked footer links, and an 80 px bottom navigation bar. Intermediate widths adapt to keep text and controls readable.

## Assets and content

The hero and restaurant logo were exported from their Figma layers. Food images and category illustrations were extracted from the full-resolution reference. Mobile crops use the 2× mobile export. No stock-image substitutions were used.

Some food descriptions and prices differ between the original desktop and mobile mockups. The website consistently uses desktop menu data, so resizing never changes a product or its price.

The website starts with an empty basket. To reproduce the populated desktop reference, add Veggie mushroom black burger, Pizza Margherita and Mini green Salad. Subtotal: 36,70€; delivery: 4,99€; total: 41,69€.

## Review

- Compared the rendered desktop and mobile pages against the saved Figma references and adjusted spacing, typography, image crops and icons.
- Checked 320, 375, 768, 1024, 1440 and 1920 px widths for horizontal overflow and overlapping descriptions/buttons.
- Tested adding items, increasing/decreasing quantities, removing the last item, delivery fees, reload persistence, order confirmation and basket reset.
- Tested the mobile basket, Escape, keyboard focus wrapping, navigation and footer dialogs.
- Checked JavaScript syntax, local asset references and unique HTML IDs.

The separately mentioned task checklist was not supplied, so its requirements cannot be marked as reviewed.
