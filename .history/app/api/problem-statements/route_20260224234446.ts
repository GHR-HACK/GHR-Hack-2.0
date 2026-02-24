import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const psCollection = await getCollection('problem_statements');

    // Get all problem statements
    const problemStatements = await psCollection.find({}).sort({ created_at: 1 }).toArray();

    console.log(`✅ Retrieved ${problemStatements.length} problem statements`);

    // Convert MongoDB documents to frontend format
    const formatted = problemStatements.map((ps) => ({
      id: ps._id.toString(),
      title: ps.title,
      description: ps.description,
      domain: ps.domain,
      expected_outcomes: ps.expected_outcomes,
      key_constraints: ps.key_constraints,
      created_at: ps.created_at,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formatted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Get problem statements error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem statements' },
      { status: 500 }
    );
  }
}
