import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db('sec_demo');
        const collection = db.collection('reports');

        const body = await req.json();
        const { id, content } = body;

        if (!id || !content) {
            return NextResponse.json(
                { success: false, message: 'id and content are required' },
                { status: 400 }
            );
        }

        const reportId = new ObjectId(id);

        const existingReport = await collection.findOne({ _id: reportId });

        if (!existingReport) {
            return NextResponse.json(
                { success: false, message: 'Report not found' },
                { status: 404 }
            );
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

        return NextResponse.json(
            {
                success: true,
                message: 'Draft version saved successfully',
                version: newVersion
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error handling request:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}