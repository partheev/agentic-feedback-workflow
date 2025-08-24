import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { FeedbackData } from '../types';
import api from '../services/api';
import { toast } from 'react-toastify';

interface FeedbackFormProps {
  onSubmit: (feedback: FeedbackData) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customer_email: '',
    customer_name: '',
    feedback_title: '',
    feedback_description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.feedback_title.trim()) {
      newErrors.feedback_title = 'Title is required';
    }
    if (!formData.feedback_description.trim()) {
      newErrors.feedback_description = 'Description is required';
    }
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    }

    if (formData.customer_email && !/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Invalid email format';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await api.submitFeedback(formData);
      // show toast message "Feedback submitted successfully"
      toast.success('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Error submitting feedback');
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
    
  
      setFormData({
        feedback_title: '',
        feedback_description: '',
        customer_name: '',
        customer_email: '',
      });

  
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Show back button */}
        <div className="flex justify-end">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => setIsSubmitted(false)}>Back</button>
        </div>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your feedback. Our AI system is analyzing your submission and will prioritize it accordingly.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>AI Analysis:</strong> Your feedback has been automatically categorized and assigned a priority level. 
              Our team will review it shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit Your Feedback</h1>
        <p className="text-gray-600 text-lg">
          Help us improve by sharing your thoughts, reporting bugs, or suggesting new features.
        </p>
        <div className="flex items-center justify-center mt-4 space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">AI-powered feedback analysis</span>
        </div>
      </div>

      {/* Bug Report Requirements */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-amber-800 mb-2">For Bug Reports, Please Include:</h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-center">
            <span className="w-5 h-5 inline-flex items-center justify-center bg-amber-200 rounded-full mr-2 text-amber-800">1</span>
            Device type (web, mobile, desktop, etc.)
          </li>
          <li className="flex items-center">
            <span className="w-5 h-5 inline-flex items-center justify-center bg-amber-200 rounded-full mr-2 text-amber-800">2</span>
            Browser (e.g. Chrome, Firefox, Safari, etc.)
          </li>
         
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.feedback_title}
            onChange={(e) => setFormData({ ...formData, feedback_title: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.feedback_title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Brief description of your feedback"
          />
          {errors.feedback_title && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.feedback_title}
            </p>
          )}
        </div>

       

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.feedback_description}
            onChange={(e) => setFormData({ ...formData, feedback_description: e.target.value })}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.feedback_description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Please provide detailed information about your feedback..."
          />
          {errors.feedback_description && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.feedback_description}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name*
              </label>
              <input
                type="text"
                id="name"
                value={formData.customer_name}
                onChange={(e) => setFormData({
                  ...formData,
                  customer_name: e.target.value
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.customer_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your name"
              />
                {errors.customer_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.customer_name}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email*
              </label>
              <input
                type="email"
                id="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({
                  ...formData,
                  customer_email: e.target.value
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customer_email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.customer_email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.customer_email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing with AI...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;