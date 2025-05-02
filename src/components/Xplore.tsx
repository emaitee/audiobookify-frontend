// import React, { useState, useEffect } from 'react';
// import { Search, BookOpen, Headphones, Clock, ChevronRight, Star, Heart, TrendingUp, Menu, X } from 'lucide-react';

// // Simulated data for the audiobook platform
// const categories = [
//   "Fiction", "Romance", "Mystery", "Biography", "Fantasy", "Self-Help", "History", "Science Fiction"
// ];

// const featuredBooks = [
//   {
//     id: 1,
//     title: "The Midnight Library",
//     author: "Matt Haig",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.8,
//     duration: "8h 23m",
//     category: "Fiction"
//   },
//   {
//     id: 2,
//     title: "Atomic Habits",
//     author: "James Clear",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.9,
//     duration: "5h 35m",
//     category: "Self-Help"
//   },
//   {
//     id: 3,
//     title: "Project Hail Mary",
//     author: "Andy Weir",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.7,
//     duration: "16h 10m",
//     category: "Science Fiction"
//   },
//   {
//     id: 4,
//     title: "The Song of Achilles",
//     author: "Madeline Miller",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.6,
//     duration: "11h 15m",
//     category: "Fantasy"
//   }
// ];

// const trendingBooks = [
//   {
//     id: 5,
//     title: "The Lincoln Highway",
//     author: "Amor Towles",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.5,
//     duration: "16h 39m",
//     category: "Fiction"
//   },
//   {
//     id: 6,
//     title: "Dune",
//     author: "Frank Herbert",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.7,
//     duration: "21h 2m",
//     category: "Science Fiction"
//   },
//   {
//     id: 7,
//     title: "Becoming",
//     author: "Michelle Obama",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.9,
//     duration: "19h 3m",
//     category: "Biography"
//   },
//   {
//     id: 8,
//     title: "The Silent Patient",
//     author: "Alex Michaelides",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.6,
//     duration: "8h 43m",
//     category: "Mystery"
//   }
// ];

// const newReleases = [
//   {
//     id: 9,
//     title: "The Maid",
//     author: "Nita Prose",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.3,
//     duration: "9h 37m",
//     category: "Mystery"
//   },
//   {
//     id: 10,
//     title: "Cloud Cuckoo Land",
//     author: "Anthony Doerr",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.4,
//     duration: "14h 52m",
//     category: "Fiction"
//   },
//   {
//     id: 11,
//     title: "The Last Thing He Told Me",
//     author: "Laura Dave",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.2,
//     duration: "8h 49m",
//     category: "Mystery"
//   },
//   {
//     id: 12,
//     title: "Think Again",
//     author: "Adam Grant",
//     coverUrl: "/api/placeholder/240/360",
//     rating: 4.8,
//     duration: "6h 40m",
//     category: "Self-Help"
//   }
// ];

// // AudioBook Card Component
// const AudiobookCard = ({ book }) => {
//   const [isFavorite, setIsFavorite] = useState(false);
  
//   return (
//     <div className="flex flex-col rounded-lg overflow-hidden shadow-md bg-white transition-transform duration-300 hover:shadow-xl hover:scale-105">
//       <div className="relative">
//         <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover" />
//         <button 
//           onClick={() => setIsFavorite(!isFavorite)} 
//           className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all"
//         >
//           <Heart size={20} fill={isFavorite ? "#FF4081" : "none"} stroke={isFavorite ? "#FF4081" : "currentColor"} />
//         </button>
//       </div>
//       <div className="p-3">
//         <h3 className="font-bold text-lg line-clamp-1">{book.title}</h3>
//         <p className="text-gray-600 text-sm">{book.author}</p>
//         <div className="flex items-center mt-2">
//           <Star size={16} fill="#FFD700" stroke="#FFD700" />
//           <span className="ml-1 text-sm">{book.rating}</span>
//           <span className="mx-2 text-gray-300">|</span>
//           <Clock size={16} className="text-gray-500" />
//           <span className="ml-1 text-sm text-gray-500">{book.duration}</span>
//         </div>
//         <div className="mt-2">
//           <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">{book.category}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Section Header Component
// const SectionHeader = ({ title, viewMore = true }) => (
//   <div className="flex justify-between items-center mb-4">
//     <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//     {viewMore && (
//       <button className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors">
//         View all <ChevronRight size={16} />
//       </button>
//     )}
//   </div>
// );

// // Category Button Component
// const CategoryButton = ({ category, isActive, onClick }) => (
//   <button
//     onClick={() => onClick(category)}
//     className={`px-4 py-2 mr-2 mb-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
//       isActive
//         ? "bg-purple-600 text-white"
//         : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//     }`}
//   >
//     {category}
//   </button>
// );

// // Main Explore Page Component
// export default function ExploreAudiobooks() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };
  
//   // Handle category selection
//   const handleCategoryChange = (category) => {
//     setActiveCategory(category);
//   };
  
//   // Toggle mobile menu
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center">
//             <BookOpen size={28} className="text-purple-600" />
//             <h1 className="ml-2 text-xl font-bold">AudioBooks</h1>
//           </div>
          
//           {/* Mobile menu button */}
//           <button className="md:hidden" onClick={toggleMenu}>
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
          
//           {/* Desktop navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             <a href="#" className="font-medium text-purple-600">Explore</a>
//             <a href="#" className="font-medium text-gray-600 hover:text-purple-600 transition-colors">Library</a>
//             <a href="#" className="font-medium text-gray-600 hover:text-purple-600 transition-colors">My Books</a>
//             <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
//               <span className="font-medium text-purple-700">AB</span>
//             </div>
//           </nav>
//         </div>
//       </header>
      
//       {/* Mobile menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white shadow-md">
//           <nav className="flex flex-col">
//             <a href="#" className="px-4 py-3 font-medium text-purple-600 border-l-4 border-purple-600">Explore</a>
//             <a href="#" className="px-4 py-3 font-medium text-gray-600 hover:text-purple-600 transition-colors">Library</a>
//             <a href="#" className="px-4 py-3 font-medium text-gray-600 hover:text-purple-600 transition-colors">My Books</a>
//             <div className="px-4 py-3 flex items-center">
//               <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
//                 <span className="font-medium text-purple-700">AB</span>
//               </div>
//               <span className="ml-3 font-medium">My Account</span>
//             </div>
//           </nav>
//         </div>
//       )}
      
//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto px-4 py-6">
//         {/* Search and Hero Section */}
//         <div className="mb-8">
//           <div className="relative mb-6">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search size={20} className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search for audiobooks, authors, narrators..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             />
//           </div>
          
//           {/* Hero Banner */}
//           <div className="relative rounded-xl overflow-hidden">
//             <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-48 md:h-64">
//               <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
//                 <h2 className="text-white text-xl md:text-3xl font-bold mb-2">Discover your next favorite audiobook</h2>
//                 <p className="text-purple-100 text-sm md:text-base max-w-md">Explore thousands of titles narrated by world-class performers</p>
//                 <button className="mt-4 bg-white text-purple-600 font-medium px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors w-fit">
//                   Start Listening
//                 </button>
//               </div>
//               <div className="absolute right-0 bottom-0">
//                 <Headphones size={140} className="text-white opacity-20" />
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Categories */}
//         <div className="mb-8 overflow-x-auto pb-2">
//           <div className="flex">
//             <CategoryButton 
//               category="All" 
//               isActive={activeCategory === "All"} 
//               onClick={handleCategoryChange} 
//             />
//             {categories.map((category) => (
//               <CategoryButton
//                 key={category}
//                 category={category}
//                 isActive={activeCategory === category}
//                 onClick={handleCategoryChange}
//               />
//             ))}
//           </div>
//         </div>
        
//         {/* Featured Audiobooks */}
//         <section className="mb-10">
//           <SectionHeader title="Featured Audiobooks" />
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {featuredBooks.map((book) => (
//               <AudiobookCard key={book.id} book={book} />
//             ))}
//           </div>
//         </section>
        
//         {/* Trending Now */}
//         <section className="mb-10">
//           <SectionHeader title="Trending Now" />
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {trendingBooks.map((book) => (
//               <AudiobookCard key={book.id} book={book} />
//             ))}
//           </div>
//         </section>
        
//         {/* New Releases */}
//         <section className="mb-10">
//           <SectionHeader title="New Releases" />
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {newReleases.map((book) => (
//               <AudiobookCard key={book.id} book={book} />
//             ))}
//           </div>
//         </section>
//       </main>
      
//       {/* Footer */}
//       <footer className="bg-gray-100 py-8 mt-10">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="text-center md:text-left md:flex md:justify-between">
//             <div className="mb-6 md:mb-0">
//               <div className="flex items-center justify-center md:justify-start">
//                 <BookOpen size={24} className="text-purple-600" />
//                 <h3 className="ml-2 text-lg font-bold">AudioBooks</h3>
//               </div>
//               <p className="mt-2 text-sm text-gray-600">Discover the world through your ears</p>
//             </div>
            
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//               <div>
//                 <h4 className="font-bold mb-3">Explore</h4>
//                 <ul className="space-y-2">
//                   <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600">Categories</a></li>
//                   <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600">Authors</a></li>
//                   <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600">Narrators</a></li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-bold mb-3">Account</h4>
//                 <ul className="space-y-2">
//                   <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600">Profile</a></li>
//                   <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600">My Library</a></li>
//                   <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600">Settings</a></li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-bold mb-3">Help</h4>
//                 <ul className="space-y-2">
//                   <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600">FAQ</a></li>
//                   <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600">Contact Us</a></li>
//                   <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600">Privacy Policy</a></li>
//                 </ul>
//               </div>
//             </div>
//           </div>
          
//           <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
//             <p>© {new Date().getFullYear()} AudioBooks. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }