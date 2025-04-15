// app/api/proxy_brou/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch('https://stagingconsoleapi.neuralseek.com/pii-detection-demo/exploreUpload', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'apikey': 'cb04b8cf-4f808510-eb1f4890-817d2c15'
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
