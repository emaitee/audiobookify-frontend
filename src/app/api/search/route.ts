// File: app/api/search/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

interface SearchQuery {
    query: string;
    category: string;
    page: number;
    limit: number;
    minRating: number;
}

interface Book {
    id: string;
    title: string;
    author: string;
    rating: number;
    coverUrl: string;
    narrator: string;
    duration: string;
    categories: string[];
}

interface SearchResponse {
    books: Book[];
    total: number;
    hasMore: boolean;
}

export async function GET(request: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(request.url);
        const query: string = searchParams.get('query') || '';
        const category: string = searchParams.get('category') || '';
        const page: number = parseInt(searchParams.get('page') || '1');
        const limit: number = parseInt(searchParams.get('limit') || '10');
        const minRating: number = parseFloat(searchParams.get('minRating') || '0');
        
        // Calculate skip for pagination
        const skip: number = (page - 1) * limit;
        
        // Connect to database
        const db = await connectToDatabase();
        const booksCollection = db.collection('audiobooks');
        
        // Build search query
        const searchQuery: Record<string, any> = {
            $and: [
                {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { author: { $regex: query, $options: 'i' } },
                        { narrator: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                    ]
                },
                { rating: { $gte: minRating } }
            ]
        };
        
        // Add category filter if specified
        if (category) {
            searchQuery.$and.push({ categories: category });
        }
        
        // Execute search query
        const books = await booksCollection
            .find(searchQuery)
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
        
        // Get total count for pagination
        const totalCount: number = await booksCollection.countDocuments(searchQuery);
        const hasMore: boolean = totalCount > skip + books.length;
        
        // Map books to include only necessary fields
        const mappedBooks: Book[] = books.map((book: {
            _id: string;
            title: string;
            author: string;
            rating: number;
            coverUrl: string;
            narrator: string;
            duration: string;
            categories: string[];
        }): Book => ({
            id: book._id.toString(),
            title: book.title,
            author: book.author,
            rating: book.rating,
            coverUrl: book.coverUrl,
            narrator: book.narrator,
            duration: book.duration,
            categories: book.categories
        }));
        
        return NextResponse.json<SearchResponse>({
            books: mappedBooks,
            total: totalCount,
            hasMore
        });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Failed to search books' },
            { status: 500 }
        );
    }
}