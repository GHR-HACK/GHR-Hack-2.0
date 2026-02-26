import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const teamsCollection = await getCollection('teams');
    const psCollection = await getCollection('problem_statements');

    // Fetch all teams
    const teams = await teamsCollection.find({}).toArray();

    // Get all unique PS IDs from teams
    const psIds = teams
      .filter(team => team.selected_ps)
      .map(team => team.selected_ps);

    // Fetch problem statements for selected PSs
    const problemStatements = await psCollection
      .find({ id: { $in: psIds } })
      .toArray();

    // Create a map of PS id to title
    const psMap = new Map(
      problemStatements.map(ps => [ps.id, ps.title])
    );

    // Map teams with PS titles
    const teamsWithPS = teams.map(team => ({
      id: team._id.toString(),
      team_name: team.team_name,
      team_leader_name: team.team_leader_name || '',
      leader_email: team.leader_email,
      selected_ps: team.selected_ps,
      selected_ps_title: team.selected_ps ? psMap.get(team.selected_ps) || 'Not Found' : 'Not Selected',
      created_at: team.created_at,
    }));

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
