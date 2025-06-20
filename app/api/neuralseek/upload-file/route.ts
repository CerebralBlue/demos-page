import { NEURALSEEK_URL_CONFIGS } from '@/constants/neuralseek.config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {

        const incomingFormData = await req.formData();
        const url_name = incomingFormData.get('url_name') as string;
        const file = incomingFormData.get('file') as File;

        if (!url_name || typeof url_name !== 'string') {
            return NextResponse.json({ error: "Missing or invalid url_name" }, { status: 400 });
        }

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const config = NEURALSEEK_URL_CONFIGS.find(url => url.name === url_name);

        if (!config) {
            return NextResponse.json({ error: `No configuration found for ${url_name}` }, { status: 400 });
        }

        const outboundFormData = new FormData();
        outboundFormData.append('file', file, file.name);

        if (!config.url_explore_upload) {
            throw new Error('Missing Explore Upload file URL in config');
        }

        const response = await fetch(config.url_explore_upload, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: config.api_key,
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
