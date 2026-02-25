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
        title: 'Cognitive Skill Gap Detection & Future Career Simulation Platform',
        description: 'Design an intelligent platform that continuously analyzes a learner\'s cognitive abilities — such as problem-solving, critical thinking, collaboration, and adaptability — through real learning interactions instead of exams. The system should simulate future career scenarios (developer, analyst, designer, entrepreneur, etc.) and dynamically identify skill gaps required for real-world roles.\nTraditional education evaluates memory, not readiness for future jobs. The platform must shift learning evaluation from marks to capability forecasting.',
        domain: 'EdTech & AI',
        expected_outcomes: [
          'Real-time cognitive skill profiling of learners',
          'AI-generated career simulations based on industry workflows',
          'Identification of hidden skill gaps beyond academic scores',
          'Personalized learning interventions aligned with career readiness',
          'Visualization of learner growth trajectory over time',
        ],
        key_constraints: [
          'Must not rely solely on quizzes or exams for assessment',
          'Skill evaluation logic must be explainable and bias-aware',
          'Career simulations must use real-world workflow structures',
          'System should function across multiple academic disciplines',
        ],
        created_at: new Date(),
      },
      {
        title: 'Collaborative Intelligence Learning Platform (Human + AI + Peer Reasoning)',
        description: 'Design a learning environment where learners solve problems collaboratively with peers and AI agents, where the AI acts as a facilitator rather than a solution provider. The system should measure collaborative reasoning, discussion quality, and knowledge construction.\nFocus shifts from individual answers → collective intelligence building.',
        domain: 'EdTech & AI',
        expected_outcomes: [
          'AI moderation of learning discussions',
          'Measurement of reasoning contribution quality',
          'Peer learning effectiveness analytics',
          'Structured collaborative problem-solving workflows',
          'Enhanced conceptual understanding through dialogue',
        ],
        key_constraints: [
          'AI must guide discussions without giving final answers',
          'Contribution evaluation must remain fair and unbiased',
          'Collaboration metrics must be explainable',
          'Platform should prevent spam or low-quality participation',
        ],
        created_at: new Date(),
      },
      {
        title: 'AI-Based Learning Fatigue and Dropout Prediction System',
        description: 'Online education platforms struggle to identify student disengagement and burnout before it leads to poor academic performance or dropout. Traditional engagement metrics are reactive and insufficient.\nDevelop an AI-driven system that analyzes non-intrusive behavioral signals during online learning to detect cognitive overload, fatigue, and disengagement at an early stage. The system should dynamically adapt content delivery and provide timely alerts to educators or mentors to enable early intervention.',
        domain: 'EdTech & AI',
        expected_outcomes: [
          'Early prediction of learner disengagement or burnout',
          'Real-time adaptation of content pacing and format',
          'Explainable indicators highlighting reasons for disengagement',
          'Actionable insights for instructors or academic support teams',
        ],
        key_constraints: [
          'No invasive surveillance or privacy-violating techniques',
          'Predictions must be interpretable and ethically designed',
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
