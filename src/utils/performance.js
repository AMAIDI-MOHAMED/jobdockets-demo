/**
 * Performance Optimization Utilities
 */

/**
 * Debounce function - Delays execution until after wait time
 * Useful for: search inputs, resize events, scroll events
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - Limits execution to once per wait time
 * Useful for: scroll events, window resize
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load component helper
 * Use with React.lazy for code splitting
 * 
 * @param {Function} importFunc - Dynamic import function
 * @param {number} delay - Optional delay in ms (for testing)
 * @returns {Promise} Component promise
 */
export const lazyLoad = (importFunc, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(importFunc());
    }, delay);
  });
};

/**
 * Prefetch component - Preload a route component
 * Call on hover/focus to speed up navigation
 * 
 * @param {string} route - Route path to prefetch
 */
export const prefetchRoute = (route) => {
  const routeMap = {
    '/jobs': () => import('@/pages/jobs/AllJobs'),
    '/courses': () => import('@/pages/courses/AllCourses'),
    '/blog': () => import('@/components/BlogSpace'),
    // Add more routes as needed
  };

  const loader = routeMap[route];
  if (loader) {
    loader();
  }
};

/**
 * Request Idle Callback polyfill
 * Execute low-priority tasks when browser is idle
 * 
 * @param {Function} callback - Function to execute
 */
export const requestIdleCallback = (callback) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback);
  }
  return setTimeout(callback, 1);
};

/**
 * Intersection Observer hook for lazy loading
 * 
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
  const ref = React.useRef(null);
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

/**
 * Memoize expensive calculations
 * 
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Preload image utility
 * 
 * @param {string} src - Image source URL
 * @returns {Promise} Promise that resolves when image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images
 * 
 * @param {Array<string>} urls - Array of image URLs
 * @returns {Promise} Promise that resolves when all images loaded
 */
export const preloadImages = (urls) => {
  return Promise.all(urls.map(preloadImage));
};

/**
 * Check if reduced motion is preferred
 * Use to disable animations for accessibility
 * 
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get connection speed
 * Useful for adaptive loading strategies
 * 
 * @returns {string} Connection type (slow-2g, 2g, 3g, 4g, or unknown)
 */
export const getConnectionSpeed = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return 'unknown';
  return connection.effectiveType || 'unknown';
};

/**
 * Check if connection is slow
 * 
 * @returns {boolean} True if connection is slow (2g or slower)
 */
export const isSlowConnection = () => {
  const speed = getConnectionSpeed();
  return speed === 'slow-2g' || speed === '2g';
};

/**
 * Adaptive image quality based on connection
 * 
 * @param {string} baseUrl - Base image URL
 * @returns {string} Optimized image URL
 */
export const getAdaptiveImageUrl = (baseUrl) => {
  if (isSlowConnection()) {
    // Return lower quality or smaller size
    return baseUrl.replace(/\.(jpg|jpeg|png)$/, '-low.$1');
  }
  return baseUrl;
};

/**
 * Local storage with expiry
 * 
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {number} ttl - Time to live in milliseconds
 */
export const setWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get from local storage with expiry check
 * 
 * @param {string} key - Storage key
 * @returns {*} Stored value or null if expired/not found
 */
export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};
