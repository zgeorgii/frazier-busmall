//initial DOM setup
var optionDisplay = document.getElementById('optionDisplay');


//initial images array setup
var images = [];
images[0] = ['bag', 'img/bag.jpg'];
images[1] = ['banana', 'img/banana.jpg'];
images[2] = ['boots', 'img/boots.jpg'];
images[3] = ['chair', 'img/chair.jpg'];
console.log(images);

//image object constructor
function imageChoice(name, source){
  this.name = name;
  this.source = source;
  this.winsNo = 0;
  this.displayedNo = 0;
  this.lostTo = [];
}


//app object
app = {
  counter: 0,
  allImgObjects: [],
  choiceObjects: [],

  initialize: function(){
    counter: 0;
    allImgObjects = [];
    choiceObjects = [];
    for(var i = 0; i < images.length; i++){
      var newImageObj = new imageChoice(images[i][0], images[i][1]);
      app.allImgObjects.push(newImageObj);
    }
    console.log(app.allImgObjects);
    app.displayAll(app.chooseImages());
  },

  onClick: function(e){
    console.log(e);
    console.log(e.target);
  },

  displayAll: function(indicesToChoose){
    for (var i = 0; i < indicesToChoose.length; i++){
      app.display(app.allImgObjects[indicesToChoose[i]]);
    }
  },

  display: function(imageObj){
    var optionContainerEl = document.createElement('div');
    optionContainerEl.className = 'four columns optionContainer';
    optionDisplay.appendChild(optionContainerEl);

    var productImage = document.createElement('img');
    productImage.className = 'productImage';
    productImage.src = imageObj.source;
    optionContainerEl.appendChild(productImage);

    var productName = document.createElement('h3');
    productName.textContent = imageObj.name;
    optionContainerEl.appendChild(productName);

  },

  chooseImages: function(){
    var indicesToChoose = [];
    while (indicesToChoose.length < 3){
      indexChoice = Math.floor(Math.random()*app.allImgObjects.length);
      if (indicesToChoose.indexOf(indexChoice) === -1) {
        indicesToChoose.push(indexChoice);
      }
    }
    return indicesToChoose;
  }

}

app.initialize();


//event handlers
optionDisplay.addEventListener('click', app.onClick);
