import clientPromise from '@/lib/mongodb';

function jsonResponse(body: any, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function getDbNameFromUrl(url: string): string | null {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get('database');
}

async function handlePost(dbName: string, req: Request) {
    const body = await req.json();
    const { file_name, content } = body;

    if (!file_name || !content) {
        return jsonResponse({ success: false, message: 'file_name and content are required' }, 400);
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('reports');

    const report = {
        file_name,
        content,
        versions: [{ version: 1, content, timestamp: new Date() }],
        createdAt: new Date(),
    };

    const result = await collection.insertOne(report);

    return jsonResponse({
        success: true,
        message: 'Document stored successfully',
        data: result,
    }, 201);
}

async function handleGet(dbName: string) {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('reports');

    const documents = await collection.find().sort({ createdAt: -1 }).toArray();

    return jsonResponse({
        success: true,
        data: documents
    });
}

export async function POST(req: Request) {
    try {
        const dbName = getDbNameFromUrl(req.url);
        if (!dbName) {
            return jsonResponse({ success: false, message: 'Missing required "db" query parameter' }, 400);
        }
        return await handlePost(dbName, req);
    } catch (error: any) {
        console.error('Error handling POST request:', error);
        return jsonResponse({ success: false, message: 'Internal Server Error', error: error.message }, 500);
    }
}

export async function GET(req: Request) {
    try {
        const dbName = getDbNameFromUrl(req.url);
        if (!dbName) {
            return jsonResponse({ success: false, message: 'Missing required "db" query parameter' }, 400);
        }
        return await handleGet(dbName);
    } catch (error: any) {
        console.error('Error handling GET request:', error);
        return jsonResponse({ success: false, message: 'Internal Server Error', error: error.message }, 500);
    }
}
