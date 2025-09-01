import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Header } from './Header';
import { Footer } from './Footer';
import {
  ShoppingCart,
  Umbrella,
  MapPin,
  ChefHat,
  Gift,
  MessageCircle,
  Car,
  Baby,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

export const GuestServices = () => {
  const services = [
    {
      icon: <ShoppingCart className="h-12 w-12 text-blue-600" />,
      title: "🛒 Pre-Arrival Grocery & Beverage Stocking",
      description: "Have your vacation rental fully stocked with groceries and beverages before you arrive. We handle the shopping so you can start relaxing immediately.",
      features: ["Custom grocery lists", "Premium beverage selection", "Special dietary accommodations", "Fresh produce and essentials"]
    },
    {
      icon: <Umbrella className="h-12 w-12 text-teal-600" />,
      title: "🏖️ Beach/Recreation Gear Coordination",
      description: "Request beach chairs, umbrellas, water sports equipment, or recreation gear. Everything you need for the perfect beach day, delivered right to your rental.",
      features: ["Beach chairs & umbrellas", "Water sports equipment", "Boogie boards & floats", "Beach toys for kids"]
    },
    {
      icon: <MapPin className="h-12 w-12 text-green-600" />,
      title: "🎯 Concierge Services (Local info, visitor information, trip ideas & coordination)",
      description: "Get local recommendations, visitor information, and help coordinating activities. Discover the best of Panama City Beach and 30A with our curated experiences.",
      features: ["Dolphin watching tours", "Fishing charters", "Local restaurant reservations", "Hidden gem recommendations"]
    },
    {
      icon: <Car className="h-12 w-12 text-red-600" />,
      title: "🚗 Personal Transportation Assistance/ Luggage Assistance",
      description: "Airport pickup, local transportation, or luggage handling assistance. Seamless travel experience with professional coordination.",
      features: ["Airport pickup/drop-off", "Local transportation", "Luggage assistance", "Car rental coordination"]
    },
    {
      icon: <Gift className="h-12 w-12 text-pink-600" />,
      title: "🎉 Celebration Services",
      description: "Special arrangements for birthdays, anniversaries, or other celebrations. Make your special occasions unforgettable with our custom celebration packages.",
      features: ["Birthday celebrations", "Anniversary packages", "Welcome amenities", "Custom decorations"]
    },
    {
      icon: <Star className="h-12 w-12 text-emerald-600" />,
      title: "🐾 Pet Services & Accommodations",
      description: "Complete pet care services for your furry family members. From dog walking to veterinary coordination, we ensure your pets are comfortable and well-cared for during your stay.",
      features: ["Dog walking & pet sitting", "Pet supply delivery", "Veterinary coordination", "Pet-friendly equipment rental", "Emergency pet care", "Pet waste cleanup"]
    },
    {
      icon: <MessageCircle className="h-12 w-12 text-orange-600" />,
      title: "🧹 Housekeeping Requests (Cleaning, Trash Removal, Party Clean up)",
      description: "Request additional cleaning, trash removal, or post-event cleanup services. Professional housekeeping available during your stay.",
      features: ["Additional cleaning service", "Trash removal", "Post-party cleanup", "Linen changes"]
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-green-600" />,
      title: "🏠 Property Issues (AC, WiFi, Appliances)",
      description: "Report problems with air conditioning, internet, appliances, or other property features. Our local team responds quickly to resolve any issues.",
      features: ["AC repair & maintenance", "WiFi troubleshooting", "Appliance repairs", "Emergency response"]
    },
    {
      icon: <AlertTriangle className="h-12 w-12 text-red-600" />,
      title: "🆘 Emergency/Urgent",
      description: "Immediate assistance required for urgent situations. 24/7 emergency response team ready to help with any critical issues.",
      features: ["24/7 emergency response", "Immediate assistance", "Critical issue resolution", "Safety support"]
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-purple-600" />,
      title: "💬 General Inquiry",
      description: "General questions or requests not covered by other categories. Our concierge team is here to help with any questions about your stay.",
      features: ["General assistance", "Local information", "Stay coordination", "Custom requests"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Atlanta, GA",
      rating: 5,
      comment: "The pre-arrival grocery service was a game-changer! We arrived to a fully stocked kitchen with everything on our list. Made our vacation start perfectly!"
    },
    {
      name: "Mike & Lisa Chen",
      location: "Nashville, TN", 
      rating: 5,
      comment: "LuxServ 365's beach gear service saved us so much hassle. High-quality chairs, umbrellas, and water toys delivered right to our condo. Excellent service!"
    },
    {
      name: "David Rodriguez",
      location: "Dallas, TX",
      rating: 5,
      comment: "The concierge service helped us discover amazing local restaurants and activities we never would have found on our own. True local expertise!"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Premium Guest
              <span className="block bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 bg-clip-text text-transparent">
                Concierge Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Elevate your Panama City Beach & 30A vacation experience with our comprehensive concierge services. 
              From pre-arrival preparations to 24/7 support during your stay.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
              <div className="flex items-center text-slate-700">
                <Star className="h-5 w-5 text-yellow-500 mr-2 fill-current" />
                <span className="font-semibold">5-Star Service</span>
              </div>
              <div className="flex items-center text-slate-700">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">365 Days Available</span>
              </div>
              <div className="flex items-center text-slate-700">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold">Local Expertise</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => window.location.href = '/guest-portal'}
              >
                Request Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => document.getElementById('contact-info').scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Us
                <Phone className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Complete Concierge Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every service designed to enhance your vacation experience and create unforgettable memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="p-8 shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-slate-700">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">Ready to Experience Luxury Service?</h3>
              <p className="text-xl mb-6 opacity-90">
                Submit your service request through our Guest Portal and let us make your vacation extraordinary.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => window.location.href = '/guest-portal'}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Our Guests Say
            </h2>
            <p className="text-xl text-slate-600">
              Real experiences from guests who've enjoyed our concierge services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-lg border-0 bg-white">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">"{testimonial.comment}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section id="contact-info" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Need Immediate Assistance?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-6 shadow-lg border-0 bg-blue-50">
              <div className="flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Main Line</h3>
              <a 
                href="tel:+18503309933"
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                (850) 330-9933
              </a>
              <p className="text-sm text-slate-600 mt-2">365 Days: 8AM-6PM</p>
            </Card>
            
            <Card className="p-6 shadow-lg border-0 bg-red-50">
              <div className="flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Emergency</h3>
              <a 
                href="tel:+15049391371"
                className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                (504) 939-1371
              </a>
              <p className="text-sm text-slate-600 mt-2">24/7 Emergency Line</p>
            </Card>
          </div>
          
          <div className="mt-8">
            <Card className="p-6 shadow-lg border-0 bg-teal-50">
              <div className="flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Us</h3>
              <a 
                href="mailto:850realty@gmail.com"
                className="text-xl font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                850realty@gmail.com
              </a>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};