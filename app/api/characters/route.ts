import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  const page = searchParams.get('page') || '1';

  try {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${page}&name=${name}`
    );

    if (!res.ok) {
        return NextResponse.json({ results: [], info: {} }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}