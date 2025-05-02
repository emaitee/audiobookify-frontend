// import React, { useState } from 'react';
// import { Search, Bookmark, Play, Clock, ChevronRight, Star, Heart, Award, Headphones, Book, TrendingUp, BarChart4, Calendar, X } from 'lucide-react';

// // Mock data for audiobooks
// const genres = [
//   "Fiction", "Non-Fiction", "Mystery", "Fantasy", "Romance", "Sci-Fi", "Business", "Self-Help"
// ];

// const featuredAudiobooks = [
//   {
//     id: 1,
//     title: "The Silent Observer",
//     author: "Eleanor Hughes",
//     narrator: "Michael Reynolds",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.8,
//     duration: "10h 45m",
//     genre: "Mystery"
//   },
//   {
//     id: 2,
//     title: "Beyond the Horizon",
//     author: "Thomas Walker",
//     narrator: "Sarah Mitchell",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.6,
//     duration: "8h 20m",
//     genre: "Sci-Fi"
//   },
//   {
//     id: 3,
//     title: "The Art of Stillness",
//     author: "Maria Chen",
//     narrator: "David Anderson",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.9,
//     duration: "6h 12m",
//     genre: "Self-Help"
//   }
// ];

// const popularAudiobooks = [
//   {
//     id: 4,
//     title: "Echoes of Yesterday",
//     author: "Richard James",
//     narrator: "Emma Thompson",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.7,
//     duration: "12h 30m",
//     genre: "Fiction"
//   },
//   {
//     id: 5,
//     title: "The Midnight Garden",
//     author: "Sophie Bennett",
//     narrator: "Robert Wilson",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.5,
//     duration: "9h 15m",
//     genre: "Fantasy"
//   },
//   {
//     id: 6,
//     title: "Corporate Instinct",
//     author: "Alex Morgan",
//     narrator: "Jennifer Lee",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.4,
//     duration: "7h 50m",
//     genre: "Business"
//   },
//   {
//     id: 7,
//     title: "Love in Paris",
//     author: "Claire Dubois",
//     narrator: "James Peterson",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.8,
//     duration: "8h 45m",
//     genre: "Romance"
//   }
// ];

// const newReleases = [
//   {
//     id: 8,
//     title: "The Last Frontier",
//     author: "Daniel Smith",
//     narrator: "Lisa Johnson",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.3,
//     duration: "11h 20m",
//     genre: "Sci-Fi"
//   },
//   {
//     id: 9,
//     title: "Shadows in the Dark",
//     author: "Patricia Wells",
//     narrator: "Mark Davis",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.6,
//     duration: "9h 10m",
//     genre: "Mystery"
//   },
//   {
//     id: 10,
//     title: "The Growth Mindset",
//     author: "Samuel Green",
//     narrator: "Rachel King",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.7,
//     duration: "5h 40m",
//     genre: "Self-Help"
//   },
//   {
//     id: 11,
//     title: "Historical Revolutions",
//     author: "Elizabeth Turner",
//     narrator: "Peter Williams",
//     coverUrl: "/api/placeholder/320/320",
//     rating: 4.5,
//     duration: "14h 25m",
//     genre: "Non-Fiction"
//   }
// ];

// // Featured Audiobook Card Component
// const FeaturedAudiobookCard = ({ book }) => (
//   <div className="group relative h-96 overflow-hidden rounded-xl">
//     <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
//     <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//     <div className="absolute bottom-0 left-0 p-6 text-white">
//       <div className="mb-2 flex items-center">
//         <span className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-md uppercase">{book.genre}</span>
//         <div className="flex items-center ml-3">
//           <Star size={14} fill="#FFD700" stroke="none" />
//           <span className="ml-1 text-sm font-medium">{book.rating}</span>
//         </div>
//       </div>
//       <h3 className="text-2xl font-bold mb-1">{book.title}</h3>
//       <p className="text-gray-300 mb-3">By {book.author} • Narrated by {book.narrator}</p>
//       <div className="flex items-center space-x-2 text-sm mb-4">
//         <Clock size={14} />
//         <span>{book.duration}</span>
//       </div>
//       <div className="flex space-x-3">
//         <button className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-full py-2 px-6 transition-colors">
//           <Play size={16} fill="black" className="mr-1" />
//           Listen
//         </button>
//         <button className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-full py-2 px-4 transition-colors">
//           <Bookmark size={16} className="mr-1" />
//           Save
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // Standard Audiobook Card Component
// const AudiobookCard = ({ book }) => {
//   const [isFavorite, setIsFavorite] = useState(false);
  
//   return (
//     <div className="group">
//       <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
//         <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
//         <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             setIsFavorite(!isFavorite);
//           }}
//           className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//         >
//           <Heart size={16} fill={isFavorite ? "#e11d48" : "none"} stroke={isFavorite ? "#e11d48" : "currentColor"} />
//         </button>
//         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//           <button className="p-4 bg-amber-500 rounded-full hover:bg-amber-600 transition-colors">
//             <Play size={24} fill="black" />
//           </button>
//         </div>
//       </div>
//       <h3 className="font-semibold text-lg">{book.title}</h3>
//       <p className="text-gray-600 text-sm mb-1">{book.author}</p>
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <Star size={14} fill="#FFD700" stroke="none" />
//           <span className="ml-1 text-sm">{book.rating}</span>
//         </div>
//         <div className="flex items-center text-gray-500 text-sm">
//           <Clock size={14} className="mr-1" />
//           {book.duration}
//         </div>
//       </div>
//     </div>
//   );
// };

// // GenreButton Component
// const GenreButton = ({ genre, active, onClick }) => (
//   <button
//     onClick={() => onClick(genre)}
//     className={`px-5 py-2 mb-2 mr-2 rounded-full text-sm font-medium transition-colors ${
//       active
//         ? "bg-amber-500 text-black"
//         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//     }`}
//   >
//     {genre}
//   </button>
// );

// // Section Header Component
// const SectionHeader = ({ icon, title }) => (
//   <div className="flex justify-between items-center mb-6">
//     <div className="flex items-center">
//       {icon}
//       <h2 className="text-2xl font-bold ml-2">{title}</h2>
//     </div>
//     <button className="flex items-center text-amber-600 hover:text-amber-700 transition-colors">
//       <span className="mr-1 font-medium">View all</span>
//       <ChevronRight size={18} />
//     </button>
//   </div>
// );

// // Main AudioBook Explore Page
// export default function AudiobookExplore() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState("All");
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header/Navigation */}
//       <header className="bg-gray-900 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo & Brand */}
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="flex items-center">
//                   <Headphones size={24} className="text-amber-500" />
//                   <span className="ml-2 text-xl font-bold">SoundStory</span>
//                 </div>
//               </div>
              
//               {/* Desktop Navigation */}
//               <nav className="hidden md:block ml-10">
//                 <div className="flex items-center space-x-8">
//                   <a href="#" className="text-amber-500 font-medium">Explore</a>
//                   <a href="#" className="text-gray-300 hover:text-white transition-colors">Library</a>
//                   <a href="#" className="text-gray-300 hover:text-white transition-colors">Top Charts</a>
//                   <a href="#" className="text-gray-300 hover:text-white transition-colors">New Releases</a>
//                 </div>
//               </nav>
//             </div>
            
//             {/* Desktop Right Menu */}
//             <div className="hidden md:flex items-center space-x-6">
//               <button className="text-gray-300 hover:text-white transition-colors">
//                 <Search size={20} />
//               </button>
//               <button className="text-gray-300 hover:text-white transition-colors">
//                 <Bookmark size={20} />
//               </button>
//               <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
//                 <span className="font-medium">JS</span>
//               </div>
//             </div>
            
//             {/* Mobile menu button */}
//             <div className="md:hidden flex items-center">
//               <button 
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
//                 className="text-gray-300 hover:text-white"
//               >
//                 {isMobileMenuOpen ? (
//                   <X size={24} />
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Mobile menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-amber-500 bg-gray-800">Explore</a>
//               <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Library</a>
//               <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Top Charts</a>
//               <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">New Releases</a>
//             </div>
//             <div className="border-t border-gray-700 pt-4 pb-3">
//               <div className="flex items-center px-5">
//                 <div className="flex-shrink-0">
//                   <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
//                     <span className="font-medium">JS</span>
//                   </div>
//                 </div>
//                 <div className="ml-3">
//                   <div className="text-base font-medium text-white">Jane Smith</div>
//                   <div className="text-sm font-medium text-gray-400">Premium Member</div>
//                 </div>
//               </div>
//               <div className="mt-3 px-2 space-y-1">
//                 <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Your Profile</a>
//                 <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Settings</a>
//                 <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Sign out</a>
//               </div>
//             </div>
//           </div>
//         )}
//       </header>
      
//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Search Section */}
//         <div className="mb-10">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold mb-2">Discover Audiobooks</h1>
//             <p className="text-gray-600">Find your next favorite story among thousands of titles</p>
//           </div>
          
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//               <Search size={20} className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by title, author, or narrator..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
//             />
//           </div>
//         </div>
        
//         {/* Genre Filter */}
//         <div className="mb-12 overflow-x-auto scrollbar-hide">
//           <div className="flex">
//             <GenreButton
//               genre="All"
//               active={selectedGenre === "All"}
//               onClick={setSelectedGenre}
//             />
//             {genres.map((genre) => (
//               <GenreButton
//                 key={genre}
//                 genre={genre}
//                 active={selectedGenre === genre}
//                 onClick={setSelectedGenre}
//               />
//             ))}
//           </div>
//         </div>
        
//         {/* Featured Section */}
//         <section className="mb-16">
//           <SectionHeader 
//             icon={<Award size={24} className="text-amber-500" />}
//             title="Featured This Week" 
//           />
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {featuredAudiobooks.map((book) => (
//               <FeaturedAudiobookCard key={book.id} book={book} />
//             ))}
//           </div>
//         </section>
        
//         {/* Popular Now Section */}
//         <section className="mb-16">
//           <SectionHeader 
//             icon={<TrendingUp size={24} className="text-amber-500" />}
//             title="Popular Now" 
//           />
          
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//             {popularAudiobooks.map((book) => (
//               <AudiobookCard key={book.id} book={book} />
//             ))}
//           </div>
//         </section>
        
//         {/* New Releases */}
//         <section className="mb-16">
//           <SectionHeader 
//             icon={<Calendar size={24} className="text-amber-500" />}
//             title="New Releases" 
//           />
          
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//             {newReleases.map((book) => (
//               <AudiobookCard key={book.id} book={book} />
//             ))}
//           </div>
//         </section>
        
//         {/* Subscription Banner */}
//         <section className="mb-16">
//           <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
//             <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
//               <div className="text-center md:text-left mb-6 md:mb-0">
//                 <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Unlock Premium Access</h3>
//                 <p className="text-gray-300 mb-4 max-w-md">Get unlimited access to all audiobooks and exclusive content with our premium subscription.</p>
//                 <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-6 rounded-full transition-colors">
//                   Try Free for 30 Days
//                 </button>
//               </div>
//               <div className="hidden md:block">
//                 <div className="relative w-64 h-64">
//                   <div className="absolute w-48 h-48 bg-amber-500 rounded-full opacity-30 blur-xl"></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <Headphones size={80} className="text-white" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
      
//       {/* Footer */}
//       <footer className="bg-gray-100 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center mb-4">
//                 <Headphones size={24} className="text-amber-500" />
//                 <span className="ml-2 text-xl font-bold">SoundStory</span>
//               </div>
//               <p className="text-gray-600 mb-6">Transforming the way you experience books.</p>
//               <div className="flex space-x-4">
//                 <a href="#" className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                     <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
//                   </svg>
//                 </a>
//                 <a href="#" className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                     <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                   </svg>
//                 </a>
//                 <a href="#" className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                     <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
//                   </svg>
//                 </a>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Home</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Browse All</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Popular Genres</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Bestsellers</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Free Audiobooks</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="font-semibold text-lg mb-4">Account</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Sign Up</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Log In</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Subscription Plans</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">My Library</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Listening History</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="font-semibold text-lg mb-4">Support</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Help Center</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Contact Us</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Accessibility</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Privacy Policy</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Terms of Service</a></li>
//               </ul>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
//             <p>© {new Date().getFullYear()} SoundStory. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }