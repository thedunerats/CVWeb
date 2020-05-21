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

  //functions we need:
  //sorting algorithms
  //functions to highlight the columns
  //randomizer

  //Util functions
  fillArray(){
    for(let i = 0; i < 39; i++){ //array of size 40
      this.pageArray.push(Math.round(Math.random() * 40)); //add a random number between 0 and 40
    }
    console.log(this.pageArray);
  }

  randomizeArray(array: number[]){
    //generates a new array
    this.pageArray = [];
    for(let i = 0; i < 39; i++){ //array of size 40
      this.pageArray.push(Math.round(Math.random() * 40)); //add a random number between 0 and 40
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

  //SORTING FUNCTIONS
  //bubblesort
 async bubbleSort(array: number[]){

    for(let i = 0; i < array.length; i++) {
        for(let j = 0; j < array.length - 1; j++) {

            if(array[j] > array[j + 1]) {
                let swap = array[j];
                array[j] = array[j + 1];
                await this.sleep(50);
                array[j + 1] = swap;
            }
        }
    }
    console.log(this.pageArray);
  }

  //InsertionSort
  //if a larger element is on the left side of the larger one, it moves the larger element up the index
  insertionSort(arr:number[]){
  if(arr!==undefined){
    for(let i:number = 0; i < arr.length; i++){ // for length of arr
 
     let j = i-1;
     let key = arr[i];
 
     while(j>-1 && arr[j]>key){
       arr[j+1] = arr[j];
       j--; 
      }
 
     arr[j+1] = key;
 
      }
    }
    console.log(this.pageArray);
  }

  //QUICKSORT
  //swapping function
  swap(items: number[], leftIndex: number, rightIndex: number){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
  }
  
  partition(items: number[], left: number, right: number): number {
    var pivot = items[Math.floor((right + left) / 2)], //middle element
        i = left, //left pointer
        j = right; //right pointer. both of these are arbitrary? check.
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            this.swap(items, i, j); //swapping two elements
            i++;
            j--;
        }
    }
    return i;
  }
  //you need the 3 inputs to do this recursively
  quickSort(items: number[], left: number, right: number) { //left and right are the upper and lower bounds of the items array
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
