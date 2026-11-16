# Portfolio

Personal portfolio of Houssem Ben Chabbeh: a single-page site with animated
architecture diagrams, hosted on GitHub Pages.

## Run it locally

```bash
npm install
npm run dev        # development server
npm run build      # production build in dist/
npm run preview    # serve the production build
```

## Update the content

Everything shown on the page lives in [`src/data/profile.js`](src/data/profile.js):
profile text, certifications, stack, projects, internships and the log
timeline.

- **New certification:** add one entry to `certs`. The count in the hero, the
  section heading and the contact tile follow automatically. When CKA is
  passed, move it from `targets` to `certs`.
- **CV download:** put the PDF in `public/` and set `profile.links.cv`.
- **Log stream:** `npm run activity` refreshes recent GitHub pushes
  (`src/data/activity.json`). The deploy workflow runs it on every build.

## Architecture diagrams

Diagrams are data, in [`src/diagrams/specs.js`](src/diagrams/specs.js), and
are drawn by [`src/diagrams/Diagram.jsx`](src/diagrams/Diagram.jsx). Each node
has a desktop position (`d`) and a phone position (`m`), so a diagram is
redrawn top-to-bottom on narrow screens instead of being shrunk.

To work on one diagram alone, open `/?d=<name>&scene=0&step=0`
(`gaming`, `doura`, `resilience`, `oit`, `vulnforge`).

## Deploy

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One-time setup: repository Settings → Pages → Source: **GitHub Actions**.

AWS service icons are from the official AWS Architecture Icons set (via the
`aws-icons` package); other logos are from `simple-icons`.
