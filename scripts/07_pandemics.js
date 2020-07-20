const paper = Snap("#svgContainer");
const paperWidth = window.innerWidth;
const paperHeight = window.innerHeight;
let i, j = 0;
let xPos, yPos, radius = 0;

let dataCombined = [dataSars, dataSwine, dataEbola, dataCovid];
let colors = ['#4e878c','#1C7293','#2B2D42','#BBDBB4' ];
let uiScopeCircle = [];
let uiHoverRect = [];
let monthlySars = [];
let monthlySwine = [];
let monthlyEbola = [];
let monthlyCovid = [];
let monthlyCountrySars;

init();

function init(){
   calculateMonths();
   createNav();
   navHover();
}



function navHover(){
//creates hover elements over navigation bar
  //Sars
  for (let i = 0; i < 5; i++) {
    let r = paper.rect((paperWidth/39)*(i+1.5),800,paperWidth/39, paperHeight).attr({
      opacity:0
    });
    r.hover(
      function(e) {
        //console.log('hoverIn', i);
        r.attr({opacity: 0.02});
        // clearAll();
        // drawMap(dataCombined[i], colors[i]);
      },
      function(e) {
        //console.log('hoverOut', i);
        r.attr({opacity: 0});
      },
    );
    uiHoverRect.push(r);
  }
  //Swine
  for (let i = 0; i < 3; i++) {
    let r = paper.rect((paperWidth/39)*(i+7.5),800,paperWidth/39, paperHeight).attr({
      opacity:0
    });
    r.hover(
      function(e) {
        //console.log('hoverIn', i);
        r.attr({opacity: 0.02});
        // clearAll();
        // drawMap(dataCombined[i], colors[i]);
      },
      function(e) {
        //console.log('hoverOut', i);
        r.attr({opacity: 0});
      },
    );
    uiHoverRect.push(r);
  }
  //Ebola
  for (let i = 0; i < 18; i++) {
    let r = paper.rect((paperWidth/39)*(i+11.5),800,paperWidth/39, paperHeight).attr({
      opacity:0
    });
    r.hover(
      function(e) {
        //console.log('hoverIn', i);
        r.attr({opacity: 0.02});
        // clearAll();
        // drawMap(dataCombined[i], colors[i]);
      },
      function(e) {
        //console.log('hoverOut', i);
        r.attr({opacity: 0});
      },
    );
    uiHoverRect.push(r);
  }
  //Covid
  for (let i = 0; i < 5; i++) {
    let r = paper.rect((paperWidth/39)*(i+30.5),800,paperWidth/39, paperHeight).attr({
      opacity:0
    });
    r.hover(
      function(e) {
        //console.log('hoverIn', i);
        r.attr({opacity: 0.02});
        // clearAll();
        // drawMap(dataCombined[i], colors[i]);
      },
      function(e) {
        //console.log('hoverOut', i);
        r.attr({opacity: 0});
      },
    );
    uiHoverRect.push(r);
  }
}



function createNav(){
  //navigation Sars
  for (let i = 0; i < 5; i++) {
    radius = map(areaToRadius(monthlySars[i].casesMax), 10, areaToRadius(10000), 1, 10);
    let c = paper.circle((paperWidth/39)*(i+2),paperHeight - 90, radius).attr({
    //  let c = paper.circle(50+(paperWidth/80+radius)*i,paperHeight - 90, radius).attr({
      opacity:0.7,
      fill:'#4e878c'
    })
    let cc = paper.circle((paperWidth/39)*(i+2),paperHeight - 90, 2).attr({
      opacity:1,
      fill:'#EBEBEB'
    })
    c.node.onclick = function () {
      for (let j = 0; j < uiScopeCircle.length; j++) {
        uiScopeCircle[j].attr("opacity", 0.2);
      }
      //console.log(i);
      drawMap(monthlyCountrySars, monthlySars[i].dateRounded, colors[0]);
      //c.attr("fill", "red");
      c.attr("opacity", 0.9);
    };
    uiScopeCircle.push(c)
  }
  //navigation Swine
  for (let i = 0; i < 3; i++) {
    radius = map(areaToRadius(monthlySwine[i].casesMax), 10, areaToRadius(10000), 1, 10);
    let c = paper.circle((paperWidth/39)*(i+8),paperHeight - 90, radius).attr({
    //  let c = paper.circle(250+(paperWidth/80+radius)*i,paperHeight - 90, radius).attr({
      opacity:0.7,
      fill: '#1C7293'
    })
    let cc = paper.circle((paperWidth/39)*(i+8),paperHeight - 90, 2).attr({
      opacity:1,
      fill:'#EBEBEB'
    })
    uiScopeCircle.push(c)
  }


  //navigation Ebola
  for (let i = 0; i < 18; i++) {
    radius = map(areaToRadius(monthlyEbola[i].casesMax), 10, areaToRadius(10000), 1, 10);
    let c = paper.circle((paperWidth/39)*(i+12),paperHeight - 90, radius).attr({
    //  let c = paper.circle(425+(paperWidth/100+radius)*i,paperHeight - 90, radius).attr({
      opacity:0.7,
      fill: '#2B2D42'
    })
    let cc = paper.circle((paperWidth/39)*(i+12),paperHeight - 90, 2).attr({
      opacity:1,
      fill:'#EBEBEB'
    })
    uiScopeCircle.push(c)
  }


  //navigation Covid
  for (let i = 0; i < 5; i++) {
    radius = map(areaToRadius(monthlyCovid[i].casesMax), 10, areaToRadius(10000), 1, 10);
    let c = paper.circle((paperWidth/39)*(i+31),paperHeight - 90, radius).attr({
    //  let c = paper.circle(1000+(paperWidth/10)*i,paperHeight - 90, radius).attr({
        opacity:0.5,
      fill:'#BBDBB4'
    })
    let cc = paper.circle((paperWidth/39)*(i+31),paperHeight - 90, 2).attr({
      opacity:1,
      fill:'red'
    })
    uiScopeCircle.push(c)
  }
}

// for-Schleife um Ebola-Daten
//   für jedes Land ein neues Object anlegen
//   {countryCode: "AUT",
//   monthlyCases:[
//   {year: ..,
//   month: ...}]
// }

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


    //calculate monthly peaks of cases
    monthlySars = cumulateData(dataSars,['dateRounded'], [{value:'cases', method:'Max'}]);
    monthlyCountrySars = cumulateData(dataSars,['dateRounded', 'country'], [{value:'cases', method:'Max'}, {value:'longitude', method:'Max'}, {value:'latitude', method:'Max'}]);

    monthlySwine = cumulateData(dataSwine,['dateRounded'], [{value:'cases', method:'Max'}]);
    monthlyEbola = cumulateData(dataEbola,['dateRounded'], [{value:'cases', method:'Max'}]);
    monthlyCovid = cumulateData(dataCovid,['dateRounded'], [{value:'cases', method:'Max'}]);

}

function clearAll(){
  paper.selectAll("#all").remove();
};

function drawMap(data, month, col) {
  clearAll();
  //console.log('drawMap', month, col)
  for (i = 0; i < data.length; i++) {
    if (data[i].dateRounded == month) {
      //console.log(data[i].longitudeMax, data[i].latitudeMax, data[i].casesMax)
      xPos = map(data[i].longitudeMax, 0 - 180, 180, 0, paperWidth);
      yPos = map(data[i].latitudeMax, 0 - 90, 90, 0, paperHeight);
      radius = map(areaToRadius(data[i].casesMax), 0, areaToRadius(17000), 1, 30);
      paper.circle(xPos, paperHeight - yPos, radius).attr({
        fill: col,
        id: "all"
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
      id: "all"
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
