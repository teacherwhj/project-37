var  dog,  database, foodS, foodStock;
var happyDog, dogImage;
var feedPet,addFood;
var fedTime, lastFed;
var foodObj;

var changeGameState, readGameState;

var bedroomImg, gardenImg, washroomImg;
function preload()
{
	dogImage=loadImage("images/dogimg.png");
  happyDog=loadImage("images/dogimg1.png");

  bedroomImg=loadImage("virtual pet images/Bed Room.png");
  gardenImg= loadImage("virtual pet images/Garden.png");
  washroomImg= loadImage("virtual pet images/Wash Room.png");
}

function setup() {
	createCanvas(1000, 500);
  database= firebase.database();

  foodObj = new Food();

  var foodStock=database.ref("Food");
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readGameState= database.ref("gameState");
  readGameState.on("value",function(data){
    changeGameState= data.val();
  });

  dog = createSprite(800,300,20,20);
  dog.addImage(dogImage);
  dog.scale=0.2;
  
 

  feedPet=createButton("Feed the dog");
  feedPet.position(700,95);
  feedPet.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  

  
  currentTime=hour();
  

  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
  } else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
  

  //foodObj.display();

  

 
  

   if(changeGameState!=='Hungry'){
    feedPet.hide();
    addFood.hide();
    dog.remove();
   }
   else{
    feedPet.show();
    addFood.show();
    dog.addImage(dogImage);
   }
  

  drawSprites();
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 

}
function readStock(data){

  foodS=data.val();
  foodObj.updateFoodStock(foodS);



}
function feedDog(){
  dog.addImage(happyDog);
  
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
      foodObj.updateFoodStock(food_stock_val *0);
  }else{
      foodObj.updateFoodStock(food_stock_val -1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  console.log(state)
  database.ref('/').update({
    gameState:state
   
  });
}