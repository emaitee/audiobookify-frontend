// app/profile/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { UserCircle2, Book, Heart, Clock, Edit2, Save, X, Upload, LogOut } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';


type ProfileHistoryBook = { audiobook: { title: string } | string; progress: number; lastListened: Date }

export default function ProfilePage() {
  const { profile, loading, error, updateProfile, addToLibrary, removeFromLibrary, addToFavorites, removeFromFavorites } = useProfile();
  const { allBooks } = usePlayer()
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    profilePicture: File | undefined;
  }>({
    name: "",
    email: "",
    profilePicture: undefined
  });
  const [activeTab, setActiveTab] = useState('library');
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        profilePicture: undefined
      });
    }
  }, [profile]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
      <p>Error: {error}</p>
    </div>
  );

  if (!profile) return (
    <div className="flex items-center justify-center h-screen">
      <p>Please log in to view your profile</p>
    </div>
  );

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setPreviewUrl("");
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPreviewUrl("");
    setFormData({
      name: profile.name,
      email: profile.email,
      profilePicture: undefined
    });
  };

  const handleLogout = () => {
    logout && logout();
  };

  interface RemoveFromLibraryParams {
    bookId: string;
  }

  const handleRemoveFromLibrary = async (bookId: RemoveFromLibraryParams['bookId']): Promise<void> => {
    try {
      await removeFromLibrary(bookId);
    } catch (err) {
      console.error('Failed to remove from library:', err);
    }
  };

  interface ToggleFavoriteParams {
    bookId: string;
  }

  const handleToggleFavorite = async (bookId: ToggleFavoriteParams['bookId']): Promise<void> => {
    try {
      if (profile.favorites.includes(bookId)) {
        await removeFromFavorites(bookId);
      } else {
        await addToFavorites(bookId);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto md:p-4 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="md:flex">
          <div className="md:shrink-0 p-6 flex items-center justify-center">
            <div className="relative">
              {(profile.profilePicture || previewUrl) ? (
                <img 
                  src={previewUrl || profile.profilePicture} 
                  alt={profile.name} 
                  className="h-32 w-32 rounded-full object-cover border-2 border-indigo-100"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserCircle2 size={64} className="text-indigo-500" />
                </div>
              )}
              
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <label htmlFor="profilePicture" className="cursor-pointer bg-indigo-500 rounded-full p-2 text-white hover:bg-indigo-600">
                    <Upload size={16} />
                    <input 
                      type="file" 
                      id="profilePicture" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-8 w-full">
            {isEditing ? (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 flex items-center"
                  >
                    <X size={16} className="mr-1" /> Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <Save size={16} className="mr-1" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    <p className="text-gray-600">{profile.email}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Book size={16} className="mr-1" />
                        <span>{profile.library.length} books in library</span>
                      </div>
                      <div className="flex items-center">
                        <Heart size={16} className="mr-1" />
                        <span>{profile.favorites.length} favorites</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-full flex items-center"
                  >
                    <Edit2 size={16} className="mr-1" /> Edit
                  </button>
                </div>
                <div className="mt-4 flex">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:text-red-800 text-sm"
                  >
                    <LogOut size={16} className="mr-1" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('library')}
            className={`${
              activeTab === 'library' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Book size={18} className="mr-2" /> My Library
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`${
              activeTab === 'favorites' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Heart size={18} className="mr-2" /> Favorites
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Clock size={18} className="mr-2" /> Recently Played
          </button>
        </nav>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        {activeTab === 'library' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.library.length > 0 ? (
              profile.library.map(id => {
                // In production, you'd get these details from your API
                const book = allBooks.find(a => a._id === id)
                
                return (
                  <div key={id} className="flex flex-col">

                    <div className="relative h-56 bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <img 
                        src={book?.coverImage} 
                        alt={book?.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button 
                          onClick={() => handleToggleFavorite(id)}
                          className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
                        >
                          <Heart 
                            size={16} 
                            className={profile.favorites.includes(id) ? "text-red-500 fill-red-500" : "text-gray-400"}
                          />
                        </button>
                        <button 
                          onClick={() => handleRemoveFromLibrary(id)}
                          className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{book?.title}</h3>
                    <p className="text-xs text-gray-500">{book?.author}</p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-500">
                Your library is empty. Add audiobooks to get started!
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.favorites.length > 0 ? (
              profile.favorites.map(id => {
                // In production, you'd get these details from your API
                const book = allBooks.find(a => a._id === id)
                
                return (
                  <div key={id} className="flex flex-col">
                    <div className="relative h-56 bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <img 
                        src={book?.coverImage} 
                        alt={book?.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={() => handleToggleFavorite(id)}
                          className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
                        >
                          <Heart size={16} className="text-red-500 fill-red-500" />
                        </button>
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{book?.title}</h3>
                    <p className="text-xs text-gray-500">{book?.author}</p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-500">
                You haven't favorited any audiobooks yet.
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {profile.history.length > 0 ? (
              profile.history.map((item:ProfileHistoryBook, index) => {
                // Format date display
                const today = new Date();
                const lastListened = new Date(item.lastListened);
                const diffTime = Math.abs(today.getTime() - lastListened.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let timeDisplay;
                if (diffDays === 0) {
                  timeDisplay = 'Today';
                } else if (diffDays === 1) {
                  timeDisplay = 'Yesterday';
                } else if (diffDays < 7) {
                  timeDisplay = `${diffDays} days ago`;
                } else {
                  timeDisplay = lastListened.toLocaleDateString();
                }
                
                // In a real implementation, you'd likely have book objects
                // For now we'll just use the audiobook string directly
                const title = typeof item.audiobook === 'string' 
                  ? item.audiobook
                  : typeof item.audiobook === 'object' && 'title' in item.audiobook 
                    ? item.audiobook.title 
                    : 'Unknown Book';
                
                return (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center">
                      <div className="h-16 w-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-4">
                        <img 
                          src="/api/placeholder/48/72" 
                          alt={title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                        <div className="mt-1 relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div 
                              style={{ width: `${item.progress * 100}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{Math.round(item.progress * 100)}% complete</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {timeDisplay}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                You haven't played any audiobooks yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// export default function ProfilePage() {
//   const { user, logout } = useAuth();
//   const { 
//     profile, 
//     loading, 
//     error,
//     updateProfile,
//     addToLibrary,
//     removeFromLibrary,
//     addToFavorites,
//     removeFromFavorites
//   } = useProfile();
  
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     name: profile?.name || '',
//     email: profile?.email || '',
//     profilePicture: null as File | null
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData(prev => ({ ...prev, profilePicture: e.target.files![0] }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await updateProfile({
//         name: formData.name,
//         email: formData.email,
//         profilePicture: formData.profilePicture || undefined
//       });
//       setEditMode(false);
//     } catch (err) {
//       console.error('Failed to update profile:', err);
//     }
//   };

//   if (loading && !profile) {
//     return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Profile Picture */}
//           <div className="flex-shrink-0">
//             {editMode ? (
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Profile Picture
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                 />
//               </div>
//             ) : (
//               <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
//                 {profile?.profilePicture ? (
//                   <img 
//                     src={profile.profilePicture} 
//                     alt="Profile" 
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
//                     {profile?.name.charAt(0).toUpperCase()}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Profile Info */}
//           <div className="flex-grow">
//             {editMode ? (
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     required
//                   />
//                 </div>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     required
//                   />
//                 </div>
                
//                 <div className="flex gap-2">
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setEditMode(false)}
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <>
//                 <h1 className="text-2xl font-bold text-gray-800 mb-1">{profile?.name}</h1>
//                 <p className="text-gray-600 mb-4">{profile?.email}</p>
                
//                 <div className="flex gap-2 mb-6">
//                   <button
//                     onClick={() => {
//                       setFormData({
//                         name: profile?.name || '',
//                         email: profile?.email || '',
//                         profilePicture: null
//                       });
//                       setEditMode(true);
//                     }}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Edit Profile
//                   </button>
//                   <button
//                     onClick={logout}
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                   >
//                     Logout
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h2 className="text-lg font-semibold mb-2">Library</h2>
//                     {profile?.library?.length ? (
//                       <ul className="space-y-2">
//                         {profile.library.map(bookId => (
//                           <li key={bookId} className="flex justify-between items-center">
//                             <span className="truncate">Book ID: {bookId}</span>
//                             <button 
//                               onClick={() => removeFromLibrary(bookId)}
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               Remove
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-500">Your library is empty</p>
//                     )}
//                   </div>
                  
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h2 className="text-lg font-semibold mb-2">Favorites</h2>
//                     {profile?.favorites?.length ? (
//                       <ul className="space-y-2">
//                         {profile.favorites.map(bookId => (
//                           <li key={bookId} className="flex justify-between items-center">
//                             <span className="truncate">Book ID: {bookId}</span>
//                             <button 
//                               onClick={() => removeFromFavorites(bookId)}
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               Remove
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-500">No favorites yet</p>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client'
// import { BookOpen, Play } from "lucide-react";
// import { continueListing, featuredBooks } from "../page";
// import { useState } from "react";

// const ProfileView = () => {
//     const [activeTab, setActiveTab] = useState('overview');
    
//     const userStats = {
//       booksRead: 24,
//       hoursListened: 138,
//       currentStreak: 7,
//       badges: 12
//     };
    
//     const recentActivity = [
//       { id: 1, type: 'finished', book: 'The Hobbit', date: '2 days ago' },
//       { id: 2, type: 'started', book: 'Dune', date: '5 days ago' },
//       { id: 3, type: 'badge', name: 'Serial Listener', date: '1 week ago' },
//       { id: 4, type: 'finished', book: 'Project Hail Mary', date: '2 weeks ago' },
//     ];
    
//     return (
//       <div className="flex flex-col gap-6 pb-24 text-black">
//         <div className="flex items-center gap-4">
//           <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
//             JS
//           </div>
//           <div>
//             <h2 className="text-xl font-bold">John Smith</h2>
//             <p className="text-gray-600">Member since January 2025</p>
//             <button className="text-indigo-500 text-sm font-medium mt-1">Edit Profile</button>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-2 gap-3">
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <h3 className="text-2xl font-bold">{userStats.booksRead}</h3>
//             <p className="text-sm text-gray-600">Books Finished</p>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <h3 className="text-2xl font-bold">{userStats.hoursListened}</h3>
//             <p className="text-sm text-gray-600">Hours Listened</p>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <h3 className="text-2xl font-bold">{userStats.currentStreak}</h3>
//             <p className="text-sm text-gray-600">Day Streak</p>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <h3 className="text-2xl font-bold">{userStats.badges}</h3>
//             <p className="text-sm text-gray-600">Badges Earned</p>
//           </div>
//         </div>
        
//         <div className="border-b flex">
//           <button 
//             className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-indigo-500 text-indigo-500' : 'text-gray-600'}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//           <button 
//             className={`px-4 py-2 ${activeTab === 'library' ? 'border-b-2 border-indigo-500 text-indigo-500' : 'text-gray-600'}`}
//             onClick={() => setActiveTab('library')}
//           >
//             My Library
//           </button>
//           <button 
//             className={`px-4 py-2 ${activeTab === 'badges' ? 'border-b-2 border-indigo-500 text-indigo-500' : 'text-gray-600'}`}
//             onClick={() => setActiveTab('badges')}
//           >
//             Badges
//           </button>
//         </div>
        
//         {activeTab === 'overview' && (
//           <div className="flex flex-col gap-6">
//             <section>
//               <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
//               <div className="flex flex-col gap-3">
//                 {recentActivity.map(activity => (
//                   <div key={activity._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                       {activity.type === 'finished' && <BookOpen size={18} />}
//                       {activity.type === 'started' && <Play size={18} />}
//                       {activity.type === 'badge' && <span className="text-xl">🏆</span>}
//                     </div>
//                     <div className="flex-1">
//                       {activity.type === 'finished' && (
//                         <p>Finished reading <span className="font-medium">{activity.book}</span></p>
//                       )}
//                       {activity.type === 'started' && (
//                         <p>Started reading <span className="font-medium">{activity.book}</span></p>
//                       )}
//                       {activity.type === 'badge' && (
//                         <p>Earned <span className="font-medium">{activity.name}</span> badge</p>
//                       )}
//                       <p className="text-xs text-gray-500">{activity.date}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>
            
//             <section>
//               <h3 className="text-lg font-medium mb-3">Listening Goals</h3>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex justify-between items-center mb-2">
//                   <h4 className="font-medium">Daily Goal</h4>
//                   <span className="text-sm text-gray-600">30 min / day</span>
//                 </div>
//                 <div className="w-full bg-gray-200 h-2 rounded-full mb-1">
//                   <div className="bg-indigo-500 h-2 rounded-full w-2/3"></div>
//                 </div>
//                 <p className="text-sm text-gray-600">20 minutes today</p>
//               </div>
//             </section>
            
//             <section>
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-medium">Reading Habits</h3>
//                 <button className="text-sm text-indigo-500">View Details</button>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex justify-between mb-4">
//                   <div>
//                     <h4 className="font-medium">Favorite Genre</h4>
//                     <p className="text-sm">Science Fiction</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium">Peak Hours</h4>
//                     <p className="text-sm">8-10 PM</p>
//                   </div>
//                 </div>
//                 <div className="flex justify-between">
//                   <div>
//                     <h4 className="font-medium">Avg. Session</h4>
//                     <p className="text-sm">45 minutes</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium">Completion Rate</h4>
//                     <p className="text-sm">83%</p>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>
//         )}
        
//         {activeTab === 'library' && (
//           <div className="flex flex-col gap-4">
//             <div className="flex gap-2 overflow-x-auto pb-2">
//               <button className="px-4 py-1 bg-indigo-500 text-white rounded-full text-sm whitespace-nowrap">
//                 All Books
//               </button>
//               <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
//                 Currently Reading
//               </button>
//               <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
//                 Finished
//               </button>
//               <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
//                 Wishlist
//               </button>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               {[...featuredBooks, ...continueListing].slice(0, 6).map(book => (
//                 <div key={book._id} className="flex flex-col">
//                   <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-md" />
//                   <h3 className="font-medium mt-2">{book.title}</h3>
//                   <p className="text-sm text-gray-600">{book.author}</p>
//                   {book.progress && (
//                     <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
//                       <div 
//                         className="bg-indigo-500 h-1 rounded-full" 
//                         style={{ width: `${book.progress}%` }}
//                       ></div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {activeTab === 'badges' && (
//           <div className="grid grid-cols-3 gap-4">
//             {Array(12).fill(null).map((_, idx) => (
//               <div key={idx} className="flex flex-col items-center p-2">
//                 <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${idx < 8 ? 'bg-indigo-100 text-indigo-500' : 'bg-gray-200 text-gray-400'}`}>
//                   {idx < 8 ? '🏆' : '🔒'}
//                 </div>
//                 <h4 className="text-sm font-medium text-center mt-2">
//                   {idx === 0 && 'Bookworm'}
//                   {idx === 1 && 'Night Owl'}
//                   {idx === 2 && 'Speed Reader'}
//                   {idx === 3 && 'Genre Master'}
//                   {idx === 4 && 'Marathon'}
//                   {idx === 5 && 'Early Bird'}
//                   {idx === 6 && 'Serial Listener'}
//                   {idx === 7 && 'Completionist'}
//                   {idx === 8 && 'Explorer'}
//                   {idx === 9 && 'Collector'}
//                   {idx === 10 && 'Reviewer'}
//                   {idx === 11 && 'Legend'}
//                 </h4>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   export default ProfileView