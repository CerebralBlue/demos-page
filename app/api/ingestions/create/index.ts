import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { database, file_name, type, data } = req.body;

        if (!file_name || !type || !data) {
            return res.status(400).json({ success: false, message: 'file_name, data, and type are required' });
        }

        const client = await clientPromise;
        const db = client.db(database);
        const collection = db.collection('ingestions');

        const result = await collection.insertOne({ file_name, type, data, createdAt: new Date() });
        return res.status(201).json({ success: true, message: 'Document stored successfully', data: result });
    } catch (error: any) {
        console.error('Error storing document:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
