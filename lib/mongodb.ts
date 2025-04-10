import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
if (!uri) throw new Error('Please add your MongoDB URI to .env.local');

const options = {};
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Avoid TypeScript errors for adding custom properties to the `global` object
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
