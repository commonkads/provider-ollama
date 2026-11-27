import type { InferenceProvider, InferenceOptions, ProviderFileConfig } from '@commonkads/engine';
import { createDiagnosticsLogger, loadProviderConfig } from '@commonkads/engine';

const logger = createDiagnosticsLogger('providers:ollama');

type OllamaFileConfig = ProviderFileConfig & { baseUrl?: string; numCtx?: number };

export interface OllamaTextInferenceOptions {
  /** Base URL of the Ollama server (default: http://localhost:11434). */
  baseUrl?: string;
  /** Context window size in tokens. Defaults to the model's built-in context length. */
  numCtx?: number;
  /** Path to a provider config file; defaults to ~/.commonkads/ollama.yml. */
  configFile?: string;
}

/** `InferenceProvider` backed by a locally-hosted Ollama model. No API key required. */
export class OllamaTextInference implements InferenceProvider {
  private readonly baseUrl: string;
  private readonly modelId: string;
  private readonly numCtx: number | undefined;

  constructor(
    modelId?: string,
    private readonly options: OllamaTextInferenceOptions = {},
  ) {
    const fileConfig = loadProviderConfig<OllamaFileConfig>('ollama', options.configFile);

    let resolvedModel: string;
    let modelSource: string;
    if (modelId !== undefined) {
      resolvedModel = modelId;
      modelSource = 'explicit-arg';
    } else if (fileConfig.modelId !== undefined) {
      resolvedModel = fileConfig.modelId;
      modelSource = 'config-file';
    } else {
      throw new Error(
        'modelId is required: pass it or set modelId in ~/.commonkads/providers/ollama.yml',
      );
    }
    this.modelId = resolvedModel;

    logger.info(`config: model="${resolvedModel}" source=${modelSource}`);

    this.baseUrl = (options.baseUrl ?? fileConfig.baseUrl ?? 'http://localhost:11434').replace(
      /\/$/,
      '',
    );
    this.numCtx = options.numCtx ?? fileConfig.numCtx;
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
        ...(this.numCtx ? { options: { num_ctx: this.numCtx } } : {}),
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
