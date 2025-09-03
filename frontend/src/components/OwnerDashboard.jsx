import React, { useState, useEffect } from 'react';
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
import { propertyApi } from '../services/api';

export const OwnerDashboard = ({ userData, onLogout }) => {
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [propertyData, setPropertyData] = useState({
    googleDocsUrl: null,
    googlePhotosUrl: null,
    loading: true,
    isConfigured: false
  });

  // Simple message sending
  const handleSendEmail = () => {
    const subject = `Message from ${userData.name} - ${userData.propertyAddress}`;
    const body = `From: ${userData.name}%0AEmail: ${userData.email}%0AProperty: ${userData.propertyAddress}%0A%0AMessage:%0A${encodeURIComponent(messageText)}`;
    window.location.href = `mailto:850realty@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const handleSendTeamMessage = async () => {
    if (!messageText.trim()) {
      alert('Please enter a message first');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Send to backend which will forward to team
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `Owner Team Message from ${userData.name}`,
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
            Your message has been sent to our team. We'll respond soon!
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

          {/* Send Team Message Card */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="flex items-center mb-4">
              <Bot className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Message Our Team</h3>
            </div>
            <p className="text-gray-600 mb-4">Send a quick message to our team for faster response.</p>
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
              onClick={handleSendTeamMessage}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Bot className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send to Team'}
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
    </div>
  );
};