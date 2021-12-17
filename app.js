const boroughsDiv = document.querySelector('#boroughs');
const buttonsNodeList = document.querySelectorAll('button');
const outputDiv = document.querySelector('#output');

const buttonsArray = Array.from(buttonsNodeList);

boroughsDiv.addEventListener('click', function cacheData(event) {
  if (!buttonsArray.includes(event.target)) return;

  function processData(rawData) {
    const processedData = rawData
      .filter(record => record.resolution_description !== undefined && record.agency === 'NYPD')
        .map(record => ({
          borough: record.borough,
          descriptor: record.descriptor,
          agency: record.agency,
          resolution_description: record.resolution_description
        }));

    return processedData;
  }
  function boroughEquals(borough) {
    return function (record) {
      return record.borough === borough;
    };
  }

  console.log('working');

  fetch('https://data.cityofnewyork.us/resource/erm2-nwe9.json')
    .then(response => response.json(), alert)
      .then(processData, alert)
      .then(processedData => {
        const bronxData = processedData.filter(boroughEquals('BRONX'));
        const brooklynData = processedData.filter(boroughEquals('BROOKLYN'));
        const manhattanData = processedData.filter(boroughEquals('MANHATTAN'));
        const queensData = processedData.filter(boroughEquals('QUEENS'));
        const statenIslandData = processedData.filter(boroughEquals('STATEN ISLAND'));
        return {
          bronx: bronxData,
          brooklyn: brooklynData,
          manhattan: manhattanData,
          queens: queensData,
          'staten-island': statenIslandData
        };
      }, alert)
      .then(boroughs => {
        function buttonClickHandler(event) {
          const n = Number(document.querySelector('#number-of-complaints').value);
          outputDiv.innerHTML = JSON.stringify(boroughs[event.target.id].slice(0, n || 10), null, 2);
        }

        buttonsArray[0].addEventListener('click', buttonClickHandler);
        buttonsArray[1].addEventListener('click', buttonClickHandler);
        buttonsArray[2].addEventListener('click', buttonClickHandler);
        buttonsArray[3].addEventListener('click', buttonClickHandler);
        buttonsArray[4].addEventListener('click', buttonClickHandler);
      }, alert)
      .then(rawData => {
        boroughsDiv.removeEventListener('click', cacheData);
        event.target.click();
        console.log('done!');
      }, alert);
});
