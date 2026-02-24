import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const teamsCollection = await getCollection('teams');
    const psCollection = await getCollection('problem_statements');

    // Get all problem statements
    const allPS = await psCollection.find({}).toArray();

    // For each PS, count how many teams selected it
    const counts: Record<string, number> = {};

    for (const ps of allPS) {
      const count = await teamsCollection.countDocuments({
        selected_ps: ps._id,
      });
      counts[ps._id.toString()] = count;
    }

    console.log('📊 PS Selection Counts:', counts);

    return NextResponse.json(
      {
        success: true,
        counts, // { "ps_id": team_count, "ps_id2": team_count, ... }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Get counts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PS counts' },
      { status: 500 }
    );
  }
}
