export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const database = url.searchParams.get('database');

        if (!database) {
            return new Response(JSON.stringify({ success: false, message: 'Database parameter is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const client = await clientPromise;
        const db = client.db(database);
        const collection = db.collection('ingestions');

        const documents = await collection.find().sort({ createdAt: -1 }).toArray();

        return new Response(JSON.stringify({ success: true, data: documents }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Error fetching documents:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
