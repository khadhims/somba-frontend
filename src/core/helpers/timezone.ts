import moment from "moment";

const hasExplicitTimezone = (value: string) =>
  /([zZ]|[+-]\d{2}:?\d{2})$/.test(value.trim());

// API sometimes returns microseconds (6 digits). Moment parsing is more reliable with milliseconds.
const normalizeApiDateString = (value: string) => {
  // 2025-12-04T13:56:31.205000 -> 2025-12-04T13:56:31.205
  return value.replace(/\.(\d{3})\d+/, ".$1");
};

const parseApiDateToMoment = (value: string) => {
  const normalized = normalizeApiDateString(value);
  // If the string carries timezone info, respect it; otherwise assume UTC.
  return hasExplicitTimezone(normalized)
    ? moment.parseZone(normalized)
    : moment.utc(normalized);
};

/**
 * Convert API datetime to an ISO string in GMT+8 (+08:00).
 * If API datetime has no timezone, it is treated as UTC.
 */
export const toGMT8ISOString = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) return null;
  try {
    return parseApiDateToMoment(dateString)
      .utcOffset(8)
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  } catch (error) {
    console.error("Error converting datetime to GMT+8:", error);
    return dateString;
  }
};

/**
 * Backward-compatible alias used across the app.
 * Converts API datetime to GMT+8 ISO string (+08:00).
 * If API datetime has no timezone, it is treated as UTC.
 */
export const convertToGMT8 = toGMT8ISOString;

/**
 * Format API datetime for display in GMT+8.
 * If API datetime has no timezone, it is treated as UTC.
 */
export const formatDateTimeGMT8 = (
  dateString: string | null | undefined,
  format: string = "DD/MM/YYYY HH:mm:ss"
): string | null => {
  if (!dateString) return null;

  try {
    return parseApiDateToMoment(dateString).utcOffset(8).format(format);
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return dateString;
  }
};

/**
 * Get current datetime in GMT+8
 * @param format - Moment.js format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Current datetime string in GMT+8
 */
export const getCurrentDateTimeGMT8 = (
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  return moment().utcOffset(8).format(format);
};

/**
 * Convert API datetime to a Moment in GMT+8.
 * If API datetime has no timezone, it is treated as UTC.
 */
export const toMomentGMT8 = (
  dateString: string | null | undefined
): moment.Moment | null => {
  if (!dateString) return null;

  try {
    return parseApiDateToMoment(dateString).utcOffset(8);
  } catch (error) {
    console.error("Error converting to moment:", error);
    return null;
  }
};
