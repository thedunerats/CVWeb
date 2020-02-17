  
import { Fruit } from './../classes/fruit';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// These 2 are for a production environment. We may touch them later.
const API_URL = environment.apiUrl;

//need to use functions of one class in another. 
@Injectable({
    providedIn: 'root'
})


export class FruitService {

    constructor(private http: HttpClient) { } // you need this.

    //write your controller methods here.

    //getallfruits: gets all the fruits
    getAllFruits(): Observable<Fruit[]> {
        return this.http.get(API_URL + "/fruit/all") as Observable<Fruit[]>;
    }

    //get all by basket id
    getAllFruitsByBasketId(fruitOrder:number[]): Observable<Fruit[][]>{
        return this.http.post(API_URL + "/fruit/bybasket", fruitOrder ) as Observable<Fruit[][]>;
    }

    //insert a fruit. gets a message saying it's good.
    insertFruit(fruit:Fruit): Observable<String>{
        return this.http.post(API_URL + "/fruit/insert", fruit) as Observable<String>;
    }

    //removefruit: removes a fruit by id and updates the current list of fruits in real time
    // I might need the fruit ID for this. should be able to do it programatically.
    removeFruitByID(fruit:Fruit): Observable<Fruit[]>{
        return this.http.post(API_URL + "/fruit/remove",fruit) as Observable<Fruit[]>;
    }


}