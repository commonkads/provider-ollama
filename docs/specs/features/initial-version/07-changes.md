# Changes: Initial Version

## New files

- `src/ollama.ts` — `OllamaTextInference` and `OllamaTextInferenceOptions`, ported from `@commonkads/engine`; imports rewritten to use the engine package
- `src/index.ts` — package entry point; exports class, options type, `OllamaProviderOptions`, `registerOllamaProviders()`, and `register` alias
- `test/ollama.test.ts` — 4 unit tests ported from engine; import path updated to `../src/ollama.js`
- `package.json`, `tsconfig.json`, `tsconfig.test.json`, `eslint.config.mjs` — full package scaffold
- `.gitignore`, `.npmrc`, `.prettierrc.js` — project hygiene
- `.changeset/config.json` — changeset configuration
- `.github/workflows/ci.yml` — lint, compile, test, pack, upload tarball
- `.github/workflows/release.yml` — changesets-based version/publish workflow
- `CHANGELOG.md`, `LICENSE`, `README.md` — documentation and legal
- `docs/specs/features/initial-version/` — feature phase docs

## Deviations from design

- `.prettierrc.js` added (not in design): required so the mandated `precompile` format step does not rewrite single-quoted source to double quotes.
- `src/ollama.ts` imports merged into one `import type` statement (advisory from review): cosmetic improvement.
