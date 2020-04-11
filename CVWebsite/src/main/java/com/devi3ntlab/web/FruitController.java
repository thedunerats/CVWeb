package com.devi3ntlab.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devi3ntlab.model.Basket;
import com.devi3ntlab.model.Fruit;
import com.devi3ntlab.model.FruitRequestModel;
import com.devi3ntlab.service.BasketService;
import com.devi3ntlab.service.FruitService;

// need all 3 for spring mvc.

// we need to see how the ids are generated.
//are they generated in the db or are they done on the front end.
//ill look into that.
//apparently it's done as 0 on the front end, then done as a serial in the db?

// note. some of these will not work without a basket. make sure there is one
// for some of these methods.

// NOTE: we will add not null checks on the front end.
// It won't run unless there's something valid in all the fields.

@CrossOrigin
@RestController
@RequestMapping(value = "/fruit")
public class FruitController {
	
	private FruitService fruitService;
	private BasketService basketService; // let's see if i need it.
	
	// add spring beans
	// make sure they're autowired.
	
	@Autowired
	public void setFruitService(FruitService fruitService) {
		this.fruitService = fruitService;
	}
	
	@Autowired
	public void setBasketService(BasketService basketService) {
		this.basketService = basketService;
	}
	
	// Let's add the GET requests first.
	
	/*
	 * GET method
	 * [URL]/fruit/all
	 * Returns a list of all of the fruits.
	 */
	@GetMapping(value="/all", produces=MediaType.APPLICATION_JSON_VALUE)
	public List<Fruit> findAll() {
		return fruitService.findAll();
	}
	
	// by color and species? I think I'll add those. (finish controller then decide)
	// No, I don't think I need to. Just need to divide by basket.
	// I just don't need that functionality.
	
	/*
	 * GET Method
	 * [URL]/fruit/{id}
	 * Returns a fruit by a supplied fruit ID.
	 */
	@GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public Fruit getFruitbyID(@PathVariable int id) {
		return fruitService.findById(id);
	}
	
	// POST requests. maybe I'll do put / delete as well?
	// NOTE: we may need to have these methods produce a json as well.
	// lets look up more examples to see what we can find.
	
	/*
	 * Post method
	 * [URL]/fruit/bybasket
	 * Returns a list of all of the fruits in a certain basket.
	 * Use {} if you need to pass in a parameter.
	 */
	@PostMapping(value="/bybasket", consumes=MediaType.APPLICATION_JSON_VALUE, produces=MediaType.APPLICATION_JSON_VALUE)
	public List<List<Fruit>> findAllByBasketId(@RequestBody int[] BasketOrder) {
		ArrayList<List<Fruit>> output = new ArrayList<>(); //let's see if it works.
		
		for (int i = 0; i < BasketOrder.length; i++) {
			System.out.println("Basket Number: " + BasketOrder[i]);
			output.add(fruitService.findAllByBasketId(BasketOrder[i]));
		}
		
		return output;
	}

	
	/*
	 * POST method
	 * [URL]/fruit/insert
	 * Adds a fruit to a specific basket. Checks for basket existence.
	 * transaction does not happen if no basket or if it contains 10 fruits.
	 */
	@PostMapping(value="/insert",consumes=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> insertFruit(@RequestBody FruitRequestModel freq) {
		
		// make sure to send 0 every time in the request object for an id if youre doing creation.
		
		// FIXME: add a max capacity to the basket. Maybe 10 / 20? I don't know.
		// I think I'll do 10. we already pulled out a basket; just get # of fruits now.

		//get the basket
		int flag = freq.getBasketId(); // check if basket exists
		if (flag > 0) { // if exists
			// retrieve basket from the DB
			Basket b = basketService.findById(freq.getBasketId());
			Fruit f = new Fruit(b,  
					freq.getSpecies(), 
					freq.getColor());  // make the fruit object
			if (b.getFruitsContained() < 10) { //fruits in basket within capacity
				fruitService.save(f);
				// add a fruit to the basket
				basketService.addNewFruitsToBasket(1, flag);
				// return OK status
				// FIXME: may modify to return only the fruits in the basket that got changed.
				// we may remove the status later once it works. might interfere with UX. (user experience)
				// we may change this to return only the basket that got changed. not sure though.
				System.out.println("Made it!");
				return new ResponseEntity<String>(HttpStatus.CREATED);
			} else { // too many fruits. FIXME: is there a way to not do a transaction here?
				// might try making a custom exception down the line with this.
				// there is an example in SpringMVC -> web -> MovieController in your current workspace.
				//It throws the non existent movie exception.
				// let's do that later. don't need for minimum viable product.
				System.out.println("Too many fruits.");
				return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
			}
		} else {
			//error message (basket does NOT EXIST)
			// if you want to send a status code back to your front end, output a response body.
			// for reference, look at your mockiato project. it returns response entities.
			// FIXME: is there a way to not do a transaction here?
			// I guess you can use null if you need an escape.
			System.out.println("Baskest does not exist.");
			return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
		}
		
		
		// ill see if I can parse the timestamp on the front end, since I plan to handle all the
		// message printing and handling there.
		
		// recall: we want to return a message from each controller.
		// do we need a model in order to send it back as a json or something? YES.
		// can't take in an object mapped to a DB. you need a request object.
		
		// then move on to putting it in the db.
		
		// make sure you have enough error checking before moving on.
		
	
	}
	
	/*
	 * POST method
	 * [URL]/fruit/remove
	 * removes a fruit to a specific basket. Checks for basket existence.
	 * transaction does not happen if no basket or if it contains 10 fruits.
	 */
	@PostMapping(value="/remove",consumes = MediaType.APPLICATION_JSON_VALUE, produces=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> removeFruit(@RequestBody Fruit f) {
		
		// FIXME: add a max capacity to the basket. Maybe 10 / 20? I don't know.
		// I think I'll do 10. we already pulled out a basket; just get # of fruits now.
		// remember: post requests dont do anything to the url. parameters have to go in the request body.
		
		//get the basket from the supplied id
		System.out.println("Fruit: " + f);
		Basket b = f.getBasket(); //find basket from supplied fruit
		System.out.println("Basket: " + b); //testing

		int flag = b.getBasketId(); // check if basket exists
		//^FIXME: line above is throwing a null pointer exception when delete is attempted.
		if (flag > 0) { // if the basket exists
			if (b.getFruitsContained() > 0) { //fruits in basket within capacity
				fruitService.delete(f);
				// remove a fruit from the basket
				basketService.subtractFruitsFromBasket(1, flag);
				// return OK status
				// we may remove the status later once it works. might interfere with UX. (user experience)
				// might also change some of these to find by basket id.
				// output different list for each basket id? we would need to 
				// store that somewhere.
				return new ResponseEntity<>("Fruit removed.", HttpStatus.OK);
			} else { // too few fruits. We will replace these with custom exceptions later.
				return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
			}
		} else {
			return new ResponseEntity<>("Basket does not exist.", HttpStatus.BAD_REQUEST);
		}
			//error message
			// if you want to send a status code back to your front end, output a response body.
			// for reference, look at your mockiato project. it returns response entities.
	}
	
	public FruitController() {
		// TODO Auto-generated constructor stub
	}

}
