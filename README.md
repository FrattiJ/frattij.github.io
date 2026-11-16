# Jacob Fratti, personal site

A one-page professional site for the resume: who I am, what I am looking for, experience, projects, skills and education, plus a shelf of books for life outside work. It is drawn as a punk manga volume set on a strict editorial grid: a cover with brush lettering, focus lines, halftone screentone and price-gun stickers for the headline numbers, then ruled ledgers for the roles and skills, and a night spread that indexes the projects by title.

Plain HTML, CSS, and JavaScript. No framework, no build step, no dependencies, no third-party requests.

## Editing content

**You only need to edit [`js/content.js`](js/content.js).** Every section of the site is generated from it.

| Want to...                      | Edit this in `content.js`                              |
| ------------------------------- | ------------------------------------------------------ |
| Change headline or intro        | `title`, `tagline`, `intro`                            |
| Change the stickers on the cover | `highlights` (add `was: "..."` to print a markdown)   |
| Update About or career goals    | `about`, `goals`                                       |
| Add a project                   | Copy an entry in `projects`, set its `group`           |
| Update experience or education  | `resume.experience`, `resume.education`                |
| Change the books on the shelf   | `offClock.books` (one book per interest)               |
| Change the links                | `links` (the first link is the main button)            |
| Change the katakana on the cover | `nameKana` (leave it `""` to hide it)                 |

Each project has a shareable link, e.g. `https://frattij.github.io/#project/pricing-tool` opens that write-up directly. The button at the right of the top bar opens a palette picker: Ink and Night (black and white with one red accent, following the visitor's system setting until they choose), plus six palettes that take their ground and lettering colour from Dorohedoro covers. The choice is remembered on that device. The Projects section is always the dark side of the current palette.

Two things live outside `content.js` because link previews cannot run JavaScript: the `<title>` and the `og:` tags at the top of [`index.html`](index.html), and the preview card [`assets/share.jpg`](assets/share.jpg), which is a 1200 x 630 screenshot of the cover. Update them if the name, title or cover changes.

## Look and type

Colors and fonts are tokens at the top of [`css/style.css`](css/style.css). Each palette is one short block there; to add one, copy a block, give it an id, and list it in `PALETTES` in [`js/main.js`](js/main.js).

| Role                   | Font            | License                                              |
| ---------------------- | --------------- | ---------------------------------------------------- |
| Title lettering        | Dracutaz        | 1001Fonts Free For Commercial Use, by Dhabee Studio  |
| Text                   | M PLUS 1        | SIL Open Font License 1.1                            |
| Hand-lettered notes    | East Sea Dokdo  | SIL Open Font License 1.1                            |
| Japanese sound effects | Reggae One      | SIL Open Font License 1.1                            |

All four are self-hosted in [`assets/fonts`](assets/fonts), with their license texts beside them. See [`assets/fonts/README.md`](assets/fonts/README.md) for the terms that matter, including how to switch the hand-lettered notes to Muneban once it is licensed for this site.

## Layout and motion

Every section sits on the same twelve columns. About, Experience and Skills keep their title in the left margin, where it stays put while the rows scroll past; Projects and the shelf run full width. The first paragraph of `about.paragraphs` is set large as the lead, and the rest sit beside the goals.

Motion is kept to a few moments, all in hard frames to match the print look. They live in [`css/style.css`](css/style.css) under "Opening sequence" and "Motion", and are switched on by short functions at the bottom of [`js/main.js`](js/main.js).

- On the cover, the sticker figures tick up as they land, and the focus lines, name and stickers lean with the pointer. The lines rush outward as the cover scrolls away.
- Each section title is stamped down as you reach it and its brush swash is pulled across.
- A project row is covered by a sheet of paper on hover, a red line along the top bar tracks reading progress, and a new palette floods out from the palette button.
- The name is lettered again across the back cover and rises into place.

Visitors who ask their system for reduced motion get none of it and nothing is ever hidden from them. The scroll-linked extras and the palette flood are skipped by browsers that cannot do them.

## Previewing locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publishing on GitHub Pages (free)

This repository is named `frattij.github.io`, so with **Settings > Pages > Build and deployment > Source: Deploy from a branch** set to `main` and `/ (root)`, whatever is on `main` is live at https://frattij.github.io/ a minute or two after each merge.

## Structure

```
index.html        page skeleton, link-preview tags
css/style.css     all styling (colors and fonts are tokens at the top)
js/content.js     YOUR CONTENT
js/main.js        renders content into the page
assets/fonts/     self-hosted web fonts and their licenses
assets/           favicon, link-preview card, project images if any
.claude/skills/   design skills for Claude Code sessions (not part of the site)
```

## Design skills for Claude Code

[`.claude/skills`](.claude/skills) holds five skills that Claude Code loads automatically when it works in this repository: Frontend Design, Web Interface Guidelines, UI/UX Pro Max, Web Design Engineer and Playwright CLI. Sources, pinned versions, licenses and update commands are in [`.claude/skills/README.md`](.claude/skills/README.md).
