// validator-save.js

/**
 * Validate the current scheduleData object.
 * Returns an array of issues found, or empty array if valid.
 */
function validateSchedule(scheduleData) {
  const messages = [];
  
  Object.entries(scheduleData).forEach(([loc, locData]) => {
    locData.periods.forEach((period, pIdx) => {
      // Validate start and end dates
      if (!period.start) messages.push(`${loc} - Obdobje ${pIdx+1}: manjkajoča začetna datum.`);
      if (!period.end) messages.push(`${loc} - Obdobje ${pIdx+1}: manjkajoča končna datum.`);
      
      // Validate hours for each day
      Object.entries(period.hours).forEach(([day, val]) => {
        const ranges = Array.isArray(val) ? val : val ? [val] : [];
        if (ranges.length > 2) {
          messages.push(`${loc} - Obdobje ${pIdx+1}, ${day}: preveč časovnih intervalov (max 2).`);
        }
        ranges.forEach((range, rIdx) => {
          if (!range) {
            messages.push(`${loc} - Obdobje ${pIdx+1}, ${day}: manjkajoči časovni interval ${rIdx+1}.`);
          } else {
            const parts = range.split('-');
            if (parts.length !== 2 || !parts[0] || !parts[1]) {
              messages.push(`${loc} - Obdobje ${pIdx+1}, ${day}: interval "${range}" mora imeti začetek in konec.`);
            } else {
              const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
              if (!timeRegex.test(parts[0])) messages.push(`${loc} - Obdobje ${pIdx+1}, ${day}: neveljaven začetek "${parts[0]}".`);
              if (!timeRegex.test(parts[1])) messages.push(`${loc} - Obdobje ${pIdx+1}, ${day}: neveljaven konec "${parts[1]}".`);
            }
          }
        });
      });
    });
  });

  return messages;
}

/**
 * Attempt to save scheduleData.
 * Calls validateSchedule first, shows errors if found.
 * Otherwise sends JSON to backend.
 */
function saveSchedule(scheduleData, endpoint = '/api/save-schedule') {
  const errors = validateSchedule(scheduleData);

  if (errors.length > 0) {
    // Display messages to the user
    alert('Najdene težave v urnikih:\n\n' + errors.join('\n'));
    return false;
  }

  // Send data to server
  fetch(endpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(scheduleData)
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  })
  .then(data => {
    alert('Urniki uspešno shranjeni.');
    console.log('Server response:', data);
  })
  .catch(err => {
    alert('Napaka pri shranjevanju: ' + err.message);
    console.error(err);
  });
}

/**
 * Optional helper: bind to a button
 */
function setupSaveButton(buttonId, scheduleData, endpoint) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener('click', e => saveSchedule(scheduleData, endpoint));
}
