import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('sec_demo');
        const reportsCollection = db.collection('ingestions');
        const dataSourcesCollection = db.collection('data-sources');

        const reports = await reportsCollection.find({}, {
            projection: { file_name: 1, type: 1, data: 1, _id: 0 }
        }).toArray();

        const dataSources = await dataSourcesCollection.find({}, {
            projection: { source_name: 1, year: 1, data: 1, _id: 0 }
        }).toArray();

        const combinedData = [
            ...reports.map(doc => ({ type: 'report', name: doc.file_name, data: doc.data })),
            ...dataSources.map(doc => ({ type: 'data-source', name: doc.source_name, year: doc.year, data: doc.data }))
        ];

        return new Response(JSON.stringify({ success: true, data: combinedData }), {
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
