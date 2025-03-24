/**
 * Formats seconds to hours and minutes format (e.g., "2h 30m" or "45m")
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

/**
 * Formats tooltip values for charts
 */
export const formatTooltipValue = (value: any, label: string = 'Time'): [string, string] => {
  if (typeof value === 'number') {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return [`${hours}h ${minutes}m`, label];
  }
  return ['0h 0m', label];
};

/**
 * Formats seconds for Y-axis display
 */
export const formatYAxisTick = (value: number): string => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  return hours > 0 ? `${hours}h` : `${minutes}m`;
}; 