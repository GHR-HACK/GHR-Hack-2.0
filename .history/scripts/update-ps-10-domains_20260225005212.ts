import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env file');
}

// 10 domains from hackathonThemes in lib/data.ts - 2 PS per domain = 20 total
const problemStatements = [
  // 1. EdTech Evolution
  {
    domain: "EdTech Evolution",
    title: "AI-Powered Personalized Learning Platform",
    description: "Build an intelligent learning platform that adapts to each student's learning pace, style, and preferences. The system should analyze student performance, identify knowledge gaps, and recommend personalized learning paths with interactive content.",
    expected_outcomes: [
      "Adaptive learning algorithms implemented with ML models",
      "Real-time progress tracking dashboard with analytics",
      "Personalized content recommendation engine",
      "Interactive assessment system with instant feedback"
    ],
    key_constraints: [
      "Must support at least 100 concurrent users",
      "Response time under 2 seconds for recommendations",
      "Mobile-responsive design required",
      "SCORM/LTI compliance for content integration"
    ]
  },
  {
    domain: "EdTech Evolution",
    title: "Virtual Classroom Collaboration Tool",
    description: "Design a collaborative virtual classroom environment that enhances remote learning. Include features like real-time whiteboard, breakout rooms, peer-to-peer learning, and gamification elements to increase student engagement.",
    expected_outcomes: [
      "Real-time collaboration workspace with video/audio",
      "Breakout room functionality for group discussions",
      "Interactive digital whiteboard with drawing tools",
      "Gamification system with points and badges"
    ],
    key_constraints: [
      "Low latency video/audio streaming (< 200ms)",
      "Support for 50+ participants per classroom",
      "Cross-platform compatibility (Web, iOS, Android)",
      "Screen sharing and recording capabilities"
    ]
  },
  
  // 2. Web3/Blockchain
  {
    domain: "Web3/Blockchain",
    title: "Decentralized Credential Verification System",
    description: "Create a blockchain-based system for issuing and verifying educational certificates, professional credentials, and achievements. Ensure tamper-proof records that can be instantly verified by employers and institutions.",
    expected_outcomes: [
      "Smart contract for automated certificate issuance",
      "QR code verification with blockchain validation",
      "Immutable credential storage on distributed ledger",
      "Multi-institution integration API"
    ],
    key_constraints: [
      "Must use Ethereum or Polygon network",
      "Gas-efficient smart contracts (< $0.50 per transaction)",
      "GDPR compliance for personal data storage",
      "Support for multiple credential types (degrees, certifications, badges)"
    ]
  },
  {
    domain: "Web3/Blockchain",
    title: "NFT-Based Digital Asset Marketplace",
    description: "Develop a decentralized marketplace for trading digital assets as NFTs. Support for artists, creators, and collectors with features like royalty distribution, auction mechanisms, and secure wallet integration.",
    expected_outcomes: [
      "NFT minting functionality with metadata storage",
      "Trading marketplace with search and discovery",
      "Automated royalty distribution to creators",
      "Auction and bidding system with time-based mechanics"
    ],
    key_constraints: [
      "ERC-721 or ERC-1155 standard compliance",
      "Metamask/WalletConnect integration required",
      "IPFS for decentralized metadata storage",
      "Support for multiple blockchain networks"
    ]
  },
  
  // 3. AI and ML
  {
    domain: "AI and ML",
    title: "AI-Based Civil Drawing Analysis System",
    description: "Develop an AI system that analyzes civil engineering drawings to extract key construction parameters, generate quantity estimates, and create automated project timelines. Help engineers make faster planning decisions.",
    expected_outcomes: [
      "Automated entity extraction from 2D CAD drawings",
      "Quantity and material estimation with 95%+ accuracy",
      "Activity sequencing based on construction best practices",
      "Gantt chart timeline generation"
    ],
    key_constraints: [
      "Support PDF, DWG, and DXF file formats",
      "Computer vision model with 90%+ accuracy",
      "Processing time under 5 minutes for standard drawings",
      "Integration with project management tools"
    ]
  },
  {
    domain: "AI and ML",
    title: "Predictive Maintenance System for Industrial Equipment",
    description: "Create an ML-powered system that predicts equipment failures before they occur. Analyze sensor data, historical maintenance records, and operational patterns to optimize maintenance schedules and reduce downtime.",
    expected_outcomes: [
      "Real-time sensor data ingestion and processing",
      "Failure prediction models with 85%+ accuracy",
      "Optimized maintenance scheduling algorithm",
      "Dashboard with alerts and actionable insights"
    ],
    key_constraints: [
      "Support for IoT sensor protocols (MQTT, HTTP, CoAP)",
      "Prediction lead time of at least 7 days",
      "Scalable to handle 1000+ sensors",
      "Historical data analysis for at least 2 years"
    ]
  },
  
  // 4. AR/VR Realities
  {
    domain: "AR/VR Realities",
    title: "Virtual Campus Tour and Navigation System",
    description: "Build an immersive VR application for virtual campus tours. Include interactive elements, 360-degree views, and AR-based navigation helpers for new students and visitors to explore campus facilities.",
    expected_outcomes: [
      "360-degree virtual tours of campus buildings",
      "AR navigation overlay using mobile camera",
      "Interactive hotspots with multimedia content",
      "Multi-platform support (VR headsets, mobile, web)"
    ],
    key_constraints: [
      "Frame rate of 60 FPS for smooth VR experience",
      "Works on Oculus Quest, HTC Vive, or similar headsets",
      "AR works on iOS (ARKit) and Android (ARCore)",
      "Offline mode for downloaded campus areas"
    ]
  },
  {
    domain: "AR/VR Realities",
    title: "AR-Based Training Simulator for Technical Skills",
    description: "Design an augmented reality training platform for technical skills like machinery operation, medical procedures, or laboratory experiments. Provide hands-on practice in a safe, virtual environment.",
    expected_outcomes: [
      "3D object recognition and tracking in real-world space",
      "Step-by-step guided tutorials with voice instructions",
      "Performance assessment and scoring system",
      "Multi-user collaboration for team training"
    ],
    key_constraints: [
      "Tracking accuracy within 1cm for precision tasks",
      "Support for at least 3 concurrent AR users",
      "Works with AR glasses (Hololens, Magic Leap) or tablets",
      "Comprehensive safety protocols and warnings"
    ]
  },
  
  // 5. HealthTech
  {
    domain: "HealthTech",
    title: "AI-Powered Medical Diagnosis Assistant",
    description: "Develop an AI system that assists doctors in diagnosing diseases from medical images (X-rays, MRIs, CT scans). Use deep learning models to detect anomalies and provide diagnostic suggestions with confidence scores.",
    expected_outcomes: [
      "Medical image analysis with 90%+ sensitivity",
      "Disease detection for common conditions (pneumonia, fractures, tumors)",
      "Confidence scoring with explainable AI visualizations",
      "DICOM format support and PACS integration"
    ],
    key_constraints: [
      "FDA/CE marking compliance path defined",
      "HIPAA-compliant data handling and storage",
      "Trained on diverse, validated medical datasets",
      "Prediction time under 30 seconds per image"
    ]
  },
  {
    domain: "HealthTech",
    title: "Remote Patient Monitoring Platform",
    description: "Create a telemedicine platform for remote patient monitoring. Track vital signs, medication adherence, and symptoms. Enable video consultations and automated alerts for critical health changes.",
    expected_outcomes: [
      "IoT device integration for vital signs (BP, pulse, glucose)",
      "Real-time monitoring dashboard for healthcare providers",
      "Video consultation with scheduling and recording",
      "Automated alerts for abnormal readings"
    ],
    key_constraints: [
      "HIPAA-compliant end-to-end encryption",
      "Support for FDA-approved medical devices",
      "99.9% uptime for critical monitoring",
      "Mobile apps for patients (iOS and Android)"
    ]
  },
  
  // 6. Cyber security
  {
    domain: "Cyber security",
    title: "Real-time Network Threat Detection System",
    description: "Build an AI-powered cybersecurity system that monitors network traffic in real-time to detect and prevent security threats. Identify anomalies, potential attacks, and vulnerabilities with automated response mechanisms.",
    expected_outcomes: [
      "Real-time packet analysis and traffic monitoring",
      "ML-based anomaly detection with low false positives (<5%)",
      "Threat classification (DDoS, malware, intrusion, etc.)",
      "Automated incident response and alerting"
    ],
    key_constraints: [
      "Process 10Gbps+ network traffic in real-time",
      "Detection latency under 100ms",
      "Integration with SIEM tools (Splunk, ELK)",
      "Support for IPv4 and IPv6"
    ]
  },
  {
    domain: "Cyber security",
    title: "Secure Multi-Factor Authentication System",
    description: "Design a robust multi-factor authentication system using biometrics, behavioral analysis, and token-based verification. Ensure user-friendly experience while maintaining high security standards.",
    expected_outcomes: [
      "Biometric authentication (fingerprint, face, voice)",
      "Behavioral analysis (typing patterns, mouse movement)",
      "Time-based one-time password (TOTP) support",
      "Adaptive risk assessment for authentication levels"
    ],
    key_constraints: [
      "Authentication time under 5 seconds",
      "False rejection rate < 0.1%",
      "FIDO2/WebAuthn standard compliance",
      "Works offline for biometric authentication"
    ]
  },
  
  // 7. Agritech
  {
    domain: "Agritech",
    title: "Smart Crop Disease Detection and Management",
    description: "Develop a mobile application that uses computer vision to identify crop diseases from leaf images. Provide treatment recommendations, track disease spread, and connect farmers with agricultural experts.",
    expected_outcomes: [
      "Image-based disease detection for 20+ common crop diseases",
      "Treatment recommendations with pesticide/organic options",
      "Disease spread tracking with geolocation mapping",
      "Expert consultation via chat or video call"
    ],
    key_constraints: [
      "Works offline for image analysis (edge AI)",
      "Accuracy > 90% for trained crop types",
      "Support for multiple languages (regional)",
      "Low-cost implementation for rural farmers"
    ]
  },
  {
    domain: "Agritech",
    title: "IoT-Based Precision Farming System",
    description: "Create an IoT solution for precision agriculture that monitors soil moisture, temperature, humidity, and crop health. Automate irrigation and provide data-driven insights for optimal crop yield.",
    expected_outcomes: [
      "Sensor network for soil and environmental monitoring",
      "Automated irrigation control based on real-time data",
      "Real-time monitoring dashboard (web and mobile)",
      "Predictive analytics for yield optimization"
    ],
    key_constraints: [
      "Battery life of sensors > 6 months",
      "Communication range up to 2km (LoRaWAN/NB-IoT)",
      "Weather-resistant sensor hardware",
      "Cost under $500 for 1-acre coverage"
    ]
  },
  
  // 8. Social Impact
  {
    domain: "Social Impact",
    title: "Community Resource Sharing Platform",
    description: "Build a platform that connects people in communities to share resources like tools, skills, food, and transportation. Include features for scheduling, ratings, and trust building to foster community collaboration.",
    expected_outcomes: [
      "Resource listing with search and filters",
      "Booking and scheduling system with calendar",
      "Trust and rating system for users and resources",
      "Community forums for discussions and events"
    ],
    key_constraints: [
      "Mobile-first responsive design",
      "Geolocation-based resource discovery",
      "Secure messaging between users",
      "Support for resource categories (tools, skills, food, transport)"
    ]
  },
  {
    domain: "Social Impact",
    title: "Disaster Relief Coordination System",
    description: "Design a real-time coordination platform for disaster relief efforts. Connect volunteers, NGOs, and affected communities. Track resources, coordinate rescue operations, and provide emergency information.",
    expected_outcomes: [
      "Real-time location tracking for volunteers and resources",
      "Resource inventory management with allocation",
      "Volunteer coordination with task assignment",
      "Emergency broadcast system (SMS, push notifications)"
    ],
    key_constraints: [
      "Works in low-connectivity scenarios (offline-first)",
      "SMS fallback for areas without internet",
      "Multi-language support for international disasters",
      "Integration with government emergency systems"
    ]
  },
  
  // 9. Fintech
  {
    domain: "Fintech",
    title: "AI-Powered Personal Finance Manager",
    description: "Create an intelligent personal finance application that analyzes spending patterns, provides budget recommendations, and helps users achieve financial goals. Include features for expense tracking, bill reminders, and investment suggestions.",
    expected_outcomes: [
      "Automated expense categorization from bank statements",
      "Budget optimization with AI-driven suggestions",
      "Financial goal tracking with progress visualization",
      "Investment recommendations based on risk profile"
    ],
    key_constraints: [
      "Bank account integration via secure APIs (Plaid, Yodlee)",
      "End-to-end encryption for financial data",
      "PCI DSS compliance if handling card information",
      "iOS and Android mobile apps required"
    ]
  },
  {
    domain: "Fintech",
    title: "Micro-lending Platform for Small Businesses",
    description: "Develop a peer-to-peer lending platform that connects small business owners with individual lenders. Use AI-based credit scoring that considers alternative data sources for assessing creditworthiness.",
    expected_outcomes: [
      "Alternative credit scoring using business data, social media, transactions",
      "Loan matching algorithm connecting borrowers and lenders",
      "Secure payment processing with escrow mechanism",
      "Risk assessment dashboard for lenders"
    ],
    key_constraints: [
      "Compliance with local lending regulations",
      "KYC/AML verification for all users",
      "Loan default rate tracking and insurance options",
      "Support for multiple currencies"
    ]
  },
  
  // 10. IoT
  {
    domain: "IoT",
    title: "Smart Campus Energy Management System",
    description: "Design an IoT-based energy management solution for educational campuses. Monitor and optimize electricity consumption across buildings, automate lighting and HVAC systems, and provide sustainability insights.",
    expected_outcomes: [
      "Real-time energy monitoring per building/room",
      "Automated control of lighting and HVAC based on occupancy",
      "Predictive energy analytics for consumption forecasting",
      "Sustainability reporting with carbon footprint calculation"
    ],
    key_constraints: [
      "Integration with existing building management systems (BACnet, Modbus)",
      "Energy savings of at least 20% demonstrated",
      "Scalable to 50+ buildings",
      "Real-time dashboard with historical data analysis"
    ]
  },
  {
    domain: "IoT",
    title: "Connected Vehicle Fleet Management System",
    description: "Build an IoT platform for managing vehicle fleets. Track real-time location, monitor vehicle health, optimize routes, and predict maintenance needs. Include driver behavior analysis and fuel efficiency metrics.",
    expected_outcomes: [
      "GPS tracking with geofencing and route history",
      "Vehicle diagnostics via OBD-II integration",
      "Route optimization algorithm for fuel efficiency",
      "Driver behavior analytics (speed, braking, idling)"
    ],
    key_constraints: [
      "Real-time updates every 30 seconds",
      "Support for 500+ vehicles simultaneously",
      "Mobile app for drivers (trip logs, alerts)",
      "Integration with fuel card systems for cost tracking"
    ]
  }
];

async function updateProblemStatements() {
  const client = new MongoClient(MONGODB_URI!);

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
    domains.sort().forEach((domain, index) => {
      console.log(`   ${index + 1}. ${domain}`);
    });

    // Count problem statements per domain
    console.log('\n📈 Problem Statements per domain:');
    for (const domain of domains.sort()) {
      const count = await psCollection.countDocuments({ domain });
      console.log(`   ${domain}: ${count} PS`);
    }

    // Verify data structure
    const sample = await psCollection.findOne({});
    console.log('\n📝 Sample PS structure:');
    console.log(`   Fields: ${Object.keys(sample || {}).join(', ')}`);

    console.log('\n✅ Database updated successfully with 10 domains and correct structure!');
    console.log('   - All PS have: domain, title, description, expected_outcomes, key_constraints');

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
