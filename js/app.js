'use strict';
//Modify the charts.js bar chart to include padding on the left for a y-axis label
Chart.types.Bar.extend({
  name: 'barAlt',
  draw: function(){
    Chart.types.Bar.prototype.draw.apply(this, arguments);
        this.scale.xScalePaddingLeft = 75;
        var ctx = this.chart.ctx;
        ctx.save();
        // text alignment and color
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = this.options.scaleFontColor;
        // position
        var x = this.scale.xScalePaddingLeft * 0.4;
        var y = this.chart.height / 2;
        // change origin
        ctx.translate(x, y)
        // rotate text
        ctx.rotate(-90 * Math.PI / 180);
        ctx.fillText(app.labelYAxis, 0, 0);
        ctx.restore();
  }
})

//initial DOM setup
var optionDisplay = document.getElementById('optionDisplay');
var getResults = document.getElementById('getResults');
var chartDisplay = document.getElementById('chartDisplay');

//initial images array setup
var imageConstructorArray = [];
imageConstructorArray[0] = ['bag', 'img/bag.jpg'];
imageConstructorArray[1] = ['banana', 'img/banana.jpg'];
imageConstructorArray[2] = ['boots', 'img/boots.jpg'];
imageConstructorArray[3] = ['chair', 'img/chair.jpg'];
imageConstructorArray[4] = ['cthulhu', 'img/cthulhu.jpg'];
imageConstructorArray[5] = ['dragon', 'img/dragon.jpg'];
imageConstructorArray[6] = ['pen', 'img/pen.jpg'];
// imageConstructorArray[7] = ['scissors', 'img/scissors.jpg'];
// imageConstructorArray[8] = ['shark', 'img/shark.jpg'];
// imageConstructorArray[9] = ['sweep', 'img/sweep.jpg'];
// imageConstructorArray[10] = ['unicorn', 'img/unicorn.jpg'];
// imageConstructorArray[11] = ['usb', 'img/usb.gif'];
// imageConstructorArray[12] = ['water-can', 'img/water-can.jpg'];
// imageConstructorArray[13] = ['wine-glass', 'img/wine-glass.jpg'];
console.log('image constructor array is:');
console.table(imageConstructorArray);

//image object constructor
function imageChoice(name, source){
  this.name = name;
  this.source = source;
  this.winsNo = 0;
  this.displayedNo = 0;
  this.lostTo = {};
  this.wonVs = {};
  this.winPercent;
  this.tiedWith = {};
  this.priceList = [];
  this.getWinPercent = function(){
    this.winPercent = this.winsNo / this.displayedNo;
    return this.winPercent;
  }
}


var app = {
  counter: 0,
  chartTitle: 'Object wins as a percentage of times displayed',
  labelYAxis: '',
  thisChart: '',
  canvas: '',
  context: '',
  thesholdForResults: 3,
  imageArray: [],
  dataToPlot: {},
  allImgObjects: {},
  displayedObjects: [],
  imageRecordObjects: ['wonVs', 'lostTo', 'tiedWith'],
  storageArray: [],
  mainBarGraphOptions: {scaleLabel: "<%=value%>"},

  //builds the initial board state
  initialize: function(){
    app.counter = 0;
    app.allImgObjects = {};
    //iterate through and build all the image objects
    for (var i = 0; i < imageConstructorArray.length; i++){
      var newImageObj = new imageChoice(imageConstructorArray[i][0], imageConstructorArray[i][1]);
      //populate the subobjects in each image object
      for (var key in newImageObj){
        if (newImageObj[key] instanceof Object && !(newImageObj[key] instanceof Array)){
          for (var j = 0; j < imageConstructorArray.length; j++){
            newImageObj[key][imageConstructorArray[j][0]] = 0;
          }
        }
      }
      //put them into the collector array and object
      app.allImgObjects[imageConstructorArray[i][0]] = newImageObj;
      app.imageArray.push(imageConstructorArray[i][0]);
    }
    //draw the intial state
    app.displayAll();
  },

  //updates displayedObjects
  getRandomImages: function(){
    app.displayedObjects = [];
    while (app.displayedObjects.length < 3){
      var indexChoice = Math.floor(Math.random()*app.imageArray.length);
      var objectChoice = app.allImgObjects[app.imageArray[indexChoice]];
      if (app.displayedObjects.indexOf(objectChoice) === -1) {
        objectChoice.displayedNo++;
        app.displayedObjects.push(objectChoice);
      }
    }
  },

  //gets the objects to display and loops through to display them
  displayAll: function(){
    app.getRandomImages();
    for (var i = 0; i < app.displayedObjects.length; i++){
      app.display(app.displayedObjects[i]);
    }
  },

  //draws the images to click on
  display: function(imageObj){
    var optionContainerEl = document.createElement('div');
    optionContainerEl.className = 'four columns optionContainer';
    optionDisplay.appendChild(optionContainerEl);

    var productImage = document.createElement('img');
    productImage.className = 'productImage';
    productImage.id = imageObj.name;
    productImage.src = imageObj.source;
    optionContainerEl.appendChild(productImage);

    var productName = document.createElement('h3');
    productName.className = 'productName';
    productName.textContent = imageObj.name;
    optionContainerEl.appendChild(productName);
  },

  //clears the board and redraws it
  redraw: function(){
    optionDisplay.innerHTML = '';
    app.displayAll();
  },

  //determines which object was clicked, updates the data, and redraws the board
  onClick: function(event){
    app.counter++;
    if (app.counter > app.thesholdForResults) {
      getResults.className = 'clickableGetResults twelve columns';
    }
    var chosen = event.target.id;
    app.updateResults(chosen);
    app.redraw();
  },

  //update the results of each of the objects in displayedObjects on click
  updateResults(chosenId){
    for (var i = 0; i < app.displayedObjects.length; i++){
      if (app.displayedObjects[i].name === chosenId){
        app.displayedObjects[i].winsNo++;
        for (var j = 0; j < app.displayedObjects.length; j++){
          if (j !== i){
            var loserName = app.displayedObjects[j].name;
            app.allImgObjects[chosenId].wonVs[loserName]++;
            app.allImgObjects[loserName].lostTo[chosenId]++;
          }
        }
      } else {
        for (var j = 0; j < app.displayedObjects.length; j++){
          if (j !== i && app.displayedObjects[j].name !== chosenId){
            var tiedName = app.displayedObjects[j].name;
            app.displayedObjects[i].tiedWith[tiedName]++;
          }
        }
      }
    }
  },

  //process the results into a usable format
  getResults: function(plotToMake){
    //reset storage
    app.storageArray = [];
    //sort app.imageArray by win percent
    app.imageArray.sort(function(a,b){
      return app.allImgObjects[b].getWinPercent() - app.allImgObjects[a].getWinPercent()
    })
    //iterate through image array and create an array to store the date from each one
    for (var i = 0; i < app.imageArray.length; i++){
      var thisImageObj = app.allImgObjects[app.imageArray[i]];
      var thisStorageArrayEntry = [];
      //console.dir(thisImageObj);
      thisStorageArrayEntry.push(thisImageObj.name);
      thisStorageArrayEntry.push(thisImageObj.winPercent);
      thisStorageArrayEntry.push(thisImageObj.winsNo);
      thisStorageArrayEntry.push(thisImageObj.displayedNo);
      //one of these for each image object that contains its record against each other object
      var thisRecordList = [];
      // iterate through the entries in the subobjects
      for (var j = 0; j < app.imageArray.length; j++){
        //one of these for each object
        var thisRecordListEntry = [];
        //add object name
        thisRecordListEntry.push(app.imageArray[j]);
        //iterate through thisImageObj's record lists
        for (var k = 0; k < app.imageRecordObjects.length; k++){
          //grab the list object wonVs, lostTo, tiedWith
          var thisListObject = thisImageObj[app.imageRecordObjects[k]];
          //update the recordListEntry for object j with the no. of wins, losses, ties
          thisRecordListEntry.push(thisListObject[app.imageArray[j]]);
        }
        thisRecordList.push(thisRecordListEntry);
      }
      //update the lists
      thisStorageArrayEntry.push(thisRecordList);
      app.storageArray.push(thisStorageArrayEntry);
    }
    console.log(app.storageArray);
    app.makeCharts(plotToMake);
    app.drawForm();
  },

  drawChartLabel: function(){
    var chartTitleEl = document.createElement('h5');
    chartTitleEl.className = 'twelve columns';
    chartTitleEl.textContent = app.chartTitle;
    chartDisplay.appendChild(chartTitleEl);
  },

  drawForm: function(){
    console.log('drawForm broken');

    //build the form
    // var objectForm = document.createElement('form');
    // objectForm.id = 'objectForm';
    // chartDisplay.appendChild(objectForm);
    // //build the menu
    // var selectOption = document.createElement('input');
    // selectOption.name = 'selectOption';
    // selectOption.type = 'radio';
    // selectOption.value = 'Summary';
    // objectForm.appendChild('selectOption');
    //
    // for (var i = 0; i < app.imageArray.length; i++) {
    //   selectOption = document.createElement('input');
    //   selectOption.type = 'radio';
    //   selectOption.name = 'selectOption';
    //   selectOption.value = app.imageArray[i];
    //   objectForm.appendChild('selectOption');
    // }
    //
    // var submitButton = document.createElement('input');
    // submitButton.type = 'submit';
    // submitButton.value = 'Generate plot';
    // objectForm.appendChild(submitButton);
    //
    //
    // objectForm = document.getElementById('objectForm');
    // objectForm.addEventListener('submit', function(event){
    //   console.log('the event target selectForm value is:');
    //   console.log(event.target.selectOption.value);
    //   app.getResults(event.target.selectOption.value);
    // })
  },

  //draws the chart onto the page
  makeCharts: function(plotToMake){
    //build my canvas element
    chartDisplay.innerHTML = '';
    app.canvas = document.createElement('canvas');
    app.canvas.id = 'dataPlot';
    app.canvas.width = '960';
    app.canvas.height = '300';
    chartDisplay.appendChild(app.canvas);
    app.context = app.canvas.getContext('2d');

    if(!plotToMake || plotToMake === 'Summary') {
      app.chartTitle ='Object wins as a percentage of times displayed';
      app.drawChartLabel();
      app.labelYAxis = 'win percent';
      //process the data and build the chart
      app.processDataForMainBarGraph();
      console.dir(app.dataToPlot);
      var mainBarChart = new Chart(app.context).barAlt(app.dataToPlot, app.mainBarGraphOptions);
      app.thisChart = mainBarChart;
    } else if (plotToMake){
      console.log(plotToMake)
      app.chartTitle = 'Breakdown of record for ' + plotToMake;
      app.labelYAxis = 'Number of times'
      app.drawChartLabel();
      app.processDataForObjectBarGraph(plotToMake);
      var productBarChart = new Chart(app.context).barAlt(app.dataToPlot, app.mainBarGraphOptions);
      app.thisChart = productBarChart;
    }
  },

  removeDuplicatesInStorage: function(){
    for (var i = 0; i < app.storageArray.length; i++){
      app.storageArray[i][4].splice(i, 1);
    }
    console.log(app.storageArray);
  },

  processDataForMainBarGraph: function (){
    app.removeDuplicatesInStorage();
    var newDataToPlot = {
      labels: [],
      datasets: []
    }
    var barChartPercentWins = [];
    for (var i = 0; i < app.storageArray.length; i++){
      newDataToPlot.labels.push(app.storageArray[i][0]);
      barChartPercentWins.push(+(app.storageArray[i][1]).toFixed(3));
    }
    var mainBarChartDataSet = new app.barChartDataSet(['Win percent', 'rgba(220,220,220,0.5)', 'rgba(220,220,220,0.8)', 'rgba(220,220,220,0.75)', 'rgba(220,220,220,1)', barChartPercentWins]);
    newDataToPlot.datasets.push(mainBarChartDataSet);
    app.dataToPlot = newDataToPlot;
  },

  //process the data to make a bar graph for an individual product
  processDataForObjectBarGraph(objectToPlot){
    console.log('inside object to plot');
    console.log(objectToPlot);
    app.removeDuplicatesInStorage();
    var newDataToPlot = {
      labels: [],
      datasets: []
    }
    var wins = [];
    var losses =[];
    var ties = [];
    for ( var i = 0; i < app.imageArray.length; i++){
      if (app.storageArray[i][0]  === objectToPlot){
        var thisRecordList = app.storageArray[i];
      }
    }
    var thisRecordList = thisRecordList[4];
    for (var i = 0; i < thisRecordList.length; i++){
      newDataToPlot['labels'].push(thisRecordList[i][0]);
      wins.push(thisRecordList[i][1]);
      losses.push(thisRecordList[i][2]);
      ties.push(thisRecordList[i][3]);
    }
    newDataToPlot.datasets.push(new app.barChartDataSet(['wins', 'rgba(0,220, 0, .5)', 'rgba(0,220, 0, .5)', 'rgba(0,220, 0, .5)', 'rgba(0,220, 0, .5)', wins]));
    newDataToPlot.datasets.push(new app.barChartDataSet(['losses', 'rgba(220,0, 0, .5)', 'rgba(220,0, 0, .5)', 'rgba(220,0, 0, .5)', 'rgba(220,0, 0, .5)', losses]));
    newDataToPlot.datasets.push(new app.barChartDataSet(['wins', 'rgba(0,0, 220, .5)', 'rgba(0,0, 220, .5)', 'rgba(0,0, 220, .5)', 'rgba(0,0, 220, .5)', ties]));
    app.dataToPlot = newDataToPlot;
  },

  barChartDataSet: function(arrayInput) {
    this.label = arrayInput[0];
    this.fillColor = arrayInput[1];
    this.strokeColor = arrayInput[2];
    this.highlightFill = arrayInput[3];
    this.highlightStroke = arrayInput[4];
    this.data = arrayInput[5];
  }

}



//set up initial board
app.initialize();

//event handlers
optionDisplay.addEventListener('click', app.onClick);
getResults.addEventListener('click', function(){
  app.getResults();
})

//
// //app object
// app = {
//   counter: 0,
//   allImgObjects: [],
//   displayedObjects: [],
//   imageKey: {},
//   initialize: function(){
//     app.counter = 0;
//     app.allImgObjects = [];
//     app.imageKey = {}; //this contains properties named after the objects that contain the index of each object in allImgObjects
//     for(var i = 0; i < imageConstructorArray.length; i++){
//       var newImageObj = new imageChoice(imageConstructorArray[i][0], imageConstructorArray[i][1]);
//       app.imageKey[newImageObj.name] = i;
//       for (var key in newImageObj){
//         if (newImageObj[key] instanceof Array){
//           for (var j = 0; j < imageConstructorArray.length; j++){
//             newImageObj[key].push(0);
//           }
//         }
//       }
//       app.allImgObjects.push(newImageObj);
//
//     }
//     console.log('app.allImgObjects is:');
//     console.log(app.allImgObjects);
//     console.log('app.imageKey is:');
//     console.dir(app.imageKey);
//     app.redraw();
//   },
//
//   onClick: function(e){
//     app.counter++;
//     var chosen = e.target.id;
//     for (var i = 0; i < app.displayedObjects.length; i++){
//       if (app.displayedObjects[i].name === chosen){
//         //up its number of wins
//         app.displayedObjects[i].winsNo++;
//         //update the wins number and the loss number
//         for (var j = 0; j < app.displayedObjects.length; j++){
//           if (j !== i){
//             app.displayedObjects[i].wonVs[app.imageKey[app.displayedObjects[j].name]]++;
//             app.displayedObjects[j].lostTo[app.imageKey[chosen]]++;
//           }
//         }
//       } else {
//         for (var j = 0; j  < app.displayedObjects.length; j++){
//           if (j !== i && app.displayedObjects[j].name !== chosen){
//             app.displayedObjects[i].tiedWith[app.imageKey[app.displayedObjects[j].name]]++;
//           }
//         }
//       }
//     }
//     app.redraw();
//   },
//
//   redraw: function(){
//     app.displayedObjects = [];
//     optionDisplay.innerHTML = '';
//     app.displayAll(app.chooseImages());
//   },
//
//   displayAll: function(indicesToChoose){
//     for (var i = 0; i < indicesToChoose.length; i++){
//       app.allImgObjects[indicesToChoose[i]].displayedNo++;
//       app.displayedObjects.push(app.allImgObjects[indicesToChoose[i]])
//       app.display(app.allImgObjects[indicesToChoose[i]]);
//     }
//     console.log('app.displayedObjects is');
//     console.log(app.displayedObjects);
//   },
//
//   display: function(imageObj){
//     var optionContainerEl = document.createElement('div');
//     optionContainerEl.className = 'four columns optionContainer';
//     optionDisplay.appendChild(optionContainerEl);
//
//     var productImage = document.createElement('img');
//     productImage.className = 'productImage';
//     productImage.id = imageObj.name;
//     productImage.src = imageObj.source;
//     optionContainerEl.appendChild(productImage);
//
//     var productName = document.createElement('h3');
//     productName.className = 'productName';
//     productName.textContent = imageObj.name;
//     optionContainerEl.appendChild(productName);
//
//   },
//
//   chooseImages: function(){
//     var indicesToChoose = [];
//     while (indicesToChoose.length < 3){
//       var indexChoice = Math.floor(Math.random()*app.allImgObjects.length);
//       if (indicesToChoose.indexOf(indexChoice) === -1) {
//         indicesToChoose.push(indexChoice);
//       }
//     }
//     return indicesToChoose;
//   },
//
//   processResults: function(){
//     //sort the objects by most to least wins
//     app.allImgObjects.sort(function( a, b){
//       return  b.getWinPercent() - a.getWinPercent();
//     })
//     //update the numbers in imageKey
//     for (var i = 0; i < app.allImgObjects.lenth; i++){
//       app.imageKey[app.allImgObjects[i].name] = i;
//     }
//   },
//
//   summarizeResults: function(){
//     if(app.counter > 14){
//       for (var i = 0; i < app.allImgObjects.length; i++){
//         console.log('name ');
//         console.log(app.allImgObjects[i].name);
//         console.log(app.allImgObjects[i].getWinPercent());
//         console.log('displayedNo ');
//         console.log( app.allImgObjects[i].displayedNo);
//         console.log('winsNo ');
//         console.log( app.allImgObjects[i].winsNo);
//         console.log('wonVs ');
//         console.log(app.allImgObjects[i].wonVs);
//         console.log('lostTo ' );
//         console.log(app.allImgObjects[i].lostTo);
//         console.log('tiedWith ' );
//         console.log(app.allImgObjects[i].tiedWith);
//       }
//     }
//   }
//
// }
// //set up
// app.initialize();
//
// //event handlers
// optionDisplay.addEventListener('click', app.onClick);
// getResults.addEventListener('click', function(){
//   app.processResults();
//   app.summarizeResults();
// })
