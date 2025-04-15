// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch('https://api-usw.neuralseek.com/v1/e688e6f2bfe772fdae28dc9f/seek', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'apikey': 'e389d36b-a9af93af-ac08626f-c829870d'
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
