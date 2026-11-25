import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

import { OllamaTextInference } from '../src/ollama.js';

function makeFetch(body: unknown, status = 200) {
  return mock.fn(
    async (_input: Parameters<typeof fetch>[0], _init?: RequestInit) =>
      ({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(JSON.stringify(body)),
      }) as Response,
  );
}

describe('OllamaTextInference', () => {
  let savedFetch: typeof fetch;

  beforeEach(() => {
    savedFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = savedFetch;
  });

  it('posts to /api/chat and returns the message content', async () => {
    const fakeFetch = makeFetch({
      message: { role: 'assistant', content: '{"verdict":"Pass"}' },
    });
    globalThis.fetch = fakeFetch as unknown as typeof fetch;

    const inference = new OllamaTextInference('qwen2.5:3b');
    const result = await inference.infer('some prompt');

    assert.strictEqual(result, '{"verdict":"Pass"}');
    assert.strictEqual(fakeFetch.mock.callCount(), 1);

    const [url, init] = fakeFetch.mock.calls[0].arguments as [string, RequestInit];
    assert.strictEqual(url, 'http://localhost:11434/api/chat');
    const body = JSON.parse(init.body as string);
    assert.strictEqual(body.model, 'qwen2.5:3b');
    assert.strictEqual(body.stream, false);
    assert.deepStrictEqual(body.messages, [{ role: 'user', content: 'some prompt' }]);
  });

  it('uses a custom baseUrl when provided', async () => {
    const fakeFetch = makeFetch({ message: { content: 'ok' } });
    globalThis.fetch = fakeFetch as unknown as typeof fetch;

    const inference = new OllamaTextInference('llama3.2', {
      baseUrl: 'http://192.168.1.5:11434',
    });
    await inference.infer('hello');

    const [url] = fakeFetch.mock.calls[0].arguments as [string, RequestInit];
    assert.strictEqual(url, 'http://192.168.1.5:11434/api/chat');
  });

  it('includes num_ctx in options when provided', async () => {
    const fakeFetch = makeFetch({ message: { content: 'ok' } });
    globalThis.fetch = fakeFetch as unknown as typeof fetch;

    const inference = new OllamaTextInference('qwen2.5:3b', { numCtx: 8192 });
    await inference.infer('hello');

    const [, init] = fakeFetch.mock.calls[0].arguments as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    assert.deepStrictEqual(body.options, { num_ctx: 8192 });
  });

  it('throws when the server returns a non-OK status', async () => {
    const fakeFetch = makeFetch('model not found', 404);
    globalThis.fetch = fakeFetch as unknown as typeof fetch;

    const inference = new OllamaTextInference('nonexistent');
    await assert.rejects(inference.infer('hello'), /Ollama request failed \(404\)/);
  });
});
