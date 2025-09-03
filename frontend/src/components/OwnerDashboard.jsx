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
              <span className="ml-4 text-slate-600">Owner Portal</span>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="p-6 shadow-lg border-0 bg-white mb-8">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome, {userData.name}!</h2>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <Mail className="h-4 w-4 mr-2" />
            <span>{userData.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{userData.propertyAddress}</span>
          </div>
        </Card>

        {/* Simple Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Send Email Card */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Email Our Team</h3>
            </div>
            <p className="text-gray-600 mb-4">Send us a direct email with your questions or concerns.</p>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              rows={4}
            />
            <Button
              onClick={handleSendEmail}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </Card>

          {/* Send Bot Message Card */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-center mb-4">
              <Bot className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Message Our Bot</h3>
            </div>
            <p className="text-gray-600 mb-4">Send a quick message to our Telegram bot for faster response.</p>
            <div className="mb-4">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={4}
              />
            </div>
            <Button
              onClick={handleSendBotMessage}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Bot className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send to Bot'}
            </Button>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Photos Card */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-center mb-4">
              <Camera className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Property Photos</h3>
            </div>
            <p className="text-gray-600 mb-4">View your property inspection photos and albums.</p>
            <Button
              onClick={() => window.open(googlePhotosUrl, '_blank')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              View Photos
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Card>

          {/* Google Docs Card */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-orange-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Inspection Reports</h3>
            </div>
            <p className="text-gray-600 mb-4">Access your property inspection reports and documents.</p>
            <Button
              onClick={() => window.open(googleDocsUrl, '_blank')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Reports
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        </div>

        {/* Quick Contact Footer */}
        <Card className="p-6 shadow-lg border-0 bg-white mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+18503309933"
              className="flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex-1"
            >
              <Phone className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium">Main: (850) 330-9933</span>
            </a>
            <a
              href="tel:+15049391371"
              className="flex items-center justify-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex-1"
            >
              <Phone className="h-5 w-5 mr-2 text-red-600" />
              <span className="font-medium">Emergency: (504) 939-1371</span>
            </a>
          </div>
        </Card>
      </div>
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