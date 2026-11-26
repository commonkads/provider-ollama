# Brainstorm: Initial Version

Extract `OllamaTextInference` from `@commonkads/engine` into a standalone `@commonkads/provider-ollama` package, mirroring the `provider-anthropic` pattern. The built-in `'ollama'` registry entry is removed from the engine; callers must call `registerOllamaProviders()` at startup (Option A).
