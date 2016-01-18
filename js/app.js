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
  this.lostTo = [];
  this.wonVs = [];
  this.tiedWith = [];
  this.priceList = [];
}


//app object
app = {
  counter: 0,
  allImgObjects: [],
  displayedObjects: [],
  imageKey: {},
  initialize: function(){
    app.counter = 0;
    app.allImgObjects = [];
    app.imageKey = {}; //this contains properties named after the objects that contain the index of each object in allImgObjects
    for(var i = 0; i < imageConstructorArray.length; i++){
      var newImageObj = new imageChoice(imageConstructorArray[i][0], imageConstructorArray[i][1]);
      app.imageKey[newImageObj.name] = i;
      app.allImgObjects.push(newImageObj);
    }
    console.log('app.allImgObjects is:');
    console.log(app.allImgObjects);
    console.log('app.imageKey is:');
    console.dir(app.imageKey);
    app.redraw();
  },

  onClick: function(e){
    app.counter++;
    var chosen = e.target.id;
    for (var i = 0; i < app.displayedObjects.length; i++){
      if (app.displayedObjects[i].name === chosen){
        //up it's number of wins
        app.displayedObjects[i].winsNo++;
        //update the wins number and the loss number
        for (var j = 0; j < app.displayedObjects.length; j++){
          if (j !== i){
            app.displayedObjects[i].wonVs.push(app.displayedObjects[j].name);
            app.displayedObjects[j].lostTo.push(chosen);
          }
        }
      } else {
        for (var j = 0; j  < app.displayedObjects.length; j++){
          if (j !== i && app.displayedObjects[j].name !== chosen){
            app.displayedObjects[i].tiedWith.push(app.displayedObjects[j].name);
          }
        }
      }
    }
    app.redraw();
  },

  redraw: function(){
    app.displayedObjects = [];
    optionDisplay.innerHTML = '';
    app.displayAll(app.chooseImages());
  },

  displayAll: function(indicesToChoose){
    for (var i = 0; i < indicesToChoose.length; i++){
      app.allImgObjects[indicesToChoose[i]].displayedNo++;
      app.displayedObjects.push(app.allImgObjects[indicesToChoose[i]])
      app.display(app.allImgObjects[indicesToChoose[i]]);
    }
    console.log('app.displayedObjects is');
    console.log(app.displayedObjects);
  },

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

  chooseImages: function(){
    var indicesToChoose = [];
    while (indicesToChoose.length < 3){
      var indexChoice = Math.floor(Math.random()*app.allImgObjects.length);
      if (indicesToChoose.indexOf(indexChoice) === -1) {
        indicesToChoose.push(indexChoice);
      }
    }
    return indicesToChoose;
  },

  processResults: function(){
    for (var i = 0; i < app.allImgObjects.length; i++){


    }
  },

  summarizeResults: function(){
    for (var i = 0; i < app.allImgObjects.length; i++){
      console.log('name ' + app.allImgObjects[i].name);
      console.log('displayedNo ' + app.allImgObjects[i].displayedNo);
      console.log('winsNo ' + app.allImgObjects[i].winsNo);
      console.log('wonVs ' + app.allImgObjects[i].wonVs);
      console.log('lostTo ' + app.allImgObjects[i].lostTo);
      console.log('tiedWith ' + app.allImgObjects[i].tiedWith);
    }
  }

}
//set up
app.initialize();

//event handlers
optionDisplay.addEventListener('click', app.onClick);
getResults.addEventListener('click', app.summarizeResults)
