import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const urlSeek = `${process.env.NEXT_PUBLIC_API_BASE_URL}/goodyear-search-engine/seek`;

    const body = await req.json();
    const response = await fetch(urlSeek, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'apikey': 'ce57e0c1-11924e98-2a8200aa-7579ff4e'
      },
      body: JSON.stringify(body),
    });    

    if (!response.ok) {
      return NextResponse.json({ error: "Error del servidor remoto", responseText: await response.text() }, { status: response.status });
    }

    return NextResponse.json(await response.json(), { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
