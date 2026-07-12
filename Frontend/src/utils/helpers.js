/**
 * Utility / helper functions.
 */

/**
 * Format a date string to a human-readable format.
 * @param {string|Date} date - The date to format.
 * @param {object} options - Intl.DateTimeFormat options.
 * @returns {string} Formatted date string.
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
};

/**
 * Truncate a string to a specified length with an ellipsis.
 * @param {string} str - The string to truncate.
 * @param {number} maxLength - Maximum length before truncation.
 * @returns {string} Truncated string.
 */
export const truncateText = (str, maxLength = 100) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
};

/**
 * Capitalize the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} Capitalized string.
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generate a random ID string.
 * @returns {string} Random ID.
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * Debounce a function call.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Function} Debounced function.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Safely parse JSON with a fallback value.
 * @param {string} jsonString - The JSON string to parse.
 * @param {*} fallback - Fallback value on parse error.
 * @returns {*} Parsed value or fallback.
 */
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};
