# 2Tone Imagery

A responsive, original website for 2Tone Imagery Printing Company, covering DTF transfers, silk screen printing, embroidery, UV stickers, vinyl graphics and banners.

- **Live preview:** https://frankbjj23.github.io/2tone-imagery/
- **Business phone:** 201-210-4027, supplied by the owner of this project.
- **Source:** https://github.com/frankbjj23/2tone-imagery

## Features

Six filterable services, responsive navigation, native accessible project dialog, three-step project brief builder, text download, clipboard copy, optional device sharing, phone links, and FAQ disclosures. The brief builder runs entirely in the browser. It does not submit orders or send messages. Contact the company to confirm artwork, materials, pricing and availability.

No customer reviews, production promises, minimums, turnaround guarantees, location or email address have been invented. Product imagery is labeled as illustrative concept work. The supplied original logo is displayed and preserved. Generated artwork includes a web logo adaptation and product mockup; see [asset provenance and prompts](docs/ASSETS.md).

## Run locally

No dependencies or build step are needed. Serve this folder with any static web server:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Then open http://127.0.0.1:4173.

## Checks

```sh
node --check app.js
node scripts/check-site.mjs
```

## Deployment

GitHub Pages publishes the root of `main`. `.nojekyll` ensures direct static delivery. All local asset references are relative so the site works under the repository subpath. Canonical and social-sharing metadata use the Pages URL; update those if a custom domain is added.

The repository is public so the preview and code can be shared. Never add credentials, private customer artwork or customer briefs to the repository.

## Updating

- Page copy, phone links, metadata and service markup: `index.html`.
- Layout, responsive breakpoints and motion/contrast preferences: `styles.css`.
- Project builder and optional verified business email: `SITE_CONTACT` in `app.js`. The blank email intentionally keeps email delivery hidden.
- Logo and illustrative merchandise assets: `assets/`.
- [Research and reference websites](docs/REFERENCES.md).

Fonts are self-hosted Barlow Condensed and DM Sans under their bundled SIL Open Font Licenses. No analytics, cookies, server storage or third-party form processor is installed.
