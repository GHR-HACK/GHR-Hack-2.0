import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const teamsCollection = await getCollection('teams');
    const psCollection = await getCollection('problem_statements');

    // Fetch all teams
    const teams = await teamsCollection.find({}).toArray();

    // Get all unique PS IDs from teams (convert to ObjectId)
    const psIds = teams
      .filter(team => team.selected_ps)
      .map(team => {
        try {
          return new ObjectId(team.selected_ps);
        } catch {
          return null;
        }
      })
      .filter(id => id !== null);

    // Fetch problem statements for selected PSs using _id
    const problemStatements = await psCollection
      .find({ _id: { $in: psIds } })
      .toArray();

    // Create a map of PS _id.toString() to title
    const psMap = new Map(
      problemStatements.map(ps => [ps._id.toString(), ps.title])
    );

    console.log(`✅ Found ${problemStatements.length} problem statements for ${psIds.length} team selections`);

    // Map teams with PS titles
    const teamsWithPS = teams.map(team => {
      const selectedPsId = team.selected_ps ? team.selected_ps.toString() : null;
      return {
        id: team._id.toString(),
        team_name: team.team_name,
        team_leader_name: team.team_leader_name || '',
        leader_email: team.leader_email,
        selected_ps: selectedPsId,
        selected_ps_title: selectedPsId ? psMap.get(selectedPsId) || 'Not Found' : 'Not Selected',
        created_at: team.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      count: teamsWithPS.length,
      data: teamsWithPS,
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
