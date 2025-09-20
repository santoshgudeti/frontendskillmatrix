/**
 * Performance Monitoring and Optimization Utilities
 * Tracks performance metrics and provides optimization suggestions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AriaUtils } from '../../lib/accessibility';

/**
 * Performance Monitor Hook
 * Tracks component render times and performance metrics
 */
export const usePerformanceMonitor = (componentName = 'Component') => {
  const renderCount = useRef(0);
  const startTime = useRef(null);
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0,
  });

  useEffect(() => {
    startTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    if (startTime.current) {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;
      
      setMetrics(prev => {
        const newTotalTime = prev.totalRenderTime + renderTime;
        const newCount = renderCount.current;
        const newAverageTime = newTotalTime / newCount;
        
        return {
          renderCount: newCount,
          lastRenderTime: renderTime,
          averageRenderTime: newAverageTime,
          totalRenderTime: newTotalTime,
        };
      });

      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
    }
  });

  const logMetrics = useCallback(() => {
    console.log(`Performance metrics for ${componentName}:`, metrics);
  }, [componentName, metrics]);

  return { metrics, logMetrics };
};

/**
 * Debounced Function Hook
 * Optimizes frequent function calls
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Throttled Function Hook
 * Limits function execution frequency
 */
export const useThrottle = (value, delay) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

/**
 * Intersection Observer Hook
 * Optimizes rendering of elements outside viewport
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected };
};

/**
 * Image Loading Optimization Hook
 * Lazy loads images with performance optimizations
 */
export const useLazyImage = (src, placeholder = null) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { targetRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && src && !isLoaded && !isError) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        setIsError(true);
      };
      
      img.src = src;
    }
  }, [isIntersecting, src, isLoaded, isError]);

  return {
    targetRef,
    imageSrc,
    isLoaded,
    isError,
    isIntersecting,
  };
};

/**
 * Memory Usage Monitor Hook
 * Tracks component memory usage (when available)
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo({
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMemoryUsagePercentage = useCallback(() => {
    if (!memoryInfo) return null;
    return (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
  }, [memoryInfo]);

  return { memoryInfo, getMemoryUsagePercentage };
};

/**
 * Network Status Hook
 * Monitors network connection and adapts behavior
 */
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState({
    online: navigator.onLine,
    connectionType: null,
    effectiveType: null,
    downlink: null,
    rtt: null,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      setNetworkStatus({
        online: navigator.onLine,
        connectionType: connection?.type || null,
        effectiveType: connection?.effectiveType || null,
        downlink: connection?.downlink || null,
        rtt: connection?.rtt || null,
      });
    };

    const handleOnline = () => {
      updateNetworkStatus();
      AriaUtils.announce('Connection restored', 'polite');
    };

    const handleOffline = () => {
      updateNetworkStatus();
      AriaUtils.announce('Connection lost. Working offline.', 'assertive');
    };

    updateNetworkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isSlowConnection = useCallback(() => {
    return networkStatus.effectiveType === 'slow-2g' || networkStatus.effectiveType === '2g';
  }, [networkStatus.effectiveType]);

  return {
    ...networkStatus,
    isSlowConnection,
  };
};

/**
 * Bundle Size Reporter
 * Reports on bundle sizes in development
 */
export const useBundleAnalytics = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const reportBundleSize = () => {
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        let totalSize = 0;
        
        scripts.forEach(script => {
          if (script.src.includes('chunk') || script.src.includes('bundle')) {
            // This is a rough estimation - in a real app you'd want more precise measurements
            totalSize += script.src.length * 8; // Rough estimate
          }
        });
        
        console.log(`Estimated bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
      };

      reportBundleSize();
    }
  }, []);
};

/**
 * Web Vitals Tracking Hook
 * Measures Core Web Vitals
 */
export const useWebVitals = () => {
  const [vitals, setVitals] = useState({
    fcp: null,   // First Contentful Paint
    lcp: null,   // Largest Contentful Paint
    fid: null,   // First Input Delay
    cls: null,   // Cumulative Layout Shift
    ttfb: null,  // Time to First Byte
  });

  useEffect(() => {
    const measureVitals = () => {
      // Measure FCP
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            setVitals(prev => ({ ...prev, fcp: entry.startTime }));
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Measure LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setVitals(prev => ({ ...prev, lcp: lastEntry.startTime }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          setVitals(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Measure CLS
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        setVitals(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    };

    const cleanup = measureVitals();
    return cleanup;
  }, []);

  const getVitalsScore = useCallback(() => {
    const scores = {
      fcp: vitals.fcp < 1800 ? 'good' : vitals.fcp < 3000 ? 'needs-improvement' : 'poor',
      lcp: vitals.lcp < 2500 ? 'good' : vitals.lcp < 4000 ? 'needs-improvement' : 'poor',
      fid: vitals.fid < 100 ? 'good' : vitals.fid < 300 ? 'needs-improvement' : 'poor',
      cls: vitals.cls < 0.1 ? 'good' : vitals.cls < 0.25 ? 'needs-improvement' : 'poor',
    };
    return scores;
  }, [vitals]);

  return { vitals, getVitalsScore };
};

export default {
  usePerformanceMonitor,
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useLazyImage,
  useMemoryMonitor,
  useNetworkStatus,
  useBundleAnalytics,
  useWebVitals,
};