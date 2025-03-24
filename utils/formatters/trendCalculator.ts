/**
 * Calculate trend by comparing current and previous values
 */
export const calculateTrend = (current: number, previous: number): 'up' | 'down' | 'unchanged' => {
  if (current === previous) return "unchanged";
  return current > previous ? "up" : "down";
}; 