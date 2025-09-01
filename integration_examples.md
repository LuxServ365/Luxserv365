# Booking Integration Examples & User Flows

## Real-World Integration Scenarios

### Scenario 1: New Airbnb Booking
```
1. Guest books "Beach Condo 123" on Airbnb
2. Airbnb → Guesty → LuxServ Webhook:
   {
     "booking_id": "HM123456789",
     "property": "Beach Condo 123, Panama City Beach",
     "guest_name": "Sarah Johnson",
     "guest_email": "sarah@email.com",
     "check_in": "2024-06-15",
     "check_out": "2024-06-22",
     "guest_count": 4,
     "special_requests": "Celebrating anniversary"
   }

3. LuxServ System Automatically:
   - Creates guest profile
   - Schedules pre-arrival grocery stocking
   - Sends owner notification: "New booking at Beach Condo 123"
   - Prepares celebration package (because of special request)
   - Updates admin dashboard calendar
```

### Scenario 2: Guest Service Request Integration
```
1. Guest Sarah uses Guest Portal during stay
2. System pre-fills form with booking data:
   - Property: "Beach Condo 123" (auto-selected)
   - Guest Info: "Sarah Johnson, sarah@email.com" (auto-filled)
   - Check-in/out dates: "June 15-22" (auto-filled)
   - Booking ID: "HM123456789" (hidden, linked)

3. Service request shows in admin dashboard:
   - Linked to original booking
   - Shows guest history
   - Displays property context
   - Owner gets notification: "Service request from current guest at Beach Condo 123"
```

### Scenario 3: Owner Dashboard Integration
```
Owner logs into portal and sees:

Properties Dashboard:
┌─────────────────────────────────────┐
│ Beach Condo 123                     │
│ ◦ Current Guest: Sarah Johnson     │
│ ◦ Checkout: June 22 (2 days)       │  
│ ◦ Active Requests: 1 (Beach Gear)  │
│ ◦ Next Guest: Mike Chen (June 24)  │
│                                     │
│ Sea Breeze Villa                    │
│ ◦ Status: Available                 │
│ ◦ Next Booking: July 1             │
│ ◦ Maintenance: AC service due       │
└─────────────────────────────────────┘

Service Requests (Property-Filtered):
- June 20: Beach gear delivery (Sarah Johnson) - Completed
- June 15: Pre-arrival groceries (Sarah Johnson) - Completed  
- June 10: Post-checkout cleaning (Previous guest) - Completed
```

## API Integration Code Examples

### Webhook Receiver (Backend)
```python
@api_router.post("/webhooks/booking-created")
async def handle_booking_webhook(
    booking_data: dict = Body(...),
    signature: str = Header(None, alias="X-Webhook-Signature")
):
    # Verify webhook signature
    if not verify_webhook_signature(signature, booking_data):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Process booking data
    booking = {
        "platform_booking_id": booking_data["booking_id"],
        "platform": booking_data["source"],  # airbnb, vrbo, etc.
        "property_address": booking_data["property"]["address"],
        "guest_name": booking_data["guest"]["name"],
        "guest_email": booking_data["guest"]["email"],
        "check_in": booking_data["check_in_date"],
        "check_out": booking_data["check_out_date"],
        "guest_count": booking_data["guest_count"],
        "special_requests": booking_data.get("special_requests", "")
    }
    
    # Save to database
    await db.bookings.insert_one(booking)
    
    # Trigger automated services
    await schedule_pre_arrival_services(booking)
    
    # Notify owner and admin
    await send_booking_notifications(booking)
    
    return {"status": "success", "booking_id": booking["platform_booking_id"]}

async def schedule_pre_arrival_services(booking):
    check_in_date = datetime.fromisoformat(booking["check_in"])
    
    # Schedule grocery delivery 2 days before check-in
    grocery_date = check_in_date - timedelta(days=2)
    await schedule_service("grocery_delivery", booking["property_address"], grocery_date)
    
    # Schedule cleaning verification day of check-in
    await schedule_service("cleaning_verification", booking["property_address"], check_in_date)
    
    # If anniversary mentioned, schedule celebration setup
    if "anniversary" in booking["special_requests"].lower():
        await schedule_service("celebration_setup", booking["property_address"], check_in_date)
```

### Enhanced Guest Portal (Frontend)
```javascript
// Auto-populate guest portal form with booking data
const GuestPortalEnhanced = () => {
  const [bookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    // Get booking data from URL params or booking code
    const bookingCode = new URLSearchParams(window.location.search).get('booking');
    if (bookingCode) {
      fetchBookingData(bookingCode);
    }
  }, []);
  
  const fetchBookingData = async (bookingCode) => {
    try {
      const response = await apiClient.get(`/bookings/lookup/${bookingCode}`);
      if (response.data.success) {
        const booking = response.data.booking;
        setBookingData(booking);
        
        // Pre-fill form with booking data
        setFormData({
          guestName: booking.guest_name,
          guestEmail: booking.guest_email,
          propertyAddress: booking.property_address,
          checkInDate: booking.check_in,
          checkOutDate: booking.check_out,
          numberOfGuests: booking.guest_count
        });
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
    }
  };
  
  return (
    <div className="guest-portal">
      {bookingData && (
        <div className="booking-context bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-blue-900">Your Current Stay</h3>
          <p>📍 {bookingData.property_address}</p>
          <p>📅 {bookingData.check_in} to {bookingData.check_out}</p>
          <p>👥 {bookingData.guest_count} guests</p>
        </div>
      )}
      
      {/* Rest of the form with pre-filled data */}
    </div>
  );
};
```

### Owner Dashboard with Booking Integration
```javascript
const OwnerDashboardEnhanced = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  
  const loadPropertyData = async (propertyId) => {
    const [bookingsRes, requestsRes] = await Promise.all([
      apiClient.get(`/owner/properties/${propertyId}/bookings`),
      apiClient.get(`/owner/properties/${propertyId}/service-requests`)
    ]);
    
    setBookings(bookingsRes.data.bookings);
    setServiceRequests(requestsRes.data.requests);
  };
  
  return (
    <div className="owner-dashboard">
      <div className="property-selector">
        {properties.map(property => (
          <PropertyCard 
            key={property.id}
            property={property}
            currentBooking={getCurrentBooking(property.id)}
            upcomingServices={getUpcomingServices(property.id)}
            onClick={() => setSelectedProperty(property)}
          />
        ))}
      </div>
      
      {selectedProperty && (
        <div className="property-details">
          <BookingCalendar 
            propertyId={selectedProperty.id}
            bookings={bookings}
            serviceRequests={serviceRequests}
          />
          <ServiceRequestsList 
            requests={serviceRequests}
            bookingContext={bookings}
          />
        </div>
      )}
    </div>
  );
};
```

## Platform-Specific Integration Details

### Guesty Integration (Recommended Starting Point)
```
API Endpoint: https://api.guesty.com/api/v2/
Authentication: OAuth 2.0 + API Key

Key Endpoints:
GET /listings - Get all properties
GET /reservations - Get bookings
POST /webhooks - Set up real-time notifications
GET /guests - Get guest information

Webhook Events:
- reservation.created
- reservation.updated
- guest.checked_in
- guest.checked_out
- guest.message_received

Monthly Cost: $99-299/month (includes API access)
Setup Time: 2-3 weeks
```

### Direct Airbnb Integration
```
API Endpoint: https://api.airbnb.com/v2/
Authentication: OAuth 2.0 (complex approval process)

Key Endpoints:
GET /reservations - Get booking details
GET /listings - Get property information
POST /messages - Send guest messages
GET /reviews - Get property reviews

Limitations:
- Requires Airbnb partnership approval
- Strict rate limiting (1000 calls/day)
- Limited guest contact information
- Complex OAuth flow

Setup Time: 1-2 months (including approval)
Cost: Free API, but requires partnership
```

### OwnerRez Integration (Alternative Channel Manager)
```
API Endpoint: https://api.ownerreservations.com/v2/
Authentication: API Key

Key Features:
- Multi-platform booking sync
- Property management
- Guest communication
- Financial reporting
- Maintenance scheduling

Monthly Cost: $35-75/month per property
Setup Time: 1-2 weeks
API Access: Included with subscription
```