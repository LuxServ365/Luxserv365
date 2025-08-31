// Mock utility functions for frontend-only functionality

export const mockSubmitContact = async (formData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Store in localStorage for demo purposes
  const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
  const newSubmission = {
    id: Date.now(),
    ...formData,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  
  submissions.push(newSubmission);
  localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
  
  console.log('Contact form submitted:', newSubmission);
  return newSubmission;
};

export const mockGetSubmissions = () => {
  return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
};