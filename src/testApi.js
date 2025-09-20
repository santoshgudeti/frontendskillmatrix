// Simple API test script
import { axiosInstance } from './axiosUtils';

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await axiosInstance.get('/api/health');
    console.log('Health check:', healthResponse.data);
    
    // Test reports test endpoint (requires authentication)
    try {
      const testResponse = await axiosInstance.get('/api/reports/test');
      console.log('Reports test:', testResponse.data);
    } catch (authError) {
      console.log('Reports test failed (likely due to auth):', authError.message);
    }
    
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

// Run the test if this file is imported
if (typeof window !== 'undefined') {
  testApiConnection();
}