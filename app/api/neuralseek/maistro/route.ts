import { NEURALSEEK_URL_CONFIGS } from '@/constants/neuralseek.config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url_name, agent, params, options } = await req.json();

    if (!url_name || !agent || !params || !Array.isArray(params)) {
      return NextResponse.json(
        { error: "Missing required fields: url_name, agent and params" },
        { status: 400 }
      );
    }

    const config = NEURALSEEK_URL_CONFIGS.find(url => url.name === url_name);
    console.log(config);
    if (!config) {
      return NextResponse.json(
        { error: `No configuration found for ${url_name}` },
        { status: 400 }
      );
    }

    const body = {
      agent,
      params,
      options: options || {
        returnVariables: true,
        returnVariablesExpanded: true
      }
    };

    if (!config.url_maistro) {
      throw new Error('Missing Maistro URL in config');
    }

    const response = await fetch(config.url_maistro, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.api_key,
      },
      body: JSON.stringify(body),
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
