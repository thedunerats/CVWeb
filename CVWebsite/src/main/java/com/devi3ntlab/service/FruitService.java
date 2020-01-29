package com.devi3ntlab.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devi3ntlab.model.Fruit;
import com.devi3ntlab.repository.FruitRepository;

@Service(value = "fruitService")
public class FruitService {

	public FruitService() {
		// TODO Auto-generated constructor stub
	}
	
	private FruitRepository fruitRepository;
	
	// add a fruit (default hibernate method)
	// adds a new instance.
	public void save(Fruit f) {
		fruitRepository.save(f);
	}
	
	// all the fruits
	public List<Fruit> findAll(){
		return fruitRepository.findAll();
	}
	
	// all the fruits in a basket. will probably add this later.
	public List<Fruit> findAllByBasketId(int id){
		return fruitRepository.findAllByBasketId(id);
	}
	
	//retrieve a specific fruit
	public Fruit findById(int id) {
		return fruitRepository.findById(id);
	}
	
	// remove all fruit with a certain species
	public void removeFruitBySpecies(String species) {
		fruitRepository.removeFruitBySpecies(species);
	}
	
	//remove all fruit with a certain color
	public void removeFruitByColor(String color) {
		fruitRepository.removeFruitByColor(color);
	}
	
	// remove all fruit in a particular basket
	public void removeFruitByBasket(int basket_id) {
		fruitRepository.removeFruitByBasket(basket_id);
	}
	
	//remove a specific fruit (by id or no?) let's test it.
	public void delete(Fruit f) {
		fruitRepository.delete(f);
	}

	// constructor
	public FruitService(FruitRepository fruitRepository) {
		this.fruitRepository = fruitRepository;
	}
	
	@Autowired // setter injection
	public void setFruitRepository(FruitRepository fruitRepository) {
		this.fruitRepository = fruitRepository;
	}


}
