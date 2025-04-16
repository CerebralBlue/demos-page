import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db('sec_demo');
        const collection = db.collection('data-sources');

        if (req.method === 'POST') {
            const { source_name, year, data } = req.body;

            if (!source_name || !year || !data) {
                return res.status(400).json({ success: false, message: 'source_name, year, and data are required' });
            }

            const result = await collection.insertOne({ source_name, year, data, lastUpdated: new Date() });
            return res.status(201).json({ success: true, message: 'Document stored successfully', data: result });
        }

        if (req.method === 'GET') {
            const documents = await collection.find().sort({ lastUpdated: -1 }).toArray();
            return res.status(200).json({ success: true, data: documents });
        }

        if (req.method === 'PUT') {
            const { id, data } = req.body;

            if (!id || !data) {
                return res.status(400).json({ success: false, message: 'id and data are required' });
            }

            try {
                const result = await collection.updateOne(
                    { _id: new ObjectId(id) }, 
                    { $set: { data, lastUpdated: new Date() } }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ success: false, message: 'Document not found' });
                }

                return res.status(200).json({ success: true, message: 'Document updated successfully' });
            } catch (error) {
                return res.status(500).json({ success: false, message: 'Server error', error: error });
            }
        }

        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    } catch (error: any) {
        console.error('Error handling request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
