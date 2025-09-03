import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  MessageSquare, 
  User, 
  MapPin, 
  LogOut, 
  Phone,
  Mail,
  FileText,
  Camera,
  ExternalLink,
  Bot
} from 'lucide-react';

export const OwnerDashboard = ({ userData, onLogout }) => {
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simple message sending
  const handleSendEmail = () => {
    const subject = `Message from ${userData.name} - ${userData.propertyAddress}`;
    const body = `From: ${userData.name}%0AEmail: ${userData.email}%0AProperty: ${userData.propertyAddress}%0A%0AMessage:%0A${encodeURIComponent(messageText)}`;
    window.location.href = `mailto:850realty@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const handleSendBotMessage = async () => {
    if (!messageText.trim()) {
      alert('Please enter a message first');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Send to backend which will forward to Telegram bot
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `Owner Bot Message from ${userData.name}`,
          message: messageText,
          priority: 'normal',
          ownerEmail: userData.email,
          ownerName: userData.name,
          propertyAddress: userData.propertyAddress
        })
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        setMessageText('');
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        alert('Failed to send message. Please try email instead.');
      }
    } catch (err) {
      alert('Failed to send message. Please try email instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google service URLs (you can update these for each property)
  const googlePhotosUrl = "https://photos.app.goo.gl/Bfbk1V7BxHKVSdFo9";
  const googleDocsUrl = "https://docs.google.com/document/d/1Oem88xZVfV8VrvNpKu07pfrK2j6cQPCU/edit?usp=drive_link&ouid=104070332296079677226&rtpof=true&sd=true";

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl p-12 shadow-2xl border-0 bg-white text-center">
          <Bot className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Message Sent!</h2>
          <p className="text-xl text-slate-600 mb-6">
            Your message has been sent to our team via bot. We'll respond soon!
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
                  Property Photos
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center ${
                    activeTab === 'reviews' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Star className="h-5 w-5 mr-3" />
                  Reviews
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
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Send Message to LuxServ 365</h2>
                  <p className="text-gray-600 mb-6">Communicate directly with our management team. We'll respond within 24 hours during business days.</p>
                  
                  {propertyData.loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading messaging system...</span>
                    </div>
                  ) : propertyData.googleFormsUrl ? (
                    <iframe 
                      src={propertyData.googleFormsUrl} 
                      width="100%" 
                      height="800" 
                      frameBorder="0" 
                      marginHeight="0" 
                      marginWidth="0"
                      className="rounded-lg border"
                      title="Property-Specific Owner Communication Form"
                    >
                      Loading owner communication form...
                    </iframe>
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Property Not Yet Configured</h3>
                      <p className="text-gray-600 mb-4">Your property-specific messaging system is being set up.</p>
                      <p className="text-sm text-gray-500">Please contact our admin team to complete your property setup.</p>
                      <div className="mt-6">
                        <a 
                          href="mailto:850realty@gmail.com" 
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Admin
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Previous Messages */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Message History</h3>
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No previous messages found.</p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <Card key={message.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{message.subject}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{message.message}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              message.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inspection Reports Tab */}
            {activeTab === 'inspections' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Inspection Report</h2>
                  <p className="text-gray-600 mb-6">View your property inspection report including photos and maintenance notes.</p>
                  
                  {propertyData.loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading inspection report...</span>
                    </div>
                  ) : propertyData.googleDocsUrl ? (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Current Inspection Report</h3>
                      <p className="text-sm text-gray-600 mb-4">Your property's latest inspection report:</p>
                      
                      {/* Embedded Google Doc */}
                      <div className="bg-white rounded-lg border shadow-sm">
                        <iframe 
                          src={propertyData.googleDocsUrl}
                          width="100%" 
                          height="600" 
                          frameBorder="0"
                          className="rounded-lg"
                          title="Property-Specific Inspection Report"
                        >
                          Loading inspection report...
                        </iframe>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Inspection Report Available</h3>
                      <p className="text-gray-600 mb-4">Your property inspection report will appear here once completed.</p>
                      <p className="text-sm text-gray-500">We'll notify you when your inspection report is ready to view.</p>
                    </div>
                  )}

                  {/* Upload Notifications */}
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800">Automatic Notifications</h3>
                        <p className="mt-1 text-sm text-green-700">
                          You'll receive an email notification when your property inspection report is updated.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Property Photos Tab */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Inspection Photos</h2>
                  <p className="text-gray-600 mb-6">View photos from your property inspection including interior, exterior, and maintenance documentation.</p>
                  
                  {propertyData.loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading photo gallery...</span>
                    </div>
                  ) : propertyData.googlePhotosUrl ? (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">📸 Inspection Photo Gallery</h3>
                      <p className="text-sm text-gray-600 mb-4">Your property inspection photos:</p>
                      
                      {/* Embedded Google Photos */}
                      <div className="bg-white rounded-lg border shadow-sm">
                        <iframe 
                          src={propertyData.googlePhotosUrl}
                          width="100%" 
                          height="600" 
                          frameBorder="0"
                          className="rounded-lg"
                          title="Property-Specific Inspection Photos"
                        >
                          Loading inspection photos...
                        </iframe>
                      </div>
                      
                      {/* Direct link for mobile compatibility */}
                      <div className="mt-4 text-center">
                        <a 
                          href={propertyData.googlePhotosUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          View Photos in New Tab
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Available</h3>
                      <p className="text-gray-600 mb-4">Your property inspection photos will appear here once uploaded.</p>
                      <p className="text-sm text-gray-500">We'll notify you when new photos are added to your property album.</p>
                    </div>
                  )}

                  {/* Photo Update Notifications */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                      <Camera className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">Photo Updates</h3>
                        <p className="mt-1 text-sm text-blue-700">
                          New inspection photos are added after each property visit. You'll be notified when photos are updated.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewsTestimonials userData={userData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};