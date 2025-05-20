import { ApprovedItem, RecentUpload, Stats } from "../components/dashboard-contents/AdminPage";
import { Book, Episode } from "@/app/[locale]/page";
import { API_BASE_URL, authApiHelper } from "@/app/utils/api";


// interface Audiobook {
//   _id: string;
//   title: string;
//   author: string;
//   narrator?: string;
//   category: string;
//   description?: string;
//   status: 'approved' | 'pending' | 'rejected' | 'draft';
//   averageRating?: number;
//   listenCount?: number;
//   coverImage?: string;
//   audioFile?: string;
//   createdAt: string;
//   updatedAt: string;
//   duration?: number;
//   isSeries?: boolean;
//   episodes?: Array<{
//     title: string;
//     episodeNumber: number;
//     audioFile: string;
//     duration?: number;
//   }>;
// }

interface PaginatedResponse {
  books: Book[];
  total: number;
  pages: number;
  currentPage: number;
  narrationLanguage:string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const audioBookService = {
  /**
   * Get all audiobooks with pagination and filtering
   */
  getAllBooks: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    category?: string;
    sort?: string;
  }): Promise<PaginatedResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.sort) queryParams.append('sort', params.sort);

      const response = await authApiHelper.get(`/books?${queryParams.toString()}`);
      if (!response?.ok) throw new Error('Failed to fetch audiobooks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching audiobooks:', error);
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

  /**
   * Get a single audiobook by ID
   */
  getBookById: async (id: string): Promise<Book> => {
    try {
      const response = await authApiHelper.get(`/books/${id}`);
      if (!response?.ok) throw new Error('Failed to fetch audiobook');
      return await response.json();
    } catch (error) {
      console.error('Error fetching audiobook:', error);
      throw error;
    }
  },

  /**
   * Upload a new audiobook
   */
  uploadBook: async (formData: FormData): Promise<Book> => {
    try {
      const response = await authApiHelper.post('/books/upload', formData);
      if (!response?.ok) throw new Error('Failed to upload audiobook');
      return await response.json();
    } catch (error) {
      console.error('Error uploading audiobook:', error);
      throw error;
    }
  },

  /**
   * Update an existing audiobook
   */
  updateBook: async (id: string, formData: FormData): Promise<Book> => {
    try {
      const response = await authApiHelper.put(`/books/${id}`, formData);
      if (!response?.ok) throw new Error('Failed to update audiobook');
      return await response.json();
    } catch (error) {
      console.error('Error updating audiobook:', error);
      throw error;
    }
  },

  /**
   * Delete an audiobook
   */
  deleteBook: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await authApiHelper.delete(`/books/${id}`);
      if (!response?.ok) throw new Error('Failed to delete audiobook');
      return await response.json();
    } catch (error) {
      console.error('Error deleting audiobook:', error);
      throw error;
    }
  },

  /**
   * Approve a pending audiobook (admin only)
   */
  approveBook: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await authApiHelper.post(`/books/${id}/approve`);
      if (!response?.ok) throw new Error('Failed to approve audiobook');
      return await response.json();
    } catch (error) {
      console.error('Error approving audiobook:', error);
      throw error;
    }
  },

  /**
   * Reject a pending audiobook (admin only)
   */
  rejectBook: async (id: string, reason?: string): Promise<ApiResponse> => {
    try {
      const response = await authApiHelper.post(`/books/${id}/reject`, { reason });
      if (!response?.ok) throw new Error('Failed to reject audiobook');
      return await response.json();
    } catch (error) {
      console.error('Error rejecting audiobook:', error);
      throw error;
    }
  },

  /**
   * Get recent uploads
   */
  getRecentUploads: async (page = 1, limit = 10): Promise<{ books: RecentUpload[] }> => {
    try {
      const response = await authApiHelper.get(`/books/recent?page=${page}&limit=${limit}`);
      if (!response?.ok) throw new Error('Failed to fetch recent uploads');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      throw error;
    }
  },

  /**
   * Get pending approvals
   */
  getPendingApprovals: async (): Promise<{ books: ApprovedItem[] }> => {
    try {
      const response = await authApiHelper.get(`/books/pending`);
      if (!response?.ok) throw new Error('Failed to fetch pending approvals');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  },

  /**
   * Add episode to a series
   */
  addEpisode: async (bookId: string, formData: FormData): Promise<Book> => {
    try {
      const response = await authApiHelper.post(`/books/${bookId}/episodes`, formData);
      if (!response?.ok) throw new Error('Failed to add episode');
      return await response.json();
    } catch (error) {
      console.error('Error adding episode:', error);
      throw error;
    }
  },

  /**
   * Get analytics data
   */
  getAnalytics: async (): Promise<any> => {
    try {
      const response = await authApiHelper.get(`/analytics`);
      if (!response?.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
};