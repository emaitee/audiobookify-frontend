// import { useState } from 'react';
// import { Heart, Bookmark, Share2, MessageCircle, Clock, Award, Headphones, BookOpen, Star, ChevronDown, Play, Pause } from 'lucide-react';

// export default function NarratorProfile() {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [activeTab, setActiveTab] = useState('narrated');
  
//   const togglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <div className="flex flex-col bg-gray-50 min-h-screen">
//       {/* Profile Header */}
//       <div className="bg-indigo-900 text-white">
//         <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
//           <div className="flex flex-col md:flex-row items-center gap-6">
//             {/* Profile Image */}
//             <div className="relative">
//               <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white">
//                 <img 
//                   src="/api/placeholder/400/400" 
//                   alt="James Earl Jones" 
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-gray-900 rounded-full p-2">
//                 <Award size={20} className="inline" />
//               </div>
//             </div>
            
//             {/* Name and Details */}
//             <div className="text-center md:text-left flex-1">
//               <h1 className="text-3xl md:text-4xl font-bold">James Earl Jones</h1>
//               <p className="text-indigo-200 mt-1">Award-winning narrator · 187 audiobooks</p>
              
//               <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
//                 <div className="flex items-center">
//                   <Star className="text-yellow-400 mr-1" size={18} />
//                   <span className="font-semibold">4.8</span>
//                   <span className="text-indigo-200 ml-1">(1,204 ratings)</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Headphones className="text-indigo-200 mr-1" size={18} />
//                   <span>2.3M listeners</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Award className="text-yellow-400 mr-1" size={18} />
//                   <span>Grammy Award winner</span>
//                 </div>
//               </div>
              
//               {/* Action Buttons */}
//               <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
//                 <button 
//                   className="bg-white text-indigo-900 font-semibold px-4 py-2 rounded-full flex items-center"
//                   onClick={togglePlay}
//                 >
//                   {isPlaying ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
//                   {isPlaying ? "Pause Sample" : "Play Sample"}
//                 </button>
//                 <button className="bg-indigo-700 text-white px-4 py-2 rounded-full flex items-center">
//                   <Heart size={18} className="mr-2" />
//                   Follow
//                 </button>
//                 <button className="bg-transparent border border-indigo-300 text-white px-4 py-2 rounded-full flex items-center">
//                   <Share2 size={18} className="mr-2" />
//                   Share
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Content Area */}
//       <div className="max-w-5xl mx-auto px-4 py-8 w-full">
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           {/* Voice Sample Player (if expanded) */}
//           {isPlaying && (
//             <div className="bg-indigo-50 border-b border-indigo-100 p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <button className="bg-indigo-600 text-white p-2 rounded-full mr-3" onClick={togglePlay}>
//                     <Pause size={18} />
//                   </button>
//                   <div>
//                     <p className="font-medium">Voice Sample</p>
//                     <div className="h-2 w-56 bg-indigo-200 rounded-full overflow-hidden mt-1">
//                       <div className="h-full w-1/3 bg-indigo-600 rounded-full"></div>
//                     </div>
//                   </div>
//                 </div>
//                 <span className="text-sm text-gray-500">0:42 / 2:15</span>
//               </div>
//             </div>
//           )}
          
//           {/* Bio Section */}
//           <div className="p-6">
//             <h2 className="text-2xl font-bold text-gray-800">About James Earl Jones</h2>
//             <p className="mt-4 text-gray-600 leading-relaxed">
//               James Earl Jones is an acclaimed American actor with one of the most distinctive voices in entertainment history. His deep, resonant bass voice has made him one of the most sought-after narrators in the audiobook industry. With a career spanning over six decades, Jones has narrated bestselling titles across multiple genres including classics, science fiction, and historical non-fiction.
//             </p>
//             <p className="mt-4 text-gray-600 leading-relaxed">
//               Jones is perhaps best known for his voice work as Darth Vader in the Star Wars franchise and as Mufasa in Disney's The Lion King. His audiobook narration has earned him multiple Grammy Awards and Audie Awards for excellence in narration.
//             </p>
            
//             {/* Voice Characteristics */}
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold text-gray-800">Voice Characteristics</h3>
//               <div className="mt-3 flex flex-wrap gap-3">
//                 <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">Deep Bass</span>
//                 <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">Authoritative</span>
//                 <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">Commanding</span>
//                 <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">Resonant</span>
//                 <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">Articulate</span>
//                 <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">American Accent</span>
//               </div>
//             </div>
            
//             {/* Accolades */}
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold text-gray-800">Awards & Recognition</h3>
//               <ul className="mt-3 space-y-3">
//                 <li className="flex items-start">
//                   <Award className="text-yellow-500 mr-2 mt-1 flex-shrink-0" size={18} />
//                   <div>
//                     <p className="font-medium">Grammy Award (2014)</p>
//                     <p className="text-sm text-gray-600">Best Spoken Word Album for "Chronicles: Volume One"</p>
//                   </div>
//                 </li>
//                 <li className="flex items-start">
//                   <Award className="text-yellow-500 mr-2 mt-1 flex-shrink-0" size={18} />
//                   <div>
//                     <p className="font-medium">Audie Award (2010)</p>
//                     <p className="text-sm text-gray-600">Narrator of the Year</p>
//                   </div>
//                 </li>
//                 <li className="flex items-start">
//                   <Award className="text-yellow-500 mr-2 mt-1 flex-shrink-0" size={18} />
//                   <div>
//                     <p className="font-medium">Audiobook Hall of Fame (2008)</p>
//                     <p className="text-sm text-gray-600">Lifetime Achievement in Narration</p>
//                   </div>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Tabs Navigation */}
//           <div className="border-t border-gray-200">
//             <div className="flex overflow-x-auto">
//               <button 
//                 className={`px-6 py-4 font-medium text-sm flex-shrink-0 border-b-2 ${activeTab === 'narrated' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//                 onClick={() => setActiveTab('narrated')}
//               >
//                 Narrated Books (187)
//               </button>
//               <button 
//                 className={`px-6 py-4 font-medium text-sm flex-shrink-0 border-b-2 ${activeTab === 'genres' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//                 onClick={() => setActiveTab('genres')}
//               >
//                 Genres & Specialties
//               </button>
//               <button 
//                 className={`px-6 py-4 font-medium text-sm flex-shrink-0 border-b-2 ${activeTab === 'similar' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//                 onClick={() => setActiveTab('similar')}
//               >
//                 Similar Narrators
//               </button>
//               <button 
//                 className={`px-6 py-4 font-medium text-sm flex-shrink-0 border-b-2 ${activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//                 onClick={() => setActiveTab('reviews')}
//               >
//                 Listener Reviews (1,204)
//               </button>
//             </div>
//           </div>
          
//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'narrated' && (
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-bold text-gray-800">Popular Audiobooks</h3>
//                   <div className="flex items-center text-indigo-600 cursor-pointer">
//                     <span className="font-medium text-sm">Browse All</span>
//                     <ChevronDown size={16} className="ml-1" />
//                   </div>
//                 </div>
                
//                 {/* Audiobook List */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {/* Book 1 */}
//                   <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//                     <div className="aspect-w-2 aspect-h-3 relative">
//                       <img 
//                         src="/api/placeholder/240/360" 
//                         alt="The Great Gatsby" 
//                         className="w-full h-48 object-cover"
//                       />
//                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center text-white">
//                             <Play size={16} className="mr-1" />
//                             <span className="text-xs">Sample</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <button className="bg-white bg-opacity-20 p-1 rounded-full hover:bg-opacity-30">
//                               <Bookmark size={16} className="text-white" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h4 className="font-bold text-gray-800">The Great Gatsby</h4>
//                       <p className="text-sm text-gray-600 mt-1">by F. Scott Fitzgerald</p>
//                       <div className="flex items-center mt-2">
//                         <div className="flex items-center">
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                         </div>
//                         <span className="text-xs text-gray-500 ml-1">(482)</span>
//                         <span className="text-xs text-gray-500 ml-3 flex items-center">
//                           <Clock size={12} className="mr-1" />
//                           4h 32m
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Book 2 */}
//                   <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//                     <div className="aspect-w-2 aspect-h-3 relative">
//                       <img 
//                         src="/api/placeholder/240/360" 
//                         alt="Moby Dick" 
//                         className="w-full h-48 object-cover"
//                       />
//                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center text-white">
//                             <Play size={16} className="mr-1" />
//                             <span className="text-xs">Sample</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <button className="bg-white bg-opacity-20 p-1 rounded-full hover:bg-opacity-30">
//                               <Bookmark size={16} className="text-white" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h4 className="font-bold text-gray-800">Moby Dick</h4>
//                       <p className="text-sm text-gray-600 mt-1">by Herman Melville</p>
//                       <div className="flex items-center mt-2">
//                         <div className="flex items-center">
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-gray-300" size={14} />
//                         </div>
//                         <span className="text-xs text-gray-500 ml-1">(298)</span>
//                         <span className="text-xs text-gray-500 ml-3 flex items-center">
//                           <Clock size={12} className="mr-1" />
//                           21h 15m
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Book 3 */}
//                   <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//                     <div className="aspect-w-2 aspect-h-3 relative">
//                       <img 
//                         src="/api/placeholder/240/360" 
//                         alt="1984" 
//                         className="w-full h-48 object-cover"
//                       />
//                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center text-white">
//                             <Play size={16} className="mr-1" />
//                             <span className="text-xs">Sample</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <button className="bg-white bg-opacity-20 p-1 rounded-full hover:bg-opacity-30">
//                               <Bookmark size={16} className="text-white" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h4 className="font-bold text-gray-800">1984</h4>
//                       <p className="text-sm text-gray-600 mt-1">by George Orwell</p>
//                       <div className="flex items-center mt-2">
//                         <div className="flex items-center">
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                           <Star className="text-yellow-400" size={14} />
//                         </div>
//                         <span className="text-xs text-gray-500 ml-1">(524)</span>
//                         <span className="text-xs text-gray-500 ml-3 flex items-center">
//                           <Clock size={12} className="mr-1" />
//                           11h 45m
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {activeTab === 'genres' && (
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800 mb-6">Genres & Specialties</h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="border border-gray-200 rounded-lg p-5">
//                     <h4 className="font-semibold text-gray-800 mb-3">Top Genres</h4>
//                     <ul className="space-y-3">
//                       <li className="flex justify-between items-center">
//                         <span className="flex items-center">
//                           <BookOpen size={16} className="text-indigo-500 mr-2" />
//                           <span>Classics</span>
//                         </span>
//                         <span className="text-sm text-gray-500">42 books</span>
//                       </li>
//                       <li className="flex justify-between items-center">
//                         <span className="flex items-center">
//                           <BookOpen size={16} className="text-indigo-500 mr-2" />
//                           <span>Science Fiction</span>
//                         </span>
//                         <span className="text-sm text-gray-500">38 books</span>
//                       </li>
//                       <li className="flex justify-between items-center">
//                         <span className="flex items-center">
//                           <BookOpen size={16} className="text-indigo-500 mr-2" />
//                           <span>Historical Fiction</span>
//                         </span>
//                         <span className="text-sm text-gray-500">31 books</span>
//                       </li>
//                       <li className="flex justify-between items-center">
//                         <span className="flex items-center">
//                           <BookOpen size={16} className="text-indigo-500 mr-2" />
//                           <span>Biography</span>
//                         </span>
//                         <span className="text-sm text-gray-500">24 books</span>
//                       </li>
//                       <li className="flex justify-between items-center">
//                         <span className="flex items-center">
//                           <BookOpen size={16} className="text-indigo-500 mr-2" />
//                           <span>Fantasy</span>
//                         </span>
//                         <span className="text-sm text-gray-500">19 books</span>
//                       </li>
//                     </ul>
//                   </div>
                  
//                   <div className="border border-gray-200 rounded-lg p-5">
//                     <h4 className="font-semibold text-gray-800 mb-3">Specialties</h4>
//                     <div className="space-y-3">
//                       <div>
//                         <div className="flex justify-between mb-1">
//                           <span className="text-sm font-medium">Character Voices</span>
//                           <span className="text-sm text-gray-500">Excellent</span>
//                         </div>
//                         <div className="h-2 bg-gray-200 rounded-full">
//                           <div className="h-full w-5/6 bg-indigo-600 rounded-full"></div>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex justify-between mb-1">
//                           <span className="text-sm font-medium">Pacing</span>
//                           <span className="text-sm text-gray-500">Excellent</span>
//                         </div>
//                         <div className="h-2 bg-gray-200 rounded-full">
//                           <div className="h-full w-5/6 bg-indigo-600 rounded-full"></div>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex justify-between mb-1">
//                           <span className="text-sm font-medium">Dramatic Readings</span>
//                           <span className="text-sm text-gray-500">Outstanding</span>
//                         </div>
//                         <div className="h-2 bg-gray-200 rounded-full">
//                           <div className="h-full w-full bg-indigo-600 rounded-full"></div>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex justify-between mb-1">
//                           <span className="text-sm font-medium">Accents</span>
//                           <span className="text-sm text-gray-500">Very Good</span>
//                         </div>
//                         <div className="h-2 bg-gray-200 rounded-full">
//                           <div className="h-full w-3/4 bg-indigo-600 rounded-full"></div>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex justify-between mb-1">
//                           <span className="text-sm font-medium">Non-Fiction</span>
//                           <span className="text-sm text-gray-500">Excellent</span>
//                         </div>
//                         <div className="h-2 bg-gray-200 rounded-full">
//                           <div className="h-full w-5/6 bg-indigo-600 rounded-full"></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {activeTab === 'similar' && (
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800 mb-6">Similar Narrators You Might Enjoy</h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {/* Narrator 1 */}
//                   <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
//                     <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
//                       <img 
//                         src="/api/placeholder/160/160" 
//                         alt="Morgan Freeman" 
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-gray-800">Morgan Freeman</h4>
//                       <p className="text-sm text-gray-600">154 audiobooks</p>
//                       <div className="flex items-center mt-1">
//                         <Star className="text-yellow-400" size={14} />
//                         <span className="text-xs text-gray-500 ml-1">4.9 (982 ratings)</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Narrator 2 */}
//                   <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
//                     <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
//                       <img 
//                         src="/api/placeholder/160/160" 
//                         alt="Jeremy Irons" 
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-gray-800">Jeremy Irons</h4>
//                       <p className="text-sm text-gray-600">126 audiobooks</p>
//                       <div className="flex items-center mt-1">
//                         <Star className="text-yellow-400" size={14} />
//                         <span className="text-xs text-gray-500 ml-1">4.7 (756 ratings)</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Narrator 3 */}
//                   <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
//                     <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
//                       <img 
//                         src="/api/placeholder/160/160" 
//                         alt="Keith David" 
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-gray-800">Keith David</h4>
//                       <p className="text-sm text-gray-600">102 audiobooks</p>
//                       <div className="flex items-center mt-1">
//                         <Star className="text-yellow-400" size={14} />
//                         <span className="text-xs text-gray-500 ml-1">4.6 (621 ratings)</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {activeTab === 'reviews' && (
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-bold text-gray-800">Listener Reviews</h3>
//                   <div className="flex items-center">
//                     <span className="text-sm text-gray-600 mr-2">Sort by:</span>
//                     <select className="text-sm border-gray-300 rounded-md">
//                       <option>Most Recent</option>
//                       <option>Highest Rated</option>
//                       <option>Lowest Rated</option>
//                     </select>
//                   </div>
//                 </div>
                
//                 {/* Reviews */}
//                 <div className="space-y-6">
//                   {/* Review 1 */}
//                   <div className="border-b border-gray-200 pb-6">
//                     <div className="flex justify-between items-start">
//                       <div className="flex items-start">
//                         <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
//                           <img 
//                             src="/api/placeholder/100/100" 
//                             alt="User avatar" 
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Sarah Johnson</p>
//                           <div className="flex items-center mt-1">
//                             <Star className="text-yellow-400" size={14} />
//                             <Star className="text-yellow-400" size={14} />
//                             <Star className="text-yellow-400" size={14} />
//                             <Star className="text-yellow-400" size={14} />
//                             <Star className="text-yellow-400" size={14} />
//                             <span className="text-xs text-gray-500 ml-2">May 10, 2025</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center text-gray-500">
//                         <MessageCircle size={16} className="mr-1" />
//                         <span className="text-xs">2</span>
//                       </div>
//                     </div>
//                     <p className="mt-3 text-gray-600">
//                       James Earl Jones' narration of 1984 is absolutely mesmerizing. His deep, resonant voice brings the dystopian world to life in a way that is both chilling and captivating. The way he portrays Winston's inner conflict and the mounting tension throughout the story is masterful. I've listened to many audiobooks, but this performance stands out as one of the best.
//                     </p>
//                   </div>
                  
//                   {/* Review 2 */}
//                   <div className="border-b border-gray-200 pb-6">
//                     <div className="flex justify-between items-start">
//                       <div className="flex items-start">
//                         <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
//                           <img 
//                             src="/api/placeholder/100/100" 
//                             alt="User avatar" 
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Michael Reynolds</p>
//                           <div className="flex items-center mt-1">
//                             <Star className="text-yellow-400" size={14} />
//                             <Star className="text-yellow-400" size={14} />
//                             <Star className="text-yellow-400" size={14} />
//                             <Star className="text-yellow-400" size={14} />
//                             <Star className="