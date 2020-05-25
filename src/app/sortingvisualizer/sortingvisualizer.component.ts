import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sortingvisualizer',
  templateUrl: './sortingvisualizer.component.html',
  styleUrls: ['./sortingvisualizer.component.css']
})
export class SortingvisualizerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.fillArray();
  }

  //need a function to change the color of an element as the algorith works
  // will probably do this with some kind of wait callback.
  // should probably write bubblesort or something simple first and then try to
  // make the visualizer work for that. Then move on to the other ones.
  //Should probably fill the array on init.

  //Initialized data:
  pageArray: number[] = [];
  colorArray: string[] = [];

  //functions we need:
  //sorting algorithms
  //functions to highlight the columns
  //randomizer

  //Util functions
  fillArray(){
    for(let i = 0; i < 39; i++){ //array of size 40
      this.pageArray.push(Math.round(Math.random() * 40)); //add a random number between 0 and 40
      this.colorArray.push("black"); //ensures same size as pageArray
    }
    console.log(this.pageArray);
    console.log(this.colorArray);
  }

  randomizeArray(){// BE CAREFUL: you may need to reset color array here every time.
    //generates a new array
    this.pageArray = [];
    this.colorArray = [];
    for(let i = 0; i < 39; i++){ //array of size 40
      this.pageArray.push(Math.round(Math.random() * 40)); //add a random number between 0 and 40
      this.colorArray.push("black");
    }
    /* randomizes an already existing array
    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
      
    }*/
  }

  sleep(milliseconds) { //custom synchronous delay method
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  //need to make everything black by the end of the loop? color first, then delay.
  // might even consider making the shade function async and calling sleep inside it.
  shade(id: number, color: string){
    //let index = id.toString();
    this.colorArray[id] = color;
    //console.log(index);//testing
  }

  //SORTING FUNCTIONS
  //bubblesort
  //FIXME: flipping colors on and off in inner loop isn't perfect. There's a few rogue changes 
  //in addition to the expected ones. 
  //It rogue colors the later ones while it goes through the earlier ones.
  // It happens during the swap. there's an extra delay for some reason.
  // recognizes a swap, then swaps and the rogue one gets colored.
  //the rogue one might be the same height as the larger one that
  // so basically: it happens during a swap if there's a duplicate value?
  // evene the console cant tell me why this is happening.
  //the columns at hand also get uncolored during the swap and the duplicate gets colored?
  // that's REALLY weird. The one that gets swapped toward the right gets uncolored and it's nearest duplicate
  // gets colored? I need to find another way to do that.
  // the larger one swaps but it loses its color. I'll see if I can try this a different way.
  // I could try making the ID more complicated...dunno if that would work.
  // ^ That did not work. It's not related to the ID. Has to be the duplicated height...
  // It happens during the swap itself. I took the first shade out and it's still happening.
  // It might even have to do with the oder of the swap. Maybe I should color the ones that's not
  // being reassigned first?
  // A better approach might be to use another array to govern the color, then change that array 
  // in the typescript? We have to try it.
  //FIXED: instead of document.getelementbyid, we used an array to hold the ngstyle string property.
 async bubbleSort(array: number[]){

    for(let i = 0; i < array.length; i++) {
        for(let j = 0; j < array.length - 1; j++) {

          this.shade(j,"blue"); //color to indicate iteration
          this.shade(j+1, "blue");
          await this.sleep(10);

            if(array[j] > array[j + 1]) {

                this.shade(j+1,"red"); //swap made
                this.shade(j, "red");
                
                let swap = array[j];
                array[j] = array[j + 1];
                array[j + 1] = swap;

                await this.sleep(10);

            }
          
          this.shade(j,"black"); //continue iterating
          this.shade(j+1, "black");
        }
    }
    console.log(this.pageArray);
  }

  //InsertionSort
  //if a larger element is on the left side of the larger one, it moves the larger element up the index
  //REMEMBER: if you want to test your algorithm, run you test sort at the end, not at the beginning. 
  // It will interfere with the thread working on the sort.
  // ONLY INCLUDE things you need timed in an aysnc function. Leave everything else outside.
  // I guess that's why they say embrace javascript's asynchronous nature. 
async insertionSort(arr:number[]){

  if(arr!==undefined){
    for(let i:number = 0; i < arr.length; i++){ // for length of arr
  
    let j = i-1;
    let key = arr[i];
    
    this.shade(i,"yellow"); //setting key / pivot value
    await this.sleep(10);  
    // this value will be saved until the end when it gets put in the right place.

    while(j>-1 && arr[j]>key){ //doesn't start if j = -1, which is true in the first cycle of the loop
       this.shade(j,"red"); // coloring value to be moved
       await this.sleep(10);

       arr[j+1] = arr[j]; //moves until element is smaller than the key value
       this.shade(j,"black"); // uncoloring current column after move value to be moved
       await this.sleep(10);
       j--;
    }

    this.shade(i,"black");
    arr[j+1] = key; //reassignment of key value to the current column
    await this.sleep(10);
    }
  }
}

  //QUICKSORT
  //swapping function
  async swap(items: number[], leftIndex: number, rightIndex: number){
    this.shade(leftIndex,"red"); //highlighting the swap
    this.shade(rightIndex,"red");
    await this.sleep(25);
    
    var temp = items[leftIndex]; //perform the actual swap
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;

    this.shade(leftIndex,"black"); //undoing the swap coloration
    this.shade(rightIndex,"black");
    await this.sleep(10);
  }
  
  async partition(items: number[], left: number, right: number) {
    var pivot = items[Math.floor((right + left) / 2)], //middle element
        i = left, //left pointer
        j = right; //right pointer. both of these are arbitrary? check.
    while (i <= j) {
        while (items[i] < pivot) {
            this.shade(i,"blue");
            await this.sleep(25); //iterate through

            this.shade(i,"black");
            await this.sleep(10); //iterate through
            i++;
        }
        while (items[j] > pivot) {
          this.shade(j,"blue");
          await this.sleep(25); //iterate through

          this.shade(j,"black");
          await this.sleep(10); //iterate through
            j--;
        }
        if (i <= j) {

            await this.swap(items, i, j); //swapping two elements
            i++;
            j--;
        }
    }
    console.log(i);
    return i;
  }
  //you need the 3 inputs to do this recursively
  async quickSort(items: number[], left: number, right: number) { //left and right are the upper and lower bounds of the items array
    let index;
    if (items.length > 1) {
        index = await this.partition(items, left, right); //index returned from partition (as a promise)
        console.log(index);
        //await Promise.all([]) //FIXME: need quicksort calls inside
        if (left < index - 1) { //more elements on the left side of the pivot
            await this.quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            await this.quickSort(items, index, right);
        }
    }
  }
}
