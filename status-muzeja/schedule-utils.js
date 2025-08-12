// schedule-utils.js (standalone)

function parseTimeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function isNowInIntervals(intervals) {
  if (!intervals) return false;
  if (typeof intervals === 'string') intervals = [intervals];

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return intervals.some(interval => {
    const [start, end] = interval.split('-').map(parseTimeToMinutes);
    return nowMinutes >= start && nowMinutes < end;
  });
}

// Convert "MM-DD" to a Date in current year (handles year wrap)
function getDateFromMMDD(mmdd) {
  const [month, day] = mmdd.split('-').map(Number);
  const now = new Date();
  return new Date(now.getFullYear(), month - 1, day);
}

// Check if now is in [start, end] range, considering year wrap (e.g. Sept-Jun)
function isDateInPeriod(now, startMMDD, endMMDD) {
  let start = getDateFromMMDD(startMMDD);
  let end = getDateFromMMDD(endMMDD);

  // handle year wrap (end before start)
  if (end < start) {
    if (now < start) {
      start.setFullYear(start.getFullYear() - 1);
    } else {
      end.setFullYear(end.getFullYear() + 1);
    }
  }

  return now >= start && now <= end;
}

// Get day key like "Mon", "Tue" etc.
function getDayKey() {
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
}

/**
 * Main function to get status
 * @param {*} locationName string key from JSON
 * @param {*} allData entire JSON
 * @returns { isOpen:boolean, statusText:string, todayHours:string|null }
 */
function getOpenStatus(locationName, allData) {
  const location = allData.locations[locationName];
  if (!location) {
    return {
      isOpen: false,
      statusText: "Lokacija ni najdena",
      todayHours: null
    };
  }

  const now = new Date();
  const dayKey = getDayKey();

  // Find current period
  const period = location.periods.find(p => isDateInPeriod(now, p.start, p.end));
  if (!period) {
    return {
      isOpen: false,
      statusText: "Danes zaprto",
      todayHours: null
    };
  }

  const todayHours = period.hours[dayKey] || null;
  const isOpen = isNowInIntervals(todayHours);

  return {
    isOpen,
    statusText: isOpen ? "Odprto" : "Zaprto",
    todayHours: formatHours(todayHours)
  };
}

// Format hours for display, supports array or string or null
function formatHours(hours) {
  if (!hours) return "Zaprto";
  if (typeof hours === 'string') return hours.replace('-', '–');
  if (Array.isArray(hours)) return hours.map(h => h.replace('-', '–')).join(', ');
  return "Zaprto";
}
