import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db('sec_demo');
        const reportsCollection = db.collection('ingestions');
        const dataSourcesCollection = db.collection('data-sources');

        if (req.method === 'GET') {
            const reports = await reportsCollection.find({}, { projection: { file_name: 1, type: 1, data: 1, _id: 0 } }).toArray();
            const dataSources = await dataSourcesCollection.find({}, { projection: { source_name: 1, year: 1, data: 1, _id: 0 } }).toArray();

            const combinedData = [
                ...reports.map(doc => ({ type: 'report', name: doc.file_name, data: doc.data })),
                ...dataSources.map(doc => ({ type: 'data-source', name: doc.source_name, year: doc.year, data: doc.data }))
            ];

            return res.status(200).json({ success: true, data: combinedData });
        } 
        
        else {
            return res.status(405).json({ success: false, message: 'Method Not Allowed' });
        }
    } catch (error: any) {
        console.error('Error handling request:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
