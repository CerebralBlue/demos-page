// app/api/proxy_brou/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Test")
    const response = await fetch('https://stagingapi.neuralseek.com/v1/bank-instance/maistro/', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'apikey': '754fb875-e0794f9d-e6b03a46-07f95776'
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
