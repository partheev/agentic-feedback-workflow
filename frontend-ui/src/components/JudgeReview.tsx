import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Brain, 
  Tag,
  Users,
  Calendar,
  MessageSquare,
  ChevronDown,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { FeedbackData } from '../types';

interface JudgeReviewProps {
  feedbacks: FeedbackData[];
  onStatusUpdate: (id: string, status: string) => void;
}

const JudgeReview: React.FC<JudgeReviewProps> = ({ feedbacks, onStatusUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'confidence'>('date');
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  // Filter and sort feedbacks
  const filteredFeedbacks = useMemo(() => {
    let filtered = feedbacks.filter(feedback => {
      const matchesSearch = 
        feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.contactInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || feedback.category === filterCategory;
      const matchesSeverity = filterSeverity === 'all' || feedback.severity === filterSeverity;

      return matchesSearch && matchesStatus && matchesCategory && matchesSeverity;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return b.aiAnalysis.priority - a.aiAnalysis.priority;
        case 'confidence':
          return b.aiAnalysis.confidenceScore - a.aiAnalysis.confidenceScore;
        case 'date':
        default:
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });

    return filtered;
  }, [feedbacks, searchTerm, filterStatus, filterCategory, filterSeverity, sortBy]);

  // Analytics data
  const analytics = useMemo(() => {
    const total = feedbacks.length;
    const newCount = feedbacks.filter(f => f.status === 'new').length;
    const inProgressCount = feedbacks.filter(f => f.status === 'in-progress').length;
    const resolvedCount = feedbacks.filter(f => f.status === 'resolved').length;
    const avgPriority = feedbacks.reduce((sum, f) => sum + f.aiAnalysis.priority, 0) / total;
    const avgConfidence = feedbacks.reduce((sum, f) => sum + f.aiAnalysis.confidenceScore, 0) / total;

    return {
      total,
      newCount,
      inProgressCount,
      resolvedCount,
      avgPriority: Math.round(avgPriority * 10) / 10,
      avgConfidence: Math.round(avgConfidence * 100)
    };
  }, [feedbacks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-600 bg-red-50';
    if (priority >= 3) return 'text-orange-600 bg-orange-50';
    if (priority >= 2) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Judge Review Dashboard</h1>
        <p className="text-gray-600 text-lg">AI-powered feedback analysis and governance</p>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Feedbacks</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg AI Priority</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgPriority}/5</p>
            </div>
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Confidence</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgConfidence}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((analytics.resolvedCount / analytics.total) * 100)}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search feedbacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement</option>
              <option value="complaint">Complaint</option>
              <option value="praise">Praise</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="confidence">Sort by Confidence</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {feedback.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
                      {getStatusIcon(feedback.status)}
                      {feedback.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(feedback.submittedAt)}
                    </div>
                    {feedback.contactInfo?.name && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {feedback.contactInfo.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Priority Score */}
                <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityColor(feedback.aiAnalysis.priority)}`}>
                  Priority: {feedback.aiAnalysis.priority}/5
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-700 line-clamp-2 mb-3">{feedback.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(feedback.severity)}`}>
                    {feedback.severity} severity
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {feedback.category}
                  </span>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">AI Analysis</span>
                  <span className="text-sm text-gray-600">
                    ({Math.round(feedback.aiAnalysis.confidenceScore * 100)}% confidence)
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Sentiment:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      feedback.aiAnalysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      feedback.aiAnalysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {feedback.aiAnalysis.sentiment}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {feedback.aiAnalysis.category}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Similar Issues:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {feedback.aiAnalysis.similarIssues}
                    </span>
                  </div>
                </div>

                {feedback.aiAnalysis.tags.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">AI Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {feedback.aiAnalysis.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <select
                  value={feedback.status}
                  onChange={(e) => onStatusUpdate(feedback.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={() => setSelectedFeedback(
                    selectedFeedback === feedback.id ? null : feedback.id
                  )}
                  className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  {selectedFeedback === feedback.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Expanded Details */}
              {selectedFeedback === feedback.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-900">Full Description:</span>
                      <p className="mt-1 text-gray-700">{feedback.description}</p>
                    </div>
                    
                    {feedback.contactInfo?.email && (
                      <div>
                        <span className="font-medium text-gray-900">Contact Email:</span>
                        <span className="ml-2 text-gray-700">{feedback.contactInfo.email}</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-900">Submitted:</span>
                      <span className="ml-2 text-gray-700">
                        {new Date(feedback.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedbacks found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No feedbacks have been submitted yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeReview;