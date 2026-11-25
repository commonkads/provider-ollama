# Requirements: Initial Version

## In scope

### New package (`@commonkads/provider-ollama`)
- Port `OllamaTextInference` and `OllamaTextInferenceOptions` from `engine/src/provider/ollama/`
- Export `registerOllamaProviders()` and `register` alias to wire the `'ollama'` type into the engine registry
- Export `OllamaProviderOptions` interface (`type`, `model`, `baseUrl?`, `numCtx?`)
- Full package scaffold mirroring `provider-anthropic`: package.json, tsconfigs, eslint, CI/release workflows, changeset config, LICENSE, README, CHANGELOG

### Engine (`@commonkads/engine`)
- Remove `src/provider/ollama/` (both source and test files)
- Remove the built-in `'ollama'` registry entry and `OllamaProviderOptions` from `src/provider/factory.ts`
- Remove the ollama re-export from `src/provider/index.ts`
- Update `CLAUDE.md` to reference `@commonkads/provider-ollama`

## Out of scope
- Changes to any other providers (local, AWS, Gemini, OpenAI)
- New Ollama capabilities beyond the existing implementation
- Publishing the package
- Updating downstream consumers
