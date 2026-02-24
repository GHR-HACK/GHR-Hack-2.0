import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { generateToken } from '@/lib/jwt';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
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
      return NextResponse.json(
        { error: 'Team leader not found' },
        { status: 401 }
      );
    }

    // Verify password (simple comparison - in production use bcrypt)
    // TODO: In production, use bcrypt for hashing
    if (team.leader_password !== password) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

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
