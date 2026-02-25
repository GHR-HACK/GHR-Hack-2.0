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
      {
        title: 'Wearable IoT-Based Safety Monitoring System for Industrial Workers',
        description: 'Develop a wearable IoT-based safety monitoring system for industrial or construction workers that detects hazardous situations using motion, environmental, and physiological signals. The system should identify risks such as falls, fatigue, unsafe posture, or exposure to dangerous conditions.\nThe goal is preventive safety intelligence, not just emergency alerts.',
        domain: 'IoT',
        expected_outcomes: [
          'Real-time worker safety monitoring',
          'Fall or abnormal motion detection',
          'Environmental hazard alerts (heat, gas, etc.)',
          'Emergency notification system',
          'Safety analytics for workplace improvement',
        ],
        key_constraints: [
          'Must use lightweight wearable hardware',
          'Battery efficiency is critical',
          'False alarms must be minimized',
          'Personal data must remain secure and privacy-aware',
        ],
        created_at: new Date(),
      },
      {
        title: 'IoT Solution for Temperature-Sensitive Supply Chain Monitoring',
        description: 'Create an IoT solution to monitor temperature-sensitive supply chains such as medicines, vaccines, dairy, or food logistics. The system should track environmental conditions during storage and transportation and predict potential spoilage risks before they occur.\nThe platform must provide real-time alerts and maintain traceable logs across the supply chain.',
        domain: 'IoT',
        expected_outcomes: [
          'Continuous temperature and humidity monitoring',
          'Spoilage risk prediction alerts',
          'Location-aware shipment tracking',
          'Data logging for compliance verification',
          'Real-time notification system for operators',
        ],
        key_constraints: [
          'Must operate on battery-powered IoT devices',
          'Should support long-distance communication (LoRa/GSM/WiFi)',
          'Data loss during connectivity gaps must be minimized',
          'Sensors must remain accurate under transportation conditions',
        ],
        created_at: new Date(),
      },
      {
        title: 'Computer Vision Integration for Automated Delta Robot Operations',
        description: 'Design and develop an integrated computer vision system to automate object detection and handling for a Delta Robot used in industrial pick-and-place operations. The existing setup includes a Delta Robot equipped with a suction-based gripping mechanism operating alongside a moving conveyor belt.\nThe proposed solution should utilize camera-based vision technology to detect, identify, and track small objects moving in real time on the conveyor. The system must accurately determine object position and coordinate with the Delta Robot controller to enable precise automated picking and placement operations.\nThe goal is to enhance operational efficiency, reduce manual intervention, and improve accuracy in high-speed industrial automation environments.',
        domain: 'IoT',
        expected_outcomes: [
          'Real-time object detection and tracking on a moving conveyor belt',
          'Accurate identification and localization of small objects ranging from 5 mm to 20 mm in size',
          'Seamless communication between the vision system and Delta Robot controller',
          'Automated triggering of suction-based pick-and-place operations',
          'High positional accuracy suitable for industrial automation workflows',
          'Reliable performance under varying object positions and conveyor speeds',
        ],
        key_constraints: [
          'The system must operate in real time with minimal latency',
          'Detection accuracy must remain reliable for small-sized objects (5–20 mm)',
          'Integration must be compatible with existing Delta Robot hardware and control systems',
          'Solution should handle continuous conveyor motion without stopping operations',
          'Environmental variations such as lighting conditions must be considered',
          'The system must ensure safe and stable robotic execution during operation',
        ],
        created_at: new Date(),
      },
      {
        title: 'Unified Industry & Team Performance Management Platform',
        description: 'Industries and organizations often struggle with fragmented systems for project management, asset tracking, employee performance monitoring, and team collaboration. Data is scattered across spreadsheets, communication tools, ERP systems, and manual records, leading to inefficiencies, poor coordination, delayed decision-making, cost overruns, and reduced productivity.\nDesign a unified, web-based enterprise platform that centralizes project lifecycle management, asset utilization tracking, workforce performance analytics, and cross-team collaboration into a single intelligent ecosystem.\nThe system should not only manage tasks and resources but also provide advanced analytics such as milestone-based performance evaluation, productivity scoring, workload distribution analysis, risk forecasting, and resource optimization insights. The goal is to enable data-driven strategic planning and operational excellence across industries.',
        domain: 'Social Impact',
        expected_outcomes: [
          'Centralized dashboard for project planning with milestone-based task tracking and dependency mapping',
          'Dynamic Gantt-style project timeline visualization',
          'Asset management module (inventory tracking, allocation, maintenance lifecycle, utilization analytics)',
          'Employee performance analytics with KPI-based scoring and milestone achievement tracking',
          'Real-time collaboration tools (task assignment, activity logs, document sharing, communication threads)',
          'Workload balancing and productivity analysis dashboard',
          'Predictive analytics for deadline risk, project delays, and resource bottlenecks',
          'Customizable reports and data visualization for leadership decision-making',
          'Role-based access control with audit logging',
          'Scalable cloud-ready architecture for SMEs and large enterprises',
        ],
        key_constraints: [
          'Must ensure secure handling of organizational and employee data with encryption and access control',
          'Should support real-time updates with minimal latency across distributed teams',
          'Must provide granular role-based permissions and traceable audit trails',
          'Should maintain system scalability under increasing users and project load',
          'Analytics models must be explainable and transparent',
          'UI/UX must remain intuitive despite complex backend analytics',
          'Integration-ready architecture to connect with existing ERP/HRMS tools',
        ],
        created_at: new Date(),
      },
      {
        title: 'AI-Powered Decentralized Disaster Resource Allocation Engine',
        description: 'During large-scale disasters, resource allocation (medical supplies, food, rescue teams) is inefficient due to poor coordination and lack of real-time predictive logistics.\nDesign an AI-driven decentralized platform that predicts resource demand across regions, optimizes distribution routes, simulates disaster escalation scenarios, and uses blockchain for transparent resource tracking.',
        domain: 'Social Impact',
        expected_outcomes: [
          'Demand forecasting model',
          'Resource optimization engine',
          'Real-time logistics dashboard',
          'Transparent tracking system',
          'Disaster impact simulation',
        ],
        key_constraints: [
          'Must function in low-connectivity scenarios',
          'High reliability under crisis conditions',
          'Transparent and tamper-resistant records',
          'Interoperability with government systems',
        ],
        created_at: new Date(),
      },
      {
        title: 'Trustworthy Digital Information Verification for Rural Communities',
        description: 'Develop a platform that helps rural or low-digital-literacy populations verify the authenticity of online information such as government schemes, health advice, or financial messages received through messaging platforms.\nThe system should translate complex information into simplified, local-language explanations and flag misinformation risks using AI-assisted verification.',
        domain: 'Social Impact',
        expected_outcomes: [
          'Fake or misleading information detection',
          'Simplified explanations in regional languages',
          'Voice-based interaction for accessibility',
          'Verified information summaries from trusted sources',
          'Community reporting and validation mechanisms',
        ],
        key_constraints: [
          'Must function in low-bandwidth environments',
          'Interface should support non-text interactions (voice/audio)',
          'AI explanations must remain transparent',
          'System must avoid political or ideological bias',
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
