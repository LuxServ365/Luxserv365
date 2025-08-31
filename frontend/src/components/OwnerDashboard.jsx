import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  MessageSquare, 
  Send, 
  User, 
  MapPin, 
  LogOut, 
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  FileText,
  Camera
} from 'lucide-react';
import { messageApi } from '../services/api';
import { InspectionReports } from './InspectionReports';
import { PhotoAlbum } from './PhotoAlbum';

export const OwnerDashboard = ({ userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await messageApi.getOwnerMessages(userData.email);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const messageData = {
        ...newMessage,
        ownerEmail: userData.email,
        ownerName: userData.name,
        propertyAddress: userData.propertyAddress
      };

      const response = await messageApi.submitMessage(messageData);
      
      if (response.success) {
        setSubmitSuccess(true);
        setNewMessage({
          subject: '',
          message: '',
          priority: 'normal'
        });
        loadMessages(); // Reload messages
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        setError(response.error || 'Failed to send message');
      }
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'read': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl p-12 shadow-2xl border-0 bg-white text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Message Sent!</h2>
          <p className="text-xl text-slate-600 mb-6">
            Your message has been sent to LuxServ 365. We'll respond within 2 hours during business hours.
          </p>
          <p className="text-slate-500 mb-6">
            For urgent matters, call our emergency line: (504) 939-1371
          </p>
          <Button
            onClick={() => setSubmitSuccess(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Send Another Message
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative">
                <h1 className="text-2xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">
                    LuxServ
                  </span>
                  <span className="text-slate-800 ml-1 relative">
                    365
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
                  </span>
                </h1>
                <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 rounded-full"></div>
              </div>
              <span className="ml-4 text-slate-600">Owner Dashboard</span>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Owner Info Panel */}
            <Card className="p-6 shadow-lg border-0 bg-white mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Owner</h3>
              <div className="space-y-3">
                <div className="flex items-center text-slate-600">
                  <User className="h-5 w-5 mr-3 text-blue-500" />
                  <span>{userData.name}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Mail className="h-5 w-5 mr-3 text-blue-500" />
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex items-start text-slate-600">
                  <MapPin className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                  <span className="text-sm">{userData.propertyAddress}</span>
                </div>
              </div>
            </Card>

            {/* Navigation Tabs */}
            <Card className="p-6 shadow-lg border-0 bg-white mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Dashboard</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center ${
                    activeTab === 'messages' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab('inspections')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center ${
                    activeTab === 'inspections' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Inspection Reports
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center ${
                    activeTab === 'photos' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Camera className="h-5 w-5 mr-3" />
                  Photo Album
                </button>
              </nav>
            </Card>

            {/* Quick Contact */}
            <Card className="p-6 shadow-lg border-0 bg-white">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a
                  href="tel:+18503309933"
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Phone className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900">Main Line</p>
                    <p className="text-sm text-slate-600">(850) 330-9933</p>
                  </div>
                </a>
                <a
                  href="tel:+15049391371"
                  className="flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                  <Phone className="h-5 w-5 mr-3 text-red-600" />
                  <div>
                    <p className="font-medium text-slate-900">Emergency</p>
                    <p className="text-sm text-slate-600">(504) 939-1371</p>
                  </div>
                </a>
                <a
                  href="mailto:850realty@gmail.com"
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <Mail className="h-5 w-5 mr-3 text-green-600" />
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-sm text-slate-600">850realty@gmail.com</p>
                  </div>
                </a>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'messages' && (
              <>
                {/* Send Message Form */}
                <Card className="p-6 shadow-lg border-0 bg-white mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                    Send Message to LuxServ 365
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={newMessage.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Maintenance request, billing question, etc."
                        />
                      </div>
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={newMessage.priority}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={newMessage.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Please describe your request or concern in detail..."
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>

                    {error && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                          <p className="text-red-700">{error}</p>
                        </div>
                      </div>
                    )}
                  </form>
                </Card>

                {/* Message History */}
                <Card className="p-6 shadow-lg border-0 bg-white">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">Message History</h3>
                  
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No messages yet. Send your first message above!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-900">{message.subject}</h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                                {message.priority.toUpperCase()}
                              </span>
                              {getStatusIcon(message.status)}
                            </div>
                          </div>
                          <p className="text-slate-600 mb-3">{message.message}</p>
                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                            <span className="capitalize">{message.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            )}

            {activeTab === 'inspections' && (
              <InspectionReports userData={userData} />
            )}

            {activeTab === 'photos' && (
              <PhotoAlbum userData={userData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};