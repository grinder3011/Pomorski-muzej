// schedule-utils.js

/**
 * Parse a time string like "10:00" into a Date object (today)
 */
function parseTimeToday(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  return date;
}

/**
 * Format a day string to lowercase (e.g., "Tuesday")
 */
function getTodayKey() {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' })
    .format(new Date())
    .toLowerCase();
}

/**
 * Returns true if today falls within a date range
 */
function isTodayInRange(from, to) {
  const today = new Date();
  const fromDate = new Date(from);
  const toDate = new Date(to);
  return today >= fromDate && today <= toDate;
}

/**
 * Finds the active schedule block for today
 */
function findActiveSchedule(locationData) {
  if (!locationData.schedules || locationData.schedules.length === 0) return null;

  const today = new Date();
  for (const block of locationData.schedules) {
    if (isTodayInRange(block.from, block.to)) {
      return block.hours;
    }
  }
  return null;
}

/**
 * Checks if current time is within open hours
 */
function isWithinHours(openingHours) {
  if (!openingHours || openingHours === "closed") return false;
  const [start, end] = openingHours.split('-');
  const now = new Date();
  const startTime = parseTimeToday(start);
  const endTime = parseTimeToday(end);
  return now >= startTime && now <= endTime;
}

/**
 * Main function: evaluates whether a location is currently open
 */
export function getOpenStatus(locationName, allData) {
  const location = allData[locationName];
  if (!location) {
    return {
      isOpen: false,
      statusText: "Lokacija ni najdena",
      todayHours: "ni podatkov"
    };
  }

  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const todayKey = getTodayKey();
  let todayHours = null;

  // Apply exception first
  if (location.exceptions && location.exceptions[todayStr]) {
    todayHours = location.exceptions[todayStr];
  } else {
    const activeBlock = findActiveSchedule(location);
    if (activeBlock) {
      todayHours = activeBlock[todayKey] || "closed";
    }
  }

  const isOpen = isWithinHours(todayHours);

  return {
    isOpen,
    statusText: isOpen ? "Odprto" : "Zaprto",
    todayHours: todayHours === "closed" ? "Zaprto" : todayHours
  };
}
