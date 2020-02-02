// note: if you add the extension in the file name , it will give it to you automatically.
export class Basket {

    public basketId: number;
    public fruitsContained: number;

    //Must use the constructor keyword.
    constructor(){}
    
    public setFruitsContained(fruitsContained:number) {
        this.fruitsContained = fruitsContained;
    }

    public setId(basketId:number) {
        this.basketId = basketId;
    }
}