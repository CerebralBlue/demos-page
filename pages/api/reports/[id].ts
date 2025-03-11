import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db('sec_demo');
        const collection = db.collection('reports');

        if (req.method !== 'GET') {
            return res.status(405).json({ success: false, message: 'Method Not Allowed' });
        }

        const { id } = req.query;
        if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid or missing report ID' });
        }

        // Fetch the full report
        const report = await collection.findOne({ _id: new ObjectId(id) });

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // If no versions exist, return only the base report
        if (!Array.isArray(report.versions) || report.versions.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    _id: report._id,
                    title: report.title,
                    content: report.content,
                    versions: report.versions
                }
            });
        }

        // Sort versions by version number in descending order
        const sortedVersions = report.versions.sort((a: any, b: any) => (b.version || 0) - (a.version || 0));

        return res.status(200).json({
            success: true,
            data: {
                _id: report._id,
                title: report.title,
                content: sortedVersions[0].content,
                versions: sortedVersions,
            }
        });

    } catch (error: any) {
        console.error('Error handling request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
