import { NextRequest, NextResponse } from 'next/server';

const urls = [
  {
    name: "staging-agent-runner",
    url: "https://stagingconsoleapi.neuralseek.com/agent-runner/fdel",
    api_key: "26a38846-f24dbfce-ea622343-25dad915"
  },
]

export async function POST(req: NextRequest) {
  try {
    const { url_name, fileName } = await req.json();

    if (!url_name || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields: url_name, fileName" },
        { status: 400 }
      );
    }

    const config = urls.find(url => url.name === url_name);

    if (!config) {
      return NextResponse.json(
        { error: `No configuration found for ${url_name}` },
        { status: 400 }
      );
    }

    const maistroCallBody = {
        name: fileName,
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.api_key
      },
      body: JSON.stringify(maistroCallBody)
    });
    // Check for content-type header
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      return NextResponse.json(
        {
          error: 'Expected JSON response but received non-JSON content',
          contentType,
          body: text.slice(0, 300)
        },
        { status: response.status }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Remote server error", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Unexpected server error', message: error.message },
      { status: 500 }
    );
  }
}
