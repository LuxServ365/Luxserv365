import React from 'react';
import { Card } from './ui/card';
import { 
  AlertTriangle, 
  Sparkles, 
  Wrench, 
  Package, 
  Smartphone, 
  Cloud, 
  Users, 
  Monitor,
  ShoppingCart,
  Umbrella,
  MapPin,
  ChefHat,
  Gift,
  MessageCircle,
  Car,
  Baby
} from 'lucide-react';

export const Services = () => {
  const ownerServices = [
    {
      icon: AlertTriangle,
      title: "24/7 Emergency Response",
      description: "Round-the-clock emergency support for urgent property issues and guest situations."
    },
    {
      icon: Sparkles,
      title: "Professional Turnovers & Deep Cleans",
      description: "Thorough cleaning and property preparation between guest stays to maintain high standards."
    },
    {
      icon: Wrench,
      title: "Preventative Maintenance & Repairs",
      description: "Proactive maintenance schedules and quick repairs to protect your investment."
    },
    {
      icon: Package,
      title: "Inventory Restock & Supply Management",
      description: "Keep your property fully stocked with essentials and amenities for guests."
    },
    {
      icon: Smartphone,
      title: "Smart Lock & Tech Monitoring",
      description: "Monitor and maintain all smart home technology for seamless guest experiences."
    },
    {
      icon: Cloud,
      title: "Hurricane & Storm Prep + Post-Storm Checks",
      description: "Comprehensive storm preparation and post-storm property assessments."
    },
    {
      icon: Users,
      title: "Local Vendor Coordination",
      description: "Manage relationships with pool, landscaping, HVAC, and other service providers."
    },
    {
      icon: Monitor,
      title: "Owner Dashboard with Real-time Updates",
      description: "Stay informed with live updates on your property status and guest activities."
    }
  ];

  const guestServices = [
    {
      icon: ShoppingCart,
      title: "Pre-Arrival Grocery & Beverage Stocking",
      description: "Have your vacation rental fully stocked before guests arrive."
    },
    {
      icon: Umbrella,
      title: "Beach Gear Rentals",
      description: "Chairs, umbrellas, paddleboards, and other beach equipment rentals."
    },
    {
      icon: MapPin,
      title: "Exclusive Local Tours & Experience Booking",
      description: "Curated local experiences and tour bookings for memorable vacations."
    },
    {
      icon: ChefHat,
      title: "Private Chef & Catering Coordination",
      description: "Professional culinary services for special occasions and convenience."
    },
    {
      icon: Gift,
      title: "Celebration Packages",
      description: "Special arrangements for birthdays, honeymoons, anniversaries, and more."
    },
    {
      icon: MessageCircle,
      title: "On-Demand Concierge Text Line",
      description: "24/7 text support for guest questions and requests during their stay."
    },
    {
      icon: Car,
      title: "Transportation Assistance",
      description: "Airport pickup coordination and golf cart rental arrangements."
    },
    {
      icon: Baby,
      title: "Baby & Family Gear Rentals",
      description: "Cribs, high chairs, strollers, and other family-friendly equipment."
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Owner Services */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Owner Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
              Empowering Owners. Protecting Investments.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
              📌 Peace of mind, every day of the year.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownerServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="p-6 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 group">
                  <div className="flex flex-col items-start h-full">
                    <div className="bg-blue-100 p-3 rounded-xl mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3 leading-tight">{service.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed flex-1">{service.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Guest Concierge */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Guest Concierge
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
              Elevating the Guest Experience.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium">
              📌 Your vacation, upgraded.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guestServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="p-6 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 group">
                  <div className="flex flex-col items-start h-full">
                    <div className="bg-teal-100 p-3 rounded-xl mb-4 group-hover:bg-teal-200 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3 leading-tight">{service.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed flex-1">{service.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};