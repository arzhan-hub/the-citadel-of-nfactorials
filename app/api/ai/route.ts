import { NextResponse } from 'next/server';

  export async function POST(request: Request) {
    const { prompt } = await request.json();

    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: `Give a concise character bio and trivia. ${prompt}`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'AI request failed' }, { status: 500 });
    }

    const data = await res.json();
    const text = data.output?.[0]?.content?.[0]?.text ?? '';
    return NextResponse.json({ text });
  }