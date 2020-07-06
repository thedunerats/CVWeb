import { Component, OnInit } from '@angular/core';
import { faGalacticSenate } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-pathfindingvisual',
  templateUrl: './pathfindingvisual.component.html',
  styleUrls: ['./pathfindingvisual.component.css']
})
export class PathfindingvisualComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.fillArray();
  }

  //initialize variables
  gridArray: string[][] = []; //either visited or not visited
  gridRow: string[] = []; //dummy array that serves as an auxiliary for the loading

  colorArray: string[][] = []; //color array for display purposes
  colorRow: string[] = [];

  //special nodes (ordered pairs)
  startNode: number[] = []; 
  endNode: number[] = [];
  tempVal: number[] = [];

  //dragging booleans
  isDragging: boolean = false;
  draggingStartNode: boolean = false;
  draggingEndNode: boolean = false;


  //UTIL Functions
  fillArray(){ //call to reset the array back to normal
    for (let i = 0; i < 50; i++){
      for(let j = 0; j < 100; j++){
        this.gridRow.push("empty"); //makes a whole array
        this.colorRow.push("white");
      }
      this.gridArray.push(this.gridRow); //pushes and clears entire grid row before next iteration
      this.gridRow = [];

      this.colorArray.push(this.colorRow); //pushes and clears color row
      this.colorRow = [];
    }
    console.log(this.gridArray);
    console.log(this.colorArray);
  }

  //NEED: a function for setting start and end nodes.
  //function to draw border walls.

  //sleep function
  sleep(milliseconds: number) { //custom synchronous delay method
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  //change the color of a square
  shade(xCoord: number, yCoord: number, color: string){
    this.colorArray[yCoord][xCoord] = color;
  }

  //will probably need an animation util that shades and delays.
  //need mousedown and mouseup functions and what happens to grid cells on both of them
  //set the starting node
  //will also need booleans to indicate that a stating / ending node was clicked instead of a wall.
  downClickFunction(xCoord: number, yCoord: number, boxColor: string){
    //will add different functionalities for different colored web elements.
    //try to drag the grey ones for now.
    //will change the dragging flag back to false on the mouseup. (mouseenter too)
    //for te start and end nodes, we nee to store them in a goobal temp value until they get changed.
    //and reset the temp value every time.
    this.isDragging = true;

    switch(boxColor){
      case "white":
        this.shade(xCoord, yCoord, "grey");
        break;
      case "grey":
        this.shade(xCoord, yCoord, "white");
        break;
    }
  }

  //happens only when the coursor enters the web element
  mouseEnterFunction(xCoord: number, yCoord: number, boxColor: string){
    if(this.isDragging){
      switch(boxColor){
        case "white":
          this.shade(xCoord,yCoord,"grey");
          break;
        case "grey":
          this.shade(xCoord,yCoord,"white");
          break;
      }
    }
  }

  mouseUpFunction(){
    this.isDragging = false;
  }
}
