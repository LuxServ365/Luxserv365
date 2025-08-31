import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Phone, Mail } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              LuxServ 365
            </h1>
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
              <a href="tel:+1234567890" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-200">
                <Phone className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">(123) 456-7890</span>
              </a>
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
                <a href="tel:+1234567890" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-200">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="font-medium">(123) 456-7890</span>
                </a>
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