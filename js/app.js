//initial DOM setup
var optionDisplay = document.getElementById('optionDisplay');
var getResults = document.getElementById('getResults');

//initial images array setup
var imageConstructorArray = [];
imageConstructorArray[0] = ['bag', 'img/bag.jpg'];
imageConstructorArray[1] = ['banana', 'img/banana.jpg'];
imageConstructorArray[2] = ['boots', 'img/boots.jpg'];
imageConstructorArray[3] = ['cthulhu', 'img/cthulhu.jpg'];
imageConstructorArray[4] = ['dragon', 'img/dragon.jpg'];
imageConstructorArray[5] = ['pen', 'img/pen.jpg'];
console.log('image constructor array is:');
console.log(imageConstructorArray);

//image object constructor
function imageChoice(name, source){
  this.name = name;
  this.source = source;
  this.winsNo = 0;
  this.displayedNo = 0;
  this.lostTo = {};
  this.wonVs = {};
  this.tiedWith = {};
  this.priceList = [];
  this.getWinPercent = function(){
    return this.winsNo / this.displayedNo;
  }
}


app = {
  counter: 0,
  imageArray: [],
  allImgObjects: {},
  displayedObjects: [],

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
    if (app.counter > 15) {
      getResults.className = 'clickableGetResults twelve columns';
    }
    var chosen = event.target.id;
    // update the wins number and tiedWith, lostTo, and winVs lists
    for (var i = 0; i < app.displayedObjects.length; i++){
      if (app.displayedObjects[i].name === chosen){
        app.displayedObjects[i].winsNo++;
        for (var j = 0; j < app.displayedObjects.length; j++){
          if (j !== i){
            var loserName = app.displayedObjects[j].name;
            app.allImgObjects[chosen].wonVs[loserName]++;
            app.allImgObjects[loserName].lostTo[chosen]++;
          }
        }
      } else {
        for (var j = 0; j < app.displayedObjects.length; j++){
          if (j !== i && app.displayedObjects.name !== chosen){
            tiedName = app.displayedObjects[j].name;
            app.displayedObjects[i].tiedWith[tiedName]++;
          }
        }
      }
    }
    app.redraw();
  },

  getResults: function(){
    console.log('before sort:');
    console.log(app.imageArray);
    app.imageArray.sort(function(a,b){
      console.log(a);
      console.log(app.allImgObjects[a].getWinPercent());

      app.allImgObjects[b].getWinPercent() - app.allImgObjects[a].getWinPercent()
    })
    console.log('after sort');
    console.log(app.imageArray);
    for (var i = 0; i < app.imageArray.length; i++){
      console.dir(app.allImgObjects[app.imageArray[i]])
    }

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
