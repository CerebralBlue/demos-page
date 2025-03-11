import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db('sec_demo');
        const collection = db.collection('reports');

        if (req.method === 'POST') {
            const { id, content } = req.body;

            if (!id || !content) {
                return res.status(400).json({ success: false, message: 'id and content are required' });
            }

            const reportId = new ObjectId(id);

            // Check if the report exists
            const existingReport = await collection.findOne({ _id: reportId });

            if (!existingReport) {
                return res.status(404).json({ success: false, message: 'Report not found' });
            }

            // Determine the new version number
            const newVersion = (existingReport.latestVersion || 1) + 1;

            // Update the document by adding a new draft version
            await collection.updateOne(
                { _id: reportId },
                {
                    $push: { 
                        versions: {
                            version: newVersion,
                            content,
                            timestamp: new Date()
                        } as any
                    },
                    $set: { latestVersion: newVersion }
                }
            );

            return res.status(201).json({
                success: true,
                message: 'Draft version saved successfully',
                version: newVersion
            });
        }

        return res.status(405).json({ success: false, message: 'Method Not Allowed' });

    } catch (error: any) {
        console.error('Error handling request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}