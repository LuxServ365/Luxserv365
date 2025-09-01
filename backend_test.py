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

if __name__ == "__main__":
    tester = ContactFormTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)