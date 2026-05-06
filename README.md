# 🧘 pi-monk

Pi coding agent extension — **AAAK compress** + **Token Austerity Directives**.

## Features

- **AAAK Compress**: 9-stage text compression (courtesies, fillers, nano-syntax, abbreviations) → 27-57% token savings
- **Austerity Directives**: Injects concise-response rules into system prompt
- **0 API cost**: Pure regex transforms, no model calls
- **0ms latency**: Synchronous, no network
- **UI Indicator**: Widget + footer showing real-time compression % savings

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

Zero config. Once installed:
- Input text → auto-compressed before LLM
- Widget/footer shows `🧘 Monk -38%` (cumulative savings)

## How it works

```
User input → [AAAK compress] → LLM → Response
              9 stages:
              s1: VN courtesies     s4: Condense patterns     s7: Artifact cleanup
              s2: EN courtesies     s5: Nano-syntax           s8: Structure detection
              s3: Filler phrases    s6: Abbreviation          s9: Whitespace
```

## Stats

Real-time UI indicator updates per session:
- `🧘 Monk` — idle
- `🧘 Monk -38%` — cumulative compression savings
- `🧘 Monk -42% (180 tok)` — on each compress (notification)

Stats reset per session. Shutdown notification shows total savings.

## License

MIT
