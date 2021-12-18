const boroughsButtonGroup = document.querySelector('#boroughs');

const boroughButtons = Array.from(document.querySelectorAll('.borough-btn'));
const inputElement = document.querySelector('input');
const serviceRequests = document.querySelector('#service-requests');

boroughsButtonGroup.addEventListener('click', function fetchAndCache(event) {
  if (!boroughButtons.includes(event.target)) return;

  function matchDataByBorough(data, borough) {
    return data.filter(record => record.borough === borough);
  }

  const NYC311_SODA_URL = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json';
  const select = 'SELECT borough,descriptor,resolution_description';
  const where = 'WHERE agency="NYPD"';
  // const order = 'ORDER BY creation_date';
  const query = `$query=${select} ${where}`;

  fetch(`${NYC311_SODA_URL}?${query}`)
    .then(response => response.json(), alert)
    .then(data => ({
      bronx: matchDataByBorough(data, 'BRONX'),
      brooklyn: matchDataByBorough(data, 'BROOKLYN'),
      manhattan: matchDataByBorough(data, 'MANHATTAN'),
      queens: matchDataByBorough(data, 'QUEENS'),
      'staten-island': matchDataByBorough(data, 'STATEN ISLAND')
    }), alert)
    .then(groupedData => {
      function renderOutput(event) {
        const n = Number(inputElement.value || 10);
        const complaints = groupedData[event.target.id].slice(0, n);

        complaints.sort((a, b) => a.descriptor.localeCompare(b.descriptor));

        let complaintsHTML = '';

        for (let i = 0; i < complaints.length; i++) {
          // open complaint-row container
          complaintsHTML += '<div class="complaint-grid bold">';
          // add complaint descriptor
          complaintsHTML += complaints[i].descriptor;
          // add button that toggles resolution description
          complaintsHTML += '<button class="btn" onclick="';
          complaintsHTML += `document.getElementById('resolution-${i}').classList.toggle('hide')`;
          complaintsHTML += '">WHAT DID THE POLICE DO?</button>';
          // add resolution description
          complaintsHTML += `<div id="resolution-${i}" class="wide-row hide">`;
          complaintsHTML += complaints[i].resolution_description;
          complaintsHTML += '</div>';
          // close complaint-row container
          complaintsHTML += '</div>';
        }

        serviceRequests.innerHTML = complaintsHTML;
      }

      for (const button of boroughButtons) {
        button.addEventListener('click', renderOutput);
      }
    }, alert)
    .then(rawData => {
      boroughsButtonGroup.removeEventListener('click', fetchAndCache);
      event.target.click();
    }, alert);
});
