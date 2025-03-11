import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db('sec_demo');
        const collection = db.collection('ingestions');

        if (req.method === 'POST') {
            const { file_name, type, data } = req.body;

            if (!file_name || !type || !data) {
                return res.status(400).json({ success: false, message: 'file_name, data and type are required' });
            }

            const result = await collection.insertOne({ file_name, type, data, createdAt: new Date() });
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
