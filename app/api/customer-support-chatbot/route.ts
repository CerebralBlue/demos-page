import { NEURALSEEK_URL_CONFIGS } from '@/constants/neuralseek.config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const config = NEURALSEEK_URL_CONFIGS.find(url => url.name === "customer-support-chatbot");

    if (!config?.url_seek) {
      return NextResponse.json({ error: "Missing NeuralSeek configuration or URL." }, { status: 500 });
    }

    const body = await req.json();

    const response = await fetch(config.url_seek, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.api_key || '',
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
