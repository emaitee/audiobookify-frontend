// File: app/api/search/trending/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    // Connect to database
    const db = await connectToDatabase();
    const searchesCollection = db.collection('searches');
    
    // Get trending searches from last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const trendingSearches = await searchesCollection
      .aggregate([
        { $match: { timestamp: { $gte: oneWeekAgo } } },
        { $group: { _id: '$query', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, query: '$_id', count: 1 } }
      ])
      .toArray();
    
    // Extract just the search terms
    interface TrendingSearch {
      query: string;
      count: number;
    }

    const trends: string[] = trendingSearches.map((item: TrendingSearch) => item.query);
    
    // If no trending searches found, return default list
    if (trends.length === 0) {
      return NextResponse.json({
        trends: [
          "Best fantasy series",
          "New releases this week",
          "Award winning audiobooks",
          "Best narrators"
        ]
      });
    }
    
    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Trending searches API error:', error);
    
    // Return default list in case of error
    return NextResponse.json({
      trends: [
        "Best fantasy series",
        "New releases this week",
        "Award winning audiobooks",
        "Best narrators"
      ]
    });
  }
}

// Add a POST endpoint to record search queries
interface PostRequestBody {
    query: string;
}

interface PostResponseSuccess {
    success: boolean;
}

interface PostResponseError {
    error: string;
}

export async function POST(request: Request): Promise<Response> {
    try {
        const { query }: PostRequestBody = await request.json();
        
        if (!query || typeof query !== 'string') {
            return NextResponse.json<PostResponseError>(
                { error: 'Invalid search query' },
                { status: 400 }
            );
        }
        
        // Connect to database
        const db = await connectToDatabase();
        const searchesCollection = db.collection('searches');
        
        // Record the search query
        await searchesCollection.insertOne({
            query,
            timestamp: new Date(),
            // Optional: Add user ID if authenticated
            // userId: request.auth?.userId 
        });
        
        return NextResponse.json<PostResponseSuccess>({ success: true });
    } catch (error) {
        console.error('Record search API error:', error);
        return NextResponse.json<PostResponseError>(
            { error: 'Failed to record search' },
            { status: 500 }
        );
    }
}