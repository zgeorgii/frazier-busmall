'use strict';
//initial DOM setup
var optionDisplay = document.getElementById('optionDisplay');
var getResults = document.getElementById('getResults');
var chartDisplay = document.getElementById('chartDisplay');

//initial images array setup
var imageConstructorArray = [];
imageConstructorArray[0] = ['bag', 'img/bag.jpg'];
imageConstructorArray[1] = ['banana', 'img/banana.jpg'];
imageConstructorArray[2] = ['boots', 'img/boots.jpg'];
imageConstructorArray[3] = ['cthulhu', 'img/cthulhu.jpg'];
imageConstructorArray[4] = ['dragon', 'img/dragon.jpg'];
imageConstructorArray[5] = ['pen', 'img/pen.jpg'];
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
  canvas: '',
  context: '',
  thesholdForResults: 3,
  imageArray: [],
  dataToPlot: {},
  allImgObjects: {},
  displayedObjects: [],
  imageRecordObjects: ['wonVs', 'lostTo', 'tiedWith'],
  storageArray: [],

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
  getResults: function(){
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
    app.makeCharts();
  },

  makeCharts: function(){
    //build my canvas element
    chartDisplay.innerHTML = '';
    app.canvas = document.createElement('canvas');
    app.canvas.id = 'dataPlot';
    app.canvas.className = 'twelve columns';
    chartDisplay.appendChild(app.canvas);
    app.context = app.canvas.getContext('2d');

    //process the data and build the chart
    app.processDataForMainBarGraph();
    console.dir(app.dataToPlot);
    var mainBarChart = new Chart(app.context).Bar(app.dataToPlot, app.mainBarGraphOptions);
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
    var mainBarChartDataSet = new app.barChartDataSet(['Win percents', 'rgba(220,220,220,0.5)', 'rgba(220,220,220,0.8)', 'rgba(220,220,220,0.75)', 'rgba(220,220,220,1)', barChartPercentWins]);
    newDataToPlot.datasets.push(mainBarChartDataSet);
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
