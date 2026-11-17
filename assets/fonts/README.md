# Fonts

Everything here is served from this site. Nothing is loaded from a font service.

| File                        | Font            | Used for                                  | License                     | License text            |
| --------------------------- | --------------- | ----------------------------------------- | --------------------------- | ----------------------- |
| `DelaGothicOne.woff2`       | Dela Gothic One | Lettering: the name, titles, sound effects | SIL Open Font License 1.1   | `DelaGothicOne-OFL.txt` |
| `MPLUS1-latin-wght.woff2`   | M PLUS 1        | Text                                      | SIL Open Font License 1.1   | `MPLUS1-OFL.txt`        |

## Dela Gothic One

From the Google Fonts repository (`ofl/delagothicone`). The full font covers thousands of Japanese characters, so the file here is cut down to what the site uses, which the Open Font License permits:

- Basic Latin, Latin-1 and common punctuation
- All of hiragana and katakana (the cover reading of the name, the sound effects, and the closing つづく)
- Five kanji: 起 承 転 結 (the four beats of the career strip) and 巻

To letter a new sound effect in katakana or hiragana, nothing needs to change. To use a kanji that is not in that list, rebuild the subset with fontTools:

```bash
pyftsubset DelaGothicOne-Regular.ttf \
  --unicodes="U+0020-007E,U+00A0-00FF,U+2010-2027,U+2030-203A,U+2190-2193,U+00D7,U+3040-309F,U+30A0-30FF,U+3000-3003,U+300C-300F,U+FF01,U+FF1F,U+8D77,U+627F,U+8EE2,U+7D50,U+5DFB" \
  --layout-features='*' --flavor=woff2 --output-file=DelaGothicOne.woff2
```

Add the new character's code point to `--unicodes`.

## M PLUS 1

The Latin subset published by Fontsource, unchanged, as a variable font (weights 100 to 900).
