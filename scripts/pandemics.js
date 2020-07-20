const paper = Snap("#svgContainer");
const paperWidth = window.innerWidth;
const paperHeight = window.innerHeight;
const animationDuration = 300;
var i, j = 0;
var xPos, yPos, radius = 0;

let pandemics = [dataEbola, dataSars];

//createUiButtons();
drawMap();


// if (posY < windowHeight/2) {
//    drawMap(dataEbola);
// }
// if (posY > windowHeight/2) {
//    drawMap(dataSars);
// }

function createUiButtons() {
    // Klickbare Flächen usw. erstellen:
    pandemics.forEach((button,p) => {
        let count = pandemics.length; //count is number of pandemics

        // grosse Hover-Fläche erstellen:
        button.bigBar = paper.rect(0, p*(paperHeight/count), paperWidth, paperHeight/count).attr({
            opacity: 0,
            fill: "#555"
        });

        // Event Listeners erstellen
        button.bigBar.mouseover(function () {
            onMouseEnter(button.bigBar) //drawMap(dataSars)
        });
        button.bigBar.mouseout(function () {
            onMouseOut(button.bigBar) //drawMap(dataEbola)
        });
        //console.log(showOtherData(pandemics[currentPos]))
    })
}

function onMouseEnter(bigButton) {
    drawMap(dataSars);
}

function onMouseOut(bigButton) {
    bigButton.animate({
    opacity: 0
    }, animationDuration / 3);
}
// Fabian Function
// function onMouseMove(event){
//   let currentPos = Math.floor(map(mouseY,0,paperHeight,0,2));
//   let mouseY = event.clientY;
//   console.log(showOtherData(pandemics[currentPos]));
// }

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

function areaToRadius(input) {
  return Math.sqrt(input / Math.PI);
}
