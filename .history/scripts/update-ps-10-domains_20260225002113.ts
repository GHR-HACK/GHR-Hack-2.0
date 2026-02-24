import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env file');
}

// 10 domains from hackathonThemes in lib/data.ts
const problemStatements = [
  // 1. EdTech Evolution
  {
    ps_id: "PS001",
    domain: "EdTech Evolution",
    title: "AI-Powered Personalized Learning Platform",
    description: "Build an intelligent learning platform that adapts to each student's learning pace, style, and preferences. The system should analyze student performance, identify knowledge gaps, and recommend personalized learning paths with interactive content.",
    key_features: [
      "Adaptive learning algorithms",
      "Real-time progress tracking",
      "Personalized content recommendations",
      "Interactive assessments and quizzes"
    ]
  },
  {
    ps_id: "PS002",
    domain: "EdTech Evolution",
    title: "Virtual Classroom Collaboration Tool",
    description: "Design a collaborative virtual classroom environment that enhances remote learning. Include features like real-time whiteboard, breakout rooms, peer-to-peer learning, and gamification elements to increase student engagement.",
    key_features: [
      "Real-time collaboration tools",
      "Breakout rooms for group work",
      "Interactive whiteboard",
      "Gamification and rewards system"
    ]
  },
  
  // 2. Web3/Blockchain
  {
    ps_id: "PS003",
    domain: "Web3/Blockchain",
    title: "Decentralized Credential Verification System",
    description: "Create a blockchain-based system for issuing and verifying educational certificates, professional credentials, and achievements. Ensure tamper-proof records that can be instantly verified by employers and institutions.",
    key_features: [
      "Smart contract-based certificate issuance",
      "QR code verification",
      "Immutable credential storage",
      "Multi-institution support"
    ]
  },
  {
    ps_id: "PS004",
    domain: "Web3/Blockchain",
    title: "NFT-Based Digital Asset Marketplace",
    description: "Develop a decentralized marketplace for trading digital assets as NFTs. Support for artists, creators, and collectors with features like royalty distribution, auction mechanisms, and secure wallet integration.",
    key_features: [
      "NFT minting and trading",
      "Smart contract royalties",
      "Wallet integration",
      "Auction and bidding system"
    ]
  },
  
  // 3. AI and ML
  {
    ps_id: "PS005",
    domain: "AI and ML",
    title: "AI-Based Civil Drawing Analysis System",
    description: "Develop an AI system that analyzes civil engineering drawings to extract key construction parameters, generate quantity estimates, and create automated project timelines. Help engineers make faster planning decisions.",
    key_features: [
      "Automated entity extraction from 2D drawings",
      "Quantity and material estimation",
      "Activity sequencing",
      "Timeline generation"
    ]
  },
  {
    ps_id: "PS006",
    domain: "AI and ML",
    title: "Predictive Maintenance System for Industrial Equipment",
    description: "Create an ML-powered system that predicts equipment failures before they occur. Analyze sensor data, historical maintenance records, and operational patterns to optimize maintenance schedules and reduce downtime.",
    key_features: [
      "Real-time sensor data analysis",
      "Failure prediction models",
      "Maintenance scheduling",
      "Dashboard with insights and alerts"
    ]
  },
  
  // 4. AR/VR Realities
  {
    ps_id: "PS007",
    domain: "AR/VR Realities",
    title: "Virtual Campus Tour and Navigation System",
    description: "Build an immersive VR application for virtual campus tours. Include interactive elements, 360-degree views, and AR-based navigation helpers for new students and visitors to explore campus facilities.",
    key_features: [
      "360-degree virtual tours",
      "AR navigation overlay",
      "Interactive hotspots",
      "Multi-platform support"
    ]
  },
  {
    ps_id: "PS008",
    domain: "AR/VR Realities",
    title: "AR-Based Training Simulator for Technical Skills",
    description: "Design an augmented reality training platform for technical skills like machinery operation, medical procedures, or laboratory experiments. Provide hands-on practice in a safe, virtual environment.",
    key_features: [
      "3D object recognition and tracking",
      "Step-by-step guided tutorials",
      "Performance assessment",
      "Multi-user collaboration"
    ]
  },
  
  // 5. HealthTech
  {
    ps_id: "PS009",
    domain: "HealthTech",
    title: "AI-Powered Medical Diagnosis Assistant",
    description: "Develop an AI system that assists doctors in diagnosing diseases from medical images (X-rays, MRIs, CT scans). Use deep learning models to detect anomalies and provide diagnostic suggestions with confidence scores.",
    key_features: [
      "Medical image analysis",
      "Disease detection algorithms",
      "Confidence scoring",
      "Integration with hospital systems"
    ]
  },
  {
    ps_id: "PS010",
    domain: "HealthTech",
    title: "Remote Patient Monitoring Platform",
    description: "Create a telemedicine platform for remote patient monitoring. Track vital signs, medication adherence, and symptoms. Enable video consultations and automated alerts for critical health changes.",
    key_features: [
      "IoT device integration",
      "Real-time vital signs monitoring",
      "Video consultation",
      "Automated health alerts"
    ]
  },
  
  // 6. Cyber security
  {
    ps_id: "PS011",
    domain: "Cyber security",
    title: "Real-time Network Threat Detection System",
    description: "Build an AI-powered cybersecurity system that monitors network traffic in real-time to detect and prevent security threats. Identify anomalies, potential attacks, and vulnerabilities with automated response mechanisms.",
    key_features: [
      "Real-time traffic analysis",
      "Anomaly detection",
      "Threat classification",
      "Automated incident response"
    ]
  },
  {
    ps_id: "PS012",
    domain: "Cyber security",
    title: "Secure Multi-Factor Authentication System",
    description: "Design a robust multi-factor authentication system using biometrics, behavioral analysis, and token-based verification. Ensure user-friendly experience while maintaining high security standards.",
    key_features: [
      "Biometric authentication",
      "Behavioral analysis",
      "Token-based verification",
      "Adaptive risk assessment"
    ]
  },
  
  // 7. Agritech
  {
    ps_id: "PS013",
    domain: "Agritech",
    title: "Smart Crop Disease Detection and Management",
    description: "Develop a mobile application that uses computer vision to identify crop diseases from leaf images. Provide treatment recommendations, track disease spread, and connect farmers with agricultural experts.",
    key_features: [
      "Image-based disease detection",
      "Treatment recommendations",
      "Disease tracking and mapping",
      "Expert consultation"
    ]
  },
  {
    ps_id: "PS014",
    domain: "Agritech",
    title: "IoT-Based Precision Farming System",
    description: "Create an IoT solution for precision agriculture that monitors soil moisture, temperature, humidity, and crop health. Automate irrigation and provide data-driven insights for optimal crop yield.",
    key_features: [
      "Sensor network deployment",
      "Automated irrigation control",
      "Real-time monitoring dashboard",
      "Predictive analytics for yield optimization"
    ]
  },
  
  // 8. Social Impact
  {
    ps_id: "PS015",
    domain: "Social Impact",
    title: "Community Resource Sharing Platform",
    description: "Build a platform that connects people in communities to share resources like tools, skills, food, and transportation. Include features for scheduling, ratings, and trust building to foster community collaboration.",
    key_features: [
      "Resource listing and discovery",
      "Booking and scheduling",
      "Trust and rating system",
      "Community forums"
    ]
  },
  {
    ps_id: "PS016",
    domain: "Social Impact",
    title: "Disaster Relief Coordination System",
    description: "Design a real-time coordination platform for disaster relief efforts. Connect volunteers, NGOs, and affected communities. Track resources, coordinate rescue operations, and provide emergency information.",
    key_features: [
      "Real-time location tracking",
      "Resource inventory management",
      "Volunteer coordination",
      "Emergency broadcast system"
    ]
  },
  
  // 9. Fintech
  {
    ps_id: "PS017",
    domain: "Fintech",
    title: "AI-Powered Personal Finance Manager",
    description: "Create an intelligent personal finance application that analyzes spending patterns, provides budget recommendations, and helps users achieve financial goals. Include features for expense tracking, bill reminders, and investment suggestions.",
    key_features: [
      "Automated expense categorization",
      "Budget optimization",
      "Financial goal tracking",
      "Investment recommendations"
    ]
  },
  {
    ps_id: "PS018",
    domain: "Fintech",
    title: "Micro-lending Platform for Small Businesses",
    description: "Develop a peer-to-peer lending platform that connects small business owners with individual lenders. Use AI-based credit scoring that considers alternative data sources for assessing creditworthiness.",
    key_features: [
      "Alternative credit scoring",
      "Loan matching algorithm",
      "Secure payment processing",
      "Risk assessment dashboard"
    ]
  },
  
  // 10. IoT
  {
    ps_id: "PS019",
    domain: "IoT",
    title: "Smart Campus Energy Management System",
    description: "Design an IoT-based energy management solution for educational campuses. Monitor and optimize electricity consumption across buildings, automate lighting and HVAC systems, and provide sustainability insights.",
    key_features: [
      "Real-time energy monitoring",
      "Automated control systems",
      "Predictive energy analytics",
      "Sustainability reporting"
    ]
  },
  {
    ps_id: "PS020",
    domain: "IoT",
    title: "Connected Vehicle Fleet Management System",
    description: "Build an IoT platform for managing vehicle fleets. Track real-time location, monitor vehicle health, optimize routes, and predict maintenance needs. Include driver behavior analysis and fuel efficiency metrics.",
    key_features: [
      "GPS tracking and geofencing",
      "Vehicle diagnostics",
      "Route optimization",
      "Driver behavior analytics"
    ]
  }
];

async function updateProblemStatements() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('ghrhack');
    const psCollection = db.collection('problem_statements');

    // Delete all existing problem statements
    const deleteResult = await psCollection.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing problem statements`);

    // Insert new problem statements (2 per domain = 20 total)
    const insertResult = await psCollection.insertMany(problemStatements);
    console.log(`✅ Inserted ${insertResult.insertedCount} new problem statements`);

    // Get unique domains to verify
    const domains = await psCollection.distinct('domain');
    console.log(`\n📊 Domains in database (${domains.length}):`);
    domains.forEach((domain, index) => {
      console.log(`   ${index + 1}. ${domain}`);
    });

    // Count problem statements per domain
    console.log('\n📈 Problem Statements per domain:');
    for (const domain of domains) {
      const count = await psCollection.countDocuments({ domain });
      console.log(`   ${domain}: ${count} PS`);
    }

    console.log('\n✅ Database updated successfully with 10 domains!');

  } catch (error) {
    console.error('❌ Error updating database:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
updateProblemStatements();
