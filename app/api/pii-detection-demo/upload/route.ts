import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const incomingFormData = await req.formData();
    const file = incomingFormData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const outboundFormData = new FormData();
    outboundFormData.append('file', file, file.name);

    const response = await fetch('https://stagingconsoleapi.neuralseek.com/pii-detection-demo/exploreUpload', {
      method: 'POST',
      headers: {
        'apikey': 'cb04b8cf-4f808510-eb1f4890-817d2c15',
      },
      body: outboundFormData,
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json({ error: 'Remote server error', responseText: text }, { status: response.status });
    }

    return NextResponse.json(JSON.parse(text), { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
