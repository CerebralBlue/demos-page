import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ success: false, message: 'Method Not Allowed' });
        }

        const { id } = req.query;
        if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid or missing data_source ID' });
        }

        const client = await clientPromise;
        const data_source = await client.db('sec_demo')
            .collection('data-sources')
            .findOne({ _id: new ObjectId(id) }, { projection: { _id: 1 } });

        if (!data_source) {
            return res.status(404).json({ success: false, message: 'Data source not found' });
        }

        return res.status(200).json({ success: true, data: data_source });

    } catch (error: any) {
        console.error('Error handling request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
