import { Component, OnInit, ɵConsole } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sortingvisualizer',
  templateUrl: './sortingvisualizer.component.html',
  styleUrls: ['./sortingvisualizer.component.css']
})
export class SortingvisualizerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.loadSmallScreenFormat();
    if (this.isSmallScreen){
      this.fillArray(50);
      this.inputLength = 50;
    } else {
      this.fillArray(100);
      this.inputLength = 100;
    }
  }

  //need a function to change the color of an element as the algorith works
  // will probably do this with some kind of wait callback.
  // should probably write bubblesort or something simple first and then try to
  // make the visualizer work for that. Then move on to the other ones.
  //Should probably fill the array on init.

  //Initialized data:
  pageArray: number[] = [];
  colorArray: string[] = [];

  //temp for mergesort
  temp: number[] = [];

  //test array for comparison
  testArray: number[] = [];

  //speed multiplier for sorting speed
  sortingRate: number;

  inputLength: number;

  //smallScreen Boolean
  isSmallScreen: boolean;

  //status screen for column width rendering
  columnWidthFlag: string;

  //functions we need:
  //sorting algorithms
  //functions to highlight the columns
  //randomizer

  //Util functions
  fillArray(inputLength: number){
    for(let i = 0; i < inputLength; i++){ //array of size 40
      this.pageArray.push(Math.round(Math.random() * (inputLength + 1))); //add a random number between 0 and 39
      this.colorArray.push("white"); //ensures same size as pageArray
    }
    for(let w = 0; w < this.pageArray.length; w++){
      this.testArray.push(this.pageArray[w]);
    }
    this.testArray.sort(function(a, b){return a - b}); //create a comparison for testing
    //NOTE: the above callback is necessary to compensate for ASCII sorting.

    this.setColumnWidth(this.pageArray.length);

    console.log(this.pageArray);
    console.log(this.colorArray);
    console.log(this.columnWidthFlag);
  }

  randomizeArray(inputLength: number){// BE CAREFUL: you may need to reset color array here every time.
    //generates a new array
    this.pageArray = [];
    this.colorArray = [];
    this.testArray = [];
    this.temp = []; //resetting merge sort
    this.fillArray(inputLength);
    /* randomizes an already existing array
    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
      
    }*/
  }

  //change the length of the array that displays on the screen
  changeInputLength(form:NgForm){
    if(form.value["newSize"] < 20 || form.value["newSize"] > 400){ //check for too large or too small input
      alert("That's not good input. try between 20 and 400.")
    } else {
      if (this.isSmallScreen){
        if (form.value["newSize"] >= 20 && form.value["newSize"] <= 50) { //checking for a small screen
          this.inputLength = form.value["newSize"];
          this.randomizeArray(this.inputLength);
        } else {
          alert("Try a value between 20 and 50.");
        }
      } else {
          this.inputLength = form.value["newSize"];
          this.randomizeArray(this.inputLength);
        }
    }
  }

  //depending on array size, render ngTemplates with this flag
  setColumnWidth(arrLength: number){
    if(arrLength <= 50){
      this.columnWidthFlag = "SMALL";
    }
    if(arrLength > 50 && arrLength <= 150){
      this.columnWidthFlag = "MEDIUM";
    }
    if(arrLength > 150 && arrLength <= 250){
      this.columnWidthFlag = "LARGE";
    }
    if(arrLength > 250){
      this.columnWidthFlag = "XLARGE";
    }
  }


  sleep(milliseconds) { //custom synchronous delay method
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  //need to make everything white by the end of the loop? color first, then delay.
  // might even consider making the shade function async and calling sleep inside it.
  shade(id: number, color: string){
    //let index = id.toString();
    this.colorArray[id] = color;
    //console.log(index);//testing
  }

  getWidthAndHeight(): number{ //print width and height of screen
    const width  = window.innerWidth || document.documentElement.clientWidth || 
    document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight|| 
    document.body.clientHeight;
    return width; //checking for screen width as determining factor
  }

  loadSmallScreenFormat(){ //check for a small screen
    if (this.getWidthAndHeight() < 700) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
    console.log("SMALL SCREEN:" + this.isSmallScreen);
  }

  //submission of Algorithm Form
  chooseAlgo(form:NgForm){
    switch(form.value["sortAlgo"]){
      case "bubbleSort":
        this.bubbleSort(this.pageArray);
        break;
      case "selectionSort":
        this.selectionSort(this.pageArray);
        break;
      case "insertionSort":
        this.insertionSort(this.pageArray);
        break;
      case "shellSort":
        this.shellSort(this.pageArray);
        break;
      case "quickSort":
        this.quickSort(this.pageArray,0,this.pageArray.length-1);
        break;
      case "mergeSort":
        this.mergeSort(this.pageArray,this.temp,0,this.pageArray.length-1);
        break;
      case "heapSort":
        this.heapSort(this.pageArray);
        break;
      case "radixSortLSD":
        this.radixSortLSD(this.pageArray);
        break;
      default:
        alert("Not in form yet");
        break;
    }
  }

  //adjust the sorting rate
  //NOTE: you didn't need to write a function for it. ngModel did it for you.


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
          
          this.shade(j,"white"); //continue iterating
          this.shade(j+1, "white");
        }
    }
    console.log(this.pageArray);
  }

  //SelectionSort
  //finds smallest value and moves it to position i in loop
  // arr[i] swaps with arr[0] if arr[i] < arr[0]
  async selectionSort(arr){
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let min = i;
             

        for (let j = i + 1; j < len; j++) {
            if (arr[min] > arr[j]) {
                min = j;
            }
        }
        if (min !== i) {

            this.shade(i,"red");
            this.shade(min,"red"); //swap arr[i] and arr[min]
            let tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
            await this.sleep(50);

            this.shade(i,"white"); //unshade swap
            this.shade(min,"white");
            await this.sleep(10);
        }

    }
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
       this.shade(j,"white"); // uncoloring current column after move value to be moved
       await this.sleep(10);
       j--;
    }

    this.shade(i,"white");
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
    await this.sleep(30);
    
    var temp = items[leftIndex]; //perform the actual swap
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;

    this.shade(leftIndex,"white"); //undoing the swap coloration
    this.shade(rightIndex,"white");
    await this.sleep(5);
  }
  
  async partition(items: number[], left: number, right: number) {
    var pivot = items[Math.floor((right + left) / 2)], //middle element
        i = left, //left pointer
        j = right; //right pointer. both of these are arbitrary? check.

        this.shade(pivot,"yellow"); //shade the pivot value
        await this.sleep(10);
    while (i <= j) {
        while (items[i] < pivot) {
            //this.shade(i,"blue");
            //await this.sleep(25); //iterate through

            //this.shade(i,"white");
            //await this.sleep(10); //iterate through
            i++;
        }
        while (items[j] > pivot) {
          //this.shade(j,"blue");
          //await this.sleep(25); //iterate through

          //this.shade(j,"white");
          //await this.sleep(10); //iterate through
            j--;
        }
        if (i <= j) {

            await this.swap(items, i, j); //swapping two elements
            i++;
            j--;
        }
    }
    this.shade(pivot,"white"); //unshade pivot
    await this.sleep(10);

    console.log(i);
    return i;
  }
  //you need the 3 inputs to do this recursively
  async quickSort(items: number[], left: number, right: number) { //left and right are the upper and lower bounds of the items array

    let index;
    if (items.length > 1) {
        index = await this.partition(items, left, right); //index returned from partition (as a promise)
        if (left < index - 1) { //more elements on the left side of the pivot
            
            await this.quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
          
            await this.quickSort(items, index, right);
        }
    }
  }

// Merge Sort Implentation (Recursion)
//FIXME: add a comparison at the end to reset temp when the whole thing finishes.
//ned a sorted array to compare it to.
 /**
   * Recursively sorts and calls merge.
   *
   * @method mergeSort
   * @param {Array} arr The array to be sorted.
   * @param {Array} temp The temporary array.
   * @param {Number} left The left index of the array.
   * @param {Number} right The right index of the array.
   */
  async mergeSort(arr: number[], temp: number[], left: number, right: number){

    if (left < right) {  // divide array if there is more than 2 elements
      let center: number = Math.floor((left + right) / 2);
      //shade center
      this.shade(center,"yellow");
      await this.sleep(15);

      await this.mergeSort(arr, temp, left, center); //division of left side
      await this.mergeSort(arr, temp, center + 1, right); //division of right side
      await this.merge(arr, temp, left, center + 1, right); //merging of the newly formed pairs
      //unshade center
      this.shade(center,"white");
      await this.sleep(10);
    }

  }

  /**
   * This method contains the logic to implement the merge step.
   *
   * @method merge
   * @param {Array} arr The array to be sorted.
   * @param {Array} temp The temporary array.
   * @param {Number} left The left index of the array.
   * @param {Number} right The first index of the right-divided array. 
   * @param {Number} rightEnd The right most index of the array.     */
  async merge(arr: number[], temp: number[], left: number, right: number, rightEnd: number){

    let leftEnd: number = right - 1; //right end of the left-divided array
    let k: number = left;

    while (left <= leftEnd && right <= rightEnd) {
      if (arr[left] <= arr[right]) {
        this.shade(k,"red"); //testing
        await this.sleep(10);
        temp[k++] = arr[left++];
      } else {
        this.shade(k,"red"); //testing
        await this.sleep(10);
        temp[k++] = arr[right++]
      }
      this.shade(k-1,"white"); //testing
      await this.sleep(2);
    }

    while (left <= leftEnd) {
      temp[k++] = arr[left++];
    }

    while (right <= rightEnd) {
      temp[k++] = arr[right++];
    }

    //re-add values from temp in ascending order
    for (let i: number = 0; i < temp.length; i++) {
      arr[i] = temp[i];
      await this.sleep(5);
    }

    /*alternate implementation of the above in descending order:
        for (let i: number = 0; i < temp.length; i++, rightEnd--) {
      arr[rightEnd] = temp[rightEnd];
    }
    */
  }

  //Heapsort
  // create max heap
  //heapifies the array and puts larget element at top
  async heapSort(array: number[]) {
    let size = array.length;
  
    // build heapSort (rearrange array)
    for (let i = Math.floor(size / 2 - 1); i >= 0; i--){
      await this.heapify(array, size, i);
    }
    // one by one extract an element from heapSort
    for (let i = size - 1; i >= 0; i--) {
      // move current root to end
      await this.swap(array,0,i);
  
      // call max heapify on the reduced heapSort
      await this.heapify(array, i, 0);
    }
  }
  
  // to heapify a subtree rooted with node i which is an index in array[]
  async heapify(array, size, i) {
    let max = i; // initialize max as root
    let left = (2 * i) + 1;
    let right = (2 * i) + 2;
  
    // if left child is larger than root
    if (left < size && array[left] > array[max]){
      max = left;
    }  
    // if right child is larger than max
    if (right < size && array[right] > array[max]){
      max = right;
    }
    // if max is not root
    if (max != i) {
      // swap i and max
      await this.swap(array,i,max);

      // recursively heapify the affected sub-tree
      await this.heapify(array, size, max)
    }
  }

  async shellSort(arr: number[]) {
      let increment = arr.length / 2;  //increment between swaps
      while (increment > 0) {
          for (let i = increment; i < arr.length; i++) {
              var j = i;
              var temp = arr[i];
      
              while (j >= increment && arr[j-increment] > temp) {
                  this.shade(j,"red"); //shade pre-swap
                  this.shade(j-increment,"red");
                  await this.sleep(10);

                  arr[j] = arr[j-increment];

                  this.shade(j,"white"); //unshade post-swap
                  this.shade(j-increment,"white");
                  await this.sleep(10);
                  j = j - increment;

              }
      
              arr[j] = temp;
          }
      
          if (increment == 2) {
              increment = 1; //knock from 2 to 1
          } else {
              increment = Math.floor(increment*5 / 11); //shrink increment
          }
      }
  }
  
  async radixSortLSD(arr: number[]) {
    let idx1, idx2, idx3, len1, len2, radix, radixKey;
    let radices = {}, buckets = {}, curr;
    let currLen, currBucket;

    len1 = arr.length;
    len2 = 10;  // radix sort uses ten buckets

    // find the relevant radices to process for efficiency        
    for (idx1 = 0;idx1 < len1;idx1++) {
      radices[arr[idx1].toString().length] = 0;
    }

    // loop for each radix. For each radix we put all the items
    // in buckets, and then pull them out of the buckets.
    for (radix in radices) {          
      // put each array item in a bucket based on its radix value
      len1 = arr.length;
      for (idx1 = 0;idx1 < len1;idx1++) {
        curr = arr[idx1];
        // item length is used to find its current radix value
        currLen = curr.toString().length;
        // only put the item in a radix bucket if the item
        // key is as long as the radix
        if (currLen >= radix) {
          // radix starts from beginning of key, so need to
          // adjust to get redix values from start of stringified key
          radixKey = curr.toString()[currLen - radix];
          // create the bucket if it does not already exist
          if (!buckets.hasOwnProperty(radixKey)) {
            buckets[radixKey] = [];
          }
          // put the array value in the bucket
          buckets[radixKey].push(curr);          
        } else {
          if (!buckets.hasOwnProperty('0')) {
            buckets['0'] = [];
          }
          buckets['0'].push(curr);          
        }
      }
      // for current radix, items are in buckets, now put them
      // back in the array based on their buckets
      // this index moves us through the array as we insert items
      idx1 = 0;
      // go through all the buckets
      for (idx2 = 0;idx2 < len2;idx2++) {
        // only process buckets with items
        if (buckets[idx2] != null) {
          currBucket = buckets[idx2];
          // insert all bucket items into array
          len1 = currBucket.length;
          for (idx3 = 0;idx3 < len1;idx3++) {
            this.shade(idx1,"red"); //shade element
            await this.sleep(30);

            arr[idx1++] = currBucket[idx3]; //idx increments after this command executes

            this.shade(idx1 - 1,"white"); //unshade element after idx1 increases
            await this.sleep(10);
          }
        }
      }
      buckets = {};
    }
  }
}