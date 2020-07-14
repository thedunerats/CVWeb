import { Component, OnInit } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';


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
  }

  //initialize variables
  visitedArray: boolean[][] = []; //either visited or not visited
  visitedRow: boolean[] = []; //dummy array that serves as an auxiliary for the loading

  colorArray: string[][] = []; //color array for display purposes
  colorRow: string[] = [];

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

  //UTIL Functions
  fillArray(){ //call to reset the array back to normal
    for (let i = 0; i < 25; i++){
      for(let j = 0; j < 50; j++){
        this.visitedRow.push(false); //makes a whole array
        this.colorRow.push("white");
      }
      this.visitedArray.push(this.visitedRow); //pushes and clears entire grid row before next iteration
      this.visitedRow = [];

      this.colorArray.push(this.colorRow); //pushes and clears color row
      this.colorRow = [];
    }
    console.log(this.visitedArray);
    console.log(this.colorArray);
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
    for(let i in cellsToAnimate){
      this.shade(cellsToAnimate[i][0],cellsToAnimate[i][1],color);
      await this.sleep(10);
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
    for (let i = 0; i < 25; i++){
      for(let j = 0; j < 50; j++){
        if(this.isThisAWall([i,j]) || this.colorArray[i][j] !== "white"){ //will need to update to include visited nodes
          this.colorArray[i][j] = "white";
        }
        if(this.visitedArray[i][j] === true){
          this.visitedArray[i][j] = false;
        }
        //this.visitedRow.push(false); //makes a whole array
        //this.colorRow.push("white");
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
      console.log("Left Node:" + leftNode);
    }
    if(!this.isThisAWall(upNode) && !this.isThisNodeVisited(upNode)){
      neighbors.push(upNode);
      console.log("Up Node:" + upNode);
    }
    if(!this.isThisAWall(rightNode) && !this.isThisNodeVisited(rightNode)){
      neighbors.push(rightNode);
      console.log("Right Node:" + rightNode);
    }
    if(!this.isThisAWall(downNode) && !this.isThisNodeVisited(downNode)){
      neighbors.push(downNode);
      console.log("Down Node:" + downNode);
    }
    console.log(neighbors); //testing
    console.log(neighbors.length);
    //console.log(this.swapArrayValues(neighbors));
    return neighbors;
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
      //this.animateCells(this.visitedCellsToAnimate,"orange");
      //let trimmedFinalPath = [new Set(this.finalPath)];
      //console.log(trimmedFinalPath); let's see how this plays out.
      //this.animateCells(this.finalPath,"yellow");
      await this.animateVisitedAndPath();
      this.finalPath = [];
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
}
