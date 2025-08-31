import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { contactApi } from '../services/api';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    currentlyManaging: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Submit form data to backend API
      const response = await contactApi.submit(formData);
      
      if (response.success) {
        setIsSubmitted(true);
        console.log('Contact form submitted successfully:', response.data);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            propertyAddress: '',
            currentlyManaging: '',
            message: ''
          });
        }, 3000);
      } else {
        throw new Error(response.error || 'Failed to submit form');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: "(123) 456-7890",
      subtitle: "24/7 Emergency Line Available"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "hello@luxserv365.com",
      subtitle: "We respond within 2 hours"
    },
    {
      icon: MapPin,
      title: "Service Area",
      details: "Panama City Beach & 30A",
      subtitle: "Florida Gulf Coast"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 8AM-6PM",
      subtitle: "Emergency support 24/7"
    }
  ];

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Thank You!</h2>
            <p className="text-xl text-slate-600 mb-6">
              We've received your inquiry and will contact you within 24 hours to discuss how LuxServ 365 can help with your vacation rental.
            </p>
            <p className="text-slate-500">
              For immediate assistance, call us at (123) 456-7890
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Let's discuss how LuxServ 365 can help you maximize your vacation rental success while minimizing your stress.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 shadow-xl border-0 bg-white">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Get Your Free Consultation</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <label htmlFor="currentlyManaging" className="block text-sm font-medium text-slate-700 mb-2">
                    Currently Managing?
                  </label>
                  <select
                    id="currentlyManaging"
                    name="currentlyManaging"
                    value={formData.currentlyManaging}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select an option</option>
                    <option value="self-managing">Self-managing currently</option>
                    <option value="using-pm">Using property manager</option>
                    <option value="new-property">New property owner</option>
                    <option value="considering">Considering vacation rental</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="propertyAddress" className="block text-sm font-medium text-slate-700 mb-2">
                  Property Address
                </label>
                <input
                  type="text"
                  id="propertyAddress"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="123 Beach Boulevard, Panama City Beach, FL"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  How can we help you?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about your property and what challenges you're facing with vacation rental management..."
                ></textarea>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-5 w-5 mr-2" />
                    Get Free Consultation
                  </div>
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 roundedl-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Get in Touch</h3>
            
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="p-6 shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-xl mr-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{info.title}</h4>
                      <p className="text-lg text-slate-800 mb-1">{info.details}</p>
                      <p className="text-sm text-slate-600">{info.subtitle}</p>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Emergency contact highlight */}
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <h4 className="font-bold text-red-800">Emergency Line</h4>
                  <p className="text-red-700">Available 24/7 for urgent property issues</p>
                  <p className="text-red-600 font-semibold text-lg">(123) 456-7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};