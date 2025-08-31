import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Target, 
  Eye, 
  Heart, 
  Shield, 
  Sparkles, 
  MessageSquare, 
  Lightbulb, 
  Handshake,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Users,
  ArrowRight
} from 'lucide-react';

export const Mission = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const coreValues = [
    {
      icon: Shield,
      title: "Reliability",
      description: "Quick, professional response to every need, every time.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Sparkles,
      title: "Luxury Service", 
      description: "Attention to detail that elevates both owner and guest experiences.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Transparency",
      description: "Clear communication and predictable pricing with no surprises.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Modern tools, concierge-style solutions, and scalable packages.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Handshake,
      title: "Trust",
      description: "A partnership built on integrity, expertise, and accountability.",
      color: "bg-teal-100 text-teal-600"
    }
  ];

  const whyWeExistPoints = [
    {
      icon: MapPin,
      title: "Remote Host Challenges",
      description: "Late-night guest calls, storm uncertainty, vendor coordination from hundreds of miles away"
    },
    {
      icon: Clock,
      title: "Decade of Experience", 
      description: "Over 10 years solving vacation rental challenges for self-managing hosts"
    },
    {
      icon: Star,
      title: "Complete Solution",
      description: "We protect investments, delight guests, and empower owners to focus on rewards"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 text-blue-700 text-lg font-medium mb-8">
            🌊 LuxServ 365 — Mission & Vision
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="block">Property Care</span>
            <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Without Compromise
            </span>
          </h1>
          
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            ✨ <strong>365 Days a Year</strong> ✨
          </p>

          {/* Large decorative logo */}
          <div className="mb-12">
            <img 
              src="https://customer-assets.emergentagent.com/job_beach-owner-hub/artifacts/b0exabcq_ChatGPT%20Image%20Aug%2031%2C%202025%2C%2004_12_53%20PM.png"
              alt="LuxServ 365 Logo"
              className="h-40 w-auto mx-auto opacity-90"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 p-3 rounded-xl mr-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900">Our Mission</h2>
              </div>
              
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                At LuxServ 365, our mission is to <strong>empower vacation rental owners with the confidence and support to successfully manage their properties from anywhere in the world</strong>. We deliver luxury-level care, boots-on-the-ground reliability, and 365-day consistency, ensuring that both owners and guests enjoy peace of mind, safety, and unforgettable experiences.
              </p>
            </div>

            <Card className="p-8 shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-teal-50">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-900 mb-2">Maximize Revenue</h3>
                  <p className="text-sm text-slate-600">Professional management drives higher income</p>
                </div>
                <div>
                  <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3 fill-current" />
                  <h3 className="font-bold text-slate-900 mb-2">5-Star Experiences</h3>
                  <p className="text-sm text-slate-600">Consistent luxury service for all guests</p>
                </div>
                <div>
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-900 mb-2">Protect Investments</h3>
                  <p className="text-sm text-slate-600">Proactive care prevents costly issues</p>
                </div>
                <div>
                  <Clock className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-900 mb-2">365-Day Support</h3>
                  <p className="text-sm text-slate-600">Always available when you need us</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/10 p-3 rounded-xl mr-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold">Our Vision</h2>
            </div>
            
            <p className="text-xl text-blue-200 max-w-5xl mx-auto leading-relaxed">
              We envision a future where <strong className="text-white">self-managing property owners no longer have to choose between control and convenience</strong>. By bridging the gap between full-service management and DIY hosting, we provide flexible, transparent, and tailored solutions that maximize income while safeguarding your investment.
            </p>
          </div>

          <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">The Future of Vacation Rental Management</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-500/20 rounded-2xl p-6 mb-4">
                  <Users className="h-12 w-12 text-blue-300 mx-auto mb-3" />
                  <h4 className="font-bold text-white mb-2">Owner Control</h4>
                  <p className="text-blue-200 text-sm">You maintain ownership and decision-making power</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-teal-500/20 rounded-2xl p-6 mb-4">
                  <Handshake className="h-12 w-12 text-teal-300 mx-auto mb-3" />
                  <h4 className="font-bold text-white mb-2">Professional Support</h4>
                  <p className="text-blue-200 text-sm">Expert local team handling day-to-day operations</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-2xl p-6 mb-4">
                  <TrendingUp className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                  <h4 className="font-bold text-white mb-2">Maximum Returns</h4>
                  <p className="text-blue-200 text-sm">Optimized revenue and protected investments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-xl mr-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">Our Core Values</h2>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide every decision and drive every action at LuxServ 365
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="p-8 h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border-0 shadow-lg group">
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-2xl mb-6 ${value.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Why We Exist</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
              We know what it's like to be an out-of-state or remote host — the late-night guest calls, the uncertainty after a storm, the stress of coordinating vendors from hundreds of miles away. With over a decade of experience in the vacation rental industry, our team was built to solve these challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {whyWeExistPoints.map((point, index) => {
              const IconComponent = point.icon;
              return (
                <Card key={index} className="p-8 text-center shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-blue-100 p-4 rounded-2xl inline-flex mb-6">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{point.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{point.description}</p>
                </Card>
              );
            })}
          </div>

          {/* Key Message */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-12 text-white text-center">
            <h3 className="text-3xl font-bold mb-6">We don't just maintain properties.</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              We <strong className="text-white">protect investments</strong>, <strong className="text-white">delight guests</strong>, and <strong className="text-white">empower owners</strong> to focus on what matters most: enjoying the rewards of vacation rental ownership.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                Start Your Partnership Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};