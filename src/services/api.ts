// API Service for UIU Talent Hunt
const API_URL = 'http://localhost:5000/api';

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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
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
  // Get all content
  getAll: async (params?: { type?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return request(`/content?${searchParams}`);
  },

  // Get single content
  getById: async (id: string) => {
    return request(`/content/${id}`);
  },

  // Create content
  create: async (data: {
    title: string;
    description?: string;
    type: 'video' | 'audio' | 'blog';
    fileUrl?: string;
    thumbnailUrl?: string;
    tags?: string[];
    blogContent?: string;
  }) => {
    return request('/content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Like/unlike content
  toggleLike: async (id: string) => {
    return request(`/content/${id}/like`, { method: 'POST' });
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

export default { authAPI, contentAPI, userAPI };
