// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch('https://stagingapi.neuralseek.com/v1/NS-ES-V2/maistro/', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'apikey': 'e907252c-a14c702d-a0ae2b3b-490872cd'
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
