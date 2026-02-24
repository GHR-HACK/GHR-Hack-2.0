import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const teamsCollection = await getCollection('teams');
    const teamId = new ObjectId(decoded.teamId);

    // Get team data
    const team = await teamsCollection.findOne({ _id: teamId });

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        team: {
          id: team._id.toString(),
          name: team.team_name,
          leader_email: team.leader_email,
          selected_ps: team.selected_ps ? team.selected_ps.toString() : null,
          selected_at: team.selected_at || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Get team profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
