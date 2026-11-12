# 2Tone Imagery

A responsive, original website for 2Tone Imagery Printing Company, covering DTF transfers, silk screen printing, embroidery, UV stickers, vinyl graphics and banners.

- **Website:** https://2toneimagery.com/
- **Business phone:** 201-210-4027, supplied by the owner of this project.
- **Business email:** Twotoneimagery@gmail.com, supplied by the owner of this project.
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

GitHub Pages publishes the root of `main`. `.nojekyll` ensures direct static delivery. The root `CNAME` file declares `2toneimagery.com` as the custom domain. Canonical and social-sharing metadata use `https://2toneimagery.com/`. Local asset references remain relative so they work at the custom-domain root and in a local preview.

Keep the GitHub Pages custom-domain setting and the domain's DNS records aligned with the `CNAME` file. After changing hosting or DNS, verify the apex domain, the `www` redirect, and HTTPS before considering the deployment complete.

The repository is public so the preview and code can be shared. Never add credentials, private customer artwork or customer briefs to the repository.

## Updating

- Page copy, phone links, metadata and service markup: `index.html`.
- Layout, responsive breakpoints and motion/contrast preferences: `styles.css`.
- Project builder and verified business email: `SITE_CONTACT` in `app.js`. The Email brief action opens the visitor's email app; the visitor reviews and sends the message.
- Logo and illustrative merchandise assets: `assets/`.
- [Research and reference websites](docs/REFERENCES.md).

Fonts are self-hosted Barlow Condensed and DM Sans under their bundled SIL Open Font Licenses. No analytics, cookies, server storage or third-party form processor is installed.
