# Design: Initial Version

## New files (`provider-ollama`)

| File | Description |
|------|-------------|
| `src/ollama.ts` | `OllamaTextInference` + `OllamaTextInferenceOptions`, imports from `@commonkads/engine` |
| `src/index.ts` | Exports class, options type, `OllamaProviderOptions`, `registerOllamaProviders()`, `register` alias |
| `test/ollama.test.ts` | 4 unit tests ported from engine |

## Changed files (`engine`)

| File | Change |
|------|--------|
| `src/provider/index.ts` | Remove ollama re-export |
| `src/provider/factory.ts` | Remove OllamaTextInference import, OllamaProviderOptions, built-in registry entry |
| `CLAUDE.md` | Update provider location reference |
| `src/provider/ollama/` | Deleted |

## Key data flow

`registerOllamaProviders()` calls `registerProvider('ollama', ...)` from the engine. After that call, `buildInference({type: 'ollama', model: '...'})` constructs an `OllamaTextInference` instance.
