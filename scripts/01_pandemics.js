const paper = Snap("#svgContainer");
const paperWidth = window.innerWidth;
const paperHeight = window.innerHeight;
var i, j = 0;
var xPos, yPos, radius = 0;

//consolidate into one general variable (forEach?)

let rectSars = paper.rect(0,0,paperWidth,paperHeight/4).attr({
  opacity:0
});
let rectSwine = paper.rect(0,paperHeight/4,paperWidth,paperHeight/4).attr({
  opacity:0
});
let rectEbola = paper.rect(0,(paperHeight/4)*2,paperWidth,paperHeight/4).attr({
  opacity:0
});
let rectCovid = paper.rect(0,(paperHeight/4)*3,paperWidth,paperHeight/4).attr({
  opacity:0
});


rectSars.hover(hoverIn,hoverOut);
rectSwine.hover(hoverIn,hoverOut);



function hoverIn(){
  rectSars.attr({ opacity:0.2});
  rectSwine.attr({ opacity:0.1});
  clearSwine();
  drawSarsMap();
}
function hoverOut(){
  rectSars.attr({ opacity:0.1});
  rectSwine.attr({ opacity:0.2});
  clearSars();
  drawSwineMap();
}

function clearSars(){
  paper.selectAll("#sars").remove();
};
function clearSwine(){
  paper.selectAll("#swine").remove();
};
function clearEbola(){
  paper.selectAll("#ebola").remove();
};
function clearCovid(){
  paper.selectAll("#covid").remove();
};
//create a drawMap() function that works with input variable for each pandemic

function drawEbolaMap() {
  for (i = 0; i < dataEbola.length; i++) {
    xPos = map(dataEbola[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(dataEbola[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(dataEbola[i].cases), 0, areaToRadius(1700), 1, 10);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: '#2B2D42',
      id: "ebola"

    });
  }
}

function drawSarsMap() {
  for (i = 0; i < dataSars.length; i++) {
    xPos = map(dataSars[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(dataSars[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(dataSars[i].cases), 0, areaToRadius(1700), 1, 10);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: '#4e878c',
      id: "sars"
    });
  }
}

function drawCovidMap() {
  for (i = 0; i < dataCovid.length; i++) {
    //if (!dataCovid[i].longitude) console.log(dataCovid[i])
    xPos = map(dataCovid[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(dataCovid[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(dataCovid[i].cases), 0, areaToRadius(1700), 1, 10);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: '#BBDBB4',
      id: "covid"
    });
  }
}

function drawSwineMap() {
  for (i = 0; i < dataSwine.length; i++) {
    //if (!dataCovid[i].longitude) console.log(dataCovid[i])
    xPos = map(dataSwine[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(dataSwine[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(dataSwine[i].cases), 0, areaToRadius(1700), 1, 10);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: '#1C7293',
      id:"swine"
    });
  }
}

// function drawSwineMap() {
//   for (i = 0; i < dataCovid.length; i++) {
//     //if (!dataCovid[i].longitude) console.log(dataCovid[i])
//     xPos = map(dataCovid[i].longitude, 0 - 180, 180, 0, paperWidth);
//     yPos = map(dataCovid[i].latitude, 0 - 90, 90, 0, paperHeight);
//     radius = map(areaToRadius(dataCovid[i].cases), 0, areaToRadius(1700), 1, 10);
//     paper.circle(xPos, paperHeight - yPos, radius).attr({
//       fill: '#EB9486'
//     });
//   }
// }

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
