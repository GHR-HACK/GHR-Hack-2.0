import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
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

    const { github_repo } = await request.json();

    if (!github_repo || !github_repo.includes('github.com')) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL' },
        { status: 400 }
      );
    }

    const teamsCollection = await getCollection('teams');
    const teamId = new ObjectId(decoded.teamId);

    // Update team's GitHub repository
    const result = await teamsCollection.updateOne(
      { _id: teamId },
      {
        $set: {
          github_repo,
          updated_at: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Get updated team data
    const team = await teamsCollection.findOne({ _id: teamId });

    return NextResponse.json(
      {
        success: true,
        message: 'GitHub repository updated successfully',
        team: {
          id: team?._id.toString(),
          name: team?.team_name,
          leader_email: team?.leader_email,
          github_repo: team?.github_repo,
          updated_at: team?.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating GitHub repository:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
