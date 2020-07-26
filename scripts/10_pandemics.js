const paper = Snap("#svgContainer");
const paperWidth = window.innerWidth;
const paperHeight = window.innerHeight;
let i, j = 0;
let xPos, yPos, radius = 0;

let dataCombined = [dataSars, dataSwine, dataEbola, dataCovid];
let colors = ['#425a64','#627F9D','#9DA9A0','#A5C4BF' ];
let uiScopeCircle = [];
let uiHoverRect = [];
let monthlySars = [];
let monthlySwine = [];
let monthlyEbola = [];
let monthlyCovid = [];
let monthlyCountrySars;
let monthlyCountrySwine;
let monthlyCountryEbola;
let monthlyCountryCovid;
let totals = [5327,33902,14122,1662302];
let totalsDeath = [348,170,4806,98220];
let pieParts = [];

let state = 0;

init();

function init(){
   calculateMonths();
   createNav();

   paper.node.onclick = function () {
    if (state == 0) {
      state = 1;
      clearMap()
      clearNav();
      clearCompDia();
      drawDiagram();
      drawDiagramDeath();
    } else if (state == 1) {
      state = 2;
      clearNav();
      clearDiagramm();
      clearDiagrammDeath();
      compDia();
    } else if (state == 2) {
      state = 0;
      clearDiagramm();
      clearCompDia();
      clearCompMap();
      createNav();
    }
  }
}



function compDia(){
  //calculate sums of each pandemic month

  let monthlyTotal = [];
  let sarsCases = monthlySars.map(monthlySars => monthlySars.casesMax);
  for (var i = 5; i < 18; i++) {
    sarsCases[i] = 0
  }

  let swineCases = monthlySwine.map(monthlySwine => monthlySwine.casesMax);
  for (var i = 3; i < 18; i++) {
    swineCases[i] = 0;
  }

  let ebolaCases = monthlyEbola.map(monthlyEbola => monthlyEbola.casesMax);
  let covidCases = monthlyCovid.map(monthlyCovid => monthlyCovid.casesMax);
  for (var i = 5; i < 18; i++) {
    covidCases[i] = 0;
  }

  for (var i = 0; i < 18; i++){
      monthlyTotal.push(ebolaCases[i] + swineCases[i] + sarsCases[i] + covidCases[i]);
  }
  //console.log(monthlyTotal);

  //draw diagram comparison map
  let monthlyTotalNav = [];
  let uiTotalRect = [];
  for (let i = 0; i < 18; i++) {
    //radius hat größe von allen pandemien in dem ersten monat zusammen
    sarsR = map(areaToRadius(monthlyTotal[i]), 10, areaToRadius(10000), 1, 10);
    let c = paper.circle((paperWidth/22)*(i+2),paperHeight - 90, sarsR).attr({
      opacity:0.02,
      fill: '#000000',
      id:"dicomp"
    });
    monthlyTotalNav.push(c);

    let cc = paper.circle((paperWidth/22)*(i+2),paperHeight - 90, 2).attr({
      opacity:1,
      fill:'#000000',
      id:"dicomp"
    });
  }


  for (let i = 0; i < 18; i++) {
    let r = paper.rect((paperWidth/22)*(i+1.5),800,paperWidth/30, paperHeight).attr({
      opacity:0,
      id: "dicomp"
    });
    r.hover(
      function(e) {
          for (let j = 0; j < uiTotalRect.length; j++) {
            uiTotalRect[j].attr({opacity: 0});
          }
          drawCompMapSars(monthlyCountrySars, i, colors[0]);
          drawCompMapSwine(monthlyCountrySwine, i,colors[1]);
          drawCompMapEbola(monthlyCountryEbola, i,colors[2]);
          drawCompMapCovid(monthlyCountryCovid, i,colors[3]);
          r.attr({opacity: 0});
          monthlyTotalNav[i].attr({opacity: 0.3});
          },
        function(e) {
          clearCompMap();
          monthlyTotalNav[i].attr({opacity: 0.02});
          },
      );
      uiTotalRect.push(r);
    }
}


function drawDiagram() {
    clearNav();
    for (var i = 0; i < 4; i++) {
        var radius = Math.sqrt(totals[i]) / 4;
        var pathString = getPathStringDia(i * 90, (i+1) * 90, radius);
        paper.path(pathString).attr({
            fill: colors[i],
            opacity: 0.7,
            id: "dia"
        });
    }
}

function drawDiagramDeath() {
    clearNav();
    for (var i = 0; i < 4; i++) {
        var radius = Math.sqrt(totalsDeath[i]) / 4;
        var pathString = getPathStringDia(i * 90, (i+1) * 90, radius);
        paper.path(pathString).attr({
            fill: colors[i],
            opacity: 1,
            id: "diad"
        });
    }
}

//path string für map
function getPathString(startAngle, endAngle, radius, x, y) {
    x = x || diagramCenter.x;
    y = y || diagramCenter.y;

    //damit es oben anfängt:
    startAngle -= 90;
    endAngle -= 90;

    var diagramCenter = {
        x: paperWidth / 2,
        y: paperHeight / 2
    };

    //an welcher Koordinate fängt der Bogen des Törtchens an?
    var arcStart = {
        x: x + (radius * Math.cos(radians(startAngle))),
        y: y + (radius * Math.sin(radians(startAngle)))
    };

    // an welcher Koordinate hört der Bogen des Törtchens auf?
    var arcEnd = {
        x: x + (radius * Math.cos(radians(endAngle))),
        y: y + (radius * Math.sin(radians(endAngle)))
    };

    var over180Degrees = "0";
    if (endAngle - startAngle > 180) over180Degrees = "1";


    return "M" + x + "," + y +
        "L" + arcStart.x + "," + arcStart.y +
        " A" + radius + "," + radius + " 0 " + over180Degrees + ",1 " + arcEnd.x + "," + arcEnd.y +
        "z";
}

//path string für totals ansicht
function getPathStringDia(startAngle, endAngle, radius) {
    //damit es oben anfängt:
    startAngle -= 90;
    endAngle -= 90;

    var diagramCenter = {
        x: paperWidth / 2,
        y: paperHeight / 2
    };

    //an welcher Koordinate fängt der Bogen des Törtchens an?
    var arcStart = {
        x: diagramCenter.x + (radius * Math.cos(radians(startAngle))),
        y: diagramCenter.y + (radius * Math.sin(radians(startAngle)))
    };

    // an welcher Koordinate hört der Bogen des Törtchens auf?
    var arcEnd = {
        x: diagramCenter.x + (radius * Math.cos(radians(endAngle))),
        y: diagramCenter.y + (radius * Math.sin(radians(endAngle)))
    };

    var over180Degrees = "0";
    if (endAngle - startAngle > 180) over180Degrees = "1";


    return "M" + diagramCenter.x + "," + diagramCenter.y +
        "L" + arcStart.x + "," + arcStart.y +
        " A" + radius + "," + radius + " 0 " + over180Degrees + ",1 " + arcEnd.x + "," + arcEnd.y +
        "z";
}


//function to draw separated nav + map for each pandemic
function createNav(){
  //navigation Sars
  for (let i = 0; i < 5; i++) {
    radius = map(areaToRadius(monthlySars[i].casesMax), 10, areaToRadius(10000), 1, 10);
    let c = paper.circle((paperWidth/39)*(i+2),paperHeight - 90, radius).attr({
      opacity:0.2,
      fill:'#425a64',
      id:"nav"
    });
    let r = paper.rect((paperWidth/39)*(i+1.5),800,paperWidth/39, paperHeight).attr({
      opacity:0,
      id:"nav"
    });
    let cc = paper.circle((paperWidth/39)*(i+2),paperHeight - 90, 2).attr({
      opacity:1,
      fill:'#000000',
      id:"nav"
    });
    //hoverInteraction
    r.hover(
      function(e) {
        for (let j = 0; j < uiHoverRect.length; j++) {
          uiHoverRect[j].attr({opacity: 0});
        }
        drawMap(monthlyCountrySars, monthlySars[i].dateRounded, colors[0]);
        c.attr({opacity: 0.7});
      },
      function(e) {
        c.attr({opacity: 0.2});
        clearMap();
      },
    );
    uiScopeCircle.push(c);
    uiHoverRect.push(r);
  }


  //navigation Swine
  for (let i = 0; i < 3; i++) {
    radius = map(areaToRadius(monthlySwine[i].casesMax), 10, areaToRadius(10000), 1, 10);
    let c = paper.circle((paperWidth/39)*(i+8),paperHeight - 90, radius).attr({
      opacity:0.2,
      fill: '#627F9D',
      id:"nav"
    });
    let cc = paper.circle((paperWidth/39)*(i+8),paperHeight - 90, 2).attr({
      opacity:1,
      fill:'#000000',
      id:"nav"
    });
    //hoverRect
    let r = paper.rect((paperWidth/39)*(i+7.5),800,paperWidth/39, paperHeight).attr({
      opacity:0,
      id:"nav"
    });
    //hoverInteraction
    r.hover(
      function(e) {
        for (let j = 0; j < uiHoverRect.length; j++) {
          uiHoverRect[j].attr({opacity: 0});
        }
        drawMap(monthlyCountrySwine, monthlySwine[i].dateRounded, colors[1]);
        c.attr({opacity: 0.7});
      },
      function(e) {
        c.attr({opacity: 0.2});
        clearMap();
      },
    );
    uiScopeCircle.push(c);
    uiHoverRect.push(r);
  }


  //navigation Ebola
  for (let i = 0; i < 18; i++) {
    radius = map(areaToRadius(monthlyEbola[i].casesMax), 10, areaToRadius(10000), 1, 10);
    let c = paper.circle((paperWidth/39)*(i+12),paperHeight - 90, radius).attr({
      opacity:0.2,
      fill: '#9DA9A0',
      id:"nav"
    });
    let cc = paper.circle((paperWidth/39)*(i+12),paperHeight - 90, 2).attr({
      opacity:1,
      fill:'#000000',
      id:"nav"
    });
    let r = paper.rect((paperWidth/39)*(i+11.5),800,paperWidth/39, paperHeight).attr({
      opacity:0,
      id: "nav"
    });
    r.hover(
      function(e) {
        for (let j = 0; j < uiHoverRect.length; j++) {
          uiHoverRect[j].attr({opacity: 0});
        }
        drawMap(monthlyCountryEbola, monthlyEbola[i].dateRounded, colors[2]);
        c.attr({opacity: 0.7});
      },
      function(e) {
        c.attr({opacity: 0.2});
        clearMap();
      },
    );
    uiScopeCircle.push(c);
    uiHoverRect.push(r);
}



    //navigation Covid
    let covidCircles = [];
    for (let i = 0; i < 5; i++) {
      radius = map(areaToRadius(monthlyCovid[i].casesMax), 10, areaToRadius(10000), 1, 10);
      let c = paper.circle((paperWidth/39)*(i+31),paperHeight - 90, radius).attr({
        opacity:0.2,
        fill:'#A5C4BF',
        id:"nav"
      });
      covidCircles.push(c);
      let cc = paper.circle((paperWidth/39)*(i+31),paperHeight - 90, 2).attr({
        opacity:1,
        fill:'#000000',
        id:"nav"
      });
      uiScopeCircle.push(c);
    }

    //hoverInteraction
    for (let i = 0; i < 5; i++) {
      let r = paper.rect((paperWidth/39)*(i+30.5),800,paperWidth/39, paperHeight).attr({
        opacity:0,
        id:"nav"
      });
      r.hover(
        function(e) {
          for (let j = 0; j < uiHoverRect.length; j++) {
            uiHoverRect[j].attr({opacity: 0});
          }
          drawMap(monthlyCountryCovid, monthlyCovid[i].dateRounded, colors[3]);
          r.attr({opacity: 0});
          covidCircles[i].attr({opacity: 0.7});
          },
          function(e) {
            clearMap();
            covidCircles[i].attr({opacity: 0.2});
          },
        );
        uiHoverRect.push(r);
     }
}

function calculateMonths(){
    //convert date into four digit number to represent months
    for (let i = 0; i < dataSars.length; i++) {
      let d = Date.parse(dataSars[i].date);
      d = new Date(d);
      let m = d.getMonth();
      let y = d.getYear();
      dataSars[i].dateRounded = y * 12 + m;
    }

    for (let i = 0; i < dataSwine.length; i++) {
      let d = Date.parse(dataSwine[i].date);
      d = new Date(d);
      let m = d.getMonth();
      let y = d.getYear();
      dataSwine[i].dateRounded = y * 12 + m;
    }

    for (let i = 0; i < dataEbola.length; i++) {
      let d = Date.parse(dataEbola[i].date);
      d = new Date(d);
      let m = d.getMonth();
      let y = d.getYear();
      dataEbola[i].dateRounded = y * 12 + m;
    }

    for (let i = 0; i < dataCovid.length; i++) {
      let d = Date.parse(dataCovid[i].date);
      d = new Date(d);
      let m = d.getMonth();
      let y = d.getYear();
      dataCovid[i].dateRounded = y * 12 + m;
    }


    //calculate monthly peaks of cases and peaks per country
    monthlySars = cumulateData(dataSars,['dateRounded'], [{value:'cases', method:'Max'}, {value:'deaths', method:'Max'}]);
    monthlyCountrySars = cumulateData(dataSars,['dateRounded', 'country'], [{value:'cases', method:'Max'},{value:'deaths', method:'Max'}, {value:'longitude', method:'Max'}, {value:'latitude', method:'Max'}]);

    monthlySwine = cumulateData(dataSwine,['dateRounded'], [{value:'cases', method:'Max'}, {value:'deaths', method:'Max'}]);
    monthlyCountrySwine = cumulateData(dataSwine,['dateRounded', 'country'], [{value:'cases', method:'Max'}, {value:'deaths', method:'Max'}, {value:'longitude', method:'Max'}, {value:'latitude', method:'Max'}]);

    monthlyEbola = cumulateData(dataEbola,['dateRounded'], [{value:'cases', method:'Max'}, {value:'deaths', method:'Max'}]);
    monthlyCountryEbola = cumulateData(dataEbola,['dateRounded', 'country'], [{value:'cases', method:'Max'}, {value:'deaths', method:'Max'}, {value:'longitude', method:'Max'}, {value:'latitude', method:'Max'}]);

    monthlyCovid = cumulateData(dataCovid,['dateRounded'], [{value:'cases', method:'Max'}, {value:'deaths', method:'Max'}]);
    monthlyCountryCovid = cumulateData(dataCovid,['dateRounded', 'country'], [{value:'cases', method:'Max'},{value:'deaths', method:'Max'}, {value:'longitude', method:'Max'}, {value:'latitude', method:'Max'}]);

    //for schleife für relative monate alle pandemien
    for (let i = 0; i < monthlyCountrySars.length; i++) {
      monthlyCountrySars[i].dateRoundedRel = monthlyCountrySars[i].dateRounded - 1238;
    }
    for (let i = 0; i < monthlyCountrySwine.length; i++) {
      monthlyCountrySwine[i].dateRoundedRel = monthlyCountrySwine[i].dateRounded - 1312;
    }
    for (let i = 0; i < monthlyCountryEbola.length; i++) {
      monthlyCountryEbola[i].dateRoundedRel = monthlyCountryEbola[i].dateRounded - 1375;
    }
    for (let i = 0; i < monthlyCountryCovid.length; i++) {
      monthlyCountryCovid[i].dateRoundedRel = monthlyCountryCovid[i].dateRounded - 1440;
    }
}

function clearMap(){
  paper.selectAll("#map").remove();
};

function clearCompMap(){
  paper.selectAll("#comp").remove();
};

function clearCompDia(){
  paper.selectAll("#dicomp").remove();
};

function clearDiagramm(){
  paper.selectAll("#dia").remove();
};

function clearDiagrammDeath(){
  paper.selectAll("#diad").remove();
};

function clearNav(){
  paper.selectAll("#nav").remove();
};

function drawCompMapSars(data, month, col) {
  for (i = 0; i < data.length; i++) {
    if (data[i].dateRoundedRel == month) {

      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      let radius = Math.sqrt(data[i].casesMax) / 4
      let pathString = getPathString(0, 90, radius, xPos, paperHeight - yPos);
      paper.path(pathString).attr({
          fill: col,
          opacity: 0.7,
          id: "comp"
      });
    }
    if (data[i].dateRoundedRel == month) {

      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      let radius = Math.sqrt(data[i].deathsMax) / 4
      let pathString = getPathString(0, 90, radius, xPos, paperHeight - yPos);
      paper.path(pathString).attr({
          fill: col,
          opacity: 0.7,
          id: "comp"
      });
    }
  }
}

function drawCompMapSwine(data, month, col) {
  for (i = 0; i < data.length; i++) {
    if (data[i].dateRoundedRel == month) {

      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      let radius = Math.sqrt(data[i].casesMax) / 4
      let pathString = getPathString(90, 180, radius, xPos, paperHeight - yPos);
      paper.path(pathString).attr({
          fill: col,
          opacity: 0.7,
          id: "comp"
      });
    }
    if (data[i].dateRoundedRel == month) {

      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      let radius = Math.sqrt(data[i].deathsMax) / 4
      let pathString = getPathString(90, 180, radius, xPos, paperHeight - yPos);
      paper.path(pathString).attr({
          fill: col,
          opacity: 0.7,
          id: "comp"
      });
    }
  }
}

function drawCompMapEbola(data, month, col) {
  for (i = 0; i < data.length; i++) {

    if (data[i].dateRoundedRel == month) {

      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      let radius = Math.sqrt(data[i].casesMax) / 4
      let pathString = getPathString(180, 270, radius, xPos, paperHeight - yPos);
      paper.path(pathString).attr({
          fill: col,
          opacity: 0.7,
          id: "comp"
      });
    }
    if (data[i].dateRoundedRel == month) {

      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      let radius = Math.sqrt(data[i].deathsMax) / 4
      let pathString = getPathString(180, 270, radius, xPos, paperHeight - yPos);
      paper.path(pathString).attr({
          fill: col,
          opacity: 0.7,
          id: "comp"
      });
    }
  }
}

function drawCompMapCovid(data, month, col) {
  for (i = 0; i < data.length; i++) {

    if (data[i].dateRoundedRel == month) {

      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      let radius = Math.sqrt(data[i].casesMax) / 4
      let pathString = getPathString(270, 0, radius, xPos, paperHeight - yPos);
      paper.path(pathString).attr({
          fill: col,
          opacity: 0.7,
          id: "comp"
      });
    }
    if (data[i].dateRoundedRel == month) {

      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      let radius = Math.sqrt(data[i].deathsMax) / 4
      let pathString = getPathString(270, 0, radius, xPos, paperHeight - yPos);
      paper.path(pathString).attr({
          fill: col,
          opacity: 0.7,
          id: "comp"
      });
    }
  }
}

function drawMap(data, month, col) {
  clearMap();

  for (i = 0; i < data.length; i++) {
    if (data[i].dateRounded == month) {
      //console.log(data[i].longitudeMax, data[i].latitudeMax, data[i].casesMax)
      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      radius = map(areaToRadius(data[i].casesMax), 0, areaToRadius(17000), 1, 30);
      paper.circle(xPos, paperHeight - yPos, radius).attr({
        fill: col,
        opacity: 0.6,
        id: "map"
      });
    }
  }
  for (i = 0; i < data.length; i++) {
    if (data[i].dateRounded == month) {
      //console.log(data[i].longitudeMax, data[i].latitudeMax, data[i].casesMax)
      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      radius = map(areaToRadius(data[i].deathsMax), 0, areaToRadius(17000), 1, 30);
      paper.circle(xPos, paperHeight - yPos, radius).attr({
        fill: col,
        opacity: 1,
        id: "map"
      });
    }
  }
}

function drawDeathMap(data, month, col) {
  clearMap();

  for (i = 0; i < data.length; i++) {
    if (data[i].dateRounded == month) {
      //console.log(data[i].longitudeMax, data[i].latitudeMax, data[i].casesMax)
      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      radius = map(areaToRadius(data[i].deathsMax), 0, areaToRadius(17000), 1, 30);
      paper.circle(xPos, paperHeight - yPos, radius).attr({
        fill: col,
        opacity: 1,
        id: "map"
      });
    }
  }
}

function drawMapOld(data, col) {
  for (i = 0; i < data.length; i++) {
    xPos = map(data[i].longitude, 0 - 180, 180, 0, paperWidth);
    yPos = map(data[i].latitude, 0 - 90, 90, 0, paperHeight);
    radius = map(areaToRadius(data[i].cases), 0, areaToRadius(17000), 1, 30);
    paper.circle(xPos, paperHeight - yPos, radius).attr({
      fill: col,
      id: "map"
    });
  }
}

function areaToRadius(input) {
  return Math.sqrt(input / Math.PI);
}

// Just copy this function to your project and use it like described above.
function cumulateData(data, reduceTo, cumulations) {
  let groupedData = {};

  // group all 'rows' of the original data
  for (let i = 0; i < data.length; i++) {
    let key = data[i][reduceTo[0]];
    for (let j = 1; j < reduceTo.length; j++) {
      key += ',' + data[i][reduceTo[j]];
    }

    if (!groupedData[key]) {
      groupedData[key] = [];
    }

    groupedData[key].push(data[i]);
  }

  // convert values of the object to array
  groupedData = Object.values(groupedData);
  // console.log(groupedData);

  let cumulatedData = [];
  for (let i = 0; i < groupedData.length; i++) {
    // prepare an object for the results
    let result = {};
    // put in the keys and values of reduceTo
    for (let j = 0; j < reduceTo.length; j++) {
      result[reduceTo[j]] = groupedData[i][0][reduceTo[j]];
    }
    // add the counter
    result.count = groupedData[i].length;
    // calculate cumulations
    for (let j = 0; j < cumulations.length; j++) {
      let key = cumulations[j].title;
      if (!key) key = cumulations[j].value + cumulations[j].method;
      // collect values to plain array
      result[key] = groupedData[i].map(x => x[cumulations[j].value]);
      // console.log(result[key])

      if (cumulations[j].method == "Sum") {
        result[key] = result[key].reduce((res, x) => res + x);
      }
      if (cumulations[j].method == "Average") {
        result[key] = result[key].reduce((res, x) => res + x) / result.count;
      }
      if (cumulations[j].method == "Min") {
        result[key] = result[key].reduce((res, x) => (res < x ? res : x));
      }
      if (cumulations[j].method == "Max") {
        result[key] = result[key].reduce((res, x) => (res > x ? res : x));
      }
      if (cumulations[j].method == "Median") {
        result[key] = percentile(result[key], 0.5);
      }
      if (cumulations[j].method == "Percentile") {
        result[key] = percentile(result[key], cumulations[j].p);
      }
    }

    cumulatedData.push(result);
  }

  return cumulatedData;

  function percentile(arr, p) {
    arr.sort();
    let l = arr.length - 1;
    let idx = l * p;
    let frac = idx % 1;
    let val0 = arr[Math.floor(idx)];
    let val1 = arr[Math.ceil(idx)];
    let res = val0 + (val1 - val0) * frac;
    return res;
  }
}