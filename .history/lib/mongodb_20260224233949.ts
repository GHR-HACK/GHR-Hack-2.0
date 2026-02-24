import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('ghrhack');  // ← Changed from 'hackathon' to 'ghrhack'

    cachedClient = client;
    cachedDb = db;

    console.log('✅ Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getDatabase() {
  const { db } = await connectToDatabase();
  return db;
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}
