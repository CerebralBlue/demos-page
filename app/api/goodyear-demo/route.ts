import { NEURALSEEK_URL_CONFIGS } from '@/constants/neuralseek.config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const config = NEURALSEEK_URL_CONFIGS.find(url => url.name === "goodyear-search-engine");

    const body = await req.json();

    if (!config?.url_seek) {
      return NextResponse.json({ error: "Missing NeuralSeek configuration or URL." }, { status: 500 });
    }

    const response = await fetch(config.url_seek, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.api_key || ''
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
