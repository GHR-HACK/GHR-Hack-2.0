import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://himanshu:Himanshu%4088@cluster0.lfmoyh1.mongodb.net/ghrhack?appName=Cluster0&retryWrites=true&w=majority';

console.log('🔗 Connecting to MongoDB...');

async function addSingleTeam() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('ghrhack');
    const teamsCollection = db.collection('teams');

    const newTeam = {
      team_name: 'VeriChain',
      team_leader_name: 'tanvi mulik',
      leader_password: '',
      leader_email: 'tanvi.mulik@cumminscollege.in',
      selected_ps: null,
      created_at: new Date(),
    };

    console.log('\n📝 Adding new team...');
    const insertResult = await teamsCollection.insertOne(newTeam);
    console.log(`✅ Team "VeriChain" added successfully!`);
    console.log(`✅ Team ID: ${insertResult.insertedId}`);

    console.log('\n✅ Now you have 40 teams total!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

addSingleTeam();
