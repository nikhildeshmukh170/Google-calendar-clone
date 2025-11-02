const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | Array<{ path: string; message: string }>;
  message?: string;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(
      typeof data.error === 'string' 
        ? data.error 
        : data.error?.map((e: any) => e.message).join(', ') || 'An error occurred'
    );
  }
  
  return data;
}

export const userClient = {
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/api/users`);
    const result = await handleResponse<User[]>(response);
    return result.data || [];
  },

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_URL}/api/users/${id}`);
    const result = await handleResponse<User>(response);
    if (!result.data) throw new Error('User not found');
    return result.data;
  },

  async createUser(name: string, email: string): Promise<User> {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });
    const result = await handleResponse<User>(response);
    if (!result.data) throw new Error('Failed to create user');
    return result.data;
  },
};


