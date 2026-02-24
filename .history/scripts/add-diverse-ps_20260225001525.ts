import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || '';

async function addMorePS() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('ghrhack');
    const psCollection = db.collection('problem_statements');

    // 10 diverse domains with sample problem statements
    const newProblemStatements = [
      {
        title: 'Real-Time Cybersecurity Threat Detection',
        description: 'Build an AI-powered system to detect and respond to cybersecurity threats in real-time.',
        domain: 'Cybersecurity',
        expected_outcomes: [
          'Real-time threat detection dashboard',
          'Automated response protocols',
          'Threat intelligence integration',
          'Anomaly detection using ML',
        ],
        key_constraints: [
          'Detection latency < 50ms',
          'False positive rate < 5%',
          'Handle 100K+ events per second',
          'Compliance with security standards',
        ],
        created_at: new Date(),
      },
      {
        title: 'AR/VR Virtual Shopping Experience',
        description: 'Create an immersive AR/VR application for virtual shopping and product visualization.',
        domain: 'AR/VR',
        expected_outcomes: [
          'Cross-platform AR/VR application',
          '3D product visualization',
          'Virtual try-on feature',
          'Payment integration',
        ],
        key_constraints: [
          'Frame rate > 60 FPS',
          'Support mobile AR devices',
          'Product catalog of 500+ items',
          'Network-optimized 3D models',
        ],
        created_at: new Date(),
      },
      {
        title: 'Quantum-Resistant Encryption System',
        description: 'Develop a quantum-resistant encryption protocol for secure data transmission.',
        domain: 'Quantum Computing',
        expected_outcomes: [
          'Post-quantum cryptography implementation',
          'Key exchange protocol',
          'Performance benchmarking',
          'Integration with existing systems',
        ],
        key_constraints: [
          'Resistant to quantum attacks',
          'Encryption speed < 10ms per MB',
          'Compatible with TLS/SSL',
          'Minimal computational overhead',
        ],
        created_at: new Date(),
      },
      {
        title: 'Smart Agriculture IoT Solution',
        description: 'Create an IoT-based precision agriculture system for crop monitoring and automation.',
        domain: 'Agriculture Tech',
        expected_outcomes: [
          'Sensor network for soil and weather',
          'Automated irrigation control',
          'Crop health monitoring with AI',
          'Mobile dashboard for farmers',
        ],
        key_constraints: [
          'Battery life > 6 months',
          'Work in low-connectivity areas',
          'Cost per sensor < $50',
          'Weather-resistant hardware',
        ],
        created_at: new Date(),
      },
      {
        title: 'AI-Powered Mental Health Chatbot',
        description: 'Build a conversational AI chatbot for mental health support and counseling.',
        domain: 'Mental Health Tech',
        expected_outcomes: [
          'Natural language conversation',
          'Emotion detection and sentiment analysis',
          'Crisis intervention protocols',
          'Privacy-compliant data handling',
        ],
        key_constraints: [
          'Response time < 2 seconds',
          'HIPAA compliant',
          'Multi-language support',
          'Available 24/7',
        ],
        created_at: new Date(),
      },
      {
        title: 'Decentralized Content Distribution Network',
        description: 'Design a blockchain-based CDN for decentralized content distribution.',
        domain: 'Web3 & Blockchain',
        expected_outcomes: [
          'Peer-to-peer content delivery',
          'Smart contract for payments',
          'Content verification system',
          'Performance metrics dashboard',
        ],
        key_constraints: [
          'Content delivery speed competitive with traditional CDNs',
          'Incentive mechanism for node operators',
          'Handle 10TB+ of content',
          'DDoS resistant architecture',
        ],
        created_at: new Date(),
      },
      {
        title: 'Automated Code Review System',
        description: 'Develop an AI system to automatically review code for bugs, security issues, and best practices.',
        domain: 'DevOps & AI',
        expected_outcomes: [
          'Multi-language code analysis',
          'Automated bug detection',
          'Security vulnerability scanning',
          'CI/CD integration',
        ],
        key_constraints: [
          'Support top 10 programming languages',
          'Analysis time < 5 minutes per PR',
          'Accuracy > 90%',
          'GitHub/GitLab integration',
        ],
        created_at: new Date(),
      },
      {
        title: 'Real-Time Language Translation Earbuds',
        description: 'Build software for real-time speech translation for wearable devices.',
        domain: 'Wearables & AI',
        expected_outcomes: [
          'Real-time speech-to-speech translation',
          'Support 20+ languages',
          'Low-latency processing',
          'Offline mode for common phrases',
        ],
        key_constraints: [
          'Translation latency < 1 second',
          'Battery efficient algorithms',
          'Noise cancellation integration',
          'Accuracy > 85%',
        ],
        created_at: new Date(),
      },
      {
        title: 'Autonomous Drone Delivery System',
        description: 'Create an autonomous navigation system for package delivery drones.',
        domain: 'Robotics & Drones',
        expected_outcomes: [
          'Autonomous flight path planning',
          'Obstacle detection and avoidance',
          'Package drop-off mechanism',
          'Fleet management dashboard',
        ],
        key_constraints: [
          'Flight range > 10 km',
          'Payload capacity 2-5 kg',
          'Weather-adaptive routing',
          'Compliance with aviation regulations',
        ],
        created_at: new Date(),
      },
      {
        title: 'Personalized Learning Platform with Gamification',
        description: 'Build an adaptive learning platform with game mechanics to engage students.',
        domain: 'EdTech & Gamification',
        expected_outcomes: [
          'Adaptive learning paths',
          'Gamification elements (badges, leaderboards)',
          'Progress tracking and analytics',
          'Multi-subject content library',
        ],
        key_constraints: [
          'Support 1000+ concurrent users',
          'Personalization using ML',
          'Mobile and web platforms',
          'Accessibility standards compliance',
        ],
        created_at: new Date(),
      },
    ];

    console.log(`\n📝 Adding ${newProblemStatements.length} new problem statements...`);
    
    const result = await psCollection.insertMany(newProblemStatements);
    console.log(`✅ Inserted ${result.insertedCount} new problem statements`);

    // Show all domains
    const allPS = await psCollection.find({}).toArray();
    const domains = new Set(allPS.map(ps => ps.domain));
    
    console.log('\n📊 All Domains in Database:');
    domains.forEach((domain, index) => {
      const count = allPS.filter(ps => ps.domain === domain).length;
      console.log(`  ${index + 1}. ${domain} (${count} PS)`);
    });

    console.log(`\n✅ Total PS in database: ${allPS.length}`);
    console.log('🎉 Now you have 10 diverse domains to test with!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

addMorePS();
