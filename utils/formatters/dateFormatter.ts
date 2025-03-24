export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const formatCurrentDate = (date: Date = new Date()): string => {
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const getCurrentDay = (date: Date = new Date()): string => {
  return days[date.getDay()];
};

export const getFormattedDateAndDay = (): { currentDate: string; currentDay: string } => {
  const now = new Date();
  return {
    currentDate: formatCurrentDate(now),
    currentDay: getCurrentDay(now)
  };
}; 