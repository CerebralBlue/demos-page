// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch('https://stagingapi.neuralseek.com/v1/turing/maistro', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'apikey': 'f5ca3423-1c27c087-b261f348-467ce701'
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json({ error: "Error del servidor remoto", responseText: text }, { status: response.status });
    }

    return NextResponse.json(JSON.parse(text), { status: response.status });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
