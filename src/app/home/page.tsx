'use client'
import React, { useState } from 'react'
import { continueListing, featuredBooks, recommendedBooks } from '../page';
import { Pause, Play } from 'lucide-react';


const HomeView = () => {
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
  )};

  export default HomeView