//has all the shit we tried for date calculating
//and other functions just messy flyin around
const paper = Snap("#svgContainer");
const paperWidth = window.innerWidth;
const paperHeight = window.innerHeight;
var i, j = 0;
var xPos, yPos, radius = 0;


let dataCombined = [dataSars, dataSwine, dataEbola, dataCovid];
let colors = ['#4e878c','#1C7293','#2B2D42','#BBDBB4' ];
let uiRects = [];


for (let i = 0; i < 4; i++) {
  let r = paper.rect(0,(paperHeight/4) * i, paperWidth,paperHeight/4).attr({
    opacity:0
  });

  r.hover(
    function(e) {
      console.log('hoverIn', i);
      r.attr({opacity: 0.01});
      clearAll();
      drawMap(dataCombined[i], colors[i]);
    },
    function(e) {
      console.log('hoverOut', i);
      r.attr({opacity: 0});
    },
  );
  uiRects.push(r);
}

// var sumCountryMonat
// for (var i = 0; i < dataSars.length; i++) {
//   if dataSars[i].iso
//   if monat = x
//   let math.max(cases)
// }
// if(main[i].date.substr(main[i].date.length - 1) == year


//createMonthlyTotals();

function clearAll(){
  paper.selectAll("#all").remove();
};

/*function createMonthlyTotals() {
  //let ebola_totals=[];


  for (var i = 0; i < dataSars.length; i++) {
    let d = Date.parse(dataSars[i].date);
    d = new Date(d);
    let m = d.getMonth();
    let y = d.getYear();
    dataSars[i].dateRounded = y * 12 + m;
  }

  let test = cumulateData(dataSars, ['dateRounded'], [{value:'cases', method:'Sum'}, {value:'deaths', method:'Sum'}]);
  //console.log(test)

 //var maximumDate = new Date(Math.max.apply(null, dataEbola));
 //console.log(maximumDate);
 //var minimumDate = new Date(Math.min.apply(null, dataEbola));

 let earliestSars = Number.MAX_VALUE;
 let earliestEntry = null;

 let latestSars = -Number.MAX_VALUE;
 let latestEntry = null;

 for (var i = 0; i < dataSars.length; i++) {
   let d = Date.parse(dataSars[i].date);
   if (d < earliestSars) {
     earliestSars = d;
     earliestEntry = dataSars[i];
   }
   if (d > latestSars) {
     latestSars = d;
     latestEntry = dataSars[i];
   }
 }

 console.log(earliestSars);
 console.log(earliestEntry);

 console.log(latestSars);
 console.log(latestEntry);


  earliestSars = dataSars.reduce(function (pre, cur) {
      let d = Date.parse(cur.date);
      return pre > d ? d : pre;
  }, Number.MAX_VALUE);



  earliestEbola = dataEbola.reduce(function (pre, cur) {
      return Date.parse(pre) < Date.parse(cur) ? cur : pre;
  }); //console.log(earliestEbola);

  earliestCovid = dataCovid.reduce(function (pre, cur) {
      return Date.parse(pre) < Date.parse(cur) ? cur : pre;
  }); //console.log(earliestCovid);

  earliestSars = dataSwine.reduce(function (pre, cur) {
      return Date.parse(pre) < Date.parse(cur) ? cur : pre;
  }); //console.log(earliestSars);

//wann war erster Ebola-Fall?
//wann war letzter Ebola-Fall?

  //for-Schleife um Ebola-Daten
    //für jedes Land ein neues Object anlegen
    // {countryCode: "AUT",
    //monthlyCases:[
    //{year: ..,
    //month: ...}]
}*/

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
