// schedule-utils.js
import { t } from '../i18n.js';

/**
 * Parse a "HH:MM" time string into total minutes since midnight.
 */
function parseTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Check if the current time is within one of the given opening intervals.
 */
function isOpenNow(hours) {
  if (!hours) return false;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (typeof hours === 'string') hours = [hours];

  return hours.some(interval => {
    const [start, end] = interval.split('-').map(parseTime);
    return nowMinutes >= start && nowMinutes < end;
  });
}

/**
 * Format hours into a human-readable string.
 */
function formatHours(hours) {
  if (!hours) return t("todayClosed"); // ✅ translated
  if (typeof hours === 'string') return hours.replace('-', '–');
  if (Array.isArray(hours)) return hours.map(h => h.replace('-', '–')).join(', ');
  return "";
}

/**
 * Check if today's date is inside a seasonal period.
 */
function inPeriod(now, startStr, endStr) {
  const [startMonth, startDay] = startStr.split('-').map(Number);
  const [endMonth, endDay] = endStr.split('-').map(Number);

  const year = now.getFullYear();
  let start = new Date(year, startMonth - 1, startDay);
  let end = new Date(year, endMonth - 1, endDay);

  if (end < start) {
    // Period crosses year boundary
    if (now < start) {
      start.setFullYear(year - 1);
    } else {
      end.setFullYear(year + 1);
    }
  }

  return now >= start && now <= end;
}

/**
 * Main function: determine open/closed status and today's hours for a location.
 */
export function getOpenStatus(locationName, data) {
  const now = new Date();
  const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const locData = data.locations[locationName];
  if (!locData) {
    return {
      isOpen: false,
      statusText: t("locationNotFound"), // ✅ translated
      todayHours: t("todayClosed"),      // ✅ translated
    };
  }

  const dayKey = daysMap[now.getDay()];
  const period = locData.periods.find(p => inPeriod(now, p.start, p.end));

  if (!period) {
    return {
      isOpen: false,
      statusText: t("status_closed"), // ✅ translated
      todayHours: t("todayClosed"),   // ✅ translated
    };
  }

  const todayHours = period.hours[dayKey] || null;
  const open = isOpenNow(todayHours);

  return {
    isOpen: open,
    statusText: open ? t("status_open") : t("status_closed"), // ✅ translated
    todayHours: todayHours ? formatHours(todayHours) : t("todayClosed"),
  };
}
