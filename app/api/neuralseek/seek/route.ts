import { NextRequest, NextResponse } from 'next/server';

const urls = [
  {
    name: "staging-doc-analyzer-demo",
    url: "https://stagingapi.neuralseek.com/v1/doc-analyzer/seek",
    api_key: "49ba5f8f-c4d666a5-35081959-624dc6d5"
  },
  {
    name: "staging-brou-demo",
    url: "https://stagingapi.neuralseek.com/v1/brou-poc/seek",
    api_key: "4a6ba3c5-27646d7f-8ec021b9-75f81900"
    },
    {
    name: "customized-troubleshooter",
    url: "https://stagingapi.neuralseek.com/v1/CustomizedTroubleshooter/seek",
    api_key: "44979882-b9fced28-66d50eb0-1892e5cb"
  },
]

export async function POST(req: NextRequest) {
  try {
    const { url_name, question, filter } = await req.json();

    if (!url_name || !question) {
      return NextResponse.json(
        { error: "Missing required fields: url_name and question" },
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

    const body = {
      question,
      options: {
        includeSourceResults: true,
        includeHighlights: true,
        sourceResultsNumber: 10,
        sourceResultsSummaryLength: 2000,
        ...(filter && { filter })
      }
    };

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'apikey': config.api_key
      },
      body: JSON.stringify(body)
    });
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log(data)
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
