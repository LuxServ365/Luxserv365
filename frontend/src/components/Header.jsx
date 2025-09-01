import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Phone, UserCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <h1 className="text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">
                  LuxServ
                </span>
                <span className="text-slate-800 ml-1 relative">
                  365
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
                </span>
              </h1>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 rounded-full"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('services')}
              className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Services
            </button>
            <button
              onClick={() => navigate('/mission')}
              className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Mission
            </button>
            <button
              onClick={() => scrollToSection('why-choose-us')}
              className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Why Choose Us
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Pricing
            </button>
            <div className="flex items-center space-x-4">
              <a href="tel:+18503309933" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-200">
                <Phone className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">(850) 330-9933</span>
              </a>
              <Button 
                onClick={() => navigate('/guest-portal')}
                variant="outline"
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Guest Portal
              </Button>
              <Button 
                onClick={() => navigate('/owner-portal')}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              >
                <UserCircle className="h-4 w-4 mr-1" />
                Owner Portal
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('services')}
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium text-left"
              >
                Services
              </button>
              <button
                onClick={() => navigate('/mission')}
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium text-left"
              >
                Mission
              </button>
              <button
                onClick={() => scrollToSection('why-choose-us')}
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium text-left"
              >
                Why Choose Us
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium text-left"
              >
                Pricing
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                <a href="tel:+18503309933" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-200">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="font-medium">(850) 330-9933</span>
                </a>
                <Button 
                  onClick={() => navigate('/owner-portal')}
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-full rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  Owner Portal
                </Button>
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg transition-all duration-200"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};