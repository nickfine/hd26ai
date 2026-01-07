/**
 * Timezone Utilities
 * Handles timezone conversion for international hackathon participants
 * Base event timezone: Europe/London (UK)
 */

// ============================================================================
// CONSTANTS
// ============================================================================

export const EVENT_TIMEZONE = 'Europe/London';

// ============================================================================
// TIMEZONE DETECTION
// ============================================================================

/**
 * Get user's IANA timezone string (e.g., "America/New_York", "Europe/London")
 * @returns {string} IANA timezone identifier
 */
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get readable timezone name (e.g., "Eastern Daylight Time", "British Summer Time")
 * @param {string} timezone - IANA timezone string (defaults to user's timezone)
 * @returns {string} Readable timezone name
 */
export function getTimezoneName(timezone = null) {
  const tz = timezone || getUserTimezone();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'long',
  });
  const parts = formatter.formatToParts(new Date());
  const timeZoneName = parts.find(part => part.type === 'timeZoneName');
  return timeZoneName ? timeZoneName.value : tz;
}

/**
 * Get timezone abbreviation (e.g., "EDT", "BST", "GMT")
 * @param {string} timezone - IANA timezone string (defaults to user's timezone)
 * @returns {string} Timezone abbreviation
 */
export function getTimezoneAbbr(timezone = null) {
  const tz = timezone || getUserTimezone();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'short',
  });
  const parts = formatter.formatToParts(new Date());
  const timeZoneName = parts.find(part => part.type === 'timeZoneName');
  return timeZoneName ? timeZoneName.value : '';
}

/**
 * Get offset from UTC (e.g., "+02:00", "-05:00")
 * @param {string} timezone - IANA timezone string (defaults to user's timezone)
 * @param {Date} date - Date to check offset for (defaults to now)
 * @returns {string} UTC offset string
 */
export function getTimezoneOffset(timezone = null, date = new Date()) {
  const tz = timezone || getUserTimezone();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'longOffset',
  });
  const parts = formatter.formatToParts(date);
  const timeZoneName = parts.find(part => part.type === 'timeZoneName');
  
  if (timeZoneName) {
    // Extract offset from strings like "GMT+2" or "GMT-5"
    const match = timeZoneName.value.match(/GMT([+-]\d+)/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const sign = hours >= 0 ? '+' : '-';
      const absHours = Math.abs(hours);
      return `${sign}${String(absHours).padStart(2, '0')}:00`;
    }
  }
  
  // Fallback: calculate offset manually
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  const offsetMs = tzDate.getTime() - utcDate.getTime();
  const offsetHours = offsetMs / (1000 * 60 * 60);
  const sign = offsetHours >= 0 ? '+' : '-';
  const absHours = Math.abs(offsetHours);
  const hours = Math.floor(absHours);
  const minutes = Math.floor((absHours - hours) * 60);
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Get readable offset string (e.g., "GMT+2", "UTC-5")
 * @param {string} timezone - IANA timezone string (defaults to user's timezone)
 * @returns {string} Readable offset
 */
export function formatTimezoneOffset(timezone = null) {
  const offset = getTimezoneOffset(timezone);
  return offset.startsWith('+') ? `GMT${offset}` : `GMT${offset}`;
}

// ============================================================================
// TIME CONVERSION
// ============================================================================

/**
 * Convert a UK time (date + time string) to user's local timezone
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:MM format (UK time)
 * @param {string} targetTimezone - Target timezone (defaults to user's timezone)
 * @returns {object} Object with local time, formatted string, and timezone info
 */
export function convertUKTimeToLocal(dateStr, timeStr, targetTimezone = null) {
  const tz = targetTimezone || getUserTimezone();
  
  // Use createUKDate to get the correct UTC timestamp for the UK time
  const ukDate = createUKDate(dateStr, timeStr);
  
  // Now format this UTC date in the target timezone
  const localTimeStr = ukDate.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  const localDateStr = ukDate.toLocaleDateString('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  return {
    time: localTimeStr,
    date: localDateStr,
    dateObj: ukDate,
    timezone: tz,
    timezoneName: getTimezoneName(tz),
    timezoneAbbr: getTimezoneAbbr(tz),
    offset: getTimezoneOffset(tz, ukDate),
  };
}

/**
 * Format time in user's local timezone from UK time
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:MM format (UK time)
 * @param {object} options - Formatting options
 * @returns {string} Formatted time string
 */
export function formatTimeInUserTimezone(dateStr, timeStr, options = {}) {
  const {
    showDate = false,
    showTimezone = false,
    targetTimezone = null,
  } = options;
  
  const converted = convertUKTimeToLocal(dateStr, timeStr, targetTimezone);
  
  let result = converted.time;
  if (showDate) {
    result = `${converted.date} ${result}`;
  }
  if (showTimezone) {
    result += ` (${converted.timezoneAbbr})`;
  }
  
  return result;
}

/**
 * Create a Date object representing UK time
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:MM format (UK time)
 * @returns {Date} Date object (UTC timestamp representing the UK local time)
 */
export function createUKDate(dateStr, timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Strategy: Find the UTC timestamp that represents this UK local time
  // We'll use iterative adjustment: start with UTC date, format in UK, adjust until it matches
  
  // Start with UTC date (this will be off by UK's offset)
  let utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  
  // Format in UK timezone to see what we actually get
  const ukFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: EVENT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  // Iteratively adjust until UK formatting matches desired time
  for (let i = 0; i < 10; i++) {
    const ukParts = ukFormatter.formatToParts(utcDate);
    const ukHour = parseInt(ukParts.find(p => p.type === 'hour').value, 10);
    const ukMin = parseInt(ukParts.find(p => p.type === 'minute').value, 10);
    
    // Check if we match
    if (ukHour === hours && ukMin === minutes) {
      break;
    }
    
    // Calculate adjustment: if UK shows 10:00 but we want 09:00, we need to subtract 1 hour from UTC
    // Formula: adjustment = (desired - actual) in minutes
    // If adjustment is negative (UK ahead), we subtract from UTC
    // If adjustment is positive (UK behind), we add to UTC
    const desiredMinutes = hours * 60 + minutes;
    const actualMinutes = ukHour * 60 + ukMin;
    const adjustmentMinutes = desiredMinutes - actualMinutes;
    
    // Adjust UTC date: if UK is ahead of desired, go back in UTC (subtract)
    // If UK is behind desired, go forward in UTC (add)
    utcDate = new Date(utcDate.getTime() + adjustmentMinutes * 60 * 1000);
  }
  
  return utcDate;
}

/**
 * Format date for ICS file with timezone support
 * @param {Date} date - Date object
 * @param {string} timezone - Timezone (defaults to UTC)
 * @returns {string} ICS formatted date string (YYYYMMDDTHHMMSSZ)
 */
export function formatDateForICS(date, timezone = 'UTC') {
  if (timezone === 'UTC') {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const min = String(date.getUTCMinutes()).padStart(2, '0');
    const sec = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hour}${min}${sec}Z`;
  }
  
  // For non-UTC, format in that timezone then convert
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  const hour = parts.find(p => p.type === 'hour').value;
  const min = parts.find(p => p.type === 'minute').value;
  const sec = parts.find(p => p.type === 'second').value;
  
  // Convert to UTC for ICS
  const localDate = new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}`);
  const offsetMs = getTimezoneOffsetInMs(timezone, date);
  const utcDate = new Date(localDate.getTime() - offsetMs);
  
  return formatDateForICS(utcDate, 'UTC');
}

/**
 * Generate VTIMEZONE block for ICS file
 * @param {string} timezone - IANA timezone identifier
 * @returns {string} VTIMEZONE block
 */
export function generateVTIMEZONE(timezone) {
  // For simplicity, we'll generate a basic VTIMEZONE
  // A full implementation would need to handle DST transitions
  const now = new Date();
  const offset = getTimezoneOffset(timezone, now);
  const [sign, hours, minutes] = offset.match(/([+-])(\d{2}):(\d{2})/).slice(1);
  const offsetMinutes = (sign === '+' ? 1 : -1) * (parseInt(hours, 10) * 60 + parseInt(minutes, 10));
  const offsetStr = `${sign}${hours}${minutes}`;
  
  // Get timezone abbreviation
  const abbr = getTimezoneAbbr(timezone);
  
  return [
    `BEGIN:VTIMEZONE`,
    `TZID:${timezone}`,
    `BEGIN:STANDARD`,
    `DTSTART:19700101T000000`,
    `TZOFFSETFROM:${offsetStr}`,
    `TZOFFSETTO:${offsetStr}`,
    `TZNAME:${abbr}`,
    `END:STANDARD`,
    `END:VTIMEZONE`,
  ].join('\r\n');
}

