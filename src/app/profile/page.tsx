'use client'
import { BookOpen, Play } from "lucide-react";
import { continueListing, featuredBooks } from "../page";
import { useState } from "react";

const ProfileView = () => {
    const [activeTab, setActiveTab] = useState('overview');
    
    const userStats = {
      booksRead: 24,
      hoursListened: 138,
      currentStreak: 7,
      badges: 12
    };
    
    const recentActivity = [
      { id: 1, type: 'finished', book: 'The Hobbit', date: '2 days ago' },
      { id: 2, type: 'started', book: 'Dune', date: '5 days ago' },
      { id: 3, type: 'badge', name: 'Serial Listener', date: '1 week ago' },
      { id: 4, type: 'finished', book: 'Project Hail Mary', date: '2 weeks ago' },
    ];
    
    return (
      <div className="flex flex-col gap-6 pb-24 text-black">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
            JS
          </div>
          <div>
            <h2 className="text-xl font-bold">John Smith</h2>
            <p className="text-gray-600">Member since January 2025</p>
            <button className="text-blue-500 text-sm font-medium mt-1">Edit Profile</button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{userStats.booksRead}</h3>
            <p className="text-sm text-gray-600">Books Finished</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{userStats.hoursListened}</h3>
            <p className="text-sm text-gray-600">Hours Listened</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{userStats.currentStreak}</h3>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{userStats.badges}</h3>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
        </div>
        
        <div className="border-b flex">
          <button 
            className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'library' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('library')}
          >
            My Library
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'badges' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
        </div>
        
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <section>
              <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
              <div className="flex flex-col gap-3">
                {recentActivity.map(activity => (
                  <div key={activity._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {activity.type === 'finished' && <BookOpen size={18} />}
                      {activity.type === 'started' && <Play size={18} />}
                      {activity.type === 'badge' && <span className="text-xl">🏆</span>}
                    </div>
                    <div className="flex-1">
                      {activity.type === 'finished' && (
                        <p>Finished reading <span className="font-medium">{activity.book}</span></p>
                      )}
                      {activity.type === 'started' && (
                        <p>Started reading <span className="font-medium">{activity.book}</span></p>
                      )}
                      {activity.type === 'badge' && (
                        <p>Earned <span className="font-medium">{activity.name}</span> badge</p>
                      )}
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-3">Listening Goals</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Daily Goal</h4>
                  <span className="text-sm text-gray-600">30 min / day</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mb-1">
                  <div className="bg-blue-500 h-2 rounded-full w-2/3"></div>
                </div>
                <p className="text-sm text-gray-600">20 minutes today</p>
              </div>
            </section>
            
            <section>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Reading Habits</h3>
                <button className="text-sm text-blue-500">View Details</button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-4">
                  <div>
                    <h4 className="font-medium">Favorite Genre</h4>
                    <p className="text-sm">Science Fiction</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Peak Hours</h4>
                    <p className="text-sm">8-10 PM</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Avg. Session</h4>
                    <p className="text-sm">45 minutes</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Completion Rate</h4>
                    <p className="text-sm">83%</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
        
        {activeTab === 'library' && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm whitespace-nowrap">
                All Books
              </button>
              <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
                Currently Reading
              </button>
              <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
                Finished
              </button>
              <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
                Wishlist
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[...featuredBooks, ...continueListing].slice(0, 6).map(book => (
                <div key={book._id} className="flex flex-col">
                  <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-md" />
                  <h3 className="font-medium mt-2">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  {book.progress && (
                    <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                      <div 
                        className="bg-blue-500 h-1 rounded-full" 
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'badges' && (
          <div className="grid grid-cols-3 gap-4">
            {Array(12).fill(null).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center p-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${idx < 8 ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400'}`}>
                  {idx < 8 ? '🏆' : '🔒'}
                </div>
                <h4 className="text-sm font-medium text-center mt-2">
                  {idx === 0 && 'Bookworm'}
                  {idx === 1 && 'Night Owl'}
                  {idx === 2 && 'Speed Reader'}
                  {idx === 3 && 'Genre Master'}
                  {idx === 4 && 'Marathon'}
                  {idx === 5 && 'Early Bird'}
                  {idx === 6 && 'Serial Listener'}
                  {idx === 7 && 'Completionist'}
                  {idx === 8 && 'Explorer'}
                  {idx === 9 && 'Collector'}
                  {idx === 10 && 'Reviewer'}
                  {idx === 11 && 'Legend'}
                </h4>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default ProfileView