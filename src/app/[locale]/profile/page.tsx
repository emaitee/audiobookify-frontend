'use client'

import { useState, useEffect } from 'react';
import { UserCircle2, Book, Heart, Clock, Edit2, Save, X, Upload, LogOut, Menu } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from 'next-themes';

type ProfileHistoryBook = { audiobook: { title: string } | string; progress: number; lastListened: Date }

export default function ProfilePage() {
  const { theme } = useTheme();
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className={`flex items-center justify-center h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
        theme === 'dark' ? 'border-indigo-400' : 'border-indigo-500'
      }`}></div>
    </div>
  );

  if (error) return (
    <div className={`border-l-4 p-4 m-4 ${
      theme === 'dark' ? 'bg-red-900/30 border-red-500 text-red-300' : 'bg-red-100 border-red-500 text-red-700'
    }`}>
      <p>Error: {error}</p>
    </div>
  );

  if (!profile) return (
    <div className={`flex items-center justify-center h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
    }`}>
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

  const tabs = [
    { id: 'library', label: 'My Library', icon: <Book size={18} className="mr-2" /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart size={18} className="mr-2" /> },
    { id: 'history', label: 'Recently Played', icon: <Clock size={18} className="mr-2" /> }
  ];

  return (
    <div className={`max-w-4xl mx-auto md:p-4 min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
    }`}>
      {/* Profile Header */}
      <div className={`rounded-lg md:rounded-xl shadow-md overflow-hidden mb-4 md:mb-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:p-6 flex items-center justify-center">
            <div className="relative">
              {(profile.profilePicture || previewUrl) ? (
                <img 
                  src={previewUrl || profile.profilePicture} 
                  alt={profile.name} 
                  className={`h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-2 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-indigo-100'
                  }`}
                />
              ) : (
                <div className={`h-24 w-24 md:h-32 md:w-32 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-100'
                }`}>
                  <UserCircle2 size={48} className={`md:hidden ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
                  }`} />
                  <UserCircle2 size={64} className={`hidden md:block ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
                  }`} />
                </div>
              )}
              
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <label htmlFor="profilePicture" className={`cursor-pointer rounded-full p-2 hover:bg-indigo-600 ${
                    theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                  }`}>
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
          
          <div className="p-4 md:p-8 w-full">
            {isEditing ? (
              <div>
                <div className="mb-4">
                  <label className={`block text-sm font-bold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`} htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  />
                </div>
                <div className="mb-6">
                  <label className={`block text-sm font-bold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className={`font-bold py-2 px-4 rounded mr-2 flex items-center ${
                      theme === 'dark' 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                    }`}
                  >
                    <X size={16} className="mr-1" /> Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    className={`font-bold py-2 px-4 rounded flex items-center ${
                      theme === 'dark' 
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                        : 'bg-indigo-500 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Save size={16} className="mr-1" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="mb-3 sm:mb-0">
                    <h1 className={`text-xl md:text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{profile.name}</h1>
                    <p className={`text-sm md:text-base ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{profile.email}</p>
                    <div className={`mt-2 text-xs md:text-sm ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <div className="flex items-center">
                        <Book size={14} className="mr-1" />
                        <span>{profile.library.length} books in library</span>
                      </div>
                      <div className="flex items-center">
                        <Heart size={14} className="mr-1" />
                        <span>{profile.favorites.length} favorites</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className={`font-medium py-1 px-3 md:py-2 md:px-4 rounded-full flex items-center text-sm ${
                      theme === 'dark' 
                        ? 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                  >
                    <Edit2 size={14} className="mr-1" /> Edit
                  </button>
                </div>
                <div className="mt-4 flex">
                  <button 
                    onClick={handleLogout}
                    className={`flex items-center text-xs md:text-sm ${
                      theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                    }`}
                  >
                    <LogOut size={14} className="mr-1" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation - Mobile dropdown vs desktop tabs */}
      <div className="mb-4 md:mb-6">
        {/* Mobile tabs dropdown */}
        <div className="block md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-full flex items-center justify-between p-3 border rounded-md ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center">
              {tabs.find(tab => tab.id === activeTab)?.icon}
              <span className="font-medium">{tabs.find(tab => tab.id === activeTab)?.label}</span>
            </div>
            <Menu size={20} />
          </button>
          
          {mobileMenuOpen && (
            <div className={`mt-2 rounded-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`w-full text-left p-3 flex items-center ${
                    activeTab === tab.id 
                      ? theme === 'dark' 
                        ? 'bg-gray-700 text-indigo-400' 
                        : 'bg-indigo-50 text-indigo-600' 
                      : theme === 'dark' 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      
        {/* Desktop tabs */}
        <div className={`hidden md:block border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id 
                    ? theme === 'dark' 
                      ? 'border-indigo-500 text-indigo-400' 
                      : 'border-indigo-500 text-indigo-600' 
                    : theme === 'dark' 
                      ? 'border-transparent text-gray-400 hover:text-gray-300' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Section */}
      <div className={`rounded-lg md:rounded-xl shadow-md overflow-hidden p-4 md:p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {activeTab === 'library' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {profile.library.length > 0 ? (
              profile.library.map(id => {
                const book = allBooks.find(a => a._id === id)
                
                return (
                  <div key={id} className="flex flex-col">
                    <div className={`relative h-40 sm:h-56 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <img 
                        src={book?.coverImage} 
                        alt={book?.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex space-x-1">
                        <button 
                          onClick={() => handleToggleFavorite(id)}
                          className={`rounded-full p-1 shadow ${
                            theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          <Heart 
                            size={14} 
                            className={profile.favorites.includes(id) ? "text-red-500 fill-red-500" : theme === 'dark' ? "text-gray-400" : "text-gray-400"}
                          />
                        </button>
                        <button 
                          onClick={() => handleRemoveFromLibrary(id)}
                          className={`rounded-full p-1 shadow ${
                            theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          <X size={14} className={theme === 'dark' ? "text-gray-300" : "text-gray-500"} />
                        </button>
                      </div>
                    </div>
                    <h3 className={`mt-2 text-xs sm:text-sm font-medium truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{book?.title}</h3>
                    <p className={`text-xs truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>{book?.author}</p>
                  </div>
                );
              })
            ) : (
              <div className={`col-span-full text-center py-6 md:py-8 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Your library is empty. Add audiobooks to get started!
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {profile.favorites.length > 0 ? (
              profile.favorites.map(id => {
                const book = allBooks.find(a => a._id === id)
                
                return (
                  <div key={id} className="flex flex-col">
                    <div className={`relative h-40 sm:h-56 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <img 
                        src={book?.coverImage} 
                        alt={book?.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                        <button 
                          onClick={() => handleToggleFavorite(id)}
                          className={`rounded-full p-1 shadow ${
                            theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          <Heart size={14} className="text-red-500 fill-red-500" />
                        </button>
                      </div>
                    </div>
                    <h3 className={`mt-2 text-xs sm:text-sm font-medium truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{book?.title}</h3>
                    <p className={`text-xs truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>{book?.author}</p>
                  </div>
                );
              })
            ) : (
              <div className={`col-span-full text-center py-6 md:py-8 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                You haven't favorited any audiobooks yet.
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3 md:space-y-4">
            {profile.history.length > 0 ? (
              profile.history.map((item:ProfileHistoryBook, index) => {
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
                
                const title = typeof item.audiobook === 'string' 
                  ? item.audiobook
                  : typeof item.audiobook === 'object' && 'title' in item.audiobook 
                    ? item.audiobook.title 
                    : 'Unknown Book';
                
                return (
                  <div key={index} className={`pb-3 md:pb-4 last:border-0 ${
                    theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                  }`}>
                    <div className="flex items-center">
                      <div className={`h-12 w-8 sm:h-16 sm:w-12 flex-shrink-0 rounded overflow-hidden mr-3 md:mr-4 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <img 
                          src="/api/placeholder/48/72" 
                          alt={title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className={`text-xs sm:text-sm font-medium truncate ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{title}</h3>
                        <div className="mt-1 relative pt-1">
                          <div className={`overflow-hidden h-1 sm:h-2 text-xs flex rounded ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div 
                              style={{ width: `${item.progress * 100}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                            ></div>
                          </div>
                          <p className={`text-xs mt-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>{Math.round(item.progress * 100)}% complete</p>
                        </div>
                      </div>
                      <div className={`text-xs ml-2 whitespace-nowrap ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {timeDisplay}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`text-center py-6 md:py-8 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                You haven't played any audiobooks yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}