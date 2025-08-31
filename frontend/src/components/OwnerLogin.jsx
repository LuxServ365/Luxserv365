import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const OwnerLogin = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    propertyAddress: ''
  });
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
      // Simulate login/registration process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password combination
      const userData = {
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        propertyAddress: formData.propertyAddress || 'Property Address Not Provided'
      };

      // Store user data in localStorage
      localStorage.setItem('ownerData', JSON.stringify(userData));
      onLogin(userData);
      
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-0 bg-white">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_beach-owner-hub/artifacts/b0exabcq_ChatGPT%20Image%20Aug%2031%2C%202025%2C%2004_12_53%20PM.png"
              alt="LuxServ 365 Logo"
              className="h-16 w-auto mr-3"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              LuxServ 365
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isLogin ? 'Owner Login' : 'Create Account'}
          </h2>
          <p className="text-slate-600">
            {isLogin ? 'Access your property dashboard' : 'Join our property owner network'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="John Smith"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
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
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-slate-500 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:850realty@gmail.com" className="text-blue-600 hover:text-blue-700">
              850realty@gmail.com
            </a>
            {' '}or{' '}
            <a href="tel:+18503309933" className="text-blue-600 hover:text-blue-700">
              (850) 330-9933
            </a>
          </p>
        </div>
      </Card>
    </section>
  );
};