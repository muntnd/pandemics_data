const paper = Snap("#svgContainer");
const paperWidth = window.innerWidth;
const paperHeight = window.innerHeight;
var i, j = 0;
var xPos, yPos, radius = 0;


let data = [];
//let pandemics = [dataEbola, dataSars]; // better solution???

//switchPnd(pandemics[currentPos]); // currentPos = Wert von 0-4

//function(usedData) { //datensatz der usedData entspricht als Parameter übergeben

//}

drawEbolaMap();
drawSarsMap();
//drawSwineMap();

function drawEbolaMap() {
  for (i = 0; i < dataEbola.length; i++) {
    xPos = map(dataEbola[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(dataEbola[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(dataEbola[i].cases), 0, areaToRadius(1700), 1, 10);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: '#539494'
    });
  }
}

function drawSarsMap() {
  for (i = 0; i < dataSars.length; i++) {
    xPos = map(dataSars[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(dataSars[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(dataSars[i].cases), 0, areaToRadius(1700), 1, 10);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: '#8a465f'
    });
  }
}

function drawSwineMap() {
  for (i = 0; i < dataSwine.length; i++) {
    xPos = map(dataSwine[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(dataSwine[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(dataSwine[i].cases), 0, areaToRadius(1700), 1, 10);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: '#e3ae32'
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
