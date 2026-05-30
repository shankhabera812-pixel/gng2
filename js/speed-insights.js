/**
 * Vercel Speed Insights initialization
 * This file loads and configures Vercel Speed Insights for tracking web performance metrics.
 */

// Initialize the queue before the script loads
window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };

// Load the Speed Insights script
(function() {
  const script = document.createElement('script');
  script.src = '/_vercel/speed-insights/script.js';
  script.defer = true;
  document.head.appendChild(script);
})();
