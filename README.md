# @commonkads/provider-ollama

> **Disclaimer:** This project is an independent open-source software implementation inspired by the CommonKADS knowledge engineering methodology (Schreiber et al.). It is not affiliated with or endorsed by the original methodology authors or any third-party trademark holders.

Ollama provider implementation for the [CommonKADS engine](https://github.com/commonkads/engine).

## Provided implementations

| Export | Interface | Description |
|--------|-----------|-------------|
| `OllamaTextInference` | `IInferenceProvider` | Locally-hosted Ollama model via `/api/chat` |

## Usage

### Via the registry (recommended)

```ts
import { registerOllamaProviders } from '@commonkads/provider-ollama';
import { buildInference } from '@commonkads/engine';

// Call once at startup, before any buildInference calls.
registerOllamaProviders();

const inference = buildInference({
  type: 'ollama',
  model: 'qwen2.5:3b',
});
```

### Direct construction

```ts
import { OllamaTextInference } from '@commonkads/provider-ollama';

const inference = new OllamaTextInference('qwen2.5:3b', {
  baseUrl: 'http://localhost:11434',
  numCtx: 8192,
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | `http://localhost:11434` | Base URL of the Ollama server |
| `numCtx` | `number` | model default | Context window size in tokens |

No API key required — Ollama runs locally.
