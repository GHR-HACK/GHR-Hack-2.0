import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://himanshu:Himanshu%4088@cluster0.lfmoyh1.mongodb.net/ghrhack?appName=Cluster0&retryWrites=true&w=majority';

console.log('🔗 Connecting to MongoDB...');
console.log('URI:', MONGODB_URI.substring(0, 50) + '...');

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
        title: 'AI-Based Civil Drawing Analysis & Automated Construction Estimation System',
        description: 'In the construction industry, extracting critical information from civil drawings (architectural, structural, and MEP plans) is a time-consuming and error-prone process. Engineers manually analyze drawings to estimate quantities, plan project phases, allocate resources, and define construction timelines. This often leads to delays, cost overruns, and inefficiencies due to inaccurate interpretation or missed details.\nDesign an AI-powered system that can automatically analyze civil engineering drawings and extract key construction parameters such as dimensions, materials, structural components, and activity sequences. Based on these extracted insights, the system should generate:\nQuantity take-offs (materials and resources required)\nCost estimation (optional but encouraged)\nPhase-wise construction breakdown\nAutomated project timeline and scheduling (Gantt-style output)\nThe solution should assist engineers, contractors, and project managers in making faster and more accurate construction planning decisions.',
        domain: 'AI/ML',
        expected_outcomes: [
          'Automated extraction of key entities from 2D civil drawings (walls, columns, beams, slabs, dimensions, annotations)',
          'AI-driven quantity estimation and material calculation',
          'Intelligent construction activity sequencing',
          'Timeline generation with phase-wise duration estimation',
          'Visual dashboard for cost and schedule insights',
          'Exportable reports (PDF/Excel/Project format)',
        ],
        key_constraints: [
          'Must handle both scanned and CAD-based drawings',
          'Should work without requiring highly specialized hardware',
          'Must account for variations in drawing standards and symbols',
          'Output estimations should be explainable and auditable',
          'Should minimize manual intervention in the estimation process',
        ],
        created_at: new Date(),
      },
      {
        title: 'AI-Based Traffic De-Congestion System Using Real-Time Video Analytics',
        description: 'Conventional traffic signal systems rely on fixed timing mechanisms that fail to adapt to real-time traffic conditions, resulting in congestion, fuel wastage, and delays.\nDevelop a machine learning system that analyzes live CCTV or camera feeds from intersections or campus entry points to dynamically adjust traffic signal timings based on actual vehicle density and flow patterns. The system should optimize traffic movement while ensuring fairness across all directions.',
        domain: 'AI/ML',
        expected_outcomes: [
          'Real-time vehicle detection and density estimation',
          'Adaptive traffic signal timing decisions',
          'Reduction in congestion and idle time',
          'Visual dashboards for monitoring traffic flow',
        ],
        key_constraints: [
          'The system should work with existing camera infrastructure',
          'Real-time inference and low-latency decision-making are required',
        ],
        created_at: new Date(),
      },
      {
        title: 'Explainable AI System for High-Stakes Decision-Making',
        description: 'AI systems are increasingly used in critical domains such as education, hiring, and finance, yet many operate as black boxes, limiting trust and accountability.\nDevelop an AI system that not only makes predictions or recommendations but also provides clear, human-understandable explanations for its decisions. The system should allow stakeholders to understand, audit, and challenge AI-driven outcomes.',
        domain: 'AI/ML',
        expected_outcomes: [
          'Transparent and interpretable AI predictions',
          'Visual or textual explanations of decision logic',
          'Bias detection and fairness indicators',
          'Improved trust and accountability in AI systems',
        ],
        key_constraints: [
          'Explanations must be meaningful to non-expert users',
          'The system should balance accuracy with interpretability',
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
