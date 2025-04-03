import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { database } = req.query;

        if (!database || typeof database !== 'string') {
            return res.status(400).json({ success: false, message: 'Database parameter is required' });
        }

        const client = await clientPromise;
        const db = client.db(database);
        const collection = db.collection('ingestions');

        const documents = await collection.find().sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, data: documents });
    } catch (error: any) {
        console.error('Error fetching documents:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}