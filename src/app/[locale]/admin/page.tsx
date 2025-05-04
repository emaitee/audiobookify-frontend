'use client'
import { useState, useRef, useEffect, JSX } from 'react';
import { Plus, Upload, X, PlayCircle, Check, AlertTriangle, BarChart2, FileText, Download } from 'lucide-react';
import { API_BASE_URL, authApiHelper } from '@/app/utils/api';
import { Book, Episode } from '../page';
import EpisodesModal from '@/components/dashboard-contents/EpisodeModal';
import UploadModal from '@/components/dashboard-contents/UploadModal';

// Define types for API responses
export interface ApiResponse {
  success: boolean;
  message?: string;
  [key: string]: any;
}

export interface RecentUpload {
  _id: string;
  id: string;
  title: string;
  author: string;
  narrator: string;
  status: string;
  isSeries: boolean; // Ensure this is explicitly boolean
  seriesInfo?: {
    totalEpisodes: number;
    currentEpisode: number;
    episodeTitle: string;
  } | null;
  coverImage?: string;
  averageRating?: string;
  duration?: number;
  narrationLanguage?: string;
  ratings?: any[];
  createdAt?: string;
  date?: string;
}

export interface ApprovedItem {
  _id: string;
  title: string;
  author: string;
  narrator: string;
  date: string;
  isSeries: boolean;
  seriesInfo?: {
    totalEpisodes: number;
    currentEpisode: number;
    episodeTitle: string;
  } | null;
  [key: string]: any;
}

export interface AnalyticsData {
  recentActivity: {
    type: string;
    message: string;
    time: string;
  }[];
}

export interface Stats {
  totalBooks: number;
  totalHours: number;
  pendingApprovals: number;
  activeUploads: number;
}

export  interface BookMetadata {
  title: string;
  author: string;
  narrator: string;
  category: string;
  description: string;
  isSeries: boolean;
  narrationLanguage: string;
  seriesInfo: {
    totalEpisodes: number;
    currentEpisode: number;
    episodeTitle: string;
  };
}



// API service for audiobooks
const audioBookService = {
  getRecentUploads: async (page = 1, limit = 10): Promise<{ books: RecentUpload[] }> => {
    try {
      const response = await authApiHelper.get(`/books-info/recent?page=${page}&limit=${limit}`);
      if (!response?.ok) throw new Error('Failed to fetch recent uploads');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      throw error;
    }
  },

  getPendingApprovals: async (): Promise<{ books: ApprovedItem[] }> => {
    try {
      const response = await authApiHelper.get(`/books-info/pending`);
      if (!response?.ok) throw new Error('Failed to fetch pending approvals');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  },

  getStats: async (): Promise<Stats> => {
    try {
      const response = await authApiHelper.get(`/stats`);
      if (!response?.ok) throw new Error('Failed to fetch statistics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  approveBook: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await authApiHelper.post(`/books/${id}/approve`);
      if (!response?.ok) throw new Error('Failed to approve book');
      return await response.json();
    } catch (error) {
      console.error('Error approving book:', error);
      throw error;
    }
  },

  rejectBook: async (id: string, reason: string = 'Rejected by admin'): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await authApiHelper.post(`/books/${id}/reject`, { reason });
      if (!response?.ok) throw new Error('Failed to reject book');
      return await response.json();
    } catch (error) {
      console.error('Error rejecting book:', error);
      throw error;
    }
  },

  uploadBook: async (formData: FormData): Promise<{ success: boolean; id: string; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response?.ok) throw new Error('Failed to upload book');
      return await response.json();
    } catch (error) {
      console.error('Error uploading book:', error);
      throw error;
    }
  },

  uploadEpisode: async (bookId: string, formData: FormData): Promise<{ success: boolean; id: string; message: string }> => {
    const token = localStorage.getItem('token') || "";
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/episodes`, {
        method: 'POST',
        headers: {
          'x-auth-token': token || '',
        },
        body: formData,
      });
      if (!response?.ok) throw new Error('Failed to upload episode');
      return await response.json();
    } catch (error) {
      console.error('Error uploading episode:', error);
      throw error;
    }
  },

  getBookEpisodes: async (bookId: string): Promise<{ episodes: Episode[] }> => {
    try {
      const response = await authApiHelper.get(`/books/${bookId}/episodes`);
      if (!response?.ok) throw new Error('Failed to fetch episodes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching episodes:', error);
      throw error;
    }
  },

  getAnalytics: async (): Promise<AnalyticsData> => {
    try {
      const response = await authApiHelper.get(`/analytics`);
      if (!response?.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
};





const mapRecentUploadToBook = (recentUpload: RecentUpload): Book => ({
  ...recentUpload,
  coverImage: recentUpload.coverImage || '/default-cover.jpg',
  averageRating: recentUpload.averageRating||"0",
  duration: recentUpload.duration || 0,
  narrationLanguage: recentUpload.narrationLanguage || 'Unknown',
  ratings: recentUpload.ratings || [],
});

const AdminView = () => {
  const [activeTab, setActiveTab] = useState<'uploads' | 'approvals' | 'analytics' | 'settings'>('uploads');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [bookMetadata, setBookMetadata] = useState<BookMetadata>({
    title: '',
    author: '',
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
  const [uploadStep, setUploadStep] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
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
  const [error, setError] = useState<Record<string, string | null>>({
    uploads: null,
    approvals: null,
    stats: null,
    analytics: null,
    episodes: null
  });
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchStats();
    fetchRecentUploads();
  }, []);
  
  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'approvals' && pendingApprovals.length === 0) {
      fetchPendingApprovals();
    } else if (activeTab === 'analytics' && !analyticsData) {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Fetch episodes when modal is shown
  useEffect(() => {
    if (showEpisodesModal && selectedBook) {
      fetchEpisodes(selectedBook._id);
    }
  }, [showEpisodesModal, selectedBook]);

  const fetchEpisodes = async (bookId: string): Promise<void> => {
    setIsLoading(prev => ({ ...prev, episodes: true }));
    setError(prev => ({ ...prev, episodes: null }));
    try {
      const data = await audioBookService.getBookEpisodes(bookId);
      setEpisodes(data.episodes || []);
    } catch (err: any) {
      setError(prev => ({ ...prev, episodes: err.message }));
    } finally {
      setIsLoading(prev => ({ ...prev, episodes: false }));
    }
  };
  
  const fetchRecentUploads = async () => {
    setIsLoading(prev => ({ ...prev, uploads: true }));
    setError(prev => ({ ...prev, uploads: null }));
    try {
      const data = await audioBookService.getRecentUploads();
      setRecentUploads(data.books || []);
    } catch (err: any) {
      setError(prev => ({ ...prev, uploads: err.message }));
    } finally {
      setIsLoading(prev => ({ ...prev, uploads: false }));
    }
  };
  
  const fetchPendingApprovals = async () => {
    setIsLoading(prev => ({ ...prev, approvals: true }));
    setError(prev => ({ ...prev, approvals: null }));
    try {
      const data = await audioBookService.getPendingApprovals();
      setPendingApprovals(data.books || []);
    } catch (err: any) {
      setError(prev => ({ ...prev, approvals: err.message }));
    } finally {
      setIsLoading(prev => ({ ...prev, approvals: false }));
    }
  };
  
  const fetchStats = async () => {
    setIsLoading(prev => ({ ...prev, stats: true }));
    setError(prev => ({ ...prev, stats: null }));
    try {
      const data = await audioBookService.getStats();
      setAudioStats(data || {
        totalBooks: 0,
        totalHours: 0,
        pendingApprovals: 0,
        activeUploads: 0
      });
    } catch (err: any) {
      setError(prev => ({ ...prev, stats: err.message }));
    } finally {
      setIsLoading(prev => ({ ...prev, stats: false }));
    }
  };
  
  const fetchAnalytics = async () => {
    setIsLoading(prev => ({ ...prev, analytics: true }));
    setError(prev => ({ ...prev, analytics: null }));
    try {
      const data = await audioBookService.getAnalytics();
      setAnalyticsData(data || null);
    } catch (err: any) {
      setError(prev => ({ ...prev, analytics: err.message }));
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
    formData.append('description', bookMetadata.description);
    formData.append('narrationLanguage', bookMetadata.narrationLanguage);
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
          
          const newUpload: RecentUpload = {
            _id: response._id || `new-${Date.now()}`,
            id: response?.id || `new-${Date.now()}`,
            title: bookMetadata.title,
            author: bookMetadata.author,
            narrator: bookMetadata.narrator,
            status: "pending",
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            isSeries: bookMetadata.isSeries,
            // seriesInfo: bookMetadata.isSeries ? bookMetadata.seriesInfo : null
          };
          
          setRecentUploads(prev => [newUpload, ...prev]);
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

  const handleApprove = async (id: string): Promise<void> => {
    try {
      await audioBookService.approveBook(id);
      
      // Update local state
      const approvedItem = pendingApprovals.find(item => item._id === id);
      
      if (approvedItem) {
        // Remove from pending
        setPendingApprovals(pendingApprovals.filter(item => item._id !== id));
        
        // Create a new RecentUpload from the ApprovedItem
        const updatedItem: RecentUpload = {
          _id: approvedItem._id,
          id: approvedItem._id,
          title: approvedItem.title,
          author: approvedItem.author,
          narrator: approvedItem.narrator,
          status: 'approved',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          isSeries: approvedItem.isSeries,
          seriesInfo: approvedItem.seriesInfo || null
        };
        
        setRecentUploads(prev => [updatedItem, ...prev]);
      }
      
      // Refresh stats
      fetchStats();
      
    } catch (error: any) {
      console.error('Error approving book:', error);
      alert(`Failed to approve book: ${error.message}`);
    }
  };

  const handleReject = async (id: string): Promise<void> => {
    try {
      await audioBookService.rejectBook(id, 'Rejected by admin');
      
      // Update local state
      const rejectedItem = pendingApprovals.find(item => item._id === id);
      
      if (rejectedItem) {
        // Remove from pending
        setPendingApprovals(pendingApprovals.filter(item => item._id !== id));
        
        // Add to recent uploads with rejected status
        const updatedItem: RecentUpload = {
          ...rejectedItem,
          id: rejectedItem._id, // Add the 'id' property
          status: 'rejected',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          isSeries: rejectedItem.isSeries ?? false // Ensure isSeries is explicitly boolean
        };
        
        setRecentUploads(prev => [updatedItem, ...prev]);
      }
      
      // Refresh stats
      fetchStats();
      
    } catch (error: any) {
      console.error('Error rejecting book:', error);
      alert(`Failed to reject book: ${error.message}`);
    }
  };

  const handleViewEpisodes = (book: Book) => {
    setSelectedBook(book);
    setShowEpisodesModal(true);
  };

  const handleLoadMore = async () => {
    setIsLoading(prev => ({ ...prev, uploads: true }));
    try {
      const nextPage = Math.floor(recentUploads.length / 10) + 1;
      const data = await audioBookService.getRecentUploads(nextPage);
      
      if (data.books && data.books.length > 0) {
        setRecentUploads(prev => [...prev, ...data.books]);
      } else {
        alert('No more books to load');
      }
    } catch (error: any) {
      console.error('Error loading more books:', error);
      setError(prev => ({ ...prev, uploads: error.message }));
    } finally {
      setIsLoading(prev => ({ ...prev, uploads: false }));
    }
  };
  
  const renderLoadingState = (key: keyof typeof isLoading): JSX.Element | null => {
    if (isLoading[key]) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      );
    }
    return null;
  };
  
  const renderErrorState = (key: keyof typeof error): JSX.Element | null => {
    if (error[key]) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} />
            <p>Error: {error[key]}</p>
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
    <div className="flex flex-col gap-4 sm:gap-6 pb-24 md:px-4 sm:px-6 max-w-7xl mx-auto">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
    <h1 className="text-lg sm:text-xl font-bold">Admin Dashboard</h1>
    <button 
      className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
      onClick={() => setShowUploadModal(true)}
    >
      <Plus size={16} />
      <span>Upload</span>
    </button>
  </div>
  
  {renderErrorState('stats')}
  {isLoading.stats ? renderLoadingState('stats') : (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
      <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
        <h3 className="text-xl sm:text-2xl font-bold">{audioStats.totalBooks || 0}</h3>
        <p className="text-xs sm:text-sm text-gray-600">Total Books</p>
      </div>
      <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
        <h3 className="text-xl sm:text-2xl font-bold">{audioStats.totalHours || 0}</h3>
        <p className="text-xs sm:text-sm text-gray-600">Hours of Content</p>
      </div>
      <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
        <h3 className="text-xl sm:text-2xl font-bold">{audioStats.pendingApprovals || 0}</h3>
        <p className="text-xs sm:text-sm text-gray-600">Pending Approvals</p>
      </div>
      <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
        <h3 className="text-xl sm:text-2xl font-bold">{audioStats.activeUploads || 0}</h3>
        <p className="text-xs sm:text-sm text-gray-600">Active Uploads</p>
      </div>
    </div>
  )}
  
  <div className="border-b flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
    <button 
      className={`px-3 sm:px-4 py-2 whitespace-nowrap text-sm ${activeTab === 'uploads' ? 'border-b-2 border-indigo-500 text-indigo-500 font-medium' : 'text-gray-600'}`}
      onClick={() => setActiveTab('uploads')}
    >
      Uploads
    </button>
    <button 
      className={`px-3 sm:px-4 py-2 whitespace-nowrap text-sm ${activeTab === 'approvals' ? 'border-b-2 border-indigo-500 text-indigo-500 font-medium' : 'text-gray-600'}`}
      onClick={() => setActiveTab('approvals')}
    >
      Approvals
    </button>
    <button 
      className={`px-3 sm:px-4 py-2 whitespace-nowrap text-sm ${activeTab === 'analytics' ? 'border-b-2 border-indigo-500 text-indigo-500 font-medium' : 'text-gray-600'}`}
      onClick={() => setActiveTab('analytics')}
    >
      Analytics
    </button>
    <button 
      className={`px-3 sm:px-4 py-2 whitespace-nowrap text-sm ${activeTab === 'settings' ? 'border-b-2 border-indigo-500 text-indigo-500 font-medium' : 'text-gray-600'}`}
      onClick={() => setActiveTab('settings')}
    >
      Settings
    </button>
  </div>
  
  {activeTab === 'uploads' && (
    <div>
      {/* {JSON.stringify(recentUploads)} */}
      <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Recent Uploads</h2>
      {renderErrorState('uploads')}
      {isLoading.uploads && recentUploads.length === 0 ? renderLoadingState('uploads') : (
        <>
          <div className="rounded-lg border overflow-hidden overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500">Title</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 hidden sm:table-cell">Author</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 hidden md:table-cell">Narrator</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 hidden sm:table-cell">Date</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUploads.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="truncate max-w-xs">{book.title}</span>
                        {book.isSeries && (
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full inline-flex w-fit sm:ml-2">
                            Series
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">
                        {book.author}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">{book.author}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">{book.narrator}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          book.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          book.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">{book.date}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                      <button
                        onClick={() => book.isSeries ? handleViewEpisodes(mapRecentUploadToBook(book)) : null}
                        className="text-indigo-500 hover:text-indigo-700 p-1 sm:mr-2"
                        disabled={!book.isSeries}
                        title={book.isSeries ? "View Episodes" : "Not a series"}
                        aria-label={book.isSeries ? "View Episodes" : "Not a series"}
                      >
                        <PlayCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {recentUploads.length === 0 && (
            <div className="text-center py-6 sm:py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">No uploads yet</p>
            </div>
          )}
          
          {recentUploads.length > 0 && (
            <div className="mt-4 text-center">
              <button 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                onClick={handleLoadMore}
                disabled={isLoading.uploads}
              >
                {isLoading.uploads ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )}
  
  {activeTab === 'approvals' && (
    <div>
      <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Pending Approvals</h2>
      {renderErrorState('approvals')}
      {isLoading.approvals && pendingApprovals.length === 0 ? renderLoadingState('approvals') : (
        <>
          <div className="rounded-lg border overflow-hidden overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500">Title</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 hidden sm:table-cell">Author</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 hidden md:table-cell">Narrator</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 hidden sm:table-cell">Date</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingApprovals.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="truncate max-w-xs">{book.title}</span>
                        {book.isSeries && (
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full inline-flex w-fit sm:ml-2">
                            Series
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">
                        {book.author} • {book.date}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">{book.author}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">{book.narrator}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">{book.date}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                      <div className="flex justify-end">
                        <button 
                          className="text-green-500 hover:text-green-700 p-1 sm:mr-3"
                          onClick={() => handleApprove(book._id)}
                          aria-label="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={() => handleReject(book._id)}
                          aria-label="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pendingApprovals.length === 0 && (
            <div className="text-center py-6 sm:py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">No pending approvals</p>
            </div>
          )}
        </>
      )}
    </div>
  )}
  
  {activeTab === 'analytics' && (
    <div>
      <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Analytics Dashboard</h2>
      {renderErrorState('analytics')}
      {isLoading.analytics ? renderLoadingState('analytics') : (
        <>
          {analyticsData ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="border rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Uploads by Category</h3>
                  <div className="h-48 sm:h-64">
                    <div className="bg-gray-100 h-full flex items-center justify-center">
                      <BarChart2 size={32} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Recent Activity</h3>
                  <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-64 overflow-y-auto">
                    {analyticsData?.recentActivity?.map((activity, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          {activity.type === 'upload' ? <Upload size={14} className="text-indigo-500" /> : 
                           activity.type === 'approve' ? <Check size={14} className="text-green-500" /> :
                           <X size={14} className="text-red-500" />}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                    
                    {(!analyticsData?.recentActivity || analyticsData?.recentActivity?.length === 0) && (
                      <p className="text-gray-500 text-center py-4 text-sm">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Monthly Uploads</h3>
                <div className="h-48 sm:h-64">
                  <div className="bg-gray-100 h-full flex items-center justify-center">
                    <BarChart2 size={32} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">No analytics data available</p>
            </div>
          )}
        </>
      )}
    </div>
  )}
  
  {activeTab === 'settings' && (
    <div>
      <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Settings</h2>
      
      <div className="bg-white rounded-lg border p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-4">General Settings</h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">API Base URL</label>
              <input 
                type="text" 
                className="w-full md:w-1/2 p-2 border rounded text-sm"
                defaultValue={API_BASE_URL}
              />
              <p className="text-xs text-gray-500 mt-1">The base URL for API requests</p>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Upload Size Limit (MB)</label>
              <input 
                type="number" 
                className="w-full md:w-1/4 p-2 border rounded text-sm"
                defaultValue={500}
              />
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="autoApprove"
                className="rounded text-indigo-500" 
                defaultChecked={false}
              />
              <label htmlFor="autoApprove" className="ml-2 text-xs sm:text-sm">Auto-approve uploads</label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-4">Email Notifications</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="newUploadNotify"
                className="rounded text-indigo-500" 
                defaultChecked={true}
              />
              <label htmlFor="newUploadNotify" className="ml-2 text-xs sm:text-sm">Notify on new upload</label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="approvalNotify"
                className="rounded text-indigo-500" 
                defaultChecked={true}
              />
              <label htmlFor="approvalNotify" className="ml-2 text-xs sm:text-sm">Notify when book is approved/rejected</label>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Admin Email</label>
              <input 
                type="email" 
                className="w-full md:w-1/2 p-2 border rounded text-sm"
                defaultValue="admin@example.com"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-6 flex justify-end">
        <button className="px-4 sm:px-6 py-2 bg-indigo-500 text-white rounded text-sm">
          Save Settings
        </button>
      </div>
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
};

export default AdminView;