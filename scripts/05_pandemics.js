//converted to p5
var i, j = 0;
var xPos, yPos, radius = 0;

let dataCombined = [dataSars, dataSwine, dataEbola, dataCovid];
let colors = ['#4e878c','#1C7293','#2B2D42','#BBDBB4' ];
let uiRects = [];

function setup(){
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {

  for (let i = 0; i < 4; i++) {
    tint(255, 127)
    let r = rect(0,(windowHeight/4) * i, windowWidth)


   mouseOver(
        function(e) {
         console.log('hoverIn', i);
         clearAll();
         drawMap(dataCombined[i], colors[i]);
       },
       function(e) {
         console.log('hoverOut', i);
       },
   );
    // r.hover(
    //   function(e) {
    //     console.log('hoverIn', i);
    //     r.attr({opacity: 0.01});
    //     clearAll();
    //     drawMap(dataCombined[i], colors[i]);
    //   },
    //   function(e) {
    //     console.log('hoverOut', i);
    //     r.attr({opacity: 0});
    //   },
    // );

    uiRects.push(r);
  }
}


function clearAll(){
  paper.selectAll("#all").remove();
};


function drawMap(data, col) {
  for (i = 0; i < data.length; i++) {
    xPos = map(data[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(data[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(data[i].cases), 0, areaToRadius(1700), 1, 10);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: col,
      id: "all"
    });
  }
}

function areaToRadius(input) {
  return Math.sqrt(input / Math.PI);
}
