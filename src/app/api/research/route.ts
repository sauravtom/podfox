import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { query, numResults = 5 } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const response = await exa.searchAndContents(query, {
      type: 'neural',
      numResults,
      highlights: true,
    });

    const parsedResults = response.results.map((result, idx) => ({
      id: idx,
      title: result.title,
      url: result.url,
      highlights: result.highlights || [],
      content: (result as any).text?.substring(0, 500) || ''
    }));

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: parsedResults,
        totalResults: response.results.length
      }
    });

  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform research' },
      { status: 500 }
    );
  }
} 