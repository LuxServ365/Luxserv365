# LuxServ 365 - API Contracts & Backend Integration Protocol

## Current Frontend Mock Implementation

### Mock Data Location: `/app/frontend/src/utils/mock.js`

**Functions Currently Mocked:**
- `mockSubmitContact(formData)` - Simulates contact form submission
- `mockGetSubmissions()` - Retrieves stored submissions from localStorage

**Mock Data Structure:**
```javascript
{
  id: timestamp,
  name: string,
  email: string,
  phone: string,
  propertyAddress: string,
  currentlyManaging: string,
  message: string,
  timestamp: ISO string,
  status: 'pending'
}
```

## Backend API Contracts to Implement

### 1. Contact Form Submission Endpoint
**POST `/api/contact`**

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "phone": "string (optional)",
  "propertyAddress": "string (optional)",
  "currentlyManaging": "string (optional)",
  "message": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "propertyAddress": "string", 
    "currentlyManaging": "string",
    "message": "string",
    "createdAt": "ISO timestamp",
    "status": "pending"
  },
  "message": "Contact form submitted successfully"
}
```

### 2. Get Contact Submissions Endpoint (Optional - for admin)
**GET `/api/contact`**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "propertyAddress": "string",
      "currentlyManaging": "string", 
      "message": "string",
      "createdAt": "ISO timestamp",
      "status": "pending"
    }
  ]
}
```

## Database Schema

### Collection: `contact_submissions`
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, email validation),
  phone: String,
  propertyAddress: String,
  currentlyManaging: String,
  message: String,
  createdAt: Date (default: now),
  status: String (default: 'pending')
}
```

## Frontend Integration Steps

1. **Update Contact Component**: Replace mock function calls with actual API calls
2. **Remove Mock Dependency**: Remove import of `mockSubmitContact` from Contact.jsx  
3. **Error Handling**: Add proper error handling for API failures
4. **Loading States**: Already implemented in current Contact component

## Implementation Checklist

### Backend Tasks:
- [ ] Create ContactSubmission model with validation
- [ ] Implement POST `/api/contact` endpoint
- [ ] Implement GET `/api/contact` endpoint (admin)
- [ ] Add email validation
- [ ] Add error handling and logging
- [ ] Test endpoints with curl/Postman

### Frontend Integration Tasks:
- [ ] Create API service function for contact submission
- [ ] Update Contact.jsx to use real API instead of mock
- [ ] Remove mock.js dependency
- [ ] Test form submission with backend
- [ ] Add proper error messages for API failures

## API Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid input data",
  "details": ["Email is required", "Name is required"]
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Unable to process request"
}
```

## Integration Notes

- Frontend already has loading states and success handling
- Form validation is handled on frontend
- Backend should add server-side validation  
- Consider adding email notifications to business owner when form is submitted
- All API endpoints use `/api` prefix for proper routing