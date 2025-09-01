// prices-utils.js
import { t } from '../i18n.js';

/**
 * Determine if today's date is inside a seasonal period.
 */
function inPeriod(now, startStr, endStr) {
  const [startMonth, startDay] = startStr.split('-').map(Number);
  const [endMonth, endDay] = endStr.split('-').map(Number);
  const year = now.getFullYear();
  let start = new Date(year, startMonth - 1, startDay);
  let end = new Date(year, endMonth - 1, endDay);
  if (end < start) {
    if (now < start) start.setFullYear(year - 1);
    else end.setFullYear(year + 1);
  }
  return now >= start && now <= end;
}

/**
 * Populate prices table dynamically based on date.
 */
export async function populatePrices(locationName, jsonPath, tableId) {
  try {
    const res = await fetch(jsonPath);
    const data = await res.json();
    const now = new Date();
    const locData = data[locationName];
    if (!locData) return;

    const period = locData.periods.find(p => inPeriod(now, p.start, p.end));
    if (!period) return;

    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';

    for (const [key, value] of Object.entries(period.prices)) {
      const row = document.createElement('tr');
      const tdName = document.createElement('td');
      const tdPrice = document.createElement('td');

      tdName.textContent = t(key); // translated ticket type
      tdPrice.textContent = value;

      row.appendChild(tdName);
      row.appendChild(tdPrice);
      tbody.appendChild(row);
    }
  } catch (err) {
    console.error('Error loading prices JSON:', err);
  }
}
