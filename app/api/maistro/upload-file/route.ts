import { NextRequest, NextResponse } from 'next/server';

const urls = [
    {
        name: "staging-pii-detection-demo",
        url: "https://stagingconsoleapi.neuralseek.com/pii-detection-demo/exploreUpload",
        api_key: "cb04b8cf-4f808510-eb1f4890-817d2c15"
    },
    {
        name: "staging-SEC-demo",
        url: "https://stagingconsoleapi.neuralseek.com/SEC-demo/exploreUpload",
        api_key: "6c5aca86-d343615d-60a44b29-c6dbb084"
    },
    {
        name: "staging-derrick-law-demo",
        url: "https://stagingconsoleapi.neuralseek.com/derrick-law-demo/exploreUpload",
        api_key: "f2d85bde-aa86902a-aea925ba-ca0bbb1e"
    },
    {
        name: "staging-exentec-demo",
        url: "https://stagingconsoleapi.neuralseek.com/exentec-demo/exploreUpload",
        api_key: "cd25eca8-ac1a97c9-ded59613-045c4f90"
    }
];

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

        const config = urls.find(url => url.name === url_name);

        if (!config) {
            return NextResponse.json({ error: `No configuration found for ${url_name}` }, { status: 400 });
        }

        const outboundFormData = new FormData();
        outboundFormData.append('file', file, file.name);

        const response = await fetch(config.url, {
            method: 'POST',
            headers: {
                'apikey': config.api_key,
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
