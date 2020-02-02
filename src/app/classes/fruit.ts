export class Fruit {


    public id: number = 0;
    public basketId: number;
    public species: string;
    public color: string;
    //Must use the constructor keyword.
    constructor(){}
    
    public setId(id:number) {
        this.id = id;
    }
    public setBasketid(basketid:number) {
        this.basketId = basketid;
    }
    public setSpecies(species:string) {
        this.species = species;
    }
    public setColor(color:string) {
        this.color = color;
    }
}