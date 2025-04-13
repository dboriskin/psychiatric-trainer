import { Category } from '../mocks/data/categories';
import { Case } from '../mocks/data/cases';
import { CaseDetail } from '../mocks/data/case-details';

// Base API URL - can be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Generic error handling for fetch calls
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Function to make a GET request to the API
 */
async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  return handleResponse<T>(response);
}

/**
 * Function to make a POST request to the API
 */
async function post<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

/**
 * API service with methods for each endpoint
 */
export const api = {
  /**
   * Get all categories
   */
  getCategories: (): Promise<Category[]> => {
    return get<Category[]>('/api/categories');
  },

  /**
   * Get cases by category ID
   */
  getCasesByCategory: (categoryId: string): Promise<Case[]> => {
    return get<Case[]>(`/api/categories/${categoryId}/cases`);
  },

  /**
   * Get case by ID
   */
  getCaseById: (caseId: string): Promise<Case> => {
    return get<Case>(`/api/cases/${caseId}`);
  },

  /**
   * Get detailed case information
   */
  getCaseDetails: (caseId: string): Promise<CaseDetail> => {
    return get<CaseDetail>(`/api/cases/${caseId}/details`);
  },

  /**
   * Update user progress for a case
   */
  updateProgress: (userId: string, caseId: string, progress: any): Promise<{ success: boolean }> => {
    return post<{ success: boolean }>('/api/progress', {
      userId,
      caseId,
      progress,
    });
  },

  /**
   * Get user statistics
   */
  getUserStats: (userId: string): Promise<any> => {
    return get<any>(`/api/user/stats?userId=${userId}`);
  },
};

// Export type definitions
export type { Category } from '../mocks/data/categories';
export type { Case } from '../mocks/data/cases';
export type { 
  CaseDetail, 
  PatientStory, 
  PatientNote 
} from '../mocks/data/case-details';