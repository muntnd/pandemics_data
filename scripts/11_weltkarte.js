const paper = Snap("#svgContainer");
const paperHeight = document.getElementById("svgContainer").getAttribute("height");
const paperWidth = document.getElementById("svgContainer").getAttribute("width");
let data = [];

//console.log(populationData[42].countryName);

init();

function init() {
  mergeData();
  drawMap();
}

function mergeData() {
  for (let i = 0; i < populationData.length; i++) {
    for (let j = 0; j < positionData.length; j++) {
      if (populationData[i].countryCode == positionData[j].countryCode) {
        let newCountry = {
          "countryName": populationData[i].countryName,
          "countryCode": populationData[i].countryCode,
          "population": populationData[i].population,
          "longitude": positionData[j].longitude,
          "latitude": positionData[j].latitude
        };
        data.push(newCountry);
      }
    }
  }
  console.log(data);
}

function drawMap() {
  let populationMin = getPopulationMin();
  let populationMax = getPopulationMax();

  for (let i = 0; i < data.length; i++) {
    let xPos = map(data[i].longitude, 0 - 180, 180, 0, paperWidth);
    let yPos = paperHeight - map(data[i].latitude, 0 - 90, 90, 0, paperHeight);
    let area = map(data[i].population, 0, populationMax, 10, 500);
    let radius = getRadius(area);
    paper.circle(xPos, yPos, radius).attr({
      fill: "white"
    });
  }
}

function getRadius(area) {
  // Flächeninhalt = Pi * Radius²
  // Radius² = Flächeninhalt / Pi
  // Radius = Wurzel(Flächeninhalt / Pi)
  return Math.sqrt(area / Math.PI);
}


function getPopulationMin() {
  let min = data[0].population;
  for (let i = 0; i < data.length; i++) {
    if (data[i].population < min) {
      min = data[i].population;
    }
  }
  return min;
}

function getPopulationMax() {
  let max = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].population > max) {
      max = data[i].population;
    }
  }
  return max;
}