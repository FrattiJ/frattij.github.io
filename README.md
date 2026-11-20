# Jacob Fratti, personal site

> **Retired 2026-11-19.** The portfolio now lives at https://fratti-os.vercel.app as the public half of Personal OS (`FrattiJ/Fratti-OS`), where its content is read from the vault (`99 Meta/data/portfolio.json`) instead of `js/content.js`. `index.html` here is only a redirect that carries the `#section` or `#chapter/...` part of a link across. The rest of this repo is kept as history and is no longer served or updated. Edit the portfolio in the vault, not here.

A design portfolio read like a manga volume. The cover is a splash page with the name lettered over focus lines. Each project is a chapter that opens into a reader and is told panel by panel. The career is a four-panel strip, and the rest is a character file and a few bonus pages.

It is black ink on white paper with screentone and one spot colour, a price-sticker yellow. On a desktop the sections are paneled spreads with slanted gutters. On a phone the same panels stack into a vertical strip.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies, no third-party requests.

## Editing content

**You only need to edit [`js/content.js`](js/content.js).** Every section of the site is generated from it.

| Want to...                         | Edit this in `content.js`                                         |
| ---------------------------------- | ----------------------------------------------------------------- |
| Change the headline or intro       | `title`, `tagline` (the speech bubble), `intro`                   |
| Change the stickers on the cover   | `highlights` (add `was: "..."` to print a markdown)               |
| Change a section heading or note   | `sections`                                                        |
| Update About or career goals       | `about`, `goals` (both appear in the character file)              |
| Add a project                      | Copy an entry in `projects` and set its `group`                   |
| Change a chapter's one-liner       | `hook` on the project                                             |
| Change a chapter's sound effect    | `sfx` on the project: `kana` is lettered big, `say` is the gloss  |
| Use a real image for a project     | `image` and `imageAlt` on the project (replaces the drawing)      |
| Update experience or education     | `resume.experience`, `resume.education`                           |
| Change the big number in the strip | `figure` on an experience or education entry                      |
| Change the bonus pages             | `offClock.books`                                                  |
| Change the links                   | `links` (the first one is the main button)                        |
| Change the katakana on the cover   | `nameKana` (leave it `""` to hide it)                             |

Two things live outside `content.js` because link previews cannot run JavaScript: the `<title>` and the `og:` tags at the top of [`index.html`](index.html), and the preview card [`assets/share.jpg`](assets/share.jpg), a 1200 x 630 shot of the cover. Update them if the name, title or cover changes.

## How the pages are built

| Section          | What it is                                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cover            | A splash panel with the name, the reading of the name set vertically, and a sound effect. Under it: the tagline as a speech bubble, the intro as narration with the links, and the highlights as price stickers. |
| The work         | One card per project, grouped as in `projectGroups`. Cards pair up as wide and narrow panels that alternate; a project left on its own runs full width.                                                       |
| Chapter reader   | Opening a card opens the chapter: a title spread, then one panel per step of `process`, with the last step set as a black panel. It ends with the next chapter.                                                |
| The story so far | Experience, oldest first, ending on the first education entry. Four beats, so it is drawn as a yonkoma (a four-panel strip). The third beat, the turn of the story, is the dramatic panel.                     |
| Character file   | About, a profile pulled from the content, where I am headed, skills and education.                                                                                                                          |
| Off the clock    | One bonus page per entry in `offClock.books`. The `spine` word runs up the side like a book spine. `color` sets the panel: `accent` yellow, `ink` black, `grey` toned, `paper` plain.                         |
| To be continued  | The contact panel, from `sections.contact` and `links`.                                                                                                                                                      |

Every chapter has a shareable link, such as `https://frattij.github.io/#chapter/pricing-tool`. Old `#project/...` links still open the right chapter. In the reader, the arrow keys move between chapters, Escape or the browser's back button closes it, and focus returns to the card that opened it.

## Look and type

Colours and fonts are tokens at the top of [`css/style.css`](css/style.css).

| Role                               | Font            | License                   |
| ---------------------------------- | --------------- | ------------------------- |
| Lettering, titles, sound effects   | Dela Gothic One | SIL Open Font License 1.1 |
| Text                               | M PLUS 1        | SIL Open Font License 1.1 |

Both are self-hosted in [`assets/fonts`](assets/fonts) with their licenses. See [`assets/fonts/README.md`](assets/fonts/README.md) for how the lettering font is subset and how to add a character.

The day page follows the visitor's system setting until they press the switch in the top bar, which floods the other page out from the button and is remembered on that device. The night page flips the inks, and black panels flip with it.

The drawings are vector ink in [`js/art.js`](js/art.js), keyed by project id, bonus page id, and `about` for the character file. They take the page's own inks, so they change between day and night.

## Motion

Motion is kept to a few moments that each mean something:

- **The opening.** The focus lines burst, the name slams down with a small shake, the reading drops in and the stickers are slapped on. As the cover scrolls away the lines rush outward.
- **Reading order.** Chapter cards and the strip's four panels are inked in left to right the first time they come into view.
- **Opening a chapter.** The reader turns in like a page and its panels follow in reading order. Changing chapters turns the page again.
- **Hover.** A chapter card draws focus lines behind its drawing, shows its sound effect and marks its title.

Visitors who ask their system for reduced motion get none of it and nothing is hidden from them. The scroll-linked extras are skipped by browsers that cannot do them.

## Accessibility

Landmarks and a skip link, one `h1` and a heading outline that follows the page, visible focus on everything, a native modal dialog for the reader, 44 px touch targets, and colour contrast that passes WCAG AA on both pages. Decorative lettering (sound effects, the vertical reading, the kanji) is hidden from screen readers. An axe-core audit of both pages and the reader reports no violations.

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
css/style.css     all styling (colours and fonts are tokens at the top)
js/content.js     YOUR CONTENT
js/art.js         vector ink drawings
js/main.js        renders content into the page, runs the reader and the motion
assets/fonts/     self-hosted web fonts and their licenses
assets/           favicon, link-preview card, project images if any
.claude/skills/   design skills for Claude Code sessions (not part of the site)
.mcp.json         MCP servers for Claude Code sessions (not part of the site)
```

## Design skills for Claude Code

[`.claude/skills`](.claude/skills) holds five skills that Claude Code loads automatically when it works in this repository: Frontend Design, Web Interface Guidelines, UI/UX Pro Max, Web Design Engineer and Playwright CLI. Sources, pinned versions, licenses and update commands are in [`.claude/skills/README.md`](.claude/skills/README.md).
