import { registerProvider } from '@commonkads/engine';
import { OllamaTextInference } from './ollama.js';

export { OllamaTextInference };
export type { OllamaTextInferenceOptions } from './ollama.js';

export interface OllamaProviderOptions {
  type: 'ollama';
  model: string;
  baseUrl?: string;
  numCtx?: number;
}

export function registerOllamaProviders(): void {
  registerProvider('ollama', (opts) => {
    const o = opts as unknown as OllamaProviderOptions;
    return new OllamaTextInference(o.model, {
      baseUrl: o.baseUrl,
      numCtx: o.numCtx,
    });
  });
}

export { registerOllamaProviders as register };
