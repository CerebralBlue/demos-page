import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const urlSeek = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-support-chatbot/seek`;
    const API_KEY_CUSTOMER_SUPPORT_CHATBOT = process.env.CUSTOMER_SUPPORT_CHATBOT_API_KEY || '';

    const body = await req.json();
    const response = await fetch(urlSeek, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'apikey': API_KEY_CUSTOMER_SUPPORT_CHATBOT
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
