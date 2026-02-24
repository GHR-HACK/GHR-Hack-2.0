import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { generateToken } from '@/lib/jwt';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get teams collection
    const teamsCollection = await getCollection('teams');

    // Find team by leader email
    const team = await teamsCollection.findOne({ leader_email: email });

    if (!team) {
      console.log('❌ Team not found for email:', email);
      const allTeams = await teamsCollection.find({}).project({ leader_email: 1 }).toArray();
      console.log('📋 Available teams:', allTeams.map(t => t.leader_email));
      return NextResponse.json(
        { error: 'Team leader not found' },
        { status: 401 }
      );
    }

    console.log('✅ Team found:', { team_name: team.team_name, stored_password: team.leader_password });

    // Verify password (simple comparison - in production use bcrypt)
    // TODO: In production, use bcrypt for hashing
    if (team.leader_password !== password) {
      console.log('❌ Password mismatch:', { provided: password, stored: team.leader_password });
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    console.log('✅ Password matched! Generating token...');

    // Generate JWT token
    const token = generateToken({
      userId: team._id.toString(),
      email: team.leader_email,
      teamId: team._id.toString(),
    });

    // Return token and basic team info
    return NextResponse.json(
      {
        success: true,
        token,
        team: {
          id: team._id.toString(),
          name: team.team_name,
          leader_email: team.leader_email,
          selected_ps: team.selected_ps || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
