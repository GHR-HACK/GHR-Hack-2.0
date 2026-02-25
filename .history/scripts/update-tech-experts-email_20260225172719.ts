import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://himanshu:Himanshu%4088@cluster0.lfmoyh1.mongodb.net/ghrhack?appName=Cluster0&retryWrites=true&w=majority';

console.log('🔗 Connecting to MongoDB...');

async function updateTechExpertsEmail() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('ghrhack');
    const teamsCollection = db.collection('teams');

    console.log('\n📧 Updating Tech Experts email...');
    const updateResult = await teamsCollection.updateOne(
      { team_name: 'Tech Experts' },
      { $set: { leader_email: 'yashshri.gangurde.cse@ghrcemj.raisoni.net' } }
    );

    if (updateResult.modifiedCount > 0) {
      console.log(`✅ Email for Tech Experts updated successfully!`);
      console.log(`✅ New email: yashshri.gangurde.cse@ghrcemj.raisoni.net`);
    } else {
      console.log('❌ Team not found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

updateTechExpertsEmail();
