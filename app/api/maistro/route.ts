import { NextRequest, NextResponse } from 'next/server';

const urls = [
  {
    name: "staging-pii-detection-demo",
    url: "https://stagingapi.neuralseek.com/v1/pii-detection-demo/maistro",
    api_key: "cb04b8cf-4f808510-eb1f4890-817d2c15"
  },
  {
    name: "staging-SEC-demo",
    url: "https://stagingapi.neuralseek.com/v1/SEC-demo/maistro",
    api_key: "6c5aca86-d343615d-60a44b29-c6dbb084"
  },
  {
    name: "staging-derrick-law-demo",
    url: "https://stagingapi.neuralseek.com/v1/derrick-law-demo/maistro",
    api_key: "f2d85bde-aa86902a-aea925ba-ca0bbb1e"
  },
  {
    name: "staging-baycrest",
    url: "https://stagingapi.neuralseek.com/v1/baycrest/maistro",
    api_key: "598063fe-d9682db0-634ac42c-67bea8bb"
  }
]

export async function POST(req: NextRequest) {
  try {
    const { url_name, agent, params, options } = await req.json();

    if (!url_name || !agent || !params || !Array.isArray(params)) {
      return NextResponse.json(
        { error: "Missing required fields: url_name, agent and params" },
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
      agent,
      params,
      options: options || {
        returnVariables: true,
        returnVariablesExpanded: true
      }
    };

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
          body: text.slice(0, 300) // truncate to prevent flooding
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
