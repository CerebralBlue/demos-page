import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { file_name, content } = body;

        if (!file_name || !content) {
            return new Response(JSON.stringify({
                success: false,
                message: 'file_name and content are required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const client = await clientPromise;
        const db = client.db('sec_demo');
        const collection = db.collection('reports');

        const report = {
            file_name,
            content,
            versions: [{ version: 1, content, timestamp: new Date() }],
            createdAt: new Date(),
        };

        const result = await collection.insertOne(report);

        return new Response(JSON.stringify({
            success: true,
            message: 'Document stored successfully',
            data: result
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Error handling POST request:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('sec_demo');
        const collection = db.collection('reports');

        const documents = await collection.find().sort({ createdAt: -1 }).toArray();

        return new Response(JSON.stringify({
            success: true,
            data: documents
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Error handling GET request:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
