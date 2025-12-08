// schedule-validator.js

/**
 * Validates scheduleData object.
 * Expects scheduleData in the form:
 * {
 *   locationName: {
 *     periods: [
 *       {
 *         start: 'MM-DD',
 *         end: 'MM-DD',
 *         hours: {
 *           Mon: ['09:00-12:00','13:00-17:00'] or '09:00-17:00' or null
 *           ...
 *         }
 *       }
 *     ]
 *   }
 * }
 *
 * Returns an array of issues, empty if everything is valid.
 */
function validateScheduleData(scheduleData) {
  const dayNames = {
    Mon: 'Ponedeljek', Tue: 'Torek', Wed: 'Sreda',
    Thu: 'Četrtek', Fri: 'Petek', Sat: 'Sobota', Sun: 'Nedelja'
  };
  const issues = [];

  Object.entries(scheduleData).forEach(([locName, locData]) => {
    if (!locData.periods || !Array.isArray(locData.periods)) {
      issues.push(`Lokacija "${locName}" nima veljavnih obdobij.`);
      return;
    }

    locData.periods.forEach((period, pIndex) => {
      const pLabel = `Obdobje ${pIndex + 1} (${locName})`;

      // Validate start and end dates
      if (!period.start) issues.push(`${pLabel}: Manjkajoči začetni datum.`);
      if (!period.end) issues.push(`${pLabel}: Manjkajoči končni datum.`);

      if (period.start && period.end) {
        const startDate = new Date(`2025-${period.start}`);
        const endDate = new Date(`2025-${period.end}`);
        if (startDate > endDate) issues.push(`${pLabel}: Začetni datum mora biti pred končnim datumom.`);
      }

      // Validate hours
      Object.entries(period.hours).forEach(([dayKey, value]) => {
        const dayLabel = dayNames[dayKey] || dayKey;
        const ranges = Array.isArray(value) ? value : (value ? [value] : []);
        ranges.forEach((range, rIndex) => {
          if (!range || range.trim() === '') {
            issues.push(`${pLabel}, ${dayLabel}: Manjkajoči začetek in konec delovnega časa (razpon ${rIndex + 1}).`);
            return;
          }

          const [start, end] = range.split('-');
          if (!start) issues.push(`${pLabel}, ${dayLabel}: Manjkajoči začetek delovnega časa (razpon ${rIndex + 1}).`);
          if (!end) issues.push(`${pLabel}, ${dayLabel}: Manjkajoči konec delovnega časa (razpon ${rIndex + 1}).`);

          if (start && end) {
            const startParts = start.split(':');
            const endParts = end.split(':');
            if (
              startParts.length !== 2 || endParts.length !== 2 ||
              isNaN(startParts[0]) || isNaN(startParts[1]) ||
              isNaN(endParts[0]) || isNaN(endParts[1])
            ) {
              issues.push(`${pLabel}, ${dayLabel}: Neveljaven čas (razpon ${rIndex + 1}).`);
            } else {
              const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
              const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
              if (startMinutes >= endMinutes) {
                issues.push(`${pLabel}, ${dayLabel}: Začetek mora biti pred koncem (razpon ${rIndex + 1}).`);
              }
            }
          }
        });
      });
    });
  });

  return issues;
}

// Example usage:
// const issues = validateScheduleData(scheduleData);
// if (issues.length) {
//   alert('Napake:\n' + issues.join('\n'));
// } else {
//   alert('Podatki so veljavni!');
// }
