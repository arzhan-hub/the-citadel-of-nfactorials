import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);

    if (!res.ok) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}