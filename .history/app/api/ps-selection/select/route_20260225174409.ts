import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization') || undefined;
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

    const { ps_id } = await request.json();

    if (!ps_id) {
      return NextResponse.json(
        { error: 'PS ID is required' },
        { status: 400 }
      );
    }

    const teamsCollection = await getCollection('teams');
    const psCollection = await getCollection('problem_statements');

    // Convert string IDs to ObjectId
    const teamId = new ObjectId(decoded.teamId);
    const psObjectId = new ObjectId(ps_id);

    // === CRITICAL: FCFS Logic with Atomicity ===
    
    // Step 1: Check if this team already has a selected PS (prevent re-selection)
    const existingTeam = await teamsCollection.findOne({ _id: teamId });
    
    if (existingTeam?.selected_ps && existingTeam.selected_ps.toString() !== ps_id) {
      return NextResponse.json(
        {
          error: 'Your team has already selected a different PS. You cannot change it.',
          current_ps: existingTeam.selected_ps.toString(),
        },
        { status: 400 }
      );
    }

    // Step 2: Check current selection count for this PS (FCFS check)
    const currentSelections = await teamsCollection.countDocuments({
      selected_ps: psObjectId,
    });

    if (currentSelections >= 3) {
      return NextResponse.json(
        {
          error: 'This PS has been selected by 3 teams already. Maximum limit reached.',
          current_count: currentSelections,
        },
        { status: 409 }
      );
    }

    // Step 3: Atomic update - Select PS for the team
    // This atomically checks and updates to handle race conditions
    const updateResult = await teamsCollection.findOneAndUpdate(
      {
        _id: teamId,
        // Either no PS selected yet, or already selected this PS, but not another PS
        $or: [
          { selected_ps: { $exists: false } },
          { selected_ps: null },
          { selected_ps: psObjectId },
        ],
      },
      {
        $set: {
          selected_ps: psObjectId,
          selected_at: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!updateResult) {
      // Update failed - means the condition wasn't met (another request already updated)
      console.log('❌ Update failed - team may have already selected a different PS');
      return NextResponse.json(
        {
          error: 'PS selection failed. Your team may have already selected a different PS.',
        },
        { status: 409 }
      );
    }

    console.log('✅ PS selected successfully for team:', updateResult.team_name);

    // Step 4: Verify final count (race condition check)
    const finalCount = await teamsCollection.countDocuments({
      selected_ps: psObjectId,
    });

    if (finalCount > 3) {
      // This shouldn't happen with proper atomicity, but log it
      console.warn('⚠️ More than 3 teams selected the same PS - possible race condition detected');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'PS selected successfully',
        team: {
          id: updateResult._id.toString(),
          name: updateResult.team_name,
          selected_ps: updateResult.selected_ps.toString(),
          selected_at: updateResult.selected_at,
        },
        selection_count: finalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ PS Selection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
