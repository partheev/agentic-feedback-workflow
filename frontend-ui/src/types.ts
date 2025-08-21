export interface FeedbackData {
  id: string;
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'improvement' | 'complaint' | 'praise';
  severity: 'low' | 'medium' | 'high' | 'critical';
  contactInfo?: {
    name?: string;
    email?: string;
  };
  submittedAt: string;
  status: 'new' | 'in-progress' | 'resolved' | 'rejected';
  aiAnalysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    priority: number; // 1-5
    category: string;
    tags: string[];
    similarIssues: number;
    confidenceScore: number; // 0-1
  };
}