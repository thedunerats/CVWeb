  
import { Basket } from './../classes/basket';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// These 2 are for a production environment. We may touch them later.
const API_URL = environment.apiUrl;

//need to use functions of one class in another. 
@Injectable({
    providedIn: 'root'
})


export class BasketService {

    constructor(private http: HttpClient) { } // you need this.

    //write your controller methods here.

    //get all baskets
    getAllBaskets(): Observable<Basket[]> {
        return this.http.get(API_URL + "/basket/getall") as Observable<Basket[]>;
    }

    //create basket
    // this needs to be a get because nothing gets sent through the request body.
    insertBasket(): Observable<Basket[]>{
        return this.http.get(API_URL + "/basket/insert") as Observable<Basket[]>;
    }

    //delete basket
    deleteBasket(basket:Basket): Observable<Basket[]>{
        return this.http.post(API_URL + "/basket/remove", basket) as Observable<Basket[]>;
    }
}