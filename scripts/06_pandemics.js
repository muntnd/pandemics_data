/*
- navbar appears, not sorted, no colour, no correct gaps
- no map
- months calculated w cumulate
- cant access country name in same array
*/


const paper = Snap("#svgContainer");
const paperWidth = window.innerWidth;
const paperHeight = window.innerHeight;
let i, j = 0;
let xPos, yPos, radius = 0;

let dataCombined = [dataSars, dataSwine, dataEbola, dataCovid];
let colors = ['#4e878c','#1C7293','#2B2D42','#BBDBB4' ];
let uiRects = [];
let monthlyPandemics = [];


init()

function init(){
   calculateMonths();
   createNavigation();
}



function createNavigation(){
  for (let i = 0; i < 31; i++) {
    radius = map(areaToRadius(monthlyPandemics[i].casesMax), 20, areaToRadius(10000), 1, 10);
    let c = paper.circle((paperWidth/31)*i,paperHeight - 50, radius).attr({opacity:0.5})
    uiRects.push(c)
  }
}

//function to show map of each pandemic (cumulated cases) horizontally mapped
// for (let i = 0; i < 31; i++) {
//   let r = paper.rect((paperWidth/31) * i ,0 ,paperWidth/31, paperHeight).attr({
//     opacity:0
//   });
//   r.hover(
//     function(e) {
//       //console.log('hoverIn', i);
//       r.attr({opacity: 0.2});
//       // clearAll();
//       // drawMap(dataCombined[i], colors[i]);
//     },
//     function(e) {
//       //console.log('hoverOut', i);
//       r.attr({opacity: 0});
//     },
//   );
//   uiRects.push(r);
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
    let monthlySwine = cumulateData(dataSwine,['dateRounded'], [{value:'cases', method:'Max'}]);
    let monthlySars = cumulateData(dataSars,['dateRounded'], [{value:'cases', method:'Max'}]);
    let monthlyEbola = cumulateData(dataEbola,['dateRounded'], [{value:'cases', method:'Max'}]);
    let monthlyCovid = cumulateData(dataCovid,['dateRounded'], [{value:'cases', method:'Max'}]);
    console.log(monthlySars)
    monthlyPandemics.push(...monthlySars,...monthlySwine,...monthlyEbola,...monthlyCovid)
}

// function sortPerMonth(){
//   for (var i = 0; i < monthlySars.length; i++) {
//
//   }
// }



// var sumCountryMonat
// for (var i = 0; i < dataSars.length; i++) {
//   if dataSars[i].iso
//   if monat = x
//   let math.max(cases)
// }
//
//
// for (let b = 1970; b < 2019; b++) {
//    for (let j = 0; j < info.length; j++) {
//      if (info[j].iyear == b) {
//        if (info[j].nkill != "") {
//          killyear = killyear + parseFloat(info[j].nkill);
//        }
//        if (info[j].nwound != "") {
//          woundyear = woundyear + parseFloat(info[j].nwound);
//        }
//      }
//    }
// for-Schleife um Ebola-Daten
//   für jedes Land ein neues Object anlegen
//   {countryCode: "AUT",
//   monthlyCases:[
//   {year: ..,
//   month: ...}]
// }


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
