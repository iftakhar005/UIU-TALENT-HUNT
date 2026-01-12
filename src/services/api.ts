// API Service for UIU Talent Hunt
// Default to Render backend for production, use .env.local for local development
const API_URL = import.meta.env.VITE_API_URL || 'https://uiu-talent-hunt-backend.onrender.com/api';

// Log which API URL is being used (only in development)
if (import.meta.env.DEV) {
  console.log('🔗 API URL:', API_URL);
}

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  studentId?: string;
  department?: string;
  role: 'user' | 'admin' | 'judge';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  success: false;
  error: string;
}

// Content Types
export interface ContentSubmission {
  _id: string;
  contentType: 'video' | 'audio' | 'blog';
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  mediaUrl?: string;
  thumbnailUrl?: string;
  blogContent?: string;
  rejectionReason?: string;
  submittedAt: string;
}

export interface PublishedContent {
  _id: string;
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  title: string;
  description: string;
  category: string;
  tags: string[];
  videoUrl?: string;
  audioUrl?: string;
  content?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  duration?: number;
  views?: number;
  plays?: number;
  likes: string[];
  comments: { user: string; text: string; createdAt: string }[];
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ContentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byType?: {
    video: number;
    audio: number;
    blog: number;
  };
}

export interface AdminContentRequest extends ContentSubmission {
  user: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
  };
  adminNotes?: string;
}

export const CONTENT_CATEGORIES = [
  'music',
  'dance', 
  'drama',
  'poetry',
  'art',
  'photography',
  'film',
  'writing',
  'other'
] as const;

export type ContentCategory = typeof CONTENT_CATEGORIES[number];

// Helper function for API calls
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Try to parse JSON, but handle non-JSON responses
    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      throw new Error(`Server error (${response.status}): ${text || response.statusText}`);
    }

    if (!response.ok) {
      // Include more details from the error response
      const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
      const errorDetails = data.details || data.error;
      throw new Error(errorDetails ? `${errorMessage} - ${errorDetails}` : errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
}

// Helper for FormData requests (file uploads)
async function uploadRequest<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Upload failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
}

// Auth API
export const authAPI = {
  // Step 1: Send verification code to email
  sendVerification: async (userData: {
    email: string;
    username: string;
    password: string;
    fullName: string;
    studentId?: string;
    department?: string;
  }): Promise<{ success: boolean; message: string }> => {
    return request('/auth/send-verification', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Step 2: Verify code and complete registration
  verifyCode: async (email: string, code: string): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  // Resend verification code
  resendCode: async (email: string): Promise<{ success: boolean; message: string }> => {
    return request('/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Verify admin email code after login
  verifyAdminEmail: async (email: string, code: string): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/verify-admin-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  // Get current user
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    return request('/auth/me');
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; user: User }> => {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Save auth data to localStorage
  saveAuth: (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
  },
};

// Content API
export const contentAPI = {
  // Get all published content
  getAll: async (params?: { type?: string; category?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return request<{ success: boolean; content: PublishedContent[]; pagination: Pagination }>(`/content?${searchParams}`);
  },

  // Get single content
  getById: async (id: string) => {
    return request<{ success: boolean; content: PublishedContent }>(`/content/${id}`);
  },

  // Like/unlike content
  toggleLike: async (id: string) => {
    return request<{ success: boolean; liked: boolean; likesCount: number }>(`/content/${id}/like`, { method: 'POST' });
  },
};

// Submission API (for users to submit content for approval)
export const submissionAPI = {
  // Submit video
  submitVideo: async (data: {
    video: File;
    thumbnail?: File;
    title: string;
    description: string;
    category: ContentCategory;
    tags?: string;
  }) => {
    const formData = new FormData();
    formData.append('video', data.video);
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.tags) formData.append('tags', data.tags);
    
    return uploadRequest<{ success: boolean; message: string; request: { id: string; title: string; status: string; submittedAt: string } }>(
      '/content/submit/video',
      formData
    );
  },

  // Submit audio
  submitAudio: async (data: {
    audio: File;
    cover?: File;
    title: string;
    description: string;
    category: ContentCategory;
    tags?: string;
  }) => {
    const formData = new FormData();
    formData.append('audio', data.audio);
    if (data.cover) formData.append('cover', data.cover);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.tags) formData.append('tags', data.tags);
    
    return uploadRequest<{ success: boolean; message: string; request: { id: string; title: string; status: string; submittedAt: string } }>(
      '/content/submit/audio',
      formData
    );
  },

  // Submit blog
  submitBlog: async (data: {
    cover?: File;
    title: string;
    description?: string;
    category: ContentCategory;
    tags?: string;
    blogContent: string;
  }) => {
    const formData = new FormData();
    if (data.cover) formData.append('cover', data.cover);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.tags) formData.append('tags', data.tags);
    formData.append('blogContent', data.blogContent);
    
    return uploadRequest<{ success: boolean; message: string; request: { id: string; title: string; status: string; submittedAt: string } }>(
      '/content/submit/blog',
      formData
    );
  },

  // Get user's submissions
  getMySubmissions: async (params?: { status?: string; contentType?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.contentType) searchParams.append('contentType', params.contentType);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return request<{ success: boolean; submissions: ContentSubmission[]; pagination: Pagination }>(
      `/content/my-submissions?${searchParams}`
    );
  },

  // Get single submission
  getSubmission: async (id: string) => {
    return request<{ success: boolean; submission: ContentSubmission }>(`/content/submission/${id}`);
  },

  // Delete pending submission
  deleteSubmission: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/content/submission/${id}`, { method: 'DELETE' });
  },
};

// Admin API
export const adminAPI = {
  // Get submission statistics
  getStats: async () => {
    return request<{ success: boolean; stats: ContentStats }>('/admin/content/stats');
  },

  // Get pending submissions
  getPending: async (params?: { contentType?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.contentType) searchParams.append('contentType', params.contentType);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return request<{ success: boolean; requests: AdminContentRequest[]; stats: ContentStats; pagination: Pagination }>(
      `/admin/content/pending?${searchParams}`
    );
  },

  // Get all submissions
  getAllSubmissions: async (params?: { status?: string; contentType?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.contentType) searchParams.append('contentType', params.contentType);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return request<{ success: boolean; requests: AdminContentRequest[]; pagination: Pagination }>(
      `/admin/content/all?${searchParams}`
    );
  },

  // Get submission details
  getRequest: async (id: string) => {
    return request<{ success: boolean; request: AdminContentRequest }>(`/admin/content/request/${id}`);
  },

  // Approve content
  approve: async (id: string, adminNotes?: string) => {
    return request<{ success: boolean; message: string; content: PublishedContent }>(`/admin/content/approve/${id}`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes }),
    });
  },

  // Reject content
  reject: async (id: string, rejectionReason: string, adminNotes?: string, deleteMedia?: boolean) => {
    return request<{ success: boolean; message: string }>(`/admin/content/reject/${id}`, {
      method: 'POST',
      body: JSON.stringify({ rejectionReason, adminNotes, deleteMedia }),
    });
  },

  // Delete submission
  deleteSubmission: async (id: string, deleteMedia?: boolean) => {
    return request<{ success: boolean; message: string }>(`/admin/content/request/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ deleteMedia }),
    });
  },
};

// User API
export const userAPI = {
  // Get user by ID
  getById: async (id: string) => {
    return request(`/users/${id}`);
  },

  // Follow/unfollow user
  toggleFollow: async (id: string) => {
    return request(`/users/${id}/follow`, { method: 'POST' });
  },
};

export default { authAPI, contentAPI, submissionAPI, adminAPI, userAPI };
