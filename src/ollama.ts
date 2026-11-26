import type { IInferenceProvider, InferenceOptions } from '@commonkads/engine';
import { createDiagnosticsLogger } from '@commonkads/engine';

const logger = createDiagnosticsLogger('providers:ollama');

export interface OllamaTextInferenceOptions {
  /** Base URL of the Ollama server (default: http://localhost:11434). */
  baseUrl?: string;
  /** Context window size in tokens. Defaults to the model's built-in context length. */
  numCtx?: number;
}

/** `IInferenceProvider` backed by a locally-hosted Ollama model. No API key required. */
export class OllamaTextInference implements IInferenceProvider {
  private readonly baseUrl: string;

  constructor(
    private readonly modelId: string,
    private readonly options: OllamaTextInferenceOptions = {},
  ) {
    this.baseUrl = (options.baseUrl ?? 'http://localhost:11434').replace(/\/$/, '');
  }

  async infer(prompt: string, _options: InferenceOptions = {}): Promise<string> {
    const url = `${this.baseUrl}/api/chat`;

    logger.debug(`calling model=${this.modelId} promptLength=${prompt.length}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.modelId,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        ...(this.options.numCtx ? { options: { num_ctx: this.options.numCtx } } : {}),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama request failed (${response.status}): ${text}`);
    }

    const data = (await response.json()) as { message: { content: string } };
    return data.message.content;
  }
}
