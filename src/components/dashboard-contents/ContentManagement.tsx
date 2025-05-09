'use client'
import { AlertTriangle, Book, Download, Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react";
import { useState, useEffect, useRef, JSX } from "react";
import { UploadCloud, Star } from 'lucide-react';
import { audioBookService } from '@/services/audioBookService';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import UploadModal from "./UploadModal";
import EpisodesModal from "./EpisodeModal";
import { AnalyticsData, ApprovedItem, BookMetadata, RecentUpload, Stats } from "@/app/[locale]/admin/page";
import { Book as BookType, Episode } from "@/app/[locale]/page";
import { API_BASE_URL } from "@/app/utils/api";

interface Audiobook {
  _id: string;
  title: string;
  author: string;
  narrator?: string;
  category: string;
  description?: string;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  averageRating?: number;
  listenCount?: number;
  narrationLanguage: string;
  coverImage?: string;
  audioFile?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContentManagement() {
    const router = useRouter();
    const [activeView, setActiveView] = useState<'all' | 'published' | 'draft' | 'review'>('all');
    const [contentItems, setContentItems] = useState<Audiobook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Record<string, string | null>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('newest');

      const [activeTab, setActiveTab] = useState<'uploads' | 'approvals' | 'analytics' | 'settings'>('uploads');
      const [uploadProgress, setUploadProgress] = useState(0);
      const [showUploadModal, setShowUploadModal] = useState(false);
      const [uploadingFile, setUploadingFile] = useState<File | null>(null);
      const [bookMetadata, setBookMetadata] = useState<BookMetadata>({
        title: '',
        author: '',
        slug: '',
        narrator: '',
        category: 'fiction',
        description: '',
        narrationLanguage: '',
        isSeries: false,
        seriesInfo: {
          totalEpisodes: 1,
          currentEpisode: 1,
          episodeTitle: ''
        }
      });
      const [uploadStep, setUploadStep] = useState<number>(1);
      const fileInputRef = useRef<HTMLInputElement>(null);
      const coverInputRef = useRef<HTMLInputElement>(null);
      const [coverPreview, setCoverPreview] = useState<string | null>(null);
      const [coverFile, setCoverFile] = useState<File | null>(null);
      const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
      const [showEpisodesModal, setShowEpisodesModal] = useState<boolean>(false);
      const [episodes, setEpisodes] = useState<Episode[]>([]);
      const [isUploadingEpisode, setIsUploadingEpisode] = useState<boolean>(false);

       // State for API data
        const [pendingApprovals, setPendingApprovals] = useState<ApprovedItem[]>([]);
        const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
        const [audioStats, setAudioStats] = useState<Stats>({
          totalBooks: 0,
          totalHours: 0,
          pendingApprovals: 0,
          activeUploads: 0
        });
        const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
        const [isLoading, setIsLoading] = useState({
          uploads: false,
          approvals: false,
          stats: false,
          analytics: false,
          episodes: false
        });
        const [errors, setErrors] = useState<Record<string, string | null>>({
          uploads: null,
          approvals: null,
          stats: null,
          analytics: null,
          episodes: null
        });

        const fetchEpisodes = async (bookId: string): Promise<void> => {
            setIsLoading(prev => ({ ...prev, episodes: true }));
            setErrors(prev => ({ ...prev, episodes: null }));
            try {
              const data = await audioBookService.getBookEpisodes(bookId);
              setEpisodes(data.episodes || []);
            } catch (err: any) {
              setErrors(prev => ({ ...prev, episodes: err.message }));
            } finally {
              setIsLoading(prev => ({ ...prev, episodes: false }));
            }
          };
          
          const fetchRecentUploads = async () => {
            setIsLoading(prev => ({ ...prev, uploads: true }));
            setErrors(prev => ({ ...prev, uploads: null }));
            try {
              const data = await audioBookService.getRecentUploads();
              setRecentUploads(data?.books || []);
            } catch (err: any) {
              setErrors(prev => ({ ...prev, uploads: err.message }));
            } finally {
              setIsLoading(prev => ({ ...prev, uploads: false }));
            }
          };
          
          const fetchPendingApprovals = async () => {
            setIsLoading(prev => ({ ...prev, approvals: true }));
            setErrors(prev => ({ ...prev, approvals: null }));
            try {
              const data = await audioBookService.getPendingApprovals();
              setPendingApprovals(data.books || []);
            } catch (err: any) {
              setErrors(prev => ({ ...prev, approvals: err.message }));
            } finally {
              setIsLoading(prev => ({ ...prev, approvals: false }));
            }
          };
          
          const fetchStats = async () => {
            setIsLoading(prev => ({ ...prev, stats: true }));
            setErrors(prev => ({ ...prev, stats: null }));
            try {
              const data = await audioBookService.getStats();
              setAudioStats(data || {
                totalBooks: 0,
                totalHours: 0,
                pendingApprovals: 0,
                activeUploads: 0
              });
            } catch (err: any) {
              setErrors(prev => ({ ...prev, stats: err.message }));
            } finally {
              setIsLoading(prev => ({ ...prev, stats: false }));
            }
          };
          
          const fetchAnalytics = async () => {
            setIsLoading(prev => ({ ...prev, analytics: true }));
            setErrors(prev => ({ ...prev, analytics: null }));
            try {
              const data = await audioBookService.getAnalytics();
              setAnalyticsData(data || null);
            } catch (err: any) {
              setErrors(prev => ({ ...prev, analytics: err.message }));
            } finally {
              setIsLoading(prev => ({ ...prev, analytics: false }));
            }
          };

       const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
          const file = e.target.files?.[0];
          if (file) {
            setUploadingFile(file);
            // Auto-fill title from filename (remove extension)
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            setBookMetadata(prev => ({
              ...prev,
              title: fileName.replace(/_/g, ' '),
              seriesInfo: {
                ...prev.seriesInfo,
                episodeTitle: `Episode ${prev.seriesInfo.currentEpisode}`
              }
            }));
            setUploadStep(2);
          }
        };
      
        const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
          const file = e.target.files?.[0];
          if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result && typeof e.target.result === 'string') {
                setCoverPreview(e.target.result);
              }
            };
            reader.readAsDataURL(file);
          }
        };
      
        const handleSeriesToggle = (isSeries: boolean): void => {
          setBookMetadata(prev => ({
            ...prev,
            isSeries,
            seriesInfo: {
              ...prev.seriesInfo,
              episodeTitle: isSeries ? `Episode ${prev.seriesInfo.currentEpisode}` : ''
            }
          }));
        };
      
        const uploadAudiobook = async () => {
          if (!uploadingFile) return;
          
          setUploadProgress(0);
          setUploadStep(3);
          
          // Create FormData to send files and metadata
          const formData = new FormData();
          formData.append('audioFile', uploadingFile);
          if (coverFile) {
            formData.append('coverImage', coverFile);
          }
          
          // Add metadata
          formData.append('title', bookMetadata.title);
          formData.append('author', bookMetadata.author);
          formData.append('narrator', bookMetadata.narrator);
          formData.append('category', bookMetadata.category);
          formData.append('narrationLanguage', bookMetadata.narrationLanguage);
          formData.append('description', bookMetadata.description);
          formData.append('isSeries', String(bookMetadata.isSeries));
          
          if (bookMetadata.isSeries) {
            formData.append('episodeTitle', bookMetadata.seriesInfo.episodeTitle);
            formData.append('episodeNumber', String(bookMetadata.seriesInfo.currentEpisode));
            formData.append('totalEpisodes', String(bookMetadata.seriesInfo.totalEpisodes));
          }
          
          try {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (event) => {
              if (event.lengthComputable) {
                const progressPercent = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(progressPercent);
              }
            });
            
            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                
                // const newUpload: RecentUpload = {
                //   _id: response._id || `new-${Date.now()}`,
                //   id: response._id || `new-${Date.now()}`,
                //   title: bookMetadata.title,
                //   slug: bookMetadata.slug,
                //   author: bookMetadata.author,
                //   narrator: bookMetadata.narrator,
                //   status: "pending",
                //   date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                //   isSeries: bookMetadata.isSeries,
                //   seriesInfo: bookMetadata.isSeries ? bookMetadata.seriesInfo : null
                // };
                
                // setRecentUploads(prev => [newUpload, ...prev]);
                fetchRecentUploads()
                fetchStats();
                setUploadStep(4);
              } else {
                throw new Error('Upload failed');
              }
            });
            
            xhr.addEventListener('error', () => {
              throw new Error('Network error during upload');
            });
            
            xhr.open('POST', `${API_BASE_URL}/books/upload`);
            const token = localStorage.getItem('token') || "";
      
            if (token) {
              xhr.setRequestHeader('x-auth-token', token);
            } else {
              throw new Error('Authentication token is missing');
            }
      
            xhr.send(formData);
            
          } catch (error: any) {
            console.error('Error uploading audiobook:', error);
            alert(`Upload failed: ${error.message}`);
            setUploadStep(2);
          }
        };
      
        const uploadNewEpisode = async (bookId: string, file: File): Promise<{ success: boolean; id: string; message: string }> => {
          setIsUploadingEpisode(true);
          
          const formData = new FormData();
          formData.append('audioFile', file);
          formData.append('episodeTitle', bookMetadata.seriesInfo.episodeTitle);
          formData.append('episodeNumber', String(bookMetadata.seriesInfo.currentEpisode));
          
          try {
            const response = await audioBookService.uploadEpisode(bookId, formData);
            if (response.success) {
              await fetchEpisodes(bookId);
              setBookMetadata(prev => ({
                ...prev,
                seriesInfo: {
                  ...prev.seriesInfo,
                  currentEpisode: prev.seriesInfo.currentEpisode + 1,
                  episodeTitle: `Episode ${prev.seriesInfo.currentEpisode + 1}`
                }
              }));
            }
            return response;
          } catch (error) {
            console.error('Error uploading episode:', error);
            throw error;
          } finally {
            setIsUploadingEpisode(false);
          }
        };

      const handleClose = () => {
        setShowUploadModal(false);
        setUploadStep(1);
        setUploadingFile(null);
        setCoverPreview(null);
        setCoverFile(null);
        setBookMetadata({
          title: '',
          author: '',
          slug: '',
          narrator: '',
          category: 'fiction',
          description: '',
          isSeries: false,
          narrationLanguage: '',
          seriesInfo: {
            totalEpisodes: 1,
            currentEpisode: 1,
            episodeTitle: ''
          }
        });
        setUploadProgress(0);
      };
    
      const handleCloseEpisodesModal = () => {
        setShowEpisodesModal(false);
        setSelectedBook(null);
        setEpisodes([]);
      };

      const handleFileUploadClick = () => {
        fileInputRef.current?.click();
      };
      
      const handleCoverUploadClick = () => {
        coverInputRef.current?.click();
      };

      const categories = [
        'Fiction', 'Non-Fiction', 'Fantasy', 'Mystery', 'Science Fiction', 
        'Romance', 'Biography', 'Self-Help', 'Business', 'History'
      ];
    
      

    // Fetch content items
    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const status = activeView === 'all' ? undefined : 
                              activeView === 'published' ? 'approved' :
                              activeView === 'review' ? 'pending' : 'draft';

                const response = await audioBookService.getAllBooks({
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchQuery,
                    status,
                    category: selectedCategory === 'all' ? undefined : selectedCategory,
                    sort: sortOption
                });
                
                setContentItems(
                    response.books.map((book: Partial<Audiobook>) => ({
                        ...book,
                        narrationLanguage: book.narrationLanguage || 'Unknown', // Provide a default value for missing properties
                    })) as Audiobook[]
                );
                setTotalPages(response.pages);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch content');
                setLoading(false);
                toast.error(err.message || 'Failed to fetch content');
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchContent();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [activeView, currentPage, searchQuery, selectedCategory, sortOption]);

    // Handle book status change (approve/reject)
    const handleStatusChange = async (id: string, action: 'approve' | 'reject') => {
        try {
            if (action === 'approve') {
                await audioBookService.approveBook(id);
                toast.success('Audiobook approved successfully');
            } else {
                await audioBookService.rejectBook(id);
                toast.success('Audiobook rejected');
            }
            
            // Refresh the list
            setCurrentPage(1);
        } catch (err: any) {
            toast.error(err.message || 'Failed to update status');
        }
    };

    // Handle delete book
    const handleDelete = async (id: string) => {
        try {
            if (confirm('Are you sure you want to delete this audiobook?')) {
                await audioBookService.deleteBook(id);
                toast.success('Audiobook deleted successfully');
                setContentItems(contentItems.filter(item => item._id !== id));
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete book');
        }
    };

    // Map status to display text
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'approved': return 'Published';
            case 'pending': return 'Review';
            case 'draft': return 'Draft';
            case 'rejected': return 'Rejected';
            default: return status;
        }
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderErrorState = (key: string): JSX.Element | null => {
        if (error[key]) {
          return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} />
                <p>Error: {error&&error[key]}</p>
              </div>
              <button 
                className="mt-2 text-indigo-500"
                onClick={() => {
                  if (key === 'uploads') fetchRecentUploads();
                  if (key === 'approvals') fetchPendingApprovals();
                  if (key === 'stats') fetchStats();
                  if (key === 'analytics') fetchAnalytics();
                  if (key === 'episodes' && selectedBook) fetchEpisodes(selectedBook._id);
                }}
              >
                Retry
              </button>
            </div>
          );
        }
        return null;
      };

    return (
      <div className="p-4 sm:p-6">
        {/* Header and Add New button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Content Management</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            onClick={() => setShowUploadModal(true)}
          >
            <Plus size={16} className="mr-2" />
            Add New Audiobook
          </button>
        </div>
        
        {/* View tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="border-b border-gray-200 min-w-max sm:min-w-0">
            <nav className="flex -mb-px">
              {['all', 'published', 'draft', 'review'].map((view) => (
                <button
                  key={view}
                  className={`py-3 px-3 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                    activeView === view 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setActiveView(view as any);
                    setCurrentPage(1);
                  }}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 w-full sm:w-64">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search content..."
                  className="bg-transparent border-none focus:outline-none text-sm flex-grow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="fiction">Fiction</option>
                  <option value="mystery">Mystery</option>
                  <option value="science-fiction">Science Fiction</option>
                  <option value="self-help">Self Help</option>
                  <option value="history">History</option>
                </select>
                
                <select 
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex items-center bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full sm:w-auto justify-center">
                <UploadCloud size={16} className="mr-1" />
                Import
              </button>
              <button className="flex items-center bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full sm:w-auto justify-center">
                <Download size={16} className="mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading and error states */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {/* Content table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listens</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contentItems.length > 0 ? (
                    contentItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                              {item.coverImage ? (
                                <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <Book size={16} className="text-gray-500" />
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.author}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.category}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                            {getStatusDisplay(item.status)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.averageRating ? (
                            <div className="flex items-center">
                              <Star size={16} className="text-yellow-400 mr-1" />
                              <span>{item.averageRating.toFixed(1)}</span>
                            </div>
                          ) : "-"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.listenCount ? item.listenCount.toLocaleString() : "-"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => router.push(`/content-management/edit/${item._id}`)}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-900"
                              onClick={() => router.push(`/content-management/${item._id}`)}
                            >
                              <Eye size={16} />
                            </button>
                            {item.status === 'pending' && (
                              <>
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => handleStatusChange(item._id, 'approve')}
                                >
                                  Approve
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleStatusChange(item._id, 'reject')}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete(item._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        No content found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {contentItems.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, contentItems.length)}</span> of{' '}
                      <span className="font-medium">{totalPages * itemsPerPage}</span> results
                    </p>
                  </div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : 
                                     currentPage >= totalPages - 2 ? totalPages - 4 + i : 
                                     currentPage - 2 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={currentPage >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        )}


        {showUploadModal && (
            <UploadModal
              handleClose={handleClose}
              uploadStep={uploadStep}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              handleFileSelect={handleFileSelect}
              handleFileUploadClick={handleFileUploadClick}
              coverInputRef={coverInputRef as React.RefObject<HTMLInputElement>}
              handleCoverSelect={handleCoverSelect}
              coverPreview={coverPreview}
              handleCoverUploadClick={handleCoverUploadClick}
              bookMetadata={bookMetadata}
              setBookMetadata={setBookMetadata as React.Dispatch<React.SetStateAction<BookMetadata>>}
              categories={categories}
              handleSeriesToggle={handleSeriesToggle}
              uploadingFile={uploadingFile}
              uploadProgress={uploadProgress}
              setUploadStep={setUploadStep}
              uploadAudiobook={uploadAudiobook}
            />
          )}
          
          {showEpisodesModal && (
            <EpisodesModal
              selectedBook={selectedBook}
              handleCloseEpisodesModal={handleCloseEpisodesModal}
              renderErrorState={renderErrorState}
              isLoading={isLoading.episodes}
              episodes={episodes}
              bookMetadata={{
                seriesInfo: {
                  episodeTitle: bookMetadata.seriesInfo.episodeTitle,
                  currentEpisode: bookMetadata.seriesInfo.currentEpisode
                }
              }}
              setBookMetadata={(update) => {
                if (typeof update === 'function') {
                  setBookMetadata(prev => ({
                    ...prev,
                    seriesInfo: {
                      ...prev.seriesInfo,
                      ...(update as (prev: { seriesInfo: { episodeTitle: string; currentEpisode: number } }) => { seriesInfo: { episodeTitle: string; currentEpisode: number } })({
                        seriesInfo: {
                          episodeTitle: prev.seriesInfo.episodeTitle,
                          currentEpisode: prev.seriesInfo.currentEpisode
                        }
                      }).seriesInfo
                    }
                  }));
                } else {
                  setBookMetadata(prev => ({
                    ...prev,
                    seriesInfo: {
                      ...prev.seriesInfo,
                      ...update.seriesInfo
                    }
                  }));
                }
              }}
              uploadNewEpisode={uploadNewEpisode}
              isUploadingEpisode={isUploadingEpisode}
            />
          )}
      </div>
    );
}