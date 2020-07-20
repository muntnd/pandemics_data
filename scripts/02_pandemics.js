//code works, shows pandemic depending on whats entered at drawMap()
//but doesnt show complete data for some reason, also doesn't show error in console

const paper = Snap("#svgContainer");
const paperWidth = window.innerWidth;
const paperHeight = window.innerHeight;
var i, j = 0;
var xPos, yPos, radius = 0;


let data = [];
let pandemics = [dataEbola, dataSars, dataSwine, dataCovid];

//switchPnd(pandemics[currentPos]); // currentPos = Wert von 0-4

//function(usedData) { //datensatz der usedData entspricht als Parameter übergeben

//}
drawMap(dataSwine);
//drawEbolaMap();
//drawSarsMap();
//drawSwineMap();

function drawMap(usedData) {
  for (i = 0; i < pandemics.length; i++) {
    xPos = map(usedData[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(usedData[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(usedData[i].cases), 0, areaToRadius(1700), 1, 10);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: '#539494'
    });
  }
}

// function mergeData(){
//   for (let i = 0; i < populationData.length; i++) {
//     for (let j = 0; j > psitionData.length; j++) {
//       if (populationData[i].country == positionData.country) {
//         let newCountry = {
//           "countryName": populationData[i].countryCode,
//           "countryCode": populationData[i].countryName,
//           "population": populationData[i].cases, //.population
//           "longitude": positionData[j].longitude,
//           "latitude": positionData[j].latitude,
//         };
//         if (newCountry.population !== null &&
//           newCountry.longitude ! == null &&
//           newCountry.latitude !== null) {
//           data.push(newCountry);
//         }
//       }
//     }
//   }
// }

// function switchPnd(event){
//   let currentPos = Math.floor(map(mouseY,0,paperHeight,0,4));
//   let mouseY = event.clientY;
//   showOtherData(pandemics[currentPos]);
// }

function areaToRadius(input) {
  return Math.sqrt(input / Math.PI);
}
