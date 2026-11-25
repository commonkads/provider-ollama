# Design — @commonkads/provider-ollama

## 1. Component Overview

| File | Export | Engine Interface |
|------|--------|-----------------|
| `src/ollama.ts` | `OllamaTextInference`, `OllamaTextInferenceOptions` | `IInferenceProvider` |
| `src/index.ts` | `registerOllamaProviders`, `register`, `OllamaProviderOptions` | — |

## 2. Interface Implementation

`OllamaTextInference implements IInferenceProvider`

The `infer(prompt, options?)` method:
1. POSTs to `${baseUrl}/api/chat` with `model`, `messages: [{role: 'user', content: prompt}]`, `stream: false`, and optional `options.num_ctx`
2. Checks `response.ok`; throws `Error("Ollama request failed (${status}): ...")` on failure
3. Returns `data.message.content`

Uses the native `fetch` API — no external HTTP client dependency.

## 3. Options Schema

```ts
interface OllamaTextInferenceOptions {
  baseUrl?: string;  // default: http://localhost:11434
  numCtx?: number;   // passed as options.num_ctx in the request body
}
```

## 4. Registry Wiring

```ts
registerOllamaProviders();
// Registers: registerProvider('ollama', (opts) => new OllamaTextInference(opts.model, { ... }))

const inference = buildInference({ type: 'ollama', model: 'qwen2.5:3b' });
```
