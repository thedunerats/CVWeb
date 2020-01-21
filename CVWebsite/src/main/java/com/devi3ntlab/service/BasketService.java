package com.devi3ntlab.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devi3ntlab.model.Basket;
import com.devi3ntlab.repository.BasketRepository;


@Service(value = "basketService")
public class BasketService {

	private BasketRepository basketRepository;
	
	
	public BasketService() {
		// TODO Auto-generated constructor stub
	}
	
	// get all baskets
	public List<Basket> findAll() {
		return basketRepository.findAll();
	}
	
	// find a basket
	public Basket findById(int id) {
		return basketRepository.findById(id);
	}
	
	// add a basket (default hibernate method)
	// adds a new instance.
	//you can look it up in data JPA for reference.
	public void save(Basket b) {
		basketRepository.save(b);
	}
	
	//total number of baskets.
	public int getNumberOfBaskets() {
		return basketRepository.getNumberOfBaskets();
	}
	
	// # of fruits in basket
	public int getNumberOfFruits(int id) {
		return basketRepository.getNumberOfFruits(id);
	}
	
	// adds fruits to a basket
	public void addNewFruitsToBasket(int newfruits, int basketid) {
		basketRepository.addFruitsToBasket(newfruits, basketid);
	}
	
	// take fruit from basket
	public void subtractFruitsFromBasket(int newfruits, int basketid) {
		basketRepository.subtractFruitsFromBasket(newfruits, basketid);
	}
	
	// delete a basket (boilerplate method)
	public void delete(Basket b) {
		basketRepository.delete(b);
	}
	
	// constructor
	public BasketService(BasketRepository basketRepository) {
		this.basketRepository = basketRepository;
	}
	
	@Autowired // setter injection
	public void setBasketRepository(BasketRepository basketRepository) {
		this.basketRepository = basketRepository;
	}
	

}
