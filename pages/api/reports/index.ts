import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db('sec_demo');
        const collection = db.collection('reports');

        if (req.method === 'POST') {
            const { file_name, content } = req.body;

            if (!file_name || !content) {
                return res.status(400).json({ success: false, message: 'file_name and content are required' });
            }

            // Create a new report with the first version
            const report = {
                file_name,
                content,
                versions: [{ version: 1, content, timestamp: new Date() }],
                createdAt: new Date(),
            };

            const result = await collection.insertOne(report);
            return res.status(201).json({ success: true, message: 'Document stored successfully', data: result });
        }

        if (req.method === 'GET') {
            const documents = await collection.find().sort({ createdAt: -1 }).toArray();
            return res.status(200).json({ success: true, data: documents });
        }

        return res.status(405).json({ success: false, message: 'Method Not Allowed' });

    } catch (error: any) {
        console.error('Error handling request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
