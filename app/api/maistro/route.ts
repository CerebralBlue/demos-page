import { NextRequest, NextResponse } from 'next/server';

const urls = [
  {
    name: "staging-pii-detection-demo",
    url: "https://stagingapi.neuralseek.com/v1/pii-detection-demo/maistro",
    api_key: "cb04b8cf-4f808510-eb1f4890-817d2c15"
  }
]

export async function POST(req: NextRequest) {
  try {
    const { url_name, agent, params, options } = await req.json();

    if (!url_name || !agent || !params || !Array.isArray(params)) {
      return NextResponse.json({ error: "Missing required fields: url_name, agent and params" }, { status: 400 });
    }

    const config = urls.find(url => url.name === url_name);

    if (!config) {
      return NextResponse.json({ error: `No configuration found for ${url_name}` }, { status: 400 });
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

    console.log(response)
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "Remote server error", details: data }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
