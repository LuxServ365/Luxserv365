import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Owner Services', href: '#services' },
    { name: 'Guest Concierge', href: '#services' },
    { name: 'Why Choose Us', href: '#why-choose-us' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    'Emergency Response',
    'Property Maintenance',
    'Guest Services',
    'Cleaning & Turnovers',
    'Vendor Management',
    'Storm Preparation'
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
              LuxServ 365
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed max-w-md">
              Your trusted partner in vacation rental success. With over a decade of experience in Panama City Beach and 30A, we provide comprehensive support services for property owners and unforgettable experiences for guests.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <span>(123) 456-7890</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <span>hello@luxserv365.com</span>
              </div>
              <div className="flex items-center text-slate-300">
                <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                <span>Panama City Beach & 30A, Florida</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-slate-300">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Emergency Info */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm mb-1">
                Emergency Support Available 24/7
              </p>
              <p className="text-blue-400 font-semibold">
                (123) 456-7890
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} LuxServ 365. All rights reserved. | 
            <span className="mx-2">|</span>
            Serving Panama City Beach & 30A with pride for over a decade.
          </p>
        </div>
      </div>
    </footer>
  );
};