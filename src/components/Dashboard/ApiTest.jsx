import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../axiosUtils';

const ApiTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};
    
    try {
      // Test health endpoint
      try {
        const healthResponse = await axiosInstance.get('/api/health');
        results.health = { success: true, data: healthResponse.data };
      } catch (error) {
        results.health = { success: false, error: error.message };
      }
      
      // Test reports user endpoint
      try {
        const reportsResponse = await axiosInstance.get('/api/reports/user');
        results.reports = { success: true, data: reportsResponse.data };
      } catch (error) {
        results.reports = { success: false, error: error.message, status: error.response?.status };
      }
      
      // Test reports test endpoint
      try {
        const testResponse = await axiosInstance.get('/api/reports/test');
        results.test = { success: true, data: testResponse.data };
      } catch (error) {
        results.test = { success: false, error: error.message, status: error.response?.status };
      }
      
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setTestResults(results);
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <button 
        onClick={runTests}
        disabled={loading}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Tests'}
      </button>
      
      {testResults && (
        <div className="space-y-4">
          {Object.entries(testResults).map(([key, result]) => (
            <div 
              key={key} 
              className={`p-4 rounded-lg border ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <h2 className="font-semibold text-lg capitalize">{key} Test</h2>
              <p className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.success ? 'PASSED' : 'FAILED'}
              </p>
              {result.error && (
                <p className="text-red-600 mt-2">
                  Error: {result.error}
                  {result.status && ` (Status: ${result.status})`}
                </p>
              )}
              {result.data && (
                <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTest;