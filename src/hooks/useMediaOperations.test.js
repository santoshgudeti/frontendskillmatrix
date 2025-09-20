import { renderHook, act } from '@testing-library/react';
import { useMediaOperations } from './useMediaOperations';

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

// Mock axiosInstance
jest.mock('../axiosUtils', () => ({
  axiosInstance: {
    get: jest.fn()
  }
}));

describe('useMediaOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useMediaOperations());
    
    expect(result.current.mediaOperations).toEqual({
      video: {},
      screen: {},
      audio: {}
    });
  });

  it('should extract file key correctly', () => {
    const { result } = renderHook(() => useMediaOperations());
    
    const filePath = 'https://example.com/path/to/file.webm?token=abc123';
    const fileKey = result.current.extractFileKey(filePath);
    
    expect(fileKey).toBe('file.webm');
  });

  it('should handle null or undefined file path', () => {
    const { result } = renderHook(() => useMediaOperations());
    
    expect(result.current.extractFileKey(null)).toBeNull();
    expect(result.current.extractFileKey(undefined)).toBeNull();
  });

  it('should update media operations state when viewing video', async () => {
    const { result } = renderHook(() => useMediaOperations());
    
    // Mock the API response
    const mockResponse = { data: { url: 'https://example.com/video.webm' } };
    require('../axiosUtils').axiosInstance.get.mockResolvedValue(mockResponse);
    
    // Call viewVideo
    await act(async () => {
      await result.current.viewVideo('video', 'https://example.com/path/to/video.webm');
    });
    
    // Check that state was updated correctly
    expect(result.current.mediaOperations.video.viewing).toBe(false); // Should be false after operation
  });

  it('should handle errors when viewing video', async () => {
    const { result } = renderHook(() => useMediaOperations());
    
    // Mock API error
    require('../axiosUtils').axiosInstance.get.mockRejectedValue(new Error('API Error'));
    
    // Call viewVideo
    await act(async () => {
      await result.current.viewVideo('video', 'https://example.com/path/to/video.webm');
    });
    
    // Check that error toast was called
    expect(require('react-toastify').toast.error).toHaveBeenCalled();
  });
});