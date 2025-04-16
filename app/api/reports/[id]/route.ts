import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Validate the ID format
        if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid or missing report ID'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const client = await clientPromise;
        const db = client.db('sec_demo');
        const collection = db.collection('reports');

        // Fetch the full report based on the ID
        const report = await collection.findOne({ _id: new ObjectId(id) });

        if (!report) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Report not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // If no versions exist, return only the base report
        if (!Array.isArray(report.versions) || report.versions.length === 0) {
            return new Response(JSON.stringify({
                success: true,
                data: {
                    _id: report._id,
                    title: report.title,
                    content: report.content,
                    versions: report.versions
                }
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Sort versions by version number in descending order
        const sortedVersions = report.versions.sort((a: any, b: any) => (b.version || 0) - (a.version || 0));

        return new Response(JSON.stringify({
            success: true,
            data: {
                _id: report._id,
                title: report.title,
                content: sortedVersions[0].content,
                versions: sortedVersions,
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error handling request:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
