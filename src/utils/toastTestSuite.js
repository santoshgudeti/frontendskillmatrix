/**
 * 🧪 Toast Deduplication Test Script
 * Run this in browser console to test the toast deduplication system
 */

// Import the toast utilities (adjust path as needed)
import { debouncedToast, documentToast, toastDebug } from '../utils/toastUtils';

// Test suite for toast deduplication
export const runToastTests = () => {
  console.log('🧪 Starting Toast Deduplication Tests...');
  
  // Clear any existing toasts
  toastDebug.clearAll();
  
  // Test 1: Basic deduplication
  console.log('\n📝 Test 1: Basic Toast Deduplication');
  debouncedToast.success('Test message 1', 'test-context');
  debouncedToast.success('Test message 1', 'test-context'); // Should be blocked
  debouncedToast.success('Test message 1', 'test-context'); // Should be blocked
  
  setTimeout(() => {
    console.log('✅ Test 1 Complete - Only 1 toast should have appeared');
    console.log('Stats:', toastDebug.getStats());
  }, 1000);
  
  // Test 2: Document status updates
  setTimeout(() => {
    console.log('\n📝 Test 2: Document Status Update Deduplication');
    documentToast.verified('test-collection-1', 'John Doe');
    documentToast.verified('test-collection-1', 'John Doe'); // Should be blocked
    documentToast.verified('test-collection-1', 'John Doe'); // Should be blocked
    
    setTimeout(() => {
      console.log('✅ Test 2 Complete - Only 1 document verified toast should have appeared');
      console.log('Stats:', toastDebug.getStats());
    }, 1000);
  }, 2000);
  
  // Test 3: Different contexts should not be blocked
  setTimeout(() => {
    console.log('\n📝 Test 3: Different Contexts');
    debouncedToast.error('Same message', 'context-A');
    debouncedToast.error('Same message', 'context-B'); // Should NOT be blocked
    debouncedToast.error('Same message', 'context-C'); // Should NOT be blocked
    
    setTimeout(() => {
      console.log('✅ Test 3 Complete - 3 toasts should have appeared (different contexts)');
      console.log('Stats:', toastDebug.getStats());
    }, 1000);
  }, 4000);
  
  // Test 4: Time-based expiration
  setTimeout(() => {
    console.log('\n📝 Test 4: Time-based Expiration');
    debouncedToast.info('Expiration test', 'expire-test');
    
    // Wait for deduplication period to expire (3+ seconds)
    setTimeout(() => {
      debouncedToast.info('Expiration test', 'expire-test'); // Should NOT be blocked
      
      setTimeout(() => {
        console.log('✅ Test 4 Complete - 2 toasts should have appeared (time-based expiration)');
        console.log('Stats:', toastDebug.getStats());
        toastDebug.logRecentToasts();
      }, 1000);
    }, 3500);
  }, 6000);
  
  // Final summary
  setTimeout(() => {
    console.log('\n🎯 Toast Deduplication Tests Complete!');
    console.log('Final Stats:', toastDebug.getStats());
    console.log('If tests passed correctly, you should have seen:');
    console.log('- Test 1: 1 success toast');
    console.log('- Test 2: 1 document verified toast');
    console.log('- Test 3: 3 error toasts (different contexts)');
    console.log('- Test 4: 2 info toasts (time expiration)');
    console.log('Total expected: 7 toasts');
  }, 12000);
};

// Manual test functions for console testing
export const manualTests = {
  // Test rapid-fire duplicate toasts
  testRapidDuplicates: () => {
    console.log('🔥 Testing rapid duplicate prevention...');
    for (let i = 0; i < 10; i++) {
      debouncedToast.warning('Rapid fire test', 'rapid-test');
    }
    console.log('Only 1 toast should appear despite 10 calls');
  },
  
  // Test document verification scenario
  testDocumentVerification: () => {
    console.log('📄 Testing document verification scenario...');
    const collectionId = 'test-doc-collection-123';
    
    // Simulate multiple verification events
    documentToast.verified(collectionId, 'Jane Smith');
    documentToast.verified(collectionId, 'Jane Smith'); // Blocked
    documentToast.verified(collectionId, 'Jane Smith'); // Blocked
    
    console.log('Only 1 verification toast should appear');
  },
  
  // Test mixed toast types
  testMixedTypes: () => {
    console.log('🎨 Testing mixed toast types...');
    debouncedToast.success('Mixed test', 'mixed');
    debouncedToast.error('Mixed test', 'mixed'); // Different type, should appear
    debouncedToast.warning('Mixed test', 'mixed'); // Different type, should appear
    debouncedToast.info('Mixed test', 'mixed'); // Different type, should appear
    
    console.log('4 toasts should appear (different types)');
  },
  
  // Check current stats
  getStats: () => {
    console.log('📊 Current Toast Stats:', toastDebug.getStats());
    toastDebug.logRecentToasts();
  },
  
  // Clear all toast history
  clearAll: () => {
    toastDebug.clearAll();
    console.log('🗑️ All toast history cleared');
  }
};

// Console helper for easy testing
if (typeof window !== 'undefined') {
  window.toastTestSuite = {
    run: runToastTests,
    manual: manualTests
  };
  
  console.log('🧪 Toast Test Suite loaded!');
  console.log('Use window.toastTestSuite.run() to run all tests');
  console.log('Use window.toastTestSuite.manual for individual tests');
}

export default {
  runToastTests,
  manualTests
};