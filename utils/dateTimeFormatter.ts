const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Format: Wed Jan 2, 2025
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', // "Wed"
      month: 'short',   // "Jan"
      day: 'numeric',   // "2"
      year: 'numeric'   // "2025"
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const formatTime = (timeString: string) => {
  if (!timeString) return '';
  
  try {
    // If the timeString is already in the format you want
    if (timeString.toLowerCase().includes('gmt')) {
      return timeString;
    }
    
    // Assuming timeString is in a format like "HH:MM" or "HH:MM:SS"
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Convert to 12-hour format with am/pm
    const period = hours >= 12 ? 'pm' : 'am';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    // Format: GMT + 4:00 pm
    return `GMT + ${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

export { formatDate, formatTime };