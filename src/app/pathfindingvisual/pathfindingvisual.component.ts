import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-pathfindingvisual',
  templateUrl: './pathfindingvisual.component.html',
  styleUrls: ['./pathfindingvisual.component.css']
})
export class PathfindingvisualComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.fillArray();
    this.colorArray[12][12] = "green"; //set start node
    this.colorArray[12][36] = "red";  //set end node
    this.setStartNode(12,12);
    this.setEndNode(12,36); //the mouseenter and shade functions have
    //the coordinate system backwards and were converted into a cartesian system.
    //I have come to regret this move. NEVER DO THIS! VERY BAD!
    console.log(this.wallBias);
  }

  //initialize variables
  //length and width
  gridLength: number = 50;
  gridWidth: number = 25;

  //grid properties
  visitedArray: boolean[][] = []; //either visited or not visited
  visitedRow: boolean[] = []; //dummy array that serves as an auxiliary for the loading

  colorArray: string[][] = []; //color array for display purposes
  colorRow: string[] = [];

  //previous node array
  prevArray: number[][][] = [];
  prevRow: number[] = [];

  //distance array
  distanceArray: number[][] = [];
  distanceRow: number[] = [];

  //testing Only
  scoreArray: number[][] = [];
  scoreRow: number[] = [];

  //special nodes (ordered pairs)
  startNode: number[] = []; 
  endNode: number[] = [];
  tempVal: number[] = [];

  //finalPath stack
  finalPath: number[][] = [];

  //dragging booleans
  isDragging: boolean = false;
  draggingStartNode: boolean = false;
  draggingEndNode: boolean = false;

  //animated cell array
  visitedCellsToAnimate: number[][] = [];

  //partition queue for maze division
  partitionQueue: number[][] = [];

  //wall bias
  wallBias: string = "NONE";

  //UTIL Functions
  fillArray(){ //call to reset the array back to normal
    for (let i = 0; i < this.gridWidth; i++){
      for(let j = 0; j < this.gridLength; j++){
        this.visitedRow.push(false); //makes a whole array
        this.colorRow.push("white");
        this.prevRow.push(null); //for parent traceback function
        this.distanceRow.push(Infinity);
        this.scoreRow.push(Infinity); //testing
      }
      this.visitedArray.push(this.visitedRow); //pushes and clears entire grid row before next iteration
      this.visitedRow = [];

      this.colorArray.push(this.colorRow); //pushes and clears color row
      this.colorRow = [];

      this.prevArray.push([this.prevRow]); //pushes and clears prev row
      this.prevRow = [];

      this.distanceArray.push(this.distanceRow); //pushes and clears distance row
      this.distanceRow = [];

      this.scoreArray.push(this.distanceRow); //pushes and clears distance row
      this.scoreRow = [];
    }
    console.log(this.visitedArray);
    console.log(this.colorArray);
    console.log(this.prevArray);
    console.log(this.distanceArray);
  }

  //NEED: a function for setting start and end nodes.
  //function to draw border wall
  //NODE UTILS
  setStartNode(yCoord: number, xCoord: number){
    this.startNode = [yCoord,xCoord];
    console.log("Start Node: " + this.startNode);
  }

  setEndNode(yCoord: number, xCoord: number){
    this.endNode = [yCoord,xCoord];
    console.log("End Node: " + this.endNode);
  }

  //sleep function
  sleep(milliseconds: number) { //custom synchronous delay method
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  //change the color of a square
  shade(yCoord: number, xCoord: number, color: string){
    this.colorArray[yCoord][xCoord] = color;
  }

  //animate sets of nodes passed in
  async animateCells(cellsToAnimate: number[][], color: string){ //animate cells passed in
    for(let i = 0; i < cellsToAnimate.length; i++){
      this.shade(cellsToAnimate[i][0],cellsToAnimate[i][1],color);
      await this.sleep(5);
    }
  }

  async animateVisitedAndPath(){
    await this.animateCells(this.visitedCellsToAnimate,"orange");
    await this.animateCells(this.finalPath.reverse(),"yellow"); //trace final path back from end
  }

  //clear board
  resetBoard(){
    //this.visitedArray = []; //clear grid and color arrays first
    //this.colorArray = [];
    //this.fillArray(); //a touch slow, but not a priority to make this faster.
    for (let i = 0; i < this.gridWidth; i++){
      for(let j = 0; j < this.gridLength; j++){
        if(this.isThisAWall([i,j]) || this.colorArray[i][j] !== "white"){ //will need to update to include visited nodes
          this.colorArray[i][j] = "white";
        }
        if(this.visitedArray[i][j] === true){
          this.visitedArray[i][j] = false;
        }
        //this.visitedRow.push(false); //makes a whole array
        //this.colorRow.push("white");
        if(!this.prevArray[i][j] === null){
          this.prevArray[i][j] = null;
        }

        if(this.distanceArray[i][j] !== Infinity){
          this.distanceArray[i][j] = Infinity;
        }
      }
    }
    //this.colorArray[this.startNode[0]][this.startNode[1]] = "white"; //uncolor old start and end nodes
    //this.colorArray[this.endNode[0]][this.endNode[1]] = "white";
    this.colorArray[12][12] = "green"; //set start node
    this.colorArray[12][36] = "red";  //set end node
    this.startNode = [];
    this.endNode = [];
    this.setStartNode(12,12);
    this.setEndNode(12,36);
    this.visitedCellsToAnimate = [];
    this.finalPath = [];
  }

  //clear the path only, leave the walls, start and end nodes
  clearPath(){
    for (let i = 0; i < this.gridWidth; i++){
      for(let j = 0; j < this.gridLength; j++){
        if(this.colorArray[i][j] === "yellow" || this.colorArray[i][j] === "orange"){ //will need to update to include visited nodes
          this.colorArray[i][j] = "white";
        }
        if(this.visitedArray[i][j] === true){
          this.visitedArray[i][j] = false;
        }

        if(!this.prevArray[i][j] === null){
          this.prevArray[i][j] = null;
        }

        if(this.distanceArray[i][j] !== Infinity){
          this.distanceArray[i][j] = Infinity;
        }
      }
    }

    this.visitedCellsToAnimate = [];
    this.finalPath = [];    
  }

  //will probably need an animation util that shades and delays.
  //need mousedown and mouseup functions and what happens to grid cells on both of them
  //set the starting node
  //will also need booleans to indicate that a stating / ending node was clicked instead of a wall.
  downClickFunction(xCoord: number, yCoord: number, boxColor: string){
    //will add different functionalities for different colored web elements.
    //try to drag the grey ones for now.
    //will change the dragging flag back to false on the mouseup. (mouseenter too)
    //for te start and end nodes, we nee to store them in a global temp value until they get changed.
    //and reset the temp value every time.
    //need different booleans for wall creation, start node moing and end node moving.
    this.isDragging = true;

    switch(boxColor){
      case "white": //empty
        this.shade(yCoord, xCoord, "#0B041C");
        break;
      case "#0B041C": //wall
        this.shade(yCoord, xCoord, "white");
        break;
      case "green": //start node
        this.draggingStartNode = true;
        this.tempVal.push(yCoord);
        this.tempVal.push(xCoord);
        break;
      case "red": //end node
        this.draggingEndNode = true;
        this.tempVal.push(yCoord);
        this.tempVal.push(xCoord);
        break;
    }
  }

  //happens only when the coursor enters the web element
  mouseEnterFunction(xCoord: number, yCoord: number, boxColor: string){
    if(this.isDragging){
      switch(boxColor){
        case "white": //empty
          this.shade(yCoord,xCoord,"#0B041C"); 
          break;
        case "#0B041C": //wall
          this.shade(yCoord,xCoord,"white");
          break;
        default:
          break;
      }
    if(this.draggingStartNode){ //moving the start node
      this.shade(this.tempVal[0],this.tempVal[1],"white");
      this.shade(yCoord,xCoord,"green");
      this.tempVal = [];
      this.startNode = []; //refresh start node to reset
      this.tempVal.push(yCoord);
      this.tempVal.push(xCoord);
      this.setStartNode(yCoord,xCoord); //reset start node
      }
    
    if(this.draggingEndNode){ //moving the start node
      this.shade(this.tempVal[0],this.tempVal[1],"white");
      this.shade(yCoord,xCoord,"red");
      this.tempVal = [];
      this.endNode = []; //refresh end node to reset
      this.tempVal.push(yCoord);
      this.tempVal.push(xCoord);
      this.setEndNode(yCoord,xCoord); //reset end node
      }
    }
  }

  mouseUpFunction(){
    this.isDragging = false;
    this.draggingStartNode = false;
    this.draggingEndNode = false;
    this.tempVal = [];
  }

  //pathfinding helper functions
  //is this node visited?
  isThisNodeVisited(currentNode: number[]): boolean{
    if(currentNode === null || currentNode === undefined){
      return true; //technically not visited but don't want in neighnors array
    }
    if (this.visitedArray[currentNode[0]][currentNode[1]] === true){
      return true;
    } else {
      return false;
    }
  }

  //is this node a wall?
  isThisAWall(currentNode: number[]): boolean {
    if(currentNode === null || currentNode === undefined){
      return true; //was false earlier. not sure why.
    }
    if(this.colorArray[currentNode[0]][currentNode[1]] === "#0B041C") {
      return true;
    } else {
      return false;
    }
  }

  isStartNode(currentNode: number[]): boolean{
    if(currentNode[0] === this.startNode[0] && currentNode[1] === this.startNode[1]){
      return true;
    } else {
      return false;
    }
  }

  isEndNode(currentNode: number[]): boolean{
    if(currentNode[0] === this.endNode[0] && currentNode[1] === this.endNode[1]){
      return true;
    } else {
      return false;
    }
  }

  getRandomInt(min: number, max: number): number{
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }

  /*swapArrayValues(nodeSet: number[][]): number[][]{ //do this before putting into values to animate
  for(let n = 0; n < nodeSet.length; n++){
    var temp = nodeSet[n][0];
    nodeSet[n][0] = nodeSet[n][1];
    nodeSet[n][1] = temp;
    }
  return nodeSet;
  }*/ // may not need this. will try to write DFS without it.

  getNeighbors(currentNode: number[]): number[][]{ //FIXME: need to fix to check out of bounds exception.
    //check for walls, eliminate those
    //get neighbor nodes
    let leftNode;
    let upNode;
    let rightNode;
    let downNode;

    //might refactor this to be the length of the table dimensions.
    if(currentNode[1] < this.visitedArray[0].length - 1){ //done to avoid out of bounds error
      rightNode = [currentNode[0], currentNode[1] + 1];
    }
    if(currentNode[0] > 0){
      downNode = [currentNode[0] - 1, currentNode[1]];
    }
    if(currentNode[1] > 0){ //done to avoid out of bounds error
      leftNode = [currentNode[0], currentNode[1] - 1];
    }
    if(currentNode[0] < this.visitedArray.length - 1){ //done to avoid out of bounds error
      upNode = [currentNode[0] + 1, currentNode[1]];
    }

    let neighbors: number[][] = [];
    if(!this.isThisAWall(leftNode) && !this.isThisNodeVisited(leftNode)){ //no wall and not visited.
      neighbors.push(leftNode);
      //console.log("Left Node:" + leftNode);
    }
    if(!this.isThisAWall(upNode) && !this.isThisNodeVisited(upNode)){
      neighbors.push(upNode);
      //console.log("Up Node:" + upNode);
    }
    if(!this.isThisAWall(rightNode) && !this.isThisNodeVisited(rightNode)){
      neighbors.push(rightNode);
      //console.log("Right Node:" + rightNode);
    }
    if(!this.isThisAWall(downNode) && !this.isThisNodeVisited(downNode)){
      neighbors.push(downNode);
      //console.log("Down Node:" + downNode);
    }
    //console.log(neighbors); //testing
    //console.log(neighbors.length);
    //console.log(this.swapArrayValues(neighbors));
    return neighbors;
  }

  //calculate distance from current node to end node with this formula
  //does not consider diagonals, not included here.
  //may try that down the line if it's required in another project.
  distanceRemainingHeuristic(nodeToCheck: number[]): number{
    let remainingY: number;
    let remainingX: number;
    remainingY = Math.abs(this.endNode[0] - nodeToCheck[0]);
    remainingX = Math.abs(this.endNode[1] - nodeToCheck[1]);

    return remainingY + remainingX;
  }

  //wall drawing functions
  //FIXME: avOID START AND END noDES
  async drawWalls(){
    for(let i = 0; i < this.gridWidth; i++){
      this.colorArray[i][0] = "#0B041C";
      await this.sleep(3); //adds a little animation 
      this.colorArray[i][this.gridLength-1] = "#0B041C";
      await this.sleep(3);
    }
    for(let i = 0; i < this.gridLength; i++){
      this.colorArray[0][i] = "#0B041C";
      await this.sleep(3);
      this.colorArray[this.gridWidth-1][i] = "#0B041C";
      await this.sleep(3);
    }
  }

  
  chooseBias(event: any){
    switch(event.target.value){
      case "VERTICAL":
        this.wallBias = "VERTICAL";
        break;
      case "HORIZONTAL":
        this.wallBias = "HORIZONTAL";
        break;
      case "AESTHETIC":
        this.wallBias = "AESTHETIC";
        break;
      case "NONE":
        this.wallBias = "NONE";
        break;
    }
    console.log(this.wallBias);
  }


  //wallDirectionCalculator
  wallDirectionCalculator(width: number, height: number, bias: string): string{
    let wallThreshold = width + height;
    let output: string;
    let calculatedNumber: number;
    switch(bias){
      case "VERTICAL":
        calculatedNumber = this.getRandomInt(0,9);
        if(calculatedNumber < 9){
          output = "VERTICAL";
        } else {
          output = "HORIZONTAL";
        }
        break;
      case "HORIZONTAL":
        calculatedNumber = this.getRandomInt(0,9);
        if(calculatedNumber < 9){
          output = "HORIZONTAL";
        } else {
          output = "VERTICAL";
        }
        break;
      case "AESTHETIC":
        calculatedNumber = this.getRandomInt(0,wallThreshold);
        if((calculatedNumber < width) || width <= 2){
          output = "VERTICAL";
        } else {
          output = "HORIZONTAL";
        }
        break;
      case "NONE":
        calculatedNumber = this.getRandomInt(0,1);
        if(calculatedNumber === 0){
          output = "VERTICAL";
        } else {
          output = "HORIZONTAL";
        }
        break;
    }
    return output;
  }

  //recursive maze division
  //will need to incorporate a bias later. get a default working first.
  // need to think of this in terms of horizontal and vertical bounds. Might refactor it
  // to make it easier to read. note: they will be lower bounds.
  // then calculate the size of the partition.
  // might need to define lower and upperbounds for the partitions in the function call.
  async recursiveMazeDivision(lowerVerticalBound: number, upperVerticalBound: number, 
    lowerHorizontalBound: number, upperHorizontalBound: number, wallsDrawn: boolean){
    //do recursion? draw walls then insert the base case?
    //only want to execute craw walls once.
    //will use visited cells to animate to keep track of walls to draw.
    let width = upperHorizontalBound - lowerHorizontalBound;
    let height = upperVerticalBound - lowerVerticalBound;
    let wallThreshold: number = width + height;  //wall placement
    let twoHoles: boolean = false;
    console.log("width:" + width);
    console.log("height:" + height);
    console.log("wallThreshold:" + wallThreshold);
    if(!wallsDrawn) {
      await this.drawWalls(); //pass in true every recursion. pass in false on the first iteration
    }
 
    //draw a line (horizontal or vertical) at a random spot in the partition
    // need wall placement, wall direction and one spot to construct a hole.
    //decide on direction first. then on the placement.
    let wallDirection = this.wallDirectionCalculator(width,height,this.wallBias);
    console.log("wallDirection:"+ wallDirection);
    if(wallDirection === "VERTICAL"){ //vertical. everything is good up to here. will probably change how this works to account for bias in a future iteration.
      let wallPlacement = this.getRandomInt(lowerHorizontalBound + 1,upperHorizontalBound - 1); //random integer between bounds of the partition
      let wallHole = this.getRandomInt(lowerVerticalBound,upperVerticalBound); //random hole in the wall of partition, also must not be directly next to another parallel wall
      if(!this.isThisAWall([lowerVerticalBound - 1,wallPlacement]) || !this.isThisAWall([upperVerticalBound + 1,wallPlacement])){  //make sure wall doesn't block another opening
        //wallPlacement = this.getRandomInt(lowerHorizontalBound + 1,upperHorizontalBound - 1); //reroll if it does
        if(!this.isThisAWall([lowerVerticalBound - 1,wallPlacement])){
          wallHole = lowerVerticalBound;
        } else { 
          wallHole = upperVerticalBound;
        }
      }
      if(!this.isThisAWall([lowerVerticalBound - 1,wallPlacement]) && !this.isThisAWall([upperVerticalBound + 1,wallPlacement])){  //make sure wall doesn't block another opening
        twoHoles = true; //check for holes on both sides, this is true case
      }
      if(twoHoles){ //leave the gaps open
        for(let i = lowerVerticalBound + 1; i <= upperVerticalBound - 1; i++){ //for the vertical span of the partition
          if(!this.isStartNode([i,wallPlacement]) && !this.isEndNode([i,wallPlacement])){
            this.shade(i,wallPlacement,"#0B041C"); //draw the wall
            await this.sleep(2);
          }
        }
      } else { 
        for(let i = lowerVerticalBound; i <= upperVerticalBound; i++){ //for the vertical span of the partition
          if(i != wallHole){ //everything except the hole
            if(!this.isStartNode([i,wallPlacement]) && !this.isEndNode([i,wallPlacement])){
              this.shade(i,wallPlacement,"#0B041C"); //draw the wall
              await this.sleep(2);
            }
          }
        }
      }
      if(this.partitionQueue.length > 0){ //poll operation, remove entry at front of queue
        this.partitionQueue.splice(0,1);
      }
      //add both smaller partitions to the partition queue for later
      if((upperVerticalBound - lowerVerticalBound > 1) && (wallPlacement - 1) - lowerHorizontalBound > 1 && (width * height > 8 )){ //left partition
        this.partitionQueue.push([lowerVerticalBound,upperVerticalBound,lowerHorizontalBound,wallPlacement-1]);
      }
      if((upperVerticalBound - lowerVerticalBound > 1) && upperHorizontalBound - (wallPlacement + 1) > 1 && (width * height > 8 )){ //right partition
        this.partitionQueue.push([lowerVerticalBound,upperVerticalBound,wallPlacement + 1,upperHorizontalBound]);
      }
      //call function on one of the newly created partitions, the one at the front of the queue though
      console.log(this.partitionQueue);
      if(this.partitionQueue.length === 0){ //end of function, 1 of 2 cases (and case as well)
        console.log("Made it to the end!");
        return;
      } 

      await this.recursiveMazeDivision(this.partitionQueue[0][0],this.partitionQueue[0][1],
        this.partitionQueue[0][2],this.partitionQueue[0][3],true);

    } else { //horizontal
      let wallPlacement = this.getRandomInt(lowerVerticalBound + 1,upperVerticalBound - 1); //random integer between bounds of the partition
      let wallHole = this.getRandomInt(lowerHorizontalBound,upperHorizontalBound); //random hole in the wall of partition
      if(!this.isThisAWall([wallPlacement,lowerHorizontalBound - 1]) || !this.isThisAWall([wallPlacement,upperHorizontalBound + 1])){  //make sure wall doesn't block another opening
        //wallPlacement = this.getRandomInt(lowerHorizontalBound + 1,upperHorizontalBound - 1); //reroll if it does
        if(!this.isThisAWall([wallPlacement,lowerHorizontalBound - 1])){ //if a hole is found, unblock the end where it exists (each partition and only have 1 hole at a time)
          wallHole = lowerHorizontalBound;
        } else{
          wallHole = upperHorizontalBound;
        }
      }
      if(!this.isThisAWall([wallPlacement,lowerHorizontalBound - 1]) && !this.isThisAWall([wallPlacement,upperHorizontalBound + 1])){  //make sure wall doesn't block another opening
        twoHoles = true; //check for 2 holes
      }
      if(twoHoles){ //leave the gaps open
        for(let i = lowerHorizontalBound + 1; i <= upperHorizontalBound - 1; i++){ //for the vertical span of the partition
          if(!this.isStartNode([wallPlacement,i]) && !this.isEndNode([wallPlacement,i])){
            this.shade(wallPlacement,i,"#0B041C"); //draw the wall
            await this.sleep(2);
          }
        }
      } else { 
      for(let i = lowerHorizontalBound; i <= upperHorizontalBound; i++){ //for the vertical span of the partition
        if(i != wallHole){ //everything except the hole
          if(!this.isStartNode([wallPlacement,i]) && !this.isEndNode([wallPlacement,i])){
            this.shade(wallPlacement,i,"#0B041C"); //draw the wall
            await this.sleep(2);
            }
          }
        }
      }
      //add both of the smaller sections to the partition to the queue and call the function on the first one
      //remove the current entry from the partition queue
      //we may need to add the first section to the partition queue in the beginning though. Needs some thought.
      if(this.partitionQueue.length > 0){ //poll operation, remove entry at front of queue
        this.partitionQueue.splice(0,1);
      }
      //add both smaller partitions to the partition queue for later
      if((upperHorizontalBound - lowerHorizontalBound > 1) && (wallPlacement - 1) - lowerVerticalBound > 1 && (width * height > 8 )){ //lower partition
        this.partitionQueue.push([lowerVerticalBound,wallPlacement - 1,lowerHorizontalBound,upperHorizontalBound]);
      }
      if((upperHorizontalBound - lowerHorizontalBound > 1) && upperVerticalBound - (wallPlacement + 1) > 1 && (width * height > 8 )){ //upper partition
        this.partitionQueue.push([wallPlacement + 1,upperVerticalBound,lowerHorizontalBound,upperHorizontalBound]);
      }
      //call function on one of the newly created partitions, the one at the front of the queue though
      console.log(this.partitionQueue);
      if(this.partitionQueue.length === 0){ //end of function, 1 of 2 cases (and case as well)
        console.log("Made it to the end!");
        return;
      } 

      await this.recursiveMazeDivision(this.partitionQueue[0][0],this.partitionQueue[0][1],
        this.partitionQueue[0][2],this.partitionQueue[0][3],true);

    }

    
    //need to pass variable areas into the function? I'll think about that.
    //maybe we can pass in the coordinates detailing the edges of each partition
    //and keep going until the parameters reach a certain size?
    //do a double recursion: one with each of the 2 partitions (like in quicksort)

  }

  //pathfinding functions
  //need to make async to ensure proper animation
  async depthFirstSearch(currentNode: number[]){ //depth first search (will try recursive approach)
    console.log("Current NODE:");
    console.log(currentNode);
    if (this.isEndNode(currentNode)){ //base case when final path is found
      console.log("made it!");
      this.finalPath.splice(0,1); //remove start node from animation
      console.log(this.finalPath);
      await this.animateVisitedAndPath();
      this.finalPath = []; //clear for another iteration
      this.visitedCellsToAnimate = [];
      console.log(this.finalPath);
      console.log(this.visitedCellsToAnimate);
      return;
    }
    if(!this.isThisNodeVisited(currentNode)){ //check if visited
      this.visitedArray[currentNode[0]][currentNode[1]] = true; //mark if true
      if(!this.isStartNode(currentNode)){
        this.visitedCellsToAnimate.push(currentNode); //don't animate start node
      }
      this.finalPath.push(currentNode); //add current node to final path stack
        //add current node to visited animation
    }

    let neighbors = this.getNeighbors(currentNode);
    if(neighbors.length > 0){
      //traverse to next node, then start again (need a function to pick unvisited neighbor)
      // will probably go left, up, right down
      // and then have it pull the first entry from the list of neighbors
      this.depthFirstSearch(neighbors[0]); //traverse to next node in neighbors
    } else { 
      console.log(currentNode);
      this.finalPath.pop();
      //pop from final path and start again
      this.depthFirstSearch(this.finalPath[this.finalPath.length - 1]); //go back to last entry in stack
    }
    // check if end node get neighbors, pop from stack, go back and repeat if no neighbors, add neighbors to visited, traverse
  }

  //might not do recursion for this, actually.
  async breadthFirstSearch(currentNode: number[]){
    //initialized the queue in the web page
    let nodesToVisit: number[][] = [];
    //enqueue the start node
    nodesToVisit.push(currentNode);
    
    this.visitedArray[currentNode[0]][currentNode[1]] = true; //mark as visited if true

    while(!this.isEndNode(currentNode)){

      //ANIMATION FUNCTION
      if(!this.isStartNode(currentNode)){
        this.visitedCellsToAnimate.push(currentNode); //don't animate start node
      }
      //dequeue the current node
      nodesToVisit.splice(0,1);
      //add all unvisited neighbor nodes to a queue
      let neighbors = this.getNeighbors(currentNode);
      console.log(neighbors);
      //ITERATE through the neighbors, only pulls non-visited members
      for(let i = 0; i < neighbors.length; i++){
        //dont push duplicates
        nodesToVisit.push(neighbors[i]); //enqueue all unvisited neighbors
        this.visitedArray[neighbors[i][0]][neighbors[i][1]] = true; //mark everything in queue as visited
        this.prevArray[neighbors[i][0]][neighbors[i][1]] = currentNode; //set current node as parent of neighbors
      }
      currentNode = nodesToVisit[0]; //testing
     /* if(!this.isThisNodeVisited(currentNode)){ //check if visited
        this.visitedArray[currentNode[0]][currentNode[1]] = true; //mark as visited if true
        if(!this.isStartNode(currentNode)){
          //this.visitedCellsToAnimate.push(currentNode); //don't animate start node
          this.shade(currentNode[0],currentNode[1],"orange");
          await this.sleep(5);
        }
          //add current node to visited animation
      }
      //dequeue the current node
      nodesToVisit.splice(0,1);
      //add all unvisited neighbor nodes to a queue
      //let neighbors = this.getNeighbors(currentNode);
      for(let i = 0; i < neighbors.length; i++){
        if(!nodesToVisit.includes(neighbors[i])){ //dont push duplicates
          nodesToVisit.push(neighbors[i]); //enqueue all unvisited neighbors
        }
      }

      //will repeat with to the next node in the queue, repeat
      //reassign current node at the end of the loop to be the node at the highest priority in the queue
      currentNode = nodesToVisit[0];
      //will need to establish base case and traceback functions?*/
    } 
    console.log("Made it to the end!");
    console.log(this.prevArray);
    nodesToVisit = []; //empty the queue
    await this.animateCells(this.visitedCellsToAnimate,"orange");
    
      while(!this.isStartNode(currentNode)){ //keep going until start is reached
        if(!this.isEndNode(currentNode)){ //base case, do when end node is found
          //traceback path to start node
          //don't animate the end node
          this.finalPath.push(currentNode);
      }
      currentNode = this.prevArray[currentNode[0]][currentNode[1]];
    }
    await this.animateCells(this.finalPath,"yellow");
    this.visitedCellsToAnimate = []; //clear animation for the next run
    this.finalPath = [];
    //will probably write a while loop: while current node != end node, traverse
    //to the node at the highest priority position at the end of the loop
    //mark the current node as visited, add unvisited neighbors to the queue, traverse to the
    //node at the top of the queue
  }

  //might label this one as lazy. We'll see.
  async dijkstrasAlgo(currentNode: number[]){
    this.distanceArray[currentNode[0]][currentNode[1]] = 0; //distance from start node to start node
    //initialize the priority queue
    let priorityQueue: number[][] = [];
    //we will add the key value pair by feeding 3 values every time; the first 2 are the coordinates
    // and the last one is the distance. an ordered triple. perfect.
    priorityQueue.push([currentNode[0],currentNode[1],0]); //key-value triple
    //the poll method retrieves and removes the highest priority element from the queue.
    // in this case, the shortest distance, or the smallest value for the third digit of the triple.
    console.log(priorityQueue);
    let highestPriorityTriple: number[] = []; //ordered triple of node and distance from start
    let orderedTripleToPush: number[] = []; //represents a triple that gets pushed into queue
    let newDist: number; //temporarily computed new distance
    let tempDistance: number = Infinity;
    let tempIndex: number; //index to perform poll operation, ensures proper element leaves the queue
    let duplicateFound: boolean = false;  //check for a duplicate helper boolean
    while(!this.isEndNode([highestPriorityTriple[0],highestPriorityTriple[1]])){  //the end node
    //while(priorityQueue.length > 0){
      //pull and remove the entry in the queue with the shortest distance from the start node (poll operation)
      tempDistance = Infinity; //reset for new iteration of the loop
      for(let i = 0; i < priorityQueue.length; i++){ //poll operation
        if(priorityQueue[i][2] < tempDistance){ 
          highestPriorityTriple = priorityQueue[i]; //grab most promising (shortest distance) node from the queue
          tempDistance = priorityQueue[i][2]; //reset temp for next loop iteration
          tempIndex = i; //grab index
        }
      }
      console.log("current lowest distance:" + tempDistance);
      console.log("current triple: " + highestPriorityTriple); //testing
      priorityQueue.splice(tempIndex,1); //remove the polled entry from the queue
      console.log(priorityQueue);
      this.visitedArray[highestPriorityTriple[0]][highestPriorityTriple[1]] = true; //mark highest priority node as visited
      if(this.distanceArray[highestPriorityTriple[0]][highestPriorityTriple[1]] < highestPriorityTriple[2]){
        continue; // shorter distance for node already found, restart the loop
      }
      //add to visited animation here? and reset current node? nah, do that at the end. 
      //or....we can do it here. need to check for both start and end node though.
      //FIXME: visited cells to animate contains a lot of duplicates
      if(!this.isStartNode([highestPriorityTriple[0],highestPriorityTriple[1]]) && !this.isEndNode([highestPriorityTriple[0],highestPriorityTriple[1]])){
        this.visitedCellsToAnimate.push([highestPriorityTriple[0],highestPriorityTriple[1]]);
      }
      
      let neighbors = this.getNeighbors([highestPriorityTriple[0],highestPriorityTriple[1]]); //get all unvisited neighbors from highest priority node
      newDist = this.distanceArray[highestPriorityTriple[0]][highestPriorityTriple[1]] + 1; //compute new distance for priority queue
      for(let i = 0; i < neighbors.length; i++){ //iterate through unvisited neighbors
        console.log("new distance:" + newDist); //testing
        //check for the entry in the priority queue
        if(newDist < this.distanceArray[neighbors[i][0]][neighbors[i][1]]){ //if new distance is less than established distance
          this.prevArray[neighbors[i][0]][neighbors[i][1]] = [highestPriorityTriple[0],highestPriorityTriple[1]]; //testing, positioned here to eliminate duplicates
          this.distanceArray[neighbors[i][0]][neighbors[i][1]] = newDist; //replace current dist entry with smaller value
          //visits the most promising (closest) node for each iteration of the loop
          for(let j = 0; j < priorityQueue.length; j++){ // search priority queue for duplicates
            if(priorityQueue[j][0] === neighbors[i][0] && priorityQueue[j][1] == neighbors[i][1]){ //if node is already in priority queue
              //update optimal distance for current node, decrease key
              priorityQueue[j][2] = newDist;
              duplicateFound = true;
              break; //node found
            } 
          } //restart loop since a duplicate was found
          if(duplicateFound){
            duplicateFound = false;
            continue;
          }
          //set ordered triple to push to the queue if not there already
          orderedTripleToPush = [neighbors[i][0],neighbors[i][1],newDist];
          //make sure to push all unvisited neighbor triples into priority ueue
          console.log("pushing:");//testing
          console.log(orderedTripleToPush);
          priorityQueue.push(orderedTripleToPush);
          console.log("priority queue:"); //testing
          console.log(priorityQueue);
        }
      }
    }
    console.log("made it to the end!");
    currentNode = [highestPriorityTriple[0],highestPriorityTriple[1]];
    console.log("current NOde:" + currentNode);
    console.log(this.distanceArray);
    priorityQueue = []; //clear the priority queue
    //await this.animateCells(this.visitedCellsToAnimate,"orange"); 
    console.log(this.visitedCellsToAnimate); //testing
    console.log(this.prevArray);

    await this.animateCells(this.visitedCellsToAnimate,"orange");
    
    while(!this.isStartNode(currentNode)){ //keep going until start is reached
      if(!this.isEndNode(currentNode)){ //base case, do when end node is found
        //traceback path to start node
        //don't animate the end node
        this.finalPath.push(currentNode);
      }
      currentNode = this.prevArray[currentNode[0]][currentNode[1]];
    }
    await this.animateCells(this.finalPath,"yellow");
    this.visitedCellsToAnimate = []; //clear animation for the next run
    this.finalPath = [];
  }

  async greedyBestFirstSearch(currentNode: number[]){
    //needs a contingency in case it gets stuck (like in DFS)
    //traverses to the most promising node determined by a heuristic
    //combines DFS and Dijkstra's.
    
    //we are going to pull the most promising node from the priority queue each time.
    //similar to what we did with Dijkstra's.
    //I can probably still use the prev array to track the parent nodes and trace the path.
    let priorityQueue: number[][] = [];
    let highestPriorityTriple: number[] = [];
    let orderedTripleToPush: number[] = [];
    let nodeScore: number;
    let tempIndex: number;
    let duplicateFound: boolean = false;

    //need to pop from path and continue to next iteration if it gets stuck?
    priorityQueue.push([currentNode[0],currentNode[1],this.distanceRemainingHeuristic(currentNode)]); //key-value triple
    while(!this.isEndNode([highestPriorityTriple[0],highestPriorityTriple[1]])){
      //pull and remove the entry in the queue with the shortest distance from the start node (poll operation)
      nodeScore = Infinity; //reset for new iteration of the loop
      for(let i = 0; i < priorityQueue.length; i++){ //poll operation
        if(priorityQueue[i][2] < nodeScore){ 
          highestPriorityTriple = priorityQueue[i]; //grab most promising (shortest distance) node from the queue
          nodeScore = priorityQueue[i][2]; //reset temp for next loop iteration
          tempIndex = i; //grab index
        }
      }

      priorityQueue.splice(tempIndex,1); //remove the polled entry from the queue
      console.log(priorityQueue);
      this.visitedArray[highestPriorityTriple[0]][highestPriorityTriple[1]] = true; //mark highest priority node as visited
      if(!this.isStartNode([highestPriorityTriple[0],highestPriorityTriple[1]]) && !this.isEndNode([highestPriorityTriple[0],highestPriorityTriple[1]])){
        this.visitedCellsToAnimate.push([highestPriorityTriple[0],highestPriorityTriple[1]]); //animate visited nodes
      }
      let neighbors = this.getNeighbors([highestPriorityTriple[0],highestPriorityTriple[1]]); //get all unvisited neighbors from highest priority node
      //do similar to dijkstras, but score it differently
      
      for(let i = 0; i < neighbors.length; i++){ //iterate through unvisited neighbors
        //calculate heuristic distances to end from each neighbor
        //check for the entry in the priority queue
        this.prevArray[neighbors[i][0]][neighbors[i][1]] = [highestPriorityTriple[0],highestPriorityTriple[1]]; //place parent node in all unvisited neighbors, may change later though
        this.distanceArray[neighbors[i][0]][neighbors[i][1]] = this.distanceRemainingHeuristic(neighbors[i]); //calculate heuristic distance of neighbors
        //visits the most promising (closest) node for each iteration of the loop
        for(let j = 0; j < priorityQueue.length; j++){ // search priority queue for duplicates
          if(priorityQueue[j][0] === neighbors[i][0] && priorityQueue[j][1] == neighbors[i][1]){ //if node is already in priority queue
            duplicateFound = true;
            break; //node found
          } 
        } //restart loop since a duplicate was found
        if(duplicateFound){
          duplicateFound = false;
          continue;
        }
        //set ordered triple to push to the queue if not there already
        orderedTripleToPush = [neighbors[i][0],neighbors[i][1], this.distanceArray[neighbors[i][0]][neighbors[i][1]]];
        //make sure to push all unvisited neighbor triples into priority ueue
        console.log("pushing:");//testing
        console.log(orderedTripleToPush);
        priorityQueue.push(orderedTripleToPush);
        console.log("priority queue:"); //testing
        console.log(priorityQueue);
      
      }
    }
    console.log("Made it to the end!");
    currentNode = [highestPriorityTriple[0],highestPriorityTriple[1]];
    console.log("current NOde:" + currentNode);
    console.log(this.distanceArray);
    priorityQueue = []; //clear the priority queue
    //await this.animateCells(this.visitedCellsToAnimate,"orange"); 
    console.log(this.visitedCellsToAnimate); //testing
    console.log(this.prevArray);

    await this.animateCells(this.visitedCellsToAnimate,"orange");
    
    while(!this.isStartNode(currentNode)){ //keep going until start is reached
      if(!this.isEndNode(currentNode)){ //base case, do when end node is found
        //traceback path to start node
        //don't animate the end node
        this.finalPath.push(currentNode);
      }
      currentNode = this.prevArray[currentNode[0]][currentNode[1]];
    }
    await this.animateCells(this.finalPath,"yellow");
    this.visitedCellsToAnimate = []; //clear animation for the next run
    this.finalPath = [];
  }

  async AStar(currentNode: number[]){
    this.distanceArray[currentNode[0]][currentNode[1]] = 0; //distance from start node to start node
    //initialize the priority queue
    let priorityQueue: number[][] = [];
    //we will add the key value pair by feeding 3 values every time; the first 2 are the coordinates
    // and the last one is the distance. an ordered triple. perfect.
    priorityQueue.push([currentNode[0],currentNode[1],this.distanceRemainingHeuristic(currentNode)]); //key-value triple
    //the poll method retrieves and removes the highest priority element from the queue.
    // in this case, the shortest distance, or the smallest value for the third digit of the triple.
    //for AStar, we need to initialize the distance array values separate of the node score.
    this.distanceArray[currentNode[0]][currentNode[1]] = 0;
    console.log(priorityQueue);
    let highestPriorityTriple: number[] = []; //ordered triple of node and distance from start
    let orderedTripleToPush: number[] = []; //represents a triple that gets pushed into queue
    let newDist: number; //temporarily computed new distance
    let nodeScore: number = Infinity;
    let tempIndex: number; //index to perform poll operation, ensures proper element leaves the queue
    let duplicateFound: boolean = false;  //check for a duplicate helper boolean
    while(!this.isEndNode([highestPriorityTriple[0],highestPriorityTriple[1]])){  //the end node
    //while(priorityQueue.length > 0){
      //pull and remove the entry in the queue with the shortest distance from the start node (poll operation)
      nodeScore = Infinity; //reset for new iteration of the loop
      for(let i = 0; i < priorityQueue.length; i++){ //poll operation
        if(priorityQueue[i][2] < nodeScore){ 
          highestPriorityTriple = priorityQueue[i]; //grab most promising (lowest scoring) node from the queue
          nodeScore = priorityQueue[i][2]; //reset temp for next loop iteration
          tempIndex = i; //grab index
        }
      }
      console.log("current lowest score:" + nodeScore);
      console.log("current triple: " + highestPriorityTriple); //testing
      priorityQueue.splice(tempIndex,1); //remove the polled entry from the queue
      console.log(priorityQueue);
      this.visitedArray[highestPriorityTriple[0]][highestPriorityTriple[1]] = true; //mark highest priority node as visited
      if(this.distanceArray[highestPriorityTriple[0]][highestPriorityTriple[1]] + this.distanceRemainingHeuristic([highestPriorityTriple[0],highestPriorityTriple[1]]) > highestPriorityTriple[2]){
        continue; // lower score for node already found, restart the loop
      }
      //add to visited animation here? and reset current node? nah, do that at the end. 
      //or....we can do it here. need to check for both start and end node though.
      //FIXME: visited cells to animate contains a lot of duplicates
      if(!this.isStartNode([highestPriorityTriple[0],highestPriorityTriple[1]]) && !this.isEndNode([highestPriorityTriple[0],highestPriorityTriple[1]])){
        this.visitedCellsToAnimate.push([highestPriorityTriple[0],highestPriorityTriple[1]]);
      }
      
      let neighbors = this.getNeighbors([highestPriorityTriple[0],highestPriorityTriple[1]]); //get all unvisited neighbors from highest priority node
      newDist = this.distanceArray[highestPriorityTriple[0]][highestPriorityTriple[1]] + 1; //compute new distance for priority queue
      for(let i = 0; i < neighbors.length; i++){ //iterate through unvisited neighbors
        console.log("new distance:" + newDist); //testing
        //check for the entry in the priority queue
        this.prevArray[neighbors[i][0]][neighbors[i][1]] = [highestPriorityTriple[0],highestPriorityTriple[1]]; //testing, positioned here to eliminate duplicates
        this.distanceArray[neighbors[i][0]][neighbors[i][1]] = newDist; //add distance traveled entry for neighbors in distance array
        console.log(this.distanceArray[neighbors[i][0]][neighbors[i][1]]); //testing
        //visits the most promising (closest) node for each iteration of the loop
        for(let j = 0; j < priorityQueue.length; j++){ // search priority queue for duplicates
          if(priorityQueue[j][0] === neighbors[i][0] && priorityQueue[j][1] == neighbors[i][1]){ //if node is already in priority queue
            duplicateFound = true;
            if(newDist + this.distanceRemainingHeuristic(neighbors[i]) < highestPriorityTriple[2]){ //decrease key if new score is smaller
              priorityQueue[j][2] = newDist + this.distanceRemainingHeuristic(neighbors[i]);
            }
            break; //node found
          } 
        } //restart loop since a duplicate was found
        if(duplicateFound){
          duplicateFound = false;
          continue;
        }
        console.log("estimated distance remaining for" + neighbors[i] + "=" + this.distanceRemainingHeuristic(neighbors[i]));
        nodeScore = newDist + this.distanceRemainingHeuristic(neighbors[i]); //compute node score for all neighbors
        this.scoreArray[neighbors[i][0]][neighbors[i][1]] = nodeScore; //testing
        console.log("distance traveled:" + newDist)
        console.log("node score:" + nodeScore);
        //set ordered triple to push to the queue if not there already
        orderedTripleToPush = [neighbors[i][0],neighbors[i][1],nodeScore];
        //make sure to push all unvisited neighbor triples into priority ueue
        console.log("pushing:");//testing
        console.log(orderedTripleToPush);
        priorityQueue.push(orderedTripleToPush);
        console.log("priority queue:"); //testing
        console.log(priorityQueue);
      
      }
    }
    console.log("made it to the end!");
    currentNode = [highestPriorityTriple[0],highestPriorityTriple[1]];
    console.log(this.scoreArray); //testing
    console.log("current NOde:" + currentNode);
    console.log(this.distanceArray);
    priorityQueue = []; //clear the priority queue
    //await this.animateCells(this.visitedCellsToAnimate,"orange"); 
    console.log(this.visitedCellsToAnimate); //testing
    console.log(this.prevArray);

    await this.animateCells(this.visitedCellsToAnimate,"orange");
    
    while(!this.isStartNode(currentNode)){ //keep going until start is reached
      if(!this.isEndNode(currentNode)){ //base case, do when end node is found
        //traceback path to start node
        //don't animate the end node
        this.finalPath.push(currentNode);
      }
      currentNode = this.prevArray[currentNode[0]][currentNode[1]];
    }
    await this.animateCells(this.finalPath,"yellow");
    this.visitedCellsToAnimate = []; //clear animation for the next run
    this.finalPath = [];
  }

  // creating a min heap class won't work for this.
  // we need to index ordered triples.
  // we need to write custom functions to handle all the events.
  // neighbor pruning needs a direction. it will take a direction as an input.
  // we need a function to determine which direction to travel from the current node.
  // we need to determine the circumstances in which we find a jump point.
  // we need a special heapify function for this.
  // as soon as we hit a jump point, we need to move on to the forced neighbors?
  // and add them to the heap?
  // if we run into a dead end, we stop the recursion and mark a jump point at the current node.
  // we change directions from there.
  // check for dead ends before checking for forced neighbors?
  // if prune neighbors is recursive, then we need a base case for it.
  // we could use the traditional get neighbors function to navigate to the forced neighbor from
  // the current node. We need to mark the parent nodes during the traversal, so we need to make
  // use of the prev array to accomplish this.
  // we will score every node during the neighbor pruning and traversal.
  // if a visited node has a lower score on a revisit, we will reassign it.
  // might need to have an extra condition of marking nodes that share a coordinate 
  // with the end node as jump points. That way, we don't get stuck on a grid that has no walls.
  // however, we don't stop until we find a forced neighbor. we will add that node to the heap though.
  // we will score every node we encounter, including the pruned neighbors. we might also need
  // to mark the parents of all those nods as well in order to properly execute the heuristic calculation.
  // need a function to check if the current node is a dead end. (direction as an input)

  //prune neighbors: has 2 possible exit conditions.
  //either a dead end or a forced  neighbor.
  // it's recursive. will need a direction as an input and a switch-case for it.
  // we need to scan for the end node during neighbor pruning. 
  // we need to set the distance array during neighbor pruning. It will come in handy later.

  //finding a forced neighbor: only 1 of the 2 nodes diagonally in front of it is an obstacle.
  // if a forced neighbor is the end node, we will mark the node as a jump point.
  // prune neighbors needs a directional input.
  // if we find a forced neighbor: we need to mark the node in between the forced neighbor
  // and the current node as a parent and the current node as the parent of the one in between.
  // 

  // should we mark any nodes still in the heap in the end as vistited? maybe. No, we will not.

  // during the direction check, we need to know the parent node of the neighbor in question.
  // the relation of the parent node to the neighbor will give us that direction.
  // remember: you need to input a direction into prune neighbors as well as a current node.
  // need to assign distance array element before changing directions.
  // need to assign everything before changing directions.

  // if we're using a min heap, we may need a function to establish the relation between
  // the node itself and the direction we should travel.
  // a get parent function might be a good idea here. It would make everything a lot less messy.
  // Holy crap, this functional programming paradigm really encourages you to clean everything 
  // up.

  // if we encounter a node twice and recalculate it with a lower score the second time,
  // we will re-assign its parent and its score in the score array.
  // we will only score neighbor nodes of jump points.
  // we will only mark the parents of jump points.
  // we will need a traceback function for connecting the dots.
  // might need to write a helper function to check for a dead end.

  // we should probably determine the direction after we pull the new node from 
  // the min heap. use the parent node to figure it out.
  // then start pruning neighbors.
  // we will start each cycle by figuring out the direction. we will
  // end the loop when a jump point gets reached.

  // prune neighbors: reassign score and parent node at jump points if new score is lower.
  //this.prevArray[neighbors[i][0]][neighbors[i][1]] = currentNode; //assign parent node of available neighbors
  // ^ we will mark the parents of nodes during neighbor pruning. Might get weird with forced neighbors though.
  // no need to do this in the middle of the grid.
  // mark nodes as visited during prune neighbors? I think so.
  // might need to make an exception for a matching coordinate jump point.

  // we will determine which direction we go next by using a min heap.
  // we will use the same heuristic as we did in A*?
  // need to input the heap into the direction finder.
  // we will assign the distance during prune neighbors. changing direction will do only that.

  // I don't think I'm going to omit duplicates from this search. It doesn't make a lot of sense.
  async jumpPointSearch(currentNode: number[]){
    this.distanceArray[currentNode[0]][currentNode[1]] = 0; //distance from start node to start node
    let highestPriorityTriple: number[] = []; //ordered triple of node and distance from start, serves as a priority queue
    let priorityHeap: number[][] = [];
    //priorityHeap.push([currentNode[0],currentNode[1],this.distanceRemainingHeuristic(currentNode)]); //key-value triple
    // ^ not sure I'm going to use this.
    let orderedTripleToPush: number[] = []; //represents a triple that gets pushed into heap
    let newDist: number; //temporarily computed new distance
    let nodeScore: number = Infinity;
    let duplicateFound: boolean = false;  //check for a duplicate helper boolean
    // first, determine the direction to travel.

    console.log(this.determineJPDirection(currentNode,0,priorityHeap));
    /* FIXME: get this working without the neighbor pruning first. then we will
    add it in once we can successfully determine the direction every time from the beginning.
    while(!this.isEndNode([highestPriorityTriple[0],highestPriorityTriple[1]])){
      nodeScore = Infinity; //reset node score every iteration
      // determine direction to travel
      //recursively prune neighbors
    }
    */
  }

  determineJPDirection(currentNode: number[], currentDistanceTraveled: number, minHeap: number[][]): string { 
    let neighbors = this.getNeighbors(currentNode);
    console.log(neighbors); //testing
    let output: number[] = [];
    let xDistance: number;
    let yDistance: number;
    for(let i = 0; i < neighbors.length; i++){
      if(currentDistanceTraveled + 1 < this.distanceArray[neighbors[i][0]][neighbors[i][1]]){
        this.prevArray[neighbors[i][0]][neighbors[i][1]] = currentNode; // replace prev and distance array if new best is found
        this.distanceArray[neighbors[i][0]][neighbors[i][1]] = currentDistanceTraveled + 1; // incorrect
      }
      // if new score of neighbors is lower than currently established, replace it
      if((this.distanceArray[neighbors[i][0]][neighbors[i][1]] + this.distanceRemainingHeuristic(neighbors[i])) < this.scoreArray[neighbors[i][0]][neighbors[i][1]]){
        this.scoreArray[neighbors[i][0]][neighbors[i][1]] = (this.distanceArray[neighbors[i][0]][neighbors[i][1]] + this.distanceRemainingHeuristic(neighbors[i]));
      }
      minHeap.push([neighbors[i][0],neighbors[i][1],this.scoreArray[neighbors[i][0]][neighbors[i][1]]]);
      console.log([neighbors[i][0],neighbors[i][1],this.scoreArray[neighbors[i][0]][neighbors[i][1]]]);
    } //FIXME: node score of last node is coming out as zero? ^ yep, it is.
    console.log(minHeap); // testing
    this.JPSHeapify(minHeap); // heapify after all additions
    output = this.removeRootNodeJPSMinHeap(minHeap);
    console.log("OUTPUT DIRECTION NODE: " + output); //testing for proper polling
    console.log(this.distanceArray); // this and below statement for testing ()
    console.log(this.scoreArray);
    console.log(this.prevArray); //also testing
    // check lowest score node for relation to parent, then return a direction
    // the entry in the prev array is an array itself.
    xDistance = output[1] - this.prevArray[output[0]][output[1]][1];
    yDistance - output[0] - this.prevArray[output[0]][output[1]][0];

    if(xDistance === 1 && yDistance === 0){
      return "RIGHT";
    } else if (xDistance === -1 && yDistance === 0) {
      return "LEFT";
    } else if (xDistance === 0 && yDistance === 1) {
      return "UP";
    } else if (xDistance === 0 && yDistance === -1) {
      return "DOWN";
    } else {
      return "BROKEN";
    }
  }

  // add node and re-heapify the data structure (remember: these are triples, not nodes alone.)
  addnodeJPSMinHeap(triple: number[], array: number[][]){
    array.push(triple);
    this.JPSHeapify(array);
  }

  // remove root node and re-heapify the array (poll operation)
  removeRootNodeJPSMinHeap(array:number[][]): number[]{
    let output = array[0];
    array.splice(0,1);
    this.JPSHeapify(array);
    return output;
  }

  //heapify: reset the entire data structure into a heap.
  JPSHeapify(array:number[][]) {
    let size = array.length;
    // build heap (rearrange array)
    for (let i = Math.floor(size / 2 - 1); i >= 0; i--){
      this.heapify(array, size, i);
    }
  }

  // heapify function
  // to heapify a subtree rooted with node i which is an index in array[]
  heapify(array: number[][], size, i) {
    let min = i; // initialize min as root
    let left = (2 * i) + 1; // left child of parent node
    let right = (2 * i) + 2; // right child of parent node

    // if left child is smaller than root
    if (left < size && array[left][2] < array[min][2]){
      min = left;
    }  
    // if right child is smaller than min
    if (right < size && array[right][2] < array[min][2]){
      min = right;
    }
    // if min is not root
    if (min != i) {
      // swap i and min
      this.swap(array,i,min);

      // recursively heapify the affected sub-tree
      this.heapify(array, size, min)
    }
  } 

  //swap for heapify
  //swaps ordered triples in the min heap
  swap(items: number[][], leftIndex: number, rightIndex: number){
    let temp = items[leftIndex]; //perform the actual swap
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
  }
}
