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

//add a method to be able to get element's widths
Element.prototype.getElementWidth = function() {
	   if (typeof this.clip !== "undefined") {
	      return this.clip.width;
	   } else {
	      if (this.style.pixelWidth) {
	         return this.style.pixelWidth;
	      } else {
	         return this.offsetWidth;
	      }
	   }
	};

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
  canvasWidth: '960',
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
  thisChart: '',

  //builds the initial board state
  initialize: function(){
    //rest stuff
    app.counter = 0;
    app.allImgObjects = {};
    //event handlers
    optionDisplay.addEventListener('click', app.onClick);
    getResults.addEventListener('click', function(){
      getResults.textContent = 'Get Results';
      app.getResults();
    })
    window.addEventListener('resize', function(){
      console.log('resize event');
      app.onResize();
    });
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
    app.onResize();
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
    var chosenId = event.target.id;
    app.updateResults(chosenId);
    app.redraw();
  },

  onResize: function(){
    var containerWidth = document.getElementById('container');
    containerWidth = containerWidth.getElementWidth();
    console.log('container width is ' + containerWidth);
    if (containerWidth < 960){
      app.canvasWidth = containerWidth.toString();
      console.log('app.canvasWidth is ' + app.canvasWidth);
    }
    // } else if (+app.canvasWidth < windowWidth){
    //   app.canvasWidth = windowWidth.toString();
    // }
    if (app.thisChart){
      app.thisChart.update();
    }
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
  },

  //draw the plot title
  drawChartLabel: function(){
    var chartDisplay = document.getElementById('chartDisplay');
    var chartTitleEl = document.createElement('h5');
    chartTitleEl.className = 'twelve columns chartTitle';
    chartTitleEl.textContent = app.chartTitle;
    chartDisplay.insertBefore(chartTitleEl, chartDisplay.firstChild);
  },

  drawReminderText: function(){
    console.log('drawReminderText called');
    //build the form
    var reminderText = document.getElementById('reminderText');
    reminderText.innerHTML = '';
    reminderText.className = 'twelve columns';
    var reminderPara = document.createElement('p');
    reminderPara.className = 'reminderPara';
    reminderPara.textContent = "Click a bar to learn more about that product's ranking.";
    reminderText.appendChild(reminderPara);
  },

  //draws the chart onto the page
  makeCharts: function(plotToMake){
    //build my canvas element
    chartDisplay.innerHTML = '';
    app.canvas = document.createElement('canvas');
    app.canvas.id = 'dataPlot';
    app.canvas.width = app.canvasWidth;
    app.canvas.height = '300';
    chartDisplay.appendChild(app.canvas);
    app.context = app.canvas.getContext('2d');
    //draw the summary plot
    if(!plotToMake) {
      app.chartTitle ='Object wins as a percentage of times displayed';
      app.drawChartLabel();
      app.labelYAxis = 'win percent';
      //process the data and build the chart
      app.processDataForMainBarGraph();
      console.dir(app.dataToPlot);
      var mainBarChart = new Chart(app.context).barAlt(app.dataToPlot, app.mainBarGraphOptions);
      app.thisChart = mainBarChart;
    //draw a plot for an individual object
    } else if (plotToMake){
      getResults.textContent = 'Back to summary plot';
      console.log(plotToMake)
      app.chartTitle = 'Breakdown of record for ' + plotToMake;
      app.labelYAxis = 'Number of times'
      app.drawChartLabel();
      app.processDataForObjectBarGraph(plotToMake);
      var productBarChart = new Chart(app.context).barAlt(app.dataToPlot, app.mainBarGraphOptions);
      app.thisChart = productBarChart;
    }
    //redraw the reminder text at the bottom
    app.drawReminderText();
    //readd the even listener to the canvas
    app.canvas.addEventListener('click', function(e){
      // console.dir(e);
      // console.log('canvas event listener');
      var clickedBar  = app.thisChart.getBarsAtEvent(e)
      // console.log(clickedBar[0]);
      // console.log(typeof clickedBar[0]);
      // console.log(clickedBar[0]['label']);
      app.getResults(clickedBar[0]['label']);
    })
  },

  //fixes the stored data so that their win, loss, and tie record don't include a blank entry for matches against themselves
  removeDuplicatesInStorage: function(){
    for (var i = 0; i < app.storageArray.length; i++){
      app.storageArray[i][4].splice(i, 1);
    }
    console.log(app.storageArray);
  },

  //format data for the summary chart
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

  //format data for an individual object's chart
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
