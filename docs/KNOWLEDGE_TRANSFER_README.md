# WaddlePolitan Knowledge Transfer

This package is intended to be copied into the WaddlePolitan repository so Codex can inherit the important product and engineering context from prior planning discussions.

## Recommended Placement

```text
waddlepolitan/
├── AGENTS.md
├── docs/
│   ├── PRODUCT.md
│   ├── MVP_SCOPE.md
│   ├── DESIGN_SYSTEM.md
│   ├── UX_FLOWS.md
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── SUPABASE.md
│   ├── API_CONTRACTS.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── TESTING.md
│   ├── DEPLOYMENT.md
│   ├── DECISIONS.md
│   ├── NON_GOALS.md
│   ├── ROADMAP.md
│   └── CODEX_HANDOFF.md
└── ...
```

## How to Use

1. Copy `AGENTS.md` to the repository root.
2. Copy the `docs/` directory into the repository.
3. Commit the files.
4. Start Codex with the prompt in `docs/CODEX_HANDOFF.md`.
5. Update `docs/DECISIONS.md` whenever a major product or architecture decision changes.

These documents intentionally favor a simple MVP over speculative complexity.
