/**
 * Utility functions for formatting timestamps
 */

/**
 * Format an ISO timestamp to a readable time string (e.g., "10:30 AM")
 * @param isoString - ISO 8601 formatted timestamp string
 * @returns Formatted time string in 12-hour format
 */
export function formatTimestamp(isoString: string): string {
  // Handle empty or invalid timestamps
  if (!isoString || isoString.trim() === '') {
    return '';
  }

  const date = new Date(isoString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Format an ISO timestamp to a relative time string (e.g., "2 hours ago", "just now")
 * @param isoString - ISO 8601 formatted timestamp string
 * @returns Relative time string
 */
export function formatRelativeTime(isoString: string): string {
  // Handle empty or invalid timestamps
  if (!isoString || isoString.trim() === '') {
    return '';
  }

  const date = new Date(isoString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // For older messages, show the date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
