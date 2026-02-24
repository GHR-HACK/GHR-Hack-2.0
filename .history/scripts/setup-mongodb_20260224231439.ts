import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://himanshu:Himanshu@88@cluster0.lfmoyh1.mongodb.net/ghrhack?appName=Cluster0&retryWrites=true&w=majority';

async function setupMongoDB() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('ghrhack');

    // ===== CREATE COLLECTIONS =====
    console.log('\n📦 Creating collections...');

    // Create teams collection
    try {
      await db.createCollection('teams');
      console.log('✅ Created "teams" collection');
    } catch (error: any) {
      if (error.codeName === 'NamespaceExists') {
        console.log('⚠️  "teams" collection already exists');
      } else {
        throw error;
      }
    }

    // Create problem_statements collection
    try {
      await db.createCollection('problem_statements');
      console.log('✅ Created "problem_statements" collection');
    } catch (error: any) {
      if (error.codeName === 'NamespaceExists') {
        console.log('⚠️  "problem_statements" collection already exists');
      } else {
        throw error;
      }
    }

    // ===== INSERT SAMPLE DATA =====
    console.log('\n📝 Inserting sample data...');

    const teamsCollection = db.collection('teams');
    const psCollection = db.collection('problem_statements');

    // Sample teams
    const sampleTeams = [
      {
        leader_email: 'team1@college.edu',
        leader_password: 'password123',
        team_name: 'Team Alpha',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        leader_email: 'team2@college.edu',
        leader_password: 'password123',
        team_name: 'Team Beta',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        leader_email: 'team3@college.edu',
        leader_password: 'password123',
        team_name: 'Team Gamma',
        selected_ps: null,
        created_at: new Date(),
      },
    ];

    // Sample problem statements
    const samplePS = [
      {
        title: 'AI-Powered Healthcare Diagnostics',
        description: 'Build an AI system to diagnose diseases from medical images using deep learning.',
        domain: 'Healthcare & AI',
        expected_outcomes: [
          'Working ML model with 85%+ accuracy',
          'Web interface for image upload',
          'Detailed diagnostic report generation',
          'Real-time prediction API',
        ],
        key_constraints: [
          'Must use real medical datasets',
          'Model should train in <1 hour',
          'API response time <500ms',
          'Support for multiple image formats',
        ],
        created_at: new Date(),
      },
      {
        title: 'Smart City Traffic Management System',
        description: 'Create a real-time traffic management and optimization system using IoT and AI.',
        domain: 'Smart Cities & IoT',
        expected_outcomes: [
          'Real-time traffic monitoring dashboard',
          'Predictive traffic flow analysis',
          'Automated traffic signal optimization',
          'Mobile app for commuters',
        ],
        key_constraints: [
          'Handle 10,000+ concurrent users',
          'Real-time data processing < 100ms',
          'Integrate with existing traffic signals',
          'Weather-aware predictions',
        ],
        created_at: new Date(),
      },
      {
        title: 'Blockchain-Based Supply Chain Verification',
        description: 'Develop a blockchain solution to verify authenticity and track products in supply chains.',
        domain: 'Blockchain & Web3',
        expected_outcomes: [
          'Working blockchain implementation',
          'Smart contracts for verification',
          'Product tracking dashboard',
          'Mobile QR code scanner app',
        ],
        key_constraints: [
          'Transaction confirmation < 2 seconds',
          'Support for multiple products',
          'Tamper-proof verification',
          'Cost-effective implementation',
        ],
        created_at: new Date(),
      },
      {
        title: 'Personalized E-Learning Platform with Adaptive Learning',
        description: 'Build an AI-powered e-learning platform that adapts to individual student learning patterns.',
        domain: 'EdTech & AI',
        expected_outcomes: [
          'Adaptive learning algorithm',
          'Interactive course creation tools',
          'Progress tracking dashboard',
          'Certification system',
        ],
        key_constraints: [
          'Support 1000+ concurrent learners',
          'Personalization based on learning style',
          'Mobile-responsive design',
          'Content moderation system',
        ],
        created_at: new Date(),
      },
      {
        title: 'Sustainable Energy Optimization System',
        description: 'Create a system to optimize renewable energy distribution and consumption in smart grids.',
        domain: 'Green Energy & Sustainability',
        expected_outcomes: [
          'Energy distribution optimization model',
          'Real-time consumption monitoring',
          'Predictive maintenance alerts',
          'Carbon footprint calculator',
        ],
        key_constraints: [
          'Real-time processing < 50ms',
          'Integrate with multiple energy sources',
          'Weather-dependent predictions',
          'Scalable to city-wide systems',
        ],
        created_at: new Date(),
      },
    ];

    // Clear existing data and insert
    console.log('  Clearing existing data...');
    await teamsCollection.deleteMany({});
    await psCollection.deleteMany({});

    const teamResult = await teamsCollection.insertMany(sampleTeams);
    console.log(`✅ Inserted ${teamResult.insertedCount} sample teams`);

    const psResult = await psCollection.insertMany(samplePS);
    console.log(`✅ Inserted ${psResult.insertedCount} sample problem statements`);

    // ===== CREATE INDEXES =====
    console.log('\n🔍 Creating indexes...');

    // Index on leader_email for faster login queries
    await teamsCollection.createIndex({ leader_email: 1 }, { unique: true });
    console.log('✅ Created index on teams.leader_email');

    // Index on selected_ps for faster PS count queries
    await teamsCollection.createIndex({ selected_ps: 1 });
    console.log('✅ Created index on teams.selected_ps');

    // ===== SUMMARY =====
    console.log('\n' + '='.repeat(50));
    console.log('✅ MongoDB Setup Complete!');
    console.log('='.repeat(50));
    console.log('\n📋 Sample Login Credentials:');
    console.log('  Email: team1@college.edu');
    console.log('  Password: password123');
    console.log('\n📋 Also available:');
    console.log('  Email: team2@college.edu');
    console.log('  Email: team3@college.edu');
    console.log('  (All with password: password123)');
    console.log('\n📊 Database: ghrhack');
    console.log('  Collections: teams, problem_statements');
    console.log('\n🚀 Ready to test! Run: pnpm dev');
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Setup Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

setupMongoDB();
