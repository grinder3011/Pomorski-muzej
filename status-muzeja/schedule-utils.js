// schedule-utils.js

/**
 * Parse a time string like "10:00" into a Date object (today)
 */
function parseTimeToday(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}

/**
 * Return day key for today in "Mon", "Tue", etc. format
 */
function getTodayKey() {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());
}

/**
 * Check if today is between two ISO date strings
 */
function isTodayInRange(fromStr, toStr) {
  const today = new Date();
  const from = new Date(fromStr);
  const to = new Date(toStr);
  return today >= from && today <= to;
}

/**
 * Find today's hours from the active schedule block
 */
function findActiveHours(locationData) {
  const todayKey = getTodayKey();

  if (!locationData.schedules || !Array.isArray(locationData.schedules)) return null;

  for (const block of locationData.schedules) {
    if (isTodayInRange(block.from, block.to)) {
      return block.hours?.[todayKey] ?? "closed";
    }
  }

  return "closed";
}

/**
 * Check whether current time is within one or more time ranges
 */
function isWithinHours(hours) {
  if (!hours || hours === "closed") return false;

  const now = new Date();

  if (typeof hours === 'string') {
    const [start, end] = hours.split('-');
    return now >= parseTimeToday(start) && now <= parseTimeToday(end);
  }

  if (Array.isArray(hours)) {
    return hours.some(interval => {
      const [start, end] = interval.split('-');
      return now >= parseTimeToday(start) && now <= parseTimeToday(end);
    });
  }

  return false;
}

/**
 * Main exported function to get open status
 */
export function getOpenStatus(locationName, allData) {
  const locationData = allData[locationName];

  if (!locationData) {
    return {
      isOpen: false,
      statusText: "Lokacija ni najdena",
      todayHours: "ni podatkov"
    };
  }

  const todayStr = new Date().toISOString().slice(0, 10); // e.g. "2025-08-12"
  let todayHours = null;

  // Check exception first
  if (locationData.exceptions && locationData.exceptions[todayStr]) {
    todayHours = locationData.exceptions[todayStr];
  } else {
    todayHours = findActiveHours(locationData);
  }

  const open = isWithinHours(todayHours);

  return {
    isOpen: open,
    statusText: open ? "Odprto" : "Zaprto",
    todayHours: todayHours === "closed" || todayHours === null ? "Zaprto" :
      Array.isArray(todayHours) ? todayHours.join(", ") : todayHours
  };
}
