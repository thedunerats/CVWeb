package com.devi3ntlab.web;

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
	
	/*
	 * GET method
	 * [URL]/fruit/bybasket/{id}
	 * Returns a list of all of the fruits in a certain basket.
	 * Use {} if you need to pass in a parameter.
	 */
	@GetMapping(value="/bybasket/{id}", produces=MediaType.APPLICATION_JSON_VALUE)
	public List<Fruit> findAllByBasketId(@PathVariable int id) {
		return fruitService.findAllByBasketId(id);
	}
	// by color and species? I think I'll add those. (finish controller then decide)
	// No, I don't think I need to. Just need to divide by basket.
	// I just don't need that functionality.
	
	// POST requests. maybe I'll do put / delete as well?
	// NOTE: we may need to have these methods produce a json as well.
	// lets look up more examples to see what we can find.
	
	/*
	 * POST method
	 * [URL]/fruit/insert
	 * Adds a fruit to a specific basket. Checks for basket existence.
	 * transaction does not happen if no basket or if it contains 10 fruits.
	 */
	@PostMapping(value="/insert",consumes=MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Fruit>> insertFruit(@RequestBody FruitRequestModel freq) {
		
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
				
				// we may remove the status later once it works. might interfere with UX. (user experience)
				return new ResponseEntity<>(fruitService.findAll(), HttpStatus.CREATED);
			} else { // too many fruits. FIXME: is there a way to not do a transaction here?
				// might try making a custom exception down the line with this.
				// there is an example in SpringMVC -> web -> MovieController in your current workspace.
				//It throws the non existent movie exception.
				// let's do that later. don't need for minimum viable product.
				return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
			}
		} else {
			//error message
			// if you want to send a status code back to your front end, output a response body.
			// for reference, look at your mockiato project. it returns response entities.
			// FIXME: is there a way to not do a transaction here?
			// I guess you can use null if you need an escape.
			return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
		}
		
		
		// ill see if I can parse the timestamp on the front end, since I plan to handle all the
		// message printing and handling there.
		
		// recall: we want to return a message from each controller.
		// do we need a model in order to send it back as a json or something? YES.
		// can't take in an object mapped to a DB. you need a request object.
		
		// then move on to putting it in the db.
		
		// make sure you have enough error checking before moving on.
		
		
		/*
		Timestamp start = ereq.convertStringToTimestamp(ereq.getEventStartDate());
		Timestamp end = ereq.convertStringToTimestamp(ereq.getEventEndDate());
		User u = userService.findById(ereq.getEventOwner());
		Event e = new Event(
				ereq.getEventName(),
				ereq.getEventDescription(),
				start,	
				end,
				ereq.getLatitude(),
				ereq.getLongitude(),
				u);
		eventService.save(e);
		e = eventService.findByEventname(e.getEventname());
		return e;
		*/
	}
	
	/*
	 * POST method
	 * [URL]/fruit/remove
	 * removes a fruit to a specific basket. Checks for basket existence.
	 * transaction does not happen if no basket or if it contains 10 fruits.
	 */
	@PostMapping(value="/remove",consumes=MediaType.APPLICATION_JSON_VALUE, produces=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Fruit>> removeFruit(@RequestBody FruitRequestModel freq) {
		
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
			if (b.getFruitsContained() > 0) { //fruits in basket within capacity
				fruitService.delete(f);
				// remove a fruit from the basket
				basketService.subtractFruitsFromBasket(1, flag);
				// return OK status
				// we may remove the status later once it works. might interfere with UX. (user experience)
				return new ResponseEntity<>(fruitService.findAll(), HttpStatus.OK);
			} else { // too few fruits. We will replace these with custom exceptions later.
				return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
			}
		} else {
			//error message
			// if you want to send a status code back to your front end, output a response body.
			// for reference, look at your mockiato project. it returns response entities.
			return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
		}
	}
	
	public FruitController() {
		// TODO Auto-generated constructor stub
	}

}
