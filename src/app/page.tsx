'use client'
import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

export const featuredBooks = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtmKvVXY7v2epRmCPTFdvEmfNH8158b-XX0A&s", progress: 65 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn5xkKB1ByJI59VpGEBBkkFRN0_FJ9COkr2g&s", progress: 23 },
  { id: 3, title: "1984", author: "George Orwell", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKF1ay8V0kUQ9dxj25l1plHNYcIzX80ThxLg&s", progress: 45 },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen", cover: "https://cdn.kobo.com/book-images/1a735d96-6075-4bca-87b7-15fb97ee50c7/1200/1200/False/pride-and-prejudice-216.jpg", progress: 12 },
];

export const continueListing = [
  { id: 5, title: "Dune", author: "Frank Herbert", cover: "https://cdn.kobo.com/book-images/2bd0e164-5c02-4e40-a43a-17d2fd5451b7/1200/1200/False/dune-2.jpg", progress: 78, remainingTime: "3h 24m" },
  { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9RoFW1jhDShbA1xYmG05GkgzUGzaEhsNeA&s", progress: 30, remainingTime: "6h 12m" },
];

export const recommendedBooks = [
  { id: 7, title: "Brave New World", author: "Aldous Huxley", cover: "https://cdn.kobo.com/book-images/6f07a0e9-8ca8-4b28-982c-7898ac591744/1200/1200/False/brave-new-world-79.jpg" },
  { id: 8, title: "The Catcher in the Rye", author: "J.D. Salinger", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVdPsvFMMqa0HJGRWfEcfcxDQ4v3XJ1VcPRA&s" },
  { id: 9, title: "Lord of the Flies", author: "William Golding", cover: "https://m.media-amazon.com/images/I/716MU3GOvJL._SL1200_.jpg" },
];

export default function AudiobookApp() {
  const [isPlaying,setIsPlaying]=useState(false)

  return (
      <div className="flex flex-col gap-8 pb-24 text-black">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Continue Listening</h2>
            <button className="text-blue-500 text-sm">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {continueListing.map(book => (
              <div key={book.id} className="flex-shrink-0 w-64 bg-gray-100 rounded-lg overflow-hidden">
                <div className="relative">
                  <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="w-full bg-gray-600 h-1 rounded-full">
                      <div 
                        className="bg-blue-500 h-1 rounded-full" 
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{book.remainingTime} left</span>
                    <button 
                      className="bg-blue-500 text-white rounded-full p-2"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Featured Audiobooks</h2>
            <button className="text-blue-500 text-sm">More</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredBooks.map(book => (
              <div key={book.id} className="relative group">
                <img src={book.cover} alt={book.title} className="w-full h-64 object-cover rounded-lg shadow-md group-hover:opacity-90 transition" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-lg">
                  <h3 className="text-white font-medium">{book.title}</h3>
                  <p className="text-white/80 text-sm">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recommended For You</h2>
            <button className="text-blue-500 text-sm">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recommendedBooks.map(book => (
              <div key={book.id} className="flex-shrink-0 w-48">
                <img src={book.cover} alt={book.title} className="w-full h-56 object-cover rounded-lg shadow-md mb-2" />
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    )

  



  

  



  

}
