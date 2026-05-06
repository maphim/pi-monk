# 🧘 pi-monk

Pi coding agent extension — **translate → AAAK compress → LLM reply EN (cheapest tokens)**.

## Pipeline

```
User (VN/FR/CN/AR/...) → [detect language] → [Google Translate → EN] → [AAAK compress] → LLM → [translate EN → user language] → User
```

## Features

- **🌐 Multi-language input**: Auto-detect language, translate to EN for cheapest LLM tokens
- **AAAK Compress**: 9-stage text compression → 27-57% token savings on EN
- **🌍 Multi-language output**: LLM replies in EN (cheapest), Google Translate → user's detected language
- **Code-safe**: Code blocks are never translated
- **Austerity Directives**: Injects concise-response rules into system prompt
- **0 cost translate**: Google Translate free API, ~0.5s per direction
- **UI Indicator**: Widget/footer showing real-time compression %

## Why translate?

| Language | Token cost vs EN | With pi-monk |
|----------|-----------------|--------------|
| Vietnamese | ~1.5-3x | EN tokens (cheapest) |
| Chinese | ~2-4x | EN tokens (cheapest) |
| Arabic | ~2-3x | EN tokens (cheapest) |
| French | ~1.2-1.5x | EN tokens (cheapest) |

LLM generates EN → cheapest tokens. User still sees output in their language.

## Install

```bash
pi install pi-monk
```

Or add to `.pi/settings.json`:

```json
{
  "packages": ["github:maphim/pi-monk"]
}
```

Then `/reload` in pi.

## Usage

Zero config. Just type in any language.

```
User: dạ thưa anh cho em hỏi hôm nay có gì mới không ạ
  → detect(vi) → translate EN → AAAK compress → LLM
  → LLM replies EN → translate VI
Widget: 🧘 Monk -42%
```

```
User: J'aime le Vietnam, est-ce une citation d'Einstein ?
  → detect(fr) → translate EN → AAAK compress → LLM
  → LLM replies EN → translate FR
Widget: 🧘 Monk -31%
```

## How AAAK compress works

```
User input → [detect + translate → EN] → [AAAK compress] → LLM

AAAK 9 stages:
s1: VN courtesies (dạ thưa, cảm ơn, ạ...)
s2: EN courtesies (dear, thanks, please...)
s3: Filler phrases (I think, basically, actually...)
s4: Condense patterns (I have a question → q:)
s5: Nano-syntax (a/an/the, is/are/was...)
s6: Abbreviation (configuration → config)
s7: Artifact cleanup
s8: Structure detection (|q=| |err=| |ctx=|)
s9: Whitespace
```

## UI Indicator

| State | Display |
|-------|---------|
| Idle | `🧘 Monk` |
| Active | `🧘 Monk -38%` (cumulative savings) |
| Per-compress | Notification: `🧘 Monk -42% (180 tok)` |
| Session end | Notification: `🧘 pi-monk: 3 comp, 5 in, 7 out, ~420 tok` |

## Development

```bash
npm test              # 37 tests
npm run lint          # biome lint
npm run lint:check    # check only
```

## Test standalone (no pi)

```bash
node --experimental-strip-types -e "
import {compressAAAK} from './src/compress.ts';
console.log(compressAAAK('Hello, I was wondering if you could help me'));
"
```

## License

MIT
