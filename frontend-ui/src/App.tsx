import React, { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import JudgeReview from './components/Feedbacks';
import { FeedbackData } from './types';
import { mockFeedbacks } from './data/mockData';
import Feedbacks from './components/Feedbacks';

function App() {
  const [currentPage, setCurrentPage] = useState<'form' | 'review'>('form');
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>(mockFeedbacks);

  const addFeedback = (feedback: Omit<FeedbackData, 'id' | 'submittedAt' | 'status' | 'aiAnalysis'>) => {
    const newFeedback: FeedbackData = {
      ...feedback,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'new',
      aiAnalysis: {
        sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
        priority: Math.floor(Math.random() * 5) + 1,
        category: feedback.category,
        tags: ['user-feedback', 'auto-tagged'],
        similarIssues: Math.floor(Math.random() * 3),
        confidenceScore: Math.random() * 0.3 + 0.7
      }
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const updateFeedbackStatus = (id: string, status: string) => {
    setFeedbacks(prev => 
      prev.map(f => f.id === id ? { ...f, status } : f)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">FeedbackAI</h1>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                DEMO
              </span>
            </div>
            <nav className="flex space-x-1">
              <button
                onClick={() => setCurrentPage('form')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'form'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setCurrentPage('review')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'review'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Feedbacks ({feedbacks.length})
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'form' ? (
          <FeedbackForm onSubmit={addFeedback} />
        ) : (
          <Feedbacks
          />
        )}
      </main>
    </div>
  );
}

export default App;