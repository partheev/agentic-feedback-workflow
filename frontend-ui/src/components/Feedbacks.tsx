import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { FeedbackData } from '../types';
import ApiService from '../services/api';

const Feedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Feedbacks</h1>
        <button
          onClick={fetchFeedbacks}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedbacks...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No feedbacks available</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {feedbacks.map((feedback, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{feedback.feedback_title}</h3>
                  <p className="text-sm text-gray-600">{feedback.customer_name}</p>
                  <p className="text-sm text-gray-500">{feedback.customer_email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Upvotes:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {feedback.upvotes}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">{feedback.feedback_description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedbacks;