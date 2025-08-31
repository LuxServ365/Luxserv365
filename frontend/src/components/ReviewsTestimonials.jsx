import React, { useState } from 'react';
import { Card } from './ui/card';
import { Star, User, Calendar, MapPin, ThumbsUp } from 'lucide-react';

export const ReviewsTestimonials = ({ userData }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const reviews = [
    {
      id: 1,
      type: 'owner',
      name: 'Sarah Mitchell',
      location: 'Panama City Beach, FL',
      rating: 5,
      date: '2024-08-15',
      title: 'Exceptional Service and Peace of Mind',
      review: 'LuxServ 365 has completely transformed how I manage my beachfront condo. Their 24/7 emergency response saved me from a major issue during Hurricane season. The inspection reports are incredibly detailed, and I love being able to see photos of my property regularly. The team is professional, responsive, and truly cares about protecting my investment.',
      propertyType: 'Beachfront Condo',
      helpful: 12
    },
    {
      id: 2,
      type: 'guest',
      name: 'Michael & Jennifer Rodriguez',
      location: 'Atlanta, GA',
      rating: 5,
      date: '2024-08-10',
      title: 'Best Vacation Experience Ever!',
      review: 'We stayed at a LuxServ 365 managed property and were blown away by the service. The property was immaculate, fully stocked with everything we needed, and the concierge team helped us book amazing local tours. When we had a question about the smart TV, they responded within minutes via text. This is how vacation rentals should be managed!',
      propertyType: 'Gulf View Townhouse',
      helpful: 18
    },
    {
      id: 3,
      type: 'owner',
      name: 'Robert Chen',
      location: '30A, FL',
      rating: 5,
      date: '2024-07-28',
      title: 'Professional Property Management at Its Best',
      review: 'After trying two other property management companies, LuxServ 365 is in a league of their own. Their owner portal makes it so easy to track everything - messages, inspection reports, and property photos all in one place. The Premium Care package has been worth every penny. My guests consistently leave 5-star reviews thanks to their attention to detail.',
      propertyType: 'Luxury Beach House',
      helpful: 9
    },
    {
      id: 4,
      type: 'guest',
      name: 'Amanda Thompson',
      location: 'Nashville, TN',
      rating: 5,
      date: '2024-07-20',
      title: 'Above and Beyond Service',
      review: 'LuxServ 365 went above and beyond for our family reunion. They helped coordinate grocery delivery before our arrival, arranged beach gear for 12 people, and even helped us book a private chef for our anniversary dinner. The property was perfect and the service was exceptional. We will definitely be back!',
      propertyType: 'Waterfront Villa',
      helpful: 15
    },
    {
      id: 5,
      type: 'owner',
      name: 'Linda & David Morrison',
      location: 'Panama City Beach, FL',
      rating: 5,
      date: '2024-07-05',
      title: 'Reliable Partners You Can Trust',
      review: 'We own three rental properties and LuxServ 365 manages them all. What sets them apart is their proactive approach - they catch maintenance issues before they become problems, keep our properties fully stocked, and handle guest communications professionally. The monthly inspection reports give us complete peace of mind living 500 miles away.',
      propertyType: 'Multiple Properties',
      helpful: 22
    },
    {
      id: 6,
      type: 'guest',
      name: 'Tyler & Jessica Park',
      location: 'Birmingham, AL',
      rating: 5,
      date: '2024-06-18',
      title: 'Luxury Experience Made Easy',
      review: 'From the moment we arrived, everything was perfect. The property was spotless, the smart home features worked flawlessly, and the welcome package with local recommendations was thoughtful. When we needed extra towels, they were delivered within an hour. This is what high-end vacation rental service should look like!',
      propertyType: 'Premium Condo',
      helpful: 11
    },
    {
      id: 7,
      type: 'owner',
      name: 'Carlos Mendez',
      location: '30A, FL',
      rating: 5,
      date: '2024-06-02',
      title: 'Outstanding Communication and Results',
      review: 'The team at LuxServ 365 communicates better than any service provider I have ever worked with. Every message is answered quickly, every inspection is thorough, and the photos they take of my property are professional quality. My rental income has increased 30% since switching to them because guests love the service level.',
      propertyType: 'Seaside Cottage',
      helpful: 16
    },
    {
      id: 8,
      type: 'guest',
      name: 'Rachel & Mark Williams',
      location: 'Memphis, TN',
      rating: 5,
      date: '2024-05-25',
      title: 'Flawless Vacation Experience',
      review: 'Every detail was handled perfectly. The property was exactly as described, the check-in process was seamless, and the concierge service helped make our vacation special. They arranged paddleboard rentals, restaurant reservations, and even helped coordinate a surprise proposal on the beach. Absolutely incredible service!',
      propertyType: 'Beachfront Rental',
      helpful: 25
    }
  ];

  const filteredReviews = activeCategory === 'all' 
    ? reviews 
    : reviews.filter(review => review.type === activeCategory);

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ownerReviews = reviews.filter(r => r.type === 'owner').length;
  const guestReviews = reviews.filter(r => r.type === 'guest').length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="p-6 shadow-lg border-0 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 flex items-center">
          <Star className="h-6 w-6 mr-2 text-yellow-400 fill-current" />
          Reviews & Testimonials
        </h3>
        <div className="text-sm text-slate-500">
          {reviews.length} total reviews
        </div>
      </div>

      {/* Rating Summary */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {renderStars(5)}
              </div>
              <span className="text-2xl font-bold text-slate-900">{averageRating.toFixed(1)}</span>
              <span className="text-slate-600 ml-2">out of 5</span>
            </div>
            <p className="text-sm text-slate-600">
              Based on {reviews.length} reviews ({ownerReviews} from owners, {guestReviews} from guests)
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600">100%</div>
            <div className="text-sm text-slate-600">5-Star Reviews</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-100 rounded-lg p-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeCategory === 'all'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveCategory('owner')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeCategory === 'owner'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Property Owners ({ownerReviews})
        </button>
        <button
          onClick={() => setActiveCategory('guest')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeCategory === 'guest'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Guests ({guestReviews})
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 max-h-96 overflow-y-auto">
        {filteredReviews.map((review) => (
          <div key={review.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-slate-100 rounded-full p-3 mr-3">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{review.name}</h4>
                  <div className="flex items-center text-sm text-slate-600 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{review.location}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {renderStars(review.rating)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  review.type === 'owner' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {review.type === 'owner' ? 'Property Owner' : 'Guest'}
                </span>
              </div>
            </div>

            <h5 className="font-medium text-slate-900 mb-2">{review.title}</h5>
            <p className="text-slate-700 leading-relaxed mb-4">{review.review}</p>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <div className="flex items-center">
                <span className="font-medium">Property:</span>
                <span className="ml-2">{review.propertyType}</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>{review.helpful} found this helpful</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">
            Ready to Experience 5-Star Service?
          </h4>
          <p className="text-blue-700 mb-4">
            Join our satisfied property owners and guests who trust LuxServ 365 for exceptional vacation rental management.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="tel:+18503309933"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Call (850) 330-9933
            </a>
            <a
              href="mailto:850realty@gmail.com"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};