import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { database, file_name, type, data } = body;

        if (!file_name || !type || !data) {
            return new Response(JSON.stringify({ success: false, message: 'file_name, data, and type are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const client = await clientPromise;
        const db = client.db(database);
        const collection = db.collection('ingestions');

        const result = await collection.insertOne({ file_name, type, data, createdAt: new Date() });

        return new Response(JSON.stringify({
            success: true,
            message: 'Document stored successfully',
            data: result,
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Error storing document:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
