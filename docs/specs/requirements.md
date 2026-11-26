# Requirements — @commonkads/provider-ollama

## Overview

Ollama provider implementation for the [CommonKADS engine](https://github.com/commonkads/engine). Provides `IInferenceProvider` backed by a locally-hosted Ollama server. No API key required.

## REQ-1 — OllamaTextInference

Implements `IInferenceProvider`. Constructor accepts `modelId: string` and `OllamaTextInferenceOptions`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | `http://localhost:11434` | Base URL of the Ollama server |
| `numCtx` | `number` | model default | Context window size in tokens |

`infer()` posts to `/api/chat` with `stream: false` and returns `data.message.content`.

## REQ-2 — Registry Integration

`registerOllamaProviders()` registers a builder for type `"ollama"`. The `register` named export is an alias. `OllamaProviderOptions` (`{ type: "ollama"; model; baseUrl?; numCtx? }`) is the config shape.

## REQ-3 — Configuration

No credentials required. Configure `baseUrl` to point at a remote Ollama instance if needed. Use `numCtx` to override the model's default context window.

## Out of Scope

- Ollama model management (pull, push, delete)
- Streaming responses
- Embedding generation
