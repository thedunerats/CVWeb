package com.devi3ntlab.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.devi3ntlab.model.Basket;

@Repository(value = "basketRepository")
public interface BasketRepository extends JpaRepository<Basket, Integer>  {

	// retrieve all baskets
	public List<Basket> findAll();
	
	// maybeI'll add the delete option. (currently in the service layer)
	
	// get number of baskets.
	@Query(value = "select count(*) from baskets", nativeQuery = true)
	public int getNumberOfBaskets();
	
	// apparently if the name of the id is different than the one
	//in the boilerplate code, it wont work. found that out 
	// when I had basketId as a field in the class.
	public Basket findById(int id); 
	
	// find number of fruits in basket
	@Query(value="select fruits_contained " + 
			"from baskets" + 
			"where basket_id = :basketid",
			nativeQuery=true)
	public int getNumberOfFruits(@Param("basketid") int id);
	
	// add + subtract fruits from the basket
	
	// addition
	//apparently, you need parentheses when updating like this in a native query in hibernate.
	//you also need @Transactional as well.
	@Transactional //testing
	@Modifying
	@Query(value="update baskets set fruits_contained " + 
			"= (fruits_contained + :newfruits)" + 
			"where (basket_id = :basketid)",
			nativeQuery=true)
	public void addFruitsToBasket(@Param("newfruits") int newfruits, @Param("basketid") int basketid);
	
	//subtraction
	@Transactional
	@Modifying
	@Query(value="update baskets set fruits_contained " + 
			"= (fruits_contained - :newfruits)" + 
			"where (basket_id = :basketid)",
			nativeQuery=true)
	public void subtractFruitsFromBasket(@Param("newfruits") int newfruits, @Param("basketid") int basketid);
} 
