import { t } from '../i18n.js';

function parseTime(tStr) {
  const [h, m] = tStr.split(':').map(Number);
  return h * 60 + m;
}

function nowInInterval(interval) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const [startStr, endStr] = interval.split('-');
  if (!startStr || !endStr) return false;

  const start = parseTime(startStr);
  const end = parseTime(endStr);

  return nowMinutes >= start && nowMinutes < end;
}

function isOpenNow(hours) {
  if (!hours) return false;
  if (typeof hours === 'string') {
    if (hours.toLowerCase() === 'closed') return false;
    return nowInInterval(hours);
  }
  if (Array.isArray(hours)) {
    return hours.some(interval => nowInInterval(interval));
  }
  return false;
}

function inPeriod(now, startStr, endStr) {
  const [startM, startD] = startStr.split('-').map(Number);
  const [endM, endD] = endStr.split('-').map(Number);

  const year = now.getFullYear();
  let start = new Date(year, startM - 1, startD);
  let end = new Date(year, endM - 1, endD);

  if (end < start) {
    if (now < start) start.setFullYear(year - 1);
    else end.setFullYear(year + 1);
  }

  return now >= start && now <= end;
}

function formatHours(hours) {
  if (!hours) return t("status_closed");
  if (typeof hours === 'string') return hours.replace('-', '–');
  if (Array.isArray(hours)) return hours.map(h => h.replace('-', '–')).join(', ');
  return "";
}

function getTodayKey() {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());
}

export function getOpenStatus(locationName, data) {
  const location = data.locations?.[locationName];
  if (!location) {
    return {
      isOpen: false,
      statusText: t("locationNotFound"),
      todayHours: "-"
    };
  }

  const now = new Date();
  const activePeriod = location.periods.find(p => inPeriod(now, p.start, p.end));

  if (!activePeriod) {
    return {
      isOpen: false,
      statusText: t("status_closed"),
      todayHours: t("todayClosed")
    };
  }

  const todayKey = getTodayKey();
  let todayHours = activePeriod.hours[todayKey];

  if (todayHours === null) todayHours = null;

  const open = isOpenNow(todayHours);

  return {
    isOpen: open,
    statusText: open ? t("status_open") : t("status_closed"),
    todayHours: formatHours(todayHours) || t("status_closed")
  };
}
