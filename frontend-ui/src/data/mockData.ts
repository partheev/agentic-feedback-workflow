import { FeedbackData } from '../types';

export const mockFeedbacks: FeedbackData[] = [
  {
    id: '1',
    title: 'Login page crashes on mobile devices',
    description: 'When I try to login using my iPhone 14, the app crashes immediately after entering credentials. This happens consistently every time I attempt to log in.',
    category: 'bug',
    severity: 'high',
    contactInfo: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com'
    },
    submittedAt: '2025-01-08T10:30:00Z',
    status: 'new',
    aiAnalysis: {
      sentiment: 'negative',
      priority: 4,
      category: 'Critical Bug',
      tags: ['mobile', 'login', 'crash', 'ios'],
      similarIssues: 3,
      confidenceScore: 0.92
    }
  },
  {
    id: '2',
    title: 'Add dark mode support',
    description: 'Would love to see a dark mode option in the app settings. Many users prefer dark interfaces, especially for evening usage.',
    category: 'feature',
    severity: 'medium',
    contactInfo: {
      name: 'Alex Rodriguez'
    },
    submittedAt: '2025-01-08T09:15:00Z',
    status: 'in-progress',
    aiAnalysis: {
      sentiment: 'positive',
      priority: 3,
      category: 'Feature Request',
      tags: ['ui', 'accessibility', 'user-preference'],
      similarIssues: 7,
      confidenceScore: 0.88
    }
  },
  {
    id: '3',
    title: 'Excellent customer support experience',
    description: 'I had an issue with my account last week and the support team resolved it within 2 hours. Fantastic service!',
    category: 'praise',
    severity: 'low',
    contactInfo: {
      name: 'Mike Johnson',
      email: 'mike.j@email.com'
    },
    submittedAt: '2025-01-08T08:45:00Z',
    status: 'resolved',
    aiAnalysis: {
      sentiment: 'positive',
      priority: 2,
      category: 'Customer Praise',
      tags: ['support', 'positive-experience', 'resolution-time'],
      similarIssues: 0,
      confidenceScore: 0.96
    }
  },
  {
    id: '4',
    title: 'Search functionality is very slow',
    description: 'The search feature takes 10-15 seconds to return results, making it frustrating to use. This seems to happen across all devices.',
    category: 'complaint',
    severity: 'medium',
    submittedAt: '2025-01-08T07:20:00Z',
    status: 'new',
    aiAnalysis: {
      sentiment: 'negative',
      priority: 3,
      category: 'Performance Issue',
      tags: ['search', 'performance', 'slow', 'user-experience'],
      similarIssues: 2,
      confidenceScore: 0.85
    }
  }
];