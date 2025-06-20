import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('LLEGA AQUI');
    const urlMaistro = `https://stagingapi.neuralseek.com/v1/test-juan/maistro_stream`;
    let body = await req.json();
    body['agent'] = 'main';


    const response = await fetch(urlMaistro, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': '5844d67b-235fde7c-e2715c01-5139af4e'
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Error del servidor remoto", responseText: await response.text() }, { status: response.status });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value).split('data: ')[1];
          controller.enqueue(new TextEncoder().encode(chunk));
        }

        controller.close();
      }
    });
    
    return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain", // o application/json si corresponde
      "Transfer-Encoding": "chunked", // importante para streaming
    },
  });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
