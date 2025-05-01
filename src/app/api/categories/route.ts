// // File: app/api/categories/route.js
// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/db';

// export async function GET() {
//   try {
//     // Connect to database
//     const db = await connectToDatabase();
//     const booksCollection = db.collection('books');
    
//     // Aggregate to count books per category
//     const categoryCounts = await booksCollection
//       .aggregate([
//         { $unwind: '$categories' },
//         { $group: { _id: '$categories', count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $project: { _id: 0, name: '$_id', count: 1 } }
//       ])
//       .toArray();
    
//     return NextResponse.json({ categories: categoryCounts });
//   } catch (error) {
//     console.error('Categories API error:', error);
    
//     // Return default categories in case of error
//     return NextResponse.json({
//       categories: [
//         { name: "Fiction", count: 12345 },
//         { name: "Non-Fiction", count: 8765 },
//         { name: "Mystery & Thriller", count: 3456 },
//         { name: "Fantasy", count: 2345 },
//         { name: "Romance", count: 4321 },
//         { name: "Biography", count: 2345 }
//       ]
//     });
//   }
// }