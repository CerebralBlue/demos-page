import { NEURALSEEK_URL_CONFIGS } from '@/constants/neuralseek.config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url_name, question, filter } = await req.json();    

    if (!url_name || !question) {
      return NextResponse.json(
        { error: "Missing required fields: url_name and question" },
        { status: 400 }
      );
    }

    const config = NEURALSEEK_URL_CONFIGS.find(url => url.name === url_name);

    if (!config) {
      return NextResponse.json(
        { error: `No configuration found for ${url_name}` },
        { status: 400 }
      );
    }

    // Construct the base body with options
    let body: { options: any; question?: any; } = {
      options: {
        includeSourceResults: true,
        includeHighlights: true,
        sourceResultsNumber: 10,
        sourceResultsSummaryLength: 2000,
        ...(filter && { filter })
      }
    };

    // Add question to body based on its type
    if (typeof question === 'object') {
      body = { ...question, ...body };
    } else {
      body = { ...body, question };
    }
    
    if (!config.url_seek) {
      throw new Error('Missing URL in config');
    }
    
    const response = await fetch(config.url_seek, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.api_key,
      },
      body: JSON.stringify(body),
    });
    
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