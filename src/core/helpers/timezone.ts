import moment, { type Moment } from "moment";

const GMT8_OFFSET_MINUTES = 8 * 60;

export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function hasExplicitTimezone(value: string): boolean {
  return /[zZ]$|[+-]\d{2}:?\d{2}$/.test(value.trim());
}

/**
 * Parse API datetime values. Strings without timezone are treated as UTC.
 */
export function toMomentGMT8(
  value: string | Date | number | null | undefined
): Moment | null {
  if (value == null || value === "") {
    return null;
  }

  if (moment.isMoment(value)) {
    return value.clone().utcOffset(GMT8_OFFSET_MINUTES);
  }

  if (value instanceof Date) {
    const parsed = moment(value);
    return parsed.isValid() ? parsed.utcOffset(GMT8_OFFSET_MINUTES) : null;
  }

  if (typeof value === "number") {
    const parsed = moment(value);
    return parsed.isValid() ? parsed.utcOffset(GMT8_OFFSET_MINUTES) : null;
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return null;
  }

  const parsed = hasExplicitTimezone(trimmed)
    ? moment.parseZone(trimmed)
    : moment.utc(trimmed);

  return parsed.isValid() ? parsed.utcOffset(GMT8_OFFSET_MINUTES) : null;
}

export function formatDateTimeGMT8(
  value: string | Date | number | null | undefined,
  format = "DD/MM/YYYY HH:mm"
): string | null {
  const parsed = toMomentGMT8(value);
  return parsed ? parsed.format(format) : null;
}

export function convertToGMT8(
  value: string | Date | number | null | undefined
): string {
  const parsed = toMomentGMT8(value);
  if (!parsed) {
    return String(value ?? "");
  }

  return parsed.format("YYYY-MM-DDTHH:mm:ssZ");
}

export function toGMT8ISOString(
  value: string | Date | number | null | undefined
): string | null {
  const parsed = toMomentGMT8(value);
  return parsed ? parsed.format() : null;
}

export function getCurrentDateTimeGMT8(format = "DD/MM/YYYY HH:mm"): string {
  return moment().utcOffset(GMT8_OFFSET_MINUTES).format(format);
}
