import { Component, OnInit } from '@angular/core';
//add our imports from objects / services
import { Fruit } from '../classes/fruit';
import { FruitService } from '../services/fruit.service';
import { Basket } from '../classes/basket';
import { BasketService } from '../services/basket.service';
import { NgForm } from '@angular/forms'; // will use to add fruit
//probably won't need session storage here. Let's ingnore it for now but keep it in mind. 

//FIXME: front end didnt update when new basket was created.

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

  clicked:boolean = false;

  // initialize an empty basket array. to be filled and loaded on init
  baskets:Basket[] = [];
  // initialize an empty array for fruits. Every fruit in this array will
  // contain the same basket ID until it gets reset. (will all happen on init) 
  fruits:Fruit[] = [];

  //created basket from form, return object
  returnedBasket:Basket[] = null;

  //basket to be passed
  private passedBasket:Basket = new Basket();
  //fruit to be passed
  private passedFruit:Fruit = new Fruit();

  // perform these functions when the component loads.
  ngOnInit() {
    //get all fruit and baskets.
    // first: get all baskets.
   this.getAllBaskets(); //for now. may change.
    // then for each baskets, extract all the ids. store them in an array afterward.
    // grab the ids from a for loop? or use ngfor?

    // then, for each basket id, extract all the fruits for that id. 
  }
//FRUITS

//show the fruits in the baskets. we need to property bind it.
showFruits(){
 // let containedFruits = document.getElementById(id.toString());

  this.clicked = !this.clicked;
}

getAllFruitsByBasketId(id: number){
  this.fs.getAllFruitsByBasketId(id).subscribe(
      data => {
        this.fruits = data;
        console.log(this.fruits)
        console.log(data);
      },

      error => {
        error = "Sorry. Something didn't quite work.";
        console.log(error);
      }
  )
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
        console.log(data); 
        console.log(this.baskets);

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

}