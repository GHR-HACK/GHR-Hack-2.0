import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://himanshu:Himanshu%4088@cluster0.lfmoyh1.mongodb.net/ghrhack?appName=Cluster0&retryWrites=true&w=majority';

console.log('🔗 Connecting to MongoDB...');
console.log('URI:', MONGODB_URI.substring(0, 50) + '...');

async function addTeams() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('ghrhack');
    const teamsCollection = db.collection('teams');

    // Clear existing teams
    console.log('\n🗑️  Clearing existing teams...');
    const deleteResult = await teamsCollection.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} old teams`);

    // New teams data
    const newTeams = [
      {
        team_name: 'Next_Gen_Rakshak',
        team_leader_name: 'Prakash Manohar Mali',
        leader_password: 'DVHU7899',
        leader_email: 'prakashmmali2@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'ARJUNA',
        team_leader_name: 'Jay Bhandarkar',
        leader_password: 'TGHR6574',
        leader_email: 'vbhandakar9@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Being Notified',
        team_leader_name: 'Harsh Patel',
        leader_password: 'VHRH9864',
        leader_email: '22f1001058@ds.study.iitm.ac.in',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'BinaryEXE',
        team_leader_name: 'Anant Rai',
        leader_password: 'CXDE2374',
        leader_email: 'anantrai0809@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'BitLazy',
        team_leader_name: 'Dnyanesh Mulay',
        leader_password: 'KAKU0222',
        leader_email: 'dnyanesh2442@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Codelanders',
        team_leader_name: 'Mayur Nikumbh',
        leader_password: 'MAYU0420',
        leader_email: 'mayurnikumbh2004@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'codingersCat',
        team_leader_name: 'Vicky Dsilva',
        leader_password: 'FKJR2430',
        leader_email: '0vickydsilva0@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'CtrlAltWin',
        team_leader_name: 'Ayush Yadav',
        leader_password: 'SKND9706',
        leader_email: 'ayush421301@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Dev Dominators',
        team_leader_name: 'Mrugesh',
        leader_password: 'SXFG8634',
        leader_email: 'patilmrugesh84@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'DevKo',
        team_leader_name: 'Prerana Pravin Bhoi',
        leader_password: 'SDKW5935',
        leader_email: 'preranabhoi32@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'EquiMind',
        team_leader_name: 'Saprem Satish Khot',
        leader_password: 'DCWG5084',
        leader_email: 'khotsaprem@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Goggins',
        team_leader_name: 'Arya Manoj Mishra',
        leader_password: 'TIUR4655',
        leader_email: 'aryamishra828@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'INNOV8',
        team_leader_name: 'Damini Dhananjay Deshmukh',
        leader_password: 'KSLI1265',
        leader_email: 'deshmukhdamini066@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Krypto_V',
        team_leader_name: 'Abhishek Kumavat',
        leader_password: 'DKJK8734',
        leader_email: 'abhishekkumavat443@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Logic Legion',
        team_leader_name: 'Atharva Sonar',
        leader_password: 'GRXN6130',
        leader_email: 'atharvasonar23@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Mango',
        team_leader_name: 'Shubham Sahu',
        leader_password: 'XKJX9456',
        leader_email: 'shubhamsahu60582@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Neon Genesis',
        team_leader_name: 'Atharva Jangale',
        leader_password: 'LDGR3689',
        leader_email: 'Atharvajangale778@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'OverClocked',
        team_leader_name: 'Pratik Kale',
        leader_password: 'VKHL6497',
        leader_email: 'Pratikkale7661@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Runtime Rebels',
        team_leader_name: 'Aditya Chavan',
        leader_password: 'IYCH4780',
        leader_email: 'adityapchavan0290@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Semi Colon Squad',
        team_leader_name: 'Kaveri Rajput',
        leader_password: 'YYEV4586',
        leader_email: 'kaverirajput77@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Spartans',
        team_leader_name: 'Kanhaiya Bagul',
        leader_password: 'DFGI1358',
        leader_email: 'bagulkanhaiya60@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Team-Vibeyz',
        team_leader_name: 'Thomas Justin Roy',
        leader_password: 'ALED3740',
        leader_email: 'justinroy9702@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Tech Experts',
        team_leader_name: 'Yashshri Rajendra Gangurde',
        leader_password: 'SKRV4523',
        leader_email: 'yashshri.raisoni.cse@ghrcemj.raisoni.net',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'TechMates',
        team_leader_name: 'Hitesh Jitendra Badgujar',
        leader_password: 'DWMX8553',
        leader_email: 'badgujarhitesh1501@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'TechXplorers',
        team_leader_name: 'Atharva Malve',
        leader_password: 'ROUI7627',
        leader_email: 'atharvamalve21@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'TwinBytes',
        team_leader_name: 'Sarthak Gunjal',
        leader_password: 'SGPM0143',
        leader_email: 'sarthakgunjal04@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Zenith',
        team_leader_name: 'Pranav Raut',
        leader_password: 'SDIS2245',
        leader_email: 'pranav05raut@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'ZerothLayer',
        team_leader_name: 'Dipak Dhangar',
        leader_password: 'VYXF2343',
        leader_email: 'dhangardip09@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'NOVA',
        team_leader_name: 'Sakshi Ahirrao',
        leader_password: 'SKVX3859',
        leader_email: 'Sakshiahirrao17@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'stack forge',
        team_leader_name: 'Ninad Gavhale',
        leader_password: 'NUNI6969',
        leader_email: 'ninadgavhale96@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Pretty Dangerous',
        team_leader_name: 'Sayali Bharat Jadhav',
        leader_password: 'EFHR2476',
        leader_email: 'sayalijadhav162005@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Continuum',
        team_leader_name: 'Suraj Jayram Sahare',
        leader_password: 'EIUG5485',
        leader_email: 'suraj6re@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Sudo',
        team_leader_name: 'Omkar Dolhare',
        leader_password: 'DARU0420',
        leader_email: 'dolhare.omkar@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Git coders',
        team_leader_name: 'Nishant Sanjay Borude',
        leader_password: 'WFEU9386',
        leader_email: 'nishantborude555@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'TechNova',
        team_leader_name: 'Hema N M',
        leader_password: 'DOCN1355',
        leader_email: 'hemanm.cse2024@citchennai.net',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'ThinkBaby',
        team_leader_name: 'Gaurav Singh',
        leader_password: 'EVIR4875',
        leader_email: 'gs1197418@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Tech Titans',
        team_leader_name: 'Mayur Gaikwad',
        leader_password: 'MGVB7345',
        leader_email: 'mayurapple20@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'The 4Bytes',
        team_leader_name: 'Jay Atul Patil',
        leader_password: 'CEYI7673',
        leader_email: 'jaypatil8609@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
      {
        team_name: 'Epic_Failure',
        team_leader_name: 'Vishal Devidas Raut',
        leader_password: 'WUEX3681',
        leader_email: 'Vishalraut.contact@gmail.com',
        selected_ps: null,
        created_at: new Date(),
      },
    ];

    // Insert new teams
    console.log('\n📝 Inserting new teams...');
    const insertResult = await teamsCollection.insertMany(newTeams);
    console.log(`✅ Inserted ${insertResult.insertedCount} teams`);
    console.log(`✅ Team IDs: ${Object.values(insertResult.insertedIds).join(', ')}`);

    console.log('\n✅ All teams added successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

addTeams();
