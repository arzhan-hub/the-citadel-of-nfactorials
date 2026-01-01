import { NextResponse } from 'next/server';

type ResponseContentItem = { text?: string; type?: string };

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  let res: Response;
  try {
    res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        instructions:
          'You are Truth Tortoise AI. Answer with priority on Rick and Morty universe facts and lore. If the question is unrelated, answer briefly and suggest a Rick and Morty related angle.',
        input: String(prompt ?? ''),
        max_output_tokens: 300,
      }),
    });
  } catch (error) {
    clearTimeout(timeout);
    const message = error instanceof Error ? error.message : 'Request failed';
    const status = message.toLowerCase().includes('abort') ? 504 : 500;
    return NextResponse.json({ error: 'AI request failed', details: message }, { status });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const details = await res.text();
    return NextResponse.json({ error: 'AI request failed', details }, { status: res.status });
  }

  const data = await res.json();
  const contentItems: ResponseContentItem[] = Array.isArray(data.output)
    ? data.output.flatMap((item: { content?: ResponseContentItem[] }) =>
        Array.isArray(item.content) ? item.content : []
      )
    : [];
  const outputText =
    (typeof data.output_text === 'string' ? data.output_text : '') ||
    contentItems
      .map((item: ResponseContentItem) => item.text)
      .filter((value): value is string => typeof value === 'string')
      .join('')
      .trim();
  if (!outputText) {
    return NextResponse.json({ error: 'AI response empty', details: data }, { status: 502 });
  }
  return NextResponse.json({ text: outputText });
}
