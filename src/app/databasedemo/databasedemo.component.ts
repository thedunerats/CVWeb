import { Component, OnInit } from '@angular/core';
//add our imports from objects / services
import { Fruit } from '../classes/fruit';
import { FruitService } from '../services/fruit.service';
import { Basket } from '../classes/basket';
import { BasketService } from '../services/basket.service';
import { NgForm } from '@angular/forms'; // will use to add fruit
//remember to check the package.json for the proper format when you install something here.
//probably won't need session storage here. Let's ingnore it for now but keep it in mind. 

//FIXME: front end didnt update when new basket was created.
import { DndDropEvent } from "ngx-drag-drop";


@Component({
  selector: 'app-databasedemo',
  templateUrl: './databasedemo.component.html',
  styleUrls: ['./databasedemo.component.css']
})
export class DatabasedemoComponent implements OnInit {

  constructor(private fs:FruitService, private bs:BasketService) { }

  // intialize any necessary values below.
  // TO DO before the next test:
  // write create and delete functions for fruit and baskets
  // lets get those done, get the formatting done and make sure everything works.

  // initialize an empty basket array. to be filled and loaded on init
  baskets:Basket[] = [];
  // initialize an empty array for fruits. Every fruit in this array will
  // contain the same basket ID until it gets reset. (will all happen on init) 
  fruits:Fruit[] = [];

  //array of fruit arrays, organized by basketid
  //this is how we will display them in a structural directive.
  fruitDisplay:Fruit[][] = [];

  fruitOrder:number[] = [];

  //created basket from form, return object
  returnedBasket:Basket[] = null;

  //basket to be passed
  private passedBasket:Basket = new Basket();
  //fruit to be passed
  private passedFruit:Fruit = new Fruit();

  private fruitId:number;

  private dragString:String;
  //create the array that contains the fruit values for the drag and drop
  //maybe do it like a rainbow? eh, we can always rearrange / change it later.
  static fruitPalette: Fruit[] = [];

  private args: String[] = [];
  //draggable array (testing only) and ngx dnd stuff.
  // it might need to be in this format. For that reason, I'm not inclined to alter it.
  draggables = [
    {
      content: "Red Apple",
      effectAllowed: "copy",
      disable: false,
      handle: false,
    },
    {
      content: "Orange Orange",
      effectAllowed: "move",
      disable: false,
      handle: false,
    },
    {
      content: "Yellow Lemon",
      effectAllowed: "link",
      disable: false,
      handle: false
    },
    {
      content: "Green Lime",
      effectAllowed: "move",
      disable: false,
      handle: false,
    },
    {
      content: "Purple Grapes",
      effectAllowed: "move",
      disable: false,
      handle: false,
    }
  ];
  //these are ngx dnd variables.
  public dropzoneEnabled:boolean = true;
  public lastDropEvent:DndDropEvent | null = null;

  private currentDraggableEvent:DragEvent;
  private currentDragEffectMsg:string;


  // perform these functions when the component loads.
  ngOnInit() {
    //get all fruit and baskets.
    // first: get all baskets.
   this.getAllBaskets(); //for now. may change.
    // then for each baskets, extract all the ids. store them in an array afterward.
    // grab the ids from a for loop? or use ngfor?
    console.log(this.baskets); //This is returning an empty array. Might need to do it in the get all baskets function.
    // then, for each basket id, extract all the fruits for that id. 
  }
//FRUITS

//show the fruits in the baskets. we need to property bind it.
//FIXME: need to a toggle object to the array every time a basket gets added
// and delete one every time it gets removed. will need to make those part of the getall, create and delete?
// would probably need to get the index of the one being deleted in order to do it.
// I'll need to print these to the console every time. we will do this on init.
// decided not to do this. Too difficult. Sometimes you have to just ask if there's an easier way to do the same thing.

//maybe I'll write the delay callback here.
 


//add fruit
//might need to do nested arrays for the Fruits.
//we might do an ng switch for it, but the number of cases changes. so not sure.
insertFruit(form:NgForm){
  // data sanitation - FIXME: form data not getting passed in.
  // make sure to update the fruits in real time.

  //get basketid
  this.passedFruit.setBasketid(form.value["basketnumber"]);
  //get species
  console.log(this.passedFruit.basketId); //testing only
  this.passedFruit.setSpecies(form.value["fruitspecies"]);
  //get color
  this.passedFruit.setColor(form.value["fruitcolor"]);
  console.log(this.passedFruit);
//input sanitation
  if (this.passedFruit.basketId != null && this.passedFruit.species != null && this.passedFruit.color != null ){
    this.fs.insertFruit(this.passedFruit).subscribe(

      data => {
        console.log(data);
        alert("Fruit successfully added."); //fruit succesfully added.
        this.getAllBaskets(); //update DOM
    },

      error => {
        error = "Sorry. Something didn't quite work.";
        console.log(error);
        alert("That basket is full. Add to a different one or take a fruit out.");
      }
  
    )
  } else {
    alert("At least one of the fields is empty. Please fill everything out before adding fruit.");
  }
}


getAllFruitsByBasketId(fruitOrder: number[]){
  this.fs.getAllFruitsByBasketId(fruitOrder).subscribe(
      data => {
        this.fruitDisplay = data;
        console.log(this.fruits)
        console.log(this.fruitDisplay);
        // sort array by basket id
      },

      error => {
        error = "Sorry. Something didn't quite work.";
        console.log(error);
      }
  )
}
//Note to self: might be too difficult to enable a click here to display the fruit for the baskets. might just do them on init and 
//update them in real time along with the baskets.
getFruitbyId(id:number){
  this.fs.getFruitById(id).subscribe(
    data => {
      this.passedFruit = data;
      console.log(this.passedFruit)
      //add the call to the fruit service here to delete the form
      //will do it here as opposed to the other function
      if (this.passedFruit.id != 0) {
        this.fs.removeFruit(this.passedFruit).subscribe(
          data => {
            console.log(data);
            console.log("Fruit removed.")
            this.getAllBaskets(); //real time refresh
          },
          error => {
            error = "Oops. The fruit is still here.";
            console.log(error);
            this.getAllBaskets(); //not how I want it to work but this may be the only way.
          }
        )
      } else {
        console.log("Fruit is empty. Fix it.");
      }
    },

    error => {
      error = "Whoops! Couldn't get that fruit!";
      console.log(error);
    }

  )
}

//remove fruit from basket by id
deleteFruit(form:NgForm){
  this.fruitId = form.value["fruitId"];
  this.getFruitbyId(this.fruitId); //get the fruit from DB
 //write something that waits for the fruit to pass in properly.
 //the console log is executing before the async finishes. Need to change that. 
 //CHANGE: everything got moved to get fruit by id function for synchronicity.
}

//BASKETS
  // this should work even if the basket have no fruit in them.
  //local version of get all baskets. will call upon the one listed in the service.
  //NOTE: the data callback might be a keyword. you might need to change it.
  //Remember: the console logs will go to the browser, not vs code (your bot is an exception)
  //FIXME: passing 4 objects (not baskets). values not getting passed to the front end.
  // I might be missing a .subscribe(). not sure. Look into it.
  //UPDATE (1/28/2020): is data obsolete? do with observer instead? that might be it. (angular.io)
  // did I forget to list a provider in data service? nope. taken care of w/ injectable.
  getAllBaskets(){
    this.bs.getAllBaskets().subscribe(
      // this gets called after something gets pulled from the response.
      data => {
        
        // maybe I need an empty object to pass it into that resets every time.
        // let's look into that. (from create event component)
        // search component is good too. did it just pull everything from data?
        // look at both html and ts file.
        //lets look into that.
        this.baskets = data;
        console.log(this.baskets);
        //grabbing and sorting all fruits by basketid. testing to see if it works.
        //going to try turning that function into a callback for testing purposes.

        this.fruitDisplay = []; //wipe this clean every time so it doesnt stack.
        this.fruitOrder = []; //YAY! It worked!

        for(var i = 0; i < this.baskets.length; i++){
          this.fruitOrder.push(this.baskets[i].basketId);
          console.log(this.baskets[i].basketId); //seeing if the order is the same
        }
        //this.quickSort(this.fruitOrder,0,this.fruitOrder.length-1); Leave this out. You didn't need it.
        console.log(this.fruitOrder);
        this.getAllFruitsByBasketId(this.fruitOrder);
       
      },

      error =>{
        error = "Sorry. Something didn't quite work.";
        console.log(error);
      } 

    )
  }

  // we can use an NgFor here to do this more than once. (structural directive)
  // we arrange the fruits by basket.
  // we will eventually start outputting messages in the DOM when we interact with the DB.

  //making a new basket
  //Works in real time!
createNewBasket() {
  this.bs.insertBasket().subscribe(
    data => {
      console.log(data);
      // check for a null basket returned, update if its good
      this.returnedBasket = data; // testing to see if it gets updated in real time
      if (this.returnedBasket != null){
        console.log("Success!");
        this.getAllBaskets(); 
        alert("Basket created.");
      } else {
        alert("Woah there, something went wrong. Try again please?");
      }
    },

    error => {
      error = "Too many baskets. Please empty one and delete it first.";
      console.log(error);
      alert("Too many baskets. Please empty one and delete it first."); //This got called when we tested it.
    }
  )
} 

//remove a basket
//I think we may need to pull the basketid from the DOM? yes, you can.
// look into that. may change the input.
removeBasket(id:number,fruitsContained:number){
  this.passedBasket.setId(id); // pass in from the html
  this.passedBasket.setFruitsContained(fruitsContained); 
  console.log(this.passedBasket.basketId + "," + this.passedBasket.fruitsContained); // testing

  this.bs.deleteBasket(this.passedBasket).subscribe(
    //FIXME: the object is not getting passed to back end. figure out why. it's getting info from DOM...
    data => {
      console.log("Basket Removed.");
      console.log(data);
      this.getAllBaskets(); // update in real time
    },
    error => {
      error = "Uh oh. The basket is still here.";
      console.log(error);
    }

  )
}

//styling functions
//these exclusively control the style of the page on the front end.

// drag and drop functions
//these are ngx dnd functions.
onDragStart( event:DragEvent ) {

  this.lastDropEvent = null;

  this.currentDragEffectMsg = "";
  this.currentDraggableEvent = event;
}

onDragged( $event:DragEvent, effect:string ) {

  this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;
}

onDragEnd( event:DragEvent ) {

  this.currentDraggableEvent = event;
  alert("Drag ended!");
}

onDrop(event:DndDropEvent, basketId:number) {

  this.lastDropEvent = event;
  this.dragString = event.data;
  this.args = this.dragString.split(" ");
  alert(`A fruit was passed to ${basketId}`); //testing only. it works!
  //FIXME!
  this.passedFruit.setBasketid(basketId);
  //get species
  this.passedFruit.setSpecies(`${this.args[1]}`);
  //get color
  this.passedFruit.setColor(`${this.args[0]}`);
  alert(`${this.dragString} passed to event handler.`); //whole thing works now. can call the service.
  this.fs.insertFruit(this.passedFruit).subscribe(

    data => {
      console.log(data);
      alert("Fruit successfully added."); //fruit succesfully added.
      this.getAllBaskets(); //update DOM
  },

    error => {
      error = "Sorry. Something didn't quite work.";
      console.log(error);
      alert("That basket is full. Add to a different one or take a fruit out.");
    }

  )
}

//show tutorial overlay
tutorialOn() {
  document.getElementById("overlay").style.height = "100%";
  document.getElementById("tutText0").style.visibility = "visible";
  document.getElementById("tutText1").style.visibility = "visible";
  document.getElementById("tutText2").style.visibility = "visible";
  document.getElementById("tutText3").style.visibility = "visible";
  document.getElementById("tutText4").style.visibility = "visible";
  document.getElementById("tutText5").style.visibility = "visible";
  document.getElementById("tutText6").style.visibility = "visible";
  document.getElementById("tutText7").style.visibility = "visible";
}

//hide tutorial
tutorialOff() {
  document.getElementById("tutText0").style.visibility = "hidden";
  document.getElementById("tutText1").style.visibility = "hidden";
  document.getElementById("tutText2").style.visibility = "hidden";
  document.getElementById("tutText3").style.visibility = "hidden";
  document.getElementById("tutText4").style.visibility = "hidden";
  document.getElementById("tutText5").style.visibility = "hidden";
  document.getElementById("tutText6").style.visibility = "hidden";
  document.getElementById("tutText7").style.visibility = "hidden";
  document.getElementById("overlay").style.height = "0%";
}

// sorting functions to replace the insufficient ascii sorting
//im not sure this is going to work, tbh. I'll leave it as an example.
swap(items, leftIndex, rightIndex){
  var temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}

partition(items, left, right) {
  var pivot   = items[Math.floor((right + left) / 2)], //middle element
      i = left, //left pointer
      j = right; //right pointer
  while (i <= j) {
      while (items[i] < pivot) {
          i++;
      }
      while (items[j] > pivot) {
          j--;
      }
      if (i <= j) {
          this.swap(items, i, j); //sawpping two elements
          i++;
          j--;
      }
  }
  return i;
}

quickSort(items, left, right) {
  var index;
  if (items.length > 1) {
      index = this.partition(items, left, right); //index returned from partition
      if (left < index - 1) { //more elements on the left side of the pivot
          this.quickSort(items, left, index - 1);
      }
      if (index < right) { //more elements on the right side of the pivot
          this.quickSort(items, index, right);
      }
  }
}

}