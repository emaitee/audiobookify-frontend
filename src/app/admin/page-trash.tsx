// 'use client'
// import { useState, useRef, useEffect, JSX } from 'react';
// import { Plus, Upload, X, PlayCircle, Check, AlertTriangle, BarChart2, FileText, Download } from 'lucide-react';
// import { authApiHelper, API_BASE_URL } from '../utils/api';
// import { Book, Episode } from '../page';

// // API service for audiobooks
// const audioBookService = {
//   getRecentUploads: async (page = 1, limit = 10) => {
//     try {
//       const response = await authApiHelper.get(`/books-info/recent?page=${page}&limit=${limit}`);
//       if (!response?.ok) throw new Error('Failed to fetch recent uploads');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching recent uploads:', error);
//       throw error;
    
//     }
//   },

//   getPendingApprovals: async () => {
//     try {
//       const response = await authApiHelper.get(`/books-info/pending`);
//      if (!response?.ok) throw new Error('Failed to fetch pending approvals');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching pending approvals:', error);
//       throw error;
//     }
//   },

//   getStats: async () => {
//     try {
//       const response = await authApiHelper.get(`/stats`);
//      if (!response?.ok) throw new Error('Failed to fetch statistics');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching statistics:', error);
//       throw error;
//     }
//   },

//   approveBook: async (id: string): Promise<{ success: boolean; message: string }> => {
//     try {
//       const response = await authApiHelper.post(`/books/${id}/approve`);
//      if (!response?.ok) throw new Error('Failed to approve book');
//       return await response.json();
//     } catch (error) {
//       console.error('Error approving book:', error);
//       throw error;
//     }
//   },

//   rejectBook: async (id: string, reason: string = 'Rejected by admin'): Promise<{ success: boolean; message: string }> => {
//     try {
//       const response = await authApiHelper.post(`/books/${id}/reject`, { reason });
//      if (!response?.ok) throw new Error('Failed to reject book');
//       return await response.json();
//     } catch (error) {
//       console.error('Error rejecting book:', error);
//       throw error;
//     }
//   },

//   uploadBook: async (formData: FormData): Promise<{ success: boolean; id: string; message: string }> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/books/upload`, {
//         method: 'POST',
//         body: formData,
//       });
//      if (!response?.ok) throw new Error('Failed to upload book');
//       return await response.json();
//     } catch (error) {
//       console.error('Error uploading book:', error);
//       throw error;
//     }
//   },

//   uploadEpisode: async (bookId: string, formData: FormData): Promise<{ success: boolean; id: string; message: string }> => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await fetch(`${API_BASE_URL}/books/${bookId}/episodes`, {
//         method: 'POST',
//         headers: {
//           'x-auth-token': token,
//         },
//         body: formData,
//       });
//      if (!response?.ok) throw new Error('Failed to upload episode');
//       return await response.json();
//     } catch (error) {
//       console.error('Error uploading episode:', error);
//       throw error;
//     }
//   },

//   getBookEpisodes: async (bookId: string) => {
//     try {
//       const response = await authApiHelper.get(`/books/${bookId}/episodes`);
//      if (!response?.ok) throw new Error('Failed to fetch episodes');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching episodes:', error);
//       throw error;
//     }
//   },

// //   uploadBook: async (formData: FormData): Promise<{ success: boolean; id: string; message: string }> => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/books/upload`, {
// //         method: 'POST',
// //         body: formData,
// //       });
// //      if (!response?.ok) throw new Error('Failed to upload book');
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error uploading book:', error);
// //       throw error;
// //     }
// //   },

// //   uploadEpisode: async (bookId: string, formData: FormData): Promise<{ success: boolean; id: string; message: string }> => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/books/${bookId}/episodes`, {
// //         method: 'POST',
// //         body: formData,
// //       });
// //      if (!response?.ok) throw new Error('Failed to upload episode');
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error uploading episode:', error);
// //       throw error;
// //     }
// //   },

// //   getBookEpisodes: async (bookId: string) => {
// //     try {
// //       const response = await authApiHelper.get(`/books/${bookId}/episodes`);
// //      if (!response?.ok) throw new Error('Failed to fetch episodes');
// //       return await response.json();
// //     } catch (error) {
// //       console.error('Error fetching episodes:', error);
// //       throw error;
// //     }
// //   },

//   getAnalytics: async () => {
//     try {
//       const response = await authApiHelper.get(`/analytics`);
//      if (!response?.ok) throw new Error('Failed to fetch analytics');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       throw error;
//     }
//   }
// };

// const UploadModal = ({handleClose,uploadStep,fileInputRef,handleFileSelect,handleFileUploadClick,
//     coverInputRef,handleCoverSelect,coverPreview,handleCoverUploadClick,
//     bookMetadata,setBookMetadata,categories,handleSeriesToggle,uploadingFile,
//     uploadProgress,setUploadStep,uploadAudiobook
// }: {
//     handleClose: () => void;
//     uploadStep: number;
//     fileInputRef: React.RefObject<HTMLInputElement | null>;
//     handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     handleFileUploadClick: () => void;
//     coverInputRef: React.RefObject<HTMLInputElement>;
//     handleCoverSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     coverPreview: string | null;
//     handleCoverUploadClick: () => void;
//     bookMetadata: {
//         title: string;
//         author: string;
//         narrator: string;
//         category: string;
//         description: string;
//         isSeries: boolean;
//         seriesInfo: {
//             totalEpisodes: number;
//             currentEpisode: number;
//             episodeTitle: string;
//         };
//     };
//     setBookMetadata: React.Dispatch<React.SetStateAction<typeof bookMetadata>>;
//     categories: string[];
//     handleSeriesToggle: (isSeries: boolean) => void;
//     uploadingFile: File | null;
//     uploadProgress: number;
//     setUploadStep: React.Dispatch<React.SetStateAction<number>>;
//     uploadAudiobook: () => Promise<void>;
// }) => (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4 text-black">
//       <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold">Upload New Audiobook</h3>
//           <button 
//             className="text-gray-500 hover:text-gray-700"
//             onClick={handleClose}
//           >
//             <X size={20} />
//           </button>
//         </div>
        
//         <div className="mb-6">
//           <div className="flex gap-2 mb-6">
//             <div className={`flex-1 p-2 text-center rounded-lg border-2 ${uploadStep >= 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
//               <div className="flex justify-center mb-1">
//                 {uploadStep > 1 ? <Check size={20} className="text-blue-500" /> : <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">1</span>}
//               </div>
//               <p className="text-sm">Select File</p>
//             </div>
//             <div className={`flex-1 p-2 text-center rounded-lg border-2 ${uploadStep >= 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
//               <div className="flex justify-center mb-1">
//                 {uploadStep > 2 ? <Check size={20} className="text-blue-500" /> : <span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">2</span>}
//               </div>
//               <p className="text-sm">Add Details</p>
//             </div>
//             <div className={`flex-1 p-2 text-center rounded-lg border-2 ${uploadStep >= 3 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
//               <div className="flex justify-center mb-1">
//                 {uploadStep > 3 ? <Check size={20} className="text-blue-500" /> : <span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">3</span>}
//               </div>
//               <p className="text-sm">Upload</p>
//             </div>
//           </div>
          
//           {uploadStep === 1 && (
//             <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
//               <input 
//                 type="file" 
//                 ref={fileInputRef}
//                 onChange={handleFileSelect} 
//                 accept="audio/mp3,audio/mpeg" 
//                 className="hidden" 
//               />
//               <Upload size={40} className="text-gray-400 mb-4" />
//               <h4 className="text-lg font-medium mb-2">Select Audio File</h4>
//               <p className="text-sm text-gray-500 mb-4 text-center">
//                 MP3 format, max 500MB
//               </p>
//               <button 
//                 className="px-6 py-2 bg-blue-500 text-white rounded-lg"
//                 onClick={handleFileUploadClick}
//               >
//                 Browse Files
//               </button>
//             </div>
//           )}
          
//           {uploadStep === 2 && (
//             <div className="grid grid-cols-3 gap-4">
//               <div className="col-span-1">
//                 <div className="border rounded-lg p-4 flex flex-col items-center">
//                   <input 
//                     type="file" 
//                     ref={coverInputRef}
//                     onChange={handleCoverSelect} 
//                     accept="image/*" 
//                     className="hidden" 
//                   />
//                   {coverPreview ? (
//                     <img 
//                       src={coverPreview} 
//                       alt="Cover preview" 
//                       className="w-full aspect-square object-cover rounded mb-2" 
//                     />
//                   ) : (
//                     <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded mb-2">
//                       <FileText size={40} className="text-gray-400" />
//                     </div>
//                   )}
//                   <button 
//                     className="w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
//                     onClick={handleCoverUploadClick}
//                   >
//                     {coverPreview ? 'Change Cover' : 'Upload Cover'}
//                   </button>
//                 </div>
//               </div>
              
//               <div className="col-span-2 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Title</label>
//                   <input 
//                     type="text" 
//                     className="w-full p-2 border rounded"
//                     value={bookMetadata.title}
//                     onChange={(e) => setBookMetadata(prev => ({...prev, title: e.target.value}))}
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Author</label>
//                     <input 
//                       type="text" 
//                       className="w-full p-2 border rounded"
//                       value={bookMetadata.author}
//                       onChange={(e) => setBookMetadata(prev => ({...prev, author: e.target.value}))}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Narrator</label>
//                     <input 
//                       type="text" 
//                       className="w-full p-2 border rounded"
//                       value={bookMetadata.narrator}
//                       onChange={(e) => setBookMetadata(prev => ({...prev, narrator: e.target.value}))}
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Category</label>
//                   <select 
//                     className="w-full p-2 border rounded"
//                     value={bookMetadata.category}
//                     onChange={(e) => setBookMetadata(prev => ({...prev, category: e.target.value}))}
//                   >
//                     {categories.map(cat => (
//                       <option key={cat} value={cat.toLowerCase()}>{cat}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="flex items-center">
//                   <input 
//                     type="checkbox"
//                     id="isSeries"
//                     checked={bookMetadata.isSeries}
//                     onChange={(e) => handleSeriesToggle(e.target.checked)}
//                     className="rounded text-blue-500 mr-2"
//                   />
//                   <label htmlFor="isSeries" className="text-sm">This is a series with multiple episodes</label>
//                 </div>
                
//                 {bookMetadata.isSeries && (
//                   <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Episode Title</label>
//                       <input 
//                         type="text" 
//                         className="w-full p-2 border rounded"
//                         value={bookMetadata.seriesInfo.episodeTitle}
//                         onChange={(e) => setBookMetadata({
//                           ...bookMetadata,
//                           seriesInfo: {
//                             ...bookMetadata.seriesInfo,
//                             episodeTitle: e.target.value
//                           }
//                         })}
//                       />
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-sm font-medium mb-1">Episode Number</label>
//                         <input 
//                           type="number" 
//                           min="1"
//                           className="w-full p-2 border rounded"
//                           value={bookMetadata.seriesInfo.currentEpisode}
//                           onChange={(e) => setBookMetadata({
//                             ...bookMetadata,
//                             seriesInfo: {
//                               ...bookMetadata.seriesInfo,
//                               currentEpisode: parseInt(e.target.value) || 1
//                             }
//                           })}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-1">Total Episodes</label>
//                         <input 
//                           type="number" 
//                           min="1"
//                           className="w-full p-2 border rounded"
//                           value={bookMetadata.seriesInfo.totalEpisodes}
//                           onChange={(e) => setBookMetadata({
//                             ...bookMetadata,
//                             seriesInfo: {
//                               ...bookMetadata.seriesInfo,
//                               totalEpisodes: parseInt(e.target.value) || 1
//                             }
//                           })}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Description</label>
//                   <textarea 
//                     className="w-full p-2 border rounded"
//                     rows={3}
//                     value={bookMetadata.description}
//                     onChange={(e) => setBookMetadata({...bookMetadata, description: e.target.value})}
//                   />
//                 </div>
                
//                 <div className="pt-2">
//                   <p className="text-sm flex items-center gap-1 mb-2">
//                     <span className="font-medium">Selected file:</span> 
//                     {uploadingFile?.name}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {((uploadingFile?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {uploadStep === 3 && (
//             <div className="p-6">
//               <h4 className="text-lg font-medium mb-4">Uploading "{bookMetadata.title}"</h4>
              
//               <div className="mb-8">
//                 <div className="w-full bg-gray-200 h-2 rounded-full">
//                   <div 
//                     className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500 mt-2">
//                   <span>{uploadProgress}% complete</span>
//                   <span>
//                     {uploadingFile 
//                       ? `${Math.round(uploadProgress * uploadingFile.size / 100 / 1024 / 1024).toFixed(2)} MB / ${(uploadingFile.size / 1024 / 1024).toFixed(2)} MB`
//                       : '0 MB / 0 MB'}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
//                 <h5 className="text-sm font-medium mb-2">Details</h5>
//                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
//                   <div>
//                     <span className="text-gray-500">Title:</span> {bookMetadata.title}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Author:</span> {bookMetadata.author}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Narrator:</span> {bookMetadata.narrator}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Category:</span> {bookMetadata.category}
//                   </div>
//                   {bookMetadata.isSeries && (
//                     <>
//                       <div>
//                         <span className="text-gray-500">Series:</span> Yes
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Episode:</span> {bookMetadata.seriesInfo.currentEpisode} of {bookMetadata.seriesInfo.totalEpisodes}
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Episode Title:</span> {bookMetadata.seriesInfo.episodeTitle}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {uploadStep === 4 && (
//             <div className="p-6 text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Check size={32} className="text-green-500" />
//               </div>
//               <h4 className="text-xl font-medium mb-2">Upload Complete!</h4>
//               <p className="text-gray-600 mb-6">
//                 {bookMetadata.isSeries 
//                   ? `Your audiobook episode has been uploaded and is pending approval.`
//                   : `Your audiobook has been uploaded and is pending approval.`}
//               </p>
//               {bookMetadata.isSeries && (
//                 <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
//                   <p className="text-sm mb-2">You can upload more episodes for this series later.</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
        
//         {uploadStep === 1 && (
//           <div className="flex justify-end">
//             <button 
//               className="px-4 py-2 text-red-500"
//               onClick={handleClose}
//             >
//               Cancel
//             </button>
//           </div>
//         )}
        
//         {uploadStep === 2 && (
//           <div className="flex justify-between">
//             <button 
//               className="px-4 py-2 border border-gray-300 rounded"
//               onClick={() => setUploadStep(1)}
//             >
//               Back
//             </button>
//             <button 
//               className="px-6 py-2 bg-blue-500 text-white rounded"
//               onClick={uploadAudiobook}
//               disabled={!bookMetadata.title || !bookMetadata.author}
//             >
//               Start Upload
//             </button>
//           </div>
//         )}
        
//         {uploadStep === 4 && (
//           <div className="flex justify-center">
//             <button 
//               className="px-6 py-2 bg-blue-500 text-white rounded"
//               onClick={handleClose}
//             >
//               Done
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   type EpisodeModalPropTypes = {
//       selectedBook: Book | null;
//       handleCloseEpisodesModal: () => void;
//       renderErrorState: (key: string) => JSX.Element | null;
//       isLoading: boolean;
//       episodes: Episode[];
//       bookMetadata: {
//           seriesInfo: {
//               episodeTitle: string;
//               currentEpisode: number;
//           };
//       };
//       setBookMetadata: React.Dispatch<React.SetStateAction<{
//           seriesInfo: {
//               episodeTitle: string;
//               currentEpisode: number;
//           };
//       }>>;
//       uploadNewEpisode: (bookId: string, file: File) => Promise<void>;
//       isUploadingEpisode: boolean;
//   }

//   const EpisodesModal = ({
//     selectedBook,handleCloseEpisodesModal,renderErrorState,
//     isLoading,episodes,bookMetadata,setBookMetadata,uploadNewEpisode,
//     isUploadingEpisode,
//   }:EpisodeModalPropTypes) => (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4 text-black">
//       <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold">
//             {selectedBook?.title} - Episodes
//           </h3>
//           <button 
//             className="text-gray-500 hover:text-gray-700"
//             onClick={handleCloseEpisodesModal}
//           >
//             <X size={20} />
//           </button>
//         </div>
        
//         <div className="flex-1 overflow-y-auto mb-4">
//           {renderErrorState('episodes')}
//           {isLoading ? (
//             <div className="text-center py-8">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//               <p className="mt-2 text-gray-500">Loading episodes...</p>
//             </div>
//           ) : (
//             <>
//               {episodes.length === 0 ? (
//                 <div className="text-center py-8 border rounded-lg bg-gray-50">
//                   <p className="text-gray-500">No episodes available</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {episodes.map((episode, index) => (
//                     <div key={episode._id || index} className="border rounded-lg p-4 hover:bg-gray-50">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h4 className="font-medium">{episode.title || `Episode ${episode.episodeNumber}`}</h4>
//                           <p className="text-sm text-gray-500">
//                             Episode {episode.episodeNumber} • {episode.duration || 'Unknown duration'}
//                           </p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             File: {episode.audioFile?.split('/').pop() || 'Unknown file'}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <button className="text-blue-500 hover:text-blue-700">
//                             <PlayCircle size={18} />
//                           </button>
//                           <a 
//                             href={episode.audioFile} 
//                             download
//                             className="text-gray-500 hover:text-gray-700"
//                             title="Download episode"
//                           >
//                             <Download size={18} />
//                           </a>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
        
//         {selectedBook?.isSeries && (
//           <div className="border-t pt-4">
//             <h4 className="font-medium mb-3">Upload New Episode</h4>
//             <div className="space-y-3">
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Episode Title</label>
//                   <input 
//                     type="text"
//                     className="w-full p-2 border rounded"
//                     value={bookMetadata.seriesInfo.episodeTitle}
//                     onChange={(e) => setBookMetadata({
//                       ...bookMetadata,
//                       seriesInfo: {
//                         ...bookMetadata.seriesInfo,
//                         episodeTitle: e.target.value
//                       }
//                     })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Episode Number</label>
//                   <input 
//                     type="number"
//                     min="1"
//                     className="w-full p-2 border rounded"
//                     value={bookMetadata.seriesInfo.currentEpisode}
//                     onChange={(e) => setBookMetadata({
//                       ...bookMetadata,
//                       seriesInfo: {
//                         ...bookMetadata.seriesInfo,
//                         currentEpisode: parseInt(e.target.value) || 1
//                       }
//                     })}
//                   />
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <input 
//                   type="file" 
//                   id="episodeUpload"
//                   accept="audio/mp3,audio/mpeg" 
//                   className="hidden"
//                   onChange={async (e) => {
//                     const file = e.target.files ? e.target.files[0] : null;
//                     if (!file) return;
//                     if (file && selectedBook) {
//                       try {
//                         await uploadNewEpisode(selectedBook._id, file);
//                         e.target.value = '';
//                       } catch (error:any) {
//                         alert(`Failed to upload episode: ${error.message}`);
//                       }
//                     }
//                   }}
//                 />
//                 <label 
//                   htmlFor="episodeUpload"
//                   className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 cursor-pointer hover:bg-blue-600"
//                 >
//                   <Upload size={16} />
//                   <span>Select Episode File</span>
//                 </label>
//                 {isUploadingEpisode && (
//                   <div className="text-sm text-gray-500 flex items-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
//                     Uploading...
//                   </div>
//                 )}
//               </div>
//               <p className="text-xs text-gray-500">
//                 MP3 format, max 500MB per episode
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

// const mapRecentUploadToBook = (recentUpload: RecentUpload): Book => ({
//   ...recentUpload,
//   coverImage: recentUpload.coverImage || '/default-cover.jpg',
//   averageRating: recentUpload.averageRating || 0,
//   duration: recentUpload.duration || 0,
//   language: recentUpload.language || 'Unknown',
//   ratings: recentUpload.ratings || [],
// });

// const AdminView = () => {
//   const [activeTab, setActiveTab] = useState('uploads');
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [uploadingFile, setUploadingFile] = useState<File | null>(null);
//   const [bookMetadata, setBookMetadata] = useState({
//     title: '',
//     author: '',
//     narrator: '',
//     category: 'fiction',
//     description: '',
//     isSeries: false,
//     seriesInfo: {
//       totalEpisodes: 1,
//       currentEpisode: 1,
//       episodeTitle: ''
//     }
//   });
//   const [uploadStep, setUploadStep] = useState<number>(1);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const coverInputRef = useRef<HTMLInputElement>(null);
//   const [coverPreview, setCoverPreview] = useState<string | null>(null);
//   const [coverFile, setCoverFile] = useState<File | null>(null);
//   const [selectedBook, setSelectedBook] = useState<Book|null>(null);
//   const [showEpisodesModal, setShowEpisodesModal] = useState<boolean>(false);
//   const [episodes, setEpisodes] = useState<Episode[]>([]);
//   const [isUploadingEpisode, setIsUploadingEpisode] = useState<boolean>(false);
  
//   // State for API data
//   const [pendingApprovals, setPendingApprovals] = useState<ApprovedItem[]>([]);
//   interface RecentUpload {
//     _id: string; // Added _id property
//     id: string;
//     title: string;
//     author: string;
//     narrator: string;
//     status: string;
//     date: string;
//     isSeries?: boolean;
//     seriesInfo?: {
//       totalEpisodes: number;
//       currentEpisode: number;
//       episodeTitle: string;
//     } | null;
//   }
  
//   const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
//   const [audioStats, setAudioStats] = useState({
//     totalBooks: 0,
//     totalHours: 0,
//     pendingApprovals: 0,
//     activeUploads: 0
//   });
//   interface AnalyticsData {
//     recentActivity: {
//       type: string;
//       message: string;
//       time: string;
//     }[];
//   }
  
//   const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
//   const [isLoading, setIsLoading] = useState({
//     uploads: false,
//     approvals: false,
//     stats: false,
//     analytics: false,
//     episodes: false
//   });
//   const [error, setError] = useState({
//     uploads: null,
//     approvals: null,
//     stats: null,
//     analytics: null,
//     episodes: null
//   });
  
//   // Fetch data when component mounts
//   useEffect(() => {
//     fetchStats();
//     fetchRecentUploads();
//   }, []);
  
//   // Fetch data when tab changes
//   useEffect(() => {
//     if (activeTab === 'approvals' && pendingApprovals.length === 0) {
//       fetchPendingApprovals();
//     } else if (activeTab === 'analytics' && !analyticsData) {
//       fetchAnalytics();
//     }
//   }, [activeTab]);

//   // Fetch episodes when modal is shown
//   useEffect(() => {
//     if (showEpisodesModal && selectedBook) {
//       fetchEpisodes(selectedBook._id);
//     }
//   }, [showEpisodesModal, selectedBook]);

//   interface Episode {
//     _id: string;
//     title: string;
//     episodeNumber: number;
//     duration?: string;
//     audioFile?: string;
//     listenCount?: number;
//     averageRating?: number;
//   }

//   interface FetchEpisodesResponse {
//     episodes: Episode[];
//   }

//   const fetchEpisodes = async (bookId: string): Promise<void> => {
//     setIsLoading(prev => ({ ...prev, episodes: true }));
//     setError(prev => ({ ...prev, episodes: null }));
//     try {
//       const data: FetchEpisodesResponse = await audioBookService.getBookEpisodes(bookId);
//       setEpisodes(data.episodes || []);
//     } catch (err: any) {
//       setError(prev => ({ ...prev, episodes: err.message }));
//     } finally {
//       setIsLoading(prev => ({ ...prev, episodes: false }));
//     }
//   };
  
//   // Other fetch functions remain the same...
//   const fetchRecentUploads = async () => {
//     setIsLoading(prev => ({ ...prev, uploads: true }));
//     setError(prev => ({ ...prev, uploads: null }));
//     try {
//       const data = await audioBookService.getRecentUploads();
//       console.log(data.books,'tataxx')
//       setRecentUploads(data || []);
//     } catch (err:any) {
//       setError(prev => ({ ...prev, uploads: err.message }));
//     } finally {
//       setIsLoading(prev => ({ ...prev, uploads: false }));
//     }
//   };
  
//   const fetchPendingApprovals = async () => {
//     setIsLoading(prev => ({ ...prev, approvals: true }));
//     setError(prev => ({ ...prev, approvals: null }));
//     try {
//       const data = await audioBookService.getPendingApprovals();
//       setPendingApprovals(data.books || []);
//     } catch (err:any) {
//       setError(prev => ({ ...prev, approvals: err.message }));
//     } finally {
//       setIsLoading(prev => ({ ...prev, approvals: false }));
//     }
//   };
  
//   const fetchStats = async () => {
//     setIsLoading(prev => ({ ...prev, stats: true }));
//     setError(prev => ({ ...prev, stats: null }));
//     try {
//       const data = await audioBookService.getStats();
//       setAudioStats(data || {
//         totalBooks: 0,
//         totalHours: 0,
//         pendingApprovals: 0,
//         activeUploads: 0
//       });
//     } catch (err:any) {
//       setError(prev => ({ ...prev, stats: err.message }));
//     } finally {
//       setIsLoading(prev => ({ ...prev, stats: false }));
//     }
//   };
  
//   const fetchAnalytics = async () => {
//     setIsLoading(prev => ({ ...prev, analytics: true }));
//     setError(prev => ({ ...prev, analytics: null }));
//     try {
//       const data = await audioBookService.getAnalytics();
//       setAnalyticsData(data || null);
//     } catch (err:any) {
//       setError(prev => ({ ...prev, analytics: err.message }));
//     } finally {
//       setIsLoading(prev => ({ ...prev, analytics: false }));
//     }
//   };

//   interface FileSelectEvent extends React.ChangeEvent<HTMLInputElement> {
//     target: HTMLInputElement & { files: FileList };
//   }

//   const handleFileSelect = (e: FileSelectEvent): void => {
//     const file = e.target.files[0];
//     if (file) {
//       setUploadingFile(file);
//       // Auto-fill title from filename (remove extension)
//       const fileName = file.name.replace(/\.[^/.]+$/, "");
//       setBookMetadata(prev => ({
//         ...prev,
//         title: fileName.replace(/_/g, ' '),
//         seriesInfo: {
//           ...prev.seriesInfo,
//           episodeTitle: `Episode ${prev.seriesInfo.currentEpisode}`
//         }
//       }));
//       setUploadStep(2);
//     }
//   };

//   const handleCoverSelect = (e: FileSelectEvent): void => {
//     const file = e.target.files[0];
//     if (file) {
//       setCoverFile(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           if (typeof e.target.result === 'string') {
//             setCoverPreview(e.target.result);
//           }
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   interface SeriesInfo {
//     episodeTitle: string;
//     currentEpisode: number;
//     totalEpisodes: number;
//   }

//   interface BookMetadata {
//     title: string;
//     author: string;
//     narrator: string;
//     category: string;
//     description: string;
//     isSeries: boolean;
//     seriesInfo: SeriesInfo;
//   }

//   const handleSeriesToggle = (isSeries: boolean): void => {
//     setBookMetadata((prev: BookMetadata) => ({
//       ...prev,
//       isSeries,
//       seriesInfo: {
//         ...prev.seriesInfo,
//         episodeTitle: isSeries ? `Episode ${prev.seriesInfo.currentEpisode}` : ''
//       }
//     }));
//   };

//   const uploadAudiobook = async () => {
//     setUploadProgress(0);
//     setUploadStep(3);
    
//     // Create FormData to send files and metadata
//     const formData = new FormData();
//     if (uploadingFile) {
//         formData.append('audioFile', uploadingFile);
//     }
//     if (coverFile) {
//       formData.append('coverImage', coverFile);
//     }
    
//     // Add metadata
//     formData.append('title', bookMetadata.title);
//     formData.append('author', bookMetadata.author);
//     formData.append('narrator', bookMetadata.narrator);
//     formData.append('category', bookMetadata.category);
//     formData.append('description', bookMetadata.description);
//     formData.append('isSeries', String(bookMetadata.isSeries));
    
//     if (bookMetadata.isSeries) {
//       formData.append('episodeTitle', bookMetadata.seriesInfo.episodeTitle);
//       formData.append('episodeNumber', String(bookMetadata.seriesInfo.currentEpisode));
//       formData.append('totalEpisodes', String(bookMetadata.seriesInfo.totalEpisodes));
//     }
    
//     try {
//       const xhr = new XMLHttpRequest();
      
//       xhr.upload.addEventListener('progress', (event) => {
//         if (event.lengthComputable) {
//           const progressPercent = Math.round((event.loaded / event.total) * 100);
//           setUploadProgress(progressPercent);
//         }
//       });
      
//       xhr.addEventListener('load', () => {
//         if (xhr.status >= 200 && xhr.status < 300) {
//           const response = JSON.parse(xhr.responseText);
          
//           const newUpload = {
//             id: response._id || `new-${Date.now()}`,
//             title: bookMetadata.title,
//             author: bookMetadata.author,
//             narrator: bookMetadata.narrator,
//             status: "pending",
//             date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//             isSeries: bookMetadata.isSeries,
//             seriesInfo: bookMetadata.isSeries ? bookMetadata.seriesInfo : null
//           };
          
//           setRecentUploads(prev => [newUpload, ...prev]);
//           fetchStats();
//           setUploadStep(4);
//         } else {
//           throw new Error('Upload failed');
//         }
//       });
      
//       xhr.addEventListener('error', () => {
//         throw new Error('Network error during upload');
//       });
      
//       xhr.open('POST', `${API_BASE_URL}/books/upload`);
//       const token = localStorage.getItem('token');

//       // Set the Authorization header
// if (token) {
//   xhr.setRequestHeader('x-auth-token', token);
// } else {
//   throw new Error('Authentication token is missing');
// }

//       xhr.send(formData);
      
//     } catch (error:any) {
//       console.error('Error uploading audiobook:', error);
//       alert(`Upload failed: ${error.message}`);
//       setUploadStep(2);
//     }
//   };

// //   const uploadAudiobook = async () => {
// //     setUploadProgress(0);
// //     setUploadStep(3);
    
// //     // Create FormData to send files and metadata
// //     const formData = new FormData();
// //     formData.append('audioFile', uploadingFile);
// //     if (coverFile) {
// //       formData.append('coverImage', coverFile);
// //     }
    
// //     // Add metadata
// //     formData.append('title', bookMetadata.title);
// //     formData.append('author', bookMetadata.author);
// //     formData.append('narrator', bookMetadata.narrator);
// //     formData.append('category', bookMetadata.category);
// //     formData.append('description', bookMetadata.description);
// //     formData.append('isSeries', String(bookMetadata.isSeries));
    
// //     if (bookMetadata.isSeries) {
// //       formData.append('seriesInfo', JSON.stringify(bookMetadata.seriesInfo));
// //     }
    
// //     try {
// //       // Create XMLHttpRequest to track upload progress
// //       const xhr = new XMLHttpRequest();
      
// //       xhr.upload.addEventListener('progress', (event) => {
// //         if (event.lengthComputable) {
// //           const progressPercent = Math.round((event.loaded / event.total) * 100);
// //           setUploadProgress(progressPercent);
// //         }
// //       });
      
// //       xhr.addEventListener('load', () => {
// //         if (xhr.status >= 200 && xhr.status < 300) {
// //           // Success - update UI and data
// //           const response = JSON.parse(xhr.responseText);
          
// //           // Add the new upload to the recent uploads list
// //           const newUpload = {
// //             id: response._id || `new-${Date.now()}`,
// //             title: bookMetadata.title,
// //             author: bookMetadata.author,
// //             narrator: bookMetadata.narrator,
// //             status: "pending",
// //             date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
// //             isSeries: bookMetadata.isSeries,
// //             seriesInfo: bookMetadata.isSeries ? bookMetadata.seriesInfo : null
// //           };
          
// //           setRecentUploads(prev => [newUpload, ...prev]);
          
// //           // Update stats
// //           fetchStats();
          
// //           // Reset state
// //           setUploadStep(4);
// //         } else {
// //           // Error
// //           throw new Error('Upload failed');
// //         }
// //       });
      
// //       xhr.addEventListener('error', () => {
// //         throw new Error('Network error during upload');
// //       });
      
// //       xhr.open('POST', `${API_BASE_URL}/books/upload`);
// //       xhr.send(formData);
      
// //     } catch (error) {
// //       console.error('Error uploading audiobook:', error);
// //       alert(`Upload failed: ${error.message}`);
// //       setUploadStep(2); // Go back to details step
// //     }
// //   };

// interface UploadNewEpisodeResponse {
//   success: boolean;
//   id: string;
//   message: string;
// }

// const uploadNewEpisode = async (bookId: string, file: File): Promise<UploadNewEpisodeResponse> => {
//   setIsUploadingEpisode(true);
  
//   const formData = new FormData();
//   formData.append('audioFile', file);
//   formData.append('episodeTitle', bookMetadata.seriesInfo.episodeTitle);
//   formData.append('episodeNumber', String(bookMetadata.seriesInfo.currentEpisode));
  
//   try {
//     const response: UploadNewEpisodeResponse = await audioBookService.uploadEpisode(bookId, formData);
//     if (response.success) {
//       await fetchEpisodes(bookId);
//       setBookMetadata(prev => ({
//         ...prev,
//         seriesInfo: {
//           ...prev.seriesInfo,
//           currentEpisode: prev.seriesInfo.currentEpisode + 1,
//           episodeTitle: `Episode ${prev.seriesInfo.currentEpisode + 1}`
//         }
//       }));
//     }
//     return response;
//   } catch (error) {
//     console.error('Error uploading episode:', error);
//     throw error;
//   } finally {
//     setIsUploadingEpisode(false);
//   }
// };

// //   const uploadNewEpisode = async (bookId, file) => {
// //     setIsUploadingEpisode(true);
    
// //     const formData = new FormData();
// //     formData.append('audioFile', file);
// //     formData.append('title', bookMetadata.seriesInfo.episodeTitle);
// //     formData.append('episodeNumber', String(bookMetadata.seriesInfo.currentEpisode));
    
// //     try {
// //       const response = await audioBookService.uploadEpisode(bookId, formData);
// //       if (response.success) {
// //         // Refresh episodes list
// //         await fetchEpisodes(bookId);
// //         // Update the book's series info
// //         setBookMetadata(prev => ({
// //           ...prev,
// //           seriesInfo: {
// //             ...prev.seriesInfo,
// //             currentEpisode: prev.seriesInfo.currentEpisode + 1,
// //             episodeTitle: `Episode ${prev.seriesInfo.currentEpisode + 1}`
// //           }
// //         }));
// //       }
// //       return response;
// //     } catch (error) {
// //       console.error('Error uploading episode:', error);
// //       throw error;
// //     } finally {
// //       setIsUploadingEpisode(false);
// //     }
// //   };
  
//   const handleClose = () => {
//     setShowUploadModal(false);
//     setUploadStep(1);
//     setUploadingFile(null);
//     setCoverPreview(null);
//     setCoverFile(null);
//     setBookMetadata({
//       title: '',
//       author: '',
//       narrator: '',
//       category: 'fiction',
//       description: '',
//       isSeries: false,
//       seriesInfo: {
//         totalEpisodes: 1,
//         currentEpisode: 1,
//         episodeTitle: ''
//       }
//     });
//     setUploadProgress(0);
//   };

//   const handleCloseEpisodesModal = () => {
//     setShowEpisodesModal(false);
//     setSelectedBook(null);
//     setEpisodes([]);
//   };
  
//   const handleFileUploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };
  
//   const handleCoverUploadClick = () => {
//     if (coverInputRef.current) {
//       coverInputRef.current.click();
//     }
//   };
  
//   const categories = [
//     'Fiction', 'Non-Fiction', 'Fantasy', 'Mystery', 'Science Fiction', 
//     'Romance', 'Biography', 'Self-Help', 'Business', 'History'
//   ];
  


// //   const EpisodesModal = () => (
// //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4 text-black">
// //       <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
// //         <div className="flex justify-between items-center mb-6">
// //           <h3 className="text-xl font-semibold">
// //             {selectedBook?.title} - Episodes
// //           </h3>
// //           <button 
// //             className="text-gray-500 hover:text-gray-700"
// //             onClick={handleCloseEpisodesModal}
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>
        
// //         <div className="flex-1 overflow-y-auto mb-4">
// //           {renderErrorState('episodes')}
// //           {isLoading.episodes ? (
// //             <div className="text-center py-8">
// //               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
// //               <p className="mt-2 text-gray-500">Loading episodes...</p>
// //             </div>
// //           ) : (
// //             <>
// //               {episodes.length === 0 ? (
// //                 <div className="text-center py-8 border rounded-lg bg-gray-50">
// //                   <p className="text-gray-500">No episodes available</p>
// //                 </div>
// //               ) : (
// //                 <div className="space-y-3">
// //                   {episodes.map((episode, index) => (
// //                     <div key={episode._id || index} className="border rounded-lg p-4 hover:bg-gray-50">
// //                       <div className="flex justify-between items-center">
// //                         <div>
// //                           <h4 className="font-medium">{episode.title || `Episode ${episode.episodeNumber}`}</h4>
// //                           <p className="text-sm text-gray-500">
// //                             Episode {episode.episodeNumber} • {episode.duration || 'Unknown duration'}
// //                           </p>
// //                         </div>
// //                         <div className="flex items-center gap-2">
// //                           <button className="text-blue-500 hover:text-blue-700">
// //                             <PlayCircle size={18} />
// //                           </button>
// //                           <button className="text-gray-500 hover:text-gray-700">
// //                             <Settings size={18} />
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>
        
// //         {selectedBook?.isSeries && (
// //           <div className="border-t pt-4">
// //             <h4 className="font-medium mb-3">Upload New Episode</h4>
// //             <div className="flex items-center gap-3">
// //               <input 
// //                 type="file" 
// //                 id="episodeUpload"
// //                 accept="audio/mp3,audio/mpeg" 
// //                 className="hidden"
// //                 onChange={async (e) => {
// //                   const file = e.target.files[0];
// //                   if (file && selectedBook) {
// //                     try {
// //                       await uploadNewEpisode(selectedbook._id, file);
// //                       e.target.value = ''; // Reset file input
// //                     } catch (error) {
// //                       alert(`Failed to upload episode: ${error.message}`);
// //                     }
// //                   }
// //                 }}
// //               />
// //               <label 
// //                 htmlFor="episodeUpload"
// //                 className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 cursor-pointer hover:bg-blue-600"
// //               >
// //                 <Upload size={16} />
// //                 <span>Select Episode File</span>
// //               </label>
// //               {isUploadingEpisode && (
// //                 <div className="text-sm text-gray-500 flex items-center">
// //                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
// //                   Uploading...
// //                 </div>
// //               )}
// //             </div>
// //             <p className="text-xs text-gray-500 mt-2">
// //               MP3 format, max 500MB per episode
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );

//   interface ApprovedItem {
//     _id: string;
//     [key: string]: any; // To allow additional properties
//   }

//   const handleApprove = async (id: string): Promise<void> => {
//     try {
//       await audioBookService.approveBook(id);
      
//       // Update local state
//       const approvedItem: ApprovedItem | undefined = pendingApprovals.find(item => item._id === id);
      
//       if (approvedItem) {
//         // Remove from pending
//         setPendingApprovals(pendingApprovals.filter(item => item._id !== id));
        
//         // Add to recent uploads with approved status
//         const updatedItem: ApprovedItem = {
//           ...(typeof approvedItem === 'object' && approvedItem !== null ? approvedItem : {}),
//           _id: approvedItem?._id || 'unknown-id',
//           status: 'approved',
//           date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//         };
        
//         setRecentUploads(prev => [
//           {
//             id: updatedItem._id,
//             title: updatedItem.title || '',
//             author: updatedItem.author || '',
//             narrator: updatedItem.narrator || '',
//             status: updatedItem.status || 'pending',
//             date: updatedItem.date || '',
//             isSeries: updatedItem.isSeries || false,
//             seriesInfo: updatedItem.seriesInfo || null,
//           },
//           ...prev,
//         ]);
//       }
      
//       // Refresh stats
//       fetchStats();
      
//     } catch (error: any) {
//       console.error('Error approving book:', error);
//       alert(`Failed to approve book: ${error.message}`);
//     }
//   };

//   interface RejectedItem {
//     _id: string;
//     title?: string;
//     author?: string;
//     narrator?: string;
//     isSeries?: boolean;
//     seriesInfo?: {
//       totalEpisodes: number;
//       currentEpisode: number;
//       episodeTitle: string;
//     } | null;
//     [key: string]: any; // To allow additional properties
//   }

//   const handleReject = async (id: string): Promise<void> => {
//     try {
//       await audioBookService.rejectBook(id, 'Rejected by admin');
      
//       // Update local state
//       const rejectedItem: RejectedItem | undefined = pendingApprovals.find(item => item._id === id);
      
//       if (rejectedItem) {
//         // Remove from pending
//         setPendingApprovals(pendingApprovals.filter(item => item._id !== id));
        
//         // Add to recent uploads with rejected status
//         const updatedItem: RejectedItem = {
//           ...rejectedItem,
//           status: 'rejected',
//           reason: 'Rejected by admin',
//           date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//         };
        
//         setRecentUploads(prev => [
//           {
//             id: updatedItem._id,
//             title: updatedItem.title || '',
//             author: updatedItem.author || '',
//             narrator: updatedItem.narrator || '',
//             status: updatedItem.status || 'pending',
//             date: updatedItem.date || '',
//             isSeries: updatedItem.isSeries || false,
//             seriesInfo: updatedItem.seriesInfo || null,
//           },
//           ...prev,
//         ]);
//       }
      
//       // Refresh stats
//       fetchStats();
      
//     } catch (error: any) {
//       console.error('Error rejecting book:', error);
//       alert(`Failed to reject book: ${error.message}`);
//     }
//   };

//   const handleViewEpisodes = (book:Book) => {
//     setSelectedBook(book);
//     setShowEpisodesModal(true);
//   };

//   // Other existing functions remain the same...
//   const handleLoadMore = async () => {
//     setIsLoading(prev => ({ ...prev, uploads: true }));
//     try {
//       const nextPage = Math.floor(recentUploads.length / 10) + 1;
//       const data = await audioBookService.getRecentUploads(nextPage);
      
//       if (data.books && data.books.length > 0) {
//         setRecentUploads(prev => [...prev, ...data.books]);
//       } else {
//         alert('No more books to load');
//       }
//     } catch (error:any) {
//       console.error('Error loading more books:', error);
//       setError(prev => ({ ...prev, uploads: error.message }));
//     } finally {
//       setIsLoading(prev => ({ ...prev, uploads: false }));
//     }
//   };
  
//   interface LoadingStateProps {
//     key: keyof typeof isLoading;
//   }

//   const renderLoadingState = (key: LoadingStateProps['key']): JSX.Element | null => {
//     if (isLoading[key]) {
//       return (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//           <p className="mt-2 text-gray-500">Loading...</p>
//         </div>
//       );
//     }
//     return null;
//   };
  
//   interface ErrorStateProps {
//     key: keyof typeof error;
//   }

//   const renderErrorState = (key: ErrorStateProps['key']): JSX.Element | null => {
//     if (error[key]) {
//       return (
//         <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
//           <div className="flex items-center gap-2">
//             <AlertTriangle size={20} />
//             <p>Error: {error[key]}</p>
//           </div>
//           <button 
//             className="mt-2 text-blue-500"
//             onClick={() => {
//               if (key === 'uploads') fetchRecentUploads();
//               if (key === 'approvals') fetchPendingApprovals();
//               if (key === 'stats') fetchStats();
//               if (key === 'analytics') fetchAnalytics();
//               if (key === 'episodes' && selectedBook) fetchEpisodes(selectedBook._id);
//             }}
//           >
//             Retry
//           </button>
//         </div>
//       );
//     }
//     return null;
//   };
  
//   return (
//     <div className="flex flex-col gap-6 pb-24">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-bold">Admin Dashboard</h1>
//         <button 
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//           onClick={() => setShowUploadModal(true)}
//         >
//           <Plus size={16} />
//           <span>Upload</span>
//         </button>
//       </div>
      
//       {renderErrorState('stats')}
//       {isLoading.stats ? renderLoadingState('stats') : (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <h3 className="text-2xl font-bold">{audioStats.totalBooks || 0}</h3>
//             <p className="text-sm text-gray-600">Total Books</p>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <h3 className="text-2xl font-bold">{audioStats.totalHours || 0}</h3>
//             <p className="text-sm text-gray-600">Hours of Content</p>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <h3 className="text-2xl font-bold">{audioStats.pendingApprovals || 0}</h3>
//             <p className="text-sm text-gray-600">Pending Approvals</p>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <h3 className="text-2xl font-bold">{audioStats.activeUploads || 0}</h3>
//             <p className="text-sm text-gray-600">Active Uploads</p>
//           </div>
//         </div>
//       )}
      
//       <div className="border-b flex">
//         <button 
//           className={`px-4 py-2 ${activeTab === 'uploads' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('uploads')}
//         >
//           Uploads
//         </button>
//         <button 
//           className={`px-4 py-2 ${activeTab === 'approvals' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('approvals')}
//         >
//           Approvals
//         </button>
//         <button 
//           className={`px-4 py-2 ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('analytics')}
//         >
//           Analytics
//         </button>
//         <button 
//           className={`px-4 py-2 ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
//           onClick={() => setActiveTab('settings')}
//         >
//           Settings
//         </button>
//       </div>
      
//       {activeTab === 'uploads' && (
//         <div>
//           <h2 className="text-lg font-medium mb-4">Recent Uploads</h2>
//           {renderErrorState('uploads')}
//           {isLoading.uploads && recentUploads.length === 0 ? renderLoadingState('uploads') : (
//             <>
//               <div className="rounded-lg border overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
//                       <th className="px-4 py-3 text-left font-medium text-gray-500">Author</th>
//                       <th className="px-4 py-3 text-left font-medium text-gray-500">Narrator</th>
//                       <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
//                       <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
//                       <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {recentUploads.map((book) => (
//                       <tr key={book._id} className="hover:bg-gray-50">
//                         <td className="px-4 py-3">
//                           {book.title}
//                           {book.isSeries && (
//                             <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
//                               Series
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3">{book.author}</td>
//                         <td className="px-4 py-3">{book.narrator}</td>
//                         <td className="px-4 py-3">
//                           <span 
//                             className={`px-2 py-1 rounded-full text-xs ${
//                               book.status === 'approved' ? 'bg-green-100 text-green-800' : 
//                               book.status === 'rejected' ? 'bg-red-100 text-red-800' : 
//                               'bg-yellow-100 text-yellow-800'
//                             }`}
//                           >
//                             {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">{book.date}</td>
//                         <td className="px-4 py-3 text-right">
//                           <button
//                             onClick={() => book.isSeries ? handleViewEpisodes(mapRecentUploadToBook(book)) : null}
//                             className="text-blue-500 hover:text-blue-700 mr-2"
//                             // {/* onClick={() => book.isSeries ? handleViewEpisodes(book) : null} */}
//                             disabled={!book.isSeries}
//                             title={book.isSeries ? "View Episodes" : "Not a series"}
//                           >
//                             <PlayCircle size={18} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
              
//               {recentUploads.length === 0 && (
//                 <div className="text-center py-8 border rounded-lg bg-gray-50">
//                   <p className="text-gray-500">No uploads yet</p>
//                 </div>
//               )}
              
//               {recentUploads.length > 0 && (
//                 <div className="mt-4 text-center">
//                   <button 
//                     className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//                     onClick={handleLoadMore}
//                     disabled={isLoading.uploads}
//                   >
//                     {isLoading.uploads ? 'Loading...' : 'Load More'}
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
      
//       {activeTab === 'approvals' && (
//         <div>
//           <h2 className="text-lg font-medium mb-4">Pending Approvals</h2>
//           {renderErrorState('approvals')}
//           {isLoading.approvals && pendingApprovals.length === 0 ? renderLoadingState('approvals') : (
//             <>
//               <div className="rounded-lg border overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
//                       <th className="px-4 py-3 text-left font-medium text-gray-500">Author</th>
//                       <th className="px-4 py-3 text-left font-medium text-gray-500">Narrator</th>
//                       <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
//                       <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {pendingApprovals.map((book) => (
//                       <tr key={book._id} className="hover:bg-gray-50">
//                         <td className="px-4 py-3">
//                           {book.title}
//                           {book.isSeries && (
//                             <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
//                               Series
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3">{book.author}</td>
//                         <td className="px-4 py-3">{book.narrator}</td>
//                         <td className="px-4 py-3">{book.date}</td>
//                         <td className="px-4 py-3 text-right">
//                           <button 
//                             className="text-green-500 hover:text-green-700 mr-3"
//                             onClick={() => handleApprove(book._id)}
//                           >
//                             <Check size={18} />
//                           </button>
//                           <button 
//                             className="text-red-500 hover:text-red-700"
//                             onClick={() => handleReject(book._id)}
//                           >
//                             <X size={18} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
              
//               {pendingApprovals.length === 0 && (
//                 <div className="text-center py-8 border rounded-lg bg-gray-50">
//                   <p className="text-gray-500">No pending approvals</p>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
      
//       {activeTab === 'analytics' && (
//         <div>
//           <h2 className="text-lg font-medium mb-4">Analytics Dashboard</h2>
//           {renderErrorState('analytics')}
//           {isLoading.analytics ? renderLoadingState('analytics') : (
//             <>
//               {analyticsData ? (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="border rounded-lg p-4">
//                       <h3 className="text-lg font-medium mb-4">Uploads by Category</h3>
//                       <div className="h-64">
//                         <div className="bg-gray-100 h-full flex items-center justify-center">
//                           <BarChart2 size={40} className="text-gray-400" />
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="border rounded-lg p-4">
//                       <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
//                       <div className="space-y-4">
//                         {analyticsData?.recentActivity?.map((activity, index) => (
//                           <div key={index} className="flex items-start gap-3">
//                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                               {activity.type === 'upload' ? <Upload size={16} className="text-blue-500" /> : 
//                                activity.type === 'approve' ? <Check size={16} className="text-green-500" /> :
//                                <X size={16} className="text-red-500" />}
//                             </div>
//                             <div>
//                               <p className="text-sm">{activity.message}</p>
//                               <p className="text-xs text-gray-500">{activity.time}</p>
//                             </div>
//                           </div>
//                         ))}
                        
//                         {(!analyticsData?.recentActivity || analyticsData?.recentActivity?.length === 0) && (
//                           <p className="text-gray-500 text-center py-4">No recent activity</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="border rounded-lg p-4">
//                     <h3 className="text-lg font-medium mb-4">Monthly Uploads</h3>
//                     <div className="h-64">
//                       <div className="bg-gray-100 h-full flex items-center justify-center">
//                         <BarChart2 size={40} className="text-gray-400" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-8 border rounded-lg bg-gray-50">
//                   <p className="text-gray-500">No analytics data available</p>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
      
//       {activeTab === 'settings' && (
//         <div>
//           <h2 className="text-lg font-medium mb-4">Settings</h2>
          
//           <div className="bg-white rounded-lg border p-6 space-y-6">
//             <div>
//               <h3 className="font-medium text-lg mb-4">General Settings</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">API Base URL</label>
//                   <input 
//                     type="text" 
//                     className="w-full md:w-1/2 p-2 border rounded"
//                     defaultValue={API_BASE_URL}
//                   />
//                   <p className="text-xs text-gray-500 mt-1">The base URL for API requests</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Upload Size Limit (MB)</label>
//                   <input 
//                     type="number" 
//                     className="w-full md:w-1/4 p-2 border rounded"
//                     defaultValue={500}
//                   />
//                 </div>
                
//                 <div className="flex items-center">
//                   <input 
//                     type="checkbox"
//                     id="autoApprove"
//                     className="rounded text-blue-500" 
//                     defaultChecked={false}
//                   />
//                   <label htmlFor="autoApprove" className="ml-2 text-sm">Auto-approve uploads</label>
//                 </div>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="font-medium text-lg mb-4">Email Notifications</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <input 
//                     type="checkbox"
//                     id="newUploadNotify"
//                     className="rounded text-blue-500" 
//                     defaultChecked={true}
//                   />
//                   <label htmlFor="newUploadNotify" className="ml-2 text-sm">Notify on new upload</label>
//                 </div>
                
//                 <div className="flex items-center">
//                   <input 
//                     type="checkbox"
//                     id="approvalNotify"
//                     className="rounded text-blue-500" 
//                     defaultChecked={true}
//                   />
//                   <label htmlFor="approvalNotify" className="ml-2 text-sm">Notify when book is approved/rejected</label>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Admin Email</label>
//                   <input 
//                     type="email" 
//                     className="w-full md:w-1/2 p-2 border rounded"
//                     defaultValue="admin@example.com"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="mt-6 flex justify-end">
//             <button className="px-6 py-2 bg-blue-500 text-white rounded">
//               Save Settings
//             </button>
//           </div>
//         </div>
//       )}
      
//       {showUploadModal && <UploadModal
//       handleClose={handleClose} uploadStep={uploadStep} fileInputRef={fileInputRef} handleFileSelect={handleFileSelect} handleFileUploadClick={handleFileUploadClick} 
//       coverInputRef={coverInputRef} handleCoverSelect={handleCoverSelect} coverPreview={coverPreview} handleCoverUploadClick={handleCoverUploadClick} 
//       bookMetadata={bookMetadata} setBookMetadata={setBookMetadata} categories={categories} handleSeriesToggle={handleSeriesToggle} uploadingFile={uploadingFile} 
//       uploadProgress={uploadProgress} setUploadStep={setUploadStep} uploadAudiobook={uploadAudiobook}
//        />}
//       {showEpisodesModal && <EpisodesModal 
//       selectedBook={selectedBook} handleCloseEpisodesModal={handleCloseEpisodesModal} renderErrorState={renderErrorState} 
//     isLoading={isLoading} episodes={episodes} bookMetadata={bookMetadata} setBookMetadata={setBookMetadata} uploadNewEpisode={uploadNewEpisode} 
//     isUploadingEpisode={isUploadingEpisode} 
//       />}
//     </div>
//   );
// };

// export default AdminView;