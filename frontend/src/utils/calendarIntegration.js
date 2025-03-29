// Calendar integration utilities

/**
 * Generate Google Calendar event URL
 * This creates a link that will create a Google Calendar event when opened
 * @param {Object} reminder - The reminder object
 * @param {Object} medication - The medication object
 * @returns {string} - Google Calendar event URL
 */
export const createGoogleCalendarUrl = (reminder, medication) => {
  try {
    // Format start and end dates
    const startTime = new Date(reminder.scheduledTime);
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 min duration
    
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    // Create details and title
    const title = `Medication: ${medication.name}`;
    const details = `Dosage: ${medication.dosage}
Medication: ${medication.name}
${reminder.notes ? `Notes: ${reminder.notes}` : ''}`;
    
    // Build URL parameters
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
      details: details,
      reminders: 'POPUP,10', // Reminder 10 minutes before
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (error) {
    console.error('Error creating Google Calendar URL:', error);
    return null;
  }
};

/**
 * Generate Apple Calendar event URL (ics file)
 * This creates a link that will download an ics file to import into Apple Calendar
 * @param {Object} reminder - The reminder object
 * @param {Object} medication - The medication object
 * @returns {string} - Data URL for ICS file
 */
export const createAppleCalendarUrl = (reminder, medication) => {
  try {
    // Format start and end dates
    const startTime = new Date(reminder.scheduledTime);
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 min duration
    
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1) + 'Z';
    };
    
    // Create ICS file content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startTime)}`,
      `DTEND:${formatDate(endTime)}`,
      `SUMMARY:Medication: ${medication.name}`,
      `DESCRIPTION:Dosage: ${medication.dosage}\\nMedication: ${medication.name}${reminder.notes ? `\\nNotes: ${reminder.notes}` : ''}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder',
      'TRIGGER:-PT10M', // 10 minutes before
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    // Create a downloadable data URL
    const dataUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
    return dataUrl;
  } catch (error) {
    console.error('Error creating Apple Calendar URL:', error);
    return null;
  }
};

/**
 * Add a reminder to calendar based on user's preference
 * @param {Object} reminder - The reminder object
 * @param {Object} medication - The medication object
 * @param {string} calendarType - 'google' or 'apple'
 * @returns {boolean} - Success status
 */
export const addToCalendar = (reminder, medication, calendarType = 'google') => {
  try {
    if (!reminder || !medication) {
      console.error('Invalid reminder or medication data for calendar integration');
      return false;
    }
    
    let calendarUrl;
    
    // Generate URL based on calendar type
    if (calendarType === 'google') {
      calendarUrl = createGoogleCalendarUrl(reminder, medication);
    } else if (calendarType === 'apple') {
      calendarUrl = createAppleCalendarUrl(reminder, medication);
    } else {
      console.error('Unsupported calendar type:', calendarType);
      return false;
    }
    
    // Open the calendar URL in a new tab
    if (calendarUrl) {
      window.open(calendarUrl, '_blank');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error adding to calendar:', error);
    return false;
  }
};

export default {
  addToCalendar,
  createGoogleCalendarUrl,
  createAppleCalendarUrl
}; 