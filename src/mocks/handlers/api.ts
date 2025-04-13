import { http, HttpResponse } from 'msw';
import { mockCategories } from '../data/categories';
import { mockCases, getCaseById, getCasesByCategory } from '../data/cases';
import { getCaseDetailById } from '../data/case-details';

export const handlers = [
  // Get all categories
  http.get('/api/categories', () => {
    return HttpResponse.json(mockCategories);
  }),

  // Get cases by category
  http.get('/api/categories/:categoryId/cases', ({ params }) => {
    const categoryId = params.categoryId as string;
    const cases = getCasesByCategory(categoryId);
    
    return HttpResponse.json(cases);
  }),

  // Get case by ID
  http.get('/api/cases/:caseId', ({ params }) => {
    const caseId = params.caseId as string;
    const caseData = getCaseById(caseId);
    
    if (!caseData) {
      return new HttpResponse(
        JSON.stringify({ error: 'Case not found' }),
        { status: 404 }
      );
    }
    
    return HttpResponse.json(caseData);
  }),

  // Get detailed case information
  http.get('/api/cases/:caseId/details', ({ params }) => {
    const caseId = params.caseId as string;
    const caseDetail = getCaseDetailById(caseId);
    
    if (!caseDetail) {
      return new HttpResponse(
        JSON.stringify({ error: 'Case details not found' }),
        { status: 404 }
      );
    }
    
    return HttpResponse.json(caseDetail);
  }),

  // Update user progress
  http.post('/api/progress', async ({ request }) => {
    const body = await request.json() as { 
      userId: string; 
      caseId: string; 
      progress: any 
    };
    const { userId, caseId, progress } = body;
    
    // Here we would normally update the database
    // For the mock, we'll just return success
    
    return HttpResponse.json({ success: true });
  }),

  // Get user stats
  http.get('/api/user/stats', () => {
    // Mock user stats
    return HttpResponse.json({
      completedCases: 0,
      inProgressCases: 0,
      totalPoints: 0,
      achievements: []
    });
  })
];