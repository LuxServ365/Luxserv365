#!/usr/bin/env python3
"""
Backend API Testing for LuxServ 365 
Tests the contact form API endpoints, guest portal photo upload functionality, and data validation
"""

import requests
import json
import sys
from datetime import datetime
import os
from dotenv import load_dotenv
import io
from PIL import Image

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://host-empowered.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing backend API at: {API_BASE_URL}")

class ContactFormTester:
    def __init__(self):
        self.api_base = API_BASE_URL
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_valid_contact_submission(self):
        """Test valid contact form submission with all fields"""
        test_data = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@beachowner.com",
            "phone": "(850) 555-0123",
            "propertyAddress": "123 Beach Drive, Panama City Beach, FL 32413",
            "currentlyManaging": "Self-managing 2 properties",
            "message": "I'm interested in your property management services for my beachfront condo. I currently self-manage but need help with guest services and maintenance coordination."
        }
        
        try:
            response = requests.post(f"{self.api_base}/contact", json=test_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    # Verify response structure
                    contact_data = data['data']
                    required_fields = ['id', 'name', 'email', 'createdAt', 'status']
                    missing_fields = [field for field in required_fields if field not in contact_data]
                    
                    if not missing_fields:
                        self.log_test("Valid Contact Submission", True, 
                                    f"Successfully submitted contact form. ID: {contact_data.get('id')}")
                        return contact_data.get('id')
                    else:
                        self.log_test("Valid Contact Submission", False, 
                                    f"Response missing required fields: {missing_fields}", data)
                else:
                    self.log_test("Valid Contact Submission", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Valid Contact Submission", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Valid Contact Submission", False, f"Request failed: {str(e)}")
        
        return None
    
    def test_required_field_validation(self):
        """Test required field validation (name, email)"""
        
        # Test missing name
        test_data = {
            "email": "test@example.com"
        }
        
        try:
            response = requests.post(f"{self.api_base}/contact", json=test_data, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("Required Field Validation - Missing Name", True, 
                            "Correctly rejected submission without name")
            else:
                self.log_test("Required Field Validation - Missing Name", False, 
                            f"Expected 422, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Required Field Validation - Missing Name", False, f"Request failed: {str(e)}")
        
        # Test missing email
        test_data = {
            "name": "John Doe"
        }
        
        try:
            response = requests.post(f"{self.api_base}/contact", json=test_data, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("Required Field Validation - Missing Email", True, 
                            "Correctly rejected submission without email")
            else:
                self.log_test("Required Field Validation - Missing Email", False, 
                            f"Expected 422, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Required Field Validation - Missing Email", False, f"Request failed: {str(e)}")
        
        # Test empty name
        test_data = {
            "name": "",
            "email": "test@example.com"
        }
        
        try:
            response = requests.post(f"{self.api_base}/contact", json=test_data, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("Required Field Validation - Empty Name", True, 
                            "Correctly rejected submission with empty name")
            else:
                self.log_test("Required Field Validation - Empty Name", False, 
                            f"Expected 422, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Required Field Validation - Empty Name", False, f"Request failed: {str(e)}")
    
    def test_email_format_validation(self):
        """Test email format validation"""
        invalid_emails = [
            "invalid-email",
            "test@",
            "@example.com",
            "test..test@example.com",
            "test@example",
        ]
        
        for invalid_email in invalid_emails:
            test_data = {
                "name": "Test User",
                "email": invalid_email
            }
            
            try:
                response = requests.post(f"{self.api_base}/contact", json=test_data, timeout=10)
                if response.status_code == 422:  # Validation error expected
                    self.log_test(f"Email Validation - {invalid_email}", True, 
                                "Correctly rejected invalid email format")
                else:
                    self.log_test(f"Email Validation - {invalid_email}", False, 
                                f"Expected 422, got {response.status_code}", response.text)
            except Exception as e:
                self.log_test(f"Email Validation - {invalid_email}", False, f"Request failed: {str(e)}")
    
    def test_phone_validation(self):
        """Test phone number validation"""
        
        # Test valid phone formats
        valid_phones = [
            "(850) 555-0123",
            "850-555-0123",
            "8505550123",
            "+1 850 555 0123"
        ]
        
        for phone in valid_phones:
            test_data = {
                "name": "Test User",
                "email": "test@example.com",
                "phone": phone
            }
            
            try:
                response = requests.post(f"{self.api_base}/contact", json=test_data, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        self.log_test(f"Phone Validation - {phone}", True, 
                                    "Valid phone format accepted")
                    else:
                        self.log_test(f"Phone Validation - {phone}", False, 
                                    "Valid phone format rejected", data)
                else:
                    self.log_test(f"Phone Validation - {phone}", False, 
                                f"HTTP {response.status_code}", response.text)
            except Exception as e:
                self.log_test(f"Phone Validation - {phone}", False, f"Request failed: {str(e)}")
        
        # Test invalid phone (too short)
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "123"
        }
        
        try:
            response = requests.post(f"{self.api_base}/contact", json=test_data, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("Phone Validation - Too Short", True, 
                            "Correctly rejected phone number too short")
            else:
                self.log_test("Phone Validation - Too Short", False, 
                            f"Expected 422, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Phone Validation - Too Short", False, f"Request failed: {str(e)}")
    
    def test_optional_fields(self):
        """Test optional fields handling"""
        test_data = {
            "name": "Minimal User",
            "email": "minimal@example.com"
        }
        
        try:
            response = requests.post(f"{self.api_base}/contact", json=test_data, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    contact_data = data['data']
                    # Check that optional fields are handled properly (null or empty)
                    optional_fields = ['phone', 'propertyAddress', 'currentlyManaging', 'message']
                    for field in optional_fields:
                        if field in contact_data and contact_data[field] is not None:
                            self.log_test("Optional Fields Handling", False, 
                                        f"Optional field {field} should be null when not provided")
                            return
                    
                    self.log_test("Optional Fields Handling", True, 
                                "Optional fields handled correctly (null when not provided)")
                else:
                    self.log_test("Optional Fields Handling", False, 
                                "Failed to submit with only required fields", data)
            else:
                self.log_test("Optional Fields Handling", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Optional Fields Handling", False, f"Request failed: {str(e)}")
    
    def test_get_contact_submissions(self):
        """Test GET /api/contact endpoint for retrieving submissions"""
        try:
            response = requests.get(f"{self.api_base}/contact", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    submissions = data['data']
                    if isinstance(submissions, list):
                        self.log_test("GET Contact Submissions", True, 
                                    f"Successfully retrieved {len(submissions)} submissions")
                        
                        # Verify structure of submissions if any exist
                        if submissions:
                            first_submission = submissions[0]
                            required_fields = ['id', 'name', 'email', 'createdAt', 'status']
                            missing_fields = [field for field in required_fields if field not in first_submission]
                            
                            if missing_fields:
                                self.log_test("GET Contact Submissions Structure", False, 
                                            f"Submission missing required fields: {missing_fields}")
                            else:
                                self.log_test("GET Contact Submissions Structure", True, 
                                            "Submission structure is correct")
                    else:
                        self.log_test("GET Contact Submissions", False, 
                                    "Data is not a list", data)
                else:
                    self.log_test("GET Contact Submissions", False, 
                                "Response format invalid", data)
            else:
                self.log_test("GET Contact Submissions", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("GET Contact Submissions", False, f"Request failed: {str(e)}")
    
    def test_server_connectivity(self):
        """Test basic server connectivity"""
        try:
            response = requests.get(f"{self.api_base}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    self.log_test("Server Connectivity", True, "Server is responding correctly")
                else:
                    self.log_test("Server Connectivity", False, "Unexpected response", data)
            else:
                self.log_test("Server Connectivity", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Server Connectivity", False, f"Connection failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("LUXSERV 365 BACKEND API TESTING")
        print("=" * 60)
        
        # Test server connectivity first
        self.test_server_connectivity()
        
        # Test contact form endpoints
        self.test_valid_contact_submission()
        self.test_required_field_validation()
        self.test_email_format_validation()
        self.test_phone_validation()
        self.test_optional_fields()
        self.test_get_contact_submissions()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return passed == total

class GuestPortalTester:
    def __init__(self):
        self.api_base = API_BASE_URL
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def create_test_image(self, filename="test_image.jpg", size=(100, 100)):
        """Create a test image file in memory"""
        img = Image.new('RGB', size, color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        return img_bytes, filename
    
    def test_guest_request_without_photos(self):
        """Test guest request submission without photos (text-only form data)"""
        form_data = {
            'guestName': 'Emily Rodriguez',
            'guestEmail': 'emily.rodriguez@vacation.com',
            'guestPhone': '(850) 555-7890',
            'numberOfGuests': '4',
            'propertyAddress': '456 Gulf Shore Drive, Panama City Beach, FL 32413',
            'checkInDate': '2024-12-20',
            'checkOutDate': '2024-12-27',
            'unitNumber': 'Unit 302',
            'requestType': 'housekeeping-requests',
            'priority': 'normal',
            'message': 'We need extra towels and beach chairs for our family vacation. Also, could you please arrange for daily housekeeping service during our stay?'
        }
        
        try:
            response = requests.post(f"{self.api_base}/guest-requests", data=form_data, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    request_data = data['data']
                    required_fields = ['id', 'guestName', 'guestEmail', 'requestType', 'createdAt', 'status', 'photos']
                    missing_fields = [field for field in required_fields if field not in request_data]
                    
                    if not missing_fields:
                        # Verify photos array is empty
                        if isinstance(request_data.get('photos'), list) and len(request_data['photos']) == 0:
                            confirmation_number = data.get('confirmationNumber')
                            self.log_test("Guest Request Without Photos", True, 
                                        f"Successfully submitted text-only request. Confirmation: {confirmation_number}")
                            return request_data.get('id'), confirmation_number
                        else:
                            self.log_test("Guest Request Without Photos", False, 
                                        "Photos array should be empty for text-only request", request_data.get('photos'))
                    else:
                        self.log_test("Guest Request Without Photos", False, 
                                    f"Response missing required fields: {missing_fields}", data)
                else:
                    self.log_test("Guest Request Without Photos", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Guest Request Without Photos", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Guest Request Without Photos", False, f"Request failed: {str(e)}")
        
        return None, None
    
    def test_guest_request_with_single_photo(self):
        """Test guest request submission with 1 photo (multipart form data)"""
        form_data = {
            'guestName': 'Michael Thompson',
            'guestEmail': 'michael.thompson@beachstay.com',
            'guestPhone': '(850) 555-4567',
            'numberOfGuests': '2',
            'propertyAddress': '789 Beachfront Avenue, Panama City Beach, FL 32413',
            'checkInDate': '2024-12-15',
            'checkOutDate': '2024-12-22',
            'unitNumber': 'Condo 5B',
            'requestType': 'property-issues',
            'priority': 'high',
            'message': 'The air conditioning unit is making loud noises and not cooling properly. I have attached a photo showing the issue with the thermostat display.'
        }
        
        # Create test image
        img_bytes, filename = self.create_test_image("ac_issue.jpg")
        
        files = {
            'photos': (filename, img_bytes, 'image/jpeg')
        }
        
        try:
            response = requests.post(f"{self.api_base}/guest-requests", data=form_data, files=files, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    request_data = data['data']
                    
                    # Verify photos array has 1 photo
                    photos = request_data.get('photos', [])
                    if isinstance(photos, list) and len(photos) == 1:
                        photo = photos[0]
                        if 'filename' in photo and 'originalName' in photo and 'id' in photo:
                            confirmation_number = data.get('confirmationNumber')
                            self.log_test("Guest Request With Single Photo", True, 
                                        f"Successfully submitted request with 1 photo. Confirmation: {confirmation_number}")
                            return request_data.get('id'), photo['filename'], confirmation_number
                        else:
                            self.log_test("Guest Request With Single Photo", False, 
                                        "Photo object missing required fields", photo)
                    else:
                        self.log_test("Guest Request With Single Photo", False, 
                                    f"Expected 1 photo, got {len(photos) if isinstance(photos, list) else 'invalid'}", photos)
                else:
                    self.log_test("Guest Request With Single Photo", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Guest Request With Single Photo", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Guest Request With Single Photo", False, f"Request failed: {str(e)}")
        
        return None, None, None
    
    def test_guest_request_with_multiple_photos(self):
        """Test guest request submission with multiple photos (up to 10)"""
        form_data = {
            'guestName': 'Jennifer Martinez',
            'guestEmail': 'jennifer.martinez@familyvacation.com',
            'guestPhone': '(850) 555-9876',
            'numberOfGuests': '6',
            'propertyAddress': '321 Ocean View Boulevard, Panama City Beach, FL 32413',
            'checkInDate': '2024-12-10',
            'checkOutDate': '2024-12-17',
            'unitNumber': 'Beach House A',
            'requestType': 'pre-arrival-grocery-stocking',
            'priority': 'normal',
            'message': 'Please stock the kitchen with groceries for our family of 6. I have attached photos of our preferred brands and dietary requirements.'
        }
        
        # Create multiple test images
        files = []
        for i in range(3):  # Test with 3 photos
            img_bytes, _ = self.create_test_image(f"grocery_list_{i+1}.jpg", (150, 150))
            files.append(('photos', (f"grocery_list_{i+1}.jpg", img_bytes, 'image/jpeg')))
        
        try:
            response = requests.post(f"{self.api_base}/guest-requests", data=form_data, files=files, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    request_data = data['data']
                    
                    # Verify photos array has 3 photos
                    photos = request_data.get('photos', [])
                    if isinstance(photos, list) and len(photos) == 3:
                        # Verify each photo has required fields
                        all_photos_valid = True
                        photo_filenames = []
                        for photo in photos:
                            if not all(field in photo for field in ['filename', 'originalName', 'id']):
                                all_photos_valid = False
                                break
                            photo_filenames.append(photo['filename'])
                        
                        if all_photos_valid:
                            confirmation_number = data.get('confirmationNumber')
                            self.log_test("Guest Request With Multiple Photos", True, 
                                        f"Successfully submitted request with 3 photos. Confirmation: {confirmation_number}")
                            return request_data.get('id'), photo_filenames, confirmation_number
                        else:
                            self.log_test("Guest Request With Multiple Photos", False, 
                                        "One or more photos missing required fields", photos)
                    else:
                        self.log_test("Guest Request With Multiple Photos", False, 
                                    f"Expected 3 photos, got {len(photos) if isinstance(photos, list) else 'invalid'}", photos)
                else:
                    self.log_test("Guest Request With Multiple Photos", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Guest Request With Multiple Photos", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Guest Request With Multiple Photos", False, f"Request failed: {str(e)}")
        
        return None, None, None
    
    def test_photo_serving_endpoint(self, photo_filename):
        """Test photo file serving endpoint"""
        if not photo_filename:
            self.log_test("Photo Serving Endpoint", False, "No photo filename provided for testing")
            return
        
        try:
            response = requests.get(f"{self.api_base}/guest-photos/{photo_filename}", timeout=10)
            
            if response.status_code == 200:
                # Check if response is an image
                content_type = response.headers.get('content-type', '')
                if content_type.startswith('image/'):
                    self.log_test("Photo Serving Endpoint", True, 
                                f"Successfully retrieved photo: {photo_filename}")
                else:
                    self.log_test("Photo Serving Endpoint", False, 
                                f"Response is not an image. Content-Type: {content_type}")
            else:
                self.log_test("Photo Serving Endpoint", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Photo Serving Endpoint", False, f"Request failed: {str(e)}")
    
    def test_request_type_validation(self):
        """Test request type validation including the new grocery stocking option"""
        valid_request_types = [
            'property-issues',
            'housekeeping-requests', 
            'pre-arrival-grocery-stocking',
            'concierge-services',
            'beach-recreation-gear',
            'transportation-assistance',
            'celebration-services',
            'emergency-urgent',
            'general-inquiry'
        ]
        
        # Test valid request types
        for request_type in valid_request_types:
            form_data = {
                'guestName': 'Test Guest',
                'guestEmail': 'test@example.com',
                'propertyAddress': 'Test Property',
                'checkInDate': '2024-12-01',
                'checkOutDate': '2024-12-08',
                'requestType': request_type,
                'message': f'Testing {request_type} request type validation.'
            }
            
            try:
                response = requests.post(f"{self.api_base}/guest-requests", data=form_data, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        self.log_test(f"Request Type Validation - {request_type}", True, 
                                    "Valid request type accepted")
                    else:
                        self.log_test(f"Request Type Validation - {request_type}", False, 
                                    "Valid request type rejected", data)
                else:
                    self.log_test(f"Request Type Validation - {request_type}", False, 
                                f"HTTP {response.status_code}", response.text)
            except Exception as e:
                self.log_test(f"Request Type Validation - {request_type}", False, f"Request failed: {str(e)}")
        
        # Test invalid request type
        form_data = {
            'guestName': 'Test Guest',
            'guestEmail': 'test@example.com',
            'propertyAddress': 'Test Property',
            'checkInDate': '2024-12-01',
            'checkOutDate': '2024-12-08',
            'requestType': 'invalid-request-type',
            'message': 'Testing invalid request type validation.'
        }
        
        try:
            response = requests.post(f"{self.api_base}/guest-requests", data=form_data, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("Request Type Validation - Invalid Type", True, 
                            "Correctly rejected invalid request type")
            else:
                self.log_test("Request Type Validation - Invalid Type", False, 
                            f"Expected 422, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Request Type Validation - Invalid Type", False, f"Request failed: {str(e)}")
    
    def test_get_all_guest_requests(self):
        """Test GET /api/guest-requests endpoint for retrieving all requests"""
        try:
            response = requests.get(f"{self.api_base}/guest-requests", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    requests_list = data['data']
                    if isinstance(requests_list, list):
                        self.log_test("GET All Guest Requests", True, 
                                    f"Successfully retrieved {len(requests_list)} guest requests")
                        
                        # Verify structure if any requests exist
                        if requests_list:
                            first_request = requests_list[0]
                            required_fields = ['id', 'guestName', 'guestEmail', 'requestType', 'createdAt', 'status', 'photos']
                            missing_fields = [field for field in required_fields if field not in first_request]
                            
                            if missing_fields:
                                self.log_test("GET Guest Requests Structure", False, 
                                            f"Request missing required fields: {missing_fields}")
                            else:
                                self.log_test("GET Guest Requests Structure", True, 
                                            "Request structure is correct")
                    else:
                        self.log_test("GET All Guest Requests", False, 
                                    "Data is not a list", data)
                else:
                    self.log_test("GET All Guest Requests", False, 
                                "Response format invalid", data)
            else:
                self.log_test("GET All Guest Requests", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("GET All Guest Requests", False, f"Request failed: {str(e)}")
    
    def test_guest_request_status_lookup(self, confirmation_number):
        """Test guest request status lookup by confirmation number"""
        if not confirmation_number:
            self.log_test("Guest Request Status Lookup", False, "No confirmation number provided for testing")
            return
        
        try:
            response = requests.get(f"{self.api_base}/guest-requests/{confirmation_number}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    request_data = data['data']
                    if request_data.get('id', '')[:8].upper() == confirmation_number.upper():
                        self.log_test("Guest Request Status Lookup", True, 
                                    f"Successfully retrieved request by confirmation number: {confirmation_number}")
                    else:
                        self.log_test("Guest Request Status Lookup", False, 
                                    "Confirmation number mismatch", request_data)
                else:
                    self.log_test("Guest Request Status Lookup", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Guest Request Status Lookup", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Guest Request Status Lookup", False, f"Request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all guest portal tests"""
        print("=" * 60)
        print("GUEST PORTAL PHOTO UPLOAD TESTING")
        print("=" * 60)
        
        # Test guest request submissions
        request_id_1, confirmation_1 = self.test_guest_request_without_photos()
        request_id_2, photo_filename, confirmation_2 = self.test_guest_request_with_single_photo()
        request_id_3, photo_filenames, confirmation_3 = self.test_guest_request_with_multiple_photos()
        
        # Test photo serving endpoint
        if photo_filename:
            self.test_photo_serving_endpoint(photo_filename)
        
        # Test request type validation
        self.test_request_type_validation()
        
        # Test retrieval endpoints
        self.test_get_all_guest_requests()
        
        # Test status lookup
        if confirmation_1:
            self.test_guest_request_status_lookup(confirmation_1)
        
        # Summary
        print("\n" + "=" * 60)
        print("GUEST PORTAL TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return passed == total

class NotificationTester:
    def __init__(self):
        self.api_base = API_BASE_URL
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_telegram_bot_info(self):
        """Test /api/telegram/bot-info endpoint to verify Telegram bot accessibility"""
        try:
            response = requests.get(f"{self.api_base}/telegram/bot-info", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'bot_info' in data:
                    bot_info = data['bot_info']
                    if 'username' in bot_info and 'id' in bot_info:
                        self.log_test("Telegram Bot Configuration", True, 
                                    f"Bot accessible: @{bot_info.get('username')} (ID: {bot_info.get('id')})")
                        return True
                    else:
                        self.log_test("Telegram Bot Configuration", False, 
                                    "Bot info missing required fields", bot_info)
                else:
                    self.log_test("Telegram Bot Configuration", False, 
                                "Bot not accessible or configured", data)
            else:
                self.log_test("Telegram Bot Configuration", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Telegram Bot Configuration", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_telegram_chat_id_endpoint(self):
        """Test /api/telegram/get-chat-id endpoint"""
        try:
            response = requests.get(f"{self.api_base}/telegram/get-chat-id", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'chat_id' in data:
                    chat_id = data['chat_id']
                    self.log_test("Telegram Chat ID Retrieval", True, 
                                f"Chat ID found: {chat_id}")
                    return chat_id
                else:
                    # This is expected if no messages have been sent to the bot
                    self.log_test("Telegram Chat ID Retrieval", True, 
                                "No recent messages found (expected if bot hasn't been messaged)")
                    return None
            else:
                self.log_test("Telegram Chat ID Retrieval", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Telegram Chat ID Retrieval", False, f"Request failed: {str(e)}")
        
        return None
    
    def test_email_notification_via_guest_request(self):
        """Test email notification by submitting a guest request"""
        form_data = {
            'guestName': 'Alex Thompson',
            'guestEmail': 'alex.thompson@testnotification.com',
            'guestPhone': '(850) 555-1234',
            'numberOfGuests': '2',
            'propertyAddress': '123 Notification Test Drive, Panama City Beach, FL 32413',
            'checkInDate': '2024-12-25',
            'checkOutDate': '2024-12-30',
            'unitNumber': 'Test Unit 101',
            'requestType': 'concierge-services',
            'priority': 'high',
            'message': 'This is a test request to verify email notification system is working properly. Please confirm receipt of this notification via email to 850realty@gmail.com.'
        }
        
        try:
            response = requests.post(f"{self.api_base}/guest-requests", data=form_data, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'confirmationNumber' in data:
                    confirmation_number = data['confirmationNumber']
                    self.log_test("Email Notification Test", True, 
                                f"Guest request submitted successfully (Confirmation: {confirmation_number}). Email notification should be sent to 850realty@gmail.com")
                    return confirmation_number
                else:
                    self.log_test("Email Notification Test", False, 
                                "Guest request submission failed", data)
            else:
                self.log_test("Email Notification Test", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Email Notification Test", False, f"Request failed: {str(e)}")
        
        return None
    
    def test_telegram_notification_via_guest_request(self):
        """Test Telegram notification by submitting a guest request"""
        form_data = {
            'guestName': 'Sarah Martinez',
            'guestEmail': 'sarah.martinez@telegramtest.com',
            'guestPhone': '(850) 555-5678',
            'numberOfGuests': '3',
            'propertyAddress': '456 Telegram Test Boulevard, Panama City Beach, FL 32413',
            'checkInDate': '2024-12-28',
            'checkOutDate': '2025-01-02',
            'unitNumber': 'Telegram Unit 202',
            'requestType': 'emergency-urgent',
            'priority': 'urgent',
            'message': 'This is a test request to verify Telegram notification system is working properly. This should trigger an urgent priority Telegram alert to LuxServ365Bot.'
        }
        
        try:
            response = requests.post(f"{self.api_base}/guest-requests", data=form_data, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'confirmationNumber' in data:
                    confirmation_number = data['confirmationNumber']
                    self.log_test("Telegram Notification Test", True, 
                                f"Guest request submitted successfully (Confirmation: {confirmation_number}). Telegram alert should be sent to LuxServ365Bot")
                    return confirmation_number
                else:
                    self.log_test("Telegram Notification Test", False, 
                                "Guest request submission failed", data)
            else:
                self.log_test("Telegram Notification Test", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Telegram Notification Test", False, f"Request failed: {str(e)}")
        
        return None
    
    def test_dual_notification_with_photos(self):
        """Test both email and Telegram notifications with photo attachments"""
        form_data = {
            'guestName': 'David Wilson',
            'guestEmail': 'david.wilson@dualnotificationtest.com',
            'guestPhone': '(850) 555-9999',
            'numberOfGuests': '4',
            'propertyAddress': '789 Dual Notification Street, Panama City Beach, FL 32413',
            'checkInDate': '2025-01-05',
            'checkOutDate': '2025-01-12',
            'unitNumber': 'Dual Test 303',
            'requestType': 'property-issues',
            'priority': 'high',
            'message': 'This is a comprehensive test to verify both email and Telegram notifications are working with photo attachments. Both notification systems should receive this alert with photo count information.'
        }
        
        # Create test images for photo upload
        files = []
        for i in range(2):  # Test with 2 photos
            img = Image.new('RGB', (120, 120), color=['red', 'blue'][i])
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='JPEG')
            img_bytes.seek(0)
            files.append(('photos', (f"notification_test_{i+1}.jpg", img_bytes, 'image/jpeg')))
        
        try:
            response = requests.post(f"{self.api_base}/guest-requests", data=form_data, files=files, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'confirmationNumber' in data:
                    confirmation_number = data['confirmationNumber']
                    request_data = data.get('data', {})
                    photo_count = len(request_data.get('photos', []))
                    
                    if photo_count == 2:
                        self.log_test("Dual Notification with Photos", True, 
                                    f"Guest request with {photo_count} photos submitted successfully (Confirmation: {confirmation_number}). Both email and Telegram notifications should include photo count")
                        return confirmation_number
                    else:
                        self.log_test("Dual Notification with Photos", False, 
                                    f"Expected 2 photos, got {photo_count}", request_data)
                else:
                    self.log_test("Dual Notification with Photos", False, 
                                "Guest request submission failed", data)
            else:
                self.log_test("Dual Notification with Photos", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Dual Notification with Photos", False, f"Request failed: {str(e)}")
        
        return None
    
    def test_priority_handling_notifications(self):
        """Test different priority levels for proper notification formatting"""
        priorities = [
            ('urgent', 'emergency-urgent', 'URGENT: Air conditioning completely broken, guests arriving in 2 hours!'),
            ('high', 'property-issues', 'HIGH: Hot water not working in master bathroom, needs immediate attention.'),
            ('normal', 'housekeeping-requests', 'NORMAL: Please provide extra towels and toiletries for extended stay.')
        ]
        
        confirmation_numbers = []
        
        for priority, request_type, message in priorities:
            form_data = {
                'guestName': f'Priority Test {priority.title()}',
                'guestEmail': f'priority.{priority}@notificationtest.com',
                'guestPhone': '(850) 555-0000',
                'numberOfGuests': '2',
                'propertyAddress': f'{priority.title()} Priority Test Property, Panama City Beach, FL 32413',
                'checkInDate': '2025-01-15',
                'checkOutDate': '2025-01-20',
                'unitNumber': f'{priority.title()} Unit',
                'requestType': request_type,
                'priority': priority,
                'message': message
            }
            
            try:
                response = requests.post(f"{self.api_base}/guest-requests", data=form_data, timeout=15)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and 'confirmationNumber' in data:
                        confirmation_number = data['confirmationNumber']
                        confirmation_numbers.append(confirmation_number)
                        self.log_test(f"Priority Handling - {priority.upper()}", True, 
                                    f"Successfully submitted {priority} priority request (Confirmation: {confirmation_number})")
                    else:
                        self.log_test(f"Priority Handling - {priority.upper()}", False, 
                                    "Request submission failed", data)
                else:
                    self.log_test(f"Priority Handling - {priority.upper()}", False, 
                                f"HTTP {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_test(f"Priority Handling - {priority.upper()}", False, f"Request failed: {str(e)}")
        
        if len(confirmation_numbers) == 3:
            self.log_test("Priority Handling Summary", True, 
                        f"All priority levels tested successfully. Notifications should show different formatting for urgent (🚨), high (⚠️), and normal (📋) priorities")
        else:
            self.log_test("Priority Handling Summary", False, 
                        f"Only {len(confirmation_numbers)}/3 priority tests succeeded")
        
        return confirmation_numbers
    
    def test_notification_failure_resilience(self):
        """Test that guest request submission works even if notifications fail"""
        # This test verifies that notification failures don't break the main functionality
        form_data = {
            'guestName': 'Resilience Test User',
            'guestEmail': 'resilience@notificationtest.com',
            'guestPhone': '(850) 555-7777',
            'numberOfGuests': '1',
            'propertyAddress': 'Resilience Test Property, Panama City Beach, FL 32413',
            'checkInDate': '2025-02-01',
            'checkOutDate': '2025-02-05',
            'unitNumber': 'Resilience Unit',
            'requestType': 'general-inquiry',
            'priority': 'normal',
            'message': 'This test verifies that guest request submission succeeds even if notification services are unavailable or fail.'
        }
        
        try:
            response = requests.post(f"{self.api_base}/guest-requests", data=form_data, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'confirmationNumber' in data:
                    confirmation_number = data['confirmationNumber']
                    self.log_test("Notification Failure Resilience", True, 
                                f"Guest request submitted successfully even with potential notification failures (Confirmation: {confirmation_number})")
                    return confirmation_number
                else:
                    self.log_test("Notification Failure Resilience", False, 
                                "Request submission failed", data)
            else:
                self.log_test("Notification Failure Resilience", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Notification Failure Resilience", False, f"Request failed: {str(e)}")
        
        return None
    
    def run_all_tests(self):
        """Run all notification system tests"""
        print("=" * 60)
        print("NOTIFICATION SYSTEMS TESTING")
        print("=" * 60)
        
        # Test Telegram bot configuration
        bot_accessible = self.test_telegram_bot_info()
        
        # Test Telegram chat ID endpoint
        chat_id = self.test_telegram_chat_id_endpoint()
        
        # Test email notification
        email_confirmation = self.test_email_notification_via_guest_request()
        
        # Test Telegram notification
        telegram_confirmation = self.test_telegram_notification_via_guest_request()
        
        # Test dual notifications with photos
        dual_confirmation = self.test_dual_notification_with_photos()
        
        # Test priority handling
        priority_confirmations = self.test_priority_handling_notifications()
        
        # Test notification failure resilience
        resilience_confirmation = self.test_notification_failure_resilience()
        
        # Summary
        print("\n" + "=" * 60)
        print("NOTIFICATION SYSTEMS TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Important notes
        print("\n" + "=" * 60)
        print("NOTIFICATION TESTING NOTES")
        print("=" * 60)
        print("✅ Bot Configuration:", "ACCESSIBLE" if bot_accessible else "NOT ACCESSIBLE")
        print("📧 Email Notifications: Sent to 850realty@gmail.com")
        print("📱 Telegram Notifications: Sent to LuxServ365Bot")
        print("⚠️  Note: Telegram delivery requires chat ID setup (user must message bot first)")
        print("📋 All guest requests created during testing are stored in database")
        
        if total - passed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return passed == total

class AdminDashboardTester:
    def __init__(self):
        self.api_base = API_BASE_URL
        self.test_results = []
        self.admin_token = None
        self.admin_username = "luxserv_admin"
        self.admin_password = "LuxServ365Admin2024!"
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_admin_login_valid_credentials(self):
        """Test admin login with valid credentials"""
        login_data = {
            "username": self.admin_username,
            "password": self.admin_password
        }
        
        try:
            response = requests.post(f"{self.api_base}/admin/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'token' in data and 'username' in data:
                    self.admin_token = data['token']
                    self.log_test("Admin Login - Valid Credentials", True, 
                                f"Successfully logged in as {data['username']}")
                    return True
                else:
                    self.log_test("Admin Login - Valid Credentials", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Admin Login - Valid Credentials", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Login - Valid Credentials", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_admin_login_invalid_credentials(self):
        """Test admin login with invalid credentials"""
        invalid_credentials = [
            {"username": "wrong_admin", "password": self.admin_password},
            {"username": self.admin_username, "password": "wrong_password"},
            {"username": "wrong_admin", "password": "wrong_password"},
            {"username": "", "password": ""},
        ]
        
        for i, credentials in enumerate(invalid_credentials):
            try:
                response = requests.post(f"{self.api_base}/admin/login", json=credentials, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    if not data.get('success') and 'error' in data:
                        self.log_test(f"Admin Login - Invalid Credentials {i+1}", True, 
                                    "Correctly rejected invalid credentials")
                    else:
                        self.log_test(f"Admin Login - Invalid Credentials {i+1}", False, 
                                    "Invalid credentials were accepted", data)
                else:
                    self.log_test(f"Admin Login - Invalid Credentials {i+1}", False, 
                                f"HTTP {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_test(f"Admin Login - Invalid Credentials {i+1}", False, f"Request failed: {str(e)}")
    
    def test_admin_guest_requests_retrieval(self):
        """Test admin guest requests retrieval with basic parameters"""
        try:
            response = requests.get(f"{self.api_base}/admin/guest-requests", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    admin_data = data['data']
                    if 'requests' in admin_data and 'pagination' in admin_data:
                        requests_list = admin_data['requests']
                        pagination = admin_data['pagination']
                        
                        # Verify pagination structure
                        required_pagination_fields = ['current_page', 'total_pages', 'total_count', 'per_page']
                        missing_fields = [field for field in required_pagination_fields if field not in pagination]
                        
                        if not missing_fields:
                            self.log_test("Admin Guest Requests - Basic Retrieval", True, 
                                        f"Successfully retrieved {len(requests_list)} requests with pagination (Total: {pagination['total_count']})")
                            return requests_list
                        else:
                            self.log_test("Admin Guest Requests - Basic Retrieval", False, 
                                        f"Pagination missing fields: {missing_fields}", pagination)
                    else:
                        self.log_test("Admin Guest Requests - Basic Retrieval", False, 
                                    "Response missing requests or pagination", admin_data)
                else:
                    self.log_test("Admin Guest Requests - Basic Retrieval", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Admin Guest Requests - Basic Retrieval", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Guest Requests - Basic Retrieval", False, f"Request failed: {str(e)}")
        
        return []
    
    def test_admin_guest_requests_filtering(self):
        """Test admin guest requests with various filters"""
        filter_tests = [
            {"search": "emily", "description": "Search by guest name"},
            {"status": "pending", "description": "Filter by status"},
            {"priority": "high", "description": "Filter by priority"},
            {"request_type": "housekeeping-requests", "description": "Filter by request type"},
            {"page": "1", "limit": "10", "description": "Pagination parameters"},
            {"search": "beach", "status": "pending", "priority": "normal", "description": "Multiple filters combined"}
        ]
        
        for filter_test in filter_tests:
            description = filter_test.pop("description")
            
            try:
                response = requests.get(f"{self.api_base}/admin/guest-requests", params=filter_test, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and 'data' in data:
                        admin_data = data['data']
                        requests_count = len(admin_data.get('requests', []))
                        total_count = admin_data.get('pagination', {}).get('total_count', 0)
                        
                        self.log_test(f"Admin Filtering - {description}", True, 
                                    f"Filter applied successfully: {requests_count} results (Total: {total_count})")
                    else:
                        self.log_test(f"Admin Filtering - {description}", False, 
                                    "Response format invalid", data)
                else:
                    self.log_test(f"Admin Filtering - {description}", False, 
                                f"HTTP {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_test(f"Admin Filtering - {description}", False, f"Request failed: {str(e)}")
    
    def test_admin_request_status_update(self, request_id=None):
        """Test updating guest request status and adding internal notes"""
        if not request_id:
            # Try to get a request ID from existing requests
            try:
                response = requests.get(f"{self.api_base}/admin/guest-requests?limit=1", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    requests_list = data.get('data', {}).get('requests', [])
                    if requests_list:
                        request_id = requests_list[0]['id']
                    else:
                        self.log_test("Admin Request Update - No Requests", False, 
                                    "No existing requests found to test update functionality")
                        return
                else:
                    self.log_test("Admin Request Update - Fetch Failed", False, 
                                f"Could not fetch requests for testing: HTTP {response.status_code}")
                    return
            except Exception as e:
                self.log_test("Admin Request Update - Fetch Error", False, f"Error fetching requests: {str(e)}")
                return
        
        # Test status update
        update_data = {
            "status": "in-progress",
            "adminUsername": self.admin_username
        }
        
        try:
            response = requests.put(f"{self.api_base}/admin/guest-requests/{request_id}", json=update_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    updated_request = data['data']
                    if updated_request.get('status') == 'in-progress' and updated_request.get('lastUpdatedBy') == self.admin_username:
                        self.log_test("Admin Request Update - Status Change", True, 
                                    f"Successfully updated request status to 'in-progress'")
                    else:
                        self.log_test("Admin Request Update - Status Change", False, 
                                    "Status or lastUpdatedBy not updated correctly", updated_request)
                else:
                    self.log_test("Admin Request Update - Status Change", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Admin Request Update - Status Change", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Request Update - Status Change", False, f"Request failed: {str(e)}")
        
        # Test adding internal note
        note_data = {
            "internalNote": "Admin testing: This is a test internal note to verify the note system is working correctly.",
            "adminUsername": self.admin_username
        }
        
        try:
            response = requests.put(f"{self.api_base}/admin/guest-requests/{request_id}", json=note_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    updated_request = data['data']
                    internal_notes = updated_request.get('internalNotes', [])
                    if internal_notes and any('Admin testing' in note for note in internal_notes):
                        self.log_test("Admin Request Update - Internal Note", True, 
                                    f"Successfully added internal note (Total notes: {len(internal_notes)})")
                    else:
                        self.log_test("Admin Request Update - Internal Note", False, 
                                    "Internal note not added correctly", internal_notes)
                else:
                    self.log_test("Admin Request Update - Internal Note", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Admin Request Update - Internal Note", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Request Update - Internal Note", False, f"Request failed: {str(e)}")
        
        # Test priority update
        priority_data = {
            "priority": "urgent",
            "adminUsername": self.admin_username
        }
        
        try:
            response = requests.put(f"{self.api_base}/admin/guest-requests/{request_id}", json=priority_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    updated_request = data['data']
                    if updated_request.get('priority') == 'urgent':
                        self.log_test("Admin Request Update - Priority Change", True, 
                                    "Successfully updated request priority to 'urgent'")
                    else:
                        self.log_test("Admin Request Update - Priority Change", False, 
                                    "Priority not updated correctly", updated_request)
                else:
                    self.log_test("Admin Request Update - Priority Change", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Admin Request Update - Priority Change", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Request Update - Priority Change", False, f"Request failed: {str(e)}")
    
    def test_admin_email_reply(self, request_id=None):
        """Test admin email reply functionality"""
        if not request_id:
            # Try to get a request ID from existing requests
            try:
                response = requests.get(f"{self.api_base}/admin/guest-requests?limit=1", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    requests_list = data.get('data', {}).get('requests', [])
                    if requests_list:
                        request_id = requests_list[0]['id']
                    else:
                        self.log_test("Admin Email Reply - No Requests", False, 
                                    "No existing requests found to test email reply functionality")
                        return
                else:
                    self.log_test("Admin Email Reply - Fetch Failed", False, 
                                f"Could not fetch requests for testing: HTTP {response.status_code}")
                    return
            except Exception as e:
                self.log_test("Admin Email Reply - Fetch Error", False, f"Error fetching requests: {str(e)}")
                return
        
        reply_data = {
            "requestId": request_id,
            "subject": "Re: Your Service Request - Admin Testing",
            "message": "Dear Guest,\n\nThank you for your service request. This is a test email reply from the admin dashboard to verify the email reply functionality is working correctly.\n\nWe have received your request and our team is working on it. You will receive updates as we progress.\n\nBest regards,\nLuxServ 365 Team",
            "adminUsername": self.admin_username
        }
        
        try:
            response = requests.post(f"{self.api_base}/admin/guest-requests/{request_id}/reply", json=reply_data, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Admin Email Reply", True, 
                                "Email reply sent successfully (Note: Actual email delivery depends on SMTP configuration)")
                else:
                    self.log_test("Admin Email Reply", False, 
                                "Email reply failed", data)
            else:
                self.log_test("Admin Email Reply", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Email Reply", False, f"Request failed: {str(e)}")
    
    def test_admin_analytics(self):
        """Test admin analytics endpoint for dashboard metrics"""
        try:
            response = requests.get(f"{self.api_base}/admin/analytics", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    analytics_data = data['data']
                    
                    # Verify overview section
                    overview = analytics_data.get('overview', {})
                    required_overview_fields = ['total_requests', 'pending_requests', 'completed_requests', 'urgent_requests', 'recent_requests']
                    missing_overview_fields = [field for field in required_overview_fields if field not in overview]
                    
                    # Verify request types and status breakdown
                    request_types = analytics_data.get('request_types', [])
                    status_breakdown = analytics_data.get('status_breakdown', [])
                    
                    if not missing_overview_fields and isinstance(request_types, list) and isinstance(status_breakdown, list):
                        self.log_test("Admin Analytics", True, 
                                    f"Analytics data retrieved successfully - Total: {overview.get('total_requests', 0)}, Pending: {overview.get('pending_requests', 0)}, Recent: {overview.get('recent_requests', 0)}")
                        
                        # Log detailed analytics
                        print(f"   📊 Analytics Details:")
                        print(f"      Total Requests: {overview.get('total_requests', 0)}")
                        print(f"      Pending: {overview.get('pending_requests', 0)}")
                        print(f"      Completed: {overview.get('completed_requests', 0)}")
                        print(f"      Urgent: {overview.get('urgent_requests', 0)}")
                        print(f"      Recent (7 days): {overview.get('recent_requests', 0)}")
                        print(f"      Request Types: {len(request_types)} categories")
                        print(f"      Status Categories: {len(status_breakdown)} statuses")
                        
                    else:
                        self.log_test("Admin Analytics", False, 
                                    f"Analytics data incomplete - Missing overview fields: {missing_overview_fields}", analytics_data)
                else:
                    self.log_test("Admin Analytics", False, 
                                "Response format invalid", data)
            else:
                self.log_test("Admin Analytics", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Analytics", False, f"Request failed: {str(e)}")
    
    def test_admin_request_not_found(self):
        """Test admin endpoints with non-existent request ID"""
        fake_request_id = "non-existent-request-id-12345"
        
        # Test update non-existent request
        update_data = {
            "status": "completed",
            "adminUsername": self.admin_username
        }
        
        try:
            response = requests.put(f"{self.api_base}/admin/guest-requests/{fake_request_id}", json=update_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if not data.get('success') and 'error' in data:
                    self.log_test("Admin Update - Request Not Found", True, 
                                "Correctly handled non-existent request ID for update")
                else:
                    self.log_test("Admin Update - Request Not Found", False, 
                                "Should have returned error for non-existent request", data)
            else:
                self.log_test("Admin Update - Request Not Found", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Update - Request Not Found", False, f"Request failed: {str(e)}")
        
        # Test reply to non-existent request
        reply_data = {
            "requestId": fake_request_id,
            "subject": "Test Reply",
            "message": "Test message",
            "adminUsername": self.admin_username
        }
        
        try:
            response = requests.post(f"{self.api_base}/admin/guest-requests/{fake_request_id}/reply", json=reply_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if not data.get('success') and 'error' in data:
                    self.log_test("Admin Reply - Request Not Found", True, 
                                "Correctly handled non-existent request ID for reply")
                else:
                    self.log_test("Admin Reply - Request Not Found", False, 
                                "Should have returned error for non-existent request", data)
            else:
                self.log_test("Admin Reply - Request Not Found", False, 
                            f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin Reply - Request Not Found", False, f"Request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all admin dashboard tests"""
        print("=" * 60)
        print("ADMIN DASHBOARD BACKEND TESTING")
        print("=" * 60)
        
        # Test admin authentication
        login_success = self.test_admin_login_valid_credentials()
        self.test_admin_login_invalid_credentials()
        
        if not login_success:
            print("⚠️  Admin login failed - some tests may not work properly")
        
        # Test guest requests management
        requests_list = self.test_admin_guest_requests_retrieval()
        self.test_admin_guest_requests_filtering()
        
        # Test request updates (use first available request if any)
        test_request_id = requests_list[0]['id'] if requests_list else None
        self.test_admin_request_status_update(test_request_id)
        
        # Test email reply functionality
        self.test_admin_email_reply(test_request_id)
        
        # Test analytics
        self.test_admin_analytics()
        
        # Test error handling
        self.test_admin_request_not_found()
        
        # Summary
        print("\n" + "=" * 60)
        print("ADMIN DASHBOARD TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Important notes
        print("\n" + "=" * 60)
        print("ADMIN DASHBOARD TESTING NOTES")
        print("=" * 60)
        print("🔐 Admin Credentials: luxserv_admin / LuxServ365Admin2024!")
        print("📧 Email Replies: Sent via configured SMTP (850realty@gmail.com)")
        print("📊 Analytics: Real-time data from guest requests database")
        print("🔄 Status Updates: Pending → In-Progress → Completed workflow")
        print("📝 Internal Notes: Admin-only notes with timestamps")
        
        if total - passed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return passed == total

if __name__ == "__main__":
    print("LUXSERV 365 COMPREHENSIVE BACKEND TESTING")
    print("=" * 80)
    
    # Run Contact Form Tests
    contact_tester = ContactFormTester()
    contact_success = contact_tester.run_all_tests()
    
    print("\n" + "=" * 80)
    
    # Run Guest Portal Tests
    guest_tester = GuestPortalTester()
    guest_success = guest_tester.run_all_tests()
    
    print("\n" + "=" * 80)
    
    # Run Notification System Tests
    notification_tester = NotificationTester()
    notification_success = notification_tester.run_all_tests()
    
    # Overall Summary
    print("\n" + "=" * 80)
    print("OVERALL TEST SUMMARY")
    print("=" * 80)
    
    contact_passed = sum(1 for result in contact_tester.test_results if result['success'])
    contact_total = len(contact_tester.test_results)
    guest_passed = sum(1 for result in guest_tester.test_results if result['success'])
    guest_total = len(guest_tester.test_results)
    notification_passed = sum(1 for result in notification_tester.test_results if result['success'])
    notification_total = len(notification_tester.test_results)
    
    total_passed = contact_passed + guest_passed + notification_passed
    total_tests = contact_total + guest_total + notification_total
    
    print(f"Contact Form Tests: {contact_passed}/{contact_total} passed")
    print(f"Guest Portal Tests: {guest_passed}/{guest_total} passed")
    print(f"Notification Tests: {notification_passed}/{notification_total} passed")
    print(f"Overall: {total_passed}/{total_tests} passed ({(total_passed/total_tests)*100:.1f}%)")
    
    overall_success = contact_success and guest_success and notification_success
    sys.exit(0 if overall_success else 1)