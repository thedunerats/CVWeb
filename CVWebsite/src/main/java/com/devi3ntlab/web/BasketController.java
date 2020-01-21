package com.devi3ntlab.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devi3ntlab.model.Basket;
import com.devi3ntlab.model.BasketRequestModel;
import com.devi3ntlab.service.BasketService;

@CrossOrigin
@RestController
@RequestMapping(value = "/basket")
public class BasketController {

	public BasketController() {
		// TODO Auto-generated constructor stub
	}
	
	private BasketService basketService;
	
	@Autowired
	public void setBasketService(BasketService basketService) {
		this.basketService = basketService;
	}
	
	// both controllers finished. may do exception handling before doing front end but we really need to test this
	// before passing objects from a front end so we know that it does what we want it to do.
	// will probably push to gitlab once I know I have it working.
	// do a tutorial on git as well.
	
	// I think you need to make request model objects. I don't think you can pass
	// the requests directly into objects mapped to DB tables.
	// might also need to write a another constructor to instantiate the object
	// for the db table. look into that.
	// yup that's how Brett did it. delete once finished.
	
	
	//GET requests
	
	/*
	 * GET method
	 * [URL]/basket/getall
	 * 
	 * Returns all of the baskets.
	 */
	@GetMapping(value = "/getall", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Basket>> getAllBaskets(){
		return new ResponseEntity<>(basketService.findAll(),HttpStatus.OK);
	}
	
	
	//POST requests
	
	// make a new basket
	
	/*
	 * POST method
	 * [URL]/basket/insert
	 * 
	 * Creates a new basket.
	 */
	@PostMapping(value="/insert", produces=MediaType.APPLICATION_JSON_VALUE) // nothing gets passed in request.
	// but we need to send back a basket response to the DOM.
	// I think we need to do this for the other ones too. YUP. FIX IT NOW!
	// we want it to load in real time, so we should send one back.
	// lets fix that for the other things we want to send in real time.
	// lets also look at the front end to see how it gets handled there.
	public ResponseEntity<List<Basket>> insertBasket() {

		// control # of baskets, dont overload the DOM
		//make custom error messages?. sounds good to me.
		// first: get number of baskets. 
		// lets say no more than 3 for now.
		Basket b = new Basket(0); // new basket with no fruit in it
		//FIXME: currently failing on this SQL statement. says the entity does not exist.
		int numberOfBaskets = basketService.getNumberOfBaskets();
		System.out.println("made it past sql statement" + numberOfBaskets); //remove later.
		
		if (numberOfBaskets < 3) { // no more than 3 baskets
			basketService.save(b); // add new basket to db
			
			//do in real time: send the basket back to the front end.
			// we want to get all the baskets afterward to update in realtime.
			// kind of like Brett did in Who's in. so we need a list output.
			
			return new ResponseEntity<>(basketService.findAll(), HttpStatus.CREATED);
		} else { // too many baskets
			return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
		} // note: you can press enter in a string and it will get moved to the next line.

	}
	

	/*
	 * POST method
	 * [URL]/basket/remove
	 * 
	 * removes an existing basket by its ID.
	 */
	@PostMapping(value="/remove",consumes=MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Basket>> deleteBasket(@RequestBody BasketRequestModel breq) {
		// FIXME: doesn't do delete yet.
		// control # of baskets, dont overload the DOM
		//make custom error messages?. sounds good to me.
		// first: get number of baskets. 
		// lets say no more than 3 for now.
		Basket b = new Basket(breq.getId(), breq.getFruitsContained()); // currently existing basket
		int numberOfBaskets = basketService.getNumberOfBaskets();
		if (breq.getFruitsContained() == 0) { // must contain no fruit
			if (numberOfBaskets > 0) { // must be at least 1 basket
				basketService.delete(b); // remove basket from db
				return new ResponseEntity<>(basketService.findAll(), HttpStatus.CREATED); //good
			} else { // too few baskets
				return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
			} // note: you can press enter in a string and it will get moved to the next line.
		} else { // more than 1 fruit in the current basket. dont waste fruit. take them out.
			return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
		}
	}
	
	

}
